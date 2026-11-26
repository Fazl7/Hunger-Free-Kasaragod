"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { PHOTO_COLUMNS, type PhotoRow } from "@/lib/supabase/types";
import { pick } from "@/lib/format";
import { Icon } from "@/components/icons/Icon";

const PAGE = 12;

/**
 * Masonry photo grid (3/2/1 columns) with a staggered reveal, hover lift and an
 * accessible lightbox (native <dialog>: Escape closes, ←/→ and swipe navigate).
 * The first page is server-rendered; "Load more" fetches 12 at a time.
 */
export function PhotoGrid({ initial, total }: { initial: PhotoRow[]; total: number }) {
  const t = useTranslations("galleryPage");
  const locale = useLocale();
  const [rows, setRows] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [index, setIndex] = useState<number | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const hasMore = rows.length < total;

  const captionOf = (p: PhotoRow) => pick(p.caption_en, p.caption_ml, locale);
  const altOf = (p: PhotoRow) => captionOf(p) || t("photoAlt");
  const current = index !== null ? rows[index] : null;

  /* Reveal tiles as they scroll in (also covers tiles added by "Load more"). */
  useEffect(() => {
    const els = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])") ?? []);
    if (!("IntersectionObserver" in window)) return els.forEach((el) => el.setAttribute("data-shown", ""));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rows]);

  /* Open/close the native dialog with the selected index. */
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) el.showModal();
    if (index === null && el.open) el.close();
  }, [index]);

  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + rows.length) % rows.length)), [rows.length]);

  async function loadMore() {
    const sb = getBrowserSupabase();
    if (!sb) return setState("error");
    setState("loading");
    const { data, error } = await sb
      .from("gallery_photos")
      .select(PHOTO_COLUMNS)
      .eq("is_published", true)
      .order("sort_order")
      .order("created_at", { ascending: false })
      .range(rows.length, rows.length + PAGE - 1);
    if (error) return setState("error");
    setRows((prev) => {
      const seen = new Set(prev.map((r) => r.id));
      return [...prev, ...(data as PhotoRow[]).filter((r) => !seen.has(r.id))];
    });
    setState("idle");
  }

  return (
    <>
      <ul ref={list} className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5" aria-busy={state === "loading"}>
        {rows.map((p, i) => {
          const caption = captionOf(p);
          return (
            <li
              key={p.id}
              data-reveal="up"
              className="break-inside-avoid"
              style={{ "--reveal-delay": `${(i % 3) * 0.09}s` } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("open", { title: altOf(p) })}
                className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] bg-cream-deep ring-1 ring-ink/8 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-30px_rgba(122,31,31,.65)]"
              >
                <Image
                  src={p.thumb_url}
                  alt={altOf(p)}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="h-auto w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover:scale-[1.06]"
                />
                {/* Soft maroon wash + caption slide-up on hover/focus */}
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-maroon-deep/85 via-maroon/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span
                  aria-hidden
                  className="absolute top-3 right-3 flex size-10 scale-75 items-center justify-center rounded-full bg-mustard text-ink opacity-0 shadow-lg transition-[opacity,transform] duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                >
                  <Icon name="eye" size={18} />
                </span>
                {caption && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left text-sm leading-snug font-medium text-cream opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {caption}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {hasMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={state === "loading"}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-maroon px-7 py-3 font-semibold text-cream shadow-[0_6px_20px_-8px_rgba(122,31,31,.7)] transition-colors hover:bg-maroon-deep disabled:opacity-60"
          >
            {state === "loading" ? t("loading") : t("loadMorePhotos")}
            <Icon name="arrowDown" size={18} />
          </button>
          {state === "error" && <p role="alert" className="mt-3 text-sm text-maroon">{t("photoError")}</p>}
        </div>
      )}

      <dialog
        ref={dialog}
        onClose={() => setIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
        aria-label={current ? altOf(current) : undefined}
        className="m-auto max-h-[94dvh] w-[min(72rem,94vw)] overflow-visible bg-transparent p-0 backdrop:bg-ink/90 backdrop:backdrop-blur-sm open:motion-safe:animate-[lightbox-in_.4s_cubic-bezier(.22,1,.36,1)]"
      >
        {current && (
          <figure className="relative">
            <div key={current.id} className="motion-safe:animate-[lightbox-swap_.45s_cubic-bezier(.22,1,.36,1)]">
              <Image
                src={current.photo_url}
                alt={altOf(current)}
                width={current.width}
                height={current.height}
                sizes="94vw"
                priority
                className="mx-auto max-h-[78dvh] w-auto rounded-2xl object-contain shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]"
              />
              {captionOf(current) && <figcaption className="mx-auto mt-3 max-w-3xl text-center text-cream">{captionOf(current)}</figcaption>}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              {rows.length > 1 && (
                <button type="button" onClick={() => go(-1)} className="flex size-12 items-center justify-center rounded-full bg-cream text-ink transition-transform hover:-translate-x-0.5 active:scale-95">
                  <Icon name="arrowLeft" /> <span className="sr-only">{t("prev")}</span>
                </button>
              )}
              <button type="button" onClick={() => setIndex(null)} className="flex size-12 items-center justify-center rounded-full bg-mustard text-ink transition-transform hover:rotate-90 active:scale-95" autoFocus>
                <Icon name="close" /> <span className="sr-only">{t("close")}</span>
              </button>
              {rows.length > 1 && (
                <button type="button" onClick={() => go(1)} className="flex size-12 items-center justify-center rounded-full bg-cream text-ink transition-transform hover:translate-x-0.5 active:scale-95">
                  <Icon name="arrowRight" /> <span className="sr-only">{t("next")}</span>
                </button>
              )}
            </div>
            {rows.length > 1 && (
              <p className="mt-2 text-center text-sm text-cream/75 tabular" aria-live="polite">
                {t("position", { n: index! + 1, total: rows.length })}
              </p>
            )}
          </figure>
        )}
      </dialog>
    </>
  );
}
