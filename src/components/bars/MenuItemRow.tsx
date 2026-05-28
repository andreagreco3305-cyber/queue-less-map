"use client";

import { Plus } from "lucide-react";
import { formatPrice, type MenuItem } from "@/data/bars";
import { useCart } from "@/context/CartContext";

type MenuItemRowProps = {
  barId: string;
  barName: string;
  item: MenuItem;
};

export function MenuItemRow({ barId, barName, item }: MenuItemRowProps) {
  const { addItem } = useCart();

  return (
    <div className="flex items-center justify-between gap-4 py-6 border-b border-stone-100 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-lg font-black uppercase tracking-tight text-black">{item.name}</p>
        {item.description && (
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">{item.description}</p>
        )}
        <p className="mt-2 text-xl font-black text-black tracking-tighter">
          {formatPrice(item.price)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => addItem(barId, barName, item)}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/10 transition-all active:scale-90"
        aria-label={`Aggiungi ${item.name}`}
      >
        <Plus className="h-6 w-6" strokeWidth={3} />
      </button>
    </div>
  );
}
