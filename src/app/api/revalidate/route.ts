import { revalidateTag } from "next/cache";
import { supabaseConfigured } from "@/lib/supabase/env";
import { CACHE_TAGS, userSupabase, type CacheTag } from "@/lib/supabase/server";

/**
 * POST /api/revalidate  { tags: ["ledger" | "videos" | "press" | "programs"] }
 * Called by the admin UI after every save so public pages (and their meta tags
 * for crawlers) refresh immediately. Only a signed-in ADMIN may call it: the
 * bearer token is checked against Supabase and the `admins` allow-list.
 */
export async function POST(request: Request) {
  if (!supabaseConfigured) return Response.json({ ok: false }, { status: 503 });

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ ok: false }, { status: 401 });

  const sb = userSupabase(token);
  const { data: isAdmin, error } = await sb.rpc("is_admin");
  if (error || isAdmin !== true) return Response.json({ ok: false }, { status: 403 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const requested = (body as { tags?: unknown })?.tags;
  const tags = Array.isArray(requested)
    ? requested.filter((t): t is CacheTag => CACHE_TAGS.includes(t as CacheTag))
    : [];

  // expire: 0 → the next visitor gets fresh data (no stale window).
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return Response.json({ ok: true, revalidated: tags });
}
