"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons/Icon";

const inputClass = "min-h-12 w-full min-w-0 rounded-xl border-2 border-ink/15 bg-white px-4 text-base focus:border-maroon";
const OCCASIONS = ["birthday", "wedding", "anniversary", "memorial", "volunteering", "other"] as const;

/**
 * "Share your moment": a short form that opens WhatsApp with a ready-made message.
 * A wa.me link can only carry text, so visitors send their photo in the same chat
 * after the message. Nothing is uploaded to our servers.
 */
export function ShareMomentForm({ whatsapp }: { whatsapp: string }) {
  const t = useTranslations("shareForm");
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const top = useRef<HTMLDivElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const occasion = get("occasion");
    const fields = [
      { label: t("name"), value: get("name") },
      { label: t("place"), value: get("place") },
      { label: t("date"), value: get("date") },
      { label: t("occasion"), value: occasion ? t(`occasions.${occasion}` as "occasions.other") : "" },
    ].filter((f) => f.value);
    const message = [
      t("whatsappIntro"),
      "",
      ...fields.map((f) => `${f.label}: ${f.value}`),
      "",
      get("story"),
      "",
      `${t("consentLabel")}: ${fd.get("consent") ? t("yes") : t("no")}`,
    ]
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

    setSentUrl(url);
    // New tab keeps this page (and the photo reminder) open; on phones it hands over to the WhatsApp app.
    // (No "noopener" feature: it makes window.open return null, hiding whether a popup blocker stepped in.)
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.assign(url);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <div ref={top} className="scroll-mt-28">
      {sentUrl ? (
        <div className="motion-safe:animate-[rise-in_.5s_cubic-bezier(.22,1,.36,1)]" aria-live="polite">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-leaf text-cream motion-safe:animate-[lightbox-in_.5s_cubic-bezier(.22,1,.36,1)]">
              <Icon name="check" size={24} />
            </span>
            <h3 className="font-display text-2xl font-semibold">{t("sentTitle")}</h3>
          </div>
          <p className="mt-3 text-ink-soft">{t("sentBody")}</p>

          <div className="mt-6 flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink/8">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mustard text-ink">
              <Icon name="camera" size={22} />
            </span>
            <p className="text-sm text-ink-soft">
              <span className="block font-semibold text-ink">{t("photoReminderTitle")}</span>
              {t("photoNote")}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={sentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-maroon/25 px-5 font-semibold text-maroon transition-colors hover:border-maroon"
            >
              <Icon name="whatsapp" size={18} /> {t("openAgain")}
            </a>
            <button
              type="button"
              onClick={() => setSentUrl(null)}
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-semibold text-ink-soft hover:bg-ink/5"
            >
              {t("startOver")}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <h3 className="font-display text-2xl font-semibold md:col-span-2">{t("formTitle")}</h3>
          <label className="grid min-w-0 gap-1.5 text-sm font-medium">
            {t("name")}
            <input name="name" autoComplete="name" required className={inputClass} />
          </label>
          <label className="grid min-w-0 gap-1.5 text-sm font-medium">
            {t("place")}
            <input name="place" autoComplete="address-level2" className={inputClass} />
          </label>
          <label className="grid min-w-0 gap-1.5 text-sm font-medium">
            {t("occasion")}
            <select name="occasion" defaultValue="" className={inputClass}>
              <option value="">{t("selectOccasion")}</option>
              {OCCASIONS.map((o) => (
                <option key={o} value={o}>{t(`occasions.${o}`)}</option>
              ))}
            </select>
          </label>
          <label className="grid min-w-0 gap-1.5 text-sm font-medium">
            {t("date")}
            <input name="date" type="date" className={inputClass} />
          </label>
          <label className="grid min-w-0 gap-1.5 text-sm font-medium md:col-span-2">
            {t("story")}
            <textarea
              name="story"
              rows={4}
              required
              maxLength={1500}
              placeholder={t("storyPlaceholder")}
              className="w-full min-w-0 rounded-xl border-2 border-ink/15 bg-white px-4 py-3 text-base placeholder:text-ink-soft/60 focus:border-maroon"
            />
          </label>

          {/* Photo: sent manually in the WhatsApp chat (wa.me links can't carry files). */}
          <div className="flex gap-4 rounded-2xl border-2 border-dashed border-ink/20 bg-white p-4 md:col-span-2">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mustard text-ink">
              <Icon name="camera" size={22} />
            </span>
            <p className="text-sm text-ink-soft">
              <span className="block font-semibold text-ink">{t("photoTitle")}</span>
              {t("photoNote")}
            </p>
          </div>

          <label className="flex items-start gap-3 text-sm md:col-span-2">
            <input type="checkbox" name="consent" className="mt-0.5 size-5 shrink-0 accent-maroon" />
            <span>{t("consent")}</span>
          </label>

          <p className="text-sm text-ink-soft md:col-span-2">{t("whatsappNote")}</p>
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-maroon px-6 font-semibold text-cream shadow-[0_6px_20px_-8px_rgba(122,31,31,.7)] transition-transform hover:-translate-y-0.5 active:scale-95 md:col-span-2 md:justify-self-start"
          >
            <Icon name="whatsapp" size={18} />
            {t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}
