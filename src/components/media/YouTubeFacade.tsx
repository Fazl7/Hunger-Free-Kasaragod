"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";
import { embedUrl, thumbnailUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

/**
 * <YouTubeFacade id="dQw4w9WgXcQ" title="…" />
 *
 * Lightweight stand-in for a YouTube embed: shows only the thumbnail and a play
 * button. The privacy-enhanced youtube-nocookie iframe is loaded only while its
 * video modal is open, keeping pages with many videos lightweight.
 */
export function YouTubeFacade({
  id,
  title,
  playLabel,
  large = false,
  portrait = false,
  className,
}: {
  id: string;
  title: string;
  /** Accessible button label, e.g. "Play video: Breakfast run". */
  playLabel: string;
  /** Featured cards ask for the high-resolution thumbnail. */
  large?: boolean;
  portrait?: boolean;
  className?: string;
}) {
  const t = useTranslations("common");
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);
  const useMaxThumbnail = large || portrait;
  const [thumb, setThumb] = useState(thumbnailUrl(id, useMaxThumbnail ? "max" : "hq"));

  const close = useCallback(() => {
    setPlaying(false);
    if (dialog.current?.open) dialog.current.close();
  }, []);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (playing && !element.open) element.showModal();
    else if (!playing && element.open) element.close();
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [close, playing]);

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden bg-black",
          portrait
            ? "mx-auto aspect-[9/16] w-full max-h-[70vh] max-w-[39.375vh] rounded-xl md:mx-0 md:max-h-none md:max-w-none"
            : "aspect-video rounded-2xl",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={playLabel}
          className="group/yt absolute inset-0 size-full cursor-pointer"
        >
          {/* Plain <img>: YouTube already serves sized thumbnails, so we skip the image optimizer. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt=""
            width={useMaxThumbnail ? 1280 : 480}
            height={useMaxThumbnail ? 720 : 360}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              // maxresdefault may load as a tiny placeholder when the video has no high-resolution thumbnail.
              if (useMaxThumbnail && e.currentTarget.naturalWidth < 200) setThumb(thumbnailUrl(id, "hq"));
            }}
            onError={() => setThumb(thumbnailUrl(id, "hq"))}
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover/yt:scale-[1.04]"
          />
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-mustard text-ink shadow-lg transition-transform duration-300 motion-safe:group-hover/yt:scale-110",
              large && "size-20",
            )}
          >
            <Icon name="play" size={large ? 32 : 24} className="translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-label={title}
        onClose={() => setPlaying(false)}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
        className="fixed inset-0 m-0 h-dvh w-screen max-h-dvh max-w-none overflow-hidden border-0 bg-black p-0 text-white backdrop:bg-black/95"
      >
        <div className="relative flex h-dvh w-full items-center justify-center">
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute top-4 right-4 z-10 flex size-12 items-center justify-center rounded-full bg-cream text-ink shadow-lg"
          >
            <Icon name="close" />
          </button>
          {playing && (
            <div className="relative aspect-[9/16] w-[min(100vw,56.25dvh)] overflow-hidden bg-black md:w-[min(100vw,50.625vh)]">
              <iframe
                src={`${embedUrl(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 size-full border-0"
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
