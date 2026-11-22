"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

/** Small pulsing "● Updated just now / 3 minutes ago" badge for live data. */
export function UpdatedIndicator({ updatedAt, className }: { updatedAt: number | null; className?: string }) {
  const t = useTranslations("live");
  const locale = useLocale();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  let label = t("live");
  if (updatedAt && now) {
    const secs = Math.max(0, Math.round((now - updatedAt) / 1000));
    if (secs < 60) label = t("justNow");
    else {
      const rtf = new Intl.RelativeTimeFormat(locale === "ml" ? "ml-IN" : "en-IN", { numeric: "auto" });
      const mins = Math.round(secs / 60);
      label = t("ago", { time: mins < 60 ? rtf.format(-mins, "minute") : rtf.format(-Math.round(mins / 60), "hour") });
    }
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-live="polite">
      <span aria-hidden className="relative flex size-2.5">
        <span className="absolute inline-flex size-full rounded-full bg-leaf opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2.5 rounded-full bg-leaf" />
      </span>
      {label}
    </span>
  );
}
