"use client";

import Link from "next/link";

type LogoProps = {
  href?: string;
  markOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
};

const IMG_SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 88,
};

export function Logo({
  href = "/home",
  markOnly = false,
  size = "md",
  showText = true,
}: LogoProps) {
  const px = IMG_SIZES[size];
  const withText = !markOnly && showText;

  const content = (
    <span className={`inline-flex items-center ${withText ? "gap-2.5" : ""}`}>
      {/* Custom SVG Logo: A lightning bolt combined with a circular queue path */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-indigo-600"
      >
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" strokeDasharray="210 70" strokeLinecap="round" className="opacity-20" />
        <path
          d="M45 20L30 55H50L40 85L75 40H55L65 10"
          fill="currentColor"
          className="drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]"
        />
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" strokeDasharray="150 130" strokeLinecap="round" />
      </svg>

      {withText && (
        <span
          className={`font-black tracking-tighter text-stone-900 uppercase ${
            size === "xl" ? "text-3xl" : size === "lg" ? "text-2xl" : "text-lg"
          }`}
        >
          Queue<span className="text-indigo-600">Less</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition opacity-95 hover:opacity-100">
        {content}
      </Link>
    );
  }

  return content;
}
