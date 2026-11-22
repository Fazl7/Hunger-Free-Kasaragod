"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { useToast } from "@/components/admin/Toast";
import { useConfirm } from "@/components/admin/ConfirmDialog";
import { ui } from "@/components/admin/ui";
import { Icon } from "@/components/icons/Icon";
import { revalidatePublic } from "@/lib/supabase/browser";
import type { PressReleaseRow } from "@/lib/supabase/types";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type Item = Pick<PressReleaseRow, "id" | "slug" | "title_en" | "release_date" | "place" | "is_published" | "photo_thumb_url">;

export default function AdminPressListPage() {
  const { sb } = useAdminAuth();
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!sb) return;
    const { data, error } = await sb
      .from("press_releases")
      .select("id,slug,title_en,release_date,place,is_published,photo_thumb_url")
      .order("release_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) return setError(error.message);
    setError(null);
    setItems(data as Item[]);
  }, [sb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void load();
  }, [load]);

  async function togglePublish(it: Item) {
    if (!sb) return;
    const { error } = await sb.from("press_releases").update({ is_published: !it.is_published }).eq("id", it.id);
    if (error) return toast({ message: error.message, type: "error" });
    setItems((all) => all?.map((x) => (x.id === it.id ? { ...x, is_published: !x.is_published } : x)) ?? null);
    toast({ message: it.is_published ? "Moved to drafts" : "Published" });
    void revalidatePublic(["press"]);
  }

  async function remove(it: Item) {
    if (!sb) return;
    const ok = await confirm({ title: "Delete this press release?", body: `“${it.title_en}” will be removed permanently.`, confirmLabel: "Delete", danger: true });
    if (!ok) return;
    const { data: full } = await sb.from("press_releases").select("*").eq("id", it.id).single();
    const { error } = await sb.from("press_releases").delete().eq("id", it.id);
    if (error) return toast({ message: error.message, type: "error" });
    setItems((all) => all?.filter((x) => x.id !== it.id) ?? null);
    void revalidatePublic(["press"]);
    toast({
      message: "Press release deleted",
      action: full
        ? {
            label: "Undo",
            onClick: async () => {
              const { error: e2 } = await sb.from("press_releases").insert(full);
              if (e2) return toast({ message: `Undo failed: ${e2.message}`, type: "error" });
              toast({ message: "Restored" });
              void revalidatePublic(["press"]);
              void load();
            },
          }
        : undefined,
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Press releases</h1>
          <p className="mt-1 text-ink-soft">Drafts are only visible here.</p>
        </div>
        <Link href="/admin/press/new" className={cn(ui.btn, ui.gold)}>
          <Icon name="edit" size={18} /> New press release
        </Link>
      </header>

      {error && (
        <p role="alert" className="text-sm text-[#b42318]">
          {error} <button type="button" className="font-semibold underline" onClick={() => void load()}>Retry</button>
        </p>
      )}

      {items === null ? (
        <ul className="space-y-2">{Array.from({ length: 3 }, (_, i) => <li key={i} className="h-24 animate-pulse rounded-2xl bg-ink/5" />)}</ul>
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-ink-soft ring-1 ring-ink/8">No press releases yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/8 sm:flex-nowrap">
              <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {it.photo_thumb_url && <img src={it.photo_thumb_url} alt="" className="size-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", it.is_published ? "bg-leaf/15 text-leaf" : "bg-ink/10 text-ink-soft")}>
                    {it.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-ink-soft">{formatLongDate(it.release_date, "en")}{it.place && ` · ${it.place}`}</span>
                </p>
                <Link href={`/admin/press/${it.id}`} className="mt-1 block truncate font-semibold hover:text-maroon">{it.title_en}</Link>
              </div>
              <div className="flex gap-1">
                <Link href={`/admin/press/${it.id}`} className={ui.iconBtn} aria-label={`Edit “${it.title_en}”`}><Icon name="edit" size={18} /></Link>
                {it.is_published && (
                  <a href={`/en/press/${it.slug}`} target="_blank" rel="noopener" className={ui.iconBtn} aria-label={`View “${it.title_en}” on the site`}>
                    <Icon name="globe" size={18} />
                  </a>
                )}
                <button type="button" className={ui.iconBtn} onClick={() => void togglePublish(it)} aria-label={it.is_published ? `Unpublish “${it.title_en}”` : `Publish “${it.title_en}”`}>
                  <Icon name={it.is_published ? "eyeOff" : "eye"} size={18} />
                </button>
                <button type="button" className={cn(ui.iconBtn, "hover:text-[#b42318]")} onClick={() => void remove(it)} aria-label={`Delete “${it.title_en}”`}>
                  <Icon name="trash" size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
