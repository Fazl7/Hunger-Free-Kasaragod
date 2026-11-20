import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/** Allow all crawlers, including reputable AI crawlers (see DECISIONS.md). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"], allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
