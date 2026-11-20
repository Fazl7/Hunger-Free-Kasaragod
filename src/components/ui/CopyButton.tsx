"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";

/** Copy-to-clipboard with an icon morph and a polite live announcement. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const t = useTranslations("common");
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard blocked: the ID is still visible to select manually */
        }
      }}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-current/25 px-3 text-sm font-medium transition-colors hover:border-current"
    >
      <span className="relative size-4">
        <Icon name="copy" size={16} className={`absolute inset-0 transition-all duration-300 ${done ? "scale-50 opacity-0" : ""}`} />
        <Icon name="check" size={16} className={`absolute inset-0 text-leaf transition-all duration-300 ${done ? "" : "scale-50 opacity-0"}`} />
      </span>
      <span>{done ? t("copied") : label}</span>
      <span role="status" className="sr-only">{done ? t("copied") : ""}</span>
    </button>
  );
}
