import { Fragment, type CSSProperties } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { Icon, type IconKey } from "@/components/icons/Icon";
import { HeroVideo } from "@/components/media/HeroVideo";
import { tr } from "@/lib/utils";

/** S1. Hero: word-mask H1 (pure CSS, so nothing on the LCP path waits for JS). */
export async function Hero() {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  const words = t("title").split(" ");
  const media = siteConfig.heroMedia;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-cream grain">
      {/* soft background shapes */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 size-[38rem] rounded-full bg-mustard/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 size-[30rem] rounded-full bg-maroon/10 blur-3xl" />

      <div className="container-page relative grid items-center gap-12 pt-10 pb-28 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pt-20 lg:pb-36">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-maroon/8 px-4 py-2 text-sm font-medium text-maroon">
            <Icon name="pin" size={16} />
            {t("eyebrow")}
          </p>

          <h1
            id="hero-title"
            className="text-[3.1rem] leading-[0.98] font-semibold tracking-tight text-ink sm:text-7xl lg:text-[5.4rem]"
          >
            {words.map((w, i) => (
              <Fragment key={i}>
                <span className="word-mask">
                  <span
                    style={{ "--d": `${0.08 + i * 0.12}s` } as CSSProperties}
                    className={i === words.length - 1 ? "scribble text-maroon italic" : undefined}
                  >
                    {w}
                  </span>
                </span>
                {i < words.length - 1 && " "}
              </Fragment>
            ))}
          </h1>

          <p className="hero-rise mt-7 max-w-xl text-lg text-ink-soft sm:text-xl" style={{ "--d": ".3s" } as CSSProperties}>
            {t("sub")}
          </p>

        </div>

        {media ? (
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-maroon shadow-2xl sm:aspect-[5/4] lg:aspect-[4/5]">
            <HeroVideo mp4={media.mp4} webm={media.webm} poster={media.poster} alt={tr(media.alt, locale)} />
          </div>
        ) : (
          <HeroIllustration />
        )}
      </div>

      <a
        href="#numbers"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-medium tracking-wide text-ink-soft sm:flex"
      >
        {t("scroll")}
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-ink/25 pt-2">
          <span className="h-2 w-1 rounded-full bg-maroon motion-safe:animate-bounce" />
        </span>
      </a>
    </section>
  );
}

/** Illustrated hero used until a consented hero video is supplied. */
function HeroIllustration() {
  const badges: { icon: IconKey; cls: string; delay: string }[] = [
    { icon: "plate", cls: "top-[8%] left-[2%] bg-cream text-maroon", delay: "0s" },
    { icon: "van", cls: "top-[14%] right-[4%] bg-mustard text-ink", delay: "1.2s" },
    { icon: "kit", cls: "bottom-[16%] left-[-2%] bg-leaf text-cream", delay: "2.1s" },
  ];
  return (
    <div aria-hidden className="hero-rise relative mx-auto aspect-square w-full max-w-[34rem]" style={{ "--d": ".15s" } as CSSProperties}>
      <div className="absolute inset-[6%] rounded-full bg-maroon" />
      <div className="absolute inset-[6%] overflow-hidden rounded-full">
        <div className="absolute -right-[10%] -bottom-[25%] size-[85%] rounded-full bg-maroon-deep" />
        <div className="absolute top-[12%] left-[16%] size-[26%] rounded-full bg-mustard/90 motion-safe:animate-float" />
      </div>

      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full">
        {/* steam */}
        <g fill="none" stroke="#FFF8E7" strokeWidth="7" strokeLinecap="round" opacity=".9">
          <path className="motion-safe:animate-steam" d="M160 170c-14-18 14-30 0-50" />
          <path className="motion-safe:animate-steam [animation-delay:.8s]" d="M200 160c-14-18 14-30 0-50" />
          <path className="motion-safe:animate-steam [animation-delay:1.6s]" d="M240 170c-14-18 14-30 0-50" />
        </g>
        {/* bowl */}
        <path d="M84 200h232a116 116 0 0 1-232 0z" fill="#F2B705" />
        <path d="M84 200h232" stroke="#FFF8E7" strokeWidth="10" strokeLinecap="round" />
        <path d="M130 250c38 30 102 30 140 0" fill="none" stroke="#7A1F1F" strokeWidth="11" strokeLinecap="round" />
        <path d="M160 316h80" stroke="#5A1515" strokeWidth="12" strokeLinecap="round" />
        {/* grains */}
        <g fill="#FFF8E7">
          <ellipse cx="140" cy="192" rx="9" ry="5" />
          <ellipse cx="175" cy="188" rx="9" ry="5" />
          <ellipse cx="215" cy="190" rx="9" ry="5" />
          <ellipse cx="255" cy="188" rx="9" ry="5" />
        </g>
      </svg>

      {badges.map((b) => (
        <span
          key={b.icon}
          className={`absolute flex size-16 items-center justify-center rounded-2xl shadow-xl motion-safe:animate-float sm:size-20 ${b.cls}`}
          style={{ animationDelay: b.delay }}
        >
          <Icon name={b.icon} size={34} strokeWidth={1.6} />
        </span>
      ))}
    </div>
  );
}
