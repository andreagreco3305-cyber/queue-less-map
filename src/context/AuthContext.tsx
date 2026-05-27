"use client";

import { createClient } from "@/lib/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AuthUser = {
  id: string;
  email: string;
  emailConfirmed: boolean;
};

type AuthStatus = "loading" | "authenticated" | "guest" | "pending_verification";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  session: Session | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInAsDemo: () => void;
  resendConfirmation: (email: string) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(user: User | null): AuthUser | null {
  if (!user?.email) return null;
  return {
    id: user.id,
    email: user.email,
    emailConfirmed: !!user.email_confirmed_at,
  };
}

function deriveStatus(session: Session | null): AuthStatus {
  if (!session?.user) return "guest";
  if (!session.user.email_confirmed_at) return "pending_verification";
  return "authenticated";
}

function getSupabaseClient() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [configError, setConfigError] = useState<string | null>(null);
  const supabase = useMemo(() => getSupabaseClient(), []);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setConfigError(
        "Configura .env.local: URL + PUBLISHABLE_KEY (o ANON_KEY).",
      );
      setStatus("guest");
      return;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      setSession(null);
      setStatus("guest");
      return;
    }
    setSession(data.session);
    setStatus(deriveStatus(data.session));
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      setConfigError(
        "Configura .env.local: URL + PUBLISHABLE_KEY (o ANON_KEY).",
      );
      setStatus("guest");
      return;
    }
    refresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setStatus(deriveStatus(nextSession));
    });

    return () => subscription.unsubscribe();
  }, [supabase, refresh]);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setStatus("guest");
  }, [supabase]);

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: configError ?? "Supabase non configurato." };
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) return { error: error.message };
      return {};
    },
    [supabase, configError],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!supabase) return { error: configError ?? "Supabase non configurato." };
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          return {
            error:
              "Email non ancora confermata. Controlla la posta o richiedi un nuovo link.",
          };
        }
        return { error: error.message };
      }
      return {};
    },
    [supabase],
  );

  const signInAsDemo = useCallback(() => {
    const demoUser: AuthUser = {
      id: "demo-id",
      email: "demo@queueless.it",
      emailConfirmed: true,
    };
    // Mock session object
    const demoSession = {
      access_token: "demo-token",
      refresh_token: "demo-refresh",
      expires_in: 3600,
      token_type: "bearer",
      user: { id: "demo-id", email: "demo@queueless.it", email_confirmed_at: new Date().toISOString() } as any,
    };
    setSession(demoSession);
    setStatus("authenticated");
  }, []);

  const resendConfirmation = useCallback(
    async (email: string) => {
      if (!supabase) return { error: configError ?? "Supabase non configurato." };
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (error) return { error: error.message };
      return {};
    },
    [supabase],
  );

  const user = mapUser(session?.user ?? null);

  const value = useMemo(
    () => ({
      user,
      status,
      session,
      refresh,
      logout,
      signUp,
      signIn,
      signInAsDemo,
      resendConfirmation,
    }),
    [user, status, session, refresh, logout, signUp, signIn, signInAsDemo, resendConfirmation],
  );

  return (
    <AuthContext.Provider value={value}>
      {configError && (
        <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
          {configError}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
