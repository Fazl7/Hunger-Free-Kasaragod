import type { MetadataRoute } from "next";
import { programs } from "@content/programs";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/seo";
import { getPressList } from "@/lib/data";

/**
 * /sitemap.xml: real, indexable pages only (remaining stubs are noindex and
 * excluded) plus every published press release. Regenerated whenever the admin
 * publishes (cache tag "press") and at least every 5 minutes.
 */
export const revalidate = 300;

const staticPaths: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/impact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/stories", priority: 0.7, changeFrequency: "monthly" },
  { path: "/make-an-impact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/food-rescue", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ledger", priority: 0.9, changeFrequency: "daily" },
  { path: "/press", priority: 0.8, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.8, changeFrequency: "weekly" },
  { path: "/programs", priority: 0.8, changeFrequency: "monthly" },
  ...programs.map((p) => ({ path: `/programs/${p.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
];

const alternates = (path: string, locales: readonly string[] = routing.locales) => ({
  languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, path))])),
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = staticPaths.flatMap(({ path, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: now,
      changeFrequency,
      priority,
      alternates: alternates(path),
    })),
  );

  const press = (await getPressList(1000)) ?? [];
  const releases: MetadataRoute.Sitemap = press.flatMap((p) => {
    const path = `/press/${p.slug}`;
    // Only list the Malayalam URL when a Malayalam translation exists (otherwise it canonicalises to English).
    const locales = p.title_ml?.trim() && p.body_ml?.trim() ? routing.locales : (["en"] as const);
    return locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: alternates(path, locales),
    }));
  });

  return [...pages, ...releases];
}
