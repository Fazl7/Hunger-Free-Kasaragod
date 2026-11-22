import { getLocale, getTranslations } from "next-intl/server";
import { getVideos } from "@/lib/data";
import { formatCount, pick, roundedPlus } from "@/lib/format";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { VideoCard } from "@/components/media/VideoCard";
import { Reveal } from "@/components/motion/Reveal";

/** Home: strip of the 3 latest videos → /gallery. Hidden until videos exist. */
export async function LatestVideos() {
  const result = await getVideos({ limit: 3, latest: true });
  if (!result || result.rows.length === 0) return null;
  const t = await getTranslations("videos");
  const locale = await getLocale();
  const count = roundedPlus(result.count);

  return (
    <Section id="videos" tone="deep" labelledBy="videos-title">
      <div className="container-page">
        <SectionHeading
          id="videos-title"
          label={t("label")}
          title={t("homeHeading")}
          sub={t(count.plus ? "countPlus" : "count", { count: formatCount(count.value, locale) })}
        />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.rows.map((v, i) => {
            const title = pick(v.title_en, v.title_ml, locale) || t("fallbackTitle");
            return (
              <Reveal as="li" key={v.id} delay={i * 0.08} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : undefined}>
                <VideoCard id={v.youtube_id} title={title} playLabel={t("play", { title })} />
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-10 text-center">
          <ButtonLink href="/gallery" icon="arrowRight">{t("viewAll")}</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
