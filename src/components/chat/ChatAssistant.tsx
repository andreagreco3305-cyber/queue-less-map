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
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black border-2 border-white animate-pulse" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-md sm:items-center sm:p-6 animate-in fade-in duration-300">
          <div className="flex h-[min(85dvh,750px)] w-full max-w-md flex-col overflow-hidden rounded-t-[3rem] bg-white shadow-2xl sm:rounded-[3rem] border-x-4 border-t-4 border-black">
            <header className="flex items-center justify-between border-b-4 border-black bg-white px-8 py-6">
              <div className="flex items-center gap-4">
                <Logo href={undefined} size="sm" markOnly />
                <h2 className="crazy-title text-xl">Predatore AI</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-black transition-all hover:bg-stone-200 active:scale-90"
              >
                <X className="h-6 w-6" strokeWidth={3} />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-8 overflow-y-auto px-8 py-8 bg-white"
            >
              {messages.length === 0 && (
                <div className="crazy-card border-stone-100 !bg-stone-50 !shadow-none">
                  <h3 className="crazy-title text-2xl mb-2">Pausa?</h3>
                  <p className="text-sm font-bold text-stone-500 uppercase tracking-tight">
                    Dì pure: <br />
                    <span className="text-black">&quot;Un cappuccino al Bar Centrale alle 08:30&quot;</span>
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
                    className={`flex flex-col gap-3 ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    {m.content ? (
                      <div
                        className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 text-sm font-black leading-snug shadow-sm ${
                          isUser
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-stone-100 text-black rounded-tl-none border-2 border-transparent"
                        }`}
                      >
                        {m.content}
                      </div>
                    ) : null}

                    {errors.map((err, i) => (
                      <div key={i} className="rounded-xl bg-red-100 p-4 text-[10px] font-black uppercase text-red-600 border-2 border-red-200">
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
                <div className="crazy-title text-[10px] text-stone-300 animate-pulse tracking-[0.3em]">
                  Scansione territorio...
                </div>
              )}

              {error && (
                <div className="rounded-2xl border-4 border-red-500 bg-white p-6 text-xs font-black uppercase text-red-500">
                  FALLIMENTO: {error.message}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t-4 border-black bg-white p-8"
            >
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ordina ora..."
                  className="crazy-input pr-16"
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
