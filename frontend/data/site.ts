export const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/#our-products", labelKey: "nav.products" },
  { href: "/calculator", labelKey: "nav.calculator" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/emi", labelKey: "nav.emi" },
];

export const trustedBrands = ["Goldi", "Tata Power Solar", "Waaree", "Adani Solar", "Luminous", "Vikram"];

export const benefits = [
  {
    title: "Maximum Savings",
    description:
      "Cut up to 80% of your electricity costs with intelligent system sizing and high-yield panel recommendations.",
  },
  {
    title: "Faster Payback",
    description:
      "Understand ROI instantly with transparent investment, subsidy assumptions, and future savings estimates.",
  },
  {
    title: "Trusted Products",
    description:
      "Compare proven panel brands side-by-side on efficiency, warranty, and long-term value before you decide.",
  },
  {
    title: "Dedicated Support",
    description:
      "From site assessment to installation planning, our experts guide you at each stage with clear communication.",
  },
];

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
];
