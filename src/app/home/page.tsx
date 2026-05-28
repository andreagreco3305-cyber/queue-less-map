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
      <div className="px-6 pt-6">
        {welcome && (
          <div className="mb-8 flex items-start gap-4 crazy-card !bg-black !text-white animate-crazy-in border-none p-6">
            <Sparkles className="h-6 w-6 shrink-0 fill-white" />
            <div>
              <p className="font-black uppercase tracking-widest text-base italic">Bentornato</p>
              <p className="mt-0.5 text-stone-400 font-bold tracking-tight text-xs leading-snug">Accesso eseguito. La tua velocità è priorità assoluta.</p>
            </div>
          </div>
        )}

        {/* Search Bar Premium */}
        <div className="mb-6 relative group animate-crazy-in">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300 group-focus-within:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="Cerca il tuo locale..." 
            className="w-full h-16 bg-stone-50 border-2 border-transparent rounded-[1.5rem] pl-16 pr-8 text-sm font-bold outline-none focus:bg-white focus:border-black transition-all shadow-sm"
          />
        </div>

        <div className="mb-6 flex items-end justify-between animate-crazy-in">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-stone-400">
              <MapPin className="h-3 w-3" strokeWidth={3} />
              MILANO IT
            </div>
            <h1 className="text-[44px] crazy-title text-black leading-none">
              SCELTI<br /><span className="text-stone-200">PER TE</span>
            </h1>
          </div>
        </div>

        <div className="space-y-6 pb-10 animate-crazy-in">
          {BARS.map((bar) => (
            <BarCard key={bar.id} bar={bar} />
          ))}
        </div>

        <footer className="pb-16 pt-4 text-center border-t border-stone-50">
          <button
            type="button"
            onClick={() => logout().then(() => (window.location.href = "/"))}
            className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-black transition-colors"
          >
            [ LOGOUT SYSTEM ]
          </button>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-stone-100">
            ELITE PERFORMANCE ENGINE
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
