"use client";

import { Check } from "lucide-react";

export default function DCRComparisonSection() {

  const comparisonData = [
    {
      category: "What It Means",
      dcr: "DCR (Domestically Content Requirement) — Panels made in India",
      nondcr: "Non-DCR — Imported panels (high efficiency brands)",
    },
    {
      category: "Government Subsidy",
      dcr: "₹78,000 for residential (≤3kW)",
      nondcr: "₹30,000 for residential (≤3kW)",
    },
    {
      category: "Panel Efficiency",
      dcr: "19-20% (good)",
      nondcr: "21-22% (excellent)",
    },
    {
      category: "Cost per Watt",
      dcr: "₹35-40 / W",
      nondcr: "₹40-48 / W",
    },
    {
      category: "System Cost (3kW)",
      dcr: "₹1,05,000 - ₹1,20,000",
      nondcr: "₹1,20,000 - ₹1,44,000",
    },
    {
      category: "Your Net Cost (after subsidy)",
      dcr: "₹27,000 - ₹42,000",
      nondcr: "₹90,000 - ₹1,14,000",
    },
    {
      category: "Warranty",
      dcr: "12 years product + 25 years performance",
      nondcr: "12 years product + 30 years performance",
    },
    {
      category: "Payback Period",
      dcr: "2.5-3.5 years",
      nondcr: "3.5-4.5 years",
    },
    {
      category: "25-Year Savings",
      dcr: "₹4,50,000 - ₹5,50,000",
      nondcr: "₹5,00,000 - ₹6,00,000",
    },
    {
      category: "Recommended For",
      dcr: "Budget-conscious, want maximum subsidy",
      nondcr: "Premium preference, high efficiency priority",
    },
  ];

  return (
    <section id="dcr-comparison" className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
          Detailed Comparison
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          DCR vs Non-DCR Solar Panels
        </h2>
        <p className="mt-4 mx-auto max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
          Understanding the difference is crucial for maximizing government subsidies and choosing the right panels for your roof
        </p>
      </div>

      {/* Quick Compare Cards */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        {/* DCR Card */}
        <div className="rounded-2xl border-2 border-emerald-300 bg-linear-to-br from-emerald-50 to-white p-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-emerald-900">DCR Panels</h3>
              <p className="text-sm text-emerald-700 mt-1">Made in India</p>
            </div>
            <span className="text-4xl">🇮🇳</span>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs text-emerald-600 font-semibold">Subsidy (3kW)</p>
              <p className="text-3xl font-bold text-emerald-600">₹78,000</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-slate-600">Net Cost After Subsidy</p>
              <p className="text-2xl font-bold text-slate-900">₹27,000 - ₹42,000</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm mb-8">
            {["✓ Maximum subsidy benefit", "✓ Fastest payback (2.5-3.5 yrs)", "✓ Indian manufacturing", "✓ Government backed"].map(
              (item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700">
                  <span className="text-emerald-500">✓</span> {item.replace("✓ ", "")}
                </li>
              )
            )}
          </ul>

          <a
            href="/calculator?type=dcr"
            className="block rounded-lg bg-emerald-500 px-4 py-2 text-center font-semibold text-white transition hover:bg-emerald-600"
          >
            Calculate DCR Savings →
          </a>
        </div>

        {/* Non-DCR Card */}
        <div className="rounded-2xl border-2 border-blue-300 bg-linear-to-br from-blue-50 to-white p-8 shadow-lg">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-blue-900">Non-DCR Panels</h3>
              <p className="text-sm text-blue-700 mt-1">International (High Efficiency)</p>
            </div>
            <span className="text-4xl">🌍</span>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-xs text-blue-600 font-semibold">Subsidy (3kW)</p>
              <p className="text-3xl font-bold text-blue-600">₹30,000</p>
            </div>
            <div className="rounded-lg bg-white p-3">
              <p className="text-xs text-slate-600">Net Cost After Subsidy</p>
              <p className="text-2xl font-bold text-slate-900">₹90,000 - ₹1,14,000</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm mb-8">
            {["✓ Higher efficiency (21-22%)", "✓ Premium warranty (30 years)", "✓ Global brand trust", "✓ Better long-term output"].map(
              (item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700">
                  <span className="text-blue-500">✓</span> {item.replace("✓ ", "")}
                </li>
              )
            )}
          </ul>

          <a
            href="/calculator?type=nondcr"
            className="block rounded-lg bg-blue-500 px-4 py-2 text-center font-semibold text-white transition hover:bg-blue-600"
          >
            Calculate Non-DCR Savings →
          </a>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="mb-12 rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Criteria</th>
                <th className="px-6 py-4 text-left font-semibold">
                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    🇮🇳 DCR Panels
                  </span>
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  <span className="inline-flex items-center gap-2 text-blue-300">
                    🌍 Non-DCR Panels
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comparisonData.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}>
                  <td className="px-6 py-4 font-semibold text-slate-900">{row.category}</td>
                  <td className="px-6 py-4 text-slate-700">{row.dcr}</td>
                  <td className="px-6 py-4 text-slate-700">{row.nondcr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Helper */}
      <div className="rounded-2xl bg-linear-to-r from-emerald-50 to-slate-50 border-2 border-emerald-200 p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Which Should You Choose?</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6">
            <h4 className="mb-4 font-bold text-emerald-700">Choose DCR If...</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>Budget is your primary concern</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>You want to maximize government subsidy</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>You need quickest payback period</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>You have moderate to good sunlight</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-white p-6">
            <h4 className="mb-4 font-bold text-slate-700">Choose Non-DCR If...</h4>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>Premium efficiency is important</span>
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>You want extended warranty (30 years)</span>
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>You have limited roof space</span>
              </li>
              <li className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>Long-term output & performance matter more</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
