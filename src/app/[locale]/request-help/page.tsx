import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { requestHelpPage } from "@content/editorial";
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
    path: "/request-help",
    title: tr(requestHelpPage.title, locale),
    description: tr(requestHelpPage.intro, locale),
    absoluteTitle: true,
  });
}

export default async function RequestHelpPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const title = tr(requestHelpPage.title, locale);
  const crumbs = [{ name: nav("requestHelp"), path: "/request-help" }];

  return (
    <>
      <PageHero title={title} intro={tr(requestHelpPage.intro, locale)} crumbs={crumbs} />
      <EditorialContent sections={requestHelpPage.sections} locale={locale} />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
