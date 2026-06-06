"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Download,
  Factory,
  House,
  MapPin,
  ShieldCheck,
  Sparkles,
  Tractor,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";
import {
  calculateSolarEstimate,
  citySunFactor,
  formatCurrency,
  stateSubsidies,
  type PropertyType,
  type SolarCity,
  type SolarState,
  validateSolarInputs,
} from "@/lib/calculators";

const stateNames = Object.keys(stateSubsidies) as SolarState[];
const cityNames = Object.keys(citySunFactor) as SolarCity[];

const defaultInputs = {
  monthlyBill: 3000,
  roofSize: 600,
  city: "Ahmedabad" as SolarCity,
  state: "Maharashtra" as SolarState,
  propertyType: "residential" as PropertyType,
};

const propertyOptions: Array<{ value: PropertyType; label: string; hint: string; icon: React.ReactNode }> = [
  { value: "residential", label: "Residential", hint: "Homes and apartments", icon: <House className="h-4 w-4" /> },
  { value: "commercial", label: "Commercial", hint: "Offices and retail", icon: <Factory className="h-4 w-4" /> },
  { value: "agriculture", label: "Agriculture", hint: "Farms and irrigation sites", icon: <Tractor className="h-4 w-4" /> },
];

export default function CalculatorPage() {
  const { t } = useLocale();
  const [monthlyBill, setMonthlyBill] = useState(defaultInputs.monthlyBill);
  const [roofSize, setRoofSize] = useState(defaultInputs.roofSize);
  const [city, setCity] = useState<SolarCity>(defaultInputs.city);
  const [state, setState] = useState<SolarState>(defaultInputs.state);
  const [propertyType, setPropertyType] = useState<PropertyType>(defaultInputs.propertyType);
  const [electricityTariff, setElectricityTariff] = useState<number>(stateSubsidies[defaultInputs.state].tariff);
  const [consumptionUnits, setConsumptionUnits] = useState<number | "">("");
  const [savingHistory, setSavingHistory] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteName, setQuoteName] = useState("");
  const [quoteEmail, setQuoteEmail] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quotePincode, setQuotePincode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setElectricityTariff(stateSubsidies[state].tariff);
  }, [state]);

  const result = useMemo(
    () =>
      calculateSolarEstimate({
        monthlyBill,
        roofSize,
        city,
        state,
        propertyType,
        electricityTariff,
        consumptionUnits: consumptionUnits === "" ? undefined : consumptionUnits,
      }),
    [city, consumptionUnits, electricityTariff, monthlyBill, propertyType, roofSize, state]
  );

  const validationErrors = useMemo(
    () => validateSolarInputs({ monthlyBill, roofSize, city, state, propertyType }),
    [city, monthlyBill, propertyType, roofSize, state]
  );

  const backendPropertyType = propertyType === "agriculture" ? "commercial" : propertyType;

  const summaryLines = [
    "Solar estimate summary",
    `Capacity: ${result.recommendedKw.toFixed(1)} kW`,
    `Panels: ${result.panelCount}`,
    `Estimated investment: ${formatCurrency(result.investment)}`,
    `Subsidy: ${formatCurrency(result.totalSubsidy)}`,
    `Net cost: ${formatCurrency(result.netInvestment)}`,
    `Annual savings: ${formatCurrency(result.annualSavings)}`,
    `Payback period: ${result.roiYears.toFixed(1)} years`,
    `CO2 savings: ${Math.round(result.co2SavingsKg).toLocaleString("en-IN")} kg`,
  ].join("\n");

  const handleCopySummary = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(summaryLines);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Recommended Capacity", `${result.recommendedKw.toFixed(1)} kW`],
      ["Panel Count", String(result.panelCount)],
      ["Estimated Investment", String(Math.round(result.investment))],
      ["Subsidy", String(Math.round(result.totalSubsidy))],
      ["Net Cost", String(Math.round(result.netInvestment))],
      ["Annual Savings", String(Math.round(result.annualSavings))],
      ["Payback Years", result.roiYears.toFixed(2)],
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "solar-estimate.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveHistory = async () => {
    const token = getToken();
    if (!token) {
      setMessage("Sign in to save calculator history.");
      return;
    }

    setSavingHistory(true);
    const response = await apiClient.calculators.saveHistory(
      token,
      "solar",
      {
        monthlyBill,
        roofSize,
        city,
        state,
        propertyType: backendPropertyType,
      },
      {
        recommendedKw: result.recommendedKw,
        panelCount: result.panelCount,
        annualSavings: result.annualSavings,
        roiYears: result.roiYears,
        investment: result.investment,
        totalSubsidy: result.totalSubsidy,
        netInvestment: result.netInvestment,
        monthlySavings: result.monthlySavings,
        savings25yr: result.savings25yr,
        paybackMonths: result.paybackMonths,
        annualGenerationUnits: result.annualGenerationUnits,
      }
    );

    setMessage(response.success ? "Calculation saved to history." : response.error || "Unable to save history.");
    setSavingHistory(false);
  };

  const handleQuoteRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setQuoteSubmitting(true);
    setMessage("");

    const response = await apiClient.quotes.createQuote({
      fullName: quoteName,
      email: quoteEmail,
      phone: quotePhone,
      pincode: quotePincode,
      city,
      state,
      projectType: backendPropertyType,
      monthlyBill,
      roofSize,
      notes: `Solar estimate requested from calculator. Capacity ${result.recommendedKw.toFixed(1)} kW, net cost ${formatCurrency(result.netInvestment)}.`,
      metadata: {
        recommendedKw: result.recommendedKw,
        annualSavings: result.annualSavings,
        roiYears: result.roiYears,
        roiPercent: result.roiPercent,
        electricityTariff: result.electricityTariff,
        consumptionUnitsMonthly: result.consumptionUnitsMonthly,
        annualGenerationUnits: result.annualGenerationUnits,
        co2SavingsKg: result.co2SavingsKg,
        treesEquivalent: result.treesEquivalent,
      },
    });

    setMessage(response.success ? "Quote request submitted. Our team will contact you shortly." : response.error || "Unable to submit quote request.");
    setQuoteSubmitting(false);
  };

  const chartPoints = result.yearlyProjection;
  const maxChartValue = Math.max(...chartPoints.map((point) => point.cumulativeSavings), 1);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-4 rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">Solar Calculator</p>
          <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Estimate Your Solar Potential</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            A premium rooftop sizing, subsidy estimation, and payback experience with a layout tuned for serious buyers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveHistory}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ShieldCheck className="h-4 w-4" />
            {savingHistory ? "Saving..." : "Save history"}
          </button>
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Sparkles className="h-4 w-4" />
            Copy summary
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {validationErrors.length > 0 ? <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{validationErrors[0]}</div> : null}
      {message ? <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">{message}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Project inputs</p>
              <h2 className="mt-2 text-2xl text-slate-950">Tell us about your rooftop</h2>
            </div>
            <Calculator className="h-5 w-5 text-emerald-500" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {propertyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPropertyType(option.value)}
                className={`rounded-2xl border p-4 text-left transition ${
                  propertyType === option.value ? "border-emerald-400 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="text-emerald-600">{option.icon}</span>
                  <span className="font-semibold text-slate-900">{option.label}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{option.hint}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Monthly Electricity Bill" hint="Used to estimate system size and monthly savings.">
              <input
                type="number"
                min={500}
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
              <input type="range" min={500} max={50000} step={500} value={monthlyBill} onChange={(event) => setMonthlyBill(Number(event.target.value))} className="mt-3 w-full accent-emerald-500" />
            </Field>

            <Field label="Roof Size" hint="Approximate usable area in square feet.">
              <input
                type="number"
                min={80}
                value={roofSize}
                onChange={(event) => setRoofSize(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
              <input type="range" min={80} max={4000} step={20} value={roofSize} onChange={(event) => setRoofSize(Number(event.target.value))} className="mt-3 w-full accent-emerald-500" />
            </Field>

            <Field label="City" hint="Affects generation assumptions and savings projection.">
              <select
                value={city}
                onChange={(event) => setCity(event.target.value as SolarCity)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {cityNames.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="State / DISCOM" hint="Tariff and subsidy assumptions vary by state.">
              <select
                value={state}
                onChange={(event) => setState(event.target.value as SolarState)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {stateNames.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Electricity Tariff" hint="State tariff averages help tune savings more precisely.">
              <input
                type="number"
                min={1}
                step={0.1}
                value={electricityTariff}
                onChange={(event) => setElectricityTariff(Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </Field>

            <Field label="Estimated Monthly Consumption" hint="Override the bill-based estimate if you know your units.">
              <input
                type="number"
                min={0}
                value={consumptionUnits}
                onChange={(event) => setConsumptionUnits(event.target.value === "" ? "" : Number(event.target.value))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white"
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <InfoPill icon={<ShieldCheck className="h-4 w-4" />} label="Subsidy aware" value={formatCurrency(result.totalSubsidy)} />
            <InfoPill icon={<TrendingUp className="h-4 w-4" />} label="Projected payback" value={`${result.roiYears.toFixed(1)} years`} />
            <InfoPill icon={<Wallet className="h-4 w-4" />} label="Monthly savings" value={formatCurrency(result.monthlySavings)} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniMetric label="Tariff" value={`₹${result.electricityTariff.toFixed(1)}/kWh`} />
            <MiniMetric label="Consumption" value={`${Math.round(result.consumptionUnitsMonthly).toLocaleString("en-IN")} units`} />
            <MiniMetric label="Sun hours" value={`${result.sunHours.toFixed(1)} hrs/day`} />
            <MiniMetric label="CO2 savings" value={`${Math.round(result.co2SavingsKg).toLocaleString("en-IN")} kg/yr`} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Monthly bill</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(monthlyBill)}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Roof size</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{roofSize.toLocaleString("en-IN")} sq ft</p>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Savings projection</p>
                <h2 className="mt-2 text-2xl text-slate-950">Five-year outlook</h2>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-5">
              {chartPoints.map((point) => {
                const height = Math.max(18, Math.round((point.cumulativeSavings / maxChartValue) * 100));

                return (
                  <div key={point.year} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4 text-center">
                    <div className="flex h-36 items-end justify-center">
                      <div className="flex h-full w-8 items-end rounded-full bg-slate-200/70">
                        <div className="w-full rounded-full bg-emerald-500" style={{ height: `${height}%` }} />
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Year {point.year}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{formatCurrency(point.cumulativeSavings)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Calculated output</p>
                <h2 className="mt-2 text-2xl">Your solar recommendation</h2>
              </div>
              <Sparkles className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MetricCard title={t("calculator.recommendedCapacity")} value={`${result.recommendedKw.toFixed(1)} kW`} />
              <MetricCard title={t("calculator.panelCount")} value={`${result.panelCount} panels`} />
              <MetricCard title="Est. system cost" value={formatCurrency(result.investment)} />
              <MetricCard title="Govt. subsidy" value={formatCurrency(result.totalSubsidy)} />
              <MetricCard title="Net cost" value={formatCurrency(result.netInvestment)} />
              <MetricCard title={t("calculator.expectedRoi")} value={`${result.roiYears.toFixed(1)} years`} />
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-white/72">
                <span>Estimated annual generation</span>
                <span>{Math.round(result.annualGenerationUnits).toLocaleString("en-IN")} units</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${Math.min(100, Math.round(result.recommendedKw * 12))}%` }} />
              </div>
              <p className="mt-3 text-xs leading-5 text-white/58">Recommended capacity is based on current bill, roof space, and the selected location profile.</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricCard title="Annual energy value" value={formatCurrency(result.annualEnergyValue)} />
              <MetricCard title="ROI %" value={`${result.roiPercent.toFixed(1)}%`} />
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Next actions</p>
                <h2 className="mt-2 text-2xl text-slate-950">Move to proposal flow</h2>
              </div>
              <MapPin className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/emi?principal=${Math.max(0, Math.round(result.netInvestment))}`} className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Get Proposal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/compare" className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
                Compare Panels
              </Link>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Link href="/more/contact-us" className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100">
                Talk To Expert
              </Link>
              <Link href="/more/vendor-network" className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
                View Vendors
              </Link>
            </div>

            <form onSubmit={handleQuoteRequest} className="mt-6 space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Request a quote</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={quoteName} onChange={(event) => setQuoteName(event.target.value)} placeholder="Full name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                <input value={quoteEmail} onChange={(event) => setQuoteEmail(event.target.value)} placeholder="Email" type="email" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                <input value={quotePhone} onChange={(event) => setQuotePhone(event.target.value)} placeholder="Mobile" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                <input value={quotePincode} onChange={(event) => setQuotePincode(event.target.value)} placeholder="PIN code" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" />
              </div>
              <button type="submit" disabled={quoteSubmitting} className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60">
                {quoteSubmitting ? "Submitting..." : "Get quote"}
              </button>
            </form>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
            <ResultCard title="25-Year Savings" value={formatCurrency(result.savings25yr)} highlight />
            <ResultCard title="10-Year Savings" value={formatCurrency(result.annualSavings10yr)} />
            <ResultCard title="5-Year Savings" value={formatCurrency(result.annualSavings5yr)} />
            <ResultCard title="Payback Period" value={`${result.paybackMonths.toFixed(0)} months`} accent />
            <ResultCard title="Monthly Savings" value={formatCurrency(result.monthlySavings)} />
            <ResultCard title="Annual Savings" value={formatCurrency(result.annualSavings)} />
            <ResultCard title="CO2 Savings" value={`${Math.round(result.co2SavingsKg).toLocaleString("en-IN")} kg/yr`} />
            <ResultCard title="Trees Equivalent" value={`${Math.max(1, Math.round(result.treesEquivalent)).toLocaleString("en-IN")} trees`} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <div className="flex items-center gap-2">
        <span>{label}</span>
        <span className="inline-flex items-center text-slate-400" title={hint}>
          <Sparkles className="h-4 w-4" />
        </span>
      </div>
      {children}
    </label>
  );
}

function InfoPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{title}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
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
      ? "border-amber-200/60 bg-linear-to-br from-amber-50 to-white"
      : "border-slate-200 bg-white";

  const titleClass = highlight ? "text-emerald-600" : "text-slate-600";

  return (
    <div className={`rounded-2xl border ${bgClass} p-5 shadow-sm`}>
      <p className={`text-xs uppercase tracking-widest ${titleClass}`}>{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
