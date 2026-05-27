"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
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
      {/* Header con Logo Sempre Visibile */}
      <header className="flex items-center justify-center border-b border-stone-100 py-6">
        <Logo href={undefined} size="md" showText={true} />
      </header>

      <div className="flex flex-1 flex-col px-10 pt-12">
        {/* Slogan Statico e d'Impatto */}
        <section className="mb-12">
          <h1 className="text-5xl font-black leading-[1] tracking-tighter text-black">
            ORDINA.<br />
            SALTA LA FILA.<br />
            <span className="text-stone-300 text-4xl">RIPRENDITI IL TEMPO.</span>
          </h1>
          <p className="mt-6 text-lg font-medium leading-relaxed text-stone-500">
            QueueLess è l&apos;app per chi non vuole aspettare. Seleziona il bar, ordina in un tap e ritira senza attese.
          </p>
        </section>

        {/* Form Immediato */}
        <section className="mt-auto pb-10">
          <SignUpPanel
            errorMessage={error}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
          />
        </section>
      </div>

      <footer className="px-10 pb-6 pt-4">
        <p className="text-center text-[10px] font-bold tracking-[0.2em] text-stone-300 uppercase">
          Static & High Performance
        </p>
      </footer>
    </main>
  );
}
