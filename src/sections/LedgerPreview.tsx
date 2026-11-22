import { getLocale, getTranslations } from "next-intl/server";
import { latestLedger } from "@content/collections";
import { getProgram } from "@content/programs";
import { siteConfig } from "@content/site.config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { GapNote } from "@/components/ui/GapNote";
import { formatDate, formatNumber, tr } from "@/lib/utils";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getLedgerPage, getPrograms } from "@/lib/data";
import { formatCount, pick } from "@/lib/format";

type Row = { id: string; date: string; place: string; program: string; quantity: string };

/**
 * S9. Distribution ledger preview: quantity · place · date.
 * Reads the latest 8 entries from Supabase when configured (falls back to the
 * static collection otherwise). Table design unchanged.
 */
export async function LedgerPreview() {
  const t = await getTranslations("ledger");
  const tp = await getTranslations("ledgerPage");
  const locale = await getLocale();
  if (!siteConfig.features.ledger) return null;

  let rows: Row[] = [];
  if (supabaseConfigured) {
    const [entries, programs] = await Promise.all([getLedgerPage(8), getPrograms()]);
    const byId = new Map((programs ?? []).map((p) => [p.id, p]));
    rows = (entries ?? []).map((e) => {
      const p = byId.get(e.program_id);
      const unit = p && p.counts_as !== "other" ? ` ${tp(`units.${p.counts_as}`)}` : "";
      return {
        id: e.id,
        date: e.entry_date,
        place: e.place,
        program: p ? pick(p.name_en, p.name_ml, locale) : "–",
        quantity: `${formatCount(e.quantity, locale)}${unit}`,
      };
    });
  } else {
    const placeName = (id: string) => {
      const p = siteConfig.places.find((x) => x.id === id);
      return p ? tr(p.name, locale) : id;
    };
    rows = latestLedger(8).map((r) => {
      const prog = getProgram(r.program);
      return {
        id: r.id,
        date: r.date,
        place: placeName(r.place),
        program: prog ? tr(prog.name, locale) : r.program,
        quantity: `${formatNumber(r.quantity, locale)} ${t(`units.${r.unit}`)}`,
      };
    });
  }

  if (rows.length === 0) {
    return (
      <GapNote className="container-page my-8">
        Distribution ledger: no entries yet. Add the first ones at <code>/admin/ledger</code> and they appear here, on /ledger and in
        the home counters instantly.
      </GapNote>
    );
  }

  return (
    <Section id="ledger" tone="deep" labelledBy="ledger-title">
      <div className="container-page">
        <SectionHeading id="ledger-title" label={t("label")} title={t("heading")} sub={t("sub")} />
        <div className="overflow-x-auto rounded-[var(--radius-card)] bg-cream shadow-[0_20px_50px_-30px_rgba(30,26,23,.5)]">
          <table className="w-full min-w-[36rem] text-left">
            <caption className="sr-only">{t("heading")}</caption>
            <thead className="bg-ink text-sm text-cream">
              <tr>
                {[t("date"), t("place"), t("program"), t("quantity")].map((h) => (
                  <th key={h} scope="col" className="px-6 py-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} data-reveal="fade" style={{ ["--reveal-delay" as string]: `${i * 0.06}s` }} className="border-t border-ink/8 transition-colors hover:bg-mustard/10">
                  <td className="px-6 py-4 whitespace-nowrap tabular">
                    <time dateTime={r.date}>{formatDate(r.date, locale)}</time>
                  </td>
                  <td className="px-6 py-4">{r.place}</td>
                  <td className="px-6 py-4">{r.program}</td>
                  <td className="px-6 py-4 font-semibold tabular">{r.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8">
          <ButtonLink href="/ledger" icon="arrowRight">{t("full")}</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
