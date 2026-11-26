"use client";

import { getBrowserSupabase } from "@/lib/supabase/browser";

/**
 * THE ONLY place that uploads files. Everything else calls `uploadImage()`.
 * To move to Cloudflare R2 later, replace the body of this function (e.g. ask an
 * API route for a presigned PUT URL, upload, return the public R2 URL); no other
 * code needs to change.
 *
 * @returns the public URL of the uploaded image.
 */
export async function uploadImage(file: Blob, opts: { folder?: string; name?: string } = {}): Promise<string> {
  const sb = getBrowserSupabase();
  if (!sb) throw new Error("Storage is not configured.");

  const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
  const now = new Date();
  const folder = opts.folder ?? `press/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
  const path = `${folder}/${crypto.randomUUID()}${opts.name ? `-${opts.name}` : ""}.${ext}`;

  const { error } = await sb.storage.from("media").upload(path, file, {
    contentType: file.type || "image/jpeg",
    cacheControl: "31536000", // file names are unique, so cache for a year
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

/**
 * Delete previously uploaded images by their public URLs (the inverse of `uploadImage`).
 * URLs that don't point into our bucket are ignored.
 */
export async function removeImages(urls: string[]): Promise<void> {
  const sb = getBrowserSupabase();
  if (!sb) throw new Error("Storage is not configured.");
  const marker = "/storage/v1/object/public/media/";
  const paths = urls
    .map((u) => {
      const i = u.indexOf(marker);
      return i === -1 ? null : decodeURIComponent(u.slice(i + marker.length).split("?")[0]);
    })
    .filter((p): p is string => !!p);
  if (!paths.length) return;
  const { error } = await sb.storage.from("media").remove(paths);
  if (error) throw new Error(error.message);
}
