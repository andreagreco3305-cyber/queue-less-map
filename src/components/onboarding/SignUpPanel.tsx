"use client";

import { ArrowRight, Mail, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "signup" | "login";

type SignUpPanelProps = {
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
  errorMessage?: string | null;
};

export function SignUpPanel({
  onSignUp,
  onSignIn,
  errorMessage,
}: SignUpPanelProps) {
  const { signInAsDemo } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) return;

    setIsSubmitting(true);
    try {
      if (mode === "signup") await onSignUp(trimmedEmail, password);
      else await onSignIn(trimmedEmail, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {errorMessage && (
        <div className="rounded-[1.5rem] bg-red-50 p-5 text-center text-xs font-black uppercase tracking-tight text-red-600 border border-red-100">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-300" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="crazy-input pl-14"
          />
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-300" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="crazy-input pl-14"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !email.trim() || password.length < 6}
          className="crazy-button"
        >
          {isSubmitting ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <div className="flex w-full items-center justify-between px-6">
              <span>{mode === "signup" ? "REGISTRATI" : "ACCEDI"}</span>
              <ArrowRight className="h-6 w-6 stroke-[3]" />
            </div>
          )}
        </button>
      </form>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="bg-white px-4 text-stone-300">Fast Pass</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsSubmitting(true);
          setTimeout(() => {
            signInAsDemo();
          }, 400);
        }}
        className="flex h-20 w-full items-center justify-between rounded-[1.5rem] bg-stone-50 border-2 border-transparent px-8 transition-all active:scale-[0.98] hover:bg-stone-100"
      >
        <span className="text-sm font-black uppercase tracking-widest text-black">ESPLORA DEMO</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-lg">
          <ArrowRight className="h-5 w-5 stroke-[3]" />
        </div>
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-black transition-colors"
        >
          {mode === "signup"
            ? "[ HAI GIÀ UN ACCOUNT? ACCEDI ]"
            : "[ NUOVO UTENTE? REGISTRATI ]"}
        </button>
      </div>
    </div>
  );
}
