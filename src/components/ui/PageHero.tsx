import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons/Icon";

/** Inner-page header with visible breadcrumbs (pair with breadcrumbSchema). */
export async function PageHero({
  title,
  intro,
  crumbs,
  children,
}: {
  title: string;
  intro?: string;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
}) {
  const t = await getTranslations("common");
  return (
    <section className="relative overflow-hidden bg-cream grain pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-32 size-[28rem] rounded-full bg-mustard/25 blur-3xl" />
      <div className="container-page relative">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-ink-soft">
            <li><Link href="/" className="hover:text-maroon">{t("home")}</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                <Icon name="arrowRight" size={14} className="opacity-50" />
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="font-medium text-ink">{c.name}</span>
                ) : (
                  <Link href={c.path} className="hover:text-maroon">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="max-w-4xl text-[2.6rem] leading-[1.05] font-semibold sm:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-ink-soft sm:text-xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
