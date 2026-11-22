import { getLocale, getTranslations } from "next-intl/server";
import { programs } from "@content/programs";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/** The three core food pathways shown prominently on the home page. */
export async function ProgramsShowcase() {
  const t = await getTranslations("programs");
  const locale = await getLocale();
  const sorted = [...programs].sort((a, b) => a.order - b.order);

  return (
    <Section id="programs" tone="deep" labelledBy="programs-title">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="programs-title" label={t("label")} title={t("heading")} sub={t("sub")} className="mb-0" />
          <ButtonLink href="/programs" variant="outline" icon="arrowRight" className="mb-2">
            {t("all")}
          </ButtonLink>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.08}>
              <ProgramCard program={p} locale={locale} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
