"use client";

import { useLocale } from "@/components/locale-provider";

export default function Vendors() {
  const { t } = useLocale();

  const trustBadges = [
    { icon: "✅", title: t("vendors.badges.verified"), desc: t("vendors.badges.verifiedDesc") },
    { icon: "🏆", title: t("vendors.badges.audited"), desc: t("vendors.badges.auditedDesc") },
    { icon: "💬", title: t("vendors.badges.pricing"), desc: t("vendors.badges.pricingDesc") },
    { icon: "🛡️", title: t("vendors.badges.amc"), desc: t("vendors.badges.amcDesc") },
  ];

  const vendors = [
    {
      initials: "SG",
      name: "SunGuard Solar Pvt. Ltd.",
      city: "Bhopal, Madhya Pradesh",
      rating: 4.9,
      reviews: 128,
      installs: "320+",
      specialty: "On-Grid, Hybrid",
      avgQuote: "₹42,000/kW",
      responseTime: "< 2 hours",
      bgColor: "bg-amber-100",
      textColor: "text-amber-900",
    },
    {
      initials: "RE",
      name: "RoofEnergy Solutions",
      city: "Indore, Madhya Pradesh",
      rating: 4.7,
      reviews: 96,
      installs: "210+",
      specialty: "Off-Grid, Agricultural",
      avgQuote: "₹39,500/kW",
      responseTime: "< 4 hours",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-900",
    },
    {
      initials: "AP",
      name: "AuraPower India Ltd.",
      city: "Jabalpur, Madhya Pradesh",
      rating: 4.5,
      reviews: 74,
      installs: "180+",
      specialty: "Commercial, Industrial",
      avgQuote: "₹38,000/kW",
      responseTime: "< 6 hours",
      bgColor: "bg-blue-100",
      textColor: "text-blue-900",
    },
  ];

  return (
    <section id="vendors" className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          {t("vendors.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          {t("vendors.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          {t("vendors.description")}
        </p>
      </div>

      {/* Intro Section */}
      <div className="mb-12 grid gap-6 md:grid-cols-2 md:gap-8">
        <div>
          <p className="text-sm leading-7 text-slate-600">
            {t("vendors.vendorIntro")}{" "}
            <strong className="text-slate-900">{t("vendors.vendorBenefits")}</strong>
          </p>
          <a
            href="#contact"
            className="mt-4 inline-block rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-amber-300"
          >
            {t("vendors.becomeVendor")}
          </a>
        </div>

        <div className="space-y-3">
          {trustBadges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white/70 p-3"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="font-semibold text-slate-900">{badge.title}</p>
                <p className="text-xs text-slate-600">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {vendors.map((vendor) => (
          <article
            key={vendor.name}
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Avatar */}
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg font-serif text-lg font-bold ${vendor.bgColor} ${vendor.textColor}`}
              >
                {vendor.initials}
              </div>
              <span className="inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                ✓ VERIFIED
              </span>
            </div>

            {/* Vendor Info */}
            <h3 className="font-semibold text-slate-900">{vendor.name}</h3>
            <p className="mt-1 text-xs text-slate-600">📍 {vendor.city}</p>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-1 text-sm">
              <span className="text-amber-400">
                {"★".repeat(Math.floor(vendor.rating))}
                {"☆".repeat(5 - Math.floor(vendor.rating))}
              </span>
              <span className="font-medium text-slate-900">{vendor.rating}</span>
              <span className="text-xs text-slate-600">
                ({vendor.reviews} installs)
              </span>
            </div>

            {/* Specs */}
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
              {[
                { label: "Systems Installed", value: vendor.installs },
                { label: "Speciality", value: vendor.specialty },
                { label: "Avg. Quote", value: vendor.avgQuote },
                { label: "Response Time", value: vendor.responseTime },
              ].map((spec, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-slate-600">{spec.label}</span>
                  <span className="font-medium text-slate-900">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="mt-4 w-full rounded-lg border border-amber-300 bg-transparent py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50">
              Request Quote →
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
