"use client";

import { Plus, Minus } from "lucide-react";
import { formatPrice, type MenuItem } from "@/data/bars";
import { useCart } from "@/context/CartContext";

type MenuItemRowProps = {
  barId: string;
  barName: string;
  item: MenuItem;
};

export function MenuItemRow({ barId, barName, item }: MenuItemRowProps) {
  const { lines, addItem, updateQuantity } = useCart();
  
  const line = lines.find((l) => l.itemId === item.id);
  const quantity = line?.quantity ?? 0;

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
      
      <div className="flex items-center gap-3">
        {quantity > 0 && (
          <>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-100 bg-white text-black transition-all active:scale-90"
              aria-label={`Riduci ${item.name}`}
            >
              <Minus className="h-5 w-5" strokeWidth={3} />
            </button>
            <span className="w-6 text-center text-lg font-black italic">{quantity}</span>
          </>
        )}
        <button
          type="button"
          onClick={() => addItem(barId, barName, item)}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/10 transition-all active:scale-90"
          aria-label={`Aggiungi ${item.name}`}
        >
          <Plus className="h-6 w-6" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
