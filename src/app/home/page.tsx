"use client";

import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BarCard } from "@/components/bars/BarCard";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { BARS } from "@/data/bars";
import { Sparkles, MapPin, Search } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome") === "1";
  const { logout } = useAuth();

  return (
    <AppShell>
      <div className="px-6 pt-10">
        {welcome && (
          <div className="mb-10 flex items-start gap-4 crazy-card !bg-white !text-black animate-crazy-in">
            <Sparkles className="h-6 w-6 shrink-0 fill-black" />
            <div>
              <p className="font-black uppercase tracking-tight italic">Missione Avviata</p>
              <p className="mt-0.5 text-black/60 font-bold tracking-tight text-xs">Il predatore ha effettuato l&apos;accesso. Ordina e sbrana la coda.</p>
            </div>
          </div>
        )}

        {/* Search Bar Crazy */}
        <div className="mb-12 relative group animate-crazy-in">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Cerca il tuo bersaglio..." 
            className="w-full h-16 bg-white/5 border border-white/10 rounded-[1.5rem] pl-14 pr-6 text-sm font-bold outline-none focus:bg-white/10 focus:border-white/30 transition-all"
          />
        </div>

        <div className="mb-10 flex items-end justify-between animate-crazy-in">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">
              <MapPin className="h-3 w-3" strokeWidth={3} />
              Zona: Milano Centro
            </div>
            <h1 className="text-[52px] crazy-title text-white glow-text leading-[0.85]">
              SCELTI<br />PER TE
            </h1>
          </div>
        </div>

        <div className="space-y-10 pb-20 animate-crazy-in">
          {BARS.map((bar) => (
            <BarCard key={bar.id} bar={bar} />
          ))}
        </div>

        <footer className="pb-12 pt-4 text-center">
          <button
            type="button"
            onClick={() => logout().then(() => (window.location.href = "/"))}
            className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
          >
            [ DISCONNESSIONE PREDATORE ]
          </button>
          <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/5">
            QLX ULTRA ENGINE v2.0
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
