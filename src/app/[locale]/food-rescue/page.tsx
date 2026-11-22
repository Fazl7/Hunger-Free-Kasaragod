import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { CelebratingTogether } from "@/sections/CelebratingTogether";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/food-rescue", title: t("foodRescueTitle"), description: t("foodRescueDescription"), absoluteTitle: true });
}

export default async function FoodRescuePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const rescue = await getTranslations("rescue");
  const crumbs = [{ name: nav("foodRescue"), path: "/food-rescue" }];

  return (
    <>
      <PageHero title={nav("foodRescue")} intro={rescue("sub")} crumbs={crumbs} />
      <CelebratingTogether />
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
