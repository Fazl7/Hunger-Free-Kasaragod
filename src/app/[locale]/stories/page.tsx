import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { publishableStories } from "@content/collections";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { formatDate, tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/stories", title: t("storiesTitle"), description: t("storiesDescription"), absoluteTitle: true });
}

export default async function StoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stories");
  const nav = await getTranslations("nav");
  const items = publishableStories();
  const crumbs = [{ name: nav("stories"), path: "/stories" }];

  return (
    <>
      <PageHero title={t("pageTitle")} intro={t("pageIntro")} crumbs={crumbs} />
      <article className="container-page max-w-4xl space-y-6 py-12 pb-20 text-lg leading-relaxed text-ink-soft">
        <p>{t("paragraphOne")}</p>
        <p>{t("paragraphTwo")}</p>
        <p>{t("paragraphThree")}</p>
        {items.length > 0 ? (
          <section aria-labelledby="published-stories" className="pt-8">
            <h2 id="published-stories" className="mb-6 font-display text-3xl font-semibold">{t("publishedHeading")}</h2>
            <ul className="grid gap-5 sm:grid-cols-2">
              {items.map((story) => (
                <li key={story.slug} className="overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink/8">
                  {story.cover?.consent && (
                    <Image
                      src={story.cover.src}
                      alt={tr(story.cover.alt, locale)}
                      width={story.cover.width}
                      height={story.cover.height}
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <article className="p-6">
                    <time dateTime={story.date} className="text-sm text-ink-soft">{formatDate(story.date, locale)}</time>
                    <h3 className="mt-2 text-xl font-semibold">{tr(story.title, locale)}</h3>
                    <p className="mt-2 text-ink-soft">{tr(story.excerpt, locale)}</p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="rounded-2xl bg-cream-deep/60 p-5 text-base">{t("consentNote")}</p>
        )}
      </article>
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
