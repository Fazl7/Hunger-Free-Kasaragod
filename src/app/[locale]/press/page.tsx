import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { getPressList } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { PressCard } from "@/components/content/PressCard";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const latest = (await getPressList(1))?.[0];
  return buildMetadata({
    locale,
    path: "/press",
    title: t("pressTitle"),
    description: t("pressDescription"),
    image: latest?.photo_url ? { url: latest.photo_url, alt: latest.photo_alt ?? undefined } : null,
  });
}

export default async function PressIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("press");
  const list = await getPressList(60);
  const crumbs = [{ name: t("title"), path: "/press" }];

  return (
    <>
      <PageHero title={t("title")} intro={t("intro")} crumbs={crumbs} />
      <div className="container-page pb-24">
        {list && list.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.id}>
                <PressCard item={p} locale={locale} readMore={t("readMore")} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-white p-8 text-center text-ink-soft ring-1 ring-ink/8">{t("empty")}</p>
        )}
      </div>
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
