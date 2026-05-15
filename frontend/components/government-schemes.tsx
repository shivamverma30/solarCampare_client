"use client";

import { useLocale } from "@/components/locale-provider";

export default function GovernmentSchemes() {
  const { t } = useLocale();

  const schemes = [
    {
      name: "PM Surya Ghar Muft Bijli Yojana",
      desc: "Install rooftop solar and get up to 300 units of free electricity per month. Central subsidy of ₹30,000–₹78,000 for residential consumers across India.",
      badge: "CENTRAL",
      amount: "₹78,000",
      label: "max subsidy (3kW+)",
    },
    {
      name: "PM-KUSUM Yojana",
      desc: "Solar pumps for farmers and decentralized solar power for rural areas. 60% subsidy on solar pump installation for agricultural consumers.",
      badge: "CENTRAL",
      amount: "60%",
      label: "subsidy on solar pumps",
    },
    {
      name: "Net Metering Policy",
      desc: "Export excess solar power to the grid and get bill credits or payment. Available in all 28 states under CERC regulations. Earn ₹2–₹5 per unit exported.",
      badge: "ALL STATES",
      amount: "₹2–5",
      label: "per exported unit",
    },
    {
      name: "Solar Rooftop Financial Assistance",
      desc: "Additional state-level subsidies on top of central schemes. Varies by state — Rajasthan, Gujarat, and MP offer the highest additional benefits.",
      badge: "STATE LEVEL",
      amount: "₹10K–50K",
      label: "additional state subsidy",
    },
  ];

  const stateSubsidies = [
    { state: "Rajasthan", central: "₹78,000", stateAdd: "₹50,000", total: "₹1,28,000", level: "HIGH" },
    { state: "Gujarat", central: "₹78,000", stateAdd: "₹40,000", total: "₹1,18,000", level: "HIGH" },
    { state: "Madhya Pradesh", central: "₹78,000", stateAdd: "₹30,000", total: "₹1,08,000", level: "HIGH" },
    { state: "Maharashtra", central: "₹78,000", stateAdd: "₹20,000", total: "₹98,000", level: "MEDIUM" },
    { state: "Uttar Pradesh", central: "₹78,000", stateAdd: "₹20,000", total: "₹98,000", level: "MEDIUM" },
    { state: "Delhi", central: "₹78,000", stateAdd: "₹10,000", total: "₹88,000", level: "MEDIUM" },
    { state: "Karnataka", central: "₹78,000", stateAdd: "₹15,000", total: "₹93,000", level: "MEDIUM" },
    { state: "Tamil Nadu", central: "₹78,000", stateAdd: "₹10,000", total: "₹88,000", level: "MEDIUM" },
    { state: "Bihar", central: "₹78,000", stateAdd: "₹5,000", total: "₹83,000", level: "LOWER" },
    { state: "West Bengal", central: "₹78,000", stateAdd: "₹5,000", total: "₹83,000", level: "LOWER" },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return "bg-emerald-50 text-emerald-700";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700";
      case "LOWER":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  return (
    <section id="schemes" className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          {t("schemes.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          {t("schemes.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          {t("schemes.description")}
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="mb-12 grid gap-4 md:grid-cols-2">
        {schemes.map((scheme) => (
          <article
            key={scheme.name}
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-3 flex items-start justify-between">
              <div />
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {scheme.badge}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900">{scheme.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{scheme.desc}</p>

            <div className="mt-4 rounded-lg bg-amber-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {scheme.label}
              </p>
              <p className="mt-1 font-serif text-2xl font-bold text-amber-700">
                {scheme.amount}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* State-wise Table */}
      <div>
        <h3 className="font-serif text-2xl font-bold text-slate-900">
          {t("schemes.stateWiseTitle")}
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {t("schemes.stateWiseDesc")}
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-amber-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                  State
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                  Central Subsidy
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                  State Additional
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                  Total Benefit
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-600">
                  Level
                </th>
              </tr>
            </thead>
            <tbody>
              {stateSubsidies.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {row.state}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.central}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.stateAdd}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                    {row.total}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getLevelColor(
                        row.level
                      )}`}
                    >
                      {row.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          * Figures are indicative. Actual subsidy depends on system size, consumer category, and current scheme status. Contact SAFWE for latest verified rates.
        </p>
      </div>
    </section>
  );
}
