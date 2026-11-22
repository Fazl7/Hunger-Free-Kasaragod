import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { Icon } from "@/components/icons/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const nav = await getTranslations({ locale, namespace: "nav" });
  const contact = await getTranslations({ locale, namespace: "contact" });

  return buildMetadata({
    locale,
    path: "/contact",
    title: `${nav("contact")} | ${siteConfig.org.name}`,
    description: contact("intro"),
    absoluteTitle: true,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const contact = await getTranslations("contact");
  const { org } = siteConfig;
  const crumbs = [{ name: nav("contact"), path: "/contact" }];

  return (
    <>
      <PageHero title={nav("contact")} intro={contact("intro")} crumbs={crumbs} />

      <section className="container-page grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4" aria-label={contact("contactOptions")}>
        <a
          href={`mailto:${org.email}`}
          className="group rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/8 transition-shadow hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
        >
          <Icon name="share" size={28} className="text-maroon" />
          <h2 className="mt-4 text-lg font-semibold text-ink">{contact("email")}</h2>
          <p className="mt-2 break-all text-ink-soft group-hover:text-maroon">{org.email}</p>
        </a>

        <a
          href={`tel:${org.phone}`}
          className="group rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/8 transition-shadow hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
        >
          <Icon name="phone" size={28} className="text-maroon" />
          <h2 className="mt-4 text-lg font-semibold text-ink">{contact("phone")}</h2>
          <p className="mt-2 text-ink-soft group-hover:text-maroon" dir="ltr">{org.phone}</p>
        </a>

        <a
          href={`https://wa.me/${org.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/8 transition-shadow hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
        >
          <Icon name="whatsapp" size={28} className="text-maroon" />
          <h2 className="mt-4 text-lg font-semibold text-ink">{contact("whatsapp")}</h2>
          <p className="mt-2 text-ink-soft group-hover:text-maroon" dir="ltr">{org.phone}</p>
        </a>

        <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/8">
          <Icon name="pin" size={28} className="text-maroon" />
          <h2 className="mt-4 text-lg font-semibold text-ink">{contact("address")}</h2>
          <address className="mt-2 space-y-1 not-italic text-ink-soft">
            <p>{org.address.street}</p>
            <p>{org.address.locality}</p>
            <p>{org.address.district}, {org.address.region} {org.address.postalCode}</p>
          </address>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[var(--radius-card)] bg-cream-dark p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-ink">{contact("rescueHeading")}</h2>
            <p className="mt-2 text-ink-soft">{contact("rescueBody")}</p>
          </div>
          <ButtonLink href="/food-rescue" icon="arrowRight" className="shrink-0">
            {contact("rescueLink")}
          </ButtonLink>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
