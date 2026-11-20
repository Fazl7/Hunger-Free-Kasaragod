"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up when scrolled into view. The FINAL value is server-rendered, so
 * crawlers, no-JS and reduced-motion users always see the real number.
 */
export function CountUp({ value, locale, duration = 1600 }: { value: number; locale: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const fmt = new Intl.NumberFormat(locale === "ml" ? "ml-IN" : "en-IN");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already visible: don't flash to 0

    let raf = 0;
    setDisplay(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(Math.round(value * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular">
      {/* Screen readers get the final value only, never the ticking numbers. */}
      <span aria-hidden="true">{fmt.format(display)}</span>
      <span className="sr-only">{fmt.format(value)}</span>
    </span>
  );
}
