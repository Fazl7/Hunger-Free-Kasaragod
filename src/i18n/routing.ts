import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ml"],
  defaultLocale: "en",
  localePrefix: "always",
  // Never auto-redirect based on Accept-Language: crawlers must always get the URL they asked for.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
