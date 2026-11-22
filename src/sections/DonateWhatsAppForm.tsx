"use client";

import type { FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@content/site.config";
import { Icon } from "@/components/icons/Icon";
import { formatINR } from "@/lib/utils";

const inputClass = "min-h-12 w-full min-w-0 rounded-xl border-2 border-ink/15 bg-white px-4 text-base focus:border-maroon";

export function DonateWhatsAppForm({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("donate");
  const locale = useLocale();

  function submitToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const amount = Number(formData.get("amount"));
    const message = [
      t("whatsappIntro"),
      "",
      `${t("name")}: ${name}`,
      `${t("amount")}: ${formatINR(amount, locale)}`,
    ].join("\n");

    window.location.assign(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`);
  }

  return (
    <form onSubmit={submitToWhatsApp} className="grid min-w-0 gap-5">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{t("formTitle")}</h2>
        <p className="mt-2 text-sm text-ink-soft">{t("formIntro")}</p>
      </div>

      <label className="grid min-w-0 gap-1.5 text-sm font-medium text-ink">
        {t("name")}
        <input name="name" autoComplete="name" required className={inputClass} />
      </label>

      <label className="grid min-w-0 gap-1.5 text-sm font-medium text-ink">
        {t("amount")}
        <span className="flex min-w-0 items-center rounded-xl border-2 border-ink/15 bg-white focus-within:border-maroon">
          <span aria-hidden className="pl-4 font-semibold text-ink-soft">₹</span>
          <input
            name="amount"
            type="number"
            min={siteConfig.donation.minINR}
            step={1}
            inputMode="numeric"
            required
            aria-describedby="donation-amount-hint"
            className="min-h-12 w-full min-w-0 bg-transparent px-3 text-base outline-none"
          />
        </span>
        <span id="donation-amount-hint" className="text-xs font-normal text-ink-soft">{t("amountHint")}</span>
      </label>

      <p className="text-sm text-ink-soft">{t("whatsappNote")}</p>
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon px-6 font-semibold text-cream transition-transform hover:-translate-y-0.5 active:scale-95 sm:justify-self-start"
      >
        {t("whatsappSubmit")}
        <Icon name="whatsapp" size={18} />
      </button>
    </form>
  );
}
