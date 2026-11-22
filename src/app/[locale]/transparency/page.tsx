import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { transparencyPage } from "@content/editorial";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { EditorialContent } from "@/components/content/EditorialContent";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { TrustSection } from "@/sections/TrustSection";
import { tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale,
    path: "/transparency",
    title: tr(transparencyPage.title, locale),
    description: tr(transparencyPage.intro, locale),
    absoluteTitle: true,
  });
}

export default async function TransparencyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const title = tr(transparencyPage.title, locale);
  const crumbs = [{ name: nav("transparency"), path: "/transparency" }];

  return (
    <>
      <PageHero title={title} intro={tr(transparencyPage.intro, locale)} crumbs={crumbs} />
      <EditorialContent sections={transparencyPage.sections} locale={locale} />
      <TrustSection />
      <div className="container-page pb-20">
        <ButtonLink href="/ledger" variant="outline" icon="arrowRight">{nav("ledger")}</ButtonLink>
      </div>
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
