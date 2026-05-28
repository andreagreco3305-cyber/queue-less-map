"use client";

import { useCart } from "@/context/CartContext";

export function BarSwitchBanner() {
  const { barSwitchPrompt, confirmBarSwitch, cancelBarSwitch } = useCart();

  if (!barSwitchPrompt) return null;

  return (
    <div className="fixed inset-x-0 bottom-8 z-[100] mx-auto max-w-sm px-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="crazy-card !p-8 shadow-2xl !bg-black !text-white border-none">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-2 italic">
          Conflitto Territoriale
        </p>
        <h3 className="crazy-title text-3xl mb-4 leading-none text-white">CAMBIARE<br />LOCALE?</h3>
        <p className="text-xs font-bold text-stone-300 uppercase tracking-tight leading-relaxed mb-8">
          Il carrello contiene prodotti di un altro bar. Vuoi svuotarlo per ordinare da <span className="text-white italic">{barSwitchPrompt}</span>?
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={cancelBarSwitch}
            className="flex-1 h-14 rounded-2xl border-2 border-stone-800 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-white transition-colors"
          >
            ANNULLA
          </button>
          <button
            type="button"
            onClick={confirmBarSwitch}
            className="flex-1 h-14 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            SÌ, SVUOTA
          </button>
        </div>
      </div>
    </div>
  );
}
