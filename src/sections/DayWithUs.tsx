"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { useScrollProgress } from "@/hooks/useScrollProgress";

type Frame = {
  key: "dawn" | "midday" | "evening";
  href: string;
  icon: IconKey;
  sky: string;
  accent: string;
};

const frames: Frame[] = [
  { key: "dawn", href: "/programs/daily-food", icon: "plate", sky: "from-[#FBE3A1] to-[#F8C8A0]", accent: "bg-maroon" },
  { key: "midday", href: "/programs/100-kit-month", icon: "kit", sky: "from-[#FFF3C4] to-[#FBE3A1]", accent: "bg-navy" },
  { key: "evening", href: "/programs/celebrating-together", icon: "van", sky: "from-[#4B1E7A] to-[#1B1F6B]", accent: "bg-mustard" },
];

/**
 * S5. A Day With Us. Desktop + motion: a pinned horizontal story where the sun
 * arcs across the sky from dawn to evening. Mobile or reduced motion: a plain
 * vertical stack (same content, no pinning, no scroll-jacking).
 */
export function DayWithUs() {
  const t = useTranslations("day");

  return (
    <section aria-labelledby="day-title" className="bg-cream">
      <div className="container-page pt-20 sm:pt-28">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-maroon">
          <span aria-hidden className="h-px w-8 bg-maroon" />
          {t("label")}
        </p>
        <h2 id="day-title" className="max-w-3xl text-[2rem] leading-[1.1] font-semibold sm:text-5xl">
          {t("heading")}
        </h2>
      </div>

      {/* Desktop pinned version */}
      <div className="hidden lg:motion-safe:block">
        <Pinned />
      </div>

      {/* Mobile / reduced-motion version */}
      <ol className="container-page grid gap-6 py-14 lg:motion-safe:hidden lg:grid-cols-3">
        {frames.map((f) => (
          <li key={f.key} data-reveal="up">
            <FrameCard f={f} compact />
          </li>
        ))}
      </ol>
    </section>
  );
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const sun = useRef<HTMLDivElement>(null);

  useScrollProgress(
    ref,
    (p) => {
      const x = Math.min(1, Math.max(0, (p - 0.05) / 0.9)) * -66.6667;
      if (track.current) track.current.style.transform = `translate3d(${x}%,0,0)`;
      if (sun.current) {
        // half-circle arc: left → right, peaking at midday
        const sx = lerp(6, 88, p);
        const sy = 16 - Math.sin(p * Math.PI) * 13;
        sun.current.style.transform = `translate3d(${sx}vw, ${sy}vh, 0)`;
        sun.current.style.backgroundColor = p < 0.5 ? "#F2B705" : `hsl(${45 - (p - 0.5) * 24}, 96%, ${50 - (p - 0.5) * 6}%)`;
      }
    },
    { start: ["start", 0], end: ["end", 1] },
  );

  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <div
          ref={sun}
          aria-hidden
          className="absolute top-0 left-0 z-0 size-20 rounded-full bg-mustard shadow-[0_0_60px_20px_rgba(242,183,5,.45)] will-change-transform"
          style={{ transform: "translate3d(6vw,16vh,0)" }}
        />
        <ol ref={track} className="relative z-10 flex w-[300%] shrink-0 pt-16 will-change-transform">
          {frames.map((f) => (
            <li key={f.key} className="flex w-1/3 items-center justify-center px-10">
              <FrameCard f={f} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function FrameCard({ f, compact = false }: { f: Frame; compact?: boolean }) {
  const t = useTranslations("day");
  const c = useTranslations("common");
  const dark = f.key === "evening";
  return (
    <article
      className={`relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br ${f.sky} ${dark ? "text-cream" : "text-ink"} ${
        compact ? "h-full" : "min-h-[30rem] grid-cols-[1fr_1.1fr] items-center"
      }`}
    >
      <div className={compact ? "p-7" : "p-14"}>
        <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${dark ? "bg-cream/15" : "bg-ink/8"}`}>
          <Icon name="calendar" size={16} />
          {t(f.key)}
        </p>
        <h3 className={`mt-4 font-semibold ${compact ? "text-2xl" : "text-5xl leading-tight"}`}>{t(`${f.key}Title`)}</h3>
        <p className={`mt-4 ${compact ? "" : "max-w-md text-lg"} ${dark ? "text-cream/85" : "text-ink-soft"}`}>{t(`${f.key}Body`)}</p>
        <Link
          href={f.href}
          className={`mt-6 inline-flex min-h-11 items-center gap-2 font-semibold underline-offset-4 hover:underline ${dark ? "text-mustard" : "text-maroon"}`}
        >
          {c("learnMore")}
          <span className="sr-only">: {t(`${f.key}Title`)}</span>
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
      {!compact && (
        <div aria-hidden className="relative flex h-full items-center justify-center">
          <div className={`absolute size-80 rounded-full ${f.accent} opacity-90`} />
          <Icon name={f.icon} size={170} strokeWidth={1.1} className={`relative ${dark ? "text-ink" : "text-cream"}`} />
        </div>
      )}
    </article>
  );
}
