import { clsx, type ClassValue } from "clsx";
import type { I18n } from "@content/site.config";
import type { Locale } from "@/i18n/routing";

export const cn = (...v: ClassValue[]) => clsx(v);

/** Pick the right language, falling back to English. */
export const tr = (v: I18n, locale: string) => (locale === "ml" ? v.ml || v.en : v.en);

const intlLocale = (l: Locale | string) => (l === "ml" ? "ml-IN" : "en-IN");

export const formatNumber = (n: number, locale: string) => new Intl.NumberFormat(intlLocale(locale)).format(n);

/** ₹ with Indian digit grouping: ₹1,00,000 */
export const formatINR = (n: number, locale: string) =>
  new Intl.NumberFormat(intlLocale(locale), { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const formatDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
