"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { useCart } from "@/context/CartContext";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
  showCart?: boolean;
  showChat?: boolean;
  backHref?: string;
};

export function AppShell({
  children,
  title,
  showCart = true,
  showChat = true,
  backHref,
}: AppShellProps) {
  const { itemCount } = useCart();

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-stone-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-100 bg-stone-50/95 px-4 py-3 backdrop-blur-sm pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="shrink-0 text-sm font-medium text-indigo-600"
            >
              ←
            </Link>
          ) : null}
          {backHref ? (
            <h1 className="truncate text-sm font-bold text-stone-900">{title}</h1>
          ) : (
            <Logo href="/home" size="sm" markOnly />
          )}
        </div>
        {showCart && (
          <Link
            href="/cart"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-stone-200"
            aria-label={`Carrello, ${itemCount} articoli`}
          >
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        )}
      </header>
      <main className="pb-[max(5rem,env(safe-area-inset-bottom))]">{children}</main>
      {showChat && <ChatAssistant />}
    </div>
  );
}
