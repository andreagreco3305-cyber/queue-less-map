"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Logo } from "@/components/brand/Logo";
import { OrderReviewCard } from "./OrderReviewCard";
import type { OrderDraft } from "@/lib/ai/resolve-order";

type PreparaOrdineResult = {
  success: boolean;
  draft?: OrderDraft;
  error?: string;
};

type ToolInvocation = {
  toolCallId: string;
  toolName: string;
  state: "partial-call" | "call" | "result";
  args?: Record<string, unknown>;
  result?: PreparaOrdineResult;
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
    else if (!r.success && "error" in r && r.error) errors.push(r.error);
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
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
        aria-label="Apri assistente AI"
      >
        <MessageCircle className="h-7 w-7" />
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 border-2 border-white animate-pulse" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6 animate-in fade-in duration-200">
          <div className="flex h-[min(85dvh,700px)] w-full max-w-md flex-col overflow-hidden rounded-t-[2.5rem] bg-white shadow-[0_0_80px_rgba(0,0,0,0.3)] sm:rounded-[2.5rem]">
            <header className="flex items-center justify-between border-b border-stone-100 bg-white px-6 py-5">
              <div className="flex items-center gap-3">
                <Logo href={undefined} size="sm" markOnly />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-tighter">Assistant</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Always Live</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-50 text-stone-500 transition-all hover:bg-stone-100 active:scale-90"
                aria-label="Chiudi"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-6 overflow-y-auto px-6 py-6 bg-stone-50/30"
            >
              {messages.length === 0 && (
                <div className="rounded-[1.5rem] border border-stone-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-2">Welcome</p>
                  <h3 className="text-lg font-bold tracking-tight text-black leading-tight">
                    Ciao. Cosa posso prepararti oggi?
                  </h3>
                  <p className="mt-2 text-sm font-medium text-stone-500 leading-relaxed">
                    Puoi dirmi: <br />
                    <span className="text-black italic">&quot;Prenotami un caffè al Tech Coffee alle 10:30&quot;</span>
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
                        className={`max-w-[85%] rounded-[1.2rem] px-5 py-3.5 text-sm font-medium leading-relaxed shadow-sm transition-all ${
                          isUser
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-white text-stone-800 ring-1 ring-stone-100 rounded-tl-none"
                        }`}
                      >
                        {m.content}
                      </div>
                    ) : null}

                    {errors.map((err, i) => (
                      <div
                        key={`err-${i}`}
                        className="max-w-[85%] rounded-[1rem] bg-red-50 px-4 py-3 text-xs font-bold text-red-600 border border-red-100 uppercase tracking-tight"
                      >
                        {err}
                      </div>
                    ))}

                    {drafts.map((draft, i) => (
                      <div key={`draft-${i}`} className="w-full max-w-[95%] animate-in zoom-in-95 duration-300">
                        <OrderReviewCard draft={draft} />
                      </div>
                    ))}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                  <div className="flex gap-1">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-stone-300" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-stone-300 [animation-delay:0.2s]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-stone-300 [animation-delay:0.4s]" />
                  </div>
                  Thinking
                </div>
              )}

              {error && (
                <div className="rounded-[1rem] border border-red-100 bg-red-50 p-4 text-xs font-bold text-red-700">
                  {error.message}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-stone-100 bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Scrivi qui..."
                  className="h-14 w-full rounded-2xl bg-stone-100 px-6 pr-16 text-sm font-medium outline-none transition-all focus:bg-white focus:ring-4 focus:ring-black/5"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition-all active:scale-90 disabled:opacity-20"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
