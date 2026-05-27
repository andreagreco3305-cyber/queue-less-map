import { streamText } from "ai";
import { QUEUE_LESS_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getOpenRouterApiKey, getOpenRouterModel } from "@/lib/ai/openrouter";
import { preparaOrdineTool } from "@/lib/ai/tools";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email_confirmed_at) {
      return new Response(
        JSON.stringify({
          error: "Devi essere autenticato per usare l'assistente.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!getOpenRouterApiKey()) {
      return new Response(
        JSON.stringify({
          error:
            "Chiave OpenRouter mancante. Aggiungi OPENROUTER_API_KEY in .env.local e riavvia npm run dev.",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } },
      );
    }

    const { messages } = await req.json();

    const result = streamText({
      model: getOpenRouterModel(),
      system: QUEUE_LESS_SYSTEM_PROMPT,
      messages,
      tools: { preparaOrdine: preparaOrdineTool },
      maxSteps: 3,
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error("[chat]", e);
    return new Response(JSON.stringify({ error: "Errore dell'assistente OpenRouter. Riprova." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
