"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/bars";
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function CartPage() {
  const { lines, subtotal, updateQuantity, removeLine, pickup, barId } = useCart();

  if (lines.length === 0) {
    return (
      <AppShell title="Carrello">
        <div className="flex min-h-[60dvh] flex-col items-center justify-center p-10 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-stone-50 border-2 border-dashed border-stone-200">
            <ShoppingBag className="h-10 w-10 text-stone-300" strokeWidth={1.5} />
          </div>
          <h2 className="crazy-title text-3xl mb-3">Vuoto.</h2>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-tight mb-10">Il carrello è vuoto. <br />Seleziona un prodotto dai bar.</p>
          <Link href="/home" className="crazy-button">
             <span>Esplora Bar</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Riepilogo" backHref="/home">
      <div className="px-6 pt-10 pb-32">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-2 italic">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            Ordine da {lines[0].barName}
          </div>
          <h1 className="crazy-title text-5xl text-black">IL TUO<br />ORDINE</h1>
        </div>

        <div className="space-y-6">
          {lines.map((line) => (
            <div key={line.itemId} className="crazy-card !p-6 flex items-center justify-between border-stone-100 shadow-xl shadow-black/[0.02]">
              <div className="min-w-0 flex-1">
                <h3 className="crazy-title text-xl text-black">{line.itemName}</h3>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">
                  {formatPrice(line.price)} cad.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-2xl border border-stone-100">
                <button
                  onClick={() => updateQuantity(line.itemId, line.quantity - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-stone-200 text-black shadow-sm active:scale-90"
                >
                  {line.quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </button>
                <span className="text-sm font-black w-4 text-center">{line.quantity}</span>
                <button
                  onClick={() => updateQuantity(line.itemId, line.quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-md active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {pickup && (
          <div className="mt-12 p-6 rounded-[2rem] bg-stone-50 border border-stone-100 italic">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">Punto di Incontro</p>
             <p className="text-sm font-bold text-black uppercase tracking-tight">Ritiro previsto alle {pickup.label}</p>
          </div>
        )}

        <div className="fixed bottom-8 inset-x-0 px-6 z-40">
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between px-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-400 italic">Totale Stimato</span>
              <span className="text-4xl font-black text-black tracking-tighter italic italic italic">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/checkout"
              className="crazy-button shadow-2xl"
            >
              <div className="flex w-full items-center justify-between px-4">
                <span>CONFERMA ORDINE</span>
                <ArrowRight className="h-6 w-6 stroke-[3]" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
