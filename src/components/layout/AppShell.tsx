"use client";

import Link from "next/link";
import { ShoppingBag, ChevronLeft, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-white text-black selection:bg-black selection:text-white">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-50 bg-white/80 px-6 py-6 backdrop-blur-2xl pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {backHref ? (
            <Link
              href={backHref}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-50 border border-stone-100 text-black transition-all active:scale-90"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={3} />
            </Link>
          ) : (
            <div className="p-2 rounded-xl bg-black shadow-lg shadow-black/10">
              <Logo href="/home" size="sm" markOnly />
            </div>
          )}
          
          <h1 className={`truncate crazy-title ${backHref ? 'text-xl' : 'text-2xl'}`}>
            {backHref ? title : <span>Queue<span className="text-stone-200 ml-0.5">Less</span></span>}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {showCart && (
            <Link
              href="/cart"
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/10 transition-all active:scale-90"
            >
              <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-7 min-w-[28px] items-center justify-center rounded-full border-4 border-white bg-black px-1.5 text-[11px] font-black text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>
      
      <main className="pb-[max(6rem,env(safe-area-inset-bottom))]">{children}</main>
      
      {showChat && <ChatAssistant />}
    </div>
  );
}
