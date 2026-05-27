"use client";

import Link from "next/link";

type LogoProps = {
  href?: string;
  markOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
};

const SIZES = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export function Logo({
  href = "/home",
  markOnly = false,
  size = "md",
  showText = true,
}: LogoProps) {
  const px = SIZES[size];
  const withText = !markOnly && showText;

  const content = (
    <span className={`inline-flex items-center ${withText ? "gap-3" : ""}`}>
      {/* Nuovo Logo: Ultra Minimalist QL Symbol */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black"
      >
        <rect width="100" height="100" rx="24" fill="currentColor" />
        <path
          d="M30 40C30 34.4772 34.4772 30 40 30H70V45C70 50.5228 65.5228 55 60 55H30V40Z"
          fill="white"
        />
        <path
          d="M30 70V55H60V70H30Z"
          fill="white"
          fillOpacity="0.3"
        />
      </svg>

      {withText && (
        <span
          className={`font-black tracking-tighter text-black uppercase ${
            size === "xl" ? "text-3xl" : size === "lg" ? "text-2xl" : "text-xl"
          }`}
        >
          Queue<span className="text-stone-400">Less</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-80 active:scale-95">
        {content}
      </Link>
    );
  }

  return content;
}
