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
    heroTitle: "Built to make solar buying transparent",
    heroDescription:
      "Solar Compare is a digital solar marketplace that helps homeowners and businesses evaluate options, estimate outcomes, and connect with verified vendors through a guided, data-led process.",
    highlights: ["Buyer-first comparison", "Verified vendor ecosystem", "Actionable savings intelligence"],
    details: ["Our platform combines calculator-led qualification, vendor discovery, and guided enquiry workflows into one practical journey.", "Every interaction is designed to reduce guesswork and improve decision confidence before installation."],
  },
  {
    slug: "contact-us",
    title: "Contact Us",
    summary: "Reach the team for help with solar comparison, proposals, and service inquiries.",
    heroTitle: "Talk to the Solar Compare team",
    heroDescription:
      "Connect with us for system comparison help, project planning, financing guidance, and proposal support across residential and commercial use cases.",
    highlights: ["Proposal assistance", "Technical guidance", "Commercial support"],
    details: ["Our operations team reviews each enquiry and routes it to the right specialist or admin desk.", "You can expect a structured follow-up with next steps based on your location and project intent."],
  },
  {
    slug: "blogs",
    title: "Blogs",
    summary: "Solar education, buying guidance, and market updates in one place.",
    heroTitle: "Solar intelligence for better buying decisions",
    heroDescription:
      "Explore practical, India-focused solar articles covering subsidies, ROI, net metering, financing, and implementation strategy.",
    highlights: ["Buying guides", "Policy updates", "ROI planning"],
    details: ["Each article is written to support real purchase and project decisions.", "We prioritize clarity, realism, and implementation-ready insight."],
  },
  {
    slug: "faq",
    title: "FAQ",
    summary: "Short answers to the questions buyers ask most often.",
    heroTitle: "Frequently asked solar questions",
    heroDescription:
      "Find concise answers to the most common questions buyers ask before going solar.",
    highlights: ["Cost and subsidy", "Net metering", "Installation and maintenance"],
    details: ["The FAQ section is designed to reduce uncertainty before raising a quote request.", "Answers are written for both first-time homeowners and commercial decision-makers."],
  },
  {
    slug: "how-it-works",
    title: "How It Works",
    summary: "A simple explanation of the buyer journey from comparison to inquiry.",
    heroTitle: "How Solar Compare works",
    heroDescription:
      "The workflow is designed to move from discovery to installation with minimal friction and full transparency.",
    highlights: ["Calculate", "Compare", "Install"],
    details: ["Each step is measurable and connected to the next action.", "Admin and vendor workflows are built to support timely follow-up and execution."],
  },
];

export const getInfoPage = (slug: string) => infoPages.find((page) => page.slug === slug) || (slug === "faqs" ? infoPages.find((page) => page.slug === "faq") || null : null);