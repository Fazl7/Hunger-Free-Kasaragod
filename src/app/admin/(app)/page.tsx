"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuth";
import { usePrograms } from "@/components/admin/usePrograms";
import { useToast } from "@/components/admin/Toast";
import { ui } from "@/components/admin/ui";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { revalidatePublic } from "@/lib/supabase/browser";
import { LEDGER_COLUMNS, type CountsAs, type ImpactStats, type LedgerEntryRow, type ProgramRow } from "@/lib/supabase/types";
import { formatCount, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { sb } = useAdminAuth();
  const toast = useToast();
  const { programs, reload: reloadPrograms } = usePrograms();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [recent, setRecent] = useState<LedgerEntryRow[] | null>(null);
  const [startDate, setStartDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!sb) return;
    const [s, r, st] = await Promise.all([
      sb.rpc("get_impact_stats"),
      sb.from("ledger_entries").select(LEDGER_COLUMNS).order("created_at", { ascending: false }).limit(5),
      sb.from("settings").select("value").eq("key", "programme_start_date").maybeSingle(),
    ]);
    if (s.error || r.error) return setError((s.error ?? r.error)!.message);
    setError(null);
    setStats(s.data as ImpactStats);
    setRecent(r.data as LedgerEntryRow[]);
    setStartDate(st.data?.value ?? "");
  }, [sb]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    void load();
  }, [load]);

  async function saveStartDate(value: string) {
    if (!sb) return;
    const { error } = await sb.from("settings").upsert({ key: "programme_start_date", value: value || null });
    if (error) return toast({ message: error.message, type: "error" });
    toast({ message: value ? "Start date saved" : "Using the earliest ledger entry as start date" });
    void revalidatePublic(["ledger"]);
    void load();
  }

  async function patchProgram(p: ProgramRow, change: Partial<ProgramRow>) {
    if (!sb) return;
    const { error } = await sb.from("programs").update(change).eq("id", p.id);
    if (error) return toast({ message: error.message, type: "error" });
    toast({ message: `${p.name_en} updated` });
    void reloadPrograms();
    void load();
    void revalidatePublic(["programs", "ledger"]);
  }

  const names = new Map((programs ?? []).map((p) => [p.id, p.name_en]));
  const tiles: { label: string; value: number | null | undefined; icon: IconKey }[] = [
    { label: "Foods distributed", value: stats?.meals, icon: "plate" },
    { label: "Kits given", value: stats?.kits, icon: "kit" },
    { label: "Days since started", value: stats?.days, icon: "calendar" },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Dashboard</h1>
          <p className="mt-1 text-ink-soft">What the public sees right now.</p>
        </div>
        <Link href="/admin/ledger" className={cn(ui.btn, ui.gold)}>
          <Icon name="kit" size={18} /> Add ledger entry
        </Link>
      </header>

      {error && (
        <p role="alert" className="rounded-xl bg-[#fef3f2] p-4 text-sm text-[#b42318]">
          {error}. Did you run <code>supabase/schema.sql</code> and add yourself to <code>admins</code>?
        </p>
      )}

      <ul className="grid gap-3 sm:grid-cols-3">
        {tiles.map((t, i) => (
          <li key={t.label} className="on-dark flex items-center gap-4 rounded-[var(--radius-card)] bg-ink p-5 text-cream">
            <span className={cn("flex size-12 items-center justify-center rounded-2xl", i === 0 ? "bg-mustard text-ink" : "bg-cream/10 text-mustard")}>
              <Icon name={t.icon} size={24} />
            </span>
            <p>
              <span className="block font-display text-4xl leading-none font-semibold tabular">
                {stats ? (t.value === null || t.value === undefined ? "–" : formatCount(t.value, "en")) : <span className="inline-block h-9 w-20 animate-pulse rounded bg-cream/15" />}
              </span>
              <span className="text-sm text-cream/75">{t.label}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={ui.card} aria-labelledby="recent-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-title" className="text-xl font-semibold">Last 5 entries</h2>
            <Link href="/admin/ledger" className="text-sm font-semibold text-maroon hover:underline">All entries →</Link>
          </div>
          {recent === null ? (
            <div className="h-48 animate-pulse rounded-xl bg-ink/5" />
          ) : recent.length === 0 ? (
            <p className="text-ink-soft">No entries yet.</p>
          ) : (
            <ul className="divide-y divide-ink/8">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{names.get(e.program_id) ?? "–"}</span>
                    <span className="text-sm text-ink-soft">{formatShortDate(e.entry_date, "en")} · {e.place}</span>
                  </span>
                  <span className="font-display text-2xl font-semibold tabular">{formatCount(e.quantity, "en")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={ui.card} aria-labelledby="settings-title">
          <h2 id="settings-title" className="text-xl font-semibold">Programme start date</h2>
          <p className="mt-1 text-sm text-ink-soft">
            &ldquo;Days since started&rdquo; counts from this date. Leave empty to use the earliest ledger entry
            {stats?.start_date && !startDate ? ` (${formatShortDate(stats.start_date, "en")} ${stats.start_date.slice(0, 4)})` : ""}.
          </p>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void saveStartDate(startDate);
            }}
          >
            <input type="date" className={ui.input} value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label="Programme start date" />
            <button type="submit" className={cn(ui.btn, ui.primary)}>Save</button>
            {startDate && (
              <button type="button" className={cn(ui.btn, ui.ghost)} onClick={() => { setStartDate(""); void saveStartDate(""); }}>Clear</button>
            )}
          </form>
        </section>
      </div>

      <section className={ui.card} aria-labelledby="programs-title">
        <h2 id="programs-title" className="text-xl font-semibold">Programs</h2>
        <p className="mt-1 text-sm text-ink-soft">
          &ldquo;Counts as&rdquo; decides which public counter a program feeds. Changing it recalculates all totals instantly.
        </p>
        {programs === null ? (
          <div className="mt-4 h-64 animate-pulse rounded-xl bg-ink/5" />
        ) : (
          <ul className="mt-4 divide-y divide-ink/8">
            {programs.filter((p) => p.is_active).map((p) => (
              <li key={p.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <span className={cn("font-medium", !p.is_active && "text-ink-soft line-through")}>
                  {p.name_en}
                  {p.name_ml && <span lang="ml" className="block text-sm font-normal text-ink-soft">{p.name_ml}</span>}
                </span>
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-ink-soft">Counts as</span>
                  <select
                    className={cn(ui.input, "min-h-11 w-auto")}
                    value={p.counts_as}
                    onChange={(e) => void patchProgram(p, { counts_as: e.target.value as CountsAs })}
                    aria-label={`${p.name_en} counts as`}
                  >
                    <option value="kits">Kits</option>
                    <option value="meals">Foods / meals</option>
                    <option value="other">Neither</option>
                  </select>
                </label>
                <label className="inline-flex min-h-11 items-center gap-2 text-sm font-medium">
                  <input type="checkbox" className="size-5 accent-maroon" checked={p.is_active} onChange={(e) => void patchProgram(p, { is_active: e.target.checked })} />
                  Active
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
