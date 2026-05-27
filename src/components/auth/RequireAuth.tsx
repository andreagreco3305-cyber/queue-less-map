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

  if (status === "loading" || status === "guest" || status === "pending_verification") {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-500">Caricamento…</p>
      </main>
    );
  }

  return <>{children}</>;
}
