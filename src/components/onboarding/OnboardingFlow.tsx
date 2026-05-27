"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { OnboardingCarousel } from "./OnboardingCarousel";
import { SignUpPanel } from "./SignUpPanel";

export function OnboardingFlow() {
  const router = useRouter();
  const { status, signUp, signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.replace("/home");
  }, [status, router]);

  const handleSignUp = async (email: string, password: string) => {
    setError(null);
    const result = await signUp(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.push(
      `/auth/check-email?email=${encodeURIComponent(email)}&pending=1`,
    );
  };

  const handleSignIn = async (email: string, password: string) => {
    setError(null);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      if (result.error.includes("confermata")) {
        router.push(
          `/auth/check-email?email=${encodeURIComponent(email)}&pending=1`,
        );
      }
      return;
    }
    router.replace("/home");
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-500">Caricamento…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-stone-50">
      <header className="flex flex-col items-center px-6 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <Logo href={undefined} size="xl" markOnly />
      </header>

      <OnboardingCarousel />

      <footer className="shrink-0 border-t border-stone-100 bg-stone-50/90 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <SignUpPanel
          errorMessage={error}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
        />
        <p className="mt-3 text-center text-[10px] text-stone-400">
          Serve Supabase + OpenAI in .env.local — vedi README
        </p>
      </footer>
    </main>
  );
}
