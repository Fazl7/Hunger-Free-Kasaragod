import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { publishableStories } from "@content/collections";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate, tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

const teamPortraits = [
  { name: "Nirmal Kumar", src: "/team/nirmal-kumar.jpg", position: "center 35%" },
  { name: "Ahmmed Shareen", src: "/team/ahmmed-shareen.jpg", position: "center 42%" },
  { name: "Irfad Mayippady", src: "/team/irfad-mayippady.jpg", position: "center 35%" },
  { name: "Vipin Lal", src: "/team/vipin-lal-portrait.jpg", position: "center 35%" },
  { name: "Charuseetha Meloth", src: "/team/charuseetha-meloth.jpg", position: "center 30%" },
  { name: "Abdul Rahman Murshid", src: "/team/abdul-rahman-murshid-portrait.jpg", position: "center 30%" },
  { name: "Anaswara K V", src: "/team/anaswara-k-v.jpg", position: "center 35%" },
] as const;

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
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-maroon/10 bg-cream-deep/60">
            <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-7 sm:gap-3 sm:p-5" aria-label="Live to Smile Foundation team">
              {teamPortraits.map((person) => (
                <div key={person.name} className="overflow-hidden rounded-xl bg-white ring-1 ring-ink/8">
                  <Image
                    src={person.src}
                    alt={person.name}
                    width={768}
                    height={768}
                    sizes="(min-width: 640px) 12vw, 22vw"
                    className="aspect-square w-full object-cover"
                    style={{ objectPosition: person.position }}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 border-t border-maroon/10 px-5 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="font-display text-lg font-semibold text-ink">{t("teamInvite")}</p>
              <ButtonLink href="/team" variant="outline" icon="arrowRight" className="shrink-0">
                {t("teamLink")}
              </ButtonLink>
            </div>
          </div>
        )}
      </article>
      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
