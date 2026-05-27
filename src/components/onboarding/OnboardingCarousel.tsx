"use client";

import { useCallback, useRef, useState } from "react";
import { ONBOARDING_SLIDES } from "./slides";
import { SlideIndicators } from "./SlideIndicators";

type OnboardingCarouselProps = {
  onReachLastSlide?: () => void;
};

export function OnboardingCarousel({ onReachLastSlide }: OnboardingCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slideCount = ONBOARDING_SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(index, slideCount - 1));
      setActiveIndex(next);
      const el = scrollRef.current;
      if (el) {
        el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
      }
      if (next === slideCount - 1) onReachLastSlide?.();
    },
    [slideCount, onReachLastSlide],
  );

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== activeIndex) {
      setActiveIndex(index);
      if (index === slideCount - 1) onReachLastSlide?.();
    }
  };

  return (
    <section className="flex flex-1 flex-col" aria-label="Presentazione Queue Less">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ONBOARDING_SLIDES.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = index === activeIndex;

          return (
            <article
              key={slide.id}
              className="flex min-w-full snap-center flex-col items-center justify-center px-8 pb-4 pt-6"
              aria-hidden={!isActive}
            >
              <div
                className={`mb-10 flex h-28 w-28 items-center justify-center rounded-3xl bg-indigo-50 shadow-sm ring-1 ring-indigo-100 transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-50"
                }`}
              >
                <Icon
                  className="h-14 w-14 text-indigo-600"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <h1 className="max-w-xs text-center text-3xl font-bold leading-tight tracking-tight text-stone-900">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-[280px] text-center text-base leading-relaxed text-stone-500">
                {slide.subtitle}
              </p>
            </article>
          );
        })}
      </div>

      <div className="px-8 pb-2">
        <SlideIndicators
          count={slideCount}
          activeIndex={activeIndex}
          onSelect={goTo}
        />
      </div>
    </section>
  );
}
