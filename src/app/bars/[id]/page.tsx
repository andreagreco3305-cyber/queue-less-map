"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MenuItemRow } from "@/components/bars/MenuItemRow";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PickupSlotPicker } from "@/components/pickup/PickupSlotPicker";
import { getBarById, type MenuItem } from "@/data/bars";
import { useCart } from "@/context/CartContext";
import { Star } from "lucide-react";

const CATEGORIES: MenuItem["category"][] = [
  "caffè",
  "colazione",
  "panini",
  "bevande",
];

const CATEGORY_LABELS: Record<MenuItem["category"], string> = {
  caffè: "Caffè",
  colazione: "Colazione",
  panini: "Panini",
  bevande: "Bevande",
};

function BarMenuContent() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const bar = getBarById(id);
  const { itemCount, pickup } = useCart();

  const menuByCategory = useMemo(() => {
    if (!bar) return [];
    return CATEGORIES.map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      items: bar.menu.filter((i) => i.category === cat),
    })).filter((g) => g.items.length > 0);
  }, [bar]);

  if (!bar) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-6">
        <p className="text-stone-500">Bar non trovato.</p>
      </main>
    );
  }

  return (
    <AppShell backHref="/home">
      <div className="relative aspect-[2/1] w-full bg-stone-200">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          sizes="448px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-xl font-bold text-white">{bar.name}</h1>
          <p className="flex items-center gap-1 text-sm text-white/90">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {bar.rating} · {bar.tagline}
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <PickupSlotPicker barId={bar.id} />

        <div className="mt-6 space-y-6">
          {menuByCategory.map((group) => (
            <section key={group.category}>
              <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-stone-400">
                {group.label}
              </h2>
              <div className="rounded-2xl border border-stone-200 bg-white px-4">
                {group.items.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    barId={bar.id}
                    barName={bar.name}
                    item={item}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {itemCount > 0 && (
          <div className="sticky bottom-4 mt-8 pb-2">
            <Link
              href={pickup ? "/cart" : "#pickup"}
              className={`block rounded-2xl py-4 text-center text-sm font-bold shadow-lg ${
                pickup
                  ? "bg-indigo-600 text-white hover:bg-indigo-500"
                  : "bg-stone-300 text-stone-600"
              }`}
              onClick={(e) => {
                if (!pickup) {
                  e.preventDefault();
                  document
                    .getElementById("pickup")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {pickup
                ? `Vai al carrello (${itemCount})`
                : "Scegli orario di ritiro prima"}
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function BarMenuPage() {
  return (
    <RequireAuth>
      <BarMenuContent />
    </RequireAuth>
  );
}
