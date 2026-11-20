import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { programs, getProgram } from "@content/programs";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, programServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { GapNote } from "@/components/ui/GapNote";
import { Icon } from "@/components/icons/Icon";
import { toneClasses } from "@/components/ui/ProgramCard";
import { tr, cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => programs.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProgram(slug);
  if (!p) return {};
  return buildMetadata({
    locale,
    path: `/programs/${slug}`,
    title: `${tr(p.name, locale)} · Kasaragod`,
    description: tr(p.summary, locale),
  });
}

export default async function ProgramPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = getProgram(slug);
  if (!p) notFound();

  const t = await getTranslations("programs");
  const nav = await getTranslations("nav");
  const c = await getTranslations("common");
  const sorted = [...programs].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex((x) => x.slug === slug);
  const prev = sorted[(idx - 1 + sorted.length) % sorted.length];
  const next = sorted[(idx + 1) % sorted.length];
  const tone = toneClasses[p.tone];
  const crumbs = [
    { name: nav("programs"), path: "/programs" },
    { name: tr(p.name, locale), path: `/programs/${slug}` },
  ];
  const ctaHref = slug === "celebrating-together" ? "/food-rescue" : slug === "food-on-call" ? "/request-help" : `/donate?program=${slug}`;

  return (
    <>
      <PageHero title={tr(p.name, locale)} intro={tr(p.summary, locale)} crumbs={crumbs}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href={ctaHref} variant="donate" icon="arrowRight">
            {slug === "celebrating-together" ? c("giveSurplus") : slug === "food-on-call" ? nav("requestHelp") : t("supportThis")}
          </ButtonLink>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-4 py-2 text-sm font-medium">
            <Icon name="pin" size={16} /> {t("areasServed")}: {tr(p.areas, locale)}
          </span>
        </div>
      </PageHero>

      <section className="pb-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <article className="max-w-none space-y-5 text-lg leading-relaxed text-ink">
            {/* Not wrapped in <Reveal>: this is above the fold on mobile and must paint without JS (LCP). */}
            {p.body.map((para, i) => (
              <p key={i}>{tr(para, locale)}</p>
            ))}
            <GapNote>
              Program page needs 400+ unique words per language (spec §8.8): history, real numbers, a consented photo/video, 3–5 FAQs
              and related ledger entries. Only brochure facts are used so far.
            </GapNote>
          </article>

          <aside className={cn("relative h-fit overflow-hidden rounded-[var(--radius-card)] p-8", tone.card, tone.dark && "on-dark")}>
            <Icon name={p.icon} size={160} strokeWidth={1.1} aria-hidden className="absolute -right-6 -bottom-6 opacity-10" />
            <span className={cn("flex size-14 items-center justify-center rounded-2xl", tone.icon)}>
              <Icon name={p.icon} size={28} />
            </span>
            {p.stat && (
              <p className="mt-6">
                <span className="block font-display text-6xl font-semibold">{p.stat.value}</span>
                <span className="opacity-90">{tr(p.stat.label, locale)}</span>
              </p>
            )}
            {p.howItWorks && (
              <>
                <h2 className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.14em] opacity-90">{t("howItWorks")}</h2>
                <ol className="mt-4 space-y-3">
                  {p.howItWorks.map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold", tone.icon)}>{i + 1}</span>
                      <span>{tr(s, locale)}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </aside>
        </div>

        <nav aria-label={nav("programs")} className="container-page mt-16 grid gap-4 border-t border-ink/10 pt-10 sm:grid-cols-2">
          <Link href={`/programs/${prev.slug}`} className="group rounded-2xl p-4 transition-colors hover:bg-ink/5">
            <span className="flex items-center gap-1.5 text-sm text-ink-soft"><Icon name="arrowLeft" size={16} /> {t("prev")}</span>
            <span className="mt-1 block font-display text-2xl font-semibold group-hover:text-maroon">{tr(prev.name, locale)}</span>
          </Link>
          <Link href={`/programs/${next.slug}`} className="group rounded-2xl p-4 text-right transition-colors hover:bg-ink/5">
            <span className="flex items-center justify-end gap-1.5 text-sm text-ink-soft">{t("next")} <Icon name="arrowRight" size={16} /></span>
            <span className="mt-1 block font-display text-2xl font-semibold group-hover:text-maroon">{tr(next.name, locale)}</span>
          </Link>
        </nav>
      </section>

      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]), programServiceSchema(p, locale))} />
    </>
  );
}
