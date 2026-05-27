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
      <main className="flex min-h-[100dvh] items-center justify-center px-6 bg-white">
        <p className="text-black font-black uppercase tracking-widest text-sm">Bar non trovato.</p>
      </main>
    );
  }

  return (
    <AppShell backHref="/home" title={bar.name}>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Star className="h-4 w-4 fill-white text-white" />
            <span className="text-sm font-black text-white">{bar.rating}</span>
          </div>
          <h1 className="crazy-title text-5xl text-white">{bar.name}</h1>
          <p className="text-[11px] font-black text-stone-300 uppercase tracking-[0.2em] mt-2">
            {bar.tagline}
          </p>
        </div>
      </div>

      <div className="px-6 pt-8 pb-32 bg-white">
        <div id="pickup" className="mb-12">
          <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.3em] text-stone-400">
            RITIRO PREVISTO
          </h2>
          <PickupSlotPicker barId={bar.id} />
        </div>

        <div className="space-y-16">
          {menuByCategory.map((group) => (
            <section key={group.category} className="animate-crazy-in">
              <h2 className="crazy-title text-4xl text-black mb-6">
                {group.label}
              </h2>
              <div className="divide-y-2 divide-stone-50 border-t-4 border-black pt-2">
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
          <div className="fixed bottom-8 inset-x-0 px-6 z-40">
            <Link
              href={pickup ? "/cart" : "#pickup"}
              className={`crazy-button shadow-2xl ${
                pickup ? "bg-black" : "bg-stone-100 !text-stone-400 border-none"
              }`}
            >
              <div className="flex w-full items-center justify-between px-2">
                <span>{pickup ? "Vedi Ordine" : "Scegli l'orario"}</span>
                <div className="flex items-center gap-3">
                  {pickup && <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded uppercase">{itemCount} pezzi</span>}
                  <ArrowRight className="h-6 w-6" strokeWidth={3} />
                </div>
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
