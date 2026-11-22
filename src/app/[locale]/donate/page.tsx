import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { Icon } from "@/components/icons/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { DonateWhatsAppForm } from "@/sections/DonateWhatsAppForm";

type Props = { params: Promise<{ locale: string }> };

function PaymentDetail({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "min-w-0 sm:col-span-2" : "min-w-0"}>
      <dt className="text-xs font-medium text-ink-soft">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-ink">{value}</dd>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const donate = await getTranslations({ locale, namespace: "donate" });

  return buildMetadata({
    locale,
    path: "/donate",
    title: donate("pageTitle"),
    description: donate("pageIntro"),
    absoluteTitle: true,
  });
}

export default async function DonatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const donate = await getTranslations("donate");
  const crumbs = [{ name: donate("label"), path: "/donate" }];

  return (
    <>
      <PageHero title={donate("pageTitle")} intro={donate("pageIntro")} crumbs={crumbs} />

      <section className="container-page grid gap-8 py-12 pb-20 lg:grid-cols-[1fr_0.95fr] lg:items-start">
        <div className="space-y-4">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.12em] text-maroon">{donate("encouragementLabel")}</p>
          <Reveal delay={0.05} className="rounded-2xl bg-cream-deep p-5 text-xl font-semibold text-ink sm:p-6 sm:text-2xl">
            {donate("lineOne")}
          </Reveal>
          <Reveal delay={0.15} className="rounded-2xl bg-white p-5 text-xl font-semibold text-ink shadow-[var(--shadow-card)] ring-1 ring-ink/8 sm:p-6 sm:text-2xl">
            {donate("lineTwo")}
          </Reveal>
          <Reveal delay={0.25} className="rounded-2xl bg-maroon p-5 text-xl font-semibold text-cream shadow-[var(--shadow-card)] sm:p-6 sm:text-2xl">
            {donate("lineThree")}
          </Reveal>
        </div>

        <Reveal delay={0.15} className="rounded-[var(--radius-card)] bg-white p-6 shadow-[var(--shadow-card)] ring-1 ring-ink/8 sm:p-8">
          <DonateWhatsAppForm whatsapp={siteConfig.org.whatsapp} />
        </Reveal>
      </section>

      <section className="container-page pb-20" aria-labelledby="direct-donation-heading">
        <Reveal className="rounded-[var(--radius-card)] bg-cream-deep p-5 sm:p-8 lg:p-10">
          <div className="mb-7 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-maroon">{donate("directSectionEyebrow")}</p>
            <h2 id="direct-donation-heading" className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
              {donate("directSectionTitle")}
            </h2>
            <p className="mt-3 text-ink-soft">{donate("directSectionIntro")}</p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.8fr)]">
              <article className="min-w-0 rounded-2xl bg-white p-5 shadow-[var(--shadow-card)] ring-1 ring-ink/8 sm:p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{donate("bankDetailsTitle")}</h3>
                <dl className="mt-5 grid min-w-0 grid-cols-2 gap-x-4 gap-y-5">
                  <PaymentDetail label={donate("accountName")} value={siteConfig.donation.directPayment.accountName} wide />
                  <PaymentDetail label={donate("accountNumber")} value={siteConfig.donation.directPayment.accountNumber} />
                  <PaymentDetail label={donate("customerId")} value={siteConfig.donation.directPayment.customerId} />
                  <PaymentDetail label={donate("branch")} value={siteConfig.donation.directPayment.branch} />
                  <PaymentDetail label={donate("ifsc")} value={siteConfig.donation.directPayment.ifsc} />
                </dl>
              </article>

              <article className="flex min-w-0 flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[var(--shadow-card)] ring-1 ring-ink/8 sm:p-6">
                <h3 className="font-display text-xl font-semibold text-ink">{donate("upiTitle")}</h3>
                <p className="mt-2 text-sm text-ink-soft">{donate("gpayNumber")}: <span className="font-semibold text-ink">{siteConfig.donation.directPayment.gpayNumber}</span></p>
                <div className="mt-4 w-full rounded-xl bg-cream-deep p-2">
                  <Image
                    src={siteConfig.donation.directPayment.qrImage}
                    alt={donate("qrAlt")}
                    width={283}
                    height={301}
                    unoptimized
                    loading="eager"
                    className="mx-auto h-auto w-full max-w-[283px]"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
                <p className="mt-3 text-sm font-medium text-ink-soft">{donate("scanQr")}</p>
              </article>
            </div>

            <aside className="flex min-w-0 flex-col justify-between rounded-2xl bg-maroon p-6 text-cream shadow-[var(--shadow-card)] sm:p-7">
              <div>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-cream/15">
                  <Icon name="book" size={24} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold">{donate("brochureTitle")}</h3>
                <p className="mt-2 text-cream/80">{donate("brochureIntro")}</p>
                <p className="mt-5 text-sm text-cream/75">{donate("directPaymentNote")}</p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={siteConfig.donation.directPayment.brochure}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-cream/50 px-4 font-semibold transition-colors hover:bg-cream/10"
                >
                  {donate("viewBrochure")}
                  <Icon name="book" size={17} />
                </a>
                <a
                  href={siteConfig.donation.directPayment.brochure}
                  download="hunger-free-kasaragod-brochure.pdf"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cream px-4 font-semibold text-maroon transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  {donate("downloadBrochure")}
                  <Icon name="download" size={17} />
                </a>
              </div>
            </aside>
          </div>
        </Reveal>
      </section>

      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
