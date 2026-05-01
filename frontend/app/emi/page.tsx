"use client";

import { useMemo, useState } from "react";

export default function EmiPage() {
  const [cost, setCost] = useState(450000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interest, setInterest] = useState(9.5);
  const [years, setYears] = useState(5);

  const emi = useMemo(() => {
    const principal = Math.max(0, cost - downPayment);
    const monthlyRate = interest / 12 / 100;
    const months = years * 12;

    if (principal === 0 || months === 0) {
      return 0;
    }

    if (monthlyRate === 0) {
      return principal / months;
    }

    const factor = (1 + monthlyRate) ** months;
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [cost, downPayment, interest, years]);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">EMI Calculator</p>
        <h1 className="mt-3 text-4xl text-slate-900">Estimate Your Monthly EMI</h1>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Project Cost (INR)
              <input
                type="number"
                min={0}
                value={cost}
                onChange={(event) => setCost(Number(event.target.value))}
                placeholder="e.g. 450000"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Down Payment (INR)
              <input
                type="number"
                min={0}
                value={downPayment}
                onChange={(event) => setDownPayment(Number(event.target.value))}
                placeholder="e.g. 50000"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Annual Interest Rate (%)
              <input
                type="number"
                min={0}
                step={0.1}
                value={interest}
                onChange={(event) => setInterest(Number(event.target.value))}
                placeholder="e.g. 9.5"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Loan Tenure (Years)
              <input
                type="number"
                min={1}
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
                placeholder="e.g. 5"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-amber-200/70 bg-linear-to-br from-amber-50 to-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500">Monthly EMI</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">
              INR {Math.round(emi).toLocaleString("en-IN")}
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p>Total Project Cost: INR {Math.round(cost).toLocaleString("en-IN")}</p>
              <p>Down Payment: INR {Math.round(downPayment).toLocaleString("en-IN")}</p>
              <p>Loan Amount: INR {Math.max(0, Math.round(cost - downPayment)).toLocaleString("en-IN")}</p>
              <p>Tenure: {years} years</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
