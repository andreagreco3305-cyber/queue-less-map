import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { priceLevelLabel, type Bar } from "@/data/bars";

export function BarCard({ bar }: { bar: Bar }) {
  return (
    <Link
      href={`/bars/${bar.id}`}
      className="crazy-card group relative block overflow-hidden !p-0 border-white/5 bg-[#080808] hover:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />
        
        <div className="absolute bottom-6 left-8 right-8">
          <h2 className="crazy-title text-4xl text-white glow-text leading-none">
            {bar.name}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">
              {bar.cuisine}
            </span>
          </div>
        </div>

        <div className="absolute right-8 top-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black shadow-2xl transition-all group-hover:translate-x-2 group-active:scale-90">
          <ArrowRight className="h-7 w-7" strokeWidth={3} />
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#080808] px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-black text-white text-sm italic">
            <Star className="h-4 w-4 fill-white" />
            {bar.rating.toFixed(1)}
          </div>
          <div className="h-1 w-1 rounded-full bg-white/10" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            {bar.waitMinutes} MIN WAIT
          </div>
        </div>
        <div className="text-sm font-black tracking-widest text-white/10 italic">
          {priceLevelLabel(bar.priceLevel)}
        </div>
      </div>
    </Link>
  );
}
