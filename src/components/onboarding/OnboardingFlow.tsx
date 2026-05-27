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
      <main className="flex min-h-[100dvh] items-center justify-center bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-black"></div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white">
      <header className="flex px-10 pt-[max(2rem,env(safe-area-inset-top))]">
        <Logo href={undefined} size="md" markOnly />
      </header>

      <OnboardingCarousel />

      <footer className="shrink-0 px-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <SignUpPanel
          errorMessage={error}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
        />
        <p className="mt-8 text-center text-[11px] font-medium tracking-wide text-stone-400 uppercase">
          Efficienza senza compromessi
        </p>
      </footer>
    </main>
  );
}
