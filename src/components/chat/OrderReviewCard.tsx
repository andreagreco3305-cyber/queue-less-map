"use client";

import { useState } from "react";
import { CalendarClock, MapPin, ShoppingBag, Loader2 } from "lucide-react";
import type { OrderDraft } from "@/lib/ai/resolve-order";
import { formatPrice } from "@/data/bars";

type OrderReviewCardProps = {
  draft: OrderDraft;
  onConfirmed?: (code: string) => void;
};

export function OrderReviewCard({ draft, onConfirmed }: OrderReviewCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [code, setCode] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barId: draft.barId,
          barName: draft.barName,
          pickupAt: draft.time,
          pickupLabel: draft.pickupLabel,
          total: draft.price,
          items: [
            {
              itemId: draft.itemId,
              itemName: draft.itemName,
              price: draft.price,
              quantity: 1,
            },
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Conferma non riuscita.");
        return;
      }
      setCode(data.code);
      setDone(true);
      onConfirmed?.(data.code);
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-sm font-bold text-emerald-900">Ordine confermato!</p>
        <p className="mt-1 text-xs text-emerald-800">
          Codice ritiro: <strong>{code}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
      <div className="bg-indigo-600 px-4 py-2">
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-100">
          Rivedi ordine
        </p>
      </div>
      <div className="space-y-2 p-4 text-sm">
        <p className="flex items-center gap-2 font-semibold text-stone-900">
          <MapPin className="h-4 w-4 text-indigo-600" />
          {draft.barName}
        </p>
        <p className="flex items-center gap-2 text-stone-700">
          <ShoppingBag className="h-4 w-4 text-stone-400" />
          1× {draft.itemName}
        </p>
        <p className="flex items-center gap-2 text-stone-700">
          <CalendarClock className="h-4 w-4 text-stone-400" />
          {draft.pickupLabel}
        </p>
        <p className="border-t border-stone-100 pt-2 text-base font-bold text-indigo-600">
          Totale stimato: {draft.estimatedTotal}
        </p>
        {error && (
          <p className="rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700">
            {error}
          </p>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={confirm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Conferma in corso…
            </>
          ) : (
            "Conferma e Paga"
          )}
        </button>
        <p className="text-center text-[10px] text-stone-400">
          L&apos;ordine viene salvato solo dopo questo click
        </p>
      </div>
    </div>
  );
}
