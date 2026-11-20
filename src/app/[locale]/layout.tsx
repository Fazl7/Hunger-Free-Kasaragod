import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fraunces, poppins, notoMalayalam } from "@/lib/fonts";
import { siteConfig, registrationsVerified } from "@content/site.config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#7A1F1F",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: { default: t("homeTitle"), template: `%s | ${t("siteName")}` },
    applicationName: t("siteName"),
    authors: [{ name: siteConfig.org.name }],
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <html
      lang={locale}
      dir="ltr"
      className={cn(fraunces.variable, poppins.variable, notoMalayalam.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* Enables JS-only enhancements (reveal hidden state) before first paint; no-JS users see everything. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-maroon px-5 py-3 font-semibold text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t("common.skip")}
        </a>
        <NextIntlClientProvider>
          <Header trustBar={registrationsVerified ? t("trustBar") : null} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <RevealObserver />
        </NextIntlClientProvider>
        <JsonLd data={graph(organizationSchema(), websiteSchema(locale))} />
      </body>
    </html>
  );
}
