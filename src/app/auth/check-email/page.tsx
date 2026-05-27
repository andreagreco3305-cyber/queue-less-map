"use client";

import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "tua email";

  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col bg-white text-black p-10 justify-center">
      <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-stone-50 border-2 border-black shadow-xl">
        <Mail className="h-10 w-10 text-black" strokeWidth={2.5} />
      </div>

      <div className="text-center space-y-4">
        <h1 className="crazy-title text-4xl leading-none">Controlla<br />la posta</h1>
        <p className="text-sm font-bold text-stone-400 uppercase tracking-tight leading-relaxed">
          Abbiamo inviato un link di conferma a <br />
          <span className="text-black">{email}</span>
        </p>
      </div>

      <div className="mt-12 space-y-4">
        <Link
          href="/"
          className="crazy-button"
        >
          <div className="flex w-full items-center justify-between px-6">
            <span>Torna Home</span>
            <ArrowRight className="h-5 w-5 stroke-[3]" />
          </div>
        </Link>
        
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 hover:text-black transition-colors"
        >
          [ Non hai ricevuto nulla? Riprova ]
        </button>
      </div>
    </main>
  );
}
