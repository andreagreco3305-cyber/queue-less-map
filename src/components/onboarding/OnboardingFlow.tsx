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
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-white p-10 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-100 border-t-black mb-6"></div>
        <h2 className="crazy-title text-2xl mb-2">Caricamento</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">QueueLess Engine</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white shadow-[0_0_100px_rgba(0,0,0,0.05)] border-x border-stone-100">
      {/* Header con Logo Sempre Visibile */}
      <header className="flex items-center justify-center border-b-2 border-black py-8 bg-white sticky top-0 z-10">
        <Logo href={undefined} size="lg" showText={true} />
      </header>

      <div className="flex flex-1 flex-col px-10 pt-16">
        {/* Slogan Statico e d'Impatto */}
        <section className="mb-16">
          <h1 className="text-[54px] font-[1000] leading-[0.9] tracking-[-0.05em] text-black uppercase italic">
            ORDINA.<br />
            SALTA.<br />
            <span className="text-stone-300">VIVI.</span>
          </h1>
          <p className="mt-8 text-xl font-bold leading-tight text-black/40 uppercase tracking-tight">
            Il predatore non aspetta in fila. <br />
            Prendi il tuo caffè e vai.
          </p>
        </section>

        {/* Form Immediato */}
        <section className="mt-auto pb-12">
          <SignUpPanel
            errorMessage={error}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
          />
        </section>
      </div>

      <footer className="px-10 pb-8 pt-4 border-t border-stone-50">
        <p className="text-center text-[9px] font-black tracking-[0.4em] text-stone-200 uppercase">
          QueueLess Ultra Engine v2.0
        </p>
      </footer>
    </main>
  );
}
