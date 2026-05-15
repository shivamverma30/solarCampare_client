"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/locale-provider";

type PropertyType = "residential" | "commercial";

const citySunFactor: Record<string, number> = {
  Ahmedabad: 1.08,
  Bengaluru: 1.02,
  Delhi: 0.96,
  Jaipur: 1.1,
  Mumbai: 0.95,
  Pune: 1.0,
};

// State-wise subsidy data
const stateSubsidies: Record<string, { central: number; state: number }> = {
  Rajasthan: { central: 78000, state: 50000 },
  Gujarat: { central: 78000, state: 40000 },
  MP: { central: 78000, state: 30000 },
  Maharashtra: { central: 78000, state: 20000 },
  UP: { central: 78000, state: 20000 },
  Delhi: { central: 78000, state: 10000 },
  Karnataka: { central: 78000, state: 15000 },
  TamilNadu: { central: 78000, state: 10000 },
  Bihar: { central: 78000, state: 5000 },
  WestBengal: { central: 78000, state: 5000 },
  other: { central: 30000, state: 0 },
};

export default function CalculatorPage() {
  const { t } = useLocale();
  const [monthlyBill, setMonthlyBill] = useState(5000);
  const [roofSize, setRoofSize] = useState(600);
  const [city, setCity] = useState<keyof typeof citySunFactor>("Ahmedabad");
  const [state, setState] = useState("Rajasthan");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");

  const result = useMemo(() => {
    if (!monthlyBill) return null;

    const typeFactor = propertyType === "commercial" ? 1.2 : 1;
    const billBasedKw = (monthlyBill / 1000) * 1.15 * typeFactor;
    const roofBasedKw = roofSize / 100;
    const recommendedKw = Math.max(1, Math.min(billBasedKw, roofBasedKw));

    const panelCount = Math.ceil((recommendedKw * 1000) / 550);
    const annualSavings = recommendedKw * 18000 * citySunFactor[city];
    const investment = recommendedKw * 55000;

    // Calculate subsidy
    const stateData = stateSubsidies[state] || stateSubsidies.other;
    let totalSubsidy = 0;

    if (propertyType === "residential") {
      // Central subsidy (capped per kW size)
      let centralSubsidy = 0;
      if (recommendedKw <= 2) {
        centralSubsidy = 30000;
      } else if (recommendedKw <= 3) {
        centralSubsidy = 60000;
      } else {
        centralSubsidy = Math.min(78000, recommendedKw * 26000);
      }

      // Add state subsidy
      const stateSubsidy = Math.min(stateData.state, investment - centralSubsidy);
      totalSubsidy = centralSubsidy + stateSubsidy;
    }

    const netInvestment = Math.max(0, investment - totalSubsidy);
    const roiYears = netInvestment > 0 ? netInvestment / annualSavings : 0;
    const savings25yr = annualSavings * 25 * 1.05;

    return {
      recommendedKw,
      panelCount,
      annualSavings,
      roiYears,
      investment,
      totalSubsidy,
      netInvestment,
      savings25yr,
    };
  }, [city, monthlyBill, propertyType, roofSize, state]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">{t("calculator.eyebrow")}</p>
        <h1 className="mt-3 text-4xl text-slate-900">{t("calculator.title")}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              {t("calculator.monthlyBill")}
              <input
                type="number"
                min={0}
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(Number(event.target.value))}
                placeholder="e.g. 5000"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("calculator.roofSize")}
              <input
                type="number"
                min={0}
                value={roofSize}
                onChange={(event) => setRoofSize(Number(event.target.value))}
                placeholder="e.g. 600"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              State
              <select
                value={state}
                onChange={(event) => setState(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
              >
                {Object.keys(stateSubsidies).map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName === "other" ? "Other" : stateName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("calculator.city")}
              <select
                value={city}
                onChange={(event) => setCity(event.target.value as keyof typeof citySunFactor)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
              >
                {Object.keys(citySunFactor).map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("calculator.propertyType")}
              <select
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value as PropertyType)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
              >
                <option value="residential">{t("calculator.residential")}</option>
                <option value="commercial">{t("calculator.commercial")}</option>
              </select>
            </label>
          </div>

          <div className="grid content-start gap-4">
            {result ? (
              <>
                <ResultCard
                  title={t("calculator.recommendedCapacity")}
                  value={`${result.recommendedKw.toFixed(1)} kW`}
                />
                <ResultCard
                  title={t("calculator.panelCount")}
                  value={`${result.panelCount} panels`}
                />
                <ResultCard
                  title="Est. System Cost"
                  value={`₹${Math.round(result.investment).toLocaleString("en-IN")}`}
                  accent
                />
                <ResultCard
                  title="Govt. Subsidy"
                  value={`₹${Math.round(result.totalSubsidy).toLocaleString("en-IN")}`}
                  accent
                />
                <ResultCard
                  title="Your Net Cost"
                  value={`₹${Math.round(result.netInvestment).toLocaleString("en-IN")}`}
                  accent
                />
                <ResultCard
                  title={t("calculator.expectedRoi")}
                  value={`${result.roiYears.toFixed(1)} years`}
                />
                <ResultCard
                  title="25-Year Savings"
                  value={`₹${Math.round(result.savings25yr).toLocaleString("en-IN")}`}
                  highlight
                />
              </>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
                <p className="text-slate-600">Enter details to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

type ResultCardProps = {
  title: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
};

function ResultCard({ title, value, accent, highlight }: ResultCardProps) {
  const bgClass = highlight
    ? "border-emerald-200/70 bg-linear-to-br from-emerald-50 to-white"
    : accent
      ? "border-amber-200/50 bg-linear-to-br from-amber-25 to-white"
      : "border-amber-200/70 bg-linear-to-br from-amber-50 to-white";

  const titleClass = highlight ? "text-emerald-600" : "text-slate-600";

  return (
    <div className={`rounded-2xl border ${bgClass} p-5 shadow-sm`}>
      <p className={`text-xs uppercase tracking-widest ${titleClass}`}>{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
