import { cache } from "react";
import { supabaseConfigured } from "@/lib/supabase/env";
import { serverSupabase } from "@/lib/supabase/server";
import {
  LEDGER_COLUMNS,
  PHOTO_COLUMNS,
  PRESS_LIST_COLUMNS,
  VIDEO_COLUMNS,
  type ImpactStats,
  type LedgerEntryRow,
  type PhotoRow,
  type PressReleaseRow,
  type ProgramRow,
  type VideoRow,
} from "@/lib/supabase/types";

/**
 * Server-side reads for public pages. Every function returns `null` on failure
 * (or when Supabase isn't configured) so pages render a graceful empty/error
 * state instead of crashing or showing a fake 0.
 * Wrapped in React `cache` so generateMetadata + page share one request.
 */

function log(scope: string, error: unknown) {
  console.error(`[data:${scope}]`, error instanceof Error ? error.message : error);
}

export const getImpactStats = cache(async (): Promise<ImpactStats | null> => {
  if (!supabaseConfigured) return null;
  const { data, error } = await serverSupabase(["ledger", "programs"]).rpc("get_impact_stats");
  if (error) return (log("stats", error), null);
  return data as ImpactStats;
});

export const getPrograms = cache(async (): Promise<ProgramRow[] | null> => {
  if (!supabaseConfigured) return null;
  const { data, error } = await serverSupabase(["programs"])
    .from("programs")
    .select("id,slug,name_en,name_ml,icon,counts_as,sort_order,is_active")
    .order("sort_order");
  if (error) return (log("programs", error), null);
  return data as ProgramRow[];
});

export const getLedgerPage = cache(async (limit = 30): Promise<LedgerEntryRow[] | null> => {
  if (!supabaseConfigured) return null;
  const { data, error } = await serverSupabase(["ledger"])
    .from("ledger_entries")
    .select(LEDGER_COLUMNS)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return (log("ledger", error), null);
  return data as LedgerEntryRow[];
});

/** Ordered as the admin arranged them (new videos go on top). */
export const getVideos = cache(
  async (opts: { featured?: boolean; limit: number; latest?: boolean }): Promise<{ rows: VideoRow[]; count: number } | null> => {
    if (!supabaseConfigured) return null;
    let q = serverSupabase(["videos"])
      .from("videos")
      .select(VIDEO_COLUMNS, { count: "exact" })
      .eq("is_published", true);
    q = opts.latest ? q.order("created_at", { ascending: false }) : q.order("sort_order").order("created_at", { ascending: false });
    q = q.limit(opts.limit);
    if (opts.featured !== undefined) q = q.eq("is_featured", opts.featured);
    const { data, error, count } = await q;
    if (error) return (log("videos", error), null);
    return { rows: data as VideoRow[], count: count ?? data.length };
  },
);

/** Published gallery photos, ordered as the admin arranged them (new uploads go on top). */
export const getPhotos = cache(async (limit: number): Promise<{ rows: PhotoRow[]; count: number } | null> => {
  if (!supabaseConfigured) return null;
  const { data, error, count } = await serverSupabase(["photos"])
    .from("gallery_photos")
    .select(PHOTO_COLUMNS, { count: "exact" })
    .eq("is_published", true)
    .order("sort_order")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return (log("photos", error), null);
  return { rows: data as PhotoRow[], count: count ?? data.length };
});

export const getPressList = cache(async (limit = 60): Promise<PressReleaseRow[] | null> => {
  if (!supabaseConfigured) return null;
  const { data, error } = await serverSupabase(["press"])
    .from("press_releases")
    .select(PRESS_LIST_COLUMNS)
    .eq("is_published", true)
    .order("release_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return (log("press", error), null);
  return data as PressReleaseRow[];
});

export const getPressBySlug = cache(async (slug: string): Promise<PressReleaseRow | null> => {
  if (!supabaseConfigured || !/^[a-z0-9-]{1,120}$/.test(slug)) return null;
  const { data, error } = await serverSupabase(["press"])
    .from("press_releases")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) return (log("press-slug", error), null);
  return data as PressReleaseRow | null;
});
