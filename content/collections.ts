import type { I18n } from "./site.config";

/**
 * Editable collections. All are EMPTY until the foundation supplies real,
 * dated, consented records. Never add sample data here: it would be published.
 * (A CMS such as Sanity can replace these arrays in Phase 3 without touching components.)
 */

export type Media = {
  src: string;
  alt: I18n;
  caption?: I18n;
  type: "image" | "video";
  poster?: string;
  width: number;
  height: number;
  place?: string;
  date?: string;
  program?: string;
  /** Faces may only be shown when consent is recorded. Entries without consent are never rendered. */
  consent: boolean;
  credit?: string;
};

export type LedgerEntry = {
  id: string;
  date: string; // ISO
  place: string; // matches siteConfig.places[].id where possible
  program: string; // program slug
  quantity: number;
  unit: "meals" | "kits" | "blankets" | "kg";
  beneficiariesApprox?: number;
  note?: I18n;
  photos?: Media[];
  verified: boolean;
};

export type DocumentItem = {
  id: string;
  title: I18n;
  category: "press" | "legal" | "report" | "media-kit" | "policy";
  date: string;
  file: string;
  sizeKB: number;
  lang: "en" | "ml" | "both";
  verified: boolean;
};

export type StoryChapter = { title: I18n; body: I18n; media?: Media; year?: number };

export type Story = {
  slug: string;
  title: I18n;
  excerpt: I18n;
  author?: string;
  date: string;
  cover?: Media;
  programs: string[];
  consentOnFile: boolean;
};

export const ledger: LedgerEntry[] = [];
export const gallery: Media[] = [];
export const documents: DocumentItem[] = [];
export const stories: Story[] = [];
/** "Our Story" chapters (why we started → first distribution → growth → today). */
export const storyChapters: StoryChapter[] = [];

export const publishableGallery = () => gallery.filter((m) => m.consent);
export const publishableStories = () => stories.filter((s) => s.consentOnFile);
export const publishableDocuments = () => documents.filter((d) => d.verified);
export const latestLedger = (n: number) =>
  [...ledger].filter((e) => e.verified).sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
