import { getLocale, getTranslations } from "next-intl/server";
import { publishableDocuments } from "@content/collections";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { GapNote } from "@/components/ui/GapNote";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icon";
import { formatDate, tr } from "@/lib/utils";

/** S16. Resources and press: verified documents only. */
export async function ResourcesSection() {
  const t = await getTranslations("resources");
  const locale = await getLocale();
  const docs = publishableDocuments().slice(0, 4);

  if (docs.length === 0) {
    return (
      <GapNote className="container-page my-8">
        Documents: press releases (PDF), certificates (12A, 80G, NITI Aayog, CSR-1), reports and the brochure PDF. Add them to
        <code> content/collections.ts → documents</code> with <code>verified: true</code>.
      </GapNote>
    );
  }

  return (
    <Section id="resources" labelledBy="resources-title">
      <div className="container-page">
        <SectionHeading id="resources-title" label={t("label")} title={t("heading")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((d, i) => (
            <Reveal as="li" key={d.id} delay={i * 0.06}>
              <a
                href={d.file}
                download
                rel="noopener"
                className="group flex h-full flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/8 transition-all hover:-translate-y-1 hover:ring-maroon/30"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-maroon">{d.category}</span>
                <span className="mt-2 flex-1 font-display text-lg font-semibold">{tr(d.title, locale)}</span>
                <span className="mt-4 flex items-center justify-between text-sm text-ink-soft">
                  <span>PDF · {Math.round(d.sizeKB)} KB · {formatDate(d.date, locale)}</span>
                  <Icon name="download" size={20} className="text-maroon transition-transform group-hover:translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
        <ButtonLink href="/resources" variant="outline" icon="arrowRight" className="mt-8">{t("all")}</ButtonLink>
      </div>
    </Section>
  );
}
