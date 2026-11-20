import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { absoluteUrl, localePath } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Key = "donate" | "sponsor" | "surplus" | "volunteer" | "celebrate" | "partner" | "share" | "spread";

/** S11. Make an Impact: every kind of supporter finds a fitting action in one click. */
export async function MakeAnImpact() {
  const t = await getTranslations("impactHub");
  const locale = await getLocale();
  const shareText = `${t("whatsappText")} ${absoluteUrl(localePath(locale, "/make-an-impact"))}`;

  const items: { key: Key; icon: IconKey; href: string; external?: boolean; featured?: boolean }[] = [
    { key: "donate", icon: "heart", href: "/donate", featured: true },
    { key: "surplus", icon: "van", href: "/food-rescue", featured: true },
    { key: "sponsor", icon: "calendar", href: "/donate?type=sponsor" },
    { key: "volunteer", icon: "users", href: "/volunteer" },
    { key: "celebrate", icon: "gift", href: "/donate?type=celebrate" },
    { key: "partner", icon: "briefcase", href: "/partner-with-us" },
    { key: "share", icon: "camera", href: "/share-your-moment" },
    { key: "spread", icon: "whatsapp", href: `https://wa.me/?text=${encodeURIComponent(shareText)}`, external: true },
  ];

  return (
    <Section id="make-an-impact" labelledBy="impact-title">
      <div className="container-page">
        <SectionHeading id="impact-title" label={t("label")} title={t("heading")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const cls = cn(
              "group flex h-full flex-col rounded-[var(--radius-card)] p-6 transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-1",
              it.featured
                ? "bg-maroon text-cream hover:shadow-[0_24px_50px_-24px_rgba(122,31,31,.9)] on-dark"
                : "bg-white ring-1 ring-ink/8 hover:shadow-[0_24px_50px_-28px_rgba(30,26,23,.5)] hover:ring-maroon/30",
            );
            const inner = (
              <>
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
                    it.featured ? "bg-mustard text-ink" : "bg-mustard/25 text-maroon",
                  )}
                >
                  <Icon name={it.icon} />
                </span>
                <span className="mt-5 font-display text-xl font-semibold">{t(it.key)}</span>
                <span className={cn("mt-2 flex-1 text-[0.95rem]", it.featured ? "text-cream/85" : "text-ink-soft")}>{t(`${it.key}Body`)}</span>
                <Icon name="arrowRight" size={20} className="mt-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </>
            );
            return (
              <Reveal as="li" key={it.key} delay={(i % 4) * 0.06} className={it.featured ? "lg:col-span-2" : undefined}>
                {it.external ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
                ) : (
                  <Link href={it.href} className={cls}>{inner}</Link>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
