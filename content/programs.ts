import type { I18n } from "./site.config";

/**
 * The 9 programs, in the order the spec requires.
 * All copy is written ONLY from brochure facts. Malayalam is a DRAFT
 * (needsNativeReview) and must be checked by a native speaker before launch.
 */

export type ProgramTone = "maroon" | "navy" | "purple" | "mustard" | "leaf";
export type IconName =
  | "plate" | "kit" | "phone" | "van" | "heart" | "book" | "store" | "blanket" | "relief" | "fridge" | "spoon";

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
    order: 1,
    tone: "maroon",
    icon: "plate",
    name: { en: "Daily Food", ml: "ദിവസേന ഭക്ഷണം" },
    summary: {
      en: "Fresh, warm breakfasts for people living on the streets of Kasaragod, Cherkala and Kanhangad, so every neighbour starts the day with dignity.",
      ml: "കാസർഗോഡ്, ചെർക്കള, കാഞ്ഞങ്ങാട് തെരുവുകളിൽ കഴിയുന്നവർക്ക് ചൂടുള്ള പ്രഭാതഭക്ഷണം, ഓരോ ദിവസവും അന്തസ്സോടെ തുടങ്ങാൻ.",
    },
    body: [
      {
        en: "Every morning, our team serves fresh, warm breakfasts to people living on the streets across Kasaragod, Cherkala and Kanhangad. Alongside the breakfast run, we provide dry ration kits to struggling families in the rural and remote pockets of the district.",
        ml: "എല്ലാ പ്രഭാതത്തിലും കാസർഗോഡ്, ചെർക്കള, കാഞ്ഞങ്ങാട് എന്നിവിടങ്ങളിലെ തെരുവുകളിൽ കഴിയുന്നവർക്ക് ഞങ്ങളുടെ സംഘം ചൂടുള്ള പ്രഭാതഭക്ഷണം വിളമ്പുന്നു. ഒപ്പം ജില്ലയിലെ ഗ്രാമീണ, വിദൂര പ്രദേശങ്ങളിലെ കുടുംബങ്ങൾക്ക് ഡ്രൈ റേഷൻ കിറ്റുകളും നൽകുന്നു.",
      },
    ],
    areas: { en: "Kasaragod, Cherkala, Kanhangad", ml: "കാസർഗോഡ്, ചെർക്കള, കാഞ്ഞങ്ങാട്" },
    howItWorks: [
      { en: "Breakfast is prepared fresh each morning.", ml: "ഓരോ പ്രഭാതത്തിലും ഭക്ഷണം പുതുതായി തയ്യാറാക്കുന്നു." },
      { en: "Volunteers serve it warm on the streets.", ml: "വളണ്ടിയർമാർ തെരുവുകളിൽ ചൂടോടെ വിളമ്പുന്നു." },
      { en: "Families in remote pockets receive dry ration kits.", ml: "വിദൂര പ്രദേശങ്ങളിലെ കുടുംബങ്ങൾക്ക് റേഷൻ കിറ്റുകൾ." },
    ],
    needsNativeReview: true,
  },
  {
    slug: "100-kit-month",
    order: 2,
    tone: "mustard",
    icon: "kit",
    name: { en: "100 Kit / Month", ml: "മാസം 100 കിറ്റ്" },
    summary: {
      en: "Every month, essential grocery kits reach 100 vulnerable households in the remote rural interiors of Kasaragod.",
      ml: "എല്ലാ മാസവും കാസർഗോഡിന്റെ ഉൾനാടൻ ഗ്രാമങ്ങളിലെ 100 കുടുംബങ്ങളിലേക്ക് അവശ്യ പലചരക്ക് കിറ്റുകൾ എത്തുന്നു.",
    },
    body: [
      {
        en: "Each month we deliver essential grocery kits to 100 vulnerable households in the remote rural interiors of Kasaragod, where reaching a market is hard and help rarely arrives.",
        ml: "ചന്തയിലെത്താൻ പ്രയാസമുള്ള, സഹായം അപൂർവമായി മാത്രം എത്തുന്ന കാസർഗോഡിന്റെ ഉൾനാടൻ ഗ്രാമങ്ങളിലെ 100 കുടുംബങ്ങൾക്ക് ഓരോ മാസവും ഞങ്ങൾ അവശ്യ പലചരക്ക് കിറ്റുകൾ എത്തിക്കുന്നു.",
      },
    ],
    areas: { en: "Remote rural Kasaragod", ml: "കാസർഗോഡിന്റെ ഉൾനാടൻ ഗ്രാമങ്ങൾ" },
    stat: { value: 100, label: { en: "households every month", ml: "കുടുംബങ്ങൾ ഓരോ മാസവും" } },
    needsNativeReview: true,
  },
  {
    slug: "food-on-call",
    order: 3,
    tone: "navy",
    icon: "phone",
    name: { en: "Food On Call", ml: "ഫുഡ് ഓൺ കോൾ" },
    summary: {
      en: "A lifeline for isolated villages in Kasaragod's interiors, where distance should never stand between a family and a meal.",
      ml: "കാസർഗോഡിന്റെ ഉൾപ്രദേശങ്ങളിലെ ഒറ്റപ്പെട്ട ഗ്രാമങ്ങൾക്കുള്ള കൈത്താങ്ങ്. ദൂരം ഒരു കുടുംബത്തിനും ഭക്ഷണത്തിനും ഇടയിൽ തടസ്സമാകരുത്.",
    },
    body: [
      {
        en: "Food On Call brings essential food support to isolated villages in the interiors of Kasaragod, communities that urban aid often overlooks. Anyone can tell us about a family in need.",
        ml: "നഗര സഹായങ്ങൾ പലപ്പോഴും കാണാതെ പോകുന്ന കാസർഗോഡിന്റെ ഉൾപ്രദേശങ്ങളിലെ ഒറ്റപ്പെട്ട ഗ്രാമങ്ങളിലേക്ക് ഫുഡ് ഓൺ കോൾ അവശ്യ ഭക്ഷണ സഹായം എത്തിക്കുന്നു. സഹായം ആവശ്യമുള്ള ഒരു കുടുംബത്തെക്കുറിച്ച് ആർക്കും ഞങ്ങളെ അറിയിക്കാം.",
      },
    ],
    areas: { en: "Remote interiors of Kasaragod", ml: "കാസർഗോഡിന്റെ ഉൾപ്രദേശങ്ങൾ" },
    needsNativeReview: true,
  },
  {
    slug: "celebrating-together",
    order: 4,
    tone: "purple",
    icon: "van",
    name: { en: "Celebrating Together", ml: "ഒരുമിച്ച് ആഘോഷിക്കാം" },
    summary: {
      en: "We rescue surplus food from weddings and birthdays and serve it, safely packed, to families and shelters who deserve a celebration too.",
      ml: "വിവാഹങ്ങളിലും പിറന്നാളുകളിലും ബാക്കിയാകുന്ന ഭക്ഷണം ഞങ്ങൾ ശേഖരിച്ച്, സുരക്ഷിതമായി പായ്ക്ക് ചെയ്ത്, കുടുംബങ്ങൾക്കും അഭയകേന്ദ്രങ്ങൾക്കും എത്തിക്കുന്നു.",
    },
    body: [
      {
        en: "When a wedding or birthday ends with food left over, our team arrives promptly and transfers unserved dishes into food-grade containers. The food is packed into eco-friendly, ready-to-eat meal packets and carried in dedicated vehicles to a refrigerated storage hub for same-day or next-day distribution.",
        ml: "ഒരു വിവാഹമോ പിറന്നാളോ കഴിഞ്ഞ് ഭക്ഷണം ബാക്കിയാകുമ്പോൾ, ഞങ്ങളുടെ സംഘം ഉടനെത്തി വിളമ്പാത്ത വിഭവങ്ങൾ ഫുഡ്-ഗ്രേഡ് പാത്രങ്ങളിലേക്ക് മാറ്റുന്നു. പരിസ്ഥിതി സൗഹൃദ പായ്ക്കറ്റുകളിലാക്കി, പ്രത്യേക വാഹനങ്ങളിൽ ശീതീകരിച്ച സംഭരണ കേന്ദ്രത്തിലെത്തിച്ച്, അന്നോ പിറ്റേന്നോ വിതരണം ചെയ്യുന്നു.",
      },
    ],
    areas: { en: "Wherever the celebration is", ml: "ആഘോഷം നടക്കുന്നിടത്തെല്ലാം" },
    howItWorks: [
      { en: "Collect", ml: "ശേഖരിക്കുക" },
      { en: "Pack", ml: "പായ്ക്ക് ചെയ്യുക" },
      { en: "Distribute", ml: "വിതരണം ചെയ്യുക" },
    ],
    needsNativeReview: true,
  },
  {
    slug: "smile-and-care",
    order: 5,
    tone: "leaf",
    icon: "heart",
    name: { en: "Smile and Care", ml: "സ്മൈൽ ആൻഡ് കെയർ" },
    summary: {
      en: "Food, shelter, clothing, medical care and education support for the homeless, low-income families, orphanages and old-age homes.",
      ml: "വീടില്ലാത്തവർക്കും താഴ്ന്ന വരുമാനമുള്ള കുടുംബങ്ങൾക്കും അനാഥാലയങ്ങൾക്കും വൃദ്ധസദനങ്ങൾക്കും ഭക്ഷണം, അഭയം, വസ്ത്രം, ചികിത്സ, വിദ്യാഭ്യാസ സഹായം.",
    },
    body: [
      {
        en: "Smile and Care provides food, shelter, clothing, medical care, education and other assistance to the homeless, low-income families, orphanages and old-age homes.",
        ml: "വീടില്ലാത്തവർ, താഴ്ന്ന വരുമാനമുള്ള കുടുംബങ്ങൾ, അനാഥാലയങ്ങൾ, വൃദ്ധസദനങ്ങൾ എന്നിവർക്ക് ഭക്ഷണം, അഭയം, വസ്ത്രം, ചികിത്സ, വിദ്യാഭ്യാസം തുടങ്ങിയ സഹായങ്ങൾ സ്മൈൽ ആൻഡ് കെയർ നൽകുന്നു.",
      },
    ],
    areas: { en: "Across Kasaragod district", ml: "കാസർഗോഡ് ജില്ലയിലുടനീളം" },
    needsNativeReview: true,
  },
  {
    slug: "education-support",
    order: 6,
    tone: "navy",
    icon: "book",
    name: { en: "Education Support", ml: "വിദ്യാഭ്യാസ സഹായം" },
    summary: {
      en: "Fee support so students who cannot afford fees at our institute can keep learning.",
      ml: "ഫീസ് അടയ്ക്കാൻ കഴിയാത്ത ഞങ്ങളുടെ സ്ഥാപനത്തിലെ വിദ്യാർത്ഥികൾക്ക് പഠനം തുടരാൻ ഫീസ് സഹായം.",
    },
    body: [
      {
        en: "Education Support covers fees for students at the foundation's institute who cannot afford them, so that money never decides who gets to keep learning.",
        ml: "ഫീസ് അടയ്ക്കാൻ കഴിയാത്ത, ഫൗണ്ടേഷന്റെ സ്ഥാപനത്തിലെ വിദ്യാർത്ഥികളുടെ ഫീസ് വിദ്യാഭ്യാസ സഹായം വഹിക്കുന്നു. പണം ആരുടെയും പഠനം മുടക്കരുത്.",
      },
    ],
    areas: { en: "Kasaragod", ml: "കാസർഗോഡ്" },
    needsNativeReview: true,
  },
  {
    slug: "i-lead-store",
    order: 7,
    tone: "purple",
    icon: "store",
    name: { en: "I Lead Store", ml: "ഐ ലീഡ് സ്റ്റോർ" },
    summary: {
      en: "An online store that helps differently-abled students sell their handmade products and earn with pride.",
      ml: "ഭിന്നശേഷിക്കാരായ വിദ്യാർത്ഥികൾക്ക് അവരുടെ കൈത്തൊഴിൽ ഉൽപ്പന്നങ്ങൾ വിറ്റ് അഭിമാനത്തോടെ സമ്പാദിക്കാൻ ഒരു ഓൺലൈൻ സ്റ്റോർ.",
    },
    body: [
      {
        en: "I Lead Store is an online platform that helps differently-abled students market the handmade products they create, turning skill into income and independence.",
        ml: "ഭിന്നശേഷിക്കാരായ വിദ്യാർത്ഥികൾ നിർമ്മിക്കുന്ന കൈത്തൊഴിൽ ഉൽപ്പന്നങ്ങൾ വിപണിയിലെത്തിക്കാൻ സഹായിക്കുന്ന ഓൺലൈൻ പ്ലാറ്റ്ഫോമാണ് ഐ ലീഡ് സ്റ്റോർ.",
      },
    ],
    areas: { en: "Online", ml: "ഓൺലൈൻ" },
    needsNativeReview: true,
  },
  {
    slug: "blanket-distribution",
    order: 8,
    tone: "maroon",
    icon: "blanket",
    name: { en: "Blanket Distribution", ml: "പുതപ്പ് വിതരണം" },
    summary: {
      en: "Warm blankets for neighbours facing the seasonal chill, delivered through direct outreach.",
      ml: "തണുപ്പുകാലത്ത് ബുദ്ധിമുട്ടുന്ന അയൽക്കാർക്ക് നേരിട്ടെത്തിക്കുന്ന ചൂടുള്ള പുതപ്പുകൾ.",
    },
    body: [
      {
        en: "When the cold season arrives, we reach people affected by the seasonal chill with warm blankets, handed over in person through direct outreach.",
        ml: "തണുപ്പുകാലം എത്തുമ്പോൾ, അതിന്റെ ബുദ്ധിമുട്ട് അനുഭവിക്കുന്നവർക്ക് ഞങ്ങൾ നേരിട്ടെത്തി ചൂടുള്ള പുതപ്പുകൾ കൈമാറുന്നു.",
      },
    ],
    areas: { en: "Local outreach", ml: "പ്രാദേശികം" },
    needsNativeReview: true,
  },
  {
    slug: "wayanad-relief",
    order: 9,
    tone: "leaf",
    icon: "relief",
    name: { en: "Wayanad Relief", ml: "വയനാട് ദുരിതാശ്വാസം" },
    summary: {
      en: "Disaster relief supplies sent to families affected by the Wayanad landslides.",
      ml: "വയനാട് ഉരുൾപൊട്ടലിൽ ദുരിതമനുഭവിക്കുന്ന കുടുംബങ്ങൾക്ക് ദുരിതാശ്വാസ സാമഗ്രികൾ.",
    },
    body: [
      {
        en: "In response to the Wayanad landslides, the foundation sent disaster relief supplies to affected families.",
        ml: "വയനാട് ഉരുൾപൊട്ടലിനെ തുടർന്ന്, ദുരിതബാധിത കുടുംബങ്ങൾക്ക് ഫൗണ്ടേഷൻ ദുരിതാശ്വാസ സാമഗ്രികൾ എത്തിച്ചു.",
      },
    ],
    areas: { en: "Wayanad", ml: "വയനാട്" },
    needsNativeReview: true,
  },
];

export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);
