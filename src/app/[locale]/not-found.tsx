import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/Button";
import { LogoMark } from "@/components/layout/Logo";

export default async function NotFound() {
  const t = await getTranslations("common");
  const nav = await getTranslations("nav");
  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="size-20" />
      <p className="mt-6 font-display text-7xl font-semibold text-maroon">404</p>
      <h1 className="mt-4 text-4xl font-semibold">{t("notFoundTitle")}</h1>
      <p className="mt-4 max-w-md text-lg text-ink-soft">{t("notFoundBody")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" icon="arrowRight">{t("home")}</ButtonLink>
        <ButtonLink href="/programs" variant="outline">{nav("programs")}</ButtonLink>
        <ButtonLink href="/food-rescue" variant="outline">{nav("foodRescue")}</ButtonLink>
      </div>
    </section>
  );
}
