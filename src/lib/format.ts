/**
 * Formatting for the live features.
 * - Counts use Indian digit grouping (1,25,000) and Malayalam digits (൧,൨൫,൦൦൦) in ML.
 * - Dates are plain `YYYY-MM-DD` values; formatting in UTC avoids off-by-one days.
 */

const countLocale = (locale: string) => (locale === "ml" ? "ml-IN-u-nu-mlym" : "en-IN");
const dateLocale = (locale: string) => (locale === "ml" ? "ml-IN" : "en-IN");

export const formatCount = (n: number, locale: string) => new Intl.NumberFormat(countLocale(locale)).format(n);

const asUtcDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);

/** "21 November 2026" */
export const formatLongDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(dateLocale(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    asUtcDate(iso),
  );

/** "21 Nov" */
export const formatShortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(dateLocale(locale), { day: "numeric", month: "short", timeZone: "UTC" }).format(asUtcDate(iso));

/** "2026-11" → "November 2026" */
export const formatMonth = (month: string, locale: string, style: "long" | "short" = "long") =>
  new Intl.DateTimeFormat(dateLocale(locale), {
    month: style,
    year: style === "long" ? "numeric" : "2-digit",
    timeZone: "UTC",
  }).format(asUtcDate(`${month}-01`));

/** Today's date in Kerala as YYYY-MM-DD (for form defaults). */
export const todayIST = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );

/** "120+" style rounding for big, growing counts. */
export const roundedPlus = (n: number) => (n >= 20 ? { value: Math.floor(n / 10) * 10, plus: n % 10 !== 0 } : { value: n, plus: false });

/** Pick the active language with English fallback. */
export const pick = (en: string | null | undefined, ml: string | null | undefined, locale: string) =>
  (locale === "ml" && ml?.trim() ? ml : en) ?? "";

/** Lowercase, ASCII, hyphenated slug. Malayalam-only titles fall back to a dated slug. */
export function slugify(input: string, fallbackDate?: string) {
  const s = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return s || `press-release-${fallbackDate ?? todayIST()}`;
}
