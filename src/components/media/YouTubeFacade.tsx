"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { embedUrl, thumbnailUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

/**
 * <YouTubeFacade id="dQw4w9WgXcQ" title="…" />
 *
 * Lightweight stand-in for a YouTube embed: shows only the thumbnail and a play
 * button (one small image, zero YouTube JS). The privacy-enhanced
 * youtube-nocookie iframe is created only when the visitor clicks, so a page of
 * 100 videos never loads 100 iframes. Each card is independent, so several
 * videos can play at the same time.
 */
export function YouTubeFacade({
  id,
  title,
  playLabel,
  large = false,
  className,
}: {
  id: string;
  title: string;
  /** Accessible button label, e.g. "Play video: Breakfast run". */
  playLabel: string;
  /** Featured cards ask for the high-resolution thumbnail. */
  large?: boolean;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(thumbnailUrl(id, large ? "max" : "hq"));

  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-2xl bg-ink", className)}>
      {playing ? (
        <iframe
          src={`${embedUrl(id)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
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
            width={large ? 1280 : 480}
            height={large ? 720 : 360}
            loading="lazy"
            decoding="async"
            onLoad={(e) => {
              // maxresdefault doesn't exist for every video; YouTube returns a 120px placeholder.
              if (large && e.currentTarget.naturalWidth < 200) setThumb(thumbnailUrl(id, "hq"));
            }}
            onError={() => setThumb(thumbnailUrl(id, "hq"))}
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] motion-safe:group-hover/yt:scale-[1.04]"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-mustard text-ink shadow-[0_10px_30px_-8px_rgba(0,0,0,.6)] transition-transform duration-300 motion-safe:group-hover/yt:scale-110",
              large ? "size-20" : "size-14",
            )}
          >
            <Icon name="play" size={large ? 32 : 24} className="translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
