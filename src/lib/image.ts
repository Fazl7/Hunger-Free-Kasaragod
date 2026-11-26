"use client";

/**
 * Browser-side photo processing for press releases (no dependency):
 *  - main:   longest side ≤ 1600px, WebP (JPEG where the browser can't encode WebP)
 *  - social: exactly 1200×630, centre-cropped JPEG (most compatible for WhatsApp/Facebook)
 *  - thumb:  800px wide WebP/JPEG for cards
 * EXIF rotation is applied, and metadata (incl. GPS) is stripped by re-encoding.
 */

export type ProcessedPhoto = {
  main: Blob;
  social: Blob;
  thumb: Blob;
  width: number;
  height: number;
};

async function load(file: Blob) {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Older Safari: fall back to an <img>.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

const dims = (src: ImageBitmap | HTMLImageElement) =>
  "naturalWidth" in src ? { w: src.naturalWidth, h: src.naturalHeight } : { w: src.width, h: src.height };

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
}

/** WebP where supported (checked on the actual output), JPEG otherwise. */
async function encode(canvas: HTMLCanvasElement, preferWebp: boolean) {
  if (preferWebp) {
    const webp = await canvasBlob(canvas, "image/webp", 0.82);
    if (webp && webp.type === "image/webp") return webp;
  }
  const jpeg = await canvasBlob(canvas, "image/jpeg", 0.85);
  if (!jpeg) throw new Error("This browser could not encode the image.");
  return jpeg;
}

function draw(
  src: CanvasImageSource,
  w: number,
  h: number,
  crop?: { sx: number; sy: number; sw: number; sh: number },
) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");
  ctx.fillStyle = "#fff8e7"; // flatten transparency onto the site's cream
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingQuality = "high";
  if (crop) ctx.drawImage(src, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h);
  else ctx.drawImage(src, 0, 0, w, h);
  return c;
}

export async function processPressPhoto(file: File): Promise<ProcessedPhoto> {
  const src = await load(file);
  const { w, h } = dims(src);
  if (!w || !h) throw new Error("Could not read this image.");

  const fit = (max: number) => {
    const s = Math.min(1, max / Math.max(w, h));
    return { w: Math.round(w * s), h: Math.round(h * s) };
  };

  const m = fit(1600);
  const main = await encode(draw(src, m.w, m.h), true);

  const tScale = Math.min(1, 800 / w);
  const thumb = await encode(draw(src, Math.round(w * tScale), Math.round(h * tScale)), true);

  // 1200×630 cover crop, centred.
  const target = 1200 / 630;
  const crop =
    w / h > target
      ? { sw: Math.round(h * target), sh: h, sx: Math.round((w - h * target) / 2), sy: 0 }
      : { sw: w, sh: Math.round(w / target), sx: 0, sy: Math.round((h - w / target) / 2) };
  const social = await encode(draw(src, 1200, 630, crop), false);

  if ("close" in src) src.close();
  return { main, social, thumb, width: m.w, height: m.h };
}

/** Gallery photo: main (longest side ≤ 1600px) + 800px-wide thumb, metadata stripped. */
export async function processGalleryPhoto(file: File): Promise<{ main: Blob; thumb: Blob; width: number; height: number }> {
  const src = await load(file);
  try {
    const { w, h } = dims(src);
    if (!w || !h) throw new Error("Could not read this image.");
    const s = Math.min(1, 1600 / Math.max(w, h));
    const m = { w: Math.round(w * s), h: Math.round(h * s) };
    const main = await encode(draw(src, m.w, m.h), true);
    const ts = Math.min(1, 800 / w);
    const thumb = await encode(draw(src, Math.round(w * ts), Math.round(h * ts)), true);
    return { main, thumb, width: m.w, height: m.h };
  } finally {
    if ("close" in src) src.close();
  }
}

/** Re-encode ledger evidence as an 800px max-side image, stripping metadata. */
export async function processLedgerPhoto(file: File): Promise<Blob> {
  const src = await load(file);
  try {
    const { w, h } = dims(src);
    if (!w || !h) throw new Error("Could not read this image.");
    const scale = Math.min(1, 800 / Math.max(w, h));
    return await encode(draw(src, Math.round(w * scale), Math.round(h * scale)), true);
  } finally {
    if ("close" in src) src.close();
  }
}
