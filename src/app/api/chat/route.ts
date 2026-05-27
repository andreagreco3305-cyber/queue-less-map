import { streamText } from "ai";
import { QUEUE_LESS_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { getOpenRouterApiKey, getOpenRouterModel } from "@/lib/ai/openrouter";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: getOpenRouterModel(),
      system: QUEUE_LESS_SYSTEM_PROMPT,
      messages,
      // Temporaneamente rimosso il tool per isolare l'Internal Server Error
      maxSteps: 1, 
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error("[chat-api-error]", e);
    return new Response(JSON.stringify({ error: "Server Error", details: String(e) }), { status: 500 });
  }
}
