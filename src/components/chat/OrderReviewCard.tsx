"use client";

import { useCart } from "@/context/CartContext";
import { type OrderDraft } from "@/lib/ai/resolve-order";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

export function OrderReviewCard({ draft }: { draft: OrderDraft }) {
  const { addLine } = useCart();
  const [status, setStatus] = useState<"idle" | "adding" | "success">("idle");

  const onConfirm = async () => {
    setStatus("adding");
    // Simula aggiunta a carrello
    setTimeout(() => {
      addLine({
        id: draft.itemId,
        name: draft.itemName,
        price: draft.price,
        barId: draft.barId,
        barName: draft.barName,
        pickupTime: draft.time,
        category: "caffè",
      });
      setStatus("success");
    }, 800);
  };

  return (
    <div className="rounded-[1.5rem] border border-stone-100 bg-white p-5 shadow-lg ring-1 ring-black/5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-black" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            Ordine Rilevato
          </span>
        </div>
        <span className="text-xs font-black uppercase tracking-tight text-black bg-stone-100 px-2 py-0.5 rounded-md">
          {draft.barName}
        </span>
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex justify-between items-baseline">
          <h4 className="text-xl font-black uppercase tracking-tighter text-black">
            {draft.itemName}
          </h4>
          <span className="text-lg font-bold text-stone-900">{draft.estimatedTotal}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest">
          <span>Ritiro: {draft.pickupLabel}</span>
        </div>
      </div>

      {status === "success" ? (
        <div className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-600 animate-in fade-in zoom-in-95">
          <Check className="h-5 w-5" />
          Aggiunto al carrello
        </div>
      ) : (
        <button
          onClick={onConfirm}
          disabled={status === "adding"}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black text-sm font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          {status === "adding" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Conferma e Paga
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
