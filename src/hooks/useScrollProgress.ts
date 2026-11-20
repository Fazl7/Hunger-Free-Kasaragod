"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tiny replacement for a scroll-animation library (~0.5 KB vs ~55 KB gz).
 * Reports 0→1 progress of an element through the viewport and lets the caller
 * write straight to the DOM (CSS variables / attributes): no React re-renders.
 *
 * `start` / `end` mirror the common "<edge> <viewport fraction>" offsets:
 *   start: ["start", 0.85] → p = 0 when the element's top is at 85% of the viewport
 *   end:   ["end", 0.45]   → p = 1 when the element's bottom is at 45% of the viewport
 */
type Edge = "start" | "end";

export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  { start = ["start", 1] as [Edge, number], end = ["end", 0] as [Edge, number] } = {},
) {
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let visible = false;

    const edgeY = (r: DOMRect, edge: Edge) => (edge === "start" ? r.top : r.bottom);
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = edgeY(r, start[0]) - vh * start[1]; // >0 before start
      const to = edgeY(r, end[0]) - vh * end[1]; // >0 before end
      const span = from - to;
      const p = span === 0 ? (to <= 0 ? 1 : 0) : from / span;
      cb.current(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(measure);
    };

    // Only listen while the element is near the viewport.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- offsets are static per call site
  }, [ref]);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
