"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname(); // locale-less path, e.g. "/programs/daily-food"
  const other = locale === "en" ? "ml" : "en";

  return (
    <Link
      href={pathname}
      locale={other}
      hrefLang={other}
      lang={other}
      title={t("switchToLabel")}
      style={other === "ml" ? { fontFamily: "'Nirmala UI', Kartika, system-ui, sans-serif" } : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border border-current/25 px-3.5 text-sm font-semibold transition-colors hover:border-current",
        className,
      )}
    >
      {t("switchTo")}
    </Link>
  );
}
