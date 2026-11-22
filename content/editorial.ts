import type { I18n } from "./site.config";

export type EditorialSection = { heading: I18n; paragraphs: I18n[] };

export type EditorialPage = {
  title: I18n;
  intro: I18n;
  sections: EditorialSection[];
};

export const aboutPage: EditorialPage = {
  title: {
    en: "About Live to Smile Foundation",
    ml: "ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷനെക്കുറിച്ച്",
  },
  intro: {
    en: "Live to Smile Foundation Trust is a grassroots non-profit established in September 2022 in Kasaragod, Kerala, working for community mental health, education, human dignity and hunger relief.",
    ml: "സമൂഹ മാനസികാരോഗ്യം, വിദ്യാഭ്യാസം, മനുഷ്യാന്തസ്സ്, വിശപ്പിനെതിരായ പ്രവർത്തനം എന്നിവയ്ക്കായി കേരളത്തിലെ കാസർഗോഡ് ജില്ലയിൽ 2022 സെപ്റ്റംബറിൽ സ്ഥാപിതമായ അടിത്തട്ടിലെ ലാഭേച്ഛയില്ലാത്ത സംഘടനയാണ് ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷൻ ട്രസ്റ്റ്.",
  },
  sections: [
    {
      heading: { en: "A foundation rooted in community", ml: "സമൂഹത്തിൽ വേരൂന്നിയ ഫൗണ്ടേഷൻ" },
      paragraphs: [
        {
          en: "Founded and led by psychologist and social entrepreneur Ahammed Shareen, alongside co-directors Irfad Mayippadi and Abdul Rahman Erol, the foundation works at the intersection of immediate humanitarian relief and long-term social resilience.",
          ml: "മനഃശാസ്ത്രജ്ഞനും സാമൂഹിക സംരംഭകനുമായ അഹമ്മദ് ഷരീന്റെ നേതൃത്വത്തിൽ സഹഡയറക്ടർമാരായ ഇർഫാദ് മായിപ്പാടിയും അബ്ദുൽ റഹ്മാൻ എറോളും ചേർന്നാണ് ഫൗണ്ടേഷൻ പ്രവർത്തിക്കുന്നത്. അടിയന്തര മാനുഷിക സഹായത്തെയും ദീർഘകാല സാമൂഹിക ക്ഷേമത്തെയും ബന്ധിപ്പിച്ചാണ് പ്രവർത്തനം.",
        },
        {
          en: "Recognising that mental well-being and dignity cannot thrive on an empty stomach, the foundation launched Hunger Free Kasaragod as its food-security initiative. The programme began on 25 October 2025 as a weekly breakfast service and grew into a six-day-a-week operation across Kasaragod, Kanhangad, Thrikkaripur and Cherkala.",
          ml: "വിശപ്പുള്ള വയറ്റിൽ മാനസിക ക്ഷേമവും അന്തസ്സും നിലനിർത്താനാവില്ലെന്ന് തിരിച്ചറിഞ്ഞ്, ഭക്ഷ്യസുരക്ഷാ സംരംഭമായി ഫൗണ്ടേഷൻ ഹംഗർ ഫ്രീ കാസർഗോഡ് ആരംഭിച്ചു. 2025 ഒക്ടോബർ 25-ന് ആഴ്ചയിലൊരിക്കൽ പ്രഭാതഭക്ഷണം നൽകിയാണ് തുടക്കം; പിന്നീട് കാസർഗോഡ്, കാഞ്ഞങ്ങാട്, തൃക്കരിപ്പൂർ, ചെർക്കള എന്നിവിടങ്ങളിലായി ആഴ്ചയിൽ ആറു ദിവസത്തെ പ്രവർത്തനമായി വളർന്നു.",
        },
      ],
    },
    {
      heading: { en: "Food support with dignity", ml: "അന്തസ്സോടെ ഭക്ഷണസഹായം" },
      paragraphs: [
        {
          en: "The team now serves 50 freshly cooked breakfasts at Theruvath Ubaid Park and 80 wholesome lunches each service day, alongside monthly dry-grocery ration kits and surplus-food rescue. Supported by Kasaragod Municipality, Aster MIMS Foundation, The LaLiT Resort & Spa Bekal, local social entrepreneurs and community members, the work is aligned with UN Sustainable Development Goal 2: Zero Hunger.",
          ml: "ഓരോ പ്രവർത്തിദിവസവും തെരുവത്ത് ഉബൈദ് പാർക്കിൽ 50 പുതുതായി പാകം ചെയ്ത പ്രഭാതഭക്ഷണങ്ങളും 80 പോഷകസമൃദ്ധമായ ഉച്ചഭക്ഷണങ്ങളും ടീം നൽകുന്നു. ഇതോടൊപ്പം പ്രതിമാസ ഡ്രൈ-ഗ്രോസറി റേഷൻ കിറ്റുകളും മിച്ചഭക്ഷണ ശേഖരണവും നടക്കുന്നു. കാസർഗോഡ് നഗരസഭ, ആസ്റ്റർ മിംസ് ഫൗണ്ടേഷൻ, ദി ലളിത് റിസോർട്ട് & സ്പാ ബേക്കൽ, പ്രാദേശിക സാമൂഹിക സംരംഭകർ, സമൂഹാംഗങ്ങൾ എന്നിവരുടെ പിന്തുണയോടെ ഐക്യരാഷ്ട്രസഭയുടെ സുസ്ഥിര വികസന ലക്ഷ്യം 2—വിശപ്പില്ലായ്മ—അനുസരിച്ചാണ് പ്രവർത്തനം.",
        },
      ],
    },
  ],
};

