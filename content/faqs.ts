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
    q: { en: "What food can you accept?", ml: "ഏതൊക്കെ ഭക്ഷണം നിങ്ങൾ സ്വീകരിക്കും?" },
    a: {
      en: "We accept freshly cooked, hygienically stored, uncontaminated surplus vegetarian or non-vegetarian meals from weddings, conventions, hotels and family functions across Kasaragod, Kanhangad, Thrikkaripur and Cherkala, provided they were prepared within the last two to three hours. We also accept sealed, non-perishable groceries such as rice, pulses, cooking oil, tea, sugar and spices for monthly ration kits. We cannot accept spoiled, stale or partially served food.",
      ml: "കാസർഗോഡ്, കാഞ്ഞങ്ങാട്, തൃക്കരിപ്പൂർ, ചെർക്കള എന്നിവിടങ്ങളിലെ വിവാഹങ്ങൾ, സമ്മേളനങ്ങൾ, ഹോട്ടലുകൾ, കുടുംബ പരിപാടികൾ എന്നിവയിൽ നിന്ന് പുതുതായി പാകം ചെയ്തതും ശുചിത്വത്തോടെ സൂക്ഷിച്ചതും മലിനമാകാത്തതുമായ മിച്ച സസ്യാഹാരമോ മാംസാഹാരമോ ഞങ്ങൾ സ്വീകരിക്കുന്നു. കഴിഞ്ഞ രണ്ടോ മൂന്നോ മണിക്കൂറിനുള്ളിൽ പാകം ചെയ്തതായിരിക്കണം. പ്രതിമാസ റേഷൻ കിറ്റുകൾക്കായി അരി, പയർവർഗങ്ങൾ, പാചക എണ്ണ, ചായ, പഞ്ചസാര, മസാലകൾ തുടങ്ങിയ മുദ്രവെച്ച, കേടാകാത്ത പലചരക്ക് സാധനങ്ങളും സ്വീകരിക്കുന്നു. കേടായതോ പഴകിയതോ ഭാഗികമായി വിളമ്പിയതോ ആയ ഭക്ഷണം സ്വീകരിക്കാനാവില്ല.",
    },
    link: "/food-rescue",
  },
  {
    id: "areas",
    q: { en: "Which areas do you serve?", ml: "ഏതൊക്കെ പ്രദേശങ്ങളിലാണ് നിങ്ങൾ സേവനം നൽകുന്നത്?" },
    a: {
      en: "We serve Kasaragod, Cherkala, Kanhangad and Thrikkaripur, as well as remote villages across Kasaragod district.",
      ml: "കാസർഗോഡ്, ചെർക്കള, കാഞ്ഞങ്ങാട്, തൃക്കരിപ്പൂർ എന്നിവിടങ്ങളിലും കാസർഗോഡ് ജില്ലയിലെ വിദൂര ഗ്രാമങ്ങളിലും ഞങ്ങൾ സേവനം നൽകുന്നു.",
    },
  },
  {
    id: "tax",
    q: { en: "Are donations tax-deductible?", ml: "സംഭാവനകൾക്ക് നികുതി ഇളവ് ലഭിക്കുമോ?" },
    a: {
      en: "Eligible donations to Live to Smile Foundation Trust qualify for deduction under Section 80G of the Income Tax Act, subject to applicable rules. An official digital receipt with the registration details is issued for each contribution.",
      ml: "ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷൻ ട്രസ്റ്റിന് നൽകുന്ന അർഹമായ സംഭാവനകൾക്ക് ബാധകമായ ചട്ടങ്ങൾക്കനുസരിച്ച് ആദായനികുതി നിയമത്തിലെ വകുപ്പ് 80G പ്രകാരം ഇളവ് ലഭിക്കും. ഓരോ സംഭാവനയ്ക്കും രജിസ്ട്രേഷൻ വിവരങ്ങളോടുകൂടിയ ഔദ്യോഗിക ഡിജിറ്റൽ രസീത് നൽകുന്നു.",
    },
    link: "/transparency",
  },
  {
    id: "safety",
    q: { en: "How is the food kept safe?", ml: "ഭക്ഷണം എങ്ങനെയാണ് സുരക്ഷിതമായി സൂക്ഷിക്കുന്നത്?" },
    a: {
      en: "Volunteers use clean, food-grade containers and check that donated food is fresh, uncontaminated and hygienically stored. Only food prepared within the previous two to three hours is accepted, and safe meals are redistributed promptly.",
      ml: "വളണ്ടിയർമാർ വൃത്തിയുള്ള ഫുഡ്-ഗ്രേഡ് പാത്രങ്ങൾ ഉപയോഗിക്കുകയും സംഭാവന ചെയ്യുന്ന ഭക്ഷണം പുതുതും മലിനമാകാത്തതും ശുചിത്വത്തോടെ സൂക്ഷിച്ചതുമാണെന്ന് പരിശോധിക്കുകയും ചെയ്യുന്നു. കഴിഞ്ഞ രണ്ടോ മൂന്നോ മണിക്കൂറിനുള്ളിൽ പാകം ചെയ്ത ഭക്ഷണം മാത്രമാണ് സ്വീകരിക്കുന്നത്; സുരക്ഷിതമായ ഭക്ഷണം ഉടൻ വിതരണം ചെയ്യുന്നു.",
    },
  },
  {
    id: "request",
    q: { en: "How do I request food for someone in need?", ml: "ആവശ്യമുള്ള ഒരാൾക്കായി ഭക്ഷണം എങ്ങനെ അഭ്യർത്ഥിക്കാം?" },
    a: {
      en: "The Request Help page explains how individuals and concerned neighbours can alert our team. We connect people who cannot reach a distribution point with cooked-meal routes or monthly grocery kits, and handle each request sensitively and privately.",
      ml: "സഹായം ആവശ്യമുള്ളവർക്കോ അവരുടെ അയൽക്കാർക്കോ ഞങ്ങളുടെ ടീമിനെ അറിയിക്കാനുള്ള വിവരങ്ങൾ സഹായ അഭ്യർത്ഥന പേജിലുണ്ട്. വിതരണ കേന്ദ്രത്തിലെത്താൻ കഴിയാത്തവരെ പാകം ചെയ്ത ഭക്ഷണ വിതരണ വഴികളുമായോ പ്രതിമാസ പലചരക്ക് കിറ്റുകളുമായോ ബന്ധിപ്പിക്കുന്നു. ഓരോ അഭ്യർത്ഥനയും കരുതലോടെയും സ്വകാര്യതയോടെയും കൈകാര്യം ചെയ്യുന്നു.",
    },
    link: "/request-help",
  },
  {
    id: "volunteer",
    q: { en: "Can I volunteer?", ml: "എനിക്ക് വളണ്ടിയർ ആകാമോ?" },
    a: {
      en: "Yes. Volunteers can help prepare and pack breakfast, join lunch rounds, assemble ration kits, support food-rescue pickups, or document the work. Visit the Volunteer page to learn about the roles.",
      ml: "തീർച്ചയായും. പ്രഭാതഭക്ഷണം തയ്യാറാക്കാനും പായ്ക്ക് ചെയ്യാനും, ഉച്ചഭക്ഷണ വിതരണത്തിൽ പങ്കെടുക്കാനും, റേഷൻ കിറ്റുകൾ ഒരുക്കാനും, ഭക്ഷ്യ വീണ്ടെടുപ്പ് പിക്കപ്പുകൾക്ക് സഹായിക്കാനും, പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താനും വളണ്ടിയർമാർക്ക് കഴിയും. ചുമതലകളെക്കുറിച്ച് വളണ്ടിയർ പേജിൽ അറിയാം.",
    },
    link: "/volunteer",
  },
  {
    id: "csr",
    q: { en: "Can companies fund this through CSR?", ml: "കമ്പനികൾക്ക് CSR വഴി സഹായിക്കാമോ?" },
    a: {
      en: "Yes. Live to Smile Foundation has an active MCA CSR-1 registration (CSR00104723). Companies can support meal services, monthly grocery kits or food-rescue logistics, with CSR documentation and utilization reporting.",
      ml: "അതെ. ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷന് സജീവമായ MCA CSR-1 രജിസ്ട്രേഷൻ (CSR00104723) ഉണ്ട്. ഭക്ഷണ വിതരണം, പ്രതിമാസ പലചരക്ക് കിറ്റുകൾ, ഭക്ഷ്യ വീണ്ടെടുപ്പ് ഗതാഗതം എന്നിവയ്ക്ക് കമ്പനികൾക്ക് പിന്തുണ നൽകാം; CSR രേഖകളും വിനിയോഗ റിപ്പോർട്ടുകളും ലഭ്യമാക്കും.",
    },
    link: "/partner-with-us",
  },
  {
    id: "foreign",
    q: { en: "Do you accept foreign donations?", ml: "വിദേശ സംഭാവനകൾ സ്വീകരിക്കുമോ?" },
    a: {
      en: "Live to Smile Foundation has active FCRA registration/approval. Hunger Free Kasaragod currently accepts contributions in INR from Indian citizens, eligible NRE/NRO account holders with Indian passports, and Indian-registered entities. Contributions remain subject to FCRA requirements.",
      ml: "ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷന് സജീവമായ FCRA രജിസ്ട്രേഷൻ/അംഗീകാരമുണ്ട്. ഹംഗർ ഫ്രീ കാസർഗോഡ് നിലവിൽ ഇന്ത്യൻ പൗരന്മാരിൽ നിന്നും, ഇന്ത്യൻ പാസ്‌പോർട്ടുള്ള അർഹരായ NRE/NRO അക്കൗണ്ട് ഉടമകളിൽ നിന്നും, ഇന്ത്യയിൽ രജിസ്റ്റർ ചെയ്ത സ്ഥാപനങ്ങളിൽ നിന്നും INR-ൽ സംഭാവനകൾ സ്വീകരിക്കുന്നു. എല്ലാ സംഭാവനകളും FCRA ചട്ടങ്ങൾക്ക് വിധേയമാണ്.",
    },
  },
];
