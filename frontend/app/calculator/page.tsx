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

export default function CalculatorPage() {
  const { t } = useLocale();
  const [monthlyBill, setMonthlyBill] = useState(5000);
  const [roofSize, setRoofSize] = useState(600);
  const [city, setCity] = useState<keyof typeof citySunFactor>("Ahmedabad");
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");

  const result = useMemo(() => {
    const typeFactor = propertyType === "commercial" ? 1.2 : 1;
    const billBasedKw = (monthlyBill / 1000) * 1.15 * typeFactor;
    const roofBasedKw = roofSize / 100;
    const recommendedKw = Math.max(1, Math.min(billBasedKw, roofBasedKw));

    const panelCount = Math.ceil((recommendedKw * 1000) / 550);
    const annualSavings = recommendedKw * 18000 * citySunFactor[city];
    const investment = recommendedKw * 55000;
    const subsidy = propertyType === "residential" ? investment * 0.12 : 0;
    const netInvestment = investment - subsidy;
    const roiYears = netInvestment / annualSavings;

    return {
      recommendedKw,
      panelCount,
      annualSavings,
      roiYears,
    };
  }, [city, monthlyBill, propertyType, roofSize]);

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
            <ResultCard title={t("calculator.recommendedCapacity")} value={`${result.recommendedKw.toFixed(1)} kW`} />
            <ResultCard title={t("calculator.annualSavings")} value={`INR ${Math.round(result.annualSavings).toLocaleString("en-IN")}`} />
            <ResultCard title={t("calculator.panelCount")} value={`${result.panelCount} panels`} />
            <ResultCard title={t("calculator.expectedRoi")} value={`${result.roiYears.toFixed(1)} years`} />
          </div>
        </div>
      </div>
    </section>
  );
}

type ResultCardProps = {
  title: string;
  value: string;
};

function ResultCard({ title, value }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-amber-200/70 bg-linear-to-br from-amber-50 to-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
