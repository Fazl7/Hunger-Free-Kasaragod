import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig, registrationsVerified, showGaps } from "@content/site.config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import { GapNote } from "@/components/ui/GapNote";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/icons/Icon";
import { tr } from "@/lib/utils";

/**
 * S15. Trust and recognition. Registration IDs are shown after owner confirmation.
 */
export async function TrustSection() {
  const t = await getTranslations("trust");
  const locale = await getLocale();
  const { registrations, award } = siteConfig;
  const showIds = registrationsVerified || showGaps;

  const regs = [
    { label: t("niti"), id: registrations.niti },
    { label: t("twelveA"), id: registrations.twelveA },
    { label: t("eightyG"), id: registrations.eightyG },
    { label: t("csr1"), id: registrations.csr1 },
  ];

  return (
    <Section id="trust" tone="cream" labelledBy="trust-title">
      <div className="container-page">
        <SectionHeading id="trust-title" label={t("label")} title={t("heading")} />

        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {showIds && (
            <div>
              {!registrationsVerified && (
                <GapNote className="mb-4">
                  Registration IDs need owner confirmation before public display. Set <code>registrations.verifiedOn</code> after confirmation.
                </GapNote>
              )}
              <ul className="grid gap-4 sm:grid-cols-2">
                {regs.map((r, i) => (
                  <Reveal as="li" key={r.label} delay={i * 0.06} className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/8">
                    <span className="flex items-center gap-2 text-sm font-semibold text-leaf">
                      <Icon name="shield" size={18} />
                      {r.label}
                    </span>
                    <p className="mt-3 font-mono text-lg font-semibold tracking-wide break-all">{r.id}</p>
                    <div className="mt-4">
                      <CopyButton value={r.id} label={t("copyId")} />
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          )}

          <Reveal variant="scale" className={`on-dark relative overflow-hidden rounded-[var(--radius-card)] bg-maroon p-8 text-cream ${showIds ? "" : "lg:col-span-2"}`}>
            <Icon name="award" size={120} strokeWidth={1} className="absolute -right-6 -bottom-6 text-cream/10" aria-hidden />
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-mustard">{t("award")}</p>
            <h3 className="mt-3 text-3xl leading-tight font-semibold">{tr(award.title, locale)}</h3>
            <p className="mt-3 text-cream/85">{award.presentedBy}</p>
            {award.eventName && <p className="mt-1 text-cream/85">{award.eventName}{award.date && ` · ${award.date}`}</p>}
            <ButtonLink href="/transparency" variant="light" icon="arrowRight" className="mt-8">
              {t("transparency")}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
