import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";

type Tone = "cream" | "deep" | "navy" | "purple" | "maroon" | "mustard";

const tones: Record<Tone, string> = {
  cream: "bg-cream text-ink",
  deep: "bg-cream-deep text-ink",
  navy: "on-dark bg-navy text-cream",
  purple: "on-dark bg-purple text-cream",
  maroon: "on-dark bg-maroon text-cream",
  mustard: "bg-mustard text-ink",
};

export function Section({
  id,
  tone = "cream",
  className,
  children,
  labelledBy,
  lazy = true,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  /** Use content-visibility:auto to skip off-screen rendering work. */
  lazy?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("relative py-20 sm:py-28", tones[tone], lazy && "cv-auto", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  id,
  label,
  title,
  sub,
  align = "left",
  dark = false,
  className,
}: {
  id: string;
  label?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {label && (
        <p
          className={cn(
            "mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]",
            dark ? "text-mustard" : "text-maroon",
          )}
        >
          <span aria-hidden className={cn("h-px w-8", dark ? "bg-mustard" : "bg-maroon")} />
          {label}
        </p>
      )}
      <h2 id={id} className="text-[2rem] leading-[1.1] font-semibold sm:text-5xl">
        {title}
      </h2>
      {sub && <p className={cn("mt-5 text-lg", dark ? "text-cream/85" : "text-ink-soft")}>{sub}</p>}
    </Reveal>
  );
}