export const transparencyPage: EditorialPage = {
  title: { en: "Transparency", ml: "സുതാര്യത" },
  intro: {
    en: "Public trust is built by showing how contributions become practical support. We document our work and share the records people need to understand it.",
    ml: "സംഭാവനകൾ എങ്ങനെ പ്രായോഗിക സഹായമാകുന്നു എന്ന് വ്യക്തമാക്കുമ്പോഴാണ് പൊതുവിശ്വാസം വളരുന്നത്. പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തി അവ മനസ്സിലാക്കാൻ ആവശ്യമായ വിവരങ്ങൾ ഞങ്ങൾ പങ്കുവെക്കുന്നു.",
  },
  sections: [
    {
      heading: { en: "Accountability in every contribution", ml: "ഓരോ സംഭാവനയിലും ഉത്തരവാദിത്തം" },
      paragraphs: [
        {
          en: "At Live to Smile Foundation, accountability guides every meal we cook, every ration kit we pack and every contribution we receive. Donors, institutional partners and citizens have a right to see how their support reaches people in Kasaragod.",
          ml: "ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷനിൽ ഓരോ ഭക്ഷണം പാകം ചെയ്യുന്നതിലും ഓരോ റേഷൻ കിറ്റ് ഒരുക്കുന്നതിലും ഓരോ സംഭാവന സ്വീകരിക്കുന്നതിലും ഉത്തരവാദിത്തമാണ് വഴികാട്ടി. കാസർഗോഡിലെ ആളുകളിലേക്ക് അവരുടെ സഹായം എങ്ങനെ എത്തുന്നു എന്ന് അറിയാൻ ദാതാക്കൾക്കും സ്ഥാപന പങ്കാളികൾക്കും പൗരന്മാർക്കും അവകാശമുണ്ട്.",
        },
        {
          en: "Registered as Live to Smile Foundation Trust, the organisation holds Section 12A and Section 80G tax-exemption credentials and an active MCA CSR-1 registration. Eligible donations are receipted, and institutional support is documented in line with applicable requirements.",
          ml: "ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷൻ ട്രസ്റ്റ് എന്ന പേരിൽ രജിസ്റ്റർ ചെയ്ത സംഘടനയ്ക്ക് വകുപ്പ് 12A, വകുപ്പ് 80G നികുതി ഇളവ് രേഖകളും സജീവമായ MCA CSR-1 രജിസ്ട്രേഷനും ഉണ്ട്. അർഹമായ സംഭാവനകൾക്ക് രസീത് നൽകുകയും സ്ഥാപന പിന്തുണകൾ ബാധകമായ ആവശ്യങ്ങൾക്കനുസരിച്ച് രേഖപ്പെടുത്തുകയും ചെയ്യുന്നു.",
        },
      ],
    },
    {
      heading: { en: "An open record of distributions", ml: "വിതരണങ്ങളുടെ തുറന്ന രേഖ" },
      paragraphs: [
        {
          en: "Our public Distribution Ledger records dated entries and, where available, on-ground photographs from breakfast drives at Theruvath Ubaid Park, lunch rounds, dry-grocery kit handovers and surplus-food rescues across Kasaragod, Kanhangad, Thrikkaripur and Cherkala. Visitors can review quantities, project categories and localities instead of relying only on annual summaries.",
          ml: "തെരുവത്ത് ഉബൈദ് പാർക്കിലെ പ്രഭാതഭക്ഷണ വിതരണം, ഉച്ചഭക്ഷണ റൗണ്ടുകൾ, ഡ്രൈ-ഗ്രോസറി കിറ്റ് കൈമാറ്റങ്ങൾ, കാസർഗോഡ്, കാഞ്ഞങ്ങാട്, തൃക്കരിപ്പൂർ, ചെർക്കള എന്നിവിടങ്ങളിലെ മിച്ചഭക്ഷണ ശേഖരണം എന്നിവയുടെ തീയതിയോടുകൂടിയ എൻട്രികളും ലഭ്യമായിടത്ത് പ്രവർത്തന ചിത്രങ്ങളും പൊതുവിതരണ രേഖയിൽ ചേർക്കുന്നു. വാർഷിക സംഗ്രഹങ്ങൾ മാത്രം ആശ്രയിക്കാതെ അളവുകൾ, പദ്ധതി വിഭാഗങ്ങൾ, പ്രദേശങ്ങൾ എന്നിവ സന്ദർശകർക്ക് പരിശോധിക്കാം.",
        },
        {
          en: "For audited financial statements, registration certificates or CSR due-diligence documents, contributors can contact the foundation’s administrative desk.",
          ml: "ഓഡിറ്റ് ചെയ്ത സാമ്പത്തിക പ്രസ്താവനകൾ, രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റുകൾ, CSR പരിശോധനാ രേഖകൾ എന്നിവയ്ക്കായി സംഭാവനകർക്ക് ഫൗണ്ടേഷന്റെ ഭരണകാര്യ വിഭാഗവുമായി ബന്ധപ്പെടാം.",
        },
      ],
    },
  ],
};

