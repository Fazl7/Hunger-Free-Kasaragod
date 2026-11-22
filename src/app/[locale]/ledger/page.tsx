import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { getImpactStats, getLedgerPage, getPrograms } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { LedgerDashboard } from "./LedgerDashboard";

type Props = { params: Promise<{ locale: string }> };

// Static + ISR. Refreshed on demand by /api/revalidate whenever the admin saves.
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/ledger", title: t("ledgerTitle"), description: t("ledgerDescription") });
}

export default async function LedgerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ledgerPage");
  const [stats, entries, programs] = await Promise.all([getImpactStats(), getLedgerPage(30), getPrograms()]);
  const crumbs = [{ name: t("title"), path: "/ledger" }];

  return (
    <>
      <PageHero title={t("title")} intro={t("intro")} crumbs={crumbs} />
      <section className="container-page max-w-5xl py-10 sm:py-14">
        <p className="text-lg leading-relaxed text-ink-soft">{t("context")}</p>
      </section>
      <LedgerDashboard initialStats={stats} initialEntries={entries} programs={programs} />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
