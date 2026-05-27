"use client";

import Link from "next/link";
import { ShoppingBag, ChevronLeft } from "lucide-react";
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
    <div className="mx-auto min-h-[100dvh] max-w-md bg-white">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-100 bg-white/80 px-4 py-4 backdrop-blur-xl pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-black transition-all active:scale-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : (
            <Logo href="/home" size="sm" markOnly />
          )}
          
          <h1 className={`truncate font-black uppercase tracking-tighter text-black ${backHref ? 'text-lg' : 'text-xl'}`}>
            {backHref ? title : <span>Queue<span className="text-stone-300 text-sm">Less</span></span>}
          </h1>
        </div>

        {showCart && (
          <Link
            href="/cart"
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black shadow-lg shadow-black/10 transition-all active:scale-90"
            aria-label={`Carrello, ${itemCount} articoli`}
          >
            <ShoppingBag className="h-5 w-5 text-white" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 min-w-[24px] items-center justify-center rounded-full border-2 border-white bg-black px-1 text-[10px] font-black text-white">
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
