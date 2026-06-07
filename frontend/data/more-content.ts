export type BlogPostCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageClassName: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HowItWorksStep = {
  key: string;
  title: string;
  description: string;
};

export const aboutOverview = {
  companyOverview:
    "Solar Compare is an India-focused solar marketplace platform that helps homeowners and businesses evaluate solar feasibility, compare quality equipment options, and connect with verified vendors through transparent workflows.",
  mission:
    "To simplify the solar buying journey with trustworthy data, practical guidance, and accountable execution support.",
  vision:
    "To become the most trusted digital decision platform for distributed solar adoption across Indian cities and growth regions.",
};

export const whyChooseSolarCompare = [
  "Verified vendor ecosystem with quality screening and service-area mapping.",
  "Calculator-led discovery so users understand savings, subsidy, and payback before taking action.",
  "Structured lead and notification workflows that improve response quality and turnaround.",
  "Transparent, practical guidance built for real Indian tariff and policy conditions.",
];

export const homeownerBenefits = [
  "Understand likely monthly savings before speaking to vendors.",
  "Compare panel options and financing paths without sales pressure.",
  "Get proposal support with clear subsidy and investment visibility.",
  "Track follow-ups and consultation progress from a single account view.",
];

export const businessBenefits = [
  "Evaluate energy cost reduction opportunities for offices, factories, and commercial rooftops.",
  "Assess capex versus financing models using practical EMI and ROI outputs.",
  "Share structured requirements to reduce back-and-forth during procurement.",
  "Route qualified enquiries to vendors aligned with project geography and scale.",
];

export const platformStats = [
  { label: "Vendor Service Areas Mapped", value: "250+" },
  { label: "Buyer Workflows Completed", value: "10,000+" },
  { label: "Solar Leads & Quote Intents", value: "4,000+" },
  { label: "States with Active User Interest", value: "20+" },
];

export const blogPosts: BlogPostCard[] = [
  {
    slug: "solar-subsidy-guide",
    title: "Solar Subsidy Guide for Indian Homeowners",
    excerpt: "Understand central subsidy basics, eligibility patterns, and how subsidy changes impact your net investment planning.",
    category: "Policy",
    readTime: "6 min read",
    imageClassName: "from-emerald-500/80 via-emerald-600/80 to-teal-700/80",
  },
  {
    slug: "solar-panel-buying-guide",
    title: "Solar Panel Buying Guide: What Actually Matters",
    excerpt: "Learn how to compare panel efficiency, degradation, warranty terms, and brand reliability before finalizing procurement.",
    category: "Buying Guide",
    readTime: "8 min read",
    imageClassName: "from-sky-500/80 via-blue-600/80 to-indigo-700/80",
  },
  {
    slug: "net-metering-explained",
    title: "Net Metering Explained in Simple Terms",
    excerpt: "A clear walkthrough of export-import units, billing behavior, and why DISCOM rules matter in ROI planning.",
    category: "Explainer",
    readTime: "5 min read",
    imageClassName: "from-cyan-500/80 via-cyan-600/80 to-blue-700/80",
  },
  {
    slug: "residential-solar-roi",
    title: "Residential Solar ROI: How to Evaluate Payback",
    excerpt: "Use tariff, generation assumptions, subsidy and financing context to estimate realistic payback for home rooftops.",
    category: "ROI",
    readTime: "7 min read",
    imageClassName: "from-amber-500/80 via-orange-600/80 to-rose-700/80",
  },
  {
    slug: "commercial-solar-benefits",
    title: "Commercial Solar Benefits Beyond Electricity Savings",
    excerpt: "See how commercial installations improve operating margins, energy visibility, and long-term sustainability positioning.",
    category: "Commercial",
    readTime: "7 min read",
    imageClassName: "from-violet-500/80 via-fuchsia-600/80 to-pink-700/80",
  },
  {
    slug: "pm-surya-ghar-updates",
    title: "PM Surya Ghar Updates: What Buyers Should Track",
    excerpt: "Key updates to watch in subsidy communication, application sequencing, and documentation readiness for faster approval.",
    category: "Updates",
    readTime: "4 min read",
    imageClassName: "from-lime-500/80 via-green-600/80 to-emerald-700/80",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "How much does a rooftop solar system cost in India?",
    answer:
      "Typical residential pricing varies by system size, panel type, inverter quality, and installation complexity. A common planning range is around INR 50,000-60,000 per kW before subsidy and financing adjustments.",
  },
  {
    question: "Is subsidy available for all solar projects?",
    answer:
      "Subsidy is usually applicable to eligible residential categories and depends on the current policy framework. Commercial and industrial projects generally follow different economics focused on tariff savings and tax treatment.",
  },
  {
    question: "What is net metering and why is it important?",
    answer:
      "Net metering allows exported solar electricity to be adjusted against imported units from the grid. It directly influences monthly bill reduction and should be factored into your payback estimate.",
  },
  {
    question: "How long does solar installation take after approval?",
    answer:
      "For standard residential rooftops, installation typically takes a few days after site readiness and procurement. End-to-end timelines vary by vendor scheduling, local approvals, and utility processes.",
  },
  {
    question: "How much maintenance does a solar plant require?",
    answer:
      "Routine cleaning, periodic electrical checks, and occasional preventive maintenance are usually sufficient. Most systems are low-maintenance but should be monitored for generation consistency.",
  },
  {
    question: "What warranty coverage should I expect?",
    answer:
      "Panel products commonly include long performance warranties, while inverters and installation workmanship have separate warranty terms. Always review product and service warranties together.",
  },
  {
    question: "Can I install solar on EMI financing?",
    answer:
      "Yes, financing options are available in many cases. EMI suitability depends on loan amount, interest rate, tenure, and your expected monthly savings from solar generation.",
  },
  {
    question: "What is a normal payback period for rooftop solar?",
    answer:
      "Payback can vary by tariff, generation, subsidy eligibility, and financing structure. Many projects target a payback window in the mid single digits to low double digits depending on usage profile.",
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    key: "calculate",
    title: "Calculate Savings",
    description: "Enter your usage profile and location context to estimate system sizing, savings, subsidy, and payback potential.",
  },
  {
    key: "compare",
    title: "Compare Panels",
    description: "Review panel options and key technical differences so your shortlist is based on performance and reliability, not only price.",
  },
  {
    key: "proposal",
    title: "Request Proposal",
    description: "Submit your verified requirements with prefilled estimates to accelerate proposal quality and reduce repetitive data collection.",
  },
  {
    key: "connect",
    title: "Connect With Vendors",
    description: "Get matched with relevant vendors by geography and project intent, then coordinate consultation and commercial discussions.",
  },
  {
    key: "install",
    title: "Install & Save",
    description: "Finalize execution, monitor generation, and begin realizing monthly savings and long-term return from your rooftop asset.",
  },
];
