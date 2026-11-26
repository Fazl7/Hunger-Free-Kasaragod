"use client";

import { useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/utils";

type Tab = "all" | "photos" | "videos";

/**
 * All / Photos / Videos switcher with a sliding pill. Both panels are always
 * server-rendered (just hidden), so crawlers and no-JS visitors see everything.
 */
export function GalleryTabs({
  photos,
  videos,
  labels,
}: {
  photos: ReactNode;
  videos: ReactNode;
  labels: { group: string; all: string; photos: string; videos: string };
}) {
  const [tab, setTab] = useState<Tab>("all");
  const tabs: { id: Tab; label: string; icon?: "camera" | "play" }[] = [
    { id: "all", label: labels.all },
    { id: "photos", label: labels.photos, icon: "camera" },
    { id: "videos", label: labels.videos, icon: "play" },
  ];
  const index = tabs.findIndex((t) => t.id === tab);
  const panels = useRef<HTMLDivElement>(null);

  // Animate the swap without remounting (keeps "Load more" progress and lightbox state).
  const choose = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    panels.current?.animate(
      [
        { opacity: 0, transform: "translateY(14px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 500, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    // If the visitor had scrolled deep into the grid, bring the top of the panel back into view.
    const top = panels.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 170, behavior: "smooth" });
  };

  return (
    <>
      <div className="sticky top-20 z-30 flex">
        <div
          role="tablist"
          aria-label={labels.group}
          className="relative grid w-full max-w-md grid-cols-3 rounded-full bg-white/90 p-1.5 shadow-[0_18px_40px_-24px_rgba(122,31,31,.55)] ring-1 ring-ink/8 backdrop-blur"
        >
          <span
            aria-hidden
            className="absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/3)] rounded-full bg-maroon shadow-[0_6px_20px_-8px_rgba(122,31,31,.7)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ transform: `translateX(${index * 100}%)` }}
          />
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`gtab-${t.id}`}
              aria-selected={tab === t.id}
              onClick={() => choose(t.id)}
              className={cn(
                "relative z-10 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-semibold transition-colors duration-300 sm:text-base",
                tab === t.id ? "text-cream" : "text-ink-soft hover:text-maroon",
              )}
            >
              {t.icon && <Icon name={t.icon} size={16} fill={t.icon === "play" ? "currentColor" : "none"} />}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={panels} className="mt-8 space-y-12">
        <div hidden={tab === "videos"} role="tabpanel" aria-labelledby={tab === "all" ? "gtab-all" : "gtab-photos"}>
          {photos}
        </div>
        <div hidden={tab === "photos"} role="tabpanel" aria-labelledby={tab === "all" ? "gtab-all" : "gtab-videos"}>
          {videos}
        </div>
      </div>
    </>
  );
}
