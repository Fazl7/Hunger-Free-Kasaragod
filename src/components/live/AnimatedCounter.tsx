"use client";

import { useEffect, useRef, useState } from "react";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * <AnimatedCounter value={125000} locale="ml" />
 *
 * - Server-renders the FINAL value (crawlers, no-JS and reduced-motion users see the real number).
 * - Counts up from 0 the first time it scrolls into view (only if it starts off-screen).
 * - When `value` changes later (realtime update), it animates from the old to the new number.
 * - `value === null` renders a skeleton, never a fake 0.
 * - Indian grouping (1,25,000); Malayalam digits when locale is "ml".
 */
export function AnimatedCounter({
  value,
  locale,
  duration = 1600,
  className,
  skeletonClassName,
}: {
  value: number | null;
  locale: string;
  duration?: number;
  className?: string;
  skeletonClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value ?? 0);
  const shown = useRef(value ?? 0); // the number currently on screen
  const seen = useRef(false);

  useEffect(() => {
    if (value === null) return;
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const animate = (from: number) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const n = Math.round(from + (value - from) * (1 - Math.pow(1 - t, 4)));
        shown.current = n;
        setDisplay(n);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    if (reduce || !el) {
      shown.current = value;
      setDisplay(value);
      return;
    }

    // Later updates (realtime): animate old → new right away.
    if (seen.current) {
      if (shown.current !== value) animate(shown.current);
      return () => cancelAnimationFrame(raf);
    }

    // First reveal: if already on screen, don't flash to 0.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      seen.current = true;
      shown.current = value;
      setDisplay(value);
      return;
    }
    shown.current = 0;
    setDisplay(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        seen.current = true;
        animate(0);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  if (value === null) {
    return (
      <span
        aria-hidden
        className={cn("inline-block h-[0.9em] w-[3.5ch] animate-pulse rounded-lg bg-current/15 align-middle", skeletonClassName)}
      />
    );
  }

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {/* Screen readers get the final value only, never the ticking numbers. */}
      <span aria-hidden="true">{formatCount(display, locale)}</span>
      <span className="sr-only">{formatCount(value, locale)}</span>
    </span>
  );
}
