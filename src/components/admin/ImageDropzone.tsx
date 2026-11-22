"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/utils";

/**
 * <ImageDropzone onFile={…} previewUrl={…} />
 * Tap to choose (opens camera/gallery on phones), drag & drop, or paste an image.
 * Validates type and size, then hands the File to the parent for processing.
 */
export function ImageDropzone({
  onFile,
  onRemove,
  previewUrl,
  busy = false,
  maxMB = 20,
}: {
  onFile: (file: File) => void;
  onRemove?: () => void;
  previewUrl?: string | null;
  busy?: boolean;
  maxMB?: number;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accept = (file: File | undefined | null) => {
    setError(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image (JPG, PNG, WebP or HEIC from a phone).");
    if (file.size > maxMB * 1024 * 1024) return setError(`That image is over ${maxMB} MB. Please choose a smaller one.`);
    onFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          accept(e.dataTransfer.files?.[0]);
        }}
        onPaste={(e) => accept(Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/")))}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
          over ? "border-maroon bg-maroon/5" : "border-ink/20 bg-cream/60",
        )}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Selected photo preview" className="aspect-[16/9] w-full object-cover" />
        ) : (
          <label htmlFor={id} className="flex aspect-[16/9] cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-mustard text-ink">
              <Icon name="camera" size={28} />
            </span>
            <span className="font-semibold">Tap to add a photo</span>
            <span className="text-sm text-ink-soft">or drag &amp; drop / paste. Resized automatically for the site.</span>
          </label>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream/80 font-semibold" role="status">
            Processing &amp; uploading…
          </div>
        )}
        <input
          ref={input}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            accept(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {previewUrl && (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-maroon hover:bg-maroon/5"
          >
            <Icon name="camera" size={16} /> Replace
          </button>
          {onRemove && (
            <button type="button" onClick={onRemove} disabled={busy} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink-soft hover:bg-ink/5">
              <Icon name="close" size={16} /> Remove
            </button>
          )}
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-sm font-medium text-[#b42318]">{error}</p>}
    </div>
  );
}
