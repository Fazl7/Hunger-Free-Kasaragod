import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { MakeAnImpact } from "@/sections/MakeAnImpact";
import { DonateTiers } from "@/sections/DonateTiers";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/make-an-impact",
    title: t("makeAnImpactTitle"),
    description: t("makeAnImpactDescription"),
    absoluteTitle: true,
  });
}

export default async function MakeAnImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("impactHub");
  const nav = await getTranslations("nav");
  const crumbs = [{ name: nav("makeAnImpact"), path: "/make-an-impact" }];

  return (
    <>
      <PageHero title={nav("makeAnImpact")} intro={t("pageIntro")} crumbs={crumbs} />
      <MakeAnImpact />
      <DonateTiers />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
