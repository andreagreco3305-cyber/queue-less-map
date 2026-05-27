"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CalendarClock, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/bars";

function CheckoutContent() {
  const { lines, subtotal, itemCount, clearCart, pickup } = useCart();
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");

  if (lines.length === 0 && !done) {
    return (
      <AppShell title="Checkout" backHref="/cart" showChat={false}>
        <div className="px-6 py-12 text-center">
          <p className="text-stone-500">Carrello vuoto.</p>
          <Link href="/home" className="mt-4 inline-block text-indigo-600">
            Torna ai bar
          </Link>
        </div>
      </AppShell>
    );
  }

  const placeOrder = async () => {
    if (!pickup || lines.length === 0) {
      setError("Seleziona un orario di ritiro.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barId: lines[0].barId,
          barName: lines[0].barName,
          pickupAt: pickup.iso,
          pickupLabel: pickup.label,
          total: subtotal + 0.3,
          items: lines.map((l) => ({
            itemId: l.itemId,
            itemName: l.itemName,
            price: l.price,
            quantity: l.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Ordine non riuscito.");
        return;
      }
      setOrderCode(data.code);
      setDone(true);
      clearCart();
    } catch {
      setError("Errore di rete.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <AppShell showCart={false} showChat={false}>
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold">Ordine confermato!</h1>
          <p className="mt-2 text-sm text-stone-500">
            Codice: <strong className="text-indigo-600">{orderCode}</strong>
          </p>
          {pickup && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-stone-600">
              <CalendarClock className="h-4 w-4" />
              {pickup.label}
            </p>
          )}
          <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-700">
            <Zap className="h-4 w-4" />
            Ritiro VIP al banco
          </p>
          <Link
            href="/home"
            className="mt-8 inline-block rounded-2xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white"
          >
            Torna ai bar
          </Link>
        </div>
      </AppShell>
    );
  }

  const serviceFee = 0.3;
  const total = subtotal + serviceFee;

  return (
    <AppShell title="Checkout" backHref="/cart" showChat={false}>
      <div className="px-4 pt-4">
        <p className="text-sm text-stone-500">{lines[0]?.barName}</p>
        {pickup && (
          <p className="mt-2 flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-900">
            <CalendarClock className="h-4 w-4" />
            {pickup.label}
          </p>
        )}

        <ul className="mt-4 space-y-2 rounded-2xl border border-stone-200 bg-white p-4">
          {lines.map((line) => (
            <li key={line.itemId} className="flex justify-between text-sm">
              <span>
                {line.quantity}× {line.itemName}
              </span>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 text-sm">
          <div className="flex justify-between">
            <span>Totale</span>
            <span className="font-bold text-indigo-600">{formatPrice(total)}</span>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={submitting || !pickup}
          onClick={placeOrder}
          className="mt-6 w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white disabled:bg-stone-300"
        >
          {submitting ? "Conferma…" : "Conferma ordine"}
        </button>
      </div>
    </AppShell>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutContent />
    </RequireAuth>
  );
}
