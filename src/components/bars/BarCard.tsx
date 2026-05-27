import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { priceLevelLabel, type Bar } from "@/data/bars";

export function BarCard({ bar }: { bar: Bar }) {
  return (
    <Link
      href={`/bars/${bar.id}`}
      className="crazy-card group relative block overflow-hidden !p-0 shadow-2xl shadow-black/5"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-40 transition-opacity group-hover:opacity-60" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="crazy-title text-3xl text-white">
            {bar.name}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">
              {bar.cuisine}
            </span>
          </div>
        </div>

        <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform group-hover:translate-x-1 group-active:scale-90">
          <ArrowRight className="h-6 w-6" strokeWidth={3} />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-black text-black">
            <Star className="h-4 w-4 fill-black" />
            {bar.rating.toFixed(1)}
          </div>
          <div className="h-1 w-1 rounded-full bg-stone-200" />
          <div className="text-[11px] font-black uppercase tracking-widest text-stone-400">
            ~{bar.waitMinutes} MIN
          </div>
        </div>
        <div className="text-sm font-black tracking-widest text-stone-200">
          {priceLevelLabel(bar.priceLevel)}
        </div>
      </div>
    </Link>
  );
}
