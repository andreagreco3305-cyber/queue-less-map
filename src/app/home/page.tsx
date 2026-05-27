"use client";

import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BarCard } from "@/components/bars/BarCard";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { BARS } from "@/data/bars";
import { LogOut, Sparkles, MapPin } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome") === "1";
  const { user, logout } = useAuth();

  return (
    <AppShell>
      <div className="px-6 pt-6">
        {welcome && (
          <div className="mb-6 flex items-start gap-3 rounded-[2rem] border border-black bg-black p-5 text-sm text-white shadow-2xl shadow-black/20 animate-in fade-in slide-in-from-top-4">
            <Sparkles className="h-5 w-5 shrink-0 text-stone-400" />
            <div>
              <p className="font-black uppercase tracking-tight">Accesso Completato</p>
              <p className="mt-0.5 text-stone-400 font-medium tracking-tight leading-snug">Il tuo tempo è prezioso. Ordina ora e salta la fila.</p>
            </div>
          </div>
        )}

        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-stone-400">
              <MapPin className="h-3 w-3" strokeWidth={3} />
              Milano, IT
            </div>
            <h1 className="text-4xl font-black leading-none tracking-tighter text-black uppercase">
              SCELTI<br />PER TE
            </h1>
          </div>
          
          <button
            type="button"
            onClick={() => logout().then(() => (window.location.href = "/"))}
            className="flex h-10 items-center gap-2 rounded-full border border-stone-100 px-4 text-[11px] font-black uppercase tracking-widest text-black transition-all hover:bg-stone-50 active:scale-95"
          >
            Esci
          </button>
        </div>

        <div className="space-y-6 pb-12">
          {BARS.map((bar) => (
            <BarCard key={bar.id} bar={bar} />
          ))}
        </div>

        <footer className="pb-8 pt-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-200">
            Powered by QueueLess Engine
          </p>
        </footer>
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
