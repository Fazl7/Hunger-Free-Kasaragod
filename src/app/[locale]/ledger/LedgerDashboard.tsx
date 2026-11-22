"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { LEDGER_COLUMNS, type CountsAs, type ImpactStats, type LedgerEntryRow, type ProgramRow } from "@/lib/supabase/types";
import { formatCount, formatMonth, pick } from "@/lib/format";
import { AnimatedCounter } from "@/components/live/AnimatedCounter";
import { LedgerBox } from "@/components/live/LedgerBox";
import { MonthlyBars } from "@/components/live/MonthlyBars";
import { UpdatedIndicator } from "@/components/live/UpdatedIndicator";
import { useImpactStats } from "@/components/live/useImpactStats";
import { Icon, isIconKey, type IconKey } from "@/components/icons/Icon";
import { cn } from "@/lib/utils";

const PAGE = 30;
type Filters = { program: string; place: string; month: string };
const EMPTY: Filters = { program: "", place: "", month: "" };

/** Next month's first day, for a half-open [month, next) date range. */
const nextMonth = (m: string) => {
  const [y, mo] = m.split("-").map(Number);
  return mo === 12 ? `${y + 1}-01-01` : `${y}-${String(mo + 1).padStart(2, "0")}-01`;
};

export function LedgerDashboard({
  initialStats,
  initialEntries,
  programs,
}: {
  initialStats: ImpactStats | null;
  initialEntries: LedgerEntryRow[] | null;
  programs: ProgramRow[] | null;
}) {
  const t = useTranslations("ledgerPage");
  const tn = useTranslations("numbers");
  const tl = useTranslations("live");
  const locale = useLocale();

  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [entries, setEntries] = useState<LedgerEntryRow[]>(initialEntries ?? []);
  const [hasMore, setHasMore] = useState((initialEntries?.length ?? 0) === PAGE);
  const [state, setState] = useState<"idle" | "loading" | "error">(initialEntries ? "idle" : "error");
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const entriesRef = useRef(entries);
  const filtersRef = useRef(filters);
  useEffect(() => {
    entriesRef.current = entries;
    filtersRef.current = filters;
  }, [entries, filters]);

  /** Fetch `limit` rows from `offset` for the given filters. */
  const query = useCallback(async (f: Filters, offset: number, limit: number) => {
    const sb = getBrowserSupabase();
    if (!sb) throw new Error("not configured");
    let q = sb
      .from("ledger_entries")
      .select(LEDGER_COLUMNS)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (f.program) q = q.eq("program_id", Number(f.program));
    if (f.place) q = q.eq("place", f.place);
    if (f.month) q = q.gte("entry_date", `${f.month}-01`).lt("entry_date", nextMonth(f.month));
    const { data, error } = await q;
    if (error) throw error;
    return data as LedgerEntryRow[];
  }, []);

  const load = useCallback(
    async (f: Filters, append: boolean) => {
      setState("loading");
      try {
        const offset = append ? entriesRef.current.length : 0;
        const rows = await query(f, offset, PAGE);
        setEntries((prev) => (append ? [...prev, ...rows] : rows));
        setHasMore(rows.length === PAGE);
        setState("idle");
      } catch {
        setState("error");
      }
    },
    [query],
  );

  /** Realtime: reload what's on screen and highlight anything new. */
  const onLedgerChange = useCallback(async () => {
    try {
      const before = new Set(entriesRef.current.map((e) => e.id));
      const rows = await query(filtersRef.current, 0, Math.max(PAGE, entriesRef.current.length));
      setEntries(rows);
      const added = rows.filter((r) => !before.has(r.id)).map((r) => r.id);
      if (added.length) {
        setFresh(new Set(added));
        setTimeout(() => setFresh(new Set()), 4000);
      }
    } catch {
      /* keep what we have */
    }
  }, [query]);

  const { stats, status, updatedAt, refresh } = useImpactStats(initialStats, onLedgerChange);

  const setFilter = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    void load(next, false);
  };

  // Program lookup (programs table, falling back to stats).
  const programMap = useMemo(() => {
    const m = new Map<number, { name: string; icon: string; countsAs: CountsAs }>();
    for (const p of programs ?? []) m.set(p.id, { name: pick(p.name_en, p.name_ml, locale), icon: p.icon, countsAs: p.counts_as });
    for (const p of stats?.by_program ?? [])
      if (!m.has(p.id)) m.set(p.id, { name: pick(p.name_en, p.name_ml, locale), icon: p.icon, countsAs: p.counts_as });
    return m;
  }, [programs, stats, locale]);

  const groups = useMemo(() => {
    const out: { month: string; rows: LedgerEntryRow[] }[] = [];
    for (const e of entries) {
      const m = e.entry_date.slice(0, 7);
      if (out.at(-1)?.month !== m) out.push({ month: m, rows: [] });
      out.at(-1)!.rows.push(e);
    }
    return out;
  }, [entries]);

  const unit = (c: CountsAs) => t(`units.${c}`);
  const filtered = filters.program || filters.place || filters.month;
  const loaded = status === "ready" && stats;

  const totals: { key: string; value: number | null; label: string; icon: IconKey; tone: string }[] = [
    { key: "kits", value: stats?.kits ?? null, label: tn("kitsGiven"), icon: "kit", tone: "bg-mustard text-ink" },
    { key: "days", value: stats?.days ?? null, label: tn("daysSince"), icon: "calendar", tone: "bg-cream/10 text-mustard" },
    { key: "meals", value: stats?.meals ?? null, label: tn("foodsDistributed"), icon: "plate", tone: "bg-cream/10 text-mustard" },
  ];

  const select =
    "min-h-11 w-full rounded-xl border border-ink/15 bg-white px-3 text-[0.95rem] text-ink focus:border-maroon focus:outline-none sm:w-auto";

  return (
    <div className="container-page space-y-12 pb-24">
      {/* ── Top row: three large totals ── */}
      <section aria-labelledby="totals-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="totals-title" className="font-sans text-sm font-semibold tracking-[0.14em] text-maroon uppercase">{t("totals")}</h2>
          {status === "error" && !stats ? (
            <button type="button" onClick={() => void refresh()} className="text-sm font-medium text-maroon underline underline-offset-4">
              {tl("error")} {tl("retry")}
            </button>
          ) : (
            <UpdatedIndicator updatedAt={updatedAt} className="text-sm text-ink-soft" />
          )}
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[2rem] bg-cream/15 text-cream shadow-[0_30px_60px_-30px_rgba(30,26,23,.6)] sm:grid-cols-3">
          {totals.map((s) => (
            <li key={s.key} className="flex items-center gap-4 bg-ink p-6 sm:flex-col sm:items-start lg:flex-row lg:items-center lg:p-8">
              <span aria-hidden className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl lg:size-14", s.tone)}>
                <Icon name={s.icon} size={26} />
              </span>
              <p className="flex flex-col">
                <span className="font-display text-4xl leading-none font-semibold lg:text-5xl">
                  {loaded && s.value === null ? "–" : <AnimatedCounter value={s.value} locale={locale} />}
                </span>
                <span className="mt-2 text-sm leading-snug text-cream/75">{s.label}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Per-program chips + monthly chart ── */}
      {stats && stats.total_entries > 0 && (
        <section aria-labelledby="breakdown-title" className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="breakdown-title" className="mb-4 font-display text-xl font-semibold">{t("byProgram")}</h2>
            <ul className="flex flex-wrap gap-2">
              {stats.by_program
                .filter((p) => p.total > 0)
                .map((p) => {
                  const on = filters.program === String(p.id);
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setFilter("program", on ? "" : String(p.id))}
                        className={cn(
                          "inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 transition-colors",
                          on ? "bg-maroon text-cream ring-maroon" : "bg-white text-ink ring-ink/10 hover:ring-maroon/40",
                        )}
                      >
                        <Icon name={isIconKey(p.icon) ? p.icon : "plate"} size={16} className={on ? "" : "text-maroon"} />
                        <span className="font-medium">{pick(p.name_en, p.name_ml, locale)}</span>
                        <span className={cn("font-semibold tabular", on ? "text-mustard" : "text-maroon")}>
                          {formatCount(p.total, locale)}
                          {p.counts_as !== "other" && <span className="ml-1 font-normal opacity-80">{unit(p.counts_as)}</span>}
                        </span>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
          <MonthlyBars
            months={stats.by_month}
            locale={locale}
            labels={{
              title: t("byMonth"),
              table: t("monthTable"),
              month: t("month"),
              total: t("total"),
              meals: unit("meals"),
              kits: unit("kits"),
              other: unit("other"),
            }}
          />
        </section>
      )}

      {/* ── Entries ── */}
      <section aria-labelledby="entries-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 id="entries-title" className="text-3xl font-semibold sm:text-4xl">{t("entries")}</h2>
          {stats && <p className="text-sm text-ink-soft">{t("entryCount", { count: stats.total_entries })}</p>}
        </div>

        {/* Filters */}
        <fieldset className="mb-8 flex flex-col gap-3 rounded-2xl bg-cream-deep p-4 sm:flex-row sm:flex-wrap sm:items-end">
          <legend className="sr-only">{t("filters")}</legend>
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t("program")}
            <select className={select} value={filters.program} onChange={(e) => setFilter("program", e.target.value)}>
              <option value="">{t("allPrograms")}</option>
              {[...programMap.entries()].map(([id, p]) => (
                <option key={id} value={id}>{p.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t("place")}
            <select className={select} value={filters.place} onChange={(e) => setFilter("place", e.target.value)}>
              <option value="">{t("allPlaces")}</option>
              {(stats?.by_place ?? []).map((p) => (
                <option key={p.place} value={p.place}>{p.place}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            {t("monthFilter")}
            <select className={select} value={filters.month} onChange={(e) => setFilter("month", e.target.value)}>
              <option value="">{t("allMonths")}</option>
              {[...(stats?.by_month ?? [])].reverse().map((m) => (
                <option key={m.month} value={m.month}>{formatMonth(m.month, locale)}</option>
              ))}
            </select>
          </label>
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setFilters(EMPTY);
                void load(EMPTY, false);
              }}
              className="min-h-11 rounded-xl px-4 text-sm font-semibold text-maroon hover:bg-maroon/5"
            >
              {t("clear")}
            </button>
          )}
        </fieldset>

        <div aria-live="polite" aria-busy={state === "loading"}>
          {state === "error" && entries.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-ink/8">
              <p className="text-ink-soft">{t("error")}</p>
              <button
                type="button"
                onClick={() => void load(filters, false)}
                className="mt-4 inline-flex min-h-11 items-center rounded-full bg-maroon px-6 font-semibold text-cream"
              >
                {t("retry")}
              </button>
            </div>
          ) : state === "loading" && entries.length === 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => (
                <li key={i} className="h-40 animate-pulse rounded-2xl bg-ink/5" />
              ))}
            </ul>
          ) : entries.length === 0 ? (
            <p className="rounded-2xl bg-white p-8 text-center text-ink-soft ring-1 ring-ink/8">{filtered ? t("noMatch") : t("empty")}</p>
          ) : (
            <div className="space-y-10">
              {groups.map((g) => (
                <section key={g.month} aria-labelledby={`m-${g.month}`}>
                  <h3 id={`m-${g.month}`} className="mb-4 flex items-center gap-3 font-display text-xl font-semibold">
                    {formatMonth(g.month, locale)}
                    <span aria-hidden className="h-px flex-1 bg-ink/10" />
                  </h3>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {g.rows.map((e) => {
                      const p = programMap.get(e.program_id);
                      const c = p?.countsAs ?? "other";
                      return (
                        <li key={e.id}>
                          <LedgerBox
                            date={e.entry_date}
                            quantity={e.quantity}
                            unit={c === "other" ? "" : unit(c)}
                            countsAs={c}
                            programName={p?.name ?? "–"}
                            programIcon={p?.icon ?? "plate"}
                            place={e.place}
                            note={e.note}
                            photoUrl={e.photo_url}
                            locale={locale}
                            fresh={fresh.has(e.id)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        {hasMore && entries.length > 0 && (
          <div className="mt-10 text-center">
            <button
              type="button"
              disabled={state === "loading"}
              onClick={() => void load(filters, true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-maroon px-6 py-3 font-semibold text-maroon transition-colors hover:bg-maroon hover:text-cream disabled:opacity-60"
            >
              {state === "loading" ? t("loading") : t("loadMore")}
              <Icon name="arrowDown" size={18} />
            </button>
            {state === "error" && <p className="mt-3 text-sm text-maroon">{t("error")}</p>}
          </div>
        )}
      </section>
    </div>
  );
}
