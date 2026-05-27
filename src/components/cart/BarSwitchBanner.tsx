"use client";

import { useCart } from "@/context/CartContext";

export function BarSwitchBanner() {
  const { barSwitchPrompt, confirmBarSwitch, cancelBarSwitch } = useCart();

  if (!barSwitchPrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xl">
        <p className="text-sm font-semibold text-stone-900">
          Cambiare bar?
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Il carrello ha prodotti da un altro locale. Vuoi svuotarlo e ordinare
          da <strong>{barSwitchPrompt}</strong>?
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={cancelBarSwitch}
            className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-medium text-stone-700"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={confirmBarSwitch}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white"
          >
            Sì, svuota
          </button>
        </div>
      </div>
    </div>
  );
}
