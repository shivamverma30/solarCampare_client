"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowRight, BarChart3, Landmark, Loader2, Wallet, X } from "lucide-react";
import { calculateEmiEstimate, formatCurrency, validateEmiInputs } from "@/lib/calculators";
import { apiClient } from "@/lib/api-client";
import { getSessionProfile, getToken } from "@/lib/auth";
import { useAuth } from "@/lib/use-auth";

type YearRow = {
  year: number;
  opening: number;
  principal: number;
  interest: number;
  closing: number;
};

function buildYearlySchedule(principal: number, annualRate: number, years: number, emi: number): YearRow[] {
  const monthlyRate = annualRate / 12 / 100;
  const months = Math.max(1, Math.round(years * 12));
  let balance = principal;
  const rows: YearRow[] = [];

  for (let year = 1; year <= years; year += 1) {
    const opening = balance;
    let principalPaid = 0;
    let interestPaid = 0;

    for (let month = 0; month < 12 && rows.length * 12 + month < months; month += 1) {
      const interestPortion = balance * monthlyRate;
      const principalPortion = Math.min(emi - interestPortion, balance);
      balance = Math.max(0, balance - principalPortion);
      principalPaid += principalPortion;
      interestPaid += interestPortion;
    }

    rows.push({
      year,
      opening,
      principal: principalPaid,
      interest: interestPaid,
      closing: balance,
    });
  }

  return rows;
}

function formatInterestShare(totalInterest: number, totalPayable: number) {
  const share = totalPayable > 0 ? Math.round((totalInterest / totalPayable) * 100) : 0;
  return share;
}

function formatDisplayAmount(value: number) {
  return formatCurrency(value);
}

function EmiPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, role } = useAuth();
  const initialPrincipal = Number(searchParams.get("principal") || 200000);
  const [loanAmount, setLoanAmount] = useState(initialPrincipal > 0 ? initialPrincipal : 200000);
  const [interest, setInterest] = useState(9.5);
  const [years, setYears] = useState(7);
  const [showFinanceForm, setShowFinanceForm] = useState(false);
  const [isSubmittingFinance, setIsSubmittingFinance] = useState(false);
  const [financeFeedback, setFinanceFeedback] = useState<string | null>(null);
  const [financeForm, setFinanceForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const queryPrincipal = Number(searchParams.get("principal") || 0);
    if (queryPrincipal > 0) {
      setLoanAmount(queryPrincipal);
    }
  }, [searchParams]);

  useEffect(() => {
    const profile = getSessionProfile() as Record<string, unknown> | null;
    if (!profile) return;

    setFinanceForm((current) => ({
      ...current,
      fullName: String(profile.fullName || profile.name || current.fullName || ""),
      email: String(profile.email || current.email || ""),
      phone: String(profile.phone || current.phone || ""),
      city: String(profile.city || current.city || ""),
      state: String(profile.state || current.state || ""),
    }));
  }, [isAuthenticated]);

  const estimate = useMemo(() => calculateEmiEstimate({ cost: loanAmount, downPayment: 0, interest, years }), [interest, loanAmount, years]);
  const validationErrors = useMemo(() => validateEmiInputs({ cost: loanAmount, downPayment: 0, interest, years }), [interest, loanAmount, years]);
  const yearlySchedule = useMemo(() => buildYearlySchedule(estimate.principal, interest, years, estimate.emi), [estimate.emi, estimate.principal, interest, years]);
  const interestShare = formatInterestShare(estimate.totalInterest, estimate.totalPayable);
  const principalShare = Math.max(0, 100 - interestShare);

  const handleFinanceClick = () => {
    setFinanceFeedback(null);
    if (!isAuthenticated || role !== "USER") {
      const redirectPath = `/emi?principal=${Math.round(loanAmount)}&openFlow=financing`;
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setShowFinanceForm(true);
  };

  useEffect(() => {
    if (searchParams.get("openFlow") === "financing" && isAuthenticated && role === "USER") {
      setShowFinanceForm(true);
    }
  }, [isAuthenticated, role, searchParams]);

  const handleFinanceSubmit = async () => {
    if (!financeForm.fullName.trim() || !financeForm.email.trim() || !financeForm.phone.trim()) {
      setFinanceFeedback("Please complete Name, Email, and Phone Number.");
      return;
    }

    setIsSubmittingFinance(true);
    setFinanceFeedback(null);
    try {
      const response = await apiClient.quotes.createQuote({
        fullName: financeForm.fullName,
        email: financeForm.email,
        phone: financeForm.phone,
        city: financeForm.city,
        state: financeForm.state,
        projectType: "EMI Financing",
        monthlyBill: null,
        notes: "User submitted EMI financing request from EMI calculator.",
        metadata: {
          source: "EMI Financing Request",
          loanAmount: Math.round(loanAmount),
          emi: Math.round(estimate.emi),
          interestRate: interest,
          tenureYears: years,
          totalInterest: Math.round(estimate.totalInterest),
          totalPayable: Math.round(estimate.totalPayable),
        },
      });

      if (!response.success) {
        throw new Error(response.error || "Unable to submit financing request.");
      }

      setFinanceFeedback("Your financing request has been submitted successfully.");
      setTimeout(() => setShowFinanceForm(false), 900);
    } catch (error) {
      setFinanceFeedback(error instanceof Error ? error.message : "Unable to submit financing request.");
    } finally {
      setIsSubmittingFinance(false);
    }
  };

  const summaryText = `Plan your solar EMI`;

  return (
    <section className="hero-shell container-x">
      <div className="grid gap-8 lg:grid-cols-[402px_1fr] lg:items-start lg:gap-10">
        <div className="max-w-3xl">
          <div className="overline mb-3">Loan Affordability Engine</div>
          <h1 className="text-[36px] font-bold leading-10 tracking-[-0.9px] text-slate-900 md:text-[36px]">Plan your solar EMI</h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-slate-600">
            Pre-filled from your solar estimate — tweak rate and tenure to find your sweet spot.
          </p>

          <form className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] md:p-7">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Landmark className="h-4 w-4 text-emerald-600" />
              <span>{summaryText}</span>
            </div>

            <div>
              <div className="label-dark">Loan amount (₹)</div>
              <input
                type="number"
                min={10000}
                max={2000000}
                step={10000}
                value={loanAmount}
                onChange={(event) => setLoanAmount(Number(event.target.value))}
                className="input-dark h-14.25 px-4 text-[24px]"
              />
              <input
                type="range"
                min={10000}
                max={2000000}
                step={10000}
                value={loanAmount}
                onChange={(event) => setLoanAmount(Number(event.target.value))}
                className="mt-3 w-full accent-brand-500"
              />
              <div className="mt-2 flex items-center gap-2 text-[12px] font-medium text-slate-400">
                <button type="button" onClick={() => setLoanAmount(10000)} className="chip">₹10k</button>
                <button type="button" onClick={() => setLoanAmount(1000000)} className="chip">₹10L</button>
                <button type="button" onClick={() => setLoanAmount(2000000)} className="chip">₹20L</button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <div className="label-dark">Annual interest rate (%)</div>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={interest}
                  onChange={(event) => setInterest(Number(event.target.value))}
                  className="input-dark h-12.25 px-4 text-[16px]"
                />
                <input
                  type="range"
                  min={0}
                  max={18}
                  step={0.1}
                  value={interest}
                  onChange={(event) => setInterest(Number(event.target.value))}
                  className="mt-3 w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="label-dark">Tenure (years)</div>
                <input
                  type="number"
                  min={1}
                  max={15}
                  step={1}
                  value={years}
                  onChange={(event) => setYears(Number(event.target.value))}
                  className="input-dark h-12.25 px-4 text-[16px]"
                />
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={years}
                  onChange={(event) => setYears(Number(event.target.value))}
                  className="mt-3 w-full accent-brand-500"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <MiniStat label="Loan amount" value={formatDisplayAmount(estimate.principal)} />
              <MiniStat label="Annual outgo" value={formatDisplayAmount(estimate.annualOutgo)} />
              <MiniStat label="Interest share" value={`${interestShare}%`} />
            </div>
          </form>
        </div>

        <div className="lg:pt-18.5">
          <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">Plan your solar EMI</div>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-white">Monthly EMI breakdown</h2>
              </div>
              <Wallet className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">Monthly EMI</div>
              <div className="mt-2 text-[36px] font-bold tracking-[-0.04em] text-white">{formatCurrency(estimate.emi)}</div>
              <div className="mt-2 text-[14px] text-white/65">
                {years} years at {interest.toFixed(1)}% annual interest
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <DarkMetric label="Total interest" value={formatCurrency(estimate.totalInterest)} />
              <DarkMetric label="Total payment" value={formatCurrency(estimate.totalPayable)} />
              <DarkMetric label="Loan amount" value={formatCurrency(estimate.principal)} />
            </div>

            <div className="mt-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">Interest share of payment</div>
              <div className="mt-4 flex items-center gap-6 text-[14px] text-white/80">
                <span>● Principal {principalShare}%</span>
                <span>● Interest {interestShare}%</span>
              </div>
              <button type="button" onClick={handleFinanceClick} className="btn-primary mt-5 h-12 w-full">
                Get a financing quote
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">Principal vs interest over time</div>
                <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.03em] text-slate-900">Year-wise breakdown</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-[14px] text-slate-600">
              <Legend tone="bg-amber-400" label="Interest" />
              <Legend tone="bg-emerald-500" label="Principal" />
            </div>

            <div className="mt-5 overflow-x-auto">
              <div className="min-w-120 rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-end gap-3 overflow-hidden">
                  {yearlySchedule.map((row) => {
                    const total = row.principal + row.interest || 1;
                    const interestHeight = Math.max(18, (row.interest / total) * 120 + 18);
                    const principalHeight = Math.max(18, (row.principal / total) * 120 + 18);
                    return (
                      <div key={row.year} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex h-40 w-full items-end justify-center gap-1">
                          <div className="w-5 rounded-t-full bg-amber-400/80" style={{ height: `${interestHeight}px` }} />
                          <div className="w-5 rounded-t-full bg-emerald-500" style={{ height: `${principalHeight}px` }} />
                        </div>
                        <div className="text-[12px] font-semibold text-slate-500">{row.year}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between px-2 text-[12px] text-slate-400">
                  <span>0</span>
                  <span>10k</span>
                  <span>19k</span>
                  <span>29k</span>
                  <span>38k</span>
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[22px] border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-semibold text-slate-700">Year-wise breakdown</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[14px]">
                  <thead className="bg-white text-[12px] uppercase tracking-[0.16em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Opening balance</th>
                      <th className="px-4 py-3">Principal</th>
                      <th className="px-4 py-3">Interest</th>
                      <th className="px-4 py-3">Closing balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlySchedule.map((row) => (
                      <tr key={row.year} className="border-t border-slate-100">
                        <td className="px-4 py-3 text-slate-900">{row.year}</td>
                        <td className="px-4 py-3 text-slate-600">{formatCurrency(row.opening)}</td>
                        <td className="px-4 py-3 text-emerald-600">{formatCurrency(row.principal)}</td>
                        <td className="px-4 py-3 text-amber-600">{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-3 text-slate-600">{formatCurrency(row.closing)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {validationErrors.length > 0 ? <p className="mt-4 text-sm text-amber-700">{validationErrors[0]}</p> : null}

      {showFinanceForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">EMI Financing Request</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Confirm your financing details</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowFinanceForm(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
              <p><span className="font-semibold">Loan amount:</span> {formatCurrency(loanAmount)}</p>
              <p><span className="font-semibold">Estimated EMI:</span> {formatCurrency(estimate.emi)}</p>
              <p><span className="font-semibold">Interest rate:</span> {interest.toFixed(1)}%</p>
              <p><span className="font-semibold">Tenure:</span> {years} years</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <FieldInput label="Name" value={financeForm.fullName} onChange={(value) => setFinanceForm((current) => ({ ...current, fullName: value }))} />
              <FieldInput label="Email" type="email" value={financeForm.email} onChange={(value) => setFinanceForm((current) => ({ ...current, email: value }))} />
              <FieldInput label="Phone" value={financeForm.phone} onChange={(value) => setFinanceForm((current) => ({ ...current, phone: value }))} />
              <FieldInput label="City" value={financeForm.city} onChange={(value) => setFinanceForm((current) => ({ ...current, city: value }))} />
              <FieldInput label="State" value={financeForm.state} onChange={(value) => setFinanceForm((current) => ({ ...current, state: value }))} />
            </div>

            {financeFeedback ? (
              <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${financeFeedback.startsWith("Your financing") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
                {financeFeedback}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleFinanceSubmit}
              disabled={isSubmittingFinance}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingFinance ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting
                </span>
              ) : (
                "Submit financing request"
              )}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function EmiPage() {
  return (
    <Suspense fallback={null}>
      <EmiPageContent />
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

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-slate-900">{value}</div>
    </div>
  );
}

function DarkMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/55">{label}</div>
      <div className="mt-2 text-[18px] font-semibold tracking-[-0.03em] text-white">{value}</div>
    </div>
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${tone}`} />
      <span>{label}</span>
    </div>
  );
}
