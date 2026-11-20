import type { Metadata } from "next";
import { siteConfig } from "@content/site.config";
import { routing } from "@/i18n/routing";

export const absoluteUrl = (path = "") => new URL(path, siteConfig.siteUrl).toString();

/** `/en/programs` style path for a given locale and locale-less route. */
export const localePath = (locale: string, path: string) => `/${locale}${path === "/" ? "" : path}`;

/**
 * Per-route metadata: canonical (self-referencing), reciprocal hreflang for
 * every locale + x-default, Open Graph and Twitter cards.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  noindex = false,
  absoluteTitle = false,
}: {
  locale: string;
  path: string; // locale-less, e.g. "/programs"
  title: string;
  description: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(localePath(l, path))]));
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: absoluteUrl(localePath(locale, path)),
      languages: { ...languages, "x-default": absoluteUrl(localePath(routing.defaultLocale, path)) },
    },
    openGraph: {
      type: "website",
      siteName: "Hunger Free Kasaragod",
      locale: locale === "ml" ? "ml_IN" : "en_IN",
      alternateLocale: locale === "ml" ? ["en_IN"] : ["ml_IN"],
      url: absoluteUrl(localePath(locale, path)),
      title,
      description,
    },
    twitter: { card: "summary_large_image", site: "@LTS_Foundation", title, description },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
