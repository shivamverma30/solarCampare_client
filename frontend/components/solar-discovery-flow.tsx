"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

type SolarType = "on-grid" | "off-grid" | "hybrid" | null;
type UseCase = "residential" | "commercial" | "industrial" | null;
type PowerNeed = "low" | "medium" | "high" | null;
type FlowStep = 1 | 2 | 3 | 4 | 5;

export default function SolarDiscoveryFlow() {
  const [step, setStep] = useState<FlowStep>(1);
  const [useCase, setUseCase] = useState<UseCase>(null);
  const [powerNeed, setPowerNeed] = useState<PowerNeed>(null);
  const [solarType, setSolarType] = useState<SolarType>(null);
  const [financingOption, setFinancingOption] = useState<string | null>(null);

  const canContinue =
    (step === 1 && Boolean(useCase)) ||
    (step === 2 && Boolean(powerNeed)) ||
    (step === 3 && Boolean(solarType)) ||
    (step === 4 && Boolean(financingOption));

  const resetFlow = () => {
    setStep(1);
    setUseCase(null);
    setPowerNeed(null);
    setSolarType(null);
    setFinancingOption(null);
  };

  const goBack = () => {
    setStep((current) => (Math.max(1, current - 1) as FlowStep));
  };

  const goNext = () => {
    setStep((current) => (Math.min(4, current + 1) as FlowStep));
  };

  const recommendation = (() => {
    if (solarType && useCase && powerNeed) {
      return {
        type: solarType,
        savings: "₹50,000 - ₹2,00,000",
        payback: "3-5 years",
        maintenance: solarType === "off-grid" ? "Moderate" : "Low",
      };
    }
    return null;
  })();

  return (
    <section id="discovery" className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          Find Your Match
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          Solar Discovery Flow
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          Answer a few quick questions to find the perfect solar solution for your needs
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-10 flex items-center justify-center gap-3">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                step >= s
                  ? "bg-amber-500 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div
                className={`h-1 w-8 transition ${
                  step > s ? "bg-amber-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Use Case */}
      {step === 1 && (
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            What&apos;s your use case?
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { id: "residential", label: "Residential", icon: "🏠", desc: "Home/Apartment" },
              { id: "commercial", label: "Commercial", icon: "🏢", desc: "Office/Shop" },
              { id: "industrial", label: "Industrial", icon: "🏭", desc: "Factory/Plant" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setUseCase(option.id as UseCase)}
                className={`rounded-2xl border-2 p-6 text-center transition ${
                  useCase === option.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-300"
                }`}
              >
                <div className="text-3xl mb-3">{option.icon}</div>
                <p className="font-semibold text-slate-900">{option.label}</p>
                <p className="text-xs text-slate-600 mt-1">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Power Need */}
      {step === 2 && (
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            What&apos;s your power need?
          </h3>
          <div className="grid gap-4">
            {[
              { id: "low", label: "Low (1-3 kW)", desc: "Small home or apartment" },
              { id: "medium", label: "Medium (3-10 kW)", desc: "Large home or small shop" },
              { id: "high", label: "High (10+ kW)", desc: "Commercial or industrial" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setPowerNeed(option.id as PowerNeed)}
                className={`rounded-xl border-2 p-4 text-left transition flex items-center gap-4 ${
                  powerNeed === option.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-300"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    powerNeed === option.id
                      ? "border-amber-500 bg-amber-500"
                      : "border-slate-300"
                  }`}
                />
                <div>
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-600">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Solar Type */}
      {step === 3 && (
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Which system type suits you?
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                id: "on-grid",
                label: "On-Grid",
                icon: "☀️",
                pros: ["No battery", "Lower cost", "Feed excess power"],
              },
              {
                id: "off-grid",
                label: "Off-Grid",
                icon: "🔋",
                pros: ["Works without grid", "No bills", "Full independence"],
              },
              {
                id: "hybrid",
                label: "Hybrid",
                icon: "⚡",
                pros: ["Grid + battery", "Backup power", "Best of both"],
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSolarType(option.id as SolarType)}
                className={`rounded-2xl border-2 p-6 text-left transition ${
                  solarType === option.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-300"
                }`}
              >
                <div className="text-3xl mb-3">{option.icon}</div>
                <p className="font-semibold text-slate-900">{option.label}</p>
                <ul className="mt-3 space-y-1">
                  {option.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                      <span className="text-amber-500">✓</span> {pro}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Financing */}
      {step === 4 && (
        <div className="mx-auto max-w-3xl">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">
            Preferred financing?
          </h3>
          <div className="grid gap-4">
            {[
              { id: "subsidy", label: "Subsidy (Govt. funded)", desc: "Get ₹78,000+ from government" },
              { id: "emi", label: "EMI (Financing available)", desc: "Easy monthly payments" },
              { id: "cash", label: "Full Payment", desc: "Pay upfront for best ROI" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setFinancingOption(option.id)}
                className={`rounded-xl border-2 p-4 text-left transition flex items-center gap-4 ${
                  financingOption === option.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-300"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full border-2 ${
                    financingOption === option.id
                      ? "border-amber-500 bg-amber-500"
                      : "border-slate-300"
                  }`}
                />
                <div>
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-600">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {step === 5 && recommendation && (
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-linear-to-br from-amber-50 to-emerald-50 border-2 border-amber-200 p-8">
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">
              Your Perfect Match 🎯
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-600">Recommended System</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">
                  {recommendation.type === "on-grid" && "On-Grid System ☀️"}
                  {recommendation.type === "off-grid" && "Off-Grid System 🔋"}
                  {recommendation.type === "hybrid" && "Hybrid System ⚡"}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-600">Payback Period</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">
                  {recommendation.payback}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-600">Estimated Savings</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">
                  {recommendation.savings}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-600">Maintenance Level</p>
                <p className="text-2xl font-bold text-slate-700 mt-2">
                  {recommendation.maintenance}
                </p>
              </div>
            </div>
            <a
              href="/calculator"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white transition hover:bg-amber-600"
            >
              Get Detailed Estimate
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-center gap-4">
        {step > 1 && (
          <button
            onClick={goBack}
            className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Back
          </button>
        )}
        {step < 4 && (
          <button
            onClick={goNext}
            disabled={!canContinue}
            className={`rounded-lg px-6 py-2 font-medium transition flex items-center gap-2 ${
              canContinue
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {step === 4 && (
          <button
            onClick={() => setStep(5)}
            disabled={!canContinue}
            className={`rounded-lg px-6 py-2 font-medium transition flex items-center gap-2 ${
              canContinue
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
          >
            See Results
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {(step === 5 || (step > 1 && !canContinue)) && (
          <button
            onClick={resetFlow}
            className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Restart
          </button>
        )}
      </div>
    </section>
  );
}
