import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/impact", title: t("impactTitle"), description: t("impactDescription"), absoluteTitle: true });
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("impact");
  const nav = await getTranslations("nav");
  const crumbs = [{ name: nav("impact"), path: "/impact" }];

  return (
    <>
      <PageHero title={t("title")} intro={t("intro")} crumbs={crumbs} />
      <section className="container-page grid gap-10 py-12 pb-20 lg:grid-cols-[1.4fr_0.8fr]">
        <article className="max-w-3xl space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>{t("paragraphOne")}</p>
          <p>{t("paragraphTwo")}</p>
          <p className="text-sm">{t("note")}</p>
        </article>
        <aside className="h-fit rounded-[var(--radius-card)] bg-cream-deep/60 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold">{t("waysHeading")}</h2>
          <ul className="mt-5 space-y-4">
            <li><strong className="block text-2xl">50</strong><span className="text-ink-soft">{t("breakfastsLabel")}</span></li>
            <li><strong className="block text-2xl">80</strong><span className="text-ink-soft">{t("lunchesLabel")}</span></li>
            <li><strong className="block text-2xl">6</strong><span className="text-ink-soft">{t("daysLabel")}</span></li>
            <li><strong className="block text-2xl">100</strong><span className="text-ink-soft">{t("kitsLabel")}</span></li>
          </ul>
          <ButtonLink href="/ledger" variant="outline" icon="arrowRight" className="mt-7">{t("ledgerLink")}</ButtonLink>
        </aside>
      </section>
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
