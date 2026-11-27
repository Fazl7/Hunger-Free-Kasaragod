import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, videoObjectSchema } from "@/lib/schema";
import { getPhotos, getVideos } from "@/lib/data";
import { pick } from "@/lib/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { VideoCard } from "@/components/media/VideoCard";
import { VideoGrid } from "./VideoGrid";
import { PhotoGrid } from "./PhotoGrid";
import { GalleryTabs } from "./GalleryTabs";

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const [featured, photos] = await Promise.all([getVideos({ featured: true, limit: 1 }), getPhotos(1)]);
  const cover = featured?.rows[0];
  const photo = photos?.rows[0];
  return buildMetadata({
    locale,
    path: "/gallery",
    title: t("galleryTitle"),
    description: t("galleryDescription"),
    image: cover
      ? { url: `https://i.ytimg.com/vi/${cover.youtube_id}/hqdefault.jpg`, width: 480, height: 360 }
      : photo
        ? { url: photo.photo_url, width: photo.width, height: photo.height }
        : null,
  });
}

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("videos");
  const g = await getTranslations("galleryPage");
  const nav = await getTranslations("nav");

  const [featured, rest, photos] = await Promise.all([
    getVideos({ featured: true, limit: 6 }),
    getVideos({ featured: false, limit: 12 }),
    getPhotos(12),
  ]);
  const total = (featured?.count ?? 0) + (rest?.count ?? 0);
  const titleOf = (v: { title_en: string | null; title_ml: string | null }) => pick(v.title_en, v.title_ml, locale) || t("fallbackTitle");
  const crumbs = [{ name: nav("gallery"), path: "/gallery" }];
  const failed = featured === null && rest === null && photos === null;
  const hasVideos = total > 0;
  const hasLatestVideos = !!rest && rest.rows.length > 0;
  const hasPhotos = !!photos && photos.rows.length > 0;
  const latestHeading = hasPhotos && hasLatestVideos ? g("latestBoth") : hasPhotos ? g("latestPhotos") : t("latest");

  const photoGrid = hasPhotos && <PhotoGrid initial={photos.rows} total={photos.count} />;
  const videoGrid = hasLatestVideos && <VideoGrid initial={rest.rows} total={rest.count} />;

  return (
    <>
      <PageHero title={g("title")} intro={g("intro")} crumbs={crumbs} />

      <section className="container-page max-w-5xl py-10 sm:py-14">
        <p className="text-lg leading-relaxed text-ink-soft">{t("context")}</p>
      </section>

      <div className="container-page space-y-16 pt-4 pb-16">
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

        {(hasPhotos || hasLatestVideos) && (
          <section aria-labelledby="latest-title">
            <h2 id="latest-title" className="mb-6 text-3xl font-semibold sm:text-4xl">{latestHeading}</h2>
            {hasPhotos && hasLatestVideos ? (
              <GalleryTabs
                photos={photoGrid}
                videos={videoGrid}
                labels={{ group: g("tabsLabel"), all: g("all"), photos: g("photos"), videos: g("videos") }}
              />
            ) : (
              photoGrid || videoGrid
            )}
          </section>
        )}

        {!hasPhotos && !hasVideos && (
          <p className="rounded-2xl bg-white p-8 text-center text-ink-soft ring-1 ring-ink/8">{failed ? g("error") : g("empty")}</p>
        )}
      </div>

      <JsonLd
        data={graph(
          breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]),
          ...[...(featured?.rows ?? []), ...(rest?.rows ?? [])].map((v) =>
            videoObjectSchema({ youtubeId: v.youtube_id, name: titleOf(v), uploadDate: v.created_at }),
          ),
          ...(photos?.rows ?? []).map((p) => ({
            "@type": "ImageObject",
            contentUrl: p.photo_url,
            thumbnailUrl: p.thumb_url,
            width: p.width,
            height: p.height,
            caption: pick(p.caption_en, p.caption_ml, locale) || undefined,
            uploadDate: p.created_at,
          })),
        )}
      />
    </>
  );
}
