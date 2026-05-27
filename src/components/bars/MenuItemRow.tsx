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
    <div className="flex items-center justify-between gap-3 border-b border-stone-100 py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-stone-900">{item.name}</p>
        {item.description && (
          <p className="text-xs text-stone-500">{item.description}</p>
        )}
        <p className="mt-0.5 text-sm font-medium text-indigo-600">
          {formatPrice(item.price)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => addItem(barId, barName, item)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 active:scale-95"
        aria-label={`Aggiungi ${item.name}`}
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
