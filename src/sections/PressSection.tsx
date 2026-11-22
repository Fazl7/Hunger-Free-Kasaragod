import { getLocale, getTranslations } from "next-intl/server";
import { getPressList } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { PressCard } from "@/components/content/PressCard";

/** S16 (was "Resources"): latest 3 press releases → /press. Hidden until one is published. */
export async function PressSection() {
  const list = await getPressList(3);
  if (!list || list.length === 0) return null;
  const t = await getTranslations("press");
  const locale = await getLocale();

  return (
    <Section id="press" labelledBy="press-title">
      <div className="container-page">
        <SectionHeading id="press-title" label={t("label")} title={t("heading")} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.06}>
              <PressCard item={p} locale={locale} readMore={t("readMore")} headingLevel={3} />
            </Reveal>
          ))}
        </ul>
        <ButtonLink href="/press" variant="outline" icon="arrowRight" className="mt-8">{t("all")}</ButtonLink>
      </div>
    </Section>
  );
}