export const volunteerPage: EditorialPage = {
  title: { en: "Volunteer", ml: "വളണ്ടിയർ ആകുക" },
  intro: {
    en: "Volunteering is showing up consistently, with empathy and respect for every neighbour.",
    ml: "ഓരോ അയൽക്കാരനോടും കരുതലും ബഹുമാനവും പുലർത്തി സ്ഥിരമായി കൂടെ നിൽക്കുന്നതാണ് വളണ്ടിയറിംഗ്.",
  },
  sections: [
    {
      heading: { en: "Many ways to help", ml: "സഹായിക്കാനുള്ള പല വഴികൾ" },
      paragraphs: [
        {
          en: "Behind each warm breakfast, lunch round and food-rescue pickup is a community of people giving their time. Volunteers can help prepare and pack breakfast, join midday lunch distribution, assemble monthly grocery kits, respond to surplus-food pickups, or help document daily work for the Distribution Ledger.",
          ml: "ഓരോ ചൂടുള്ള പ്രഭാതഭക്ഷണത്തിനും ഉച്ചഭക്ഷണ വിതരണത്തിനും ഭക്ഷ്യ വീണ്ടെടുപ്പ് പിക്കപ്പിനും പിന്നിൽ സമയം നൽകുന്ന ഒരു സമൂഹമുണ്ട്. പ്രഭാതഭക്ഷണം തയ്യാറാക്കാനും പായ്ക്ക് ചെയ്യാനും, ഉച്ചഭക്ഷണ വിതരണത്തിൽ പങ്കെടുക്കാനും, പ്രതിമാസ പലചരക്ക് കിറ്റുകൾ ഒരുക്കാനും, മിച്ചഭക്ഷണ പിക്കപ്പുകൾക്ക് സഹായിക്കാനും, വിതരണ രേഖയ്ക്കായി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താനും വളണ്ടിയർമാർക്ക് കഴിയും.",
        },
        {
          en: "Students, working professionals, homemakers and retired neighbours can contribute in ways that fit their schedules and strengths. No special qualification is needed to begin—punctuality, warmth and a commitment to treating every person as an equal neighbour matter most.",
          ml: "വിദ്യാർത്ഥികൾക്കും ജോലി ചെയ്യുന്നവർക്കും വീട്ടമ്മമാർക്കും വിരമിച്ചവർക്കും സ്വന്തം സമയത്തിനും കഴിവിനും യോജിച്ച രീതിയിൽ സഹായിക്കാം. തുടങ്ങാൻ പ്രത്യേക യോഗ്യത ആവശ്യമില്ല; സമയനിഷ്ഠ, കരുതൽ, എല്ലാവരെയും തുല്യരായ അയൽക്കാരായി കാണാനുള്ള മനസ്സ് എന്നിവയാണ് പ്രധാനം.",
        },
      ],
    },
    {
      heading: { en: "Care beyond the meal", ml: "ഭക്ഷണത്തിനപ്പുറമുള്ള കരുതൽ" },
      paragraphs: [
        {
          en: "Volunteers also listen, build trust and alert coordinators when someone may need medical attention, counselling or rehabilitation support. Even a few hours a week can help keep daily food support moving across Kasaragod district.",
          ml: "ആർക്കെങ്കിലും വൈദ്യസഹായമോ കൗൺസലിംഗോ പുനരധിവാസ പിന്തുണയോ ആവശ്യമുണ്ടെന്ന് തോന്നുമ്പോൾ വളണ്ടിയർമാർ ശ്രദ്ധയോടെ കേൾക്കുകയും വിശ്വാസം വളർത്തുകയും കോർഡിനേറ്റർമാരെ അറിയിക്കുകയും ചെയ്യുന്നു. ആഴ്ചയിൽ കുറച്ച് മണിക്കൂർ നൽകുന്നതുപോലും കാസർഗോഡ് ജില്ലയിലുടനീളം ഭക്ഷണസഹായം തുടരാൻ സഹായിക്കും.",
        },
      ],
    },
  ],
};

