"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") router.replace("/");
    if (status === "pending_verification" && user?.email) {
      router.replace(
        `/auth/check-email?email=${encodeURIComponent(user.email)}&pending=1`,
      );
    }
  }, [status, user, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-white p-10 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone-100 border-t-black mb-6"></div>
        <h2 className="crazy-title text-2xl mb-2">Verifica Territorio</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">QueueLess Engine is Warming Up</p>
      </main>
    );
  }

  if (status === "guest" || status === "pending_verification") {
    return null; // Il redirect è gestito da useEffect
  }

  return <>{children}</>;
}
