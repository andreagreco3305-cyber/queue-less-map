import { Coffee, Zap, Timer } from "lucide-react";
import type { OnboardingSlide } from "./types";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "speed",
    title: "Meno coda, più vita.",
    subtitle: "Ordina in un attimo e ritira senza attese al bancone.",
    icon: Zap,
  },
  {
    id: "time",
    title: "Il tuo tempo è prezioso.",
    subtitle: "Scegli l'orario di ritiro e trova tutto pronto al tuo arrivo.",
    icon: Timer,
  },
  {
    id: "quality",
    title: "Qualità garantita.",
    subtitle: "I migliori bar della città a portata di click.",
    icon: Coffee,
  },
];
