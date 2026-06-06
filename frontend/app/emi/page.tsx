"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Download, Info, PiggyBank, Sparkles, Wallet } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { calculateEmiEstimate, formatCurrency, validateEmiInputs } from "@/lib/calculators";

function buildYearlySchedule(principal: number, annualRate: number, years: number, emi: number) {
  const monthlyRate = annualRate / 12 / 100;
  const months = Math.max(1, Math.round(years * 12));
  let balance = principal;
  const schedule = [] as Array<{ year: number; opening: number; principal: number; interest: number; closing: number; payment: number }>;

  for (let year = 1; year <= years; year += 1) {
    const opening = balance;
    let principalPaid = 0;
    let interestPaid = 0;

    for (let month = 0; month < 12 && schedule.length * 12 + month < months; month += 1) {
      const interestPortion = balance * monthlyRate;
      const principalPortion = Math.min(emi - interestPortion, balance);
      balance = Math.max(0, balance - principalPortion);
      principalPaid += principalPortion;
      interestPaid += interestPortion;
    }

    schedule.push({
      year,
      opening,
      principal: principalPaid,
      interest: interestPaid,
      closing: balance,
      payment: Math.min(emi * 12, opening + interestPaid),
    });
  }

  return schedule;
}

export default function EmiPage() {
  const { t } = useLocale();
  const [cost, setCost] = useState(450000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interest, setInterest] = useState(9.5);
  const [years, setYears] = useState(5);

  const estimate = useMemo(() => calculateEmiEstimate({ cost, downPayment, interest, years }), [cost, downPayment, interest, years]);
  const validationErrors = useMemo(() => validateEmiInputs({ cost, downPayment, interest, years }), [cost, downPayment, interest, years]);
  const yearlySchedule = useMemo(() => buildYearlySchedule(estimate.principal, interest, years, estimate.emi), [estimate.emi, estimate.principal, interest, years]);

  const summaryLines = [
    "EMI estimate summary",
    `Project cost: ${formatCurrency(cost)}`,
    `Down payment: ${formatCurrency(downPayment)}`,
    `Loan amount: ${formatCurrency(estimate.principal)}`,
    `Monthly EMI: ${formatCurrency(estimate.emi)}`,
    `Total payable: ${formatCurrency(estimate.totalPayable)}`,
    `Interest amount: ${formatCurrency(estimate.totalInterest)}`,
  ].join("\n");

  const handleCopySummary = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(summaryLines);
  };

  const handleDownloadCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Project Cost", String(Math.round(cost))],
      ["Down Payment", String(Math.round(downPayment))],
      ["Loan Amount", String(Math.round(estimate.principal))],
      ["Monthly EMI", String(Math.round(estimate.emi))],
      ["Total Payable", String(Math.round(estimate.totalPayable))],
      ["Interest Amount", String(Math.round(estimate.totalInterest))],
      ["Tenure Months", String(estimate.months)],
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "emi-estimate.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const paymentMixMax = Math.max(estimate.principal, estimate.totalInterest, 1);
  const interestPct = estimate.totalPayable > 0 ? Math.round((estimate.totalInterest / estimate.totalPayable) * 100) : 0;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-8 flex flex-col gap-4 rounded-4xl border border-slate-200 bg-white/90 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] md:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">EMI Calculator</p>
          <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Estimate Your Monthly EMI</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            A clean financing layout with monthly EMI, total payable, and interest split presented in a decision-ready format.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleCopySummary} className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
            <Info className="h-4 w-4" />
            Copy summary
          </button>
          <button type="button" onClick={handleDownloadCsv} className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition hover:bg-slate-800">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <Link href={`/calculator?monthlyBill=${Math.max(1000, Math.round(cost / 9))}`} className="inline-flex h-11 items-center rounded-full border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100">
            Pre-fill from savings estimate
          </Link>
        </div>
      </div>

      {validationErrors.length > 0 ? <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{validationErrors[0]}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="space-y-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Loan inputs</p>
              <h2 className="mt-2 text-2xl text-slate-950">Structure the financing</h2>
            </div>
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </div>

          <Field label={t("emi.projectCost")} hint="Total project value before financing.">
            <input type="number" min={100000} value={cost} onChange={(event) => setCost(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl font-semibold text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white" />
            <input type="range" min={100000} max={2500000} step={5000} value={cost} onChange={(event) => setCost(Number(event.target.value))} className="mt-3 w-full accent-emerald-500" />
            <div className="mt-1 flex justify-between text-xs text-slate-400"><span>₹1L</span><span>₹12.5L</span><span>₹25L</span></div>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t("emi.downPayment")} hint="Upfront amount paid before the loan starts.">
              <input type="number" min={0} value={downPayment} onChange={(event) => setDownPayment(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white" />
              <input type="range" min={0} max={cost} step={1000} value={downPayment} onChange={(event) => setDownPayment(Number(event.target.value))} className="mt-3 w-full accent-emerald-500" />
            </Field>
            <Field label={t("emi.interestRate")} hint="Nominal annual interest rate from the lender.">
              <input type="number" min={0} step={0.1} value={interest} onChange={(event) => setInterest(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white" />
              <input type="range" min={0} max={18} step={0.1} value={interest} onChange={(event) => setInterest(Number(event.target.value))} className="mt-3 w-full accent-emerald-500" />
            </Field>
          </div>

          <Field label={t("emi.loanTenure")} hint="Loan duration in years.">
            <input type="number" min={1} max={15} value={years} onChange={(event) => setYears(Number(event.target.value))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white" />
            <input type="range" min={1} max={15} step={1} value={years} onChange={(event) => setYears(Number(event.target.value))} className="mt-3 w-full accent-emerald-500" />
          </Field>

          <div className="grid gap-3 md:grid-cols-3">
            <MiniStat label="Loan amount" value={formatCurrency(estimate.principal)} />
            <MiniStat label="Annual outgo" value={formatCurrency(estimate.annualOutgo)} />
            <MiniStat label="Interest share" value={`${interestPct}%`} />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-4xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Calculated output</p>
                <h2 className="mt-2 text-2xl">EMI breakdown</h2>
              </div>
              <Wallet className="h-5 w-5 text-emerald-300" />
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Monthly EMI</p>
              <p className="mt-2 text-4xl font-semibold text-white">{formatCurrency(estimate.emi)}</p>
              <p className="mt-2 text-sm text-white/65">{estimate.months} months at {interest.toFixed(1)}% annual interest</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MetricCard title="Total payable" value={formatCurrency(estimate.totalPayable)} />
              <MetricCard title="Interest amount" value={formatCurrency(estimate.totalInterest)} />
              <MetricCard title="Upfront share" value={`${estimate.upfrontShare.toFixed(0)}%`} />
              <MetricCard title="Financed share" value={`${estimate.financeShare.toFixed(0)}%`} />
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Financing mix</p>
                <h2 className="mt-2 text-2xl text-slate-950">Principal vs interest</h2>
              </div>
              <PiggyBank className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="mt-6 space-y-4">
              <ProgressRow label="Principal" value={estimate.principal} max={paymentMixMax} tone="bg-slate-950" />
              <ProgressRow label="Interest" value={estimate.totalInterest} max={paymentMixMax} tone="bg-emerald-500" />
            </div>

            <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">What this means</p>
              <p className="mt-2 leading-6">A larger down payment reduces interest cost and shortens the loan lifecycle. Use the summary export to share financing options internally.</p>
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">Year-wise breakdown</div>
              <div className="max-h-88 overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-xs uppercase tracking-[0.16em] text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Year</th>
                      <th className="px-4 py-3">Opening</th>
                      <th className="px-4 py-3">Principal</th>
                      <th className="px-4 py-3">Interest</th>
                      <th className="px-4 py-3">Closing</th>
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

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Next actions</p>
                <h2 className="mt-2 text-2xl text-slate-950">Continue your solar journey</h2>
              </div>
              <ArrowRight className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link href="/calculator" className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Open Calculator
              </Link>
              <Link href="/more/contact-us" className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
                Talk To Expert
              </Link>
            </div>
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
          <Info className="h-4 w-4" />
        </span>
      </div>
      {children}
    </label>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
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

function ProgressRow({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="font-semibold text-slate-900">{formatCurrency(value)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${Math.max(8, Math.round((value / max) * 100))}%` }} />
      </div>
    </div>
  );
}