export const partnerPage: EditorialPage = {
  title: { en: "Partner with us", ml: "ഞങ്ങളോടൊപ്പം പങ്കാളികളാകൂ" },
  intro: {
    en: "Ending hunger across a district takes sustained collaboration between community organisations, civic authorities, institutions and responsible businesses.",
    ml: "ഒരു ജില്ലയിലുടനീളം വിശപ്പ് കുറയ്ക്കാൻ സമൂഹ സംഘടനകൾ, പൗര അധികാരികൾ, സ്ഥാപനങ്ങൾ, ഉത്തരവാദിത്തമുള്ള സ്ഥാപനങ്ങൾ എന്നിവരുടെ സ്ഥിരമായ സഹകരണം ആവശ്യമാണ്.",
  },
  sections: [
    {
      heading: { en: "What partnership makes possible", ml: "പങ്കാളിത്തം സാധ്യമാക്കുന്നത്" },
      paragraphs: [
        {
          en: "Hunger Free Kasaragod, the Live to Smile Foundation’s food-security initiative, invites corporations, local enterprises, institutions and social entrepreneurs to work with us toward a hunger-free northern Kerala.",
          ml: "ലൈവ് ടു സ്മൈൽ ഫൗണ്ടേഷന്റെ ഭക്ഷ്യസുരക്ഷാ സംരംഭമായ ഹംഗർ ഫ്രീ കാസർഗോഡ്, വിശപ്പില്ലാത്ത വടക്കൻ കേരളത്തിനായി കമ്പനികൾ, പ്രാദേശിക സ്ഥാപനങ്ങൾ, സംഘടനകൾ, സാമൂഹിക സംരംഭകർ എന്നിവരെ സഹകരിക്കാൻ ക്ഷണിക്കുന്നു.",
        },
        {
          en: "Kasaragod Municipality has allocated operational space at Theruvath Ubaid Park. Aster MIMS Foundation supports the six-day-a-week breakfast drive, and The LaLiT Resort & Spa Bekal supports daily lunch distribution. These partnerships helped the work grow from a weekly initiative into a dependable service.",
          ml: "തെരുവത്ത് ഉബൈദ് പാർക്കിൽ കാസർഗോഡ് നഗരസഭ പ്രവർത്തനത്തിനായി സ്ഥലം അനുവദിച്ചിട്ടുണ്ട്. ആഴ്ചയിൽ ആറു ദിവസത്തെ പ്രഭാതഭക്ഷണ പ്രവർത്തനത്തെ ആസ്റ്റർ മിംസ് ഫൗണ്ടേഷനും ദിവസേനയുള്ള ഉച്ചഭക്ഷണ വിതരണത്തെ ദി ലളിത് റിസോർട്ട് & സ്പാ ബേക്കലും പിന്തുണയ്ക്കുന്നു. ഈ പങ്കാളിത്തങ്ങൾ ആഴ്ചയിലെ ഒരു പ്രവർത്തനത്തെ വിശ്വസനീയമായ സേവനമാക്കി വളർത്തി.",
        },
      ],
    },
    {
      heading: { en: "Ways to collaborate", ml: "സഹകരിക്കാനുള്ള മാർഗങ്ങൾ" },
      paragraphs: [
        {
          en: "Partners can sponsor breakfast or lunch batches, fund monthly dry-grocery ration kits, support kitchen and transport infrastructure, or join as zero-waste Food Rescue partners. The programme serves 50 breakfasts and 80 lunches on each of six service days, alongside its monthly kit target and food-rescue work.",
          ml: "പ്രഭാതഭക്ഷണമോ ഉച്ചഭക്ഷണമോ സ്പോൺസർ ചെയ്യുക, പ്രതിമാസ ഡ്രൈ-ഗ്രോസറി റേഷൻ കിറ്റുകൾക്ക് സഹായിക്കുക, അടുക്കളയോ ഗതാഗത സൗകര്യങ്ങളോ പിന്തുണയ്ക്കുക, അല്ലെങ്കിൽ ഭക്ഷ്യ പാഴാക്കൽ കുറയ്ക്കുന്ന ഫുഡ് റെസ്ക്യൂ പങ്കാളിയാകുക എന്നിവയിലൂടെ സഹകരിക്കാം. ആഴ്ചയിലെ ആറു പ്രവർത്തിദിവസങ്ങളിലും 50 പ്രഭാതഭക്ഷണങ്ങളും 80 ഉച്ചഭക്ഷണങ്ങളും നൽകുന്നതോടൊപ്പം കിറ്റ് ലക്ഷ്യവും മിച്ചഭക്ഷണ പ്രവർത്തനവും തുടരുന്നു.",
        },
        {
          en: "The foundation provides registration and CSR documentation, utilization reporting and photographic updates through the open Distribution Ledger, subject to applicable requirements.",
          ml: "ബാധകമായ ആവശ്യങ്ങൾക്കനുസരിച്ച് രജിസ്ട്രേഷൻ, CSR രേഖകൾ, വിനിയോഗ റിപ്പോർട്ടുകൾ, തുറന്ന വിതരണ രേഖയിലൂടെയുള്ള ചിത്ര അപ്‌ഡേറ്റുകൾ എന്നിവ ഫൗണ്ടേഷൻ നൽകുന്നു.",
        },
      ],
    },
  ],
};

