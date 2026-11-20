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
import { CelebratingTogether } from "@/sections/CelebratingTogether";
import { GallerySection } from "@/sections/GallerySection";
import { LedgerPreview } from "@/sections/LedgerPreview";
import { ServiceMap } from "@/sections/ServiceMap";
import { MakeAnImpact } from "@/sections/MakeAnImpact";
import { DonateTiers } from "@/sections/DonateTiers";
import { ShareMoment } from "@/sections/ShareMoment";
import { StoriesSection } from "@/sections/StoriesSection";
import { TrustSection } from "@/sections/TrustSection";
import { ResourcesSection } from "@/sections/ResourcesSection";
import { FaqSection } from "@/sections/FaqSection";
import { FinalCta } from "@/sections/FinalCta";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, path: "/", title: t("homeTitle"), description: t("homeDescription"), absoluteTitle: true });
}

/**
 * Home: section order follows the owner's brief: numbers first → intro → story →
 * gallery → quantity/place/date → personal upload → make an impact.
 */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <NumbersStrip />
      <Intro />
      <OurStory />
      <DayWithUs />
      <ProgramsShowcase />
      <CelebratingTogether />
      <GallerySection />
      <LedgerPreview />
      <ServiceMap />
      <MakeAnImpact />
      <DonateTiers />
      <ShareMoment />
      <StoriesSection />
      <TrustSection />
      <ResourcesSection />
      <FaqSection />
      <FinalCta />
      <JsonLd data={graph(donateActionSchema(locale))} />
    </>
  );
}
