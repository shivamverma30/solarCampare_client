"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { stateSubsidies } from "@/lib/calculators";

type FlowStep = 1 | 2 | 3 | 4 | 5;
type UseCase = "residential" | "commercial" | "industrial" | null;
type BillBand = "below-5000" | "5000-10000" | "10000-25000" | "25000-plus" | null;
type Ownership = "own" | "rented" | null;
type RoofType = "rcc" | "metal" | "open-land" | null;
type StateName = keyof typeof stateSubsidies | "";

const stateOptions = Object.keys(stateSubsidies).filter((state) => state !== "other") as Array<Exclude<StateName, "">>;

const billOptions: Array<{ id: Exclude<BillBand, null>; label: string; hint: string; value: number }> = [
  { id: "below-5000", label: "Below Rs. 5,000", hint: "Small home or light load", value: 3500 },
  { id: "5000-10000", label: "Rs. 5,000 to Rs. 10,000", hint: "Typical residential or small office", value: 7500 },
  { id: "10000-25000", label: "Rs. 10,000 to Rs. 25,000", hint: "Large home or growing business", value: 17500 },
  { id: "25000-plus", label: "Rs. 25,000+", hint: "Commercial or industrial load", value: 35000 },
];

type FormState = {
  useCase: UseCase;
  billBand: BillBand;
  ownership: Ownership;
  roofType: RoofType;
  state: StateName;
  city: string;
  pincode: string;
};

function getBillLabel(band: BillBand) {
  return billOptions.find((option) => option.id === band)?.label || "";
}

function getBillValue(band: BillBand) {
  return billOptions.find((option) => option.id === band)?.value || 0;
}

function validateStep(step: FlowStep, data: FormState) {
  if (step === 1) {
    return data.useCase ? [] : ["Select a use case to continue."];
  }

  if (step === 2) {
    return data.billBand ? [] : ["Select your electricity bill band."];
  }

  if (step === 3) {
    const errors: string[] = [];

    if (!data.ownership) errors.push("Select ownership status.");
    if (!data.roofType) errors.push("Select roof type.");

    return errors;
  }

  if (step === 4) {
    const errors: string[] = [];

    if (!data.state) errors.push("Choose a state.");
    if (!data.city.trim()) errors.push("Enter your city.");
    if (!/^\d{6}$/.test(data.pincode.trim())) errors.push("Enter a valid 6-digit pincode.");

    return errors;
  }

  return [];
}

