import { getLocale, getTranslations } from "next-intl/server";
import { latestLedger } from "@content/collections";
import { getProgram } from "@content/programs";
import { siteConfig } from "@content/site.config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { GapNote } from "@/components/ui/GapNote";
import { formatDate, formatNumber, tr } from "@/lib/utils";

/** S9. Distribution ledger preview: quantity · place · date. Verified entries only. */
export async function LedgerPreview() {
  const t = await getTranslations("ledger");
  const locale = await getLocale();
  if (!siteConfig.features.ledger) return null;
  const rows = latestLedger(8);

  if (rows.length === 0) {
    return (
      <GapNote className="container-page my-8">
        Distribution ledger: real, dated entries (date, place, program, quantity, unit, verified). This section is the site’s biggest
        trust signal. Add entries to <code>content/collections.ts → ledger</code> (or connect the CMS / Google Sheet in Phase 3).
      </GapNote>
    );
  }

  const placeName = (id: string) => {
    const p = siteConfig.places.find((x) => x.id === id);
    return p ? tr(p.name, locale) : id;
  };

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
              {rows.map((r, i) => {
                const prog = getProgram(r.program);
                return (
                  <tr key={r.id} data-reveal="fade" style={{ ["--reveal-delay" as string]: `${i * 0.06}s` }} className="border-t border-ink/8 transition-colors hover:bg-mustard/10">
                    <td className="px-6 py-4 whitespace-nowrap tabular">
                      <time dateTime={r.date}>{formatDate(r.date, locale)}</time>
                    </td>
                    <td className="px-6 py-4">{placeName(r.place)}</td>
                    <td className="px-6 py-4">{prog ? tr(prog.name, locale) : r.program}</td>
                    <td className="px-6 py-4 font-semibold tabular">
                      {formatNumber(r.quantity, locale)} {t(`units.${r.unit}`)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-8">
          <ButtonLink href="/distribution-ledger" icon="arrowRight">{t("full")}</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
