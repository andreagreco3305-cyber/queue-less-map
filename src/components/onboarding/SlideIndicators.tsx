"use client";

type SlideIndicatorsProps = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function SlideIndicators({
  count,
  activeIndex,
  onSelect,
}: SlideIndicatorsProps) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Slide onboarding"
    >
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Slide ${index + 1}`}
            onClick={() => onSelect(index)}
            className="rounded-full p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-200 ${
                isActive ? "w-6 bg-indigo-600" : "w-2 bg-stone-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
