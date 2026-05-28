import { tool } from "ai";
import { z } from "zod";
import { resolveOrderDraft } from "./resolve-order";

export const preparaOrdineTool = tool({
  description:
    "Prepara un riepilogo ordine da mostrare all'utente. NON salva nel database. Usa quando l'utente vuole ordinare qualcosa a un bar.",
  parameters: z.object({
    barName: z
      .string()
      .describe('Nome del bar, es. "Bar della Statale", "Politecnico"'),
    item: z.string().describe('Prodotto, es. "caffè", "cappuccino", "cornetto"'),
    time: z
      .string()
      .describe('Orario di ritiro, es. "09:00", "14:30"'),
  }),
  execute: async ({ barName, item, time }) => {
    const result = resolveOrderDraft(barName, item, time);
    if ("error" in result) {
      return { 
        success: false as const, 
        error: result.error,
        suggestions: "suggestions" in result ? result.suggestions : undefined
      };
    }
    return {
      success: true as const,
      draft: result,
    };
  },
});
