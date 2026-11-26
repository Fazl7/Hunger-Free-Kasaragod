import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { ShareMomentForm } from "@/sections/ShareMomentForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shareForm" });
  return buildMetadata({ locale, path: "/share-your-moment", title: t("pageTitle"), description: t("pageIntro") });
}

export default async function ShareYourMomentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shareForm");
  const crumbs = [{ name: t("pageTitle"), path: "/share-your-moment" }];
  const steps: { icon: IconKey; title: string; body: string }[] = [
    { icon: "edit", title: t("how1Title"), body: t("how1Body") },
    { icon: "whatsapp", title: t("how2Title"), body: t("how2Body") },
    { icon: "camera", title: t("how3Title"), body: t("how3Body") },
  ];

  return (
    <>
      <PageHero title={t("pageTitle")} intro={t("pageIntro")} crumbs={crumbs} />

      <section className="container-page grid gap-10 py-12 pb-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-maroon">{t("howLabel")}</p>
          <ol className="space-y-4">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.1} className="flex gap-4 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/8">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mustard text-ink">
                  <Icon name={s.icon} size={22} />
                </span>
                <span>
                  <span className="block font-semibold text-ink">
                    <span className="mr-1.5 text-maroon tabular">{i + 1}.</span>
                    {s.title}
                  </span>
                  <span className="mt-1 block text-ink-soft">{s.body}</span>
                </span>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.3} className="mt-6 flex gap-3 rounded-2xl bg-cream-deep p-5 text-sm text-ink-soft">
            <Icon name="shield" size={20} className="mt-0.5 shrink-0 text-maroon" />
            <p>{t("privacy")}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="rounded-[var(--radius-card)] bg-cream-deep p-6 sm:p-8">
          <ShareMomentForm whatsapp={siteConfig.org.whatsapp} />
        </Reveal>
      </section>

      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
