import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { priceLevelLabel, type Bar } from "@/data/bars";

export function BarCard({ bar }: { bar: Bar }) {
  return (
    <Link
      href={`/bars/${bar.id}`}
      className="group block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-200">
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          priority={bar.id === "statale"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700 shadow-sm">
          Salta la fila
        </span>
        {bar.campus && (
          <span className="absolute right-3 top-3 rounded-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white">
            {bar.campus}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h2 className="text-lg font-bold text-white drop-shadow-sm">
            {bar.name}
          </h2>
          <p className="text-xs text-white/90">{bar.cuisine}</p>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-0.5 font-bold text-stone-900">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {bar.rating.toFixed(1)}
          </span>
          <span className="text-stone-400">({bar.reviewCount})</span>
          <span className="text-stone-300">·</span>
          <span className="font-medium text-stone-600">
            {priceLevelLabel(bar.priceLevel)}
          </span>
        </div>
        <p className="mt-1 flex items-start gap-1 text-xs text-stone-500">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {bar.address}
        </p>
        <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Clock className="h-3.5 w-3.5" />
          Ritiro VIP ~{bar.waitMinutes} min
        </p>
      </div>
    </Link>
  );
}
