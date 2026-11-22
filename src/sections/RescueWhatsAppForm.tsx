"use client";

import type { FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { siteConfig } from "@content/site.config";
import { Icon } from "@/components/icons/Icon";
import { tr } from "@/lib/utils";

const extraRescueAreas = [{ id: "thrikkaripur", name: { en: "Thrikkaripur", ml: "തൃക്കരിപ്പൂർ" } }];
const rescueAreas = [...siteConfig.places, ...extraRescueAreas];
const inputClass = "min-h-12 w-full min-w-0 rounded-xl border-2 border-ink/15 bg-white px-4 text-base focus:border-maroon";

export function RescueWhatsAppForm({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("rescue");
  const locale = useLocale();

  function submitToWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedArea = rescueAreas.find((area) => area.id === String(formData.get("area")));
    const fields = [
      { label: t("name"), value: String(formData.get("name") ?? "") },
      { label: t("phone"), value: String(formData.get("phone") ?? "") },
      { label: t("date"), value: String(formData.get("date") ?? "") },
      { label: t("areaLabel"), value: selectedArea ? tr(selectedArea.name, locale) : String(formData.get("area") ?? "") },
      { label: t("venue"), value: String(formData.get("venue") ?? "") },
      { label: t("servings"), value: String(formData.get("servings") ?? "") },
      { label: t("foodDetails"), value: String(formData.get("details") ?? "") },
    ].filter(({ value }) => value);
    const message = [
      t("whatsappIntro"),
      "",
      ...fields.map(({ label, value }) => `${label}: ${value}`),
    ].join("\n");

    window.location.assign(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`);
  }

  return (
    <form onSubmit={submitToWhatsApp} className="grid gap-4 md:grid-cols-2">
      <h3 className="font-display text-2xl font-semibold md:col-span-2">{t("formTitle")}</h3>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">
        {t("name")}
        <input name="name" autoComplete="name" required className={inputClass} />
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">
        {t("phone")}
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required className={inputClass} />
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">
        {t("date")}
        <input name="date" type="date" required className={inputClass} />
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">
        {t("areaLabel")}
        <select name="area" defaultValue="" required className={inputClass}>
          <option value="" disabled>{t("selectArea")}</option>
          {rescueAreas.map((area) => (
            <option key={area.id} value={area.id}>{tr(area.name, locale)}</option>
          ))}
          <option value="other">{t("areaOther")}</option>
        </select>
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">
        {t("venue")}
        <input name="venue" autoComplete="street-address" required className={inputClass} />
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium">
        {t("servings")}
        <input name="servings" type="number" min={1} inputMode="numeric" className={inputClass} />
      </label>
      <label className="grid min-w-0 gap-1.5 text-sm font-medium md:col-span-2">
        {t("foodDetails")}
        <textarea name="details" rows={3} className="w-full min-w-0 rounded-xl border-2 border-ink/15 bg-white px-4 py-3 text-base focus:border-maroon" />
      </label>
      <p className="text-sm text-ink-soft md:col-span-2">{t("whatsappNote")}</p>
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon px-6 font-semibold text-cream transition-transform hover:-translate-y-0.5 active:scale-95 md:col-span-2 md:justify-self-start"
      >
        {t("whatsappSubmit")}
        <Icon name="arrowRight" size={18} />
      </button>
    </form>
  );
}
