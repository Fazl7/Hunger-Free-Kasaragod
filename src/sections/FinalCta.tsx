import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { LogoMark } from "@/components/layout/Logo";

/** S18. Final CTA band. */
export async function FinalCta() {
  const t = await getTranslations("finalCta");
  const c = await getTranslations("common");

  return (
    <section aria-labelledby="final-title" className="on-dark relative overflow-hidden bg-maroon pt-24 pb-36 text-cream">
      <div aria-hidden className="absolute -top-24 -left-24 size-96 rounded-full bg-maroon-deep" />
      <div aria-hidden className="absolute -right-20 bottom-10 size-72 rounded-full bg-mustard/15" />
      <div className="container-page relative text-center">
        <Reveal variant="scale">
          <LogoMark className="mx-auto mb-8 size-20" />
        </Reveal>
        <Reveal>
          <h2 id="final-title" className="mx-auto max-w-4xl text-[2.4rem] leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
            {t("heading")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream/85">{t("body")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/donate" variant="donate" icon="heart">{c("donate")}</ButtonLink>
            <ButtonLink href="/food-rescue" variant="light" icon="van">{c("giveSurplus")}</ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
