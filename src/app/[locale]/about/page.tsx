import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { aboutPage } from "@content/editorial";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialContent } from "@/components/content/EditorialContent";
import { PageHero } from "@/components/ui/PageHero";
import { OurStory } from "@/sections/OurStory";
import { TrustSection } from "@/sections/TrustSection";
import { tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/about",
    title: tr(aboutPage.title, locale),
    description: tr(aboutPage.intro, locale),
    absoluteTitle: true,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const title = tr(aboutPage.title, locale);
  const crumbs = [{ name: nav("about"), path: "/about" }];

  return (
    <>
      <PageHero title={title} intro={tr(aboutPage.intro, locale)} crumbs={crumbs} />
      <EditorialContent sections={aboutPage.sections} locale={locale} />
      <OurStory />
      <TrustSection />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
