export const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/calculator", labelKey: "nav.calculator" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/emi", labelKey: "nav.emi" },
];

export const trustedBrands = [
  "Adani Solar",
  "Waaree",
  "Tata Power Solar",
  "Vikram Solar",
  "RenewSys",
  "Goldi Solar",
  "Loom Solar",
  "Premier Energies",
];

export type BenefitCard = {
  title: string;
  description: string;
};

const benefitsByLocale: Record<string, BenefitCard[]> = {
  en: [
    {
      title: "Real price transparency — no more guessing",
      description:
        "See exactly what each quote includes: panel brand, inverter, mounting, warranty, and installation scope, so fair comparison becomes easy.",
    },
    {
      title: "We handle your entire ₹78,000 subsidy claim",
      description:
        "Track subsidy support, paperwork, and approval status in real time while we guide the installation-to-claim workflow.",
    },
    {
      title: "Every vendor passes a 27-point verification",
      description:
        "Verified panels, valid licenses, certified equipment, and documented experience are checked before a vendor is listed.",
    },
    {
      title: "Know your real savings before you commit",
      description:
        "Compare payback, IRR, and long-term savings using practical assumptions tailored to your property and tariff context.",
    },
    {
      title: "Post-install monitoring, O&M & solar insurance",
      description:
        "Stay supported after handover with monitoring, maintenance, insurance guidance, and escalation help when needed.",
    },
    {
      title: "Zero commission — you pay the same as going direct",
      description:
        "The price you see is the price you get, with no hidden commission from homeowners and no markup on the platform.",
    },
  ],
  hi: [
    {
      title: "सही कीमत की स्पष्टता - अब अंदाज़ा नहीं",
      description:
        "हर कोटेशन में क्या शामिल है - पैनल ब्रांड, इन्वर्टर, माउंटिंग, वारंटी और इंस्टॉलेशन दायरा - यह साफ़ तौर पर देखें।",
    },
    {
      title: "₹78,000 तक की सब्सिडी प्रक्रिया हम संभालते हैं",
      description:
        "सब्सिडी सहायता, दस्तावेज़ और मंजूरी की स्थिति को रियल-टाइम में ट्रैक करें, जबकि हम इंस्टॉलेशन से क्लेम तक का मार्गदर्शन करते हैं।",
    },
    {
      title: "हर विक्रेता 27-पॉइंट सत्यापन से गुजरता है",
      description:
        "सूची में शामिल होने से पहले पैनल, लाइसेंस, प्रमाणित उपकरण और दस्तावेज़ित अनुभव की जांच की जाती है।",
    },
    {
      title: "कमिट करने से पहले असली बचत जानें",
      description:
        "अपने घर या व्यवसाय के लिए व्यावहारिक मान्यताओं के साथ पेबैक, IRR और दीर्घकालिक बचत की तुलना करें।",
    },
    {
      title: "इंस्टॉलेशन के बाद भी निगरानी और सहायता",
      description:
        "मॉनिटरिंग, मेंटेनेंस, बीमा मार्गदर्शन और ज़रूरत पड़ने पर एस्केलेशन सपोर्ट के साथ हम जुड़े रहते हैं।",
    },
    {
      title: "कोई कमीशन नहीं - सीधे जैसा ही मूल्य",
      description:
        "जो कीमत दिखती है, वही अंतिम कीमत होती है; घर मालिकों से कोई छिपा कमीशन नहीं और प्लेटफ़ॉर्म पर कोई मार्कअप नहीं।",
    },
  ],
};

export const getBenefits = (locale: string) => benefitsByLocale[locale === "hi" ? "hi" : "en"];

export const testimonials = [
  {
    name: "Rohit Shah",
    company: "Factory Owner, Ahmedabad",
    quote:
      "The comparison view made decision-making effortless. We selected a better panel and improved expected ROI by almost a year.",
  },
  {
    name: "Ananya Iyer",
    company: "Homeowner, Bengaluru",
    quote:
      "The calculator was accurate and easy. The team delivered exactly what was promised with a premium, seamless experience.",
  },
  {
    name: "Suhail Khan",
    company: "Commercial Complex, Pune",
    quote:
      "From finance estimates to installation planning, everything felt polished and professional. We saw immediate monthly savings.",
  },
];

export type PanelSpec = {
  brand: "Goldi" | "Tata" | "Waaree" | "Adani";
  wattage: string;
  efficiency: string;
  warranty: string;
  panelType: string;
  priceRange: string;
};

export const panelData: PanelSpec[] = [
  {
    brand: "Goldi",
    wattage: "540W - 610W",
    efficiency: "21.3%",
    warranty: "12 yrs product / 30 yrs performance",
    panelType: "Mono PERC / TOPCon",
    priceRange: "INR 25-31 / W",
  },
  {
    brand: "Tata",
    wattage: "400W - 590W",
    efficiency: "20.8%",
    warranty: "12 yrs product / 25 yrs performance",
    panelType: "Mono PERC",
    priceRange: "INR 28-34 / W",
  },
  {
    brand: "Waaree",
    wattage: "535W - 600W",
    efficiency: "21.0%",
    warranty: "12 yrs product / 30 yrs performance",
    panelType: "Mono PERC / Bifacial",
    priceRange: "INR 26-32 / W",
  },
  {
    brand: "Adani",
    wattage: "530W - 575W",
    efficiency: "20.9%",
    warranty: "12 yrs product / 30 yrs performance",
    panelType: "Mono PERC / TOPCon",
    priceRange: "INR 24-30 / W",
  },
];

export const chatbotQuestions = [
  "How much roof space is needed for a 5kW solar plant?",
  "What subsidy is available for residential rooftop solar?",
  "Which panel brand gives better long-term ROI?",
  "Can I run AC and heavy appliances on solar?",
  "How much can I save with solar?",
];
