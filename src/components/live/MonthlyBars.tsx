"use client";

import { useState } from "react";
import { formatCount, formatMonth } from "@/lib/format";
import type { MonthTotal } from "@/lib/supabase/types";

/**
 * Tiny stacked bar chart of distribution per month (pure HTML/CSS, no chart lib).
 * Stack order bottom→top: meals · kits · other. Palette validated against the
 * cream surface (dataviz validator); identity is never colour-only: legend,
 * 2px gaps between segments, hover/focus tooltip, and a screen-reader table.
 */
const SERIES = [
  { key: "meals", color: "#a63d3d" },
  { key: "kits", color: "#b98200" },
  { key: "other", color: "#2d8f5a" },
] as const;

export function MonthlyBars({
  months,
  locale,
  labels,
}: {
  months: MonthTotal[];
  locale: string;
  labels: { meals: string; kits: string; other: string; title: string; table: string; month: string; total: string };
}) {
  const data = months.slice(-12);
  const [active, setActive] = useState<string | null>(null);
  if (data.length === 0) return null;
  const max = Math.max(...data.map((m) => m.total), 1);
  const peak = data.reduce((a, b) => (b.total > a.total ? b : a));
  const present = SERIES.filter((s) => data.some((m) => m[s.key] > 0));

  return (
    <figure className="rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-ink/8 sm:p-6">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-display text-xl font-semibold">{labels.title}</h3>
        {present.length > 1 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
            {present.map((s) => (
              <li key={s.key} className="inline-flex items-center gap-1.5">
                <span aria-hidden className="size-2.5 rounded-sm" style={{ background: s.color }} />
                {labels[s.key]}
              </li>
            ))}
          </ul>
        )}
      </figcaption>

      <div aria-hidden className="relative mt-6 flex h-40 items-end gap-1.5 border-b border-ink/15 sm:gap-2.5">
        {data.map((m) => {
          const isActive = active === m.month;
          return (
            <div
              key={m.month}
              className="group relative flex h-full flex-1 cursor-default flex-col justify-end"
              onPointerEnter={() => setActive(m.month)}
              onPointerLeave={() => setActive(null)}
            >
              {m.month === peak.month && !active && (
                <span className="mb-1 text-center text-[0.7rem] font-semibold text-ink tabular">{formatCount(m.total, locale)}</span>
              )}
              <div
                className="flex flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px] transition-opacity"
                style={{ height: `${(m.total / max) * 100}%`, opacity: active && !isActive ? 0.45 : 1 }}
              >
                {SERIES.map((s) =>
                  m[s.key] > 0 ? <span key={s.key} style={{ flexGrow: m[s.key], background: s.color, minHeight: 2 }} /> : null,
                )}
              </div>
              {isActive && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-xl bg-ink px-3 py-2 text-xs text-cream shadow-lg">
                  <p className="font-semibold">{formatMonth(m.month, locale)}</p>
                  {SERIES.filter((s) => m[s.key] > 0).map((s) => (
                    <p key={s.key} className="flex items-center gap-1.5">
                      <span className="size-2 rounded-sm" style={{ background: s.color }} />
                      {labels[s.key]}: <span className="tabular">{formatCount(m[s.key], locale)}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div aria-hidden className="mt-2 flex gap-1.5 sm:gap-2.5">
        {data.map((m) => (
          <span key={m.month} className="flex-1 truncate text-center text-[0.65rem] text-ink-soft sm:text-xs">
            {formatMonth(m.month, locale, "short")}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>{labels.table}</caption>
        <thead>
          <tr>
            <th scope="col">{labels.month}</th>
            {present.map((s) => (
              <th key={s.key} scope="col">{labels[s.key]}</th>
            ))}
            <th scope="col">{labels.total}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m.month}>
              <th scope="row">{formatMonth(m.month, locale)}</th>
              {present.map((s) => (
                <td key={s.key}>{formatCount(m[s.key], locale)}</td>
              ))}
              <td>{formatCount(m.total, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
