"use client";

import { useState } from "react";

type Pin = { id: string; name: string; kind: "hub" | "area" | "relief"; kindLabel: string; lat: number; lng: number };

// Simple equirectangular projection of the Kasaragod district bounding box into the SVG.
const BOX = { minLng: 74.85, maxLng: 75.45, minLat: 12.05, maxLat: 12.8 };
const W = 600;
const H = 640;
const project = (lat: number, lng: number) => ({
  x: ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * W,
  y: ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * H,
});

const colors = { hub: "#F2B705", area: "#FFF8E7", relief: "#F28A05" };

export function MapPins({ pins, seaLabel }: { pins: Pin[]; seaLabel: string }) {
  const [active, setActive] = useState<string | null>("kasaragod");
  const local = pins.filter((p) => p.kind !== "relief");
  const relief = pins.find((p) => p.kind === "relief");
  const hubs = local.filter((p) => p.kind === "hub").map((p) => project(p.lat, p.lng));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={pins.map((p) => p.name).join(", ")}>
        <defs>
          <linearGradient id="sea" x1="0" x2="1">
            <stop offset="0" stopColor="#141852" />
            <stop offset="1" stopColor="#1B1F6B" />
          </linearGradient>
          <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="rgba(255,248,231,.16)" />
          </pattern>
        </defs>
        {/* land (dotted) east of a stylised coastline; sea to the west */}
        <rect width={W} height={H} fill="url(#sea)" />
        <path
          d={`M98 0 C 100 110, 104 190, 122 256 C 140 320, 200 370, 226 418 C 250 470, 272 560, 290 ${H} L ${W} ${H} L ${W} 0 Z`}
          fill="url(#dots)"
          stroke="rgba(242,183,5,.5)"
          strokeWidth="2"
        />
        <text x="40" y={H - 60} fill="rgba(255,248,231,.4)" fontSize="16" fontStyle="italic" transform={`rotate(-80 40 ${H - 60})`}>
          {seaLabel}
        </text>

        {/* animated routes between the hubs */}
        {hubs.length > 1 && (
          <path
            d={`M${hubs.map((h) => `${h.x} ${h.y}`).join(" L")}`}
            fill="none"
            stroke="#F2B705"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            className="motion-safe:animate-[dash_2s_linear_infinite]"
            opacity=".7"
          />
        )}

        {local.map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const on = active === p.id;
          return (
            <g key={p.id} transform={`translate(${x} ${y})`}>
              <circle r="10" fill={colors[p.kind]} className="motion-safe:animate-pulse-ring" style={{ transformOrigin: "center", transformBox: "fill-box" }} />
              <circle r={on ? 11 : 8} fill={colors[p.kind]} stroke="#1B1F6B" strokeWidth="3" className="transition-all" />
              <text
                x={p.id === "kasaragod" ? -16 : 16}
                y={p.id === "kasaragod" ? 22 : p.id === "cherkala" ? -10 : 6}
                textAnchor={p.id === "kasaragod" ? "end" : "start"}
                fill="#FFF8E7"
                fontSize="18"
                fontWeight="600"
                opacity={on ? 1 : 0.8}
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Wayanad: far south, shown as an inset "beyond the district" card */}
      {relief && (
        <div className="absolute right-3 bottom-3 rounded-2xl bg-cream/10 p-3 text-sm ring-1 ring-cream/20 backdrop-blur">
          <span className="flex items-center gap-2 font-semibold">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: colors.relief }} />
            {relief.name}
          </span>
          <span className="text-cream/70">{relief.kindLabel} ↓</span>
        </div>
      )}

      {/* Focusable pins for keyboard users (the list beside the map is the full text alternative) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {local.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={active === p.id}
            onClick={() => setActive(p.id)}
            onMouseEnter={() => setActive(p.id)}
            className="min-h-11 rounded-full border border-cream/25 px-4 text-sm transition-colors aria-pressed:border-mustard aria-pressed:bg-mustard aria-pressed:text-ink"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
