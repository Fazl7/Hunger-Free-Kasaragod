import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { programs } from "@content/programs";
import { Link } from "@/i18n/navigation";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { GapNote } from "@/components/ui/GapNote";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { formatDate } from "@/lib/utils";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getImpactStats } from "@/lib/data";
import { LiveNumbers } from "./LiveNumbers";

const lgCols: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

/**
 * S2. "Numerical start".
 *  - With Supabase configured: live Kits given / Days since started / Foods
 *    distributed from get_impact_stats() (<LiveNumbers/>, same design).
 *  - Without it (fallback): only verifiable brochure figures from site.config.
 */
export async function NumbersStrip() {
  const t = await getTranslations("numbers");
  const locale = await getLocale();

  if (supabaseConfigured) {
    const stats = await getImpactStats();
    return (
      <section id="numbers" aria-labelledby="numbers-title" className="relative z-10 -mt-16 pb-8">
        <div className="container-page">
          <h2 id="numbers-title" className="sr-only">{t("heading")}</h2>
          <Reveal variant="up">
            <LiveNumbers initial={stats} />
          </Reveal>
        </div>
      </section>
    );
  }

  const { impact, places } = siteConfig;

  const stats: { value: number | null; label: string; icon: IconKey; suffix?: string }[] = [
    { value: impact.monthlyKitTarget, label: t("kits"), icon: "kit" },
    { value: impact.mealsServed, label: t("meals"), icon: "plate", suffix: "+" },
    { value: impact.householdsReached, label: t("households"), icon: "heart", suffix: "+" },
    { value: impact.foodRescuedKg, label: t("rescued"), icon: "van" },
    { value: impact.yearsActive, label: t("years"), icon: "calendar" },
    { value: programs.length, label: t("programs"), icon: "spoon" },
    { value: places.filter((p) => p.kind === "hub").length, label: t("towns"), icon: "pin" },
  ];
  const shown = stats.filter((s) => s.value !== null).slice(0, 4);
  const missing = stats.filter((s) => s.value === null);

  return (
    <section id="numbers" aria-labelledby="numbers-title" className="relative z-10 -mt-16 pb-8">
      <div className="container-page">
        <h2 id="numbers-title" className="sr-only">{t("heading")}</h2>
        <Reveal variant="up">
          <ul
            className={`grid gap-px overflow-hidden rounded-[2rem] bg-cream/15 text-cream shadow-[0_30px_60px_-30px_rgba(30,26,23,.6)] sm:grid-cols-2 ${lgCols[shown.length] ?? "lg:grid-cols-4"}`}
          >
            {shown.map((s, i) => (
              <li
                key={s.label}
                className="flex items-center gap-5 bg-ink p-7 sm:p-8 sm:last:odd:col-span-2 lg:last:odd:col-span-1"
              >
                <span
                  aria-hidden
                  className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${i === 0 ? "bg-mustard text-ink" : "bg-cream/10 text-mustard"}`}
                >
                  <Icon name={s.icon} size={28} />
                </span>
                <p className="flex flex-col">
                  <span className="font-display text-5xl leading-none font-semibold text-cream">
                    <CountUp value={s.value!} locale={locale} />
                    {s.suffix}
                  </span>
                  <span className="mt-2 text-sm leading-snug text-cream/75">{s.label}</span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 text-sm text-ink-soft">
          {impact.updatedOn ? <span>{t("updated", { date: formatDate(impact.updatedOn, locale) })}</span> : <span />}
          <Link href="/ledger" className="inline-flex items-center gap-1.5 font-medium text-maroon underline-offset-4 hover:underline">
            {t("proof")} <Icon name="arrowRight" size={16} />
          </Link>
        </div>

        {missing.length > 0 && (
          <GapNote className="mt-4">
            Impact numbers not yet supplied: {missing.map((m) => m.label).join(", ")}. Add them to
            <code> content/site.config.ts → impact</code> with a counting method and an <code>updatedOn</code> date.
          </GapNote>
        )}
      </div>
    </section>
  );
}
