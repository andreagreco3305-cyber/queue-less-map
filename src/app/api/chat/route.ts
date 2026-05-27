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

    // Permetti l'accesso se l'utente è reale su Supabase OPPURE se è l'utente demo
    // (L'utente demo non verrà trovato da supabase.auth.getUser() perché è locale)
    // Per semplicità nell'MVP, se non troviamo l'utente da Supabase, controlliamo se la richiesta 
    // ha un header o un token che indica la demo, o semplicemente rilassiamo il controllo per l'MVP.
    
    // NOTA: In produzione questo andrebbe protetto meglio, ma per l'MVP demo:
    // if (!user) { ... } -> lo cambiamo per essere più permissivo

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
    const errorMessage = e instanceof Error ? e.message : "Errore sconosciuto";
    return new Response(JSON.stringify({ error: `Dettaglio errore: ${errorMessage}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
