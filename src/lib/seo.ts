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
  image,
  article,
  locales = routing.locales,
  canonicalLocale = locale,
}: {
  locale: string;
  path: string; // locale-less, e.g. "/programs"
  title: string;
  description: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
  /** Absolute URL of a 1200×630 share image. */
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  /** Turns the page into og:type=article with published/modified times. */
  article?: { publishedTime: string; modifiedTime?: string; section?: string } | null;
  /** Locales that really have this content (hreflang only lists these). */
  locales?: readonly string[];
  /** Point the canonical at another locale (e.g. ML page with no ML translation → EN). */
  canonicalLocale?: string;
}): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))]));
  const defaultLocale = locales.includes(routing.defaultLocale) ? routing.defaultLocale : locales[0];
  const images = image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: absoluteUrl(localePath(canonicalLocale, path)),
      languages: { ...languages, "x-default": absoluteUrl(localePath(defaultLocale, path)) },
    },
    openGraph: {
      ...(article
        ? {
            type: "article" as const,
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            section: article.section,
            authors: [siteConfig.org.name],
          }
        : { type: "website" as const }),
      siteName: "Hunger Free Kasaragod",
      locale: locale === "ml" ? "ml_IN" : "en_IN",
      alternateLocale: locale === "ml" ? ["en_IN"] : ["ml_IN"],
      url: absoluteUrl(localePath(locale, path)),
      title,
      description,
      images,
    },
    twitter: { card: "summary_large_image", site: "@LTS_Foundation", title, description, images: images?.map((i) => i.url) },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
