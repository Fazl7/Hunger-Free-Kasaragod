import { siteConfig, registrationsVerified } from "@content/site.config";
import type { Faq } from "@content/faqs";
import type { Program } from "@content/programs";
import { absoluteUrl, localePath } from "./seo";
import { tr } from "./utils";

/** Stable @id graph so search and AI engines learn one consistent entity. */
export const ids = {
  org: absoluteUrl("/#organization"),
  website: absoluteUrl("/#website"),
};

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  const { org, registrations } = siteConfig;
  return {
    "@type": ["NGO", "Organization"],
    "@id": ids.org,
    name: org.name,
    alternateName: [org.alternateName, org.brand],
    url: siteConfig.siteUrl,
    logo: absoluteUrl("/icon.svg"),
    sameAs: [org.socials.x, org.socials.instagram, org.socials.website],
    areaServed: siteConfig.places.map((p) => ({ "@type": "Place", name: `${p.name.en}, Kasaragod district, Kerala, India` })),
    knowsAbout: ["Food distribution", "Surplus food rescue", "Grocery kit distribution", "Hunger relief"],
    ...(org.foundingYear && { foundingDate: String(org.foundingYear) }),
    ...(org.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: org.address.street,
        addressLocality: org.address.locality,
        addressRegion: org.address.region,
        postalCode: org.address.postalCode,
        addressCountry: org.address.country,
      },
    }),
    ...((org.phone || org.email) && {
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        ...(org.phone && { telephone: org.phone }),
        ...(org.email && { email: org.email }),
        availableLanguage: ["en", "ml"],
      },
    }),
    // Registrations only once verified against original certificates.
    ...(registrationsVerified && {
      identifier: [
        { "@type": "PropertyValue", name: "NGO Darpan (NITI Aayog)", value: registrations.niti },
        { "@type": "PropertyValue", name: "12A", value: registrations.twelveA },
        { "@type": "PropertyValue", name: "80G", value: registrations.eightyG },
        { "@type": "PropertyValue", name: "CSR-1", value: registrations.csr1 },
      ],
    }),
  };
}

export function websiteSchema(locale: string): Json {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: "Hunger Free Kasaragod",
    url: siteConfig.siteUrl,
    inLanguage: locale,
    publisher: { "@id": ids.org },
  };
}

export function faqSchema(items: Faq[], locale: string): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: tr(f.q, locale),
      acceptedAnswer: { "@type": "Answer", text: tr(f.a, locale) },
    })),
  };
}

export function breadcrumbSchema(locale: string, crumbs: { name: string; path: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(localePath(locale, c.path)),
    })),
  };
}

export function programServiceSchema(p: Program, locale: string): Json {
  return {
    "@type": "Service",
    name: tr(p.name, locale),
    description: tr(p.summary, locale),
    serviceType: "Hunger relief",
    provider: { "@id": ids.org },
    areaServed: tr(p.areas, "en"),
    url: absoluteUrl(localePath(locale, `/programs/${p.slug}`)),
  };
}

export function donateActionSchema(locale: string): Json {
  return {
    "@type": "DonateAction",
    recipient: { "@id": ids.org },
    target: absoluteUrl(localePath(locale, "/donate")),
  };
}

export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });

/** Inline publisher block (Google wants name + logo on the article itself). */
const publisher = () => ({
  "@type": "NGO",
  "@id": ids.org,
  name: siteConfig.org.name,
  url: siteConfig.siteUrl,
  logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") },
});

/** NewsArticle for a press release. Dates are midnight IST of the release date. */
export function newsArticleSchema(a: {
  locale: string;
  slug: string;
  headline: string;
  description: string;
  releaseDate: string; // YYYY-MM-DD
  modified: string; // ISO timestamp
  images: string[];
  place?: string | null;
}): Json {
  const url = absoluteUrl(localePath(a.locale, `/press/${a.slug}`));
  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: a.headline.slice(0, 110),
    description: a.description,
    inLanguage: a.locale,
    datePublished: `${a.releaseDate}T00:00:00+05:30`,
    dateModified: a.modified,
    ...(a.images.length && { image: a.images }),
    author: { "@type": "Organization", name: siteConfig.org.name, url: siteConfig.siteUrl },
    publisher: publisher(),
    ...(a.place && { contentLocation: { "@type": "Place", name: a.place }, dateline: a.place }),
  };
}

/** VideoObject for a YouTube video in the gallery. */
export function videoObjectSchema(v: { youtubeId: string; name: string; uploadDate: string; description?: string }): Json {
  return {
    "@type": "VideoObject",
    name: v.name,
    description: v.description ?? v.name,
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`],
    uploadDate: v.uploadDate,
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    url: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    publisher: publisher(),
  };
}
