import { getLocale, getTranslations } from "next-intl/server";
import { publishableGallery } from "@content/collections";
import { programs } from "@content/programs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { GalleryGrid } from "@/components/media/GalleryGrid";
import { GapNote } from "@/components/ui/GapNote";
import { ButtonLink } from "@/components/ui/Button";
import { tr } from "@/lib/utils";

/** S8. Gallery: only media with recorded consent is ever rendered. */
export async function GallerySection({ limit = 9 }: { limit?: number }) {
  const t = await getTranslations("gallery");
  const c = await getTranslations("common");
  const locale = await getLocale();
  const media = publishableGallery().slice(0, limit);

  if (media.length === 0) {
    return (
      <GapNote className="container-page my-8">
        Gallery: original high-resolution photos and videos with consent records (each item needs alt text, caption, place, date and
        <code> consent: true</code>). Add to <code>content/collections.ts → gallery</code>.
      </GapNote>
    );
  }

  const usedPrograms = new Set(media.map((m) => m.program).filter(Boolean));
  const filters = programs.filter((p) => usedPrograms.has(p.slug)).map((p) => ({ id: p.slug, label: tr(p.name, locale) }));
  const items = media.map((m) => ({
    ...m,
    altText: tr(m.alt, locale),
    captionText: m.caption ? tr(m.caption, locale) : undefined,
  }));

  return (
    <Section id="gallery" labelledBy="gallery-title">
      <div className="container-page">
        <SectionHeading id="gallery-title" label={t("label")} title={t("heading")} />
        <GalleryGrid items={items} filters={filters} />
        <div className="mt-10 text-center">
          <ButtonLink href="/gallery" variant="outline" icon="arrowRight">{c("viewAll")}</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
