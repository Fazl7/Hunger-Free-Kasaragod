"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ui } from "@/components/admin/ui";
import { Icon } from "@/components/icons/Icon";
import { revalidatePublic } from "@/lib/supabase/browser";
import { VIDEO_COLUMNS, type VideoRow } from "@/lib/supabase/types";
import { parseYouTubeId, thumbnailUrl, watchUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";
import { PhotoManager } from "./PhotoManager";

type Parsed = { line: string; id: string | null; status: "new" | "duplicate" | "exists" | "invalid" };
type Meta = { title?: string | null; failed?: boolean; titleEn: string; titleMl: string; featured: boolean };

/* ─────────────────────────────── Existing video row ─────────────────────────────── */
function VideoItem({
  v,
  index,
  total,
  onPatch,
  onMove,
  onDelete,
  dragProps,
  dragging,
}: {
  v: VideoRow;
  index: number;
  total: number;
  onPatch: (patch: Partial<VideoRow>) => void;
  onMove: (to: number) => void;
  onDelete: () => void;
  dragProps: React.HTMLAttributes<HTMLLIElement> & { draggable: boolean };
  dragging: boolean;
}) {
  const [en, setEn] = useState(v.title_en ?? "");
  const [ml, setMl] = useState(v.title_ml ?? "");
  return (
    <li
      {...dragProps}
      className={cn(
        "grid grid-cols-[auto_1fr] gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/8 sm:grid-cols-[auto_9rem_1fr_auto] sm:items-center",
        dragging && "opacity-40",
        !v.is_published && "bg-ink/[0.03]",
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
      <a href={watchUrl(v.youtube_id)} target="_blank" rel="noopener noreferrer" className="relative block aspect-video overflow-hidden rounded-xl bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl(v.youtube_id)} alt="" loading="lazy" className="size-full object-cover" />
        {v.is_featured && (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-mustard px-2 py-0.5 text-xs font-semibold text-ink">
            <Icon name="star" size={12} fill="currentColor" /> Featured
          </span>
        )}
        <span className="sr-only">Open {v.youtube_id} on YouTube</span>
      </a>
      <div className="col-span-2 grid gap-2 sm:col-span-1">
        <input
          className={cn(ui.input, "min-h-11")}
          placeholder="Title (English)"
          aria-label="Title in English"
          value={en}
          onChange={(e) => setEn(e.target.value)}
          onBlur={() => en.trim() !== (v.title_en ?? "") && onPatch({ title_en: en.trim() || null })}
        />
        <input
          className={cn(ui.input, "min-h-11")}
          placeholder="Title (Malayalam, optional)"
          aria-label="Title in Malayalam"
          lang="ml"
          value={ml}
          onChange={(e) => setMl(e.target.value)}
          onBlur={() => ml.trim() !== (v.title_ml ?? "") && onPatch({ title_ml: ml.trim() || null })}
        />
      </div>
      <div className="col-span-2 flex flex-wrap gap-1 sm:col-span-1 sm:flex-col">
        <button
          type="button"
          aria-pressed={v.is_featured}
          onClick={() => onPatch({ is_featured: !v.is_featured })}
          className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium ring-1", v.is_featured ? "bg-mustard ring-mustard" : "ring-ink/15")}
        >
          <Icon name="star" size={16} fill={v.is_featured ? "currentColor" : "none"} /> Featured
        </button>
        <button
          type="button"
          aria-pressed={v.is_published}
          onClick={() => onPatch({ is_published: !v.is_published })}
          className={cn("inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium ring-1", v.is_published ? "bg-leaf/10 text-leaf ring-leaf/30" : "ring-ink/15 text-ink-soft")}
        >
          <Icon name={v.is_published ? "eye" : "eyeOff"} size={16} /> {v.is_published ? "Published" : "Hidden"}
        </button>
        <button type="button" onClick={onDelete} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-[#b42318] hover:bg-[#b42318]/5">
          <Icon name="trash" size={16} /> Delete
        </button>
      </div>
    </li>
  );
}

/* ───────────────────────────────────── Page ───────────────────────────────────── */
function VideoManager({ onCount }: { onCount: (published: number, total: number) => void }) {
  const { sb } = useAdminAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const [videos, setVideos] = useState<VideoRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [meta, setMeta] = useState<Record<string, Meta>>({});
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const reorderTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const load = useCallback(async () => {
    if (!sb) return;
    const { data, error } = await sb.from("videos").select(VIDEO_COLUMNS).order("sort_order").order("created_at", { ascending: false }).limit(2000);
    if (error) return setLoadError(error.message);
    setLoadError(null);
    setVideos(data as VideoRow[]);
  }, [sb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void load();
  }, [load]);

  useEffect(() => {
    if (videos) onCount(videos.filter((v) => v.is_published).length, videos.length);
  }, [videos, onCount]);

  /* Parse the paste box: one link per line. */
  const parsed: Parsed[] = useMemo(() => {
    const existing = new Set((videos ?? []).map((v) => v.youtube_id));
    const seen = new Set<string>();
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const id = parseYouTubeId(line);
        if (!id) return { line, id, status: "invalid" as const };
        if (existing.has(id)) return { line, id, status: "exists" as const };
        if (seen.has(id)) return { line, id, status: "duplicate" as const };
        seen.add(id);
        return { line, id, status: "new" as const };
      });
  }, [text, videos]);
  const fresh = parsed.filter((p) => p.status === "new");

  /* Fetch titles via oEmbed for new IDs (once each). */
  useEffect(() => {
    const missing = fresh.map((p) => p.id!).filter((id) => !meta[id]);
    if (!missing.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seed entries before async fetch
    setMeta((m) => ({ ...m, ...Object.fromEntries(missing.map((id) => [id, { titleEn: "", titleMl: "", featured: false }])) }));
    for (const id of missing) {
      fetch(`/api/oembed?id=${id}`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: { title: string | null }) => setMeta((m) => ({ ...m, [id]: { ...m[id], title: d.title } })))
        .catch(() => setMeta((m) => ({ ...m, [id]: { ...m[id], title: null, failed: true } })));
    }
  }, [fresh, meta]);

  const setItem = (id: string, patch: Partial<Meta>) => setMeta((m) => ({ ...m, [id]: { ...m[id], ...patch } }));

  async function saveAll() {
    if (!sb || !fresh.length) return;
    setSaving(true);
    const minOrder = Math.min(0, ...(videos ?? []).map((v) => v.sort_order));
    const rows = fresh.map((p, i) => {
      const m = meta[p.id!] ?? { titleEn: "", titleMl: "", featured: false };
      return {
        youtube_id: p.id!,
        title_en: m.titleEn.trim() || m.title || null,
        title_ml: m.titleMl.trim() || null,
        is_featured: m.featured,
        is_published: true,
        sort_order: minOrder - fresh.length + i, // new videos go on top, in paste order
      };
    });
    const { error } = await sb.from("videos").insert(rows);
    setSaving(false);
    if (error) return toast({ message: `Couldn't save: ${error.message}`, type: "error" });
    toast({ message: `${rows.length} video${rows.length > 1 ? "s" : ""} added` });
    setText("");
    void revalidatePublic(["videos"]);
    void load();
  }

  async function patch(v: VideoRow, change: Partial<VideoRow>) {
    if (!sb) return;
    setVideos((all) => all?.map((x) => (x.id === v.id ? { ...x, ...change } : x)) ?? null);
    const { error } = await sb.from("videos").update(change).eq("id", v.id);
    if (error) {
      setVideos((all) => all?.map((x) => (x.id === v.id ? v : x)) ?? null);
      return toast({ message: `Couldn't update: ${error.message}`, type: "error" });
    }
    toast({ message: "Saved" });
    void revalidatePublic(["videos"]);
  }

  function move(from: number, to: number) {
    if (!videos || to < 0 || to >= videos.length || from === to) return;
    const next = [...videos];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setVideos(next.map((v, i) => ({ ...v, sort_order: i + 1 })));
    // Debounced: several quick moves → one save.
    clearTimeout(reorderTimer.current);
    reorderTimer.current = setTimeout(async () => {
      const { error } = await sb!.rpc("reorder_videos", { ids: next.map((v) => v.id) });
      if (error) {
        toast({ message: `Couldn't save order: ${error.message}`, type: "error" });
        return void load();
      }
      toast({ message: "Order saved" });
      void revalidatePublic(["videos"]);
    }, 700);
  }

  async function remove(v: VideoRow) {
    if (!sb) return;
    const ok = await confirm({ title: "Delete this video?", body: v.title_en ?? v.youtube_id, confirmLabel: "Delete", danger: true });
    if (!ok) return;
    const { error } = await sb.from("videos").delete().eq("id", v.id);
    if (error) return toast({ message: `Couldn't delete: ${error.message}`, type: "error" });
    setVideos((all) => all?.filter((x) => x.id !== v.id) ?? null);
    void revalidatePublic(["videos"]);
    toast({
      message: "Video deleted",
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: e2 } = await sb.from("videos").insert(v);
          if (e2) return toast({ message: `Undo failed: ${e2.message}`, type: "error" });
          toast({ message: "Video restored" });
          void revalidatePublic(["videos"]);
          void load();
        },
      },
    });
  }

  const statusLabel: Record<Parsed["status"], string> = {
    new: "Ready",
    duplicate: "Duplicate in this list",
    exists: "Already in gallery",
    invalid: "Not a YouTube video link",
  };

  return (
    <div className="space-y-8">
      {/* ── Paste box ── */}
      <section className={ui.card} aria-labelledby="add-title">
        <h2 id="add-title" className="text-xl font-semibold">Add videos</h2>
        <label className={cn(ui.label, "mt-4")}>
          <span>
            Paste YouTube links <span className={ui.hint}>(one per line: watch, youtu.be, shorts, embed or playlist links)</span>
          </span>
          <textarea
            className={cn(ui.textarea, "min-h-32 font-mono text-sm")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"https://www.youtube.com/watch?v=…\nhttps://youtu.be/…\nhttps://www.youtube.com/shorts/…"}
            spellCheck={false}
          />
        </label>

        {parsed.length > 0 && (
          <ul className="mt-5 space-y-3" aria-live="polite">
            {parsed.map((p, i) => {
              const m = p.id ? meta[p.id] : undefined;
              return (
                <li
                  key={`${i}-${p.line}`}
                  className={cn(
                    "grid gap-3 rounded-2xl p-3 ring-1 sm:grid-cols-[10rem_1fr]",
                    p.status === "new" ? "bg-cream/60 ring-ink/10" : "bg-ink/[0.03] ring-ink/5",
                  )}
                >
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-ink/10">
                    {p.id && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbnailUrl(p.id)} alt="" className={cn("size-full object-cover", p.status !== "new" && "opacity-50")} />
                    )}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="flex flex-wrap items-center gap-2 text-sm">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          p.status === "new" ? "bg-leaf/15 text-leaf" : p.status === "invalid" ? "bg-[#b42318]/10 text-[#b42318]" : "bg-ink/10 text-ink-soft",
                        )}
                      >
                        {statusLabel[p.status]}
                      </span>
                      <span className="truncate font-mono text-xs text-ink-soft">{p.id ?? p.line}</span>
                    </p>
                    {p.status === "new" && m && (
                      <>
                        <p className="text-sm font-medium">
                          {m.title === undefined ? "Fetching title…" : m.title ?? (m.failed ? "Title unavailable (private or embedding disabled?)" : "")}
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input className={cn(ui.input, "min-h-11")} placeholder="Custom title (English)" aria-label="Custom title in English" value={m.titleEn} onChange={(e) => setItem(p.id!, { titleEn: e.target.value })} />
                          <input className={cn(ui.input, "min-h-11")} placeholder="Title (Malayalam)" aria-label="Title in Malayalam" lang="ml" value={m.titleMl} onChange={(e) => setItem(p.id!, { titleMl: e.target.value })} />
                        </div>
                        <label className="inline-flex min-h-11 items-center gap-2 text-sm font-medium">
                          <input type="checkbox" className="size-5 accent-maroon" checked={m.featured} onChange={(e) => setItem(p.id!, { featured: e.target.checked })} />
                          Featured
                        </label>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <button type="button" onClick={() => void saveAll()} disabled={!fresh.length || saving} className={cn(ui.btn, ui.gold, "mt-5 w-full sm:w-auto")}>
          <Icon name="check" size={18} />
          {saving ? "Saving…" : fresh.length ? `Save ${fresh.length} video${fresh.length > 1 ? "s" : ""}` : "Save videos"}
        </button>
      </section>

      {/* ── Existing videos ── */}
      <section aria-labelledby="list-title">
        <h2 id="list-title" className="mb-1 text-xl font-semibold">All videos</h2>
        <p className="mb-4 text-sm text-ink-soft">Top of the list appears first on the site. Drag (desktop) or use the arrows to reorder.</p>
        {loadError && (
          <p role="alert" className="mb-4 text-sm text-[#b42318]">
            {loadError} <button type="button" className="font-semibold underline" onClick={() => void load()}>Retry</button>
          </p>
        )}
        {videos === null ? (
          <ul className="space-y-2">{Array.from({ length: 4 }, (_, i) => <li key={i} className="h-28 animate-pulse rounded-2xl bg-ink/5" />)}</ul>
        ) : videos.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-ink-soft ring-1 ring-ink/8">No videos yet. Paste some links above.</p>
        ) : (
          <ul className="space-y-2">
            {videos.map((v, i) => (
              <VideoItem
                key={v.id}
                v={v}
                index={i}
                total={videos.length}
                dragging={dragIndex === i}
                onPatch={(c) => void patch(v, c)}
                onMove={(to) => move(i, to)}
                onDelete={() => void remove(v)}
                dragProps={{
                  draggable: true,
                  onDragStart: (e) => {
                    // Don't hijack text selection inside the title inputs.
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

/* ───────────────────────────────────── Page ───────────────────────────────────── */
type Tab = "photos" | "videos";
type Counts = Record<Tab, { published: number; total: number } | null>;

export default function AdminGalleryPage() {
  const [tab, setTab] = useState<Tab>("photos");
  const [counts, setCounts] = useState<Counts>({ photos: null, videos: null });
  const onPhotos = useCallback((published: number, total: number) => setCounts((c) => ({ ...c, photos: { published, total } })), []);
  const onVideos = useCallback((published: number, total: number) => setCounts((c) => ({ ...c, videos: { published, total } })), []);

  // Remember the open tab in the URL (#videos) so a refresh keeps it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the hash once on mount
    if (window.location.hash === "#videos") setTab("videos");
  }, []);
  const choose = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", `#${t}`);
  };

  const current = counts[tab];
  const tabs: { id: Tab; label: string; icon: "camera" | "play" }[] = [
    { id: "photos", label: "Photos", icon: "camera" },
    { id: "videos", label: "Videos", icon: "play" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Gallery</h1>
          <p className="mt-1 text-ink-soft">
            {current ? `${current.published} published · ${current.total} total ${tab}` : "Loading…"}
          </p>
        </div>
        <a href="/en/gallery" target="_blank" rel="noopener" className={cn(ui.btn, ui.ghost)}>
          View gallery <Icon name="arrowRight" size={16} />
        </a>
      </header>

      <div role="tablist" aria-label="Gallery type" className="relative grid w-full max-w-sm grid-cols-2 rounded-full bg-white p-1 ring-1 ring-ink/10">
        <span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-maroon shadow-[0_6px_16px_-8px_rgba(122,31,31,.7)] transition-transform duration-300 ease-out"
          style={{ transform: tab === "videos" ? "translateX(100%)" : "none" }}
        />
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => choose(t.id)}
            className={cn(
              "relative z-10 inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors duration-300",
              tab === t.id ? "text-cream" : "text-ink-soft hover:text-ink",
            )}
          >
            <Icon name={t.icon} size={16} /> {t.label}
            {counts[t.id] && (
              <span className={cn("rounded-full px-1.5 text-xs tabular", tab === t.id ? "bg-cream/20" : "bg-ink/8")}>{counts[t.id]!.total}</span>
            )}
          </button>
        ))}
      </div>

      {/* Both stay mounted so counts load and unsaved input survives switching tabs. */}
      <div role="tabpanel" id="panel-photos" aria-labelledby="tab-photos" hidden={tab !== "photos"} className="motion-safe:animate-[rise-in_.35s_ease-out]">
        <PhotoManager onCount={onPhotos} />
      </div>
      <div role="tabpanel" id="panel-videos" aria-labelledby="tab-videos" hidden={tab !== "videos"} className="motion-safe:animate-[rise-in_.35s_ease-out]">
        <VideoManager onCount={onVideos} />
      </div>
    </div>
  );
}
