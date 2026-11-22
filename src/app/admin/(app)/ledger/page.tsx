"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { usePrograms } from "@/components/admin/usePrograms";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { ui } from "@/components/admin/ui";
import { Icon, isIconKey } from "@/components/icons/Icon";
import { revalidatePublic } from "@/lib/supabase/browser";
import { processLedgerPhoto } from "@/lib/image";
import { uploadImage } from "@/lib/storage";
import { LEDGER_COLUMNS, type LedgerEntryRow, type ProgramRow } from "@/lib/supabase/types";
import { formatShortDate, todayIST } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE = 30;
const DEFAULT_PLACES = ["Kasaragod", "Cherkala", "Kanhangad"];
const LS_PLACE = "hfk.lastPlace";
const LS_PROGRAM = "hfk.lastProgram";

const readLS = (k: string) => {
  try {
    return localStorage.getItem(k) ?? "";
  } catch {
    return "";
  }
};
const writeLS = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* private mode */
  }
};

const yesterdayIST = () => {
  const d = new Date(`${todayIST()}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

/** Collapse whitespace and capitalise first letters, so "  cherkala " and "Cherkala" group together. */
const tidyPlace = (s: string) =>
  s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/(^|[\s,(-])(\p{Ll})/gu, (_, a: string, b: string) => a + b.toUpperCase());

type Draft = { entry_date: string; quantity: string; place: string; program_id: string; note: string; photo_url: string | null };

/* ───────────── Entry fields (shared by the add form and the edit dialog) ───────────── */
function EntryFields({
  draft,
  set,
  programs,
  places,
  qtyRef,
  idPrefix,
  photoBusy,
  photoPreview,
  onPhoto,
  onRemovePhoto,
}: {
  draft: Draft;
  set: (patch: Partial<Draft>) => void;
  programs: ProgramRow[];
  places: string[];
  qtyRef?: React.Ref<HTMLInputElement>;
  idPrefix: string;
  photoBusy: boolean;
  photoPreview: string | null;
  onPhoto: (file: File) => void;
  onRemovePhoto: () => void;
}) {
  const today = todayIST();
  const yesterday = yesterdayIST();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={ui.label}>
        <label htmlFor={`${idPrefix}-date`}>Date</label>
        <input
          id={`${idPrefix}-date`}
          className={ui.input}
          type="date"
          required
          max={today}
          value={draft.entry_date}
          onChange={(e) => set({ entry_date: e.target.value })}
        />
        <div className="flex gap-2">
          {[
            { v: today, l: "Today" },
            { v: yesterday, l: "Yesterday" },
          ].map((d) => (
            <button
              key={d.l}
              type="button"
              aria-pressed={draft.entry_date === d.v}
              onClick={() => set({ entry_date: d.v })}
              className={cn(
                "min-h-10 rounded-full px-3.5 text-sm font-medium ring-1",
                draft.entry_date === d.v ? "bg-maroon text-cream ring-maroon" : "ring-ink/15 hover:ring-maroon/40",
              )}
            >
              {d.l}
            </button>
          ))}
        </div>
      </div>

      <label className={ui.label}>
        Quantity
        <input
          ref={qtyRef}
          className={cn(ui.input, "text-2xl font-semibold tabular")}
          type="number"
          inputMode="numeric"
          min={1}
          max={1000000}
          step={1}
          required
          placeholder="e.g. 50"
          value={draft.quantity}
          onChange={(e) => set({ quantity: e.target.value })}
        />
      </label>

      <div className={cn(ui.label, "sm:col-span-2")}>
        <label htmlFor={`${idPrefix}-place`}>Place</label>
        <input
          id={`${idPrefix}-place`}
          className={ui.input}
          list={`${idPrefix}-places`}
          required
          maxLength={120}
          autoComplete="off"
          placeholder="Kasaragod"
          value={draft.place}
          onChange={(e) => set({ place: e.target.value })}
        />
        <datalist id={`${idPrefix}-places`}>
          {places.map((p) => <option key={p} value={p} />)}
        </datalist>
        <div className="flex flex-wrap gap-2">
          {places.slice(0, 6).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={draft.place === p}
              onClick={() => set({ place: p })}
              className={cn(
                "min-h-10 rounded-full px-3.5 text-sm font-medium ring-1",
                draft.place === p ? "bg-maroon text-cream ring-maroon" : "ring-ink/15 hover:ring-maroon/40",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <label className={cn(ui.label, "sm:col-span-2")}>
        Program
        <select className={ui.input} required value={draft.program_id} onChange={(e) => set({ program_id: e.target.value })}>
          <option value="" disabled>Choose a program…</option>
          {programs
            .filter((p) => p.is_active || String(p.id) === draft.program_id)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name_en} {p.counts_as === "other" ? "" : `· counts as ${p.counts_as}`}
              </option>
            ))}
        </select>
      </label>

      <label className={cn(ui.label, "sm:col-span-2")}>
        <span>Note <span className={ui.hint}>(optional, shown publicly)</span></span>
        <input className={ui.input} maxLength={500} value={draft.note} onChange={(e) => set({ note: e.target.value })} />
      </label>

      <div className={cn(ui.label, "sm:col-span-2")}>
        <span>Distribution photo <span className={ui.hint}>(optional, shown publicly)</span></span>
        <ImageDropzone
          onFile={onPhoto}
          onRemove={onRemovePhoto}
          previewUrl={photoPreview ?? draft.photo_url}
          busy={photoBusy}
        />
      </div>
    </div>
  );
}

/* ───────────────────────────────────── Page ───────────────────────────────────── */
export default function AdminLedgerPage() {
  const { sb } = useAdminAuth();
  const { programs, error: programsError } = usePrograms();
  const toast = useToast();
  const confirm = useConfirm();
  const qtyRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const editDialog = useRef<HTMLDialogElement>(null);

  const [draft, setDraft] = useState<Draft>({ entry_date: todayIST(), quantity: "", place: "", program_id: "", note: "", photo_url: null });
  const [saving, setSaving] = useState(false);
  const [uploadingPhotoFor, setUploadingPhotoFor] = useState<"new" | "edit" | null>(null);
  const photoBusy = uploadingPhotoFor !== null;
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);
  const [entries, setEntries] = useState<LedgerEntryRow[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [places, setPlaces] = useState<string[]>(DEFAULT_PLACES);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; draft: Draft } | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);

  // Restore last used place + program (fast repeat entries).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read localStorage after mount
    setDraft((d) => ({ ...d, place: readLS(LS_PLACE), program_id: readLS(LS_PROGRAM) }));
  }, []);
  // Drop a remembered program that no longer exists / is inactive.
  useEffect(() => {
    if (programs && draft.program_id && !programs.some((p) => String(p.id) === draft.program_id && p.is_active)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reconcile with loaded programs
      setDraft((d) => ({ ...d, program_id: "" }));
    }
  }, [programs, draft.program_id]);

  const programById = useMemo(() => new Map((programs ?? []).map((p) => [p.id, p])), [programs]);

  const loadEntries = useCallback(
    async (append: boolean) => {
      if (!sb) return;
      const offset = append ? (entries?.length ?? 0) : 0;
      const { data, error } = await sb
        .from("ledger_entries")
        .select(LEDGER_COLUMNS)
        .order("entry_date", { ascending: false })
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE - 1);
      if (error) return setListError(error.message);
      setListError(null);
      setEntries((prev) => (append ? [...(prev ?? []), ...(data as LedgerEntryRow[])] : (data as LedgerEntryRow[])));
      setHasMore(data.length === PAGE);
    },
    [sb, entries?.length],
  );

  const loadPlaces = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.rpc("get_impact_stats");
    const used = ((data?.by_place ?? []) as { place: string }[]).map((p) => p.place);
    setPlaces([...new Set([...used, ...DEFAULT_PLACES])]);
  }, [sb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void loadEntries(false);
    void loadPlaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sb]);

  const validate = (d: Draft) => {
    const qty = Number(d.quantity);
    if (!Number.isInteger(qty) || qty < 1) return "Quantity must be a whole number above 0.";
    if (!d.place.trim()) return "Please enter a place.";
    if (!d.program_id) return "Please choose a program.";
    if (!d.entry_date) return "Please choose a date.";
    return null;
  };

  const toRow = (d: Draft) => ({
    entry_date: d.entry_date,
    quantity: Number(d.quantity),
    place: tidyPlace(d.place),
    program_id: Number(d.program_id),
    note: d.note.trim() || null,
    photo_url: d.photo_url,
  });

  async function uploadLedgerPhoto(
    file: File,
    form: "new" | "edit",
    setUrl: (url: string) => void,
    setPreview: (url: string | null) => void,
  ) {
    if (!sb) return toast({ message: "Storage is not configured.", type: "error" });
    if (photoBusy) return;
    const local = URL.createObjectURL(file);
    setPreview(local);
    setUploadingPhotoFor(form);
    try {
      const photo = await processLedgerPhoto(file);
      const url = await uploadImage(photo, { folder: "ledger" });
      setUrl(url);
      setPreview(null);
      toast({ message: `Photo uploaded (${Math.round(photo.size / 1024)} KB)` });
    } catch (error) {
      setPreview(null);
      toast({ message: `Photo upload failed: ${error instanceof Error ? error.message : "unknown error"}`, type: "error" });
    } finally {
      URL.revokeObjectURL(local);
      setUploadingPhotoFor(null);
    }
  }

  function uploadNewPhoto(file: File) {
    void uploadLedgerPhoto(file, "new", (photo_url) => setDraft((d) => ({ ...d, photo_url })), setNewPhotoPreview);
  }

  function uploadEditPhoto(file: File) {
    void uploadLedgerPhoto(
      file,
      "edit",
      (photo_url) => setEditing((current) => current ? { ...current, draft: { ...current.draft, photo_url } } : current),
      setEditPhotoPreview,
    );
  }

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sb || saving || photoBusy) return;
    const andAnother = (e.nativeEvent as SubmitEvent).submitter?.dataset.mode !== "done";
    const problem = validate(draft);
    if (problem) return toast({ message: problem, type: "error" });

    setSaving(true);
    const row = toRow(draft);
    const { data, error } = await sb.from("ledger_entries").insert(row).select(LEDGER_COLUMNS).single();
    setSaving(false);
    if (error) return toast({ message: `Couldn't save: ${error.message}`, type: "error" });

    const saved = data as LedgerEntryRow;
    writeLS(LS_PLACE, row.place);
    writeLS(LS_PROGRAM, String(row.program_id));
    setEntries((prev) => [saved, ...(prev ?? [])].sort((a, b) => b.entry_date.localeCompare(a.entry_date) || b.created_at.localeCompare(a.created_at)));
    if (!places.includes(row.place)) setPlaces((p) => [row.place, ...p]);
    setHighlight(saved.id);
    setTimeout(() => setHighlight(null), 2500);
    const prog = programById.get(row.program_id)?.name_en ?? "";
    toast({ message: `Saved: ${row.quantity} · ${prog} · ${row.place}` });
    void revalidatePublic(["ledger"]);

    // Keep date, place and program; clear the rest.
    setDraft((d) => ({ ...d, place: row.place, quantity: "", note: "", photo_url: null }));
    setNewPhotoPreview(null);
    if (andAnother) qtyRef.current?.focus();
    else listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function remove(entry: LedgerEntryRow) {
    if (!sb) return;
    const prog = programById.get(entry.program_id)?.name_en ?? "entry";
    const ok = await confirm({
      title: "Delete this entry?",
      body: `${entry.quantity} · ${prog} · ${entry.place} on ${formatShortDate(entry.entry_date, "en")}. The public counters will go down.`,
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    const { error } = await sb.from("ledger_entries").delete().eq("id", entry.id);
    if (error) return toast({ message: `Couldn't delete: ${error.message}`, type: "error" });
    setEntries((prev) => prev?.filter((x) => x.id !== entry.id) ?? null);
    void revalidatePublic(["ledger"]);
    toast({
      message: "Entry deleted",
      action: {
        label: "Undo",
        onClick: async () => {
          const { error: e2 } = await sb.from("ledger_entries").insert({
            id: entry.id,
            entry_date: entry.entry_date,
            quantity: entry.quantity,
            place: entry.place,
            program_id: entry.program_id,
            note: entry.note,
            photo_url: entry.photo_url,
            created_at: entry.created_at,
          });
          if (e2) return toast({ message: `Undo failed: ${e2.message}`, type: "error" });
          toast({ message: "Entry restored" });
          void revalidatePublic(["ledger"]);
          void loadEntries(false);
        },
      },
    });
  }

  function openEdit(entry: LedgerEntryRow) {
    setEditPhotoPreview(null);
    setEditing({
      id: entry.id,
      draft: {
        entry_date: entry.entry_date,
        quantity: String(entry.quantity),
        place: entry.place,
        program_id: String(entry.program_id),
        note: entry.note ?? "",
        photo_url: entry.photo_url,
      },
    });
    requestAnimationFrame(() => editDialog.current?.showModal());
  }

  async function saveEdit(e: FormEvent) {
    e.preventDefault();
    if (!sb || !editing || photoBusy) return;
    const problem = validate(editing.draft);
    if (problem) return toast({ message: problem, type: "error" });
    setEditSaving(true);
    const { data, error } = await sb.from("ledger_entries").update(toRow(editing.draft)).eq("id", editing.id).select(LEDGER_COLUMNS).single();
    setEditSaving(false);
    if (error) return toast({ message: `Couldn't update: ${error.message}`, type: "error" });
    setEntries((prev) => prev?.map((x) => (x.id === editing.id ? (data as LedgerEntryRow) : x)) ?? null);
    editDialog.current?.close();
    setEditing(null);
    setEditPhotoPreview(null);
    toast({ message: "Entry updated" });
    void revalidatePublic(["ledger"]);
  }

  if (programsError) return <p role="alert" className="text-[#b42318]">Couldn&apos;t load programs: {programsError}. Did you run supabase/schema.sql?</p>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold sm:text-4xl">Distribution ledger</h1>
        <p className="mt-1 text-ink-soft">Each entry updates the public counters instantly.</p>
      </header>

      {/* ── Fast entry form ── */}
      <form onSubmit={save} className={ui.card} aria-labelledby="new-entry">
        <h2 id="new-entry" className="mb-5 text-xl font-semibold">New entry</h2>
        {programs ? (
          <EntryFields
            draft={draft}
            set={(p) => setDraft((d) => ({ ...d, ...p }))}
            programs={programs}
            places={places}
            qtyRef={qtyRef}
            idPrefix="new"
            photoBusy={uploadingPhotoFor === "new"}
            photoPreview={newPhotoPreview}
            onPhoto={uploadNewPhoto}
            onRemovePhoto={() => {
              setDraft((d) => ({ ...d, photo_url: null }));
              setNewPhotoPreview(null);
            }}
          />
        ) : (
          <div className="h-72 animate-pulse rounded-xl bg-ink/5" role="status" aria-label="Loading" />
        )}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="submit" data-mode="another" disabled={saving || photoBusy || !programs} className={cn(ui.btn, ui.gold, "flex-1 text-lg")}>
            <Icon name="check" size={20} /> {saving ? "Saving…" : "Save & add another"}
          </button>
          <button type="submit" data-mode="done" disabled={saving || photoBusy || !programs} className={cn(ui.btn, ui.outline)}>
            Save
          </button>
        </div>
      </form>

      {/* ── Recent entries ── */}
      <section ref={listRef} aria-labelledby="recent" className="scroll-mt-28">
        <h2 id="recent" className="mb-4 text-xl font-semibold">Recent entries</h2>
        {listError && (
          <p role="alert" className="mb-4 text-sm text-[#b42318]">
            {listError} <button type="button" className="font-semibold underline" onClick={() => void loadEntries(false)}>Retry</button>
          </p>
        )}
        {entries === null ? (
          <ul className="space-y-2">{Array.from({ length: 5 }, (_, i) => <li key={i} className="h-16 animate-pulse rounded-2xl bg-ink/5" />)}</ul>
        ) : entries.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-center text-ink-soft ring-1 ring-ink/8">No entries yet. Add the first one above.</p>
        ) : (
          <ul className="space-y-2">
            {entries.map((e) => {
              const p = programById.get(e.program_id);
              return (
                <li
                  key={e.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/8 transition-shadow",
                    highlight === e.id && "ring-2 ring-mustard",
                  )}
                >
                  <span aria-hidden className="hidden size-10 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-maroon sm:flex">
                    <Icon name={p && isIconKey(p.icon) ? p.icon : "plate"} size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      <span className="tabular">{e.quantity}</span> · {p?.name_en ?? "Unknown program"}
                    </p>
                    <p className="truncate text-sm text-ink-soft">
                      {formatShortDate(e.entry_date, "en")} · {e.place}
                      {e.note && ` · ${e.note}`}
                    </p>
                  </div>
                  <button type="button" className={ui.iconBtn} onClick={() => openEdit(e)} aria-label={`Edit entry: ${e.quantity} ${p?.name_en ?? ""} at ${e.place}`}>
                    <Icon name="edit" size={18} />
                  </button>
                  <button type="button" className={cn(ui.iconBtn, "hover:text-[#b42318]")} onClick={() => void remove(e)} aria-label={`Delete entry: ${e.quantity} ${p?.name_en ?? ""} at ${e.place}`}>
                    <Icon name="trash" size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {hasMore && (
          <button type="button" onClick={() => void loadEntries(true)} className={cn(ui.btn, ui.outline, "mt-4 w-full")}>
            Load more
          </button>
        )}
      </section>

      {/* ── Edit dialog (native <dialog>: focus trapped, Esc closes) ── */}
      <dialog
        ref={editDialog}
        aria-labelledby="edit-title"
        onClose={() => {
          setEditing(null);
          setEditPhotoPreview(null);
        }}
        className="m-auto max-h-[92dvh] w-[min(36rem,calc(100vw-1.5rem))] overflow-y-auto rounded-[var(--radius-card)] bg-cream p-0 text-ink shadow-2xl backdrop:bg-ink/50"
      >
        {editing && programs && (
          <form onSubmit={saveEdit} className="p-5 sm:p-6">
            <h2 id="edit-title" className="mb-5 text-2xl font-semibold">Edit entry</h2>
            <EntryFields
              draft={editing.draft}
              set={(p) => setEditing((s) => (s ? { ...s, draft: { ...s.draft, ...p } } : s))}
              programs={programs}
              places={places}
              idPrefix="edit"
              photoBusy={uploadingPhotoFor === "edit"}
              photoPreview={editPhotoPreview}
              onPhoto={uploadEditPhoto}
              onRemovePhoto={() => {
                setEditing((current) => current ? { ...current, draft: { ...current.draft, photo_url: null } } : current);
                setEditPhotoPreview(null);
              }}
            />
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" disabled={photoBusy} className={cn(ui.btn, ui.outline)} onClick={() => editDialog.current?.close()}>Cancel</button>
              <button type="submit" disabled={editSaving || photoBusy} className={cn(ui.btn, ui.primary)}>{editSaving ? "Saving…" : "Save changes"}</button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
