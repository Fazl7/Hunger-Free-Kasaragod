import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { otherInitiatives, programs } from "@content/programs";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, programServiceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { ProgramCard } from "@/components/ui/ProgramCard";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCta } from "@/sections/FinalCta";
import { tr } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/programs", title: t("programsTitle"), description: t("programsDescription"), absoluteTitle: true });
}

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("programs");
  const nav = await getTranslations("nav");
  const sorted = [...programs].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero title={t("heading")} intro={t("sub")} crumbs={[{ name: nav("programs"), path: "/programs" }]} />
      <section aria-label={nav("programs")} className="pb-24">
        <ul className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 3) * 0.08}>
              <ProgramCard program={p} locale={locale} headingLevel={2} />
            </Reveal>
          ))}
        </ul>
        <aside className="container-page mt-16">
          <div className="ml-auto max-w-3xl rounded-2xl bg-cream-deep/60 p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{t("otherHeading")}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t("otherSub")}</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
              {otherInitiatives.map((initiative) => (
                <li key={initiative.en}>{tr(initiative, locale)}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
      <FinalCta />
      <JsonLd
        data={graph(
          breadcrumbSchema(locale, [{ name: "Home", path: "/" }, { name: nav("programs"), path: "/programs" }]),
          ...sorted.map((p) => programServiceSchema(p, locale)),
        )}
      />
    </>
  );
}
