export type InfoPage = {
  slug: string;
  title: string;
  summary: string;
  heroTitle: string;
  heroDescription: string;
  highlights: string[];
  details: string[];
};

export const infoPages: InfoPage[] = [
  {
    slug: "about-us",
    title: "About Us",
    summary: "Who we are and how Solar Compare helps buyers make better solar decisions.",
    heroTitle: "A solar comparison platform built for trust",
    heroDescription:
      "We help Indian buyers compare solar options, estimate savings, and find reliable installation support without unnecessary clutter.",
    highlights: ["Buyer-first comparison", "Enterprise-style clarity", "Trusted installer ecosystem"],
    details: ["We keep the comparison process structured and easy to understand.", "The platform focuses on practical decision support instead of flashy marketing."],
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    summary: "Reach the team for help with solar comparison, proposals, and service inquiries.",
    heroTitle: "Talk to the Solar Compare team",
    heroDescription:
      "Use this page when you need direct assistance on comparing systems, understanding financing, or submitting a service request.",
    highlights: ["Proposal support", "Service inquiries", "Buyer guidance"],
    details: ["We respond with practical next steps and the right route for your requirement.", "For service requests, the inquiry form on each service page is the fastest path."],
  },
  {
    slug: "blogs",
    title: "Blogs",
    summary: "Solar education, buying guidance, and market updates in one place.",
    heroTitle: "Practical solar reading for Indian buyers",
    heroDescription:
      "Use the blog space to explore solar comparisons, subsidy basics, installation guidance, and financing context.",
    highlights: ["Buying guides", "Policy updates", "Project planning tips"],
    details: ["The editorial focus is practical, not promotional.", "Articles should help buyers make confident, well-informed choices."],
  },
  {
    slug: "faq",
    title: "FAQ",
    summary: "Short answers to the questions buyers ask most often.",
    heroTitle: "Frequently asked questions",
    heroDescription:
      "A compact reference for subsidy, savings, installation timelines, maintenance, and financing questions.",
    highlights: ["Subsidy basics", "Installation timelines", "Maintenance expectations"],
    details: ["Keep answers concise and grounded in the current platform experience.", "Use this page to reduce friction before a buyer submits an inquiry."],
  },
  {
    slug: "subsidy-information",
    title: "Subsidy Information",
    summary: "Understand the subsidy context before choosing a solar system.",
    heroTitle: "Subsidy context made easier",
    heroDescription:
      "Use this page to understand how subsidies affect system economics and which buyers may benefit from them.",
    highlights: ["Residential subsidy awareness", "Eligibility context", "Decision support"],
    details: ["Subsidy rules can change, so the platform should present them as guidance rather than a promise.", "This page helps users prepare better questions for the proposal stage."],
  },
  {
    slug: "why-solar-compare",
    title: "Why Solar Compare",
    summary: "What makes this platform different from a generic lead form.",
    heroTitle: "Why buyers choose Solar Compare",
    heroDescription:
      "The product is designed around comparison, transparency, and trusted service routing for solar buyers in India.",
    highlights: ["Comparison-first UX", "Trusted installer discovery", "Clear savings and financing context"],
    details: ["Users should see the platform as a decision tool, not just a brochure.", "We prioritize clarity, trust, and production-grade inquiry flows."],
  },
  {
    slug: "how-it-works",
    title: "How It Works",
    summary: "A simple explanation of the buyer journey from comparison to inquiry.",
    heroTitle: "How the buying journey works",
    heroDescription:
      "Compare options, check estimates, choose a service path, and submit an inquiry for admin follow-up.",
    highlights: ["Compare", "Estimate", "Inquire"],
    details: ["The platform keeps the journey short and predictable.", "Service pages feed directly into the admin inquiry pipeline."],
  },
  {
    slug: "vendor-network",
    title: "Vendor Network",
    summary: "An overview of the verified installer network behind the platform.",
    heroTitle: "A verified vendor network",
    heroDescription:
      "Use this page to explain how installers are selected, reviewed, and matched to service requirements.",
    highlights: ["Verified installers", "Coverage by region", "Service routing"],
    details: ["The network should feel curated rather than open-ended.", "Admin review remains the control point for quality and follow-up."],
  },
  {
    slug: "financing-options",
    title: "Financing Options",
    summary: "A clear overview of EMI, loan, and cash purchase planning.",
    heroTitle: "Financing options explained clearly",
    heroDescription:
      "Help buyers compare upfront payment, loan-backed installation, and broader affordability planning.",
    highlights: ["EMI planning", "Loan support", "Cash versus financing"],
    details: ["The goal is to make financing part of the solar decision, not an afterthought.", "The calculator and EMI pages should stay aligned with this information."],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((page) => page.slug === slug) || (slug === "faqs" ? infoPages.find((page) => page.slug === "faq") || null : null);