"use client";

import { useCart } from "@/context/CartContext";
import { getBarById } from "@/data/bars";
import { generateSlots } from "@/lib/pickup/slots";
import { CalendarClock, Zap } from "lucide-react";
import { useMemo } from "react";

export function PickupSlotPicker({ barId }: { barId: string }) {
  const bar = getBarById(barId);
  const { pickup, setPickup } = useCart();

  const slots = useMemo(() => generateSlots(), []);

  return (
    <div className="space-y-4">
      <div className="flex grid grid-cols-3 gap-3">
        {slots.map((slot) => {
          const selected = pickup?.iso === slot.iso;
          return (
            <button
              key={slot.iso}
              type="button"
              onClick={() => setPickup(slot)}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 py-4 transition-all active:scale-95 ${
                selected
                  ? "border-black bg-black text-white shadow-xl shadow-black/10"
                  : "border-stone-100 bg-stone-50 text-stone-400 hover:border-stone-200"
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest ${selected ? "text-white/40" : "text-stone-300"}`}>
                Slot
              </span>
              <span className="text-sm font-black italic">{slot.label}</span>
            </button>
          );
        })}
      </div>
      
      {pickup && (
        <div className="flex items-center gap-2 px-2 animate-in fade-in slide-in-from-left-2">
            <Zap className="h-3 w-3 fill-black text-black" />
            <p className="text-[10px] font-black uppercase tracking-widest text-black">
                Ritiro confermato per le {pickup.label}
            </p>
        </div>
      )}
    </div>
  );
}
