"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Media } from "@content/collections";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/utils";

type Item = Media & { altText: string; captionText?: string; programName?: string };

/**
 * Filterable masonry + accessible lightbox (native <dialog>: focus trap,
 * Escape to close, ←/→ to navigate). Videos show a poster and only play on click.
 */
export function GalleryGrid({ items, filters }: { items: Item[]; filters: { id: string; label: string }[] }) {
  const t = useTranslations("gallery");
  const [filter, setFilter] = useState("all");
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const visible = filter === "all" ? items : items.filter((i) => i.program === filter);
  const current = index !== null ? visible[index] : null;

  const go = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) el.showModal();
    if (index === null && el.open) el.close();
  }, [index]);

  return (
    <>
      <div role="group" aria-label={t("label")} className="mb-8 flex flex-wrap gap-2">
        {[{ id: "all", label: t("all") }, ...filters].map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "min-h-11 rounded-full border-2 px-4 text-sm font-medium transition-colors",
              filter === f.id ? "border-maroon bg-maroon text-cream" : "border-ink/15 hover:border-maroon",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {visible.map((m, i) => (
          <li key={m.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-2xl"
            >
              <Image
                src={m.type === "video" ? m.poster ?? m.src : m.src}
                alt={m.altText}
                width={m.width}
                height={m.height}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="h-auto w-full transition-transform duration-700 group-hover:scale-105"
              />
              {m.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/20">
                  <span className="flex size-16 items-center justify-center rounded-full bg-cream/90 text-maroon">
                    <Icon name="play" size={26} />
                    <span className="sr-only">{t("play")}</span>
                  </span>
                </span>
              )}
              {(m.captionText || m.place) && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10 text-left text-sm text-cream opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {m.captionText} {m.place && `· ${m.place}`} {m.date && `· ${m.date}`}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        aria-label={current?.altText}
        className="m-auto max-h-[92dvh] w-[min(64rem,94vw)] overflow-visible bg-transparent p-0 backdrop:bg-ink/85"
      >
        {current && (
          <figure className="relative">
            {current.type === "video" ? (
              <video src={current.src} poster={current.poster} controls autoPlay playsInline className="max-h-[80dvh] w-full rounded-2xl bg-ink" />
            ) : (
              <Image src={current.src} alt={current.altText} width={current.width} height={current.height} sizes="94vw" className="max-h-[80dvh] w-full rounded-2xl object-contain" />
            )}
            {current.captionText && <figcaption className="mt-3 text-center text-cream">{current.captionText}</figcaption>}
            <div className="mt-3 flex justify-center gap-3">
              <button type="button" onClick={() => go(-1)} className="flex size-12 items-center justify-center rounded-full bg-cream text-ink">
                <Icon name="arrowLeft" /> <span className="sr-only">{t("prev")}</span>
              </button>
              <button type="button" onClick={() => setIndex(null)} className="flex size-12 items-center justify-center rounded-full bg-mustard text-ink" autoFocus>
                <Icon name="close" /> <span className="sr-only">Close</span>
              </button>
              <button type="button" onClick={() => go(1)} className="flex size-12 items-center justify-center rounded-full bg-cream text-ink">
                <Icon name="arrowRight" /> <span className="sr-only">{t("next")}</span>
              </button>
            </div>
          </figure>
        )}
      </dialog>
    </>
  );
}
