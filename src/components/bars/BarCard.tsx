import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { priceLevelLabel, type Bar } from "@/data/bars";

export function BarCard({ bar }: { bar: Bar }) {
  return (
    <Link
      href={`/bars/${bar.id}`}
      className="crazy-card group relative block overflow-hidden !p-0 shadow-[0_30px_60px_rgba(0,0,0,0.06)] border-none"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        
        <div className="absolute bottom-6 left-8 right-8">
          <h2 className="crazy-title text-4xl text-white leading-none">
            {bar.name}
          </h2>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-stone-300">
            {bar.cuisine}
          </p>
        </div>

        <div className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-all group-hover:scale-110">
          <ArrowRight className="h-6 w-6" strokeWidth={3} />
        </div>
      </div>

      <div className="flex items-center justify-between bg-white px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-black text-black text-sm">
            <Star className="h-4 w-4 fill-black" />
            {bar.rating.toFixed(1)}
          </div>
          <div className="h-1 w-1 rounded-full bg-stone-100" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
            READY IN {bar.waitMinutes}M
          </div>
        </div>
        <div className="text-sm font-black tracking-widest text-stone-200">
          {priceLevelLabel(bar.priceLevel)}
        </div>
      </div>
    </Link>
  );
}
