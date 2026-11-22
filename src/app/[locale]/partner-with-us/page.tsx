import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { partnerPage } from "@content/editorial";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialContent } from "@/components/content/EditorialContent";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/partner-with-us",
    title: tr(partnerPage.title, locale),
    description: tr(partnerPage.intro, locale),
    absoluteTitle: true,
  });
}

export default async function PartnerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const trust = await getTranslations("trust");
  const title = tr(partnerPage.title, locale);
  const crumbs = [{ name: nav("partner"), path: "/partner-with-us" }];

  return (
    <>
      <PageHero title={title} intro={tr(partnerPage.intro, locale)} crumbs={crumbs} />
      <EditorialContent sections={partnerPage.sections} locale={locale} />
      <div className="container-page pb-20">
        <ButtonLink href="/transparency" variant="outline" icon="arrowRight">
          {trust("transparency")}
        </ButtonLink>
      </div>
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
