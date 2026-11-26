"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ui } from "@/components/admin/ui";
import { Icon } from "@/components/icons/Icon";
import { revalidatePublic } from "@/lib/supabase/browser";
import { PHOTO_COLUMNS, type PhotoRow } from "@/lib/supabase/types";
import { processGalleryPhoto } from "@/lib/image";
import { removeImages, uploadImage } from "@/lib/storage";
import { cn } from "@/lib/utils";

const MAX_MB = 20;
const MAX_FILES = 30;

type Queued = {
  key: string;
  file: File;
  preview: string;
  captionEn: string;
  captionMl: string;
  status: "ready" | "uploading" | "error";
  error?: string;
};

/* ─────────────────────────────── Existing photo row ─────────────────────────────── */
function PhotoItem({
  p,
  index,
  total,
  onPatch,
  onMove,
  onDelete,
  dragProps,
  dragging,
}: {
  p: PhotoRow;
  index: number;
  total: number;
  onPatch: (patch: Partial<PhotoRow>) => void;
  onMove: (to: number) => void;
  onDelete: () => void;
  dragProps: React.HTMLAttributes<HTMLLIElement> & { draggable: boolean };
  dragging: boolean;
}) {
  const [en, setEn] = useState(p.caption_en ?? "");
  const [ml, setMl] = useState(p.caption_ml ?? "");
  return (
    <li
      {...dragProps}
      className={cn(
        "grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/8 transition-opacity motion-safe:animate-[rise-in_.35s_ease-out] sm:grid-cols-[auto_9rem_1fr_auto] sm:items-center",
        dragging && "opacity-40",
        !p.is_published && "bg-ink/[0.03]",
      )}
    >
      <div className="row-span-2 flex flex-col items-center gap-1 sm:row-span-1">
        <span className="hidden cursor-grab touch-none text-ink-soft sm:block" title="Drag to reorder" aria-hidden>
          <Icon name="grip" size={20} />
        </span>
        <button type="button" className={ui.iconBtn} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="Move up">
          <Icon name="arrowUp" size={18} />
        </button>
        <button type="button" className={ui.iconBtn} disabled={index === total - 1} onClick={() => onMove(index + 1)} aria-label="Move down">
          <Icon name="arrowDown" size={18} />
        </button>
      </div>
      <a href={p.photo_url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.thumb_url} alt="" loading="lazy" className={cn("size-full object-cover transition-transform duration-500 group-hover:scale-105", !p.is_published && "opacity-60")} />
        <span className="sr-only">Open full-size photo</span>
      </a>
      <div className="col-span-2 grid gap-2 sm:col-span-1">
        <input
          className={cn(ui.input, "min-h-11")}
          placeholder="Caption (English, optional)"
          aria-label="Caption in English"
          maxLength={300}
          value={en}
          onChange={(e) => setEn(e.target.value)}
          onBlur={() => en.trim() !== (p.caption_en ?? "") && onPatch({ caption_en: en.trim() || null })}
        />
        <input
          className={cn(ui.input, "min-h-11")}
          placeholder="Caption (Malayalam, optional)"
          aria-label="Caption in Malayalam"
          lang="ml"
          maxLength={300}
          value={ml}
          onChange={(e) => setMl(e.target.value)}
          onBlur={() => ml.trim() !== (p.caption_ml ?? "") && onPatch({ caption_ml: ml.trim() || null })}
        />
      </div>
      <div className="col-span-2 flex flex-wrap gap-1 sm:col-span-1 sm:flex-col">
        <button
          type="button"
          aria-pressed={p.is_published}
          onClick={() => onPatch({ is_published: !p.is_published })}
          className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium ring-1", p.is_published ? "bg-leaf/10 text-leaf ring-leaf/30" : "ring-ink/15 text-ink-soft")}
        >
          <Icon name={p.is_published ? "eye" : "eyeOff"} size={16} /> {p.is_published ? "Published" : "Hidden"}
        </button>
        <button type="button" onClick={onDelete} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-[#b42318] hover:bg-[#b42318]/5">
          <Icon name="trash" size={16} /> Delete
        </button>
      </div>
    </li>
  );
}

/* ───────────────────────────────────── Manager ───────────────────────────────────── */
export function PhotoManager({ onCount }: { onCount?: (published: number, total: number) => void }) {
  const { sb } = useAdminAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const inputId = useId();
  const [photos, setPhotos] = useState<PhotoRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [queue, setQueue] = useState<Queued[]>([]);
  const [over, setOver] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const reorderTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const load = useCallback(async () => {
    if (!sb) return;
    const { data, error } = await sb.from("gallery_photos").select(PHOTO_COLUMNS).order("sort_order").order("created_at", { ascending: false }).limit(2000);
    if (error) return setLoadError(error.message);
    setLoadError(null);
    setPhotos(data as PhotoRow[]);
  }, [sb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void load();
  }, [load]);

  useEffect(() => {
    if (photos) onCount?.(photos.filter((p) => p.is_published).length, photos.length);
  }, [photos, onCount]);

  // Free preview object URLs when the page unmounts.
  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => () => queueRef.current.forEach((q) => URL.revokeObjectURL(q.preview)), []);

  /* ── Choosing files ── */
  function addFiles(list: FileList | File[] | null | undefined) {
    setPickError(null);
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const skipped: string[] = [];
    const fresh: Queued[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) skipped.push(`${file.name} (not an image)`);
      else if (file.size > MAX_MB * 1024 * 1024) skipped.push(`${file.name} (over ${MAX_MB} MB)`);
      else fresh.push({ key: crypto.randomUUID(), file, preview: URL.createObjectURL(file), captionEn: "", captionMl: "", status: "ready" });
    }
    setQueue((q) => {
      const room = Math.max(0, MAX_FILES - q.length);
      if (fresh.length > room) {
        fresh.slice(room).forEach((f) => URL.revokeObjectURL(f.preview));
        skipped.push(`${fresh.length - room} more (max ${MAX_FILES} at a time)`);
      }
      return [...q, ...fresh.slice(0, room)];
    });
    if (skipped.length) setPickError(`Skipped: ${skipped.join(", ")}`);
  }

  const setItem = (key: string, patch: Partial<Queued>) => setQueue((q) => q.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const dropItem = (key: string) =>
    setQueue((q) => {
      const it = q.find((x) => x.key === key);
      if (it) URL.revokeObjectURL(it.preview);
      return q.filter((x) => x.key !== key);
    });

  /* ── Upload: one photo at a time so a failure only affects that photo ── */
  async function uploadAll() {
    if (!sb || !queue.length) return;
    setUploading(true);
    const items = queue.filter((q) => q.status !== "uploading");
    const now = new Date();
    const folder = `gallery/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}`;
    const minOrder = Math.min(0, ...(photos ?? []).map((p) => p.sort_order));
    let ok = 0;

    for (const [i, it] of items.entries()) {
      setItem(it.key, { status: "uploading", error: undefined });
      const uploaded: string[] = [];
      try {
        const processed = await processGalleryPhoto(it.file);
        const photo_url = await uploadImage(processed.main, { folder, name: "main" });
        uploaded.push(photo_url);
        const thumb_url = await uploadImage(processed.thumb, { folder, name: "thumb" });
        uploaded.push(thumb_url);
        const { error } = await sb.from("gallery_photos").insert({
          photo_url,
          thumb_url,
          width: processed.width,
          height: processed.height,
          caption_en: it.captionEn.trim() || null,
          caption_ml: it.captionMl.trim() || null,
          is_published: true,
          sort_order: minOrder - items.length + i, // new photos go on top, in the order chosen
        });
        if (error) throw new Error(error.message);
        ok++;
        dropItem(it.key);
      } catch (e) {
        if (uploaded.length) void removeImages(uploaded).catch(() => {});
        setItem(it.key, { status: "error", error: e instanceof Error ? e.message : "Upload failed" });
      }
    }

    setUploading(false);
    if (ok) {
      toast({ message: `${ok} photo${ok > 1 ? "s" : ""} added` });
      void revalidatePublic(["photos"]);
      void load();
    }
    if (ok < items.length) toast({ message: `${items.length - ok} photo${items.length - ok > 1 ? "s" : ""} couldn't be uploaded. See the list.`, type: "error" });
  }

  /* ── Edit existing ── */
  async function patch(p: PhotoRow, change: Partial<PhotoRow>) {
    if (!sb) return;
    setPhotos((all) => all?.map((x) => (x.id === p.id ? { ...x, ...change } : x)) ?? null);
    const { error } = await sb.from("gallery_photos").update(change).eq("id", p.id);
    if (error) {
      setPhotos((all) => all?.map((x) => (x.id === p.id ? p : x)) ?? null);
      return toast({ message: `Couldn't update: ${error.message}`, type: "error" });
    }
    toast({ message: "Saved" });
    void revalidatePublic(["photos"]);
  }

  function move(from: number, to: number) {
    if (!photos || to < 0 || to >= photos.length || from === to) return;
    const next = [...photos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setPhotos(next.map((p, i) => ({ ...p, sort_order: i + 1 })));
    clearTimeout(reorderTimer.current);
    reorderTimer.current = setTimeout(async () => {
      const { error } = await sb!.rpc("reorder_photos", { ids: next.map((p) => p.id) });
      if (error) {
        toast({ message: `Couldn't save order: ${error.message}`, type: "error" });
        return void load();
      }
      toast({ message: "Order saved" });
      void revalidatePublic(["photos"]);
    }, 700);
  }

  async function remove(p: PhotoRow) {
    if (!sb) return;
    const ok = await confirm({
      title: "Delete this photo permanently?",
      body: `${p.caption_en ? `“${p.caption_en}” ` : "This photo "}will be removed from the website, the database and file storage. This can't be undone.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    // 1. Database row first, so the site stops showing it straight away.
    const { error } = await sb.from("gallery_photos").delete().eq("id", p.id);
    if (error) return toast({ message: `Couldn't delete: ${error.message}`, type: "error" });
    setPhotos((all) => all?.filter((x) => x.id !== p.id) ?? null);
    void revalidatePublic(["photos"]);
    // 2. Then both image files (full size + thumbnail) from storage.
    await removeFiles(p);
  }

  async function removeFiles(p: PhotoRow) {
    try {
      await removeImages([p.photo_url, p.thumb_url]);
      toast({ message: "Photo deleted everywhere" });
    } catch (e) {
      toast({
        message: `Photo removed from the site, but its files couldn't be deleted from storage: ${e instanceof Error ? e.message : "unknown error"}`,
        type: "error",
        duration: 15000,
        action: { label: "Retry", onClick: () => void removeFiles(p) },
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Upload box ── */}
      <section className={ui.card} aria-labelledby="add-photos-title">
        <h2 id="add-photos-title" className="text-xl font-semibold">Add photos</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Choose several at once. Photos are resized and location data is removed automatically. Only upload photos with consent from everyone identifiable.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            addFiles(e.dataTransfer.files);
          }}
          onPaste={(e) => addFiles(Array.from(e.clipboardData.files))}
          className={cn(
            "mt-4 rounded-2xl border-2 border-dashed transition-[border-color,background-color,transform] duration-300",
            over ? "scale-[1.01] border-maroon bg-maroon/5" : "border-ink/20 bg-cream/60",
          )}
        >
          <label htmlFor={inputId} className="flex cursor-pointer flex-col items-center justify-center gap-2 p-8 text-center">
            <span className={cn("flex size-14 items-center justify-center rounded-2xl bg-mustard text-ink transition-transform duration-300", over && "motion-safe:-translate-y-1 motion-safe:rotate-[-6deg]")}>
              <Icon name="camera" size={28} />
            </span>
            <span className="font-semibold">Tap to choose photos</span>
            <span className="text-sm text-ink-soft">or drag &amp; drop / paste. Up to {MAX_FILES} at a time, {MAX_MB} MB each.</span>
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {pickError && <p role="alert" className="mt-2 text-sm font-medium text-[#b42318]">{pickError}</p>}

        {queue.length > 0 && (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2" aria-live="polite">
            {queue.map((q, i) => (
              <li
                key={q.key}
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                className={cn("grid grid-cols-[6.5rem_1fr] gap-3 rounded-2xl p-3 ring-1 motion-safe:animate-[rise-in_.35s_ease-out_both]", q.status === "error" ? "bg-[#b42318]/5 ring-[#b42318]/30" : "bg-cream/60 ring-ink/10")}
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-ink/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={q.preview} alt="" className={cn("size-full object-cover", q.status === "uploading" && "opacity-50")} />
                  {q.status === "uploading" && (
                    <span className="absolute inset-0 flex items-center justify-center" role="status">
                      <span className="size-8 animate-spin rounded-full border-[3px] border-cream border-t-maroon" />
                      <span className="sr-only">Uploading</span>
                    </span>
                  )}
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate pt-1 text-xs text-ink-soft" title={q.file.name}>{q.file.name}</p>
                    <button type="button" className={cn(ui.iconBtn, "-mt-1 -mr-1 size-9")} onClick={() => dropItem(q.key)} disabled={q.status === "uploading"} aria-label={`Remove ${q.file.name}`}>
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                  <input className={cn(ui.input, "min-h-10 text-sm")} placeholder="Caption (English)" aria-label="Caption in English" maxLength={300} value={q.captionEn} disabled={q.status === "uploading"} onChange={(e) => setItem(q.key, { captionEn: e.target.value })} />
                  <input className={cn(ui.input, "min-h-10 text-sm")} placeholder="Caption (Malayalam)" aria-label="Caption in Malayalam" lang="ml" maxLength={300} value={q.captionMl} disabled={q.status === "uploading"} onChange={(e) => setItem(q.key, { captionMl: e.target.value })} />
                  {q.error && <p className="text-xs font-medium text-[#b42318]">{q.error}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}

        <button type="button" onClick={() => void uploadAll()} disabled={!queue.length || uploading} className={cn(ui.btn, ui.gold, "mt-5 w-full sm:w-auto")}>
          <Icon name="check" size={18} />
          {uploading ? "Uploading…" : queue.length ? `Upload ${queue.length} photo${queue.length > 1 ? "s" : ""}` : "Upload photos"}
        </button>
      </section>

      {/* ── Existing photos ── */}
      <section aria-labelledby="photo-list-title">
        <h2 id="photo-list-title" className="mb-1 text-xl font-semibold">All photos</h2>
        <p className="mb-4 text-sm text-ink-soft">Top of the list appears first on the site. Drag (desktop) or use the arrows to reorder.</p>
        {loadError && (
          <p role="alert" className="mb-4 text-sm text-[#b42318]">
            {loadError} <button type="button" className="font-semibold underline" onClick={() => void load()}>Retry</button>
          </p>
        )}
        {photos === null ? (
          <ul className="space-y-2">{Array.from({ length: 4 }, (_, i) => <li key={i} className="h-28 animate-pulse rounded-2xl bg-ink/5" />)}</ul>
        ) : photos.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-ink-soft ring-1 ring-ink/8">No photos yet. Add some above.</p>
        ) : (
          <ul className="space-y-2">
            {photos.map((p, i) => (
              <PhotoItem
                key={p.id}
                p={p}
                index={i}
                total={photos.length}
                dragging={dragIndex === i}
                onPatch={(c) => void patch(p, c)}
                onMove={(to) => move(i, to)}
                onDelete={() => void remove(p)}
                dragProps={{
                  draggable: true,
                  onDragStart: (e) => {
                    if ((e.target as HTMLElement).closest("input")) return e.preventDefault();
                    setDragIndex(i);
                    e.dataTransfer.effectAllowed = "move";
                  },
                  onDragOver: (e) => e.preventDefault(),
                  onDrop: (e) => {
                    e.preventDefault();
                    if (dragIndex !== null) move(dragIndex, i);
                    setDragIndex(null);
                  },
                  onDragEnd: () => setDragIndex(null),
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
