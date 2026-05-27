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
        className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500 active:scale-95 max-md:right-4 md:right-[max(1rem,calc(50%-14rem))]"
        aria-label="Apri assistente AI"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <div className="flex h-[min(85dvh,640px)] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-stone-50 shadow-2xl sm:rounded-3xl">
            <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
              <Logo href={undefined} size="sm" markOnly />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-stone-500 hover:bg-stone-100"
                aria-label="Chiudi"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900">
                  <p className="font-semibold">Assistente Queue Less</p>
                  <p className="mt-1 text-indigo-800/90">
                    Prova:{" "}
                    <em className="font-medium not-italic">
                      ordinami un caffè al bar della statale alle 9
                    </em>
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

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-2 ${
                      m.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    {m.content ? (
                      <div
                        className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          m.role === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-stone-800 ring-1 ring-stone-200"
                        }`}
                      >
                        {m.content}
                      </div>
                    ) : null}

                    {errors.map((err, i) => (
                      <p
                        key={`err-${i}`}
                        className="max-w-[90%] rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900"
                      >
                        {err}
                      </p>
                    ))}

                    {drafts.map((draft, i) => (
                      <div key={`draft-${i}`} className="w-full max-w-[95%]">
                        <OrderReviewCard draft={draft} />
                      </div>
                    ))}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Assistente in elaborazione…
                </div>
              )}

              {error && (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error.message}
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-stone-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
            >
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Messaggio…"
                  className="flex-1 rounded-2xl border border-stone-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white disabled:opacity-40"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
