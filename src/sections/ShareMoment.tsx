import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconKey } from "@/components/icons/Icon";

/**
 * S13. Personal upload teaser. The wall of approved submissions appears here
 * once uploads + moderation ship (Phase 4). Until then the frames are
 * decorative illustrations, never fake "user" photos.
 */
export async function ShareMoment() {
  const t = await getTranslations("share");
  const frames: { icon: IconKey; rot: string; bg: string }[] = [
    { icon: "plate", rot: "-rotate-6", bg: "bg-maroon text-cream" },
    { icon: "gift", rot: "rotate-3", bg: "bg-mustard text-ink" },
    { icon: "heart", rot: "-rotate-2", bg: "bg-purple text-cream" },
  ];

  return (
    <Section id="share" labelledBy="share-title" className="overflow-hidden">
      <div className="container-page grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-maroon">
            <span aria-hidden className="h-px w-8 bg-maroon" />
            {t("label")}
          </p>
          <h2 id="share-title" className="text-[2rem] leading-[1.1] font-semibold sm:text-5xl">{t("heading")}</h2>
          <p className="mt-5 max-w-lg text-lg text-ink-soft">{t("body")}</p>
          <ButtonLink href="/share-your-moment" icon="camera" className="mt-8">{t("cta")}</ButtonLink>
        </Reveal>

        <div aria-hidden className="relative mx-auto flex h-80 w-full max-w-md items-center justify-center">
          {frames.map((f, i) => (
            <Reveal
              key={f.icon}
              variant="scale"
              delay={i * 0.12}
              className={`absolute ${i === 0 ? "-translate-x-28" : i === 2 ? "translate-x-28" : "z-10 -translate-y-4"}`}
            >
              <div className={`${f.rot} rounded-2xl bg-white p-3 pb-10 shadow-[0_24px_50px_-24px_rgba(30,26,23,.6)] transition-transform duration-500 hover:rotate-0`}>
                <div className={`flex size-40 items-center justify-center rounded-xl ${f.bg}`}>
                  <Icon name={f.icon} size={64} strokeWidth={1.3} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
