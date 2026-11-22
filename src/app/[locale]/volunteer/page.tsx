import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { volunteerPage } from "@content/editorial";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialContent } from "@/components/content/EditorialContent";
import { PageHero } from "@/components/ui/PageHero";
import { tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/volunteer",
    title: tr(volunteerPage.title, locale),
    description: tr(volunteerPage.intro, locale),
    absoluteTitle: true,
  });
}

export default async function VolunteerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const title = tr(volunteerPage.title, locale);
  const crumbs = [{ name: nav("volunteer"), path: "/volunteer" }];

  return (
    <>
      <PageHero title={title} intro={tr(volunteerPage.intro, locale)} crumbs={crumbs} />
      <EditorialContent sections={volunteerPage.sections} locale={locale} />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
