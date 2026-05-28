"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Logo } from "@/components/brand/Logo";
import { OrderReviewCard } from "./OrderReviewCard";
import type { OrderDraft } from "@/lib/ai/resolve-order";

type ToolInvocation = {
  toolCallId: string;
  toolName: string;
  state: "partial-call" | "call" | "result";
  args?: Record<string, unknown>;
  result?: any;
};

function extractFromMessage(message: {
  toolInvocations?: ToolInvocation[];
}): { drafts: OrderDraft[]; errors: string[] } {
  const drafts: OrderDraft[] = [];
  const errors: string[] = [];

  message.toolInvocations?.forEach((inv) => {
    if (inv.toolName !== "preparaOrdine" || inv.state !== "result") return;
    const r = inv.result;
    if (!r) return;
    if (r.success && r.draft) drafts.push(r.draft);
    else if (r.error) errors.push(r.error);
  });

  return { drafts, errors };
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      api: "/api/chat",
    });

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, isLoading]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="h-8 w-8" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6 animate-in fade-in duration-300">
          <div className="flex h-[min(85dvh,750px)] w-full max-w-md flex-col overflow-hidden rounded-t-[3rem] bg-white shadow-2xl sm:rounded-[3rem] border border-stone-100">
            <header className="flex items-center justify-between border-b border-stone-50 bg-white px-8 py-6">
              <div className="flex items-center gap-4">
                <Logo href={undefined} size="sm" markOnly />
                <h2 className="crazy-title text-black text-xl tracking-tighter">Queue Less AI</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-50 text-black transition-all hover:bg-stone-100 active:scale-90"
              >
                <X className="h-6 w-6" strokeWidth={2.5} />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-8 overflow-y-auto px-8 py-8 bg-white"
            >
              {messages.length === 0 && (
                <div className="rounded-[2rem] bg-stone-50 p-8">
                  <h3 className="crazy-title text-3xl mb-3 text-black">Ciao.</h3>
                  <p className="text-sm font-bold text-stone-400 uppercase tracking-widest leading-relaxed">
                    Siamo qui per aiutarti. <br />
                    Dì: <span className="text-black italic">&quot;Un espresso al Bar Centrale tra 5 min&quot;</span>
                  </p>
                </div>
              )}

              {messages.map((m) => {
                const { drafts, errors } =
                  m.role === "assistant"
                    ? extractFromMessage(
                        m as { toolInvocations?: ToolInvocation[] },
                      )
                    : { drafts: [], errors: [] };

                const isUser = m.role === "user";

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-2 ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {m.content ? (
                      <div
                        className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 text-sm font-bold leading-relaxed shadow-sm transition-all ${
                          isUser
                            ? "bg-black text-white rounded-tr-none shadow-xl shadow-black/10"
                            : "bg-stone-50 text-black rounded-tl-none border border-stone-100"
                        }`}
                      >
                        {m.content}
                      </div>
                    ) : null}

                    {errors.map((err, i) => (
                      <div key={i} className="rounded-xl bg-red-50 p-4 text-[10px] font-black uppercase text-red-600 border border-red-100">
                        {err}
                      </div>
                    ))}

                    {drafts.map((draft, i) => (
                      <div key={i} className="w-full animate-crazy-in">
                        <OrderReviewCard draft={draft} />
                      </div>
                    ))}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-200" />
                  Thinking
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-[10px] font-black uppercase text-red-700">
                  ERROR: {error.message}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-stone-50 bg-white p-8"
            >
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ordina con un messaggio..."
                  className="crazy-input pr-16 bg-stone-50 border-none h-16 rounded-[1.5rem]"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition-all active:scale-90"
                >
                  <Send className="h-5 w-5" strokeWidth={3} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
