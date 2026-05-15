"use client";

import { ShieldCheck, Award, Heart, Zap } from "lucide-react";

export default function TrustAndWarrantySection() {

  const certifications = [
    {
      icon: "🇮🇳",
      name: "BIS Certified",
      desc: "Bureau of Indian Standards - ensures quality & safety",
      trust: "★★★★★",
    },
    {
      icon: "✓",
      name: "ALMM Listed",
      desc: "Approved List of Models & Manufacturers - govt approved",
      trust: "★★★★★",
    },
    {
      icon: "⚡",
      name: "CE Compliant",
      desc: "International electrical & safety standards met",
      trust: "★★★★",
    },
    {
      icon: "🏆",
      name: "NABCB Accredited",
      desc: "National Accreditation Board - third-party verification",
      trust: "★★★★★",
    },
  ];

  const warranties = [
    {
      category: "Panel Warranty",
      items: [
        { name: "Product Coverage", coverage: "12 years", guarantee: "Manufacturer defects" },
        { name: "Performance", coverage: "25-30 years", guarantee: "≥80% output guaranteed" },
        { name: "Degradation Rate", coverage: "<0.5% annually", guarantee: "Minimal loss" },
      ],
    },
    {
      category: "Installation Warranty",
      items: [
        { name: "Workmanship", coverage: "5-10 years", guarantee: "Installation quality" },
        { name: "Roof Damage", coverage: "5 years", guarantee: "Waterproofing covered" },
        { name: "Structural", coverage: "10 years", guarantee: "Mounting system" },
      ],
    },
    {
      category: "Inverter Warranty",
      items: [
        { name: "Product Coverage", coverage: "5-10 years", guarantee: "Component failure" },
        { name: "Labor Warranty", coverage: "2-5 years", guarantee: "Repair labor" },
        { name: "Replacement", coverage: "Included", guarantee: "If repairs exceed 60%" },
      ],
    },
    {
      category: "Battery Warranty (if applicable)",
      items: [
        { name: "Product Coverage", coverage: "10 years", guarantee: "Battery defects" },
        { name: "Capacity", coverage: "70% after 10 yrs", guarantee: "Minimum capacity" },
        { name: "Replacement", coverage: "Covered", guarantee: "If capacity drops <70%" },
      ],
    },
  ];

  const guarantees = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Quality Guarantee",
      desc: "All products ALMM certified & BIS approved. No compromises on component quality.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Performance Guarantee",
      desc: "System output guaranteed in writing. If underperforms, we troubleshoot at no cost.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Support Guarantee",
      desc: "24/7 customer support. On-site service within 48 hours of report.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Efficiency Guarantee",
      desc: "Minimum 0.9kWh per kW daily (conservative). Underperformance investigated.",
    },
  ];

  return (
    <section id="trust" className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          Built on Trust
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          Certifications, Warranties & Guarantees
        </h2>
        <p className="mt-4 mx-auto max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
          Every SAFWE installation is backed by rigorous certifications, extended warranties, and our ironclad guarantees
        </p>
      </div>

      {/* Trust Badges */}
      <div className="mb-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {certifications.map((cert, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-md hover:shadow-lg transition"
          >
            <div className="text-4xl mb-3 text-center">{cert.icon}</div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">{cert.name}</h3>
            <p className="text-xs text-slate-600 mb-3 leading-5">{cert.desc}</p>
            <div className="text-amber-500 text-sm font-semibold">{cert.trust}</div>
          </div>
        ))}
      </div>

      {/* Our 4 Guarantees */}
      <div className="mb-16 rounded-2xl bg-linear-to-b from-amber-50 to-white border border-amber-200 p-8 md:p-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
          Our 4 Ironclad Guarantees
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g, i) => (
            <div key={i} className="rounded-xl bg-white p-6 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
                {g.icon}
              </div>
              <h4 className="font-bold text-slate-900 mb-2 text-sm">{g.title}</h4>
              <p className="text-xs text-slate-600 leading-5">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Warranty Matrix */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Comprehensive Warranty Coverage</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {warranties.map((warranty, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
              {/* Header */}
              <div className="bg-linear-to-r from-slate-900 to-slate-800 px-6 py-4">
                <h4 className="text-lg font-bold text-white">{warranty.category}</h4>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-200">
                {warranty.items.map((item, j) => (
                  <div key={j} className="p-5 hover:bg-slate-50 transition">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        {item.coverage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.guarantee}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Standards */}
      <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-8 md:p-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Our Installation Standards</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { check: "✓", text: "Only certified installers (6+ months training)" },
            { check: "✓", text: "100% quality audit before handover" },
            { check: "✓", text: "Detailed documentation & warranties provided" },
            { check: "✓", text: "Structural assessment & load testing done" },
            { check: "✓", text: "Weather-sealed connections & waterproofing" },
            { check: "✓", text: "Performance testing & 30-day observation period" },
            { check: "✓", text: "Insurance coverage for installation damage" },
            { check: "✓", text: "24/7 post-installation support included" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold text-lg shrink-0 mt-0.5">
                {item.check}
              </span>
              <span className="text-slate-700 text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Support Promise */}
      <div className="mt-12 text-center rounded-2xl bg-linear-to-r from-amber-400 to-orange-400 px-8 py-12 text-white">
        <h3 className="text-2xl font-bold mb-3">Our Support Promise</h3>
        <p className="max-w-2xl mx-auto mb-6 text-sm">
          Beyond warranty, we&apos;re committed to your long-term satisfaction. We monitor your system 24/7, proactively alert you of any issues, and provide maintenance reminders to ensure your solar runs flawlessly for decades.
        </p>
        <a
          href="/contact"
          className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-amber-600 transition hover:bg-amber-50"
        >
          Learn About Our Support Plan →
        </a>
      </div>
    </section>
  );
}