export const requestHelpPage: EditorialPage = {
  title: { en: "Request Help", ml: "സഹായം അഭ്യർത്ഥിക്കുക" },
  intro: {
    en: "No one in our community should have to face food insecurity in silence or shame.",
    ml: "ഭക്ഷ്യസുരക്ഷയില്ലായ്മയെ ആരും നിശ്ശബ്ദമായോ ലജ്ജയോടെയോ ഒറ്റയ്ക്ക് നേരിടേണ്ടതില്ല.",
  },
  sections: [
    {
      heading: { en: "Who can reach out", ml: "ആർക്കൊക്കെ അറിയിക്കാം" },
      paragraphs: [
        {
          en: "Bedridden people, older adults living alone, widowed parents and families facing a sudden medical or livelihood crisis may need support. A concerned neighbour, ward member, ASHA worker, teacher or community volunteer can also alert the team about someone who may be struggling.",
          ml: "കിടപ്പുരോഗികൾ, ഒറ്റയ്ക്ക് കഴിയുന്ന വയോധികർ, വിധവയായ മാതാപിതാക്കൾ, പെട്ടെന്നുള്ള ചികിത്സാ ചെലവോ വരുമാന നഷ്ടമോ നേരിടുന്ന കുടുംബങ്ങൾ എന്നിവർക്ക് സഹായം ആവശ്യമായേക്കാം. ബുദ്ധിമുട്ടുന്ന ഒരാളെക്കുറിച്ച് അയൽക്കാർക്കും വാർഡ് അംഗങ്ങൾക്കും ആശാ പ്രവർത്തകർക്കും അധ്യാപകർക്കും സാമൂഹിക വളണ്ടിയർമാർക്കും ടീമിനെ അറിയിക്കാം.",
        },
      ],
    },
    {
      heading: { en: "Support shaped around the need", ml: "ആവശ്യത്തിനനുസരിച്ചുള്ള സഹായം" },
      paragraphs: [
        {
          en: "Depending on the situation, the team can connect people who are homeless or unable to cook with the six-day-a-week breakfast and lunch routes, or provide monthly dry-grocery kits with staples such as rice, pulses, cooking oil, tea and sugar so households can prepare food at home.",
          ml: "സാഹചര്യത്തിനനുസരിച്ച്, താമസസ്ഥലമില്ലാത്തവരെയോ പാചകം ചെയ്യാൻ കഴിയാത്തവരെയോ ആഴ്ചയിൽ ആറു ദിവസത്തെ പ്രഭാത-ഉച്ചഭക്ഷണ വിതരണവുമായി ബന്ധിപ്പിക്കാം. അല്ലെങ്കിൽ അരി, പയർവർഗങ്ങൾ, പാചക എണ്ണ, ചായ, പഞ്ചസാര തുടങ്ങിയ അവശ്യസാധനങ്ങളുള്ള പ്രതിമാസ ഡ്രൈ-ഗ്രോസറി കിറ്റുകൾ നൽകി വീട്ടിൽ ഭക്ഷണം തയ്യാറാക്കാൻ സഹായിക്കാം.",
        },
        {
          en: "Requests are handled sensitively and privately. Coordinators make a respectful, non-intrusive assessment of the household’s needs so assistance can be appropriate and timely. Where needed, the foundation can also help connect people with medical or counselling support.",
          ml: "ഓരോ അഭ്യർത്ഥനയും കരുതലോടെയും സ്വകാര്യതയോടെയും കൈകാര്യം ചെയ്യുന്നു. കുടുംബത്തിന്റെ ആവശ്യം മനസ്സിലാക്കാൻ കോർഡിനേറ്റർമാർ ബഹുമാനപൂർവവും ഇടപെടൽ കുറവുമായ പരിശോധന നടത്തുന്നു; ഇതിലൂടെ യോജിച്ച സഹായം സമയത്ത് നൽകാം. ആവശ്യമെങ്കിൽ വൈദ്യസഹായമോ കൗൺസലിംഗോ ലഭ്യമാക്കാൻ ഫൗണ്ടേഷൻ സഹായിക്കും.",
        },
      ],
    },
  ],
};
