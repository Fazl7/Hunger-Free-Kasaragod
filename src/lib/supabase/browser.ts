"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "./env";

let client: SupabaseClient | null = null;

/**
 * One shared browser client (auth session in localStorage, realtime on demand).
 * Returns null when Supabase is not configured so callers can show a fallback.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: "hfk-admin-auth" },
  });
  return client;
}

/** Ask the server to refresh cached public pages after an admin change. */
export async function revalidatePublic(tags: ("ledger" | "videos" | "press" | "programs")[]) {
  const sb = getBrowserSupabase();
  const token = (await sb?.auth.getSession())?.data.session?.access_token;
  if (!token) return;
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ tags }),
    });
  } catch {
    /* pages still refresh on their own within 5 minutes */
  }
}
