"use client";

import { useCart } from "@/context/CartContext";
import { type OrderDraft } from "@/lib/ai/resolve-order";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

export function OrderReviewCard({ draft }: { draft: OrderDraft }) {
  const { addItem } = useCart();
  const [status, setStatus] = useState<"idle" | "adding" | "success">("idle");

  const onConfirm = async () => {
    setStatus("adding");
    setTimeout(() => {
      addItem(draft.barId, draft.barName, {
        id: draft.itemId,
        name: draft.itemName,
        price: draft.price,
        category: "caffè",
      });
      setStatus("success");
    }, 800);
  };

  return (
    <div className="crazy-card !p-8 shadow-2xl">
      <div className="mb-6 flex items-center justify-between border-b-2 border-stone-50 pb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
          Predazione Rilevata
        </span>
        <span className="text-[11px] font-black uppercase tracking-tighter text-white bg-black px-3 py-1 rounded-full">
          {draft.barName}
        </span>
      </div>

      <div className="mb-8">
        <h4 className="crazy-title text-4xl text-black leading-none">
          {draft.itemName}
        </h4>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-black uppercase tracking-widest text-stone-400">RITIRO: {draft.pickupLabel}</span>
          <span className="text-2xl font-black text-black tracking-tighter">{draft.estimatedTotal}</span>
        </div>
      </div>

      {status === "success" ? (
        <div className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-50 text-emerald-600 text-sm font-black uppercase tracking-widest animate-crazy-in">
          <Check className="h-6 w-6 stroke-[3]" />
          Aggiunto
        </div>
      ) : (
        <button
          onClick={onConfirm}
          disabled={status === "adding"}
          className="crazy-button h-20 !rounded-[1.5rem]"
        >
          {status === "adding" ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <div className="flex w-full items-center justify-between px-4">
              <span>CONFERMA</span>
              <ArrowRight className="h-6 w-6 stroke-[3]" />
            </div>
          )}
        </button>
      )}
    </div>
  );
}
