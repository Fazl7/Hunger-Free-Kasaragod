import type { I18n } from "./site.config";

/**
 * FAQ answers use brochure facts only. Items with `needsConfirmation: true`
 * depend on information the owner must confirm and are hidden in production
 * (and excluded from FAQPage JSON-LD) until the flag is cleared.
 */
export type Faq = { id: string; q: I18n; a: I18n; needsConfirmation?: boolean; link?: string };

export const faqs: Faq[] = [
  {
    id: "what",
    q: { en: "What is Hunger Free Kasaragod?", ml: "എന്താണ് ഹംഗർ ഫ്രീ കാസർഗോഡ്?" },
    a: {
      en: "Hunger Free Kasaragod is the food-relief initiative of Live to Smile Foundation (LTS Foundation), a charitable organisation in Kasaragod, Kerala. Its three core pathways are cooked breakfasts and lunches, a monthly target of 100 grocery kits, and safe surplus-food rescue.",
      ml: "കേരളത്തിലെ കാസർഗോഡ് ആസ്ഥാനമായ ലിവ് ടു സ്മൈൽ ഫൗണ്ടേഷന്റെ (LTS ഫൗണ്ടേഷൻ) ഭക്ഷ്യസഹായ സംരംഭമാണ് ഹംഗർ ഫ്രീ കാസർഗോഡ്. പാകം ചെയ്ത പ്രഭാത-ഉച്ചഭക്ഷണം, പ്രതിമാസം 100 പലചരക്ക് കിറ്റുകൾ എന്ന ലക്ഷ്യം, സുരക്ഷിതമായ മിച്ചഭക്ഷണ ശേഖരണം എന്നിവയാണ് മൂന്ന് പ്രധാന മാർഗങ്ങൾ.",
    },
  },
  {
    id: "surplus",
    q: {
      en: "How can I donate leftover food from a wedding or event in Kasaragod?",
      ml: "കാസർഗോഡിലെ ഒരു വിവാഹത്തിലോ പരിപാടിയിലോ ബാക്കിയായ ഭക്ഷണം എങ്ങനെ നൽകാം?",
    },
    a: {
      en: "Book a pickup through our Food Rescue form with the event date, venue and approximate number of servings. Our team arrives, transfers unserved dishes into food-grade containers, packs them into ready-to-eat meal packets and distributes them the same day or the next day.",
      ml: "പരിപാടിയുടെ തീയതി, സ്ഥലം, ഏകദേശ അളവ് എന്നിവ സഹിതം ഫുഡ് റെസ്ക്യൂ ഫോം വഴി ബുക്ക് ചെയ്യുക. ഞങ്ങളുടെ സംഘം എത്തി, വിളമ്പാത്ത ഭക്ഷണം ഫുഡ്-ഗ്രേഡ് പാത്രങ്ങളിലാക്കി, പായ്ക്കറ്റുകളാക്കി, അന്നോ പിറ്റേന്നോ വിതരണം ചെയ്യും.",
    },
    link: "/food-rescue",
  },
  {
    id: "accept",
    needsConfirmation: true,
    q: { en: "What food can you accept?", ml: "ഏതൊക്കെ ഭക്ഷണം നിങ്ങൾ സ്വീകരിക്കും?" },
    a: {
      en: "PENDING OWNER CONFIRMATION: cooked vs packaged food, timing limits and minimum quantity.",
      ml: "ഉടമയുടെ സ്ഥിരീകരണം ആവശ്യമാണ്.",
    },
  },
  {
    id: "areas",
    q: { en: "Which areas do you serve?", ml: "ഏതൊക്കെ പ്രദേശങ്ങളിലാണ് നിങ്ങൾ സേവനം നൽകുന്നത്?" },
    a: {
      en: "We serve Kasaragod, Cherkala and Kanhangad, along with remote villages in the interiors of Kasaragod district that urban aid often overlooks. We have also sent disaster relief supplies to families affected by the Wayanad landslides.",
      ml: "കാസർഗോഡ്, ചെർക്കള, കാഞ്ഞങ്ങാട് എന്നിവിടങ്ങളിലും നഗര സഹായം എത്താത്ത ജില്ലയിലെ ഉൾനാടൻ ഗ്രാമങ്ങളിലും ഞങ്ങൾ സേവനം നൽകുന്നു. വയനാട് ഉരുൾപൊട്ടൽ ബാധിതർക്കും ദുരിതാശ്വാസ സാമഗ്രികൾ എത്തിച്ചിട്ടുണ്ട്.",
    },
  },
  {
    id: "tax",
    needsConfirmation: true,
    q: { en: "Are donations tax-deductible?", ml: "സംഭാവനകൾക്ക് നികുതി ഇളവ് ലഭിക്കുമോ?" },
    a: {
      en: "PENDING VERIFICATION: 80G status, receipt format and PAN requirement must be confirmed against the certificate and by a CA.",
      ml: "സ്ഥിരീകരണം ആവശ്യമാണ്.",
    },
  },
  {
    id: "safety",
    q: { en: "How is the food kept safe?", ml: "ഭക്ഷണം എങ്ങനെയാണ് സുരക്ഷിതമായി സൂക്ഷിക്കുന്നത്?" },
    a: {
      en: "Surplus food is moved into food-grade containers on site, packed into eco-friendly ready-to-eat meal packets, and carried in dedicated vehicles to a refrigerated storage hub so it can be distributed safely the same day or the next day.",
      ml: "ബാക്കിയായ ഭക്ഷണം സ്ഥലത്തുവെച്ചുതന്നെ ഫുഡ്-ഗ്രേഡ് പാത്രങ്ങളിലാക്കി, പരിസ്ഥിതി സൗഹൃദ പായ്ക്കറ്റുകളിലാക്കി, പ്രത്യേക വാഹനങ്ങളിൽ ശീതീകരിച്ച സംഭരണ കേന്ദ്രത്തിലെത്തിക്കുന്നു. അന്നോ പിറ്റേന്നോ സുരക്ഷിതമായി വിതരണം ചെയ്യുന്നു.",
    },
  },
  {
    id: "request",
    q: { en: "How do I request food for someone in need?", ml: "ആവശ്യമുള്ള ഒരാൾക്കായി ഭക്ഷണം എങ്ങനെ അഭ്യർത്ഥിക്കാം?" },
    a: {
      en: "Use the Request Help form to tell us the area, the number of people and how urgent it is. Through Food On Call we reach isolated villages in the interiors of Kasaragod. Your details are kept private.",
      ml: "പ്രദേശം, ആളുകളുടെ എണ്ണം, അടിയന്തരാവസ്ഥ എന്നിവ സഹായ അഭ്യർത്ഥന ഫോമിൽ അറിയിക്കുക. ഫുഡ് ഓൺ കോൾ വഴി കാസർഗോഡിന്റെ ഉൾഗ്രാമങ്ങളിൽ വരെ ഞങ്ങൾ എത്തുന്നു. നിങ്ങളുടെ വിവരങ്ങൾ സ്വകാര്യമായി സൂക്ഷിക്കും.",
    },
    link: "/request-help",
  },
  {
    id: "volunteer",
    q: { en: "Can I volunteer?", ml: "എനിക്ക് വളണ്ടിയർ ആകാമോ?" },
    a: {
      en: "Yes. Volunteers help with packing, distribution, driving, photography, translation and tech. Sign up on the Volunteer page and pick the role that suits you.",
      ml: "തീർച്ചയായും. പായ്ക്കിംഗ്, വിതരണം, ഡ്രൈവിംഗ്, ഫോട്ടോഗ്രഫി, വിവർത്തനം, ടെക് എന്നിവയിൽ വളണ്ടിയർമാർ സഹായിക്കുന്നു. വളണ്ടിയർ പേജിൽ രജിസ്റ്റർ ചെയ്യുക.",
    },
    link: "/volunteer",
  },
  {
    id: "csr",
    needsConfirmation: true,
    q: { en: "Can companies fund this through CSR?", ml: "കമ്പനികൾക്ക് CSR വഴി സഹായിക്കാമോ?" },
    a: {
      en: "PENDING VERIFICATION: confirm CSR-1 registration against the certificate before publishing.",
      ml: "സ്ഥിരീകരണം ആവശ്യമാണ്.",
    },
  },
  {
    id: "foreign",
    needsConfirmation: true,
    q: { en: "Do you accept foreign donations?", ml: "വിദേശ സംഭാവനകൾ സ്വീകരിക്കുമോ?" },
    a: { en: "PENDING: FCRA status not yet confirmed.", ml: "FCRA സ്ഥിതി സ്ഥിരീകരിച്ചിട്ടില്ല." },
  },
];
