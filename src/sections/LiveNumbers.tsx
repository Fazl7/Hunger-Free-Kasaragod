"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ImpactStats } from "@/lib/supabase/types";
import { Link } from "@/i18n/navigation";
import { AnimatedCounter } from "@/components/live/AnimatedCounter";
import { UpdatedIndicator } from "@/components/live/UpdatedIndicator";
import { useImpactStats } from "@/components/live/useImpactStats";
import { Icon, type IconKey } from "@/components/icons/Icon";

/**
 * Live version of the home stats bar. Markup and classes are identical to the
 * original <NumbersStrip/> list; only the data source changed (get_impact_stats
 * + realtime). Shows skeletons, never a fake 0, until real numbers arrive.
 */
export function LiveNumbers({ initial }: { initial: ImpactStats | null }) {
  const t = useTranslations("numbers");
  const locale = useLocale();
  const { stats, status, updatedAt } = useImpactStats(initial);
  const ready = status === "ready" && stats;

  const items: { value: number | null; label: string; icon: IconKey }[] = [
    { value: stats?.meals ?? null, label: t("foodsDistributed"), icon: "plate" },
    { value: stats?.kits ?? null, label: t("kitsGiven"), icon: "kit" },
    { value: stats?.days ?? null, label: t("daysSince"), icon: "calendar" },
  ];

  return (
    <>
      <ul className="grid gap-px overflow-hidden rounded-[2rem] bg-cream/15 text-cream shadow-[0_30px_60px_-30px_rgba(30,26,23,.6)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s, i) => (
          <li key={s.label} className="flex items-center gap-5 bg-ink p-7 sm:p-8 sm:last:odd:col-span-2 lg:last:odd:col-span-1">
            <span
              aria-hidden
              className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${i === 0 ? "bg-mustard text-ink" : "bg-cream/10 text-mustard"}`}
            >
              <Icon name={s.icon} size={28} />
            </span>
            <p className="flex flex-col">
              <span className="font-display text-5xl leading-none font-semibold text-cream">
                {ready && s.value === null ? "–" : <AnimatedCounter value={s.value} locale={locale} skeletonClassName="w-[4ch] bg-cream/15" />}
              </span>
              <span className="mt-2 text-sm leading-snug text-cream/75">{s.label}</span>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 text-sm text-ink-soft">
        {stats ? <UpdatedIndicator updatedAt={updatedAt} /> : <span />}
        <Link href="/ledger" className="inline-flex items-center gap-1.5 font-medium text-maroon underline-offset-4 hover:underline">
          {t("proof")} <Icon name="arrowRight" size={16} />
        </Link>
      </div>
    </>
  );
}
