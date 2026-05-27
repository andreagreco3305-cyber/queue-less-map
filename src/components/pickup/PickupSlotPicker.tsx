"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Users } from "lucide-react";
import type { PickupSlot } from "@/lib/pickup/slots";
import { useCart } from "@/context/CartContext";

type PickupSlotPickerProps = {
  barId: string;
  compact?: boolean;
};

export function PickupSlotPicker({ barId, compact }: PickupSlotPickerProps) {
  const { pickup, setPickup } = useCart();
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pickup/slots?barId=${barId}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoading(false));
  }, [barId]);

  if (loading) {
    return (
      <p className="text-sm text-stone-500">Caricamento orari disponibili…</p>
    );
  }

  return (
    <section id="pickup" className={compact ? "" : "mt-6"}>
      <div className="mb-3 flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-indigo-600" />
        <div>
          <h2 className="text-sm font-bold text-stone-900">Orario di ritiro</h2>
          <p className="text-xs text-stone-500">
            Scegli uno slot in base alla disponibilità del bar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {slots.map((slot) => {
          const selected = pickup?.iso === slot.iso;
          return (
            <button
              key={slot.iso}
              type="button"
              disabled={!slot.available}
              onClick={() =>
                setPickup(
                  selected ? null : { iso: slot.iso, label: slot.label },
                )
              }
              className={`rounded-xl border px-2 py-2.5 text-center transition ${
                selected
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : slot.available
                    ? "border-stone-200 bg-white text-stone-800 hover:border-indigo-300"
                    : "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-300"
              }`}
            >
              <span className="block text-sm font-bold">{slot.shortLabel}</span>
              {!compact && (
                <span
                  className={`mt-0.5 flex items-center justify-center gap-0.5 text-[10px] ${
                    selected ? "text-indigo-100" : "text-stone-400"
                  }`}
                >
                  <Users className="h-3 w-3" />
                  {slot.available ? `${slot.spotsLeft} posti` : "Pieno"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {pickup && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
          Ritiro concordato: {pickup.label}
        </p>
      )}
    </section>
  );
}
