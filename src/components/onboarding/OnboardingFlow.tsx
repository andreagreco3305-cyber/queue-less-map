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
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-black p-10 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/5 border-t-white mb-6"></div>
        <h2 className="crazy-title text-2xl mb-2 text-white glow-text">QueueLess Engine</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Igniting Turbo Mode</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-black text-white selection:bg-white/20 overflow-hidden relative">
      {/* Sfondo Decorativo */}
      <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[40%] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-20%] w-[70%] h-[30%] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-center py-10 relative z-10">
        <div className="p-3 rounded-[1.5rem] bg-white/5 border border-white/10 backdrop-blur-md">
          <Logo href={undefined} size="lg" showText={true} />
        </div>
      </header>

      <div className="flex flex-1 flex-col px-10 pt-10 relative z-10">
        {/* Slogan Crazy */}
        <section className="mb-16">
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Next Gen Ordering</p>
          </div>
          <h1 className="text-[64px] crazy-title leading-[0.85] glow-text">
            ORDINA.<br />
            SALTA.<br />
            <span className="text-white/20">VIVI.</span>
          </h1>
          <p className="mt-8 text-lg font-bold leading-tight text-white/40 uppercase tracking-tight italic border-l-2 border-white/10 pl-4">
            Il predatore non aspetta mai. <br />
            Sbrana la coda, prendi il caffè.
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

      <footer className="px-10 pb-8 pt-4 relative z-10">
        <p className="text-center text-[8px] font-black tracking-[0.5em] text-white/10 uppercase">
          QLX-SERIES // ULTRA PERFORMANCE
        </p>
      </footer>
    </main>
  );
}
