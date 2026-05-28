"use client";

import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { CheckCircle2, Clock, MapPin, Ticket, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const bar = searchParams.get("bar") || "Bar Centrale";
  const item = searchParams.get("item") || "Espresso";
  const time = searchParams.get("time") || "Oggi alle 09:15";
  
  const [pickupCode, setPickupCode] = useState("");

  useEffect(() => {
    // Genera un codice alfanumerico di 3 cifre/lettere
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPickupCode(code);
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col items-center px-6 pt-12 pb-20 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-black text-white animate-crazy-in">
          <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
        </div>

        <div className="space-y-2 animate-crazy-in [animation-delay:100ms]">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">STATUS: CONFERMATO</p>
          <h1 className="crazy-title text-[56px] leading-none text-black">
            SALTA LA<br /><span className="text-stone-200">CODA</span>
          </h1>
        </div>

        <div className="mt-12 w-full space-y-4 animate-crazy-in [animation-delay:200ms]">
          <div className="crazy-card !bg-stone-50 border-none !p-8 text-left space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-black shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">LUOGO RITIRO</p>
                <p className="text-xl font-bold text-black uppercase">{bar}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-black shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">ORARIO STIMATO</p>
                <p className="text-xl font-bold text-black uppercase">{time}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4 border-t border-stone-100">
              <Ticket className="h-6 w-6 text-black shrink-0" strokeWidth={2.5} />
              <div className="w-full">
                <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">CODICE RITIRO</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-6xl font-black tracking-tighter text-black">{pickupCode}</span>
                  <div className="h-12 w-12 bg-black text-white flex items-center justify-center rounded-xl font-black italic text-xs rotate-12">
                    QL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full animate-crazy-in [animation-delay:300ms]">
          <p className="mb-8 text-xs font-bold text-stone-400 uppercase tracking-widest leading-relaxed">
            MOSTRA IL CODICE AL BANCONE.<br />IL TUO ORDINE È PRONTO.
          </p>
          
          <Link href="/home" className="crazy-button h-16 !bg-stone-100 !text-black flex items-center justify-center gap-3">
            <ArrowLeft className="h-5 w-5 stroke-[3]" />
            <span>TORNA ALLA HOME</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
