import type { MetadataRoute } from "next";
import { programs } from "@content/programs";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/seo";

/** Only real, indexable pages. Phase 3–4 stubs are noindex and intentionally excluded. */
const paths = ["/", "/programs", ...programs.map((p) => `/programs/${p.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path === "/programs" ? 0.8 : 0.7,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(localePath(l, path))])),
      },
    })),
  );
}
