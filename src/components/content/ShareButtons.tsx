"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";

/** Copy link + WhatsApp (+ native share sheet on phones). */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const t = useTranslations("press");
  const [copied, setCopied] = useState(false);
  const btn =
    "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-maroon/20 px-4 text-sm font-semibold text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-cream";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            /* clipboard blocked; the URL is in the address bar */
          }
        }}
      >
        <Icon name={copied ? "check" : "copy"} size={18} />
        {copied ? t("copied") : t("copyLink")}
      </button>
      <a
        className={btn}
        href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="whatsapp" size={18} />
        {t("whatsapp")}
      </a>
      <button
        type="button"
        className={`${btn} sm:hidden`}
        onClick={() => navigator.share?.({ title, url }).catch(() => {})}
      >
        <Icon name="share" size={18} />
        {t("shareNative")}
      </button>
      <span role="status" className="sr-only">{copied ? t("copied") : ""}</span>
    </div>
  );
}
