import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function getGeminiApiKey(): string | undefined {
  return (
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
}

export function getGeminiModel() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY non configurata");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google("gemini-2.0-flash");
}
