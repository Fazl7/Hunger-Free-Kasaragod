import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, videoObjectSchema } from "@/lib/schema";
import { getVideos } from "@/lib/data";
import { pick, roundedPlus, formatCount } from "@/lib/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { VideoCard } from "@/components/media/VideoCard";
import { Icon } from "@/components/icons/Icon";
import { VideoGrid } from "./VideoGrid";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const featured = await getVideos({ featured: true, limit: 1 });
  const cover = featured?.rows[0];
  return buildMetadata({
    locale,
    path: "/gallery",
    title: t("galleryTitle"),
    description: t("galleryDescription"),
    image: cover ? { url: `https://i.ytimg.com/vi/${cover.youtube_id}/hqdefault.jpg`, width: 480, height: 360 } : null,
  });
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("videos");
  const nav = await getTranslations("nav");

  const [featured, rest] = await Promise.all([getVideos({ featured: true, limit: 6 }), getVideos({ featured: false, limit: 12 })]);
  const total = (featured?.count ?? 0) + (rest?.count ?? 0);
  const count = roundedPlus(total);
  const titleOf = (v: { title_en: string | null; title_ml: string | null }) => pick(v.title_en, v.title_ml, locale) || t("fallbackTitle");
  const crumbs = [{ name: nav("gallery"), path: "/gallery" }];
  const failed = featured === null && rest === null;

  return (
    <>
      <PageHero title={t("title")} intro={t("intro")} crumbs={crumbs}>
        {total > 0 && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-cream">
            <Icon name="play" size={16} fill="currentColor" />
            {t(count.plus ? "countPlus" : "count", { count: formatCount(count.value, locale) })}
          </p>
        )}
      </PageHero>

      <section className="container-page max-w-5xl pt-10">
        <p className="text-lg leading-relaxed text-ink-soft">{t("context")}</p>
      </section>

      <div className="container-page space-y-16 pb-24">
        {featured && featured.rows.length > 0 && (
          <section aria-labelledby="featured-title">
            <h2 id="featured-title" className="mb-6 flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
              <span aria-hidden className="h-8 w-1.5 rounded-full bg-mustard" />
              {t("featured")}
            </h2>
            <ul className="grid gap-6 md:grid-cols-2">
              {featured.rows.map((v, i) => (
                <li key={v.id} className={featured.rows.length % 2 === 1 && i === 0 ? "md:col-span-2" : undefined}>
                  <VideoCard id={v.youtube_id} title={titleOf(v)} playLabel={t("play", { title: titleOf(v) })} large />
                </li>
              ))}
            </ul>
          </section>
        )}

        {rest && rest.rows.length > 0 ? (
          <section aria-labelledby="latest-title">
            <h2 id="latest-title" className="mb-6 text-3xl font-semibold sm:text-4xl">{t("latest")}</h2>
            <VideoGrid initial={rest.rows} total={rest.count} />
          </section>
        ) : (
          (failed || total === 0) && (
            <p className="rounded-2xl bg-white p-8 text-center text-ink-soft ring-1 ring-ink/8">{failed ? t("error") : t("empty")}</p>
          )
        )}
      </div>

      <JsonLd
        data={graph(
          breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]),
          ...[...(featured?.rows ?? []), ...(rest?.rows ?? [])].map((v) =>
            videoObjectSchema({ youtubeId: v.youtube_id, name: titleOf(v), uploadDate: v.created_at }),
          ),
        )}
      />
    </>
  );
}
