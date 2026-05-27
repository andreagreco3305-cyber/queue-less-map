import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star, ArrowRight } from "lucide-react";
import { priceLevelLabel, type Bar } from "@/data/bars";

export function BarCard({ bar }: { bar: Bar }) {
  return (
    <Link
      href={`/bars/${bar.id}`}
      className="group block overflow-hidden rounded-[2.5rem] border border-stone-100 bg-white p-2 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] active:scale-[0.98]"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[2rem] bg-stone-100">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={bar.id === "statale"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        
        <div className="absolute bottom-5 left-6 right-5 flex items-end justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white">
              {bar.name}
            </h2>
            <p className="text-xs font-bold tracking-widest text-stone-300 uppercase mt-0.5">
              {bar.cuisine}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-xl transition-transform group-hover:translate-x-1">
            <ArrowRight className="h-5 w-5" />
          </div>
        </div>
        
        <span className="absolute left-6 top-5 rounded-full bg-black/40 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
          Ready in {bar.waitMinutes}m
        </span>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-black text-black text-sm">
              <Star className="h-4 w-4 fill-black text-black" />
              {bar.rating.toFixed(1)}
            </div>
            <div className="h-1 w-1 rounded-full bg-stone-200" />
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              {bar.reviewCount} Reviews
            </div>
          </div>
          <div className="text-sm font-black text-stone-300 tracking-widest">
            {priceLevelLabel(bar.priceLevel)}
          </div>
        </div>
        
        <div className="mt-3 flex items-center gap-2 border-t border-stone-50 pt-3">
          <MapPin className="h-3.5 w-3.5 text-stone-400" />
          <p className="truncate text-[11px] font-medium text-stone-500 uppercase tracking-tight">
            {bar.address.split('—')[0]}
          </p>
        </div>
      </div>
    </Link>
  );
}
