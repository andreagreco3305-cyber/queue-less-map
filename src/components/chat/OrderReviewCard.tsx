"use client";

import { type OrderDraft } from "@/lib/ai/resolve-order";
import { Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function OrderReviewCard({ draft }: { draft: OrderDraft }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "processing">("idle");

  const onConfirm = () => {
    setStatus("processing");
    // Simuliamo un caricamento per il "pagamento"
    setTimeout(() => {
      const params = new URLSearchParams({
        bar: draft.barName,
        item: draft.itemName,
        price: draft.estimatedTotal,
        time: draft.pickupLabel
      });
      router.push(`/order-confirmation?${params.toString()}`);
    }, 1500);
  };

  return (
    <div className="crazy-card !p-8 shadow-2xl animate-crazy-in">
      <div className="mb-6 flex items-center justify-between border-b-2 border-stone-50 pb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
          Ordine Rilevato
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

      <button
        onClick={onConfirm}
        disabled={status === "processing"}
        className="crazy-button h-20 !rounded-[1.5rem]"
      >
        {status === "processing" ? (
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-xs">ELABORAZIONE PAGAMENTO...</span>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between px-4">
            <span>VAI AL PAGAMENTO</span>
            <ArrowRight className="h-6 w-6 stroke-[3]" />
          </div>
        )}
      </button>
    </div>
  );
}
