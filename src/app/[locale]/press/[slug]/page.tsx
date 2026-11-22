import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { absoluteUrl, buildMetadata, localePath } from "@/lib/seo";
import { breadcrumbSchema, graph, newsArticleSchema } from "@/lib/schema";
import { getPressBySlug, getPressList } from "@/lib/data";
import { excerpt } from "@/lib/markdown";
import { formatLongDate, pick } from "@/lib/format";
import type { PressReleaseRow } from "@/lib/supabase/types";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/icons/Icon";
import { MarkdownBody } from "@/components/content/MarkdownBody";
import { ShareButtons } from "@/components/content/ShareButtons";
import { PressCard } from "@/components/content/PressCard";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** Rendered on first visit, then cached (ISR) and refreshed when the admin edits. */
export const revalidate = 300;
export function generateStaticParams() {
  return [];
}

/** A Malayalam version exists only when both title and body were translated. */
const hasMl = (p: PressReleaseRow) => Boolean(p.title_ml?.trim() && p.body_ml?.trim());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = await getPressBySlug(slug);
  if (!p) return { title: "Not found", robots: { index: false } };
  const title = pick(p.title_en, p.title_ml, locale);
  const description = (locale === "en" || !hasMl(p)) && p.meta_description?.trim()
    ? p.meta_description.trim()
    : excerpt(pick(p.body_en, p.body_ml, locale), 155);
  const social = p.photo_social_url ?? p.photo_url;
  return buildMetadata({
    locale,
    path: `/press/${slug}`,
    title,
    description,
    image: social
      ? { url: social, width: p.photo_social_url ? 1200 : undefined, height: p.photo_social_url ? 630 : undefined, alt: p.photo_alt ?? title }
      : null,
    article: { publishedTime: `${p.release_date}T00:00:00+05:30`, modifiedTime: p.updated_at, section: "Press release" },
    locales: hasMl(p) ? ["en", "ml"] : ["en"],
    canonicalLocale: locale === "ml" && !hasMl(p) ? "en" : locale,
  });
}

export default async function PressArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getPressBySlug(slug);
  if (!p) notFound();

  const t = await getTranslations("press");
  const c = await getTranslations("common");
  const title = pick(p.title_en, p.title_ml, locale);
  const body = pick(p.body_en, p.body_ml, locale);
  const contentLocale = locale === "ml" && hasMl(p) ? "ml" : "en";
  const url = absoluteUrl(localePath(locale, `/press/${slug}`));
  const more = ((await getPressList(4)) ?? []).filter((x) => x.slug !== slug).slice(0, 3);
  const crumbs = [
    { name: t("title"), path: "/press" },
    { name: title, path: `/press/${slug}` },
  ];

  return (
    <>
      <article className="pb-20" lang={contentLocale}>
        <header className="relative overflow-hidden bg-cream grain pt-10 pb-10 sm:pt-14">
          <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-mustard/25 blur-3xl" />
          <div className="container-page relative max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-8 text-sm">
              <ol className="flex flex-wrap items-center gap-1.5 text-ink-soft">
                <li><Link href="/" className="hover:text-maroon">{c("home")}</Link></li>
                <li className="flex items-center gap-1.5">
                  <Icon name="arrowRight" size={14} className="opacity-50" />
                  <Link href="/press" className="hover:text-maroon">{t("title")}</Link>
                </li>
              </ol>
            </nav>
            <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-maroon uppercase">
              <span aria-hidden className="h-px w-8 bg-maroon" />
              {t("label")}
            </p>
            <h1 className="text-[2.2rem] leading-[1.1] font-semibold sm:text-5xl">{title}</h1>
            <p className="mt-5 flex flex-wrap items-center gap-x-2 text-ink-soft">
              <Icon name="calendar" size={18} className="text-maroon" />
              <time dateTime={p.release_date}>{formatLongDate(p.release_date, locale)}</time>
              {p.place && (
                <>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1"><Icon name="pin" size={16} className="text-maroon" />{p.place}</span>
                </>
              )}
            </p>
          </div>
        </header>

        <div className="container-page max-w-4xl">
          {p.photo_url && (
            <figure className="mb-10 overflow-hidden rounded-[var(--radius-card)] bg-cream-deep">
              <Image
                src={p.photo_url}
                alt={p.photo_alt ?? ""}
                width={p.photo_width ?? 1600}
                height={p.photo_height ?? 900}
                sizes="(min-width: 1024px) 56rem, 100vw"
                priority
                className="h-auto w-full"
              />
            </figure>
          )}
          <MarkdownBody source={body} className="mx-auto max-w-[68ch]" />

          <aside aria-label={t("share")} className="mx-auto mt-12 max-w-[68ch] border-t border-ink/10 pt-8">
            <h2 className="mb-4 font-sans text-sm font-semibold tracking-[0.14em] text-maroon uppercase">{t("share")}</h2>
            <ShareButtons url={url} title={title} />
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="bg-cream-deep py-16 sm:py-20">
          <div className="container-page">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 id="more-title" className="text-3xl font-semibold sm:text-4xl">{t("more")}</h2>
              <Link href="/press" className="inline-flex items-center gap-1.5 font-semibold text-maroon underline-offset-4 hover:underline">
                {t("all")} <Icon name="arrowRight" size={16} />
              </Link>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((m) => (
                <li key={m.id}><PressCard item={m} locale={locale} readMore={t("readMore")} headingLevel={3} /></li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd
        data={graph(
          breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]),
          newsArticleSchema({
            locale: contentLocale,
            slug,
            headline: title,
            description: p.meta_description?.trim() || excerpt(body, 155),
            releaseDate: p.release_date,
            modified: p.updated_at,
            images: [p.photo_social_url, p.photo_url].filter((x): x is string => Boolean(x)),
            place: p.place,
          }),
        )}
      />
    </>
  );
}
