import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { publishableStories } from "@content/collections";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate, tr } from "@/lib/utils";

/** S14. Stories: swipeable (CSS scroll-snap, keyboard scrollable) and consent-gated. */
export async function StoriesSection() {
  const t = await getTranslations("stories");
  const c = await getTranslations("common");
  const locale = await getLocale();
  const items = publishableStories().slice(0, 8);

  return (
    <Section id="stories" tone="deep" labelledBy="stories-title">
      <div className="container-page">
        <SectionHeading id="stories-title" label={t("label")} title={t("heading")} />
        <p className="mb-8 max-w-3xl text-ink-soft">{t("preview")}</p>
        {items.length === 0 ? (
          <ButtonLink href="/stories" variant="outline" icon="arrowRight">{c("readMore")}</ButtonLink>
        ) : (
          <ul
            tabIndex={0}
            aria-labelledby="stories-title"
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:thin]"
          >
            {items.map((s) => (
              <li key={s.slug} className="w-[min(22rem,82vw)] shrink-0 snap-start">
                <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-cream">
                  {s.cover?.consent && (
                    <Image src={s.cover.src} alt={tr(s.cover.alt, locale)} width={s.cover.width} height={s.cover.height} sizes="22rem" className="aspect-[4/3] w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <time dateTime={s.date} className="text-sm text-ink-soft">{formatDate(s.date, locale)}</time>
                    <h3 className="mt-2 text-xl font-semibold">{tr(s.title, locale)}</h3>
                    <p className="mt-2 flex-1 text-ink-soft">{tr(s.excerpt, locale)}</p>
                    <Link href="/stories" className="mt-4 font-semibold text-maroon underline-offset-4 hover:underline">
                      {c("readMore")}<span className="sr-only">: {tr(s.title, locale)}</span>
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
