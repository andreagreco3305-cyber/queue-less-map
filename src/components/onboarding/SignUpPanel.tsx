"use client";

import { ArrowRight, Mail, Loader2, Lock } from "lucide-react";
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
    <div className="w-full space-y-6">
      {errorMessage && (
        <p className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="group relative">
          <Mail className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-black" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field pl-12"
          />
        </div>
        <div className="group relative">
          <Lock className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-black" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field pl-12"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !email.trim() || password.length < 6}
          className="btn-primary mt-4"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              {mode === "signup" ? "Inizia ora" : "Accedi"}
              <ArrowRight className="h-5 w-5" />
            </span>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          className="text-sm font-semibold text-stone-900 transition-opacity hover:opacity-70"
        >
          {mode === "signup"
            ? "Hai già un account? Accedi"
            : "Non hai un account? Registrati"}
        </button>
      </div>
    </div>
  );
}
