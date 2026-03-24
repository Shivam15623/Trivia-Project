import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TestimonialCard from "./TestimonialCard";

const GRADIENT_GOLD =
  "linear-gradient(254.74deg, #FCD645 37.35%, #FCB734 47.07%, #FC9924 61.5%)";
const GRADIENT_CYAN = "linear-gradient(180deg, #7BFDFD 38.94%, #2884C7 61.54%)";

interface Testimonial {
  review: string;
  user?: { name: string; picture?: string; job: string };
}

const testimonials: Testimonial[] = [
  {
    review:
      "This is exactly the kind of game you play when everyone’s together and no one knows what to do.",
    user: { name: "Aarav Mehta", job: "Student" },
  },
  {
    review:
      "It lowkey humbles you 😅 you think you know stuff until you actually get asked.",
    user: { name: "Riya Sharma", job: "College student" },
  },
  {
    review:
      "Finally something where knowing random stuff about movies and anime is actually useful 😂",
    user: { name: "Kabir Verma", job: "Gamer" },
  },
  {
    review:
      "We play this every weekend with friends. Simple to start, hard to stop.",
    user: { name: "Neha Patel", job: "Youtuber" },
  },
  {
    review: "Simple idea, but really fun execution.",
    user: { name: "Arjun Singh", job: "Content Creater" },
  },
];

const GAP = 24; // px between cards

const TestimonialSlider: React.FC = () => {
  const [centerIndex, setCenterIndex] = useState(1);
  const directionRef = useRef<1 | -1>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [minCardHeight, setMinCardHeight] = useState<number | undefined>(
    undefined,
  );
  // Refs to all rendered card wrappers so we can measure them
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const total = testimonials.length;

  // Measure container on mount + resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const isMobile = containerWidth > 0 && containerWidth < 650;
  const isMedium = containerWidth >= 650 && containerWidth < 1000;
  const cardCount = isMobile ? 1 : isMedium ? 2 : 3;
  const cardWidth = isMobile
    ? containerWidth
    : isMedium
      ? (containerWidth - GAP) / 2
      : (containerWidth - GAP * 2) / 3;
  const slideUnit = cardWidth + GAP;

  // On mobile: after each render, check if the current card is taller than our stored max
  // and update minCardHeight so all cards are rendered at least that tall.
  useEffect(() => {
    if (!isMobile) {
      // Reset when leaving mobile so height doesn't bleed into other breakpoints
      setMinCardHeight(undefined);
      return;
    }
    const el = cardRefs.current.get(centerIndex);
    if (!el) return;
    const h = el.getBoundingClientRect().height;
    setMinCardHeight((prev) => (prev === undefined || h > prev ? h : prev));
  }, [centerIndex, isMobile, cardWidth]);

  const getVisibleIndices = useCallback(
    (center: number) => {
      if (isMobile) return [center];
      if (isMedium) {
        const left = (center - 1 + total) % total;
        return [left, center];
      }
      const left = (center - 1 + total) % total;
      const right = (center + 1) % total;
      return [left, center, right];
    },
    [total, isMobile, isMedium],
  );

  const visibleIndices = getVisibleIndices(centerIndex);

  const getGradient = (_idx: number, position: number) => {
    if (isMobile) return GRADIENT_CYAN;
    return position === 1 ? GRADIENT_CYAN : GRADIENT_GOLD;
  };

  const enterX = directionRef.current * slideUnit;
  const exitX = directionRef.current * -slideUnit;

  const wrapperWidth =
    containerWidth > 0 ? cardWidth * cardCount + GAP * (cardCount - 1) : "100%";

  return (
    <div className="relative z-10 flex w-full flex-col items-center gap-8">
      <div className="relative flex w-full max-w-[1280px] items-center justify-center">
        <img
          src="/home/3Stars.png"
          className="absolute -bottom-[57px] -left-[51px] z-20 hidden md:block"
        />
        <img
          src="/home/testimonialtop.png"
          className="absolute -right-[8px] -top-[23px] z-20 max-h-[50px] max-w-[50px] md:-right-[36px] md:-top-[50px] md:max-h-none md:max-w-none"
        />
        <div
          ref={containerRef}
          className="relative flex w-full max-w-[1280px] overflow-hidden px-4"
        >
          <div
            style={{ width: wrapperWidth }}
            className="relative flex items-stretch"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visibleIndices.map((tIdx, position) => (
                <motion.div
                  key={`${centerIndex}-${position}`}
                  initial={{ x: enterX, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: exitX, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  style={{
                    width: cardWidth > 0 ? cardWidth : "100%",
                    flexShrink: 0,
                    marginLeft: position === 0 ? 0 : GAP,
                    // Enforce uniform height on mobile once we've measured the tallest card
                    ...(isMobile && minCardHeight !== undefined
                      ? { minHeight: minCardHeight }
                      : {}),
                  }}
                  className="flex"
                  ref={(el) => {
                    if (el) cardRefs.current.set(tIdx, el);
                    else cardRefs.current.delete(tIdx);
                  }}
                >
                  <TestimonialCard
                    gradient={getGradient(tIdx, position)}
                    review={testimonials[tIdx].review}
                    user={testimonials[tIdx].user}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              directionRef.current = i > centerIndex ? 1 : -1;
              setCenterIndex(i);
            }}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i === centerIndex ? "bg-secondary" : "bg-muted-foreground"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
