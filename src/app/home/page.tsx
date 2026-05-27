"use client";

import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BarCard } from "@/components/bars/BarCard";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { BARS } from "@/data/bars";
import { LogOut, Sparkles } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome") === "1";
  const { user, logout } = useAuth();

  const universityBars = BARS.filter((b) => b.campus);
  const cityBars = BARS.filter((b) => !b.campus);

  return (
    <AppShell>
      <div className="px-4 pt-4">
        {welcome && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Email confermata!</p>
              <p className="mt-0.5">Ordina e salta la fila — prova anche l&apos;assistente AI.</p>
            </div>
          </div>
        )}

        <div className="mb-5 flex items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Dove ordini oggi?
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {user?.email
                ? `Ciao, ${user.email.split("@")[0]}`
                : "Bar a Milano"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => logout().then(() => (window.location.href = "/"))}
            className="flex items-center gap-1 rounded-xl px-2 py-1 text-xs text-stone-500 hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" />
            Esci
          </button>
        </div>

        <section className="mb-6">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">
            I più rapidi
          </h2>
          <div className="space-y-4">
            {universityBars.map((bar) => (
              <BarCard key={bar.id} bar={bar} />
            ))}
          </div>
        </section>

        <section className="pb-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-stone-400">
            Bar in città
          </h2>
          <div className="space-y-4">
            {cityBars.map((bar) => (
              <BarCard key={bar.id} bar={bar} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default function HomePage() {
  return (
    <RequireAuth>
      <HomeContent />
    </RequireAuth>
  );
}
