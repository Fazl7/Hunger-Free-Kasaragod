import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";

/**
 * TEMPORARY stub for routes scheduled in Phases 3–4, so navigation never 404s
 * during development. Each stub is `noindex` and excluded from the sitemap.
 * A real folder (e.g. app/[locale]/donate/) automatically takes precedence.
 */
const stubRoutes = {
  "share-your-moment": null,
  privacy: "privacy",
  terms: "terms",
} as const;

type Props = { params: Promise<{ locale: string; page: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => Object.keys(stubRoutes).map((page) => ({ locale, page })));
}

async function titleFor(page: string) {
  const nav = await getTranslations("nav");
  const key = stubRoutes[page as keyof typeof stubRoutes];
  if (page === "share-your-moment") return (await getTranslations("share"))("cta");
  return key ? nav(key) : page;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, page } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "common" });
  return buildMetadata({ locale, path: `/${page}`, title: await titleFor(page), description: t("comingSoonBody"), noindex: true });
}

export default async function StubPage({ params }: Props) {
  const { locale, page } = await params;
  if (!(page in stubRoutes)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const nav = await getTranslations("nav");
  const title = await titleFor(page);

  return (
    <PageHero title={title} intro={t("comingSoonBody")} crumbs={[{ name: title, path: `/${page}` }]}>
      <p className="mt-4 inline-flex rounded-full bg-mustard/40 px-4 py-1.5 text-sm font-semibold">{t("comingSoonTitle")}</p>
      <div className="mt-8 flex flex-wrap gap-3 pb-16">
        <ButtonLink href="/programs" icon="arrowRight">{nav("programs")}</ButtonLink>
        <ButtonLink href="/" variant="outline">{t("home")}</ButtonLink>
      </div>
    </PageHero>
  );
}
