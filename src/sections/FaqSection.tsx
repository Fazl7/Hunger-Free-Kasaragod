import { getLocale, getTranslations } from "next-intl/server";
import { faqs } from "@content/faqs";
import { showGaps } from "@content/site.config";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { GapNote } from "@/components/ui/GapNote";
import { Icon } from "@/components/icons/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, graph } from "@/lib/schema";
import { tr } from "@/lib/utils";

/** Published FAQs = those not awaiting owner confirmation. */
export const publishedFaqs = () => faqs.filter((f) => !f.needsConfirmation);

/** S17. FAQ: native <details> accordion (works without JS) + FAQPage JSON-LD. */
export async function FaqSection({ limit = 8 }: { limit?: number }) {
  const t = await getTranslations("faq");
  const c = await getTranslations("common");
  const locale = await getLocale();
  const items = publishedFaqs().slice(0, limit);
  const pending = faqs.filter((f) => f.needsConfirmation);

  return (
    <Section id="faq" tone="deep" labelledBy="faq-title">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading id="faq-title" label={t("label")} title={t("heading")} className="mb-6" />
          <Link href="/faq" className="inline-flex items-center gap-1.5 font-semibold text-maroon underline-offset-4 hover:underline">
            {t("all")} <Icon name="arrowRight" size={18} />
          </Link>
          {showGaps && pending.length > 0 && (
            <GapNote className="mt-6">
              {pending.length} FAQ answers need owner confirmation: {pending.map((p) => `“${p.q.en}”`).join(", ")}.
            </GapNote>
          )}
        </div>

        <ul className="divide-y divide-ink/10 rounded-[var(--radius-card)] bg-cream px-6 shadow-[0_20px_50px_-35px_rgba(30,26,23,.5)] sm:px-8">
          {items.map((f) => (
            <li key={f.id}>
              <details className="faq-item group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {tr(f.q, locale)}
                  <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-full bg-mustard/30 text-maroon transition-transform duration-300 group-open:rotate-45">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </summary>
                <div className="pb-5 text-ink-soft">
                  <p>{tr(f.a, locale)}</p>
                  {f.link && (
                    <Link href={f.link} className="mt-3 inline-flex items-center gap-1 font-semibold text-maroon underline-offset-4 hover:underline">
                      {c("learnMore")} <Icon name="arrowRight" size={16} />
                    </Link>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
      <JsonLd data={graph(faqSchema(items, locale))} />
    </Section>
  );
}
