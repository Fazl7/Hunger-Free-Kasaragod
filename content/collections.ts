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
export const storyChapters: StoryChapter[] = [
  {
    title: { en: "Why We Started", ml: "തുടക്കം കുറിച്ചത് എന്തിന്" },
    year: 2022,
    body: {
      en: "Established in September 2022 in Udma, Kasaragod, Live to Smile Foundation began with a grassroots commitment to community mental health, education and human dignity. While working with vulnerable groups, psychologist and social entrepreneur Ahammed Shareen, alongside co-directors Irfad Mayippadi and Abdul Rahman Erol, saw abandoned elders, stranded daily-wage workers and families going hungry. They recognised that well-being and dignity also depend on reliable nourishment.",
      ml: "2022 സെപ്റ്റംബറിൽ കാസർഗോഡ് ഉദുമയിൽ സ്ഥാപിതമായ ലിവ് ടു സ്മൈൽ ഫൗണ്ടേഷൻ സമൂഹ മാനസികാരോഗ്യം, വിദ്യാഭ്യാസം, മനുഷ്യാന്തസ്സ് എന്നിവയ്ക്കായി അടിത്തട്ടിൽ പ്രവർത്തനം തുടങ്ങി. ദുർബല വിഭാഗങ്ങളോടൊപ്പം പ്രവർത്തിക്കുമ്പോൾ മനഃശാസ്ത്രജ്ഞനും സാമൂഹിക സംരംഭകനുമായ അഹമ്മദ് ഷരീനും സഹഡയറക്ടർമാരായ ഇർഫാദ് മായിപ്പാടിയും അബ്ദുൽ റഹ്മാൻ എറോളും ഉപേക്ഷിക്കപ്പെട്ട വയോധികരെയും വഴിയിലകപ്പെട്ട ദിവസവേതന തൊഴിലാളികളെയും വിശപ്പനുഭവിക്കുന്ന കുടുംബങ്ങളെയും കണ്ടു. ക്ഷേമത്തിനും അന്തസ്സിനും വിശ്വസനീയമായ പോഷണവും ആവശ്യമാണെന്ന് അവർ തിരിച്ചറിഞ്ഞു.",
    },
  },
  {
    title: { en: "First Distribution", ml: "ആദ്യ ഭക്ഷണ വിതരണം" },
    year: 2025,
    body: {
      en: "On 25 October 2025, Hunger Free Kasaragod began as a once-a-week morning breakfast initiative. Volunteers carried freshly packed warm meals through Kasaragod town and quickly saw how many street dwellers and older people relied on that single meal—and how urgently steady support was needed.",
      ml: "2025 ഒക്ടോബർ 25-ന് ആഴ്ചയിൽ ഒരിക്കൽ പ്രഭാതഭക്ഷണം നൽകുന്ന സംരംഭമായി ഹംഗർ ഫ്രീ കാസർഗോഡ് ആരംഭിച്ചു. കാസർഗോഡ് പട്ടണത്തിലൂടെ പുതുതായി പായ്ക്ക് ചെയ്ത ചൂടുള്ള ഭക്ഷണം എത്തിച്ച വളണ്ടിയർമാർ തെരുവിൽ കഴിയുന്നവരും വയോധികരുമായ നിരവധി പേർ ആ ഒരൊറ്റ ഭക്ഷണത്തെ ആശ്രയിക്കുന്നതായി കണ്ടു. സ്ഥിരമായ സഹായം എത്ര അടിയന്തരമാണെന്നും അവർ തിരിച്ചറിഞ്ഞു.",
    },
  },
  {
    title: { en: "Growth and Civic Partnerships", ml: "വളർച്ചയും സാമൂഹിക പങ്കാളിത്തങ്ങളും" },
    year: 2026,
    body: {
      en: "Community support helped the weekly drive grow into a six-day-a-week operation. Kasaragod Municipality allocated operational space at Theruvath Ubaid Park, and Aster MIMS Foundation and local social entrepreneurs supported the breakfast service. On 1 November 2026, with support from The LaLiT Resort & Spa Bekal, daily lunch distribution began, extending the work across Kasaragod, Kanhangad, Thrikkaripur and Cherkala.",
      ml: "സമൂഹത്തിന്റെ പിന്തുണയോടെ ആഴ്ചയിലെ ഒരു ദിവസത്തെ പ്രവർത്തനം ആഴ്ചയിൽ ആറു ദിവസമായി വളർന്നു. കാസർഗോഡ് നഗരസഭ തെരുവത്ത് ഉബൈദ് പാർക്കിൽ പ്രവർത്തനത്തിനായി സ്ഥലം അനുവദിച്ചു; ആസ്റ്റർ മിംസ് ഫൗണ്ടേഷനും പ്രാദേശിക സാമൂഹിക സംരംഭകരും പ്രഭാതഭക്ഷണ പ്രവർത്തനത്തെ പിന്തുണച്ചു. 2026 നവംബർ 1-ന് ദി ലളിത് റിസോർട്ട് & സ്പാ ബേക്കലിന്റെ പിന്തുണയോടെ ദിവസേനയുള്ള ഉച്ചഭക്ഷണ വിതരണം ആരംഭിച്ചു. കാസർഗോഡ്, കാഞ്ഞങ്ങാട്, തൃക്കരിപ്പൂർ, ചെർക്കള എന്നിവിടങ്ങളിലേക്കും പ്രവർത്തനം വ്യാപിച്ചു.",
    },
  },
  {
    title: { en: "Where We Stand Today", ml: "ഇന്നത്തെ പ്രവർത്തനം" },
    year: 2026,
    body: {
      en: "Hunger Free Kasaragod now serves 50 freshly cooked breakfasts and 80 lunches on each of its six service days, alongside monthly dry-grocery ration kits for families and rapid-response food rescue from local events. Aligned with UN Sustainable Development Goal 2 (Zero Hunger), the open Distribution Ledger records the work as the foundation continues toward a hunger-free northern Kerala.",
      ml: "ആഴ്ചയിലെ ആറു പ്രവർത്തിദിവസങ്ങളിലും ഹംഗർ ഫ്രീ കാസർഗോഡ് പുതുതായി പാകം ചെയ്ത 50 പ്രഭാതഭക്ഷണങ്ങളും 80 ഉച്ചഭക്ഷണങ്ങളും നൽകുന്നു. കുടുംബങ്ങൾക്കായി പ്രതിമാസ ഡ്രൈ-ഗ്രോസറി റേഷൻ കിറ്റുകളും പ്രാദേശിക പരിപാടികളിൽ നിന്നുള്ള മിച്ചഭക്ഷണത്തിന്റെ വേഗത്തിലുള്ള ശേഖരണവും ഇതോടൊപ്പം നടക്കുന്നു. ഐക്യരാഷ്ട്രസഭയുടെ സുസ്ഥിര വികസന ലക്ഷ്യം 2 (വിശപ്പില്ലായ്മ) അനുസരിച്ച്, വടക്കൻ കേരളത്തെ വിശപ്പില്ലാത്തതാക്കാനുള്ള പ്രവർത്തനങ്ങൾ തുറന്ന വിതരണ രേഖയിൽ രേഖപ്പെടുത്തുന്നു.",
    },
  },
];

export const publishableGallery = () => gallery.filter((m) => m.consent);
export const publishableStories = () => stories.filter((s) => s.consentOnFile);
export const publishableDocuments = () => documents.filter((d) => d.verified);
export const latestLedger = (n: number) =>
  [...ledger].filter((e) => e.verified).sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
