import type { NextRequest } from "next/server";
import { isYouTubeId } from "@/lib/youtube";

/**
 * GET /api/oembed?id=VIDEO_ID → { title, author }
 * Server-side proxy for YouTube oEmbed (avoids browser CORS issues). Only a
 * validated 11-character ID is ever placed in the upstream URL, so this can't be
 * used to fetch arbitrary sites. Responses are cached for a day.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  if (!isYouTubeId(id)) return Response.json({ error: "invalid id" }, { status: 400 });

  const upstream = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
  try {
    const res = await fetch(upstream, { next: { revalidate: 86400 } });
    if (!res.ok) {
      // 401/403: embedding disabled or private; 404: no such video.
      return Response.json({ error: "unavailable", status: res.status }, { status: 404 });
    }
    const data = (await res.json()) as { title?: string; author_name?: string };
    return Response.json(
      { title: data.title ?? null, author: data.author_name ?? null },
      { headers: { "cache-control": "public, max-age=86400" } },
    );
  } catch {
    return Response.json({ error: "upstream failed" }, { status: 502 });
  }
}
