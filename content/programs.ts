import type { I18n } from "./site.config";

/** The three food pathways at the heart of Hunger Free Kasaragod. */
export type ProgramTone = "maroon" | "navy" | "purple" | "mustard" | "leaf";
export type IconName = "plate" | "kit" | "phone" | "van" | "heart" | "book" | "store" | "blanket" | "relief" | "fridge" | "spoon";

export type Program = {
  slug: string;
  order: number;
  tone: ProgramTone;
  icon: IconName;
  name: I18n;
  summary: I18n;
  body: I18n[];
  areas: I18n;
  howItWorks?: I18n[];
  stat?: { value: number; label: I18n };
  needsNativeReview: boolean;
};

export const programs: Program[] = [
  {
    slug: "daily-food",
    order: 3,
    tone: "maroon",
    icon: "plate",
    name: { en: "Cooked Breakfasts and Lunches", ml: "പാകം ചെയ്ത പ്രഭാതഭക്ഷണവും ഉച്ചഭക്ഷണവും" },
    summary: {
      en: "Freshly cooked breakfast and lunch for neighbours experiencing hunger, served with care and dignity.",
      ml: "വിശപ്പ് അനുഭവിക്കുന്ന അയൽക്കാർക്ക് കരുതലോടെയും അന്തസ്സോടെയും പുതുതായി പാകം ചെയ്ത പ്രഭാതഭക്ഷണവും ഉച്ചഭക്ഷണവും.",
    },
    body: [
      {
        en: "We prepare and serve cooked food, including breakfast and lunch, to people who may otherwise go without a proper meal. Volunteers bring food directly to people across Kasaragod district.",
        ml: "ശരിയായ ഭക്ഷണം ലഭിക്കാതെ പോകാൻ സാധ്യതയുള്ളവർക്ക് പ്രഭാതഭക്ഷണവും ഉച്ചഭക്ഷണവും ഉൾപ്പെടെ പാകം ചെയ്ത ഭക്ഷണം ഞങ്ങൾ തയ്യാറാക്കി വിളമ്പുന്നു. കാസർഗോഡ് ജില്ലയിലുടനീളം വളണ്ടിയർമാർ ഭക്ഷണം നേരിട്ട് എത്തിക്കുന്നു.",
      },
    ],
    areas: { en: "Kasaragod district", ml: "കാസർഗോഡ് ജില്ല" },
    howItWorks: [
      { en: "Cook fresh food.", ml: "പുതിയ ഭക്ഷണം പാകം ചെയ്യുക." },
      { en: "Pack and carry it safely.", ml: "സുരക്ഷിതമായി പായ്ക്ക് ചെയ്ത് എത്തിക്കുക." },
      { en: "Serve people with dignity.", ml: "അന്തസ്സോടെ ഭക്ഷണം വിളമ്പുക." },
    ],
    needsNativeReview: true,
  },
  {
    slug: "100-kit-month",
    order: 1,
    tone: "mustard",
    icon: "kit",
    name: { en: "Monthly Grocery Kits", ml: "പ്രതിമാസ പലചരക്ക് കിറ്റുകൾ" },
    summary: {
      en: "Our monthly goal is to provide 100 essential grocery kits to households facing food insecurity.",
      ml: "ഭക്ഷ്യപ്രതിസന്ധി നേരിടുന്ന കുടുംബങ്ങൾക്ക് ഓരോ മാസവും 100 അവശ്യ പലചരക്ക് കിറ്റുകൾ നൽകുകയാണ് ഞങ്ങളുടെ ലക്ഷ്യം.",
    },
    body: [
      {
        en: "We work toward a target of 100 essential grocery kits each month. The figure is a goal, not a claim that 100 kits have already been delivered every month.",
        ml: "ഓരോ മാസവും 100 അവശ്യ പലചരക്ക് കിറ്റുകൾ നൽകുക എന്നതാണ് ഞങ്ങളുടെ ലക്ഷ്യം. ഇത് ലക്ഷ്യമാണ്; ഓരോ മാസവും 100 കിറ്റുകൾ ഇതിനകം വിതരണം ചെയ്തു എന്ന അവകാശവാദമല്ല.",
      },
    ],
    areas: { en: "Across Kasaragod district", ml: "കാസർഗോഡ് ജില്ലയിലുടനീളം" },
    stat: { value: 100, label: { en: "kits: monthly target", ml: "കിറ്റുകൾ: പ്രതിമാസ ലക്ഷ്യം" } },
    needsNativeReview: true,
  },
  {
    slug: "celebrating-together",
    order: 2,
    tone: "purple",
    icon: "van",
    name: { en: "Surplus Food Rescue", ml: "മിച്ചഭക്ഷണ ശേഖരണവും വിതരണവും" },
    summary: {
      en: "We collect safe, untouched surplus food from events and get it to people who need a meal.",
      ml: "പരിപാടികളിൽ ബാക്കിയാകുന്ന സുരക്ഷിതവും വിളമ്പാത്തതുമായ ഭക്ഷണം ശേഖരിച്ച് ആവശ്യമുള്ളവരിലേക്ക് എത്തിക്കുന്നു.",
    },
    body: [
      {
        en: "When an event has safe, unserved food left over, our team helps collect it, pack it carefully and deliver it to people who need it. This turns avoidable waste into a timely meal.",
        ml: "ഒരു പരിപാടിയിൽ സുരക്ഷിതവും വിളമ്പാത്തതുമായ ഭക്ഷണം ബാക്കിയുണ്ടെങ്കിൽ, ഞങ്ങളുടെ സംഘം അത് ശേഖരിച്ച് ശ്രദ്ധയോടെ പായ്ക്ക് ചെയ്ത് ആവശ്യമുള്ളവരിലേക്ക് എത്തിക്കുന്നു. ഇതിലൂടെ പാഴാകുമായിരുന്ന ഭക്ഷണം സമയോചിതമായ ഭക്ഷണമാകുന്നു.",
      },
    ],
    areas: { en: "Across Kasaragod district", ml: "കാസർഗോഡ് ജില്ലയിലുടനീളം" },
    howItWorks: [
      { en: "Collect safe, unserved food.", ml: "സുരക്ഷിതവും വിളമ്പാത്തതുമായ ഭക്ഷണം ശേഖരിക്കുക." },
      { en: "Pack it carefully.", ml: "ശ്രദ്ധയോടെ പായ്ക്ക് ചെയ്യുക." },
      { en: "Deliver it promptly.", ml: "വേഗത്തിൽ വിതരണം ചെയ്യുക." },
    ],
    needsNativeReview: true,
  },
];

/** Other Live to Smile Foundation initiatives; these are not core food pathways. */
export const otherInitiatives: I18n[] = [
  { en: "Food On Call", ml: "ഫുഡ് ഓൺ കോൾ" },
  { en: "Smile and Care", ml: "സ്മൈൽ ആൻഡ് കെയർ" },
  { en: "Education Support", ml: "വിദ്യാഭ്യാസ സഹായം" },
  { en: "I Lead Store", ml: "ഐ ലീഡ് സ്റ്റോർ" },
  { en: "Blanket Distribution", ml: "പുതപ്പ് വിതരണം" },
  { en: "Wayanad Relief", ml: "വയനാട് ദുരിതാശ്വാസം" },
];

export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);
