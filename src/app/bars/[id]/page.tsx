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
import { Star, ArrowRight } from "lucide-react";

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
        <p className="text-stone-500 font-bold uppercase tracking-widest">Bar non trovato.</p>
      </main>
    );
  }

  return (
    <AppShell backHref="/home" title={bar.name}>
      <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          sizes="448px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 fill-white text-white" />
            <span className="text-sm font-black text-white">{bar.rating}</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{bar.name}</h1>
          <p className="text-xs font-bold text-stone-300 uppercase tracking-widest mt-1 opacity-80">
            {bar.tagline}
          </p>
        </div>
      </div>

      <div className="px-6 pt-8 pb-20">
        <div id="pickup" className="mb-10">
          <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400">
            Pianifica il Ritiro
          </h2>
          <PickupSlotPicker barId={bar.id} />
        </div>

        <div className="space-y-12">
          {menuByCategory.map((group) => (
            <section key={group.category}>
              <h2 className="mb-4 text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 border-l-2 border-black pl-3 ml-1">
                {group.label}
              </h2>
              <div className="divide-y divide-stone-100 bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
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
          <div className="fixed bottom-6 inset-x-0 px-6 z-20">
            <Link
              href={pickup ? "/cart" : "#pickup"}
              className={`flex h-16 w-full items-center justify-between px-8 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95 ${
                pickup
                  ? "bg-black text-white"
                  : "bg-stone-200 text-stone-500"
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
              <span>{pickup ? "Vedi Carrello" : "Scegli l'orario"}</span>
              <div className="flex items-center gap-3">
                {pickup && <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">{itemCount} Articoli</span>}
                <ArrowRight className="h-5 w-5" />
              </div>
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
