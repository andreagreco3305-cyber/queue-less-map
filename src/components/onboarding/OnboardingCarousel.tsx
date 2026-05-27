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
    <section className="flex flex-1 flex-col overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ONBOARDING_SLIDES.map((slide, index) => {
          const Icon = slide.icon;
          return (
            <article
              key={slide.id}
              className="flex min-w-full snap-center flex-col items-start justify-center px-10"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-100">
                <Icon className="h-8 w-8 text-black" strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-black">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-stone-500">
                {slide.subtitle}
              </p>
            </article>
          );
        })}
      </div>

      <div className="px-10 pb-8">
        <SlideIndicators
          count={slideCount}
          activeIndex={activeIndex}
          onSelect={(index) => {
            const el = scrollRef.current;
            if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
          }}
        />
      </div>
    </section>
  );
}
