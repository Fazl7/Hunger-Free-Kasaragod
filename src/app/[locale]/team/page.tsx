import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/ui/PageHero";

type Props = { params: Promise<{ locale: string }> };

const members = [
  { name: "Nirmal Kumar", role: "chairman", image: "/team/nirmal-kumar.jpg", width: 768, height: 774, position: "center 35%" },
  { name: "Ahmmed Shareen", role: "managingTrustee", image: "/team/ahmmed-shareen.jpg", width: 922, height: 768, position: "center 42%" },
  { name: "Irfad Mayippady", role: "communityOutreach", image: "/team/irfad-mayippady.jpg", width: 768, height: 768, position: "center 35%" },
  { name: "Vipin Lal", role: "fieldCoordinator", image: "/team/vipin-lal-portrait.jpg", width: 768, height: 1327, position: "center 35%" },
  { name: "Charuseetha Meloth", role: "programAdvisor", image: "/team/charuseetha-meloth.jpg", width: 768, height: 1024, position: "center 30%" },
  { name: "Abdul Rahman Murshid", role: "logisticsRelief", image: "/team/abdul-rahman-murshid-portrait.jpg", width: 544, height: 1350, position: "center 30%" },
  { name: "Anaswara K V", role: "intern", image: "/team/anaswara-k-v.jpg", width: 768, height: 768, position: "center 35%" },
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/team",
    title: t("teamTitle"),
    description: t("teamDescription"),
    absoluteTitle: true,
  });
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const nav = await getTranslations("nav");
  const crumbs = [{ name: nav("team"), path: "/team" }];

  return (
    <>
      <PageHero title={t("pageTitle")} intro={t("intro")} crumbs={crumbs}>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-maroon/15 bg-white/70 px-4 py-2 text-sm font-medium text-maroon">
          <span aria-hidden="true" className="size-2 rounded-full bg-mustard" />
          {t("eyebrow")}
        </p>
      </PageHero>

      <section aria-labelledby="team-members-heading" className="relative overflow-hidden bg-cream-deep/45 py-16 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-mustard/15 blur-3xl" />
        <div className="container-page relative">
          <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-maroon">{t("sectionEyebrow")}</p>
            <h2 id="team-members-heading" className="mt-3 text-3xl font-semibold sm:text-4xl">{t("sectionTitle")}</h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((member, index) => (
              <li
                key={member.name}
                className="group overflow-hidden rounded-[var(--radius-card)] bg-white shadow-sm ring-1 ring-ink/8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <div className="relative overflow-hidden bg-cream-deep">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={member.width}
                    height={member.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:aspect-[5/4]"
                    style={{ objectPosition: member.position }}
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/25 to-transparent" />
                </div>
                <div className="p-6 sm:p-7">
                  <span className="inline-flex rounded-full bg-mustard/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-maroon">
                    {t(`roles.${member.role}`)}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold">{member.name}</h3>
                </div>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-12 max-w-3xl text-center font-display text-xl leading-relaxed text-ink-soft sm:mt-16 sm:text-2xl">
            {t("closing")}
          </p>
        </div>
      </section>

      <JsonLd data={graph(breadcrumbSchema(locale, [{ name: "Home", path: "/" }, ...crumbs]))} />
    </>
  );
}
