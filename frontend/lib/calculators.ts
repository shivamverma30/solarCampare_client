export type PropertyType = "residential" | "commercial" | "agriculture";

export const solarStateProfiles = {
  AndhraPradesh: { tariff: 7.8, sunHours: 5.0, discom: "APSPDCL / APEPDCL" },
  ArunachalPradesh: { tariff: 7.2, sunHours: 4.2, discom: "APEDA / Local DISCOM" },
  Assam: { tariff: 7.6, sunHours: 4.3, discom: "APDCL" },
  Bihar: { tariff: 7.4, sunHours: 4.4, discom: "NBPDCL / SBPDCL" },
  Chhattisgarh: { tariff: 7.7, sunHours: 4.8, discom: "CSPDCL" },
  Goa: { tariff: 8.4, sunHours: 4.6, discom: "Goa Electricity Dept." },
  Gujarat: { tariff: 7.6, sunHours: 4.9, discom: "GSECL / Torrent Power" },
  Haryana: { tariff: 8.7, sunHours: 4.6, discom: "DHBVN / UHBVN" },
  HimachalPradesh: { tariff: 7.9, sunHours: 4.1, discom: "HPSEBL" },
  Jharkhand: { tariff: 7.5, sunHours: 4.4, discom: "JBVNL" },
  Karnataka: { tariff: 8.4, sunHours: 4.5, discom: "BESCOM / MESCOM" },
  Kerala: { tariff: 8.9, sunHours: 4.2, discom: "KSEB" },
  MadhyaPradesh: { tariff: 7.9, sunHours: 4.8, discom: "MPPKVVCL / MPEB" },
  Maharashtra: { tariff: 9.0, sunHours: 4.7, discom: "MSEDCL / Adani / Tata Power" },
  Manipur: { tariff: 7.3, sunHours: 4.0, discom: "MSPDCL" },
  Meghalaya: { tariff: 7.5, sunHours: 4.1, discom: "MeECL" },
  Mizoram: { tariff: 7.2, sunHours: 4.0, discom: "Power & Electricity Dept." },
  Nagaland: { tariff: 7.3, sunHours: 4.1, discom: "NPDCL" },
  Odisha: { tariff: 7.8, sunHours: 4.6, discom: "TPNODL / TPWODL" },
  Punjab: { tariff: 8.8, sunHours: 4.5, discom: "PSPCL" },
  Rajasthan: { tariff: 8.8, sunHours: 5.1, discom: "JVVNL / AVVNL / JdVVNL" },
  Sikkim: { tariff: 7.4, sunHours: 4.1, discom: "SEDCL" },
  TamilNadu: { tariff: 8.5, sunHours: 4.6, discom: "TANGEDCO" },
  Telangana: { tariff: 8.3, sunHours: 4.7, discom: "TSSPDCL / TSNPDCL" },
  Tripura: { tariff: 7.2, sunHours: 4.0, discom: "TSECL" },
  UttarPradesh: { tariff: 8.2, sunHours: 4.5, discom: "UPPCL" },
  Uttarakhand: { tariff: 8.0, sunHours: 4.3, discom: "UPCL" },
  WestBengal: { tariff: 7.8, sunHours: 4.3, discom: "WBSEDCL" },
  Delhi: { tariff: 8.9, sunHours: 4.6, discom: "BSES / Tata Power-DDL" },
  other: { tariff: 8.0, sunHours: 4.5, discom: "Local DISCOM" },
} as const;

export const stateSubsidies = solarStateProfiles;

export type SolarState = keyof typeof solarStateProfiles;

export type SolarInputs = {
  monthlyBill: number;
  state: SolarState;
  propertyType: PropertyType;
};

export type SolarEstimate = {
  recommendedKw: number;
  panelCount: number;
  annualSavings: number;
  roiYears: number;
  roiPercent: number;
  investment: number;
  totalSubsidy: number;
  netInvestment: number;
  monthlySavings: number;
  annualSavings5yr: number;
  annualSavings10yr: number;
  savings25yr: number;
  paybackMonths: number;
  annualGenerationUnits: number;
  electricityTariff: number;
  annualEnergyValue: number;
  co2SavingsKg: number;
  sunHours: number;
  yearlyProjection: Array<{ year: number; opening: number; principal: number; interest: number; closing: number }>;
  stateDiscom: string;
};

export type EmiInputs = {
  cost: number;
  downPayment: number;
  interest: number;
  years: number;
};

export type EmiEstimate = {
  principal: number;
  monthlyRate: number;
  months: number;
  emi: number;
  totalPayable: number;
  totalInterest: number;
  upfrontShare: number;
  financeShare: number;
  annualOutgo: number;
};

