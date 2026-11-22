import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { RescueRoute } from "./RescueRoute";
import { tr } from "@/lib/utils";

/** Surplus food rescue: Collect → Pack → Distribute + mini booking form. */
export async function CelebratingTogether() {
  const t = await getTranslations("rescue");
  const locale = await getLocale();

  const steps: { key: "collect" | "pack" | "distribute"; icon: IconKey }[] = [
    { key: "collect", icon: "spoon" },
    { key: "pack", icon: "kit" },
    { key: "distribute", icon: "van" },
  ];

  return (
    <Section id="celebrating-together" tone="purple" labelledBy="rescue-title" className="overflow-hidden">
      {/* firework-burst motif */}
      <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -top-10 -right-10 size-72 text-mustard/20">
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="100" y1="100" x2="100" y2="20" transform={`rotate(${i * 30} 100 100)`} strokeDasharray="20 18" />
          ))}
        </g>
      </svg>

      <div className="container-page relative">
        <SectionHeading id="rescue-title" label={t("label")} title={t("heading")} sub={t("sub")} dark />

        <RescueRoute />

        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.key} delay={i * 0.12} className="relative rounded-[var(--radius-card)] bg-cream/8 p-7 ring-1 ring-cream/15 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-mustard text-ink">
                  <Icon name={s.icon} size={28} />
                </span>
                <span aria-hidden className="font-display text-5xl font-semibold text-cream/55">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{t(s.key)}</h3>
              <p className="mt-2 text-cream/85">{t(`${s.key}Body`)}</p>
              {s.key === "distribute" && (
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-leaf px-3 py-1.5 text-sm font-medium text-cream">
                  <Icon name="thermometer" size={16} />
                  {t("safe")}
                </p>
              )}
            </Reveal>
          ))}
        </ol>

        {/* Mini form: plain GET form, works without JS, prefills the full booking flow. */}
        <Reveal className="mt-12 rounded-[2rem] bg-cream p-6 text-ink sm:p-8">
          <form action={`/${locale}/food-rescue`} method="get" className="grid items-end gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
            <h3 className="font-display text-2xl font-semibold md:col-span-4">{t("formTitle")}</h3>
            <label className="grid gap-1.5 text-sm font-medium">
              {t("date")}
              <input
                type="date"
                name="date"
                className="min-h-12 rounded-xl border-2 border-ink/15 bg-white px-4 text-base focus:border-maroon"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              {t("areaLabel")}
              <select name="area" className="min-h-12 rounded-xl border-2 border-ink/15 bg-white px-4 text-base focus:border-maroon">
                {siteConfig.places.map((p) => (
                    <option key={p.id} value={p.id}>
                      {tr(p.name, locale)}
                    </option>
                  ))}
                <option value="other">{t("areaOther")}</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              {t("servings")}
              <input
                type="number"
                name="servings"
                min={1}
                inputMode="numeric"
                className="min-h-12 rounded-xl border-2 border-ink/15 bg-white px-4 text-base focus:border-maroon"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon px-6 font-semibold text-cream transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              {t("cta")}
              <Icon name="arrowRight" size={18} />
            </button>
          </form>
          {siteConfig.foodRescue.responseTime && (
            <p className="mt-4 text-sm text-ink-soft">{tr(siteConfig.foodRescue.responseTime, locale)}</p>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
