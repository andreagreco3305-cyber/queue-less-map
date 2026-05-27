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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-100 border-t-black mb-8"></div>
        <div className="p-3 rounded-2xl border border-stone-100 bg-stone-50 animate-pulse">
          <Logo href={undefined} size="sm" markOnly />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white text-black selection:bg-black selection:text-white">
      {/* Header Premium */}
      <header className="flex items-center justify-between px-10 py-8 border-b border-stone-50">
        <Logo href={undefined} size="md" showText={true} />
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </header>

      <div className="flex flex-1 flex-col px-10 pt-28">
        {/* Slogan Elite Ripristinato */}
        <section className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full mb-6">
            <span className="h-1 w-1 rounded-full bg-black" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black">Precision Ordering</p>
          </div>
          <h1 className="text-[58px] crazy-title text-black leading-[0.85] -ml-1">
            ORDINA.<br />
            SALTA.<br />
            <span className="text-stone-200">RIPRENDITI<br />IL TEMPO.</span>
          </h1>
        </section>

        {/* Form Integrato */}
        <section className="mt-auto pb-10">
          <SignUpPanel
            errorMessage={error}
            onSignUp={handleSignUp}
            onSignIn={handleSignIn}
          />
        </section>
      </div>

      <footer className="px-10 pb-10 pt-4 flex items-center justify-between border-t border-stone-50">
        <p className="text-[8px] font-black tracking-[0.3em] text-stone-300 uppercase">
          Elite Service v3.0
        </p>
        <p className="text-[8px] font-black tracking-[0.3em] text-stone-200 uppercase">
          Milano IT
        </p>
      </footer>
    </main>
  );
}
