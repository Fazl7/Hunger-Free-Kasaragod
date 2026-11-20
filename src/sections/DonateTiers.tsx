import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig, registrationsVerified } from "@content/site.config";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { GapNote } from "@/components/ui/GapNote";
import { Icon } from "@/components/icons/Icon";
import { formatINR, tr } from "@/lib/utils";

/** S12. Donation tiers. Tiers without a confirmed amount are hidden in production. */
export async function DonateTiers() {
  const t = await getTranslations("donate");
  const tr80 = await getTranslations("trust");
  const locale = await getLocale();
  const { donation } = siteConfig;
  const priced = donation.tiers.filter((x) => x.amountINR !== null);
  const unpriced = donation.tiers.filter((x) => x.amountINR === null);

  const meals = (amount: number) =>
    donation.costPerMealINR ? Math.floor(amount / donation.costPerMealINR) : null;

  return (
    <Section id="donate" tone="mustard" labelledBy="donate-title">
      <div className="container-page">
        <SectionHeading id="donate-title" label={t("label")} title={t("heading")} align="center" />

        <ul className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))]">
          {priced.map((tier, i) => {
            const n = meals(tier.amountINR!);
            return (
              <Reveal as="li" key={tier.id} delay={i * 0.08}>
                <Link
                  href={`/donate?tier=${tier.id}`}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] bg-cream p-7 text-center ring-2 ring-transparent transition-all duration-300 hover:-translate-y-1 hover:ring-maroon hover:shadow-[0_0_0_8px_rgba(122,31,31,.12)]"
                >
                  <span className="text-sm font-semibold uppercase tracking-wide text-maroon">{tr(tier.label, locale)}</span>
                  <span className="mt-3 font-display text-5xl font-semibold tabular">{formatINR(tier.amountINR!, locale)}</span>
                  {n !== null && <span className="mt-2 text-sm text-ink-soft">{t("provides", { count: n })}</span>}
                  <span className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-maroon px-5 font-semibold text-cream">
                    {t("choose")} <Icon name="arrowRight" size={18} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
          {donation.allowCustom && (
            <Reveal as="li" delay={priced.length * 0.08} className={priced.length === 0 ? "sm:col-span-2 lg:col-span-1 mx-auto w-full max-w-xl" : undefined}>
              <Link
                href="/donate"
                className="on-dark group flex h-full flex-col rounded-[var(--radius-card)] bg-ink p-7 text-center text-cream transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-mustard">{t("custom")}</span>
                <span aria-hidden className="mt-3 font-sans text-5xl font-semibold">₹</span>
                <span className="mt-2 text-sm text-cream/80">{t("customBody")}</span>
                <span className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-mustard px-5 font-semibold text-ink">
                  {t("choose")} <Icon name="arrowRight" size={18} />
                </span>
              </Link>
            </Reveal>
          )}
        </ul>

        {registrationsVerified && (
          <p className="mt-8 flex items-center justify-center gap-2 text-sm font-medium">
            <Icon name="shield" size={18} /> {tr80("eightyG")}
          </p>
        )}

        {unpriced.length > 0 && (
          <GapNote className="mx-auto mt-8 max-w-3xl">
            Donation amounts for {unpriced.map((u) => u.label.en).join(" / ")} (cut off in the brochure), plus cost per meal and per kit
            for the “this provides” line. Set <code>donation.tiers[].amountINR</code> and <code>costPerMealINR</code>.
          </GapNote>
        )}
      </div>
    </Section>
  );
}
