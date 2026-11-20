import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@content/site.config";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/icons/Icon";
import { MapPins } from "./MapPins";
import { tr } from "@/lib/utils";

/**
 * S10. Service map: a lightweight SVG (no map library, no tiles) with pins
 * placed from real town-centre coordinates, plus a text list alternative.
 */
export async function ServiceMap() {
  const t = await getTranslations("map");
  const locale = await getLocale();
  const kinds = { hub: t("hub"), area: t("area"), relief: t("relief") } as const;

  const pins = siteConfig.places.map((p) => ({
    id: p.id,
    name: tr(p.name, locale),
    kind: p.kind as keyof typeof kinds,
    kindLabel: kinds[p.kind as keyof typeof kinds],
    lat: p.lat,
    lng: p.lng,
  }));

  return (
    <Section id="map" tone="navy" labelledBy="map-title" className="overflow-hidden">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading id="map-title" label={t("label")} title={t("heading")} dark className="mb-8" />
          <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-mustard">{t("listHeading")}</h3>
          <ul className="mt-4 space-y-3">
            {pins.map((p) => (
              <li key={p.id} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-1.5 size-3 shrink-0 rounded-full ${p.kind === "hub" ? "bg-mustard" : p.kind === "area" ? "bg-cream" : "bg-[#F28A05]"}`}
                />
                <span>
                  <span className="font-semibold">{p.name}</span>
                  <span className="block text-sm text-cream/75">{p.kindLabel}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <Reveal variant="scale">
          <MapPins pins={pins} seaLabel={t("sea")} />
          <p className="mt-3 flex items-center gap-1.5 text-xs text-cream/60">
            <Icon name="pin" size={14} /> {t("caption")}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