export default function SolarDiscoveryFlow() {
  const [step, setStep] = useState<FlowStep>(1);
  const [useCase, setUseCase] = useState<UseCase>(null);
  const [billBand, setBillBand] = useState<BillBand>(null);
  const [ownership, setOwnership] = useState<Ownership>(null);
  const [roofType, setRoofType] = useState<RoofType>(null);
  const [state, setState] = useState<StateName>("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const formState: FormState = {
    useCase,
    billBand,
    ownership,
    roofType,
    state,
    city,
    pincode,
  };

  const validationErrors = validateStep(step, formState);
  const canContinue = validationErrors.length === 0;

  const resetFlow = () => {
    setStep(1);
    setUseCase(null);
    setBillBand(null);
    setOwnership(null);
    setRoofType(null);
    setState("");
    setCity("");
    setPincode("");
  };

  const goBack = () => {
    setStep((current) => (Math.max(1, current - 1) as FlowStep));
  };

  const goNext = () => {
    if (!canContinue) return;
    setStep((current) => (Math.min(5, current + 1) as FlowStep));
  };

  const recommendation = (() => {
    if (!useCase || !billBand || !ownership || !roofType || !state || !city.trim() || !/^\d{6}$/.test(pincode.trim())) {
      return null;
    }

    const billValue = getBillValue(billBand);
    const useCaseFactor = useCase === "commercial" ? 1.18 : useCase === "industrial" ? 1.45 : 1;
    const roofFactor = roofType === "open-land" ? 1.35 : roofType === "metal" ? 1.08 : 1;
    const estimatedCapacity = Math.max(1.5, (billValue / 2500) * useCaseFactor * roofFactor);

    const systemType =
      roofType === "open-land"
        ? "Ground Mounted Solar"
        : useCase === "industrial"
          ? "Industrial Hybrid Solar"
          : ownership === "rented"
            ? "Flexible Rooftop Solar"
            : "On-Grid Rooftop Solar";

    const panelRecommendation =
      useCase === "industrial"
        ? "High-wattage bifacial modules"
        : useCase === "commercial"
          ? "High-efficiency mono PERC panels"
          : "Premium 540-560W rooftop modules";

    const financingSuggestion =
      ownership === "rented"
        ? "Lease-friendly EMI or landlord-approved financing"
        : billBand === "25000-plus"
          ? "Project EMI with faster payback"
          : "Subsidy-led financing with manageable monthly EMIs";

    const subsidyNote =
      useCase === "residential" && ownership === "own"
        ? "Residential buyers may qualify for subsidy-led pricing guidance."
        : "Use the calculator for a project-level subsidy and ROI estimate.";

    return {
      systemType,
      estimatedCapacity,
      panelRecommendation,
      financingSuggestion,
      subsidyNote,
      billLabel: getBillLabel(billBand),
    };
  })();

  return (
    <section id="discovery" className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Find Your Match</p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">Solar Discovery Flow</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          Answer a few quick questions to find the most practical solar path for your property.
        </p>
      </div>

      <div className="mx-auto mb-10 max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Progress</p>
            <p className="mt-1 text-sm text-slate-600">Step {step} of 5</p>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 md:mx-6">
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-5">
          <span className={step >= 1 ? "text-emerald-600" : ""}>Use case</span>
          <span className={step >= 2 ? "text-emerald-600" : ""}>Bill band</span>
          <span className={step >= 3 ? "text-emerald-600" : ""}>Property</span>
          <span className={step >= 4 ? "text-emerald-600" : ""}>Location</span>
          <span className={step >= 5 ? "text-emerald-600" : ""}>Result</span>
        </div>
      </div>

      {step === 1 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">What is your use case?</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { id: "residential", label: "Residential", desc: "Home, apartment, family property", icon: "🏠" },
              { id: "commercial", label: "Commercial", desc: "Office, shop, retail site", icon: "🏢" },
              { id: "industrial", label: "Industrial", desc: "Factory, plant, warehouse", icon: "🏭" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setUseCase(option.id as UseCase)}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  useCase === option.id ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{option.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{option.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">What is your electricity bill band?</h3>
          <div className="mt-6 grid gap-4">
            {billOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBillBand(option.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  billBand === option.id ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-600">{option.hint}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 ${billBand === option.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">Tell us about the property</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Ownership</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { id: "own", label: "Own Property" },
                  { id: "rented", label: "Rented Property" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setOwnership(option.id as Ownership)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      ownership === option.id ? "border-emerald-500 bg-white text-slate-900 shadow-sm" : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Roof type</p>
              <div className="mt-3 grid gap-3">
                {[
                  { id: "rcc", label: "RCC Roof" },
                  { id: "metal", label: "Metal Roof" },
                  { id: "open-land", label: "Open Land" },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRoofType(option.id as RoofType)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      roofType === option.id ? "border-emerald-500 bg-white text-slate-900 shadow-sm" : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">Where is the property located?</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">State</span>
              <select
                value={state}
                onChange={(event) => setState(event.target.value as StateName)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select state</option>
                {stateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">City</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Enter city"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Pincode</span>
              <input
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit pincode"
                inputMode="numeric"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>

          {validationErrors.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {validationErrors[0]}
            </div>
          ) : null}
        </div>
      )}

      {step === 5 && recommendation && (
        <div className="mx-auto max-w-4xl rounded-[30px] border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-2xl font-semibold text-slate-900">Your recommendation</h3>
          <p className="mt-2 text-sm text-slate-600">Based on {recommendation.billLabel || "your inputs"} and the property details you selected.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Recommended System Type</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{recommendation.systemType}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Estimated Capacity</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{recommendation.estimatedCapacity.toFixed(1)} kW</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Panel Recommendation</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{recommendation.panelRecommendation}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Financing Suggestion</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{recommendation.financingSuggestion}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {recommendation.subsidyNote}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/calculator" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Get Proposal
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link href="/compare" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
              Compare Panels
            </Link>
            <Link href="/more/contact-us" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
              Talk To Expert
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {step > 1 && (
          <button type="button" onClick={goBack} className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100">
            Previous
          </button>
        )}
        {step < 4 && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition ${
              canContinue ? "bg-emerald-500 text-white hover:bg-emerald-600" : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {step === 4 && (
          <button
            type="button"
            onClick={() => setStep(5)}
            disabled={!canContinue}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition ${
              canContinue ? "bg-emerald-500 text-white hover:bg-emerald-600" : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            View Results
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {(step === 5 || (step > 1 && !canContinue)) && (
          <button type="button" onClick={resetFlow} className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100">
            Restart
          </button>
        )}
      </div>
    </section>
  );
}
