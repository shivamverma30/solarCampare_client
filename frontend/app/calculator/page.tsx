"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ChevronDown, Factory, Home, Leaf, Loader2, PanelTop, SunMedium, X } from "lucide-react";
import {
  calculateEmiEstimate,
  calculateSolarEstimate,
  formatCurrency,
  solarStateProfiles,
  type PropertyType,
  type SolarState,
  validateSolarInputs,
} from "@/lib/calculators";
import { useAuth } from "@/lib/use-auth";
import { useLocale } from "@/components/locale-provider";
import { apiClient } from "@/lib/api-client";
import { getSessionProfile, getToken } from "@/lib/auth";

const propertyOptions: Array<{ value: PropertyType; label: string; icon: typeof Home }> = [
  { value: "residential", label: "Residential", icon: Home },
  { value: "commercial", label: "Commercial", icon: Factory },
  { value: "agriculture", label: "Agriculture", icon: Leaf },
];

const stateOptions = Object.keys(solarStateProfiles).filter((state) => state !== "other") as SolarState[];

function formatKw(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1);
}

function CalculatorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const { isAuthenticated, role } = useAuth();
  const [monthlyBill, setMonthlyBill] = useState(3000);
  const [propertyType, setPropertyType] = useState<PropertyType>("residential");
  const [state, setState] = useState<SolarState>("Maharashtra");
  const [submitted, setSubmitted] = useState(false);
  const [stateMenuOpen, setStateMenuOpen] = useState(false);
  const stateMenuRef = useRef<HTMLDivElement | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalSubmitting, setProposalSubmitting] = useState(false);
  const [proposalFeedback, setProposalFeedback] = useState<string | null>(null);
  const [proposalForm, setProposalForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (stateMenuRef.current && !stateMenuRef.current.contains(event.target as Node)) {
        setStateMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    const profile = getSessionProfile() as Record<string, unknown> | null;
    if (!profile) return;
    setProposalForm((current) => ({
      ...current,
      fullName: String(profile.fullName || profile.name || current.fullName || ""),
      email: String(profile.email || current.email || ""),
      phone: String(profile.phone || current.phone || ""),
      city: String(profile.city || current.city || ""),
    }));
  }, [isAuthenticated]);

  const validationErrors = useMemo(() => validateSolarInputs({ monthlyBill, state, propertyType }), [monthlyBill, propertyType, state]);
  const estimate = useMemo(
    () => calculateSolarEstimate({ monthlyBill, state, propertyType }),
    [monthlyBill, propertyType, state]
  );
  const emiEstimate = useMemo(
    () => calculateEmiEstimate({ cost: estimate.netInvestment, downPayment: 0, interest: 9.5, years: 7 }),
    [estimate.netInvestment]
  );

  const stateProfile = solarStateProfiles[state] || solarStateProfiles.other;
  const stateSummary = `${state} • ${stateProfile.discom} • ₹${Math.round(stateProfile.tariff)}/kWh`;
  const systemCost = formatCurrency(estimate.investment);
  const subsidy = formatCurrency(estimate.totalSubsidy);
  const netInvestment = formatCurrency(estimate.netInvestment);
  const monthlySavings = formatCurrency(estimate.monthlySavings);
  const lifetimeSavings = formatCurrency(estimate.savings25yr);
  const paybackYears = estimate.paybackMonths / 12;
  const annualCo2Tons = `${(estimate.co2SavingsKg / 1000).toFixed(2)} t`;

  const handleCompareVendors = () => {
    const profile = getSessionProfile() as Record<string, unknown> | null;
    const city = proposalForm.city.trim() || String(profile?.city || "");

    const comparePath = `/compare?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&systemSize=${encodeURIComponent(formatKw(estimate.recommendedKw))}&propertyType=${encodeURIComponent(propertyType)}`;

    if (!isAuthenticated || role !== "USER") {
      router.push(`/login?redirect=${encodeURIComponent(comparePath)}`);
      return;
    }

    router.push(comparePath);
  };

  const handleOpenProposal = () => {
    if (!submitted) return;

    if (!isAuthenticated || role !== "USER") {
      const redirectPath = `/calculator?openFlow=proposal&bill=${monthlyBill}&state=${encodeURIComponent(state)}&propertyType=${encodeURIComponent(propertyType)}`;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setProposalFeedback(null);
    setShowProposalForm(true);
  };

  useEffect(() => {
    const openFlow = searchParams.get("openFlow");
    if (openFlow === "proposal") {
      const bill = Number(searchParams.get("bill") || monthlyBill);
      const selectedState = searchParams.get("state") as SolarState | null;
      const selectedType = searchParams.get("propertyType") as PropertyType | null;

      if (bill > 0) setMonthlyBill(bill);
      if (selectedState && solarStateProfiles[selectedState]) setState(selectedState);
      if (selectedType && ["residential", "commercial", "agriculture"].includes(selectedType)) {
        setPropertyType(selectedType);
      }

      setSubmitted(true);
      if (isAuthenticated && role === "USER") {
        setShowProposalForm(true);
      }
    }
  }, [isAuthenticated, role, searchParams]);

  const handleProposalSubmit = async () => {
    if (!proposalForm.fullName.trim() || !proposalForm.email.trim() || !proposalForm.phone.trim()) {
      setProposalFeedback("Please provide Name, Phone, and Email.");
      return;
    }

    setProposalSubmitting(true);
    setProposalFeedback(null);

    try {
      const payload = {
        fullName: proposalForm.fullName,
        email: proposalForm.email,
        phone: proposalForm.phone,
        city: proposalForm.city,
        state,
        projectType: "Solar Calculator Proposal",
        monthlyBill: Math.round(monthlyBill),
        notes: "User submitted proposal intent from Solar Calculator.",
        metadata: {
          source: "Solar Calculator Proposal",
          propertyType,
          city: proposalForm.city,
          state,
          monthlyBill: Math.round(monthlyBill),
          recommendedSystemSizeKw: Number(formatKw(estimate.recommendedKw)),
          estimatedSavingsAnnual: Math.round(estimate.annualSavings),
          estimatedSavingsMonthly: Math.round(estimate.monthlySavings),
          subsidyAmount: Math.round(estimate.totalSubsidy),
          netInvestment: Math.round(estimate.netInvestment),
          paybackYears: Number((estimate.paybackMonths / 12).toFixed(1)),
          roiYears: Number((estimate.paybackMonths / 12).toFixed(1)),
          calculatorInputs: {
            monthlyBill: Math.round(monthlyBill),
            state,
            propertyType,
          },
          calculatorOutputs: {
            recommendedKw: Number(formatKw(estimate.recommendedKw)),
            annualSavings: Math.round(estimate.annualSavings),
            monthlySavings: Math.round(estimate.monthlySavings),
            subsidy: Math.round(estimate.totalSubsidy),
            investment: Math.round(estimate.investment),
            netInvestment: Math.round(estimate.netInvestment),
            paybackMonths: estimate.paybackMonths,
            paybackYears: Number((estimate.paybackMonths / 12).toFixed(1)),
          },
          proposalStatus: "NEW",
        },
      };

      const response = await apiClient.quotes.createQuote(payload);
      if (!response.success) {
        throw new Error(response.error || "Unable to submit proposal request.");
      }

      const token = getToken();
      if (token) {
        await apiClient.calculators.saveHistory(
          token,
          "solar",
          {
            monthlyBill: Math.round(monthlyBill),
            state,
            propertyType,
          },
          {
            recommendedKw: Number(formatKw(estimate.recommendedKw)),
            annualSavings: Math.round(estimate.annualSavings),
            subsidy: Math.round(estimate.totalSubsidy),
            netInvestment: Math.round(estimate.netInvestment),
            paybackMonths: estimate.paybackMonths,
          }
        );
      }

      setProposalFeedback("Your proposal request has been sent successfully.");
      setTimeout(() => setShowProposalForm(false), 900);
    } catch (error) {
      setProposalFeedback(error instanceof Error ? error.message : "Unable to submit proposal request.");
    } finally {
      setProposalSubmitting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="hero-shell container-x">
      <div className="grid gap-8 lg:grid-cols-[402px_1fr] lg:items-start lg:gap-10">
        <div className="max-w-3xl">
          <div className="overline mb-3">{t("calculator.eyebrow")}</div>
          <h1 className="text-[36px] font-bold leading-10 tracking-[-0.9px] text-slate-900 md:text-[36px]">
            {t("calculator.heroTitle")}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-slate-600">
            {t("calculator.heroSubtitle")}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] md:p-7">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <PanelTop className="h-4 w-4 text-emerald-600" />
              <span>{t("calculator.estimateSystem")}</span>
            </div>

            <div>
              <div className="label-dark">{t("calculator.propertyType")}</div>
              <div className="grid grid-cols-3 gap-2">
                {propertyOptions.map((option) => {
                  const Icon = option.icon;
                  const active = propertyType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPropertyType(option.value)}
                      className={`inline-flex h-11.25 items-center justify-center gap-2 rounded-md border px-3 text-[14px] font-medium transition ${
                        active
                          ? "border-brand-500 bg-brand-500/20 text-brand-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <div className="label-dark">{t("calculator.stateDiscom")}</div>
              <div ref={stateMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setStateMenuOpen((open) => !open)}
                  className="input-dark flex h-12.25 items-center justify-between px-4 text-[16px]"
                >
                  <span>{state}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {stateMenuOpen ? (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-80 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
                    {stateOptions.map((stateOption) => (
                      <button
                        key={stateOption}
                        type="button"
                        onClick={() => {
                          setState(stateOption);
                          setStateMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-[14px] transition hover:bg-slate-50 ${
                          stateOption === state ? "bg-slate-50 text-emerald-600" : "text-slate-700"
                        }`}
                      >
                        <span>{stateOption}</span>
                        {stateOption === state ? <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">Selected</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="mt-2 text-[14px] leading-6 text-slate-600">
                  {stateProfile.discom} • avg tariff ₹{Math.round(stateProfile.tariff)}/kWh • {stateProfile.sunHours.toFixed(1)} sun-hr/day
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="label-dark">{t("calculator.monthlyBill")}</div>
              <input
                type="number"
                min={500}
                max={50000}
                step={500}
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(Number(event.target.value))}
                className="input-dark h-14.25 px-4 text-[24px]"
              />
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={monthlyBill}
                onChange={(event) => setMonthlyBill(Number(event.target.value))}
                className="mt-3 w-full accent-brand-500"
              />
              <div className="mt-2 flex items-center justify-between text-[12px] font-medium text-slate-400">
                <span>₹500</span>
                <span>₹25,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            <button type="submit" data-testid="calc-submit" className="btn-primary mt-7 h-12 w-full">
              {submitted ? t("calculator.calculating") : t("calculator.estimateSavings")}
            </button>

            {validationErrors.length > 0 ? <p className="mt-4 text-sm text-amber-700">{validationErrors[0]}</p> : null}
            <p className="mt-5 text-[14px] leading-7 text-slate-600">
              {t("calculator.assumptions")}
            </p>
          </form>
        </div>

        <div className="lg:pt-18.5">
          {!submitted ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] md:p-8">
              <div className="flex min-h-75 flex-col items-center justify-center text-center md:min-h-90">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                  <SunMedium className="h-9 w-9" />
                </div>
                <p className="mt-5 text-[22px] font-semibold tracking-[-0.03em] text-slate-900">{t("calculator.awaitingBill")}</p>
                <p className="mt-2 max-w-md text-[15px] leading-7 text-slate-600">
                  {t("calculator.awaitingBillDescription")}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] md:p-8">
                <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
                  <SunMedium className="h-4 w-4 text-emerald-600" />
                  <span>{stateSummary}</span>
                </div>

                <div className="mt-6">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t("calculator.recommendedSystem")}</div>
                  <div className="mt-2 flex items-baseline gap-2 text-slate-900">
                    <span className="text-[36px] font-bold leading-none tracking-[-0.04em]">{formatKw(estimate.recommendedKw)}</span>
                    <span className="text-[18px] font-semibold text-slate-700">kW rooftop solar</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Stat label="System cost" value={systemCost} />
                  <Stat label="PM Surya Ghar subsidy" value={subsidy} />
                  <Stat label="Net investment" value={netInvestment} />
                  <Stat label="Payback" value={`${paybackYears.toFixed(1)} yr`} />
                  <Stat label="Monthly savings" value={monthlySavings} />
                  <Stat label="CO₂ offset / year" value={annualCo2Tons} />
                </div>
              </div>

              <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] md:p-8">
                <div className="text-[18px] font-semibold tracking-[-0.03em] text-slate-900">{t("calculator.lifetimeSavings")}</div>
                <div className="mt-2 text-[28px] font-bold tracking-[-0.04em] text-slate-900">{lifetimeSavings}</div>
                <div className="mt-2 text-[15px] leading-7 text-slate-600">
                  {t("calculator.estimatedEmi", { amount: `${formatCurrency(emiEstimate.emi)}/mo` })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/emi?principal=${Math.round(estimate.netInvestment)}`} className="btn-primary h-12 flex-1">
                    {t("calculator.detailedEmi")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button type="button" onClick={handleCompareVendors} className="btn-ghost h-12 flex-1">
                    {t("calculator.compareVendors")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <button type="button" onClick={handleOpenProposal} className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                  {t("calculator.detailedProposal")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showProposalForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Solar Calculator Proposal</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Confirm request details</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowProposalForm(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
              <p><span className="font-semibold">Monthly bill:</span> {formatCurrency(monthlyBill)}</p>
              <p><span className="font-semibold">System size:</span> {formatKw(estimate.recommendedKw)} kW</p>
              <p><span className="font-semibold">Annual savings:</span> {formatCurrency(estimate.annualSavings)}</p>
              <p><span className="font-semibold">Subsidy:</span> {formatCurrency(estimate.totalSubsidy)}</p>
              <p><span className="font-semibold">Net investment:</span> {formatCurrency(estimate.netInvestment)}</p>
              <p><span className="font-semibold">Payback period:</span> {(estimate.paybackMonths / 12).toFixed(1)} years</p>
              <p><span className="font-semibold">State:</span> {state}</p>
              <p><span className="font-semibold">Property type:</span> {propertyType}</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FieldInput label="Name" value={proposalForm.fullName} onChange={(value) => setProposalForm((current) => ({ ...current, fullName: value }))} />
              <FieldInput label="Phone" value={proposalForm.phone} onChange={(value) => setProposalForm((current) => ({ ...current, phone: value }))} />
              <FieldInput label="Email" type="email" value={proposalForm.email} onChange={(value) => setProposalForm((current) => ({ ...current, email: value }))} />
              <FieldInput label="City" value={proposalForm.city} onChange={(value) => setProposalForm((current) => ({ ...current, city: value }))} />
            </div>

            {proposalFeedback ? (
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${proposalFeedback.startsWith("Your proposal") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
                {proposalFeedback}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleProposalSubmit}
              disabled={proposalSubmitting}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {proposalSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting
                </span>
              ) : (
                "Submit proposal request"
              )}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function CalculatorPage() {
  return (
    <Suspense fallback={null}>
      <CalculatorPageContent />
    </Suspense>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-[24px] font-semibold leading-none tracking-[-0.03em] text-slate-900">{value}</div>
    </div>
  );
}
