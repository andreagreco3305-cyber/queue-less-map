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
        <p className="rounded-2xl bg-red-50 p-4 text-center text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* ... existing inputs ... */}
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

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-stone-400 font-bold">Oppure</span>
        </div>
      </div>

      <button
        type="button"
        onClick={signInAsDemo}
        className="flex h-14 w-full items-center justify-center rounded-2xl border-2 border-stone-900 bg-white text-base font-bold text-black transition-all active:scale-[0.98] hover:bg-stone-50"
      >
        Esplora Demo
      </button>

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
