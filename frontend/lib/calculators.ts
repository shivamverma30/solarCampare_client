export type PropertyType = "residential" | "commercial" | "agriculture";

export const citySunFactor = {
  Ahmedabad: 1.08,
  Bengaluru: 1.02,
  Delhi: 0.96,
  Jaipur: 1.1,
  Mumbai: 0.95,
  Pune: 1.0,
} as const;

export const citySunHours = {
  Ahmedabad: 4.9,
  Bengaluru: 4.4,
  Delhi: 4.6,
  Jaipur: 5.1,
  Mumbai: 4.3,
  Pune: 4.7,
} as const;

export const stateSubsidies = {
  Rajasthan: { central: 78000, state: 50000, tariff: 8.8, sunHours: 5.1 },
  Gujarat: { central: 78000, state: 40000, tariff: 7.6, sunHours: 4.9 },
  MP: { central: 78000, state: 30000, tariff: 7.9, sunHours: 4.8 },
  Maharashtra: { central: 78000, state: 20000, tariff: 9.0, sunHours: 4.7 },
  UP: { central: 78000, state: 20000, tariff: 8.2, sunHours: 4.5 },
  Delhi: { central: 78000, state: 10000, tariff: 8.9, sunHours: 4.6 },
  Karnataka: { central: 78000, state: 15000, tariff: 8.4, sunHours: 4.5 },
  TamilNadu: { central: 78000, state: 10000, tariff: 8.5, sunHours: 4.6 },
  Bihar: { central: 78000, state: 5000, tariff: 7.4, sunHours: 4.4 },
  WestBengal: { central: 78000, state: 5000, tariff: 7.8, sunHours: 4.3 },
  other: { central: 30000, state: 0, tariff: 8.0, sunHours: 4.5 },
} as const;

export type SolarCity = keyof typeof citySunFactor;
export type SolarState = keyof typeof stateSubsidies;

export type SolarInputs = {
  monthlyBill: number;
  roofSize: number;
  city: SolarCity;
  state: SolarState;
  propertyType: PropertyType;
  electricityTariff?: number;
  consumptionUnits?: number;
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
  consumptionUnitsMonthly: number;
  co2SavingsKg: number;
  treesEquivalent: number;
  sunHours: number;
  yearlyProjection: Array<{ year: number; cumulativeSavings: number; cumulativeCost: number }>;
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
  if (inputs.roofSize <= 0) errors.push("Roof size must be greater than zero.");

  return errors;
}

export function calculateSolarEstimate(inputs: SolarInputs): SolarEstimate {
  const typeFactor = inputs.propertyType === "commercial" ? 1.2 : inputs.propertyType === "agriculture" ? 1.1 : 1;
  const stateData = stateSubsidies[inputs.state] || stateSubsidies.other;
  const electricityTariff = inputs.electricityTariff || stateData.tariff;
  const sunHours = stateData.sunHours || citySunHours[inputs.city] || 4.5;
  const consumptionUnitsMonthly = Math.max(0, inputs.consumptionUnits || (inputs.monthlyBill / Math.max(electricityTariff, 1)));
  const performanceRatio = inputs.propertyType === "commercial" ? 0.78 : inputs.propertyType === "agriculture" ? 0.8 : 0.82;
  const billBasedKw = consumptionUnitsMonthly / Math.max(1, sunHours * 30 * performanceRatio * typeFactor);
  const roofBasedKw = inputs.roofSize / 95;
  const recommendedKw = Math.max(1, Math.min(billBasedKw, roofBasedKw));
  const panelCount = Math.ceil((recommendedKw * 1000) / 550);
  const annualGenerationUnits = recommendedKw * sunHours * 365 * performanceRatio;
  const annualEnergyValue = annualGenerationUnits * electricityTariff;
  const investment = recommendedKw * 55000;

  let totalSubsidy = 0;

  if (inputs.propertyType === "residential") {
    let centralSubsidy = 0;

    if (recommendedKw <= 2) {
      centralSubsidy = 30000;
    } else if (recommendedKw <= 3) {
      centralSubsidy = 60000;
    } else {
      centralSubsidy = Math.min(78000, recommendedKw * 26000);
    }

    const stateSubsidy = Math.min(stateData.state, investment - centralSubsidy);
    totalSubsidy = Math.max(0, centralSubsidy + stateSubsidy);
  } else if (inputs.propertyType === "agriculture") {
    totalSubsidy = Math.min(investment * 0.18, 78000);
  }

  const netInvestment = Math.max(0, investment - totalSubsidy);
  const annualSavings = Math.min(inputs.monthlyBill, annualEnergyValue * 0.9);
  const roiYears = annualSavings > 0 ? netInvestment / annualSavings : 0;
  const roiPercent = netInvestment > 0 ? (annualSavings / netInvestment) * 100 : 0;
  const monthlySavings = annualSavings / 12;
  const savings25yr = annualSavings * 25 * 1.05;
  const annualSavings5yr = annualSavings * 5 * 1.05;
  const annualSavings10yr = annualSavings * 10 * 1.05;
  const paybackMonths = roiYears * 12;
  const co2SavingsKg = annualGenerationUnits * 0.82;
  const treesEquivalent = co2SavingsKg / 21;

  const yearlyProjection = Array.from({ length: 5 }, (_, index) => {
    const year = index + 1;
    return {
      year,
      cumulativeSavings: annualSavings * year * (1 + ((year - 1) * 0.05)),
      cumulativeCost: netInvestment > 0 ? Math.min(netInvestment, (netInvestment / 5) * year) : 0,
    };
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
    consumptionUnitsMonthly,
    co2SavingsKg,
    treesEquivalent,
    sunHours,
    yearlyProjection,
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