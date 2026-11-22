import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig, registrationsVerified } from "@content/site.config";
import { Icon } from "@/components/icons/Icon";
import { GapNote } from "@/components/ui/GapNote";
import { Logo } from "./Logo";
import { LanguageToggle } from "./LanguageToggle";

export async function Footer() {
  const t = await getTranslations();
  const { org, registrations } = siteConfig;

  const cols = [
    {
      title: t("footer.explore"),
      links: [
        ["/programs", t("nav.programs")],
        ["/impact", t("nav.impact")],
        ["/ledger", t("nav.ledger")],
        ["/gallery", t("nav.gallery")],
        ["/stories", t("nav.stories")],
      ],
    },
    {
      title: t("footer.getInvolved"),
      links: [
        ["/donate", t("common.donate")],
        ["/food-rescue", t("nav.foodRescue")],
        ["/volunteer", t("nav.volunteer")],
        ["/partner-with-us", t("nav.partner")],
        ["/request-help", t("nav.requestHelp")],
      ],
    },
    {
      title: t("footer.about"),
      links: [
        ["/about", t("nav.about")],
        ["/transparency", t("nav.transparency")],
        ["/press", t("nav.press")],
        ["/faq", t("nav.faq")],
        ["/contact", t("nav.contact")],
      ],
    },
  ] as const;

  return (
    <footer className="on-dark relative mt-[-1px] bg-ink text-cream">
      {/* soft wave divider */}
      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute -top-[59px] left-0 h-[60px] w-full fill-ink">
        <path d="M0 60V30c120-20 240-30 360-18s240 34 360 30 240-34 360-38 240 14 360 26v30z" />
      </svg>

      <div className="container-page grid gap-12 pt-16 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo label={t("meta.siteName")} sub="Live to Smile Foundation" className="text-cream" />
          <p className="mt-5 max-w-xs font-display text-xl text-mustard">{t("footer.tagline")}</p>

          <address className="mt-6 space-y-2 text-sm not-italic text-cream/80">
            {org.address && (
              <p>
                {org.address.street}, {org.address.locality}, {org.address.district}, {org.address.region} {org.address.postalCode}
              </p>
            )}
            {org.phone && (
              <p><a className="hover:text-mustard" href={`tel:${org.phone}`}>{org.phone}</a></p>
            )}
            {org.email && (
              <p><a className="hover:text-mustard" href={`mailto:${org.email}`}>{org.email}</a></p>
            )}
          </address>
          {!org.address && !org.phone && !org.email && (
            <GapNote className="mt-4">Address, phone and email for the footer.</GapNote>
          )}

          <p className="mt-6 text-sm font-semibold">{t("footer.follow")}</p>
          <ul className="mt-3 flex gap-2">
            {[
              { href: org.socials.instagram, icon: "instagram", label: "Instagram" },
              { href: org.socials.x, icon: "x", label: "X (Twitter)" },
              { href: org.socials.website, icon: "globe", label: "ltsfoundation.in" },
            ].map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-mustard hover:text-mustard"
                >
                  <Icon name={s.icon as "instagram"} size={20} />
                  <span className="sr-only">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-mustard">{col.title}</h2>
            <ul className="mt-4 space-y-1">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-11 items-center text-cream/85 transition-colors hover:text-mustard">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {registrationsVerified && (
        <div className="container-page border-t border-cream/10 py-6 text-xs text-cream/70">
          <p className="font-semibold text-cream/90">{t("footer.registrations")}</p>
          <p className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            <span>NITI Aayog: {registrations.niti}</span>
            <span>12A: {registrations.twelveA}</span>
            <span>80G: {registrations.eightyG}</span>
            <span>CSR-1: {registrations.csr1}</span>
          </p>
        </div>
      )}

      <div className="container-page flex flex-col gap-4 border-t border-cream/10 py-6 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:text-mustard">{t("nav.privacy")}</Link>
          <Link href="/terms" className="hover:text-mustard">{t("nav.terms")}</Link>
          <span>{t("footer.credit")}</span>
          <LanguageToggle className="text-cream" />
        </div>
      </div>
    </footer>
  );
}
