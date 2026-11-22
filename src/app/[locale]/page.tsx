import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { donateActionSchema, graph } from "@/lib/schema";
import { Hero } from "@/sections/Hero";
import { NumbersStrip } from "@/sections/NumbersStrip";
import { Intro } from "@/sections/Intro";
import { OurStory } from "@/sections/OurStory";
import { DayWithUs } from "@/sections/DayWithUs";
import { ProgramsShowcase } from "@/sections/ProgramsShowcase";
import { GallerySection } from "@/sections/GallerySection";
import { LedgerPreview } from "@/sections/LedgerPreview";
import { ServiceMap } from "@/sections/ServiceMap";
import { ShareMoment } from "@/sections/ShareMoment";
import { StoriesSection } from "@/sections/StoriesSection";
import { TrustSection } from "@/sections/TrustSection";
import { PressSection } from "@/sections/PressSection";
import { LatestVideos } from "@/sections/LatestVideos";
import { FaqSection } from "@/sections/FaqSection";
import { FinalCta } from "@/sections/FinalCta";

type Props = { params: Promise<{ locale: string }> };

// Live sections (counters, videos, press) refresh on demand; this is the fallback window.
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/", title: t("homeTitle"), description: t("homeDescription"), absoluteTitle: true });
}

/** Home: the hunger statement leads, followed by proof, the three pathways and stories. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <NumbersStrip />
      <Intro />
      <ProgramsShowcase />
      <OurStory />
      <DayWithUs />
      <GallerySection />
      <LatestVideos />
      <LedgerPreview />
      <ServiceMap />
      <ShareMoment />
      <StoriesSection />
      <TrustSection />
      <PressSection />
      <FaqSection />
      <FinalCta />
      <JsonLd data={graph(donateActionSchema(locale))} />
    </>
  );
}
