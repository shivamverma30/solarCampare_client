export type ServicePage = {
  slug: string;
  title: string;
  summary: string;
  heroTitle: string;
  heroDescription: string;
  benefits: string[];
  useCases: string[];
};

export const servicePages: ServicePage[] = [
  {
    slug: "residential-solar",
    title: "Residential Solar",
    summary: "Solar planning for homes that want lower electricity bills and a clean, reliable setup.",
    heroTitle: "Residential solar built for Indian homes",
    heroDescription:
      "Compare rooftop options, understand likely savings, and submit a single inquiry for a tailored home solar recommendation.",
    benefits: ["Lower monthly electricity cost", "Cleaner energy for everyday usage", "Clear subsidy and financing context"],
    useCases: ["Independent houses", "Apartments with terrace access", "Family homes planning for net metering"],
  },
  {
    slug: "industrial-solar",
    title: "Industrial Solar",
    summary: "High-capacity solar planning for factories, warehouses, and plants.",
    heroTitle: "Industrial solar for high-load businesses",
    heroDescription:
      "Designed for large rooftops and high-consumption sites that need a practical path to energy cost control.",
    benefits: ["Reduce operating expenses", "Plan large rooftop or ground-mounted systems", "Improve long-term energy stability"],
    useCases: ["Factories", "Warehouses", "Logistics parks and processing units"],
  },
  {
    slug: "solar-loan",
    title: "Solar Loan",
    summary: "Financing guidance for buyers who want to spread project cost through EMIs.",
    heroTitle: "Solar loan support without the noise",
    heroDescription:
      "See how financing can fit your project before you commit, with a clear view of repayment and savings.",
    benefits: ["Lower upfront burden", "Structured monthly payments", "Easier adoption for residential and commercial buyers"],
    useCases: ["Budget-conscious homeowners", "SMEs planning staged capex", "Buyers comparing cash versus EMI"],
  },
  {
    slug: "solar-cleaning",
    title: "Solar Cleaning",
    summary: "Maintenance support to keep panels performing at a healthy output level.",
    heroTitle: "Solar cleaning that protects output",
    heroDescription:
      "A clean system performs better. Use this service when dust, debris, or weather exposure is affecting generation.",
    benefits: ["Protects power generation", "Reduces output loss from dust", "Improves inspection readiness"],
    useCases: ["Homes near dust-heavy roads", "Commercial rooftops", "Sites with seasonal soiling"],
  },
  {
    slug: "ground-mounted-solar",
    title: "Ground Mounted Solar",
    summary: "Large-format solar deployments for sites with available land.",
    heroTitle: "Ground mounted solar for larger sites",
    heroDescription:
      "Ideal when rooftop space is limited and land-based installation offers a better scale and layout.",
    benefits: ["Better scaling for large projects", "Flexible layout planning", "Suitable for commercial and institutional land"],
    useCases: ["Institutions", "Industries with open land", "Large campuses and storage yards"],
  },
  {
    slug: "solar-maintenance",
    title: "Solar Maintenance",
    summary: "Ongoing upkeep for installed solar systems that need dependable care.",
    heroTitle: "Maintenance that keeps systems dependable",
    heroDescription:
      "Use this service for inspection, performance checks, corrective work, and long-term system care.",
    benefits: ["Health checks for system performance", "Better issue detection", "Supports long-term asset value"],
    useCases: ["Existing solar owners", "Commercial asset managers", "Sites needing periodic inspection"],
  },
];

export const getServicePage = (slug: string) => servicePages.find((service) => service.slug === slug) || null;