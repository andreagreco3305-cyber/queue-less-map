"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PickupSlotPicker } from "@/components/pickup/PickupSlotPicker";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/bars";

function CartContent() {
  const {
    lines,
    subtotal,
    itemCount,
    updateQuantity,
    removeLine,
    barId,
    pickup,
  } = useCart();

  if (lines.length === 0) {
    return (
      <AppShell title="Carrello" backHref="/home">
        <div className="px-6 py-16 text-center">
          <p className="text-lg font-bold text-stone-900">Carrello vuoto</p>
          <p className="mt-2 text-sm text-stone-500">
            Scegli un bar e aggiungi qualcosa dal menu.
          </p>
          <Link
            href="/home"
            className="mt-6 inline-block rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Scegli un bar
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Carrello" backHref={barId ? `/bars/${barId}` : "/home"}>
      <div className="px-4 pt-4">
        <p className="text-sm text-stone-500">{lines[0].barName}</p>

        {barId && (
          <div id="pickup" className="mt-4">
            <PickupSlotPicker barId={barId} compact />
          </div>
        )}

        {pickup && (
          <p className="mt-3 flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-900">
            <CalendarClock className="h-4 w-4 shrink-0" />
            Ritiro: {pickup.label}
          </p>
        )}

        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li
              key={line.itemId}
              className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-stone-900">{line.itemName}</p>
                <p className="text-sm text-indigo-600">
                  {formatPrice(line.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(line.itemId, line.quantity - 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-bold">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(line.itemId, line.quantity + 1)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeLine(line.itemId)}
                  className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Articoli ({itemCount})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-stone-100 pt-2 font-bold text-stone-900">
            <span>Totale</span>
            <span className="text-indigo-600">{formatPrice(subtotal)}</span>
          </div>
        </div>

        <Link
          href={pickup ? "/checkout" : "#pickup"}
          className={`mt-6 block rounded-2xl py-4 text-center text-sm font-bold ${
            pickup
              ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-500"
              : "bg-stone-300 text-stone-600"
          }`}
        >
          {pickup ? "Vai al checkout" : "Seleziona orario di ritiro"}
        </Link>
      </div>
    </AppShell>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <CartContent />
    </RequireAuth>
  );
}
