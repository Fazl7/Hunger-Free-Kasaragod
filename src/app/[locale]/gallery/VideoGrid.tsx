"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { VIDEO_COLUMNS, type VideoRow } from "@/lib/supabase/types";
import { pick } from "@/lib/format";
import { cn } from "@/lib/utils";
import { VideoCard } from "@/components/media/VideoCard";
import { Icon } from "@/components/icons/Icon";

const PAGE = 12;

/** Mobile-first video grid with "Load more" (12 at a time). First page is server-rendered. */
export function VideoGrid({ initial, total }: { initial: VideoRow[]; total: number }) {
  const t = useTranslations("videos");
  const locale = useLocale();
  const [rows, setRows] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const hasMore = rows.length < total;
  const mobileColumnClass = rows.length > 1 ? "grid-cols-2" : "grid-cols-1";

  async function loadMore() {
    const sb = getBrowserSupabase();
    if (!sb) return setState("error");
    setState("loading");
    const { data, error } = await sb
      .from("videos")
      .select(VIDEO_COLUMNS)
      .eq("is_published", true)
      .eq("is_featured", false)
      .order("sort_order")
      .order("created_at", { ascending: false })
      .range(rows.length, rows.length + PAGE - 1);
    if (error) return setState("error");
    setRows((prev) => {
      const seen = new Set(prev.map((r) => r.id));
      return [...prev, ...(data as VideoRow[]).filter((r) => !seen.has(r.id))];
    });
    setState("idle");
  }

  return (
    <>
      <ul
        className={cn(
          "mx-auto grid w-full max-w-6xl gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6",
          mobileColumnClass,
        )}
        aria-busy={state === "loading"}
      >
        {rows.map((v) => {
          const title = pick(v.title_en, v.title_ml, locale) || t("fallbackTitle");
          return (
            <li key={v.id}>
              <VideoCard
                id={v.youtube_id}
                title={title}
                playLabel={t("play", { title })}
                portrait
              />
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={state === "loading"}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-maroon px-7 py-3 font-semibold text-cream shadow-[0_6px_20px_-8px_rgba(122,31,31,.7)] transition-colors hover:bg-maroon-deep disabled:opacity-60"
          >
            {state === "loading" ? t("loading") : t("loadMore")}
            <Icon name="arrowDown" size={18} />
          </button>
          {state === "error" && <p role="alert" className="mt-3 text-sm text-maroon">{t("error")}</p>}
        </div>
      )}
    </>
  );
}
