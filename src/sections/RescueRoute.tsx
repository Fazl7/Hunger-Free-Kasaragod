"use client";

import { useRef } from "react";
import { prefersReducedMotion, useScrollProgress } from "@/hooks/useScrollProgress";

const D = "M40 90 C 180 10, 260 150, 400 80 S 640 20, 760 80 S 900 130, 960 70";

/**
 * Decorative: the route draws itself as you scroll and a van drives along it.
 * A small one-time burst marks "Distribute". Desktop only (md+), hidden from AT.
 */
export function RescueRoute() {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const van = useRef<SVGGElement>(null);
  const burst = useRef<SVGGElement>(null);

  useScrollProgress(
    wrap,
    (target) => {
      const p = path.current;
      const g = van.current;
      if (!p || !g) return;
      const v = prefersReducedMotion() ? 1 : target;
      p.style.strokeDashoffset = String(1 - v);
      const len = p.getTotalLength();
      const at = v * len;
      const pt = p.getPointAtLength(at);
      const ahead = p.getPointAtLength(Math.min(len, at + 1));
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      g.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
      if (v > 0.97) burst.current?.classList.add("burst-on");
    },
    { start: ["start", 0.9], end: ["end", 0.35] },
  );

  return (
    <div ref={wrap} aria-hidden className="relative mb-6 hidden md:block">
      <svg viewBox="0 0 1000 160" className="h-auto w-full overflow-visible">
        <path d={D} fill="none" stroke="rgba(255,248,231,.18)" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
        <path
          ref={path}
          d={D}
          pathLength={1}
          fill="none"
          stroke="#F2B705"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1"
          style={{ strokeDashoffset: 1, transition: "stroke-dashoffset 120ms linear" }}
        />
        {[
          [40, 90],
          [400, 80],
          [960, 70],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="13" fill="#4B1E7A" stroke="#F2B705" strokeWidth="4" />
            <circle cx={x} cy={y} r="4" fill="#F2B705" />
          </g>
        ))}
        <g ref={van} transform="translate(40 90)">
          <g transform="translate(-22 -30)">
            <rect x="0" y="6" width="28" height="20" rx="4" fill="#FFF8E7" />
            <path d="M28 12h9l7 8v6H28z" fill="#FFF8E7" />
            <rect x="31" y="14" width="6" height="5" rx="1" fill="#4B1E7A" />
            <circle cx="9" cy="27" r="4.5" fill="#1E1A17" />
            <circle cx="35" cy="27" r="4.5" fill="#1E1A17" />
            <path d="M6 15l4 4 7-7" fill="none" stroke="#2E7D4F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
        {/* one-time burst at Distribute (CSS animation, plays once when the class is added) */}
        <g ref={burst} className="burst" transform="translate(960 70)" stroke="#F2B705" strokeWidth="4" strokeLinecap="round">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1="0" y1="-22" x2="0" y2="-40" transform={`rotate(${i * 36})`} />
          ))}
        </g>
      </svg>
    </div>
  );
}
