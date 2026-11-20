import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { storyChapters } from "@content/collections";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { GapNote } from "@/components/ui/GapNote";
import { tr } from "@/lib/utils";

/** S4. Our Story: chapter timeline. Renders only owner-supplied chapters. */
export async function OurStory() {
  const t = await getTranslations("story");
  const locale = await getLocale();

  if (storyChapters.length === 0) {
    return (
      <GapNote className="container-page my-8">
        “Our Story” chapters (why we started → first distribution → growth → today), founding year, and one consented photo per
        chapter. Add them to <code>content/collections.ts → storyChapters</code>.
      </GapNote>
    );
  }

  return (
    <Section tone="deep" labelledBy="story-title">
      <div className="container-page">
        <SectionHeading id="story-title" label={t("label")} title={t("heading")} />
        <ol className="relative space-y-16 before:absolute before:top-2 before:bottom-2 before:left-[0.6rem] before:w-0.5 before:bg-maroon/20 sm:before:left-1/2">
          {storyChapters.map((ch, i) => (
            <li key={i} className="relative grid gap-6 pl-10 sm:grid-cols-2 sm:gap-16 sm:pl-0">
              <span aria-hidden className="absolute top-2 left-0 size-5 rounded-full border-4 border-cream-deep bg-maroon sm:left-1/2 sm:-translate-x-1/2" />
              <Reveal className={i % 2 ? "sm:order-2" : "sm:text-right"}>
                {ch.year && <p className="font-display text-2xl text-maroon">{ch.year}</p>}
                <h3 className="mt-1 text-2xl font-semibold">{tr(ch.title, locale)}</h3>
                <p className="mt-3 text-ink-soft">{tr(ch.body, locale)}</p>
              </Reveal>
              {ch.media?.consent && (
                <Reveal variant="scale" className="overflow-hidden rounded-[var(--radius-card)]">
                  <Image
                    src={ch.media.src}
                    alt={tr(ch.media.alt, locale)}
                    width={ch.media.width}
                    height={ch.media.height}
                    sizes="(min-width: 640px) 40vw, 100vw"
                    className="h-auto w-full"
                  />
                </Reveal>
              )}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
