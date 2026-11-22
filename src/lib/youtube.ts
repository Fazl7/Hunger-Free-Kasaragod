/** YouTube helpers shared by the admin paste box and the public gallery. */

const ID = /^[A-Za-z0-9_-]{11}$/;

export const isYouTubeId = (s: string) => ID.test(s);

/**
 * Extract a video ID from any common YouTube URL (or a bare ID):
 *   youtube.com/watch?v=ID (incl. &list=… playlist items), youtu.be/ID,
 *   youtube.com/shorts/ID, /embed/ID, /live/ID, /v/ID, youtube-nocookie.com/embed/ID,
 *   m.youtube.com and music.youtube.com variants.
 * Returns null for anything else (e.g. a playlist URL with no specific video).
 */
export function parseYouTubeId(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;
  if (ID.test(input)) return input;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|music)\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") return parts[0] && ID.test(parts[0]) ? parts[0] : null;

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && ID.test(v)) return v;
    if (["shorts", "embed", "live", "v", "e"].includes(parts[0]) && parts[1] && ID.test(parts[1])) return parts[1];
  }
  return null;
}

export const thumbnailUrl = (id: string, quality: "hq" | "max" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${quality === "max" ? "maxresdefault" : "hqdefault"}.jpg`;

export const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const embedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
