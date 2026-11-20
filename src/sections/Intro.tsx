"use client";

import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useScrollProgress } from "@/hooks/useScrollProgress";

/**
 * S3. Intro: words light up as the paragraph scrolls through the viewport.
 * One CSS variable (--p) is updated per frame; each word derives its own colour
 * in CSS. Both colours pass WCAG large-text contrast, so text is always readable
 * (and is fully lit under reduced motion or without JS support for color-mix).
 */
export function Intro() {
  const t = useTranslations("intro");
  const ref = useRef<HTMLParagraphElement>(null);
  const words = t("text").split(" ");
  const keyWords = new Set(["Kasaragod", "Cherkala", "Kanhangad", "dignity", "കാസർഗോഡ്", "ചെർക്കള", "കാഞ്ഞങ്ങാട്"]);

  useScrollProgress(ref, (p) => ref.current?.style.setProperty("--p", p.toFixed(4)), {
    start: ["start", 0.85],
    end: ["end", 0.45],
  });

  return (
    <section aria-labelledby="intro-label" className="bg-cream py-24 sm:py-36">
      <div className="container-page">
        <p id="intro-label" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-maroon">
          <span aria-hidden className="h-px w-8 bg-maroon" />
          {t("label")}
        </p>
        <p
          ref={ref}
          className="scroll-words font-display max-w-5xl text-[1.65rem] leading-[1.35] font-medium sm:text-4xl lg:text-[2.75rem]"
          style={{ "--n": words.length } as CSSProperties}
        >
          {words.map((w, i) => (
            <span key={i} data-accent={keyWords.has(w.replace(/[.,]/g, "")) || undefined} style={{ "--i": i } as CSSProperties}>
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
