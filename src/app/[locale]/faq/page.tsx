import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { faqs } from "@content/faqs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { FaqSection } from "@/sections/FaqSection";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return buildMetadata({
    locale,
    path: "/faq",
    title: t("heading"),
    description: t("intro"),
    absoluteTitle: true,
  });
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");
  const nav = await getTranslations("nav");
  const crumbs = [{ name: nav("faq"), path: "/faq" }];

  return (
    <>
      <PageHero title={t("heading")} intro={t("intro")} crumbs={crumbs} />
      <FaqSection limit={faqs.length} />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
