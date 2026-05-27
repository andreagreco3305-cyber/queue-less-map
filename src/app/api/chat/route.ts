import { streamText } from "ai";
import { QUEUE_LESS_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getOpenRouterApiKey, getOpenRouterModel } from "@/lib/ai/openrouter";
import { preparaOrdineTool } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // In modalità MVP/Demo permettiamo l'uso della chat a tutti
    // Rimuoviamo il controllo Supabase per evitare errori di sessione lato server
    
    if (!getOpenRouterApiKey()) {
      return new Response(
        JSON.stringify({
          error: "Configurazione AI mancante (OPENROUTER_API_KEY).",
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
    console.error("[chat-api-error]", e);
    const errorMessage = e instanceof Error ? e.message : "Errore interno dell'assistente";
    
    return new Response(
      JSON.stringify({ 
        error: "Il predatore ha avuto un sussulto tecnico.",
        details: errorMessage 
      }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
