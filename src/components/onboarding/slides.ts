import { Zap, Clock, ShieldCheck } from "lucide-react";
import type { OnboardingSlide } from "./types";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "speed",
    title: "Veloce come un pensiero.",
    subtitle: "Ordina i tuoi prodotti preferiti prima di arrivare. Zero attese, solo gusto.",
    icon: Zap,
  },
  {
    id: "time",
    title: "Riprenditi il tuo tempo.",
    subtitle: "Basta file infinite. Arrivi, prendi e vai. Il tuo tempo vale più di un'attesa alla cassa.",
    icon: Clock,
  },
  {
    id: "premium",
    title: "Esperienza d'élite.",
    subtitle: "Un servizio pensato per chi cerca l'efficienza senza rinunciare alla qualità.",
    icon: ShieldCheck,
  },
];
