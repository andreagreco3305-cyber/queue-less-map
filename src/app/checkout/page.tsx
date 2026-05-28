"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/bars";
import { Check, ArrowRight, ShoppingBag, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function CheckoutPage() {
  const { lines, subtotal, clearCart, pickup } = useCart();
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [orderCode, setOrderCode] = useState("");

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      const code = Math.random().toString(36).slice(2, 5).toUpperCase();
      setOrderCode(code);
      setStatus("success");
      clearCart();
    }, 2000);
  };

  if (status === "success") {
    return (
      <AppShell title="Successo" showCart={false}>
        <div className="flex min-h-[80dvh] flex-col items-center justify-center p-10 text-center animate-crazy-in">
          <div className="mb-10 flex h-32 w-32 items-center justify-center rounded-[3rem] bg-black text-white shadow-2xl shadow-black/20 relative">
            <Check className="h-14 w-14" strokeWidth={3} />
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white fill-white" />
            </div>
          </div>
          
          <h2 className="crazy-title text-4xl mb-4 leading-none">ORDINE<br />INVIATO</h2>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-12 italic">Il tuo ordine è stato ricevuto. <br />Mostra il codice al bancone.</p>
          
          <div className="crazy-card !bg-stone-50 border-none w-full !p-8 mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300 mb-2">Codice di Ritiro</p>
            <p className="text-5xl font-black tracking-tighter text-black glow-text italic">{orderCode}</p>
          </div>

          <Link href="/home" className="crazy-button">
            <div className="flex w-full items-center justify-between px-6">
                <span>NUOVO ORDINE</span>
                <ArrowRight className="h-6 w-6 stroke-[3]" />
            </div>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Pagamento" backHref="/cart">
      <div className="px-6 pt-10 pb-32">
        <div className="mb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 mb-2 italic">Ultimo Step</p>
          <h1 className="crazy-title text-5xl text-black">PAGAMENTO<br />RAPIDO</h1>
        </div>

        <div className="crazy-card border-stone-100 shadow-xl shadow-black/[0.02] !p-8 mb-10">
          <div className="flex justify-between items-center mb-8 border-b-2 border-stone-50 pb-6">
            <span className="text-sm font-black uppercase tracking-widest text-stone-400 italic">Riepilogo</span>
            <span className="text-[10px] font-black text-white bg-black px-2 py-0.5 rounded uppercase">{lines.length} Pezzi</span>
          </div>

          <div className="space-y-4 mb-10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest italic">Totale Ordine</span>
              <span className="text-2xl font-black text-black tracking-tight italic">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest italic">Orario Ritiro</span>
              <span className="text-xs font-black text-black bg-stone-100 px-2 py-0.5 rounded italic">{pickup?.label ?? "Asap"}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <Check className="h-4 w-4 text-white" strokeWidth={3} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Stripe Secure Payment</p>
          </div>
        </div>

        <div className="fixed bottom-8 inset-x-0 px-6 z-40">
           <button
            onClick={handlePay}
            disabled={status === "processing"}
            className="crazy-button shadow-2xl"
          >
            {status === "processing" ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                <span className="text-[10px] tracking-[0.3em]">ANALISI TRANSAZIONE...</span>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between px-4">
                <span>PAGA ORA</span>
                <ArrowRight className="h-6 w-6 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
