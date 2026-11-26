import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/** Cache tags used for on-demand revalidation (see /api/revalidate). */
export type CacheTag = "ledger" | "videos" | "photos" | "press" | "programs";
export const CACHE_TAGS: CacheTag[] = ["ledger", "videos", "photos", "press", "programs"];

/** Fallback refresh window if an on-demand revalidation is ever missed. */
const REVALIDATE_SECONDS = 300;

/**
 * Read-only server client (anon key, so RLS applies exactly as for the public).
 * Every request goes through Next's data cache with the given tags, so pages are
 * static/ISR and refresh the moment the admin saves.
 */
export function serverSupabase(tags: CacheTag[]) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: REVALIDATE_SECONDS, tags } }),
    },
  });
}

/** Client acting as a specific signed-in user (used to verify admin tokens). */
export function userSupabase(accessToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` }, fetch: (i, init) => fetch(i, { ...init, cache: "no-store" }) },
  });
}
