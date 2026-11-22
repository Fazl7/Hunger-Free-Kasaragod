import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { DonateWhatsAppForm } from "@/sections/DonateWhatsAppForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const donate = await getTranslations({ locale, namespace: "donate" });

  return buildMetadata({
    locale,
    path: "/donate",
    title: donate("pageTitle"),
    description: donate("pageIntro"),
    absoluteTitle: true,
  });
}

export default async function DonatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const donate = await getTranslations("donate");
  const crumbs = [{ name: donate("label"), path: "/donate" }];

  return (
    <>
      <PageHero title={donate("pageTitle")} intro={donate("pageIntro")} crumbs={crumbs} />

      <section className="container-page grid gap-8 py-12 pb-20 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="space-y-4">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-maroon">{donate("encouragementLabel")}</p>
          <Reveal delay={0.05} className="rounded-2xl bg-cream-deep p-5 text-xl font-semibold text-ink sm:p-6 sm:text-2xl">
            {donate("lineOne")}
          </Reveal>
          <Reveal delay={0.15} className="rounded-2xl bg-white p-5 text-xl font-semibold text-ink shadow-[var(--shadow-card)] ring-1 ring-ink/8 sm:p-6 sm:text-2xl">
            {donate("lineTwo")}
          </Reveal>
          <Reveal delay={0.25} className="rounded-2xl bg-maroon p-5 text-xl font-semibold text-cream shadow-[var(--shadow-card)] sm:p-6 sm:text-2xl">
            {donate("lineThree")}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/8 sm:p-8">
          <DonateWhatsAppForm whatsapp={siteConfig.org.whatsapp} />
        </Reveal>
      </section>

      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
