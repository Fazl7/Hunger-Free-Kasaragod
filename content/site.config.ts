/**
 * SINGLE SOURCE OF TRUTH for every number, ID, price, contact and feature flag.
 *
 * Rules (from the build spec):
 *  - Never invent values. Unknowns are `null` and are listed in CONTENT_GAPS.md.
 *  - A `null` value hides the UI that depends on it in production, and renders a
 *    clearly marked "content gap" placeholder in development.
 *  - Components read from here; owners edit only this file to change numbers.
 */

export type I18n = { en: string; ml: string };

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ltsfoundation.in",

  org: {
    name: "Live to Smile Foundation",
    alternateName: "LTS Foundation",
    brand: "Hunger Free Kasaragod",
    address: {
      street: "Live to Smile Foundation Trust",
      locality: "Udma PO, Udma",
      district: "Kasaragod",
      region: "Kerala",
      postalCode: "671319",
      country: "IN" as const,
    },
    phone: "+919778600529",
    whatsapp: "919778600529",
    email: "livetosmilefoundation@gmail.com",
    foundingYear: 2022,
    openingHours: null as string | null,
    socials: {
      x: "https://x.com/LTS_Foundation",
      instagram: "https://www.instagram.com/live_to_smile_foundation",
      website: "https://www.ltsfoundation.in",
    },
  },

  /** The foundation owner confirmed these IDs for public display. */
  registrations: {
    niti: "KL/2023/0346346",
    twelveA: "AACTL2843C25KC01",
    eightyG: "AACTL2843C25KC02",
    csr1: "CSR00104723",
    fcra: null as string | null,
    verifiedOn: "2026-11-22",
  },

  award: {
    title: {
      en: "Partnership Award from the District Collector, Kasaragod",
      ml: "കാസർഗോഡ് ജില്ലാ കലക്ടറിൽ നിന്നുള്ള പങ്കാളിത്ത പുരസ്കാരം",
    } satisfies I18n,
    presentedBy: "Shri Imbashekhar IAS, District Collector, Kasaragod",
    /** GAP: confirm event name ("Accelerate Action"?) and date. */
    eventName: null as string | null,
    date: null as string | null,
  },

  impact: {
    /** Monthly kit goal; not a claim that this many kits have already been delivered. */
    monthlyKitTarget: 100,
    mealsServed: null as number | null,
    householdsReached: null as number | null,
    foodRescuedKg: null as number | null,
    yearsActive: null as number | null,
    updatedOn: null as string | null,
  },

  donation: {
    currency: "INR" as const,
    tiers: [
      { id: "day", label: { en: "Feed for 1 Day", ml: "ഒരു ദിവസത്തെ ഭക്ഷണം" }, amountINR: null as number | null },
      { id: "tenDays", label: { en: "Feed for 10 Days", ml: "പത്ത് ദിവസത്തെ ഭക്ഷണം" }, amountINR: null as number | null },
      { id: "month", label: { en: "Feed for 1 Month", ml: "ഒരു മാസത്തെ ഭക്ഷണം" }, amountINR: null as number | null },
    ],
    costPerMealINR: null as number | null,
    costPerKitINR: null as number | null,
    allowCustom: true,
    minINR: 1,
    directPayment: {
      accountName: "Live To Smile Foundation Trust",
      accountNumber: "50200111007091",
      customerId: "324779818",
      branch: "Kanhangad",
      ifsc: "HDFC0001526",
      gpayNumber: "9778600529",
      qrImage: "/donate/upi-qr.png",
      brochure: "/donate/brochure.pdf",
    },
  },

  /** GAP: how each rupee is used. Hidden until provided. */
  fundsBreakdown: null as null | { label: I18n; percent: number }[],

  foodRescue: {
    responseTime: {
      en: "Please contact the team at least two hours before your event ends so pickup can be coordinated.",
      ml: "പരിപാടി അവസാനിക്കുന്നതിന് കുറഞ്ഞത് രണ്ട് മണിക്കൂർ മുമ്പ് ടീമിനെ അറിയിക്കുക; പിക്കപ്പ് ക്രമീകരിക്കാൻ ഇത് സഹായിക്കും.",
    } satisfies I18n,
  },

  /** Places named in the brochure. Coordinates are public town centres (approximate). */
  places: [
    { id: "kasaragod", name: { en: "Kasaragod", ml: "കാസർഗോഡ്" }, lat: 12.4996, lng: 74.9869, kind: "hub" },
    { id: "cherkala", name: { en: "Cherkala", ml: "ചെർക്കള" }, lat: 12.5167, lng: 75.0667, kind: "hub" },
    { id: "kanhangad", name: { en: "Kanhangad", ml: "കാഞ്ഞങ്ങാട്" }, lat: 12.3156, lng: 75.0939, kind: "hub" },
    { id: "interiors", name: { en: "Remote interiors", ml: "ഉൾനാടൻ ഗ്രാമങ്ങൾ" }, lat: 12.42, lng: 75.22, kind: "area" },
  ],

  /** Optional hero media. Leave null until a consented 6–10 s loop is supplied. */
  heroMedia: null as null | { mp4: string; webm?: string; poster: string; alt: I18n },

  features: {
    ledger: true,
    uploads: false, // needs Supabase + moderation (Phase 4)
    recurring: false, // needs Razorpay subscriptions (Phase 4)
    foreignDonations: false, // This initiative currently accepts domestic contributions only.
  },
};

/** Show content-gap placeholders? Always in dev; in prod only when explicitly asked. */
export const showGaps =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_CONTENT_GAPS === "true";

export const registrationsVerified = Boolean(siteConfig.registrations.verifiedOn);
