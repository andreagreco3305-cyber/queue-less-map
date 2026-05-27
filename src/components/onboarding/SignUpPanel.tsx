"use client";

import { ArrowRight, Mail, Loader2, Lock, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

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
    <div className="w-full space-y-3">
      <div className="flex rounded-2xl bg-stone-100 p-1">
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-stone-500"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Registrati
        </button>
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-stone-500"
          }`}
        >
          <LogIn className="h-4 w-4" />
          Accedi
        </button>
      </div>

      {errorMessage && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-700">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="email"
            autoComplete="email"
            placeholder="nome@email.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            placeholder="Password (min. 6 caratteri)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !email.trim() || password.length < 6}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {mode === "signup" ? "Crea account" : "Accedi"}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[11px] leading-relaxed text-stone-400">
        {mode === "signup"
          ? "Ti invieremo un'email di conferma prima di entrare."
          : "Password dimenticata? Reimpostala dalla dashboard Supabase."}
      </p>
    </div>
  );
}