export function formatCurrency(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function validateSolarInputs(inputs: SolarInputs): string[] {
  const errors: string[] = [];

  if (inputs.monthlyBill <= 0) errors.push("Monthly bill must be greater than zero.");

  return errors;
}

export function calculateSolarEstimate(inputs: SolarInputs): SolarEstimate {
  const stateData = solarStateProfiles[inputs.state] || solarStateProfiles.other;
  const electricityTariff = stateData.tariff;
  const sunHours = stateData.sunHours;
  const rawKw = inputs.monthlyBill / (electricityTariff * sunHours * 30);
  const recommendedKw = Math.max(1, Math.round(rawKw * 10) / 10);
  const panelCount = Math.ceil((recommendedKw * 1000) / 550);
  const annualGenerationUnits = recommendedKw * sunHours * 365;
  const annualEnergyValue = annualGenerationUnits * electricityTariff;
  const investmentPerKw = inputs.propertyType === "agriculture" ? 45000 : 55000;
  const investment = recommendedKw * investmentPerKw;

  const firstTwoKw = Math.min(recommendedKw, 2);
  const nextOneKw = Math.min(Math.max(recommendedKw - 2, 0), 1);
  const calculatedSubsidy = Math.min(78000, Math.round(firstTwoKw * 30000 + nextOneKw * 18000));
  const totalSubsidy = inputs.propertyType === "commercial"
    ? 0
    : inputs.propertyType === "agriculture"
      ? Math.round(investment * 0.6)
      : calculatedSubsidy;

  const netInvestment = Math.max(0, investment - totalSubsidy);
  const annualSavings = annualEnergyValue;
  const monthlySavings = annualSavings / 12;
  const roiYears = monthlySavings > 0 ? netInvestment / monthlySavings / 12 : 0;
  const roiPercent = netInvestment > 0 ? (annualSavings / netInvestment) * 100 : 0;
  const annualSavings5yr = annualSavings * 5;
  const annualSavings10yr = annualSavings * 10;
  const savings25yr = annualSavings * 21.6 + 30000 + (recommendedKw < 3 ? 30000 : 0);
  const paybackMonths = roiYears * 12;
  const co2SavingsKg = annualGenerationUnits * 0.8;

  const yearlyProjection = Array.from({ length: 5 }, (_, index) => {
    const year = index + 1;
    const opening = Math.max(0, netInvestment - (netInvestment / 5) * (year - 1));
    const principal = Math.min(netInvestment, netInvestment / 5);
    const interest = Math.max(0, annualSavings - principal);
    const closing = Math.max(0, netInvestment - (netInvestment / 5) * year);
    return { year, opening, principal, interest, closing };
  });

  return {
    recommendedKw,
    panelCount,
    annualSavings,
    roiYears,
    roiPercent,
    investment,
    totalSubsidy,
    netInvestment,
    monthlySavings,
    annualSavings5yr,
    annualSavings10yr,
    savings25yr,
    paybackMonths,
    annualGenerationUnits,
    electricityTariff,
    annualEnergyValue,
    co2SavingsKg,
    sunHours,
    yearlyProjection,
    stateDiscom: stateData.discom,
  };
}

export function validateEmiInputs(inputs: EmiInputs): string[] {
  const errors: string[] = [];

  if (inputs.cost <= 0) errors.push("Project cost must be greater than zero.");
  if (inputs.downPayment < 0) errors.push("Down payment cannot be negative.");
  if (inputs.downPayment > inputs.cost) errors.push("Down payment cannot exceed the project cost.");
  if (inputs.interest < 0) errors.push("Interest rate cannot be negative.");
  if (inputs.years <= 0) errors.push("Tenure must be at least one year.");

  return errors;
}

export function calculateEmiEstimate(inputs: EmiInputs): EmiEstimate {
  const principal = Math.max(0, inputs.cost - inputs.downPayment);
  const monthlyRate = inputs.interest / 12 / 100;
  const months = Math.max(1, inputs.years * 12);

  let emi = 0;

  if (principal > 0) {
    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      const factor = (1 + monthlyRate) ** months;
      emi = (principal * monthlyRate * factor) / (factor - 1);
    }
  }

  const totalPayable = emi * months;
  const totalInterest = Math.max(0, totalPayable - principal);

  return {
    principal,
    monthlyRate,
    months,
    emi,
    totalPayable,
    totalInterest,
    upfrontShare: inputs.cost > 0 ? (inputs.downPayment / inputs.cost) * 100 : 0,
    financeShare: inputs.cost > 0 ? (principal / inputs.cost) * 100 : 0,
    annualOutgo: emi * 12,
  };
}