"use client";

import Link from "next/link";
import HeroLocal from "@/components/hero-local";
import BenefitsSection from "@/components/benefits-section";
import TrustedBrands from "@/components/trusted-brands";
import Testimonials from "@/components/testimonials";
import CtaBanner from "@/components/cta-banner";
import { useLocale } from "@/components/locale-provider";

const topSolarProducts = [
  {
    brand: "Goldi Solar",
    panelType: "Monocrystalline",
    efficiency: "21.5%",
    warranty: "25 Years",
    powerOutput: "400W-600W",
    bestFor: "Homes & Commercial",
  },
  {
    brand: "Waaree Solar",
    panelType: "Mono PERC",
    efficiency: "17%-21%",
    warranty: "25 Years",
    powerOutput: "325W-550W",
    bestFor: "Budget Installations",
  },
  {
    brand: "Vikram Solar",
    panelType: "Bifacial Glass-Glass",
    efficiency: "21.73%",
    warranty: "30 Years",
    powerOutput: "590W-615W",
    bestFor: "Premium Rooftops",
  },
  {
    brand: "Panasonic Solar",
    panelType: "Heterojunction",
    efficiency: "22.2%",
    warranty: "25 Years",
    powerOutput: "400W-410W",
    bestFor: "Small Roof High Output",
  },
  {
    brand: "Jakson Solar",
    panelType: "Bifacial Mono PERC",
    efficiency: "21.5%",
    warranty: "30 Years",
    powerOutput: "490W-510W",
    bestFor: "Hot Climate Areas",
  },
  {
    brand: "Premier Energies",
    panelType: "Dual Glass Bifacial",
    efficiency: "High Yield",
    warranty: "30 Years",
    powerOutput: "500W+",
    bestFor: "Long Term ROI",
  },
];

export default function Home() {
  const { t } = useLocale();

  return (
    <div>
      <HeroLocal />

      <section id="our-products" className="mx-auto mt-10 w-full max-w-375 px-4 md:mt-12 md:px-8 scroll-mt-20 md:scroll-mt-24 lg:scroll-mt-28">
        <div className="mx-auto max-w-7xl rounded-3xl border border-emerald-200/45 bg-white/92 p-6 shadow-[0_18px_52px_rgba(14,116,144,0.12)] backdrop-blur-xl md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">{t("home.ourProducts")}</p>
          <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-5xl">{t("home.topProducts")}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 md:text-base">
            {t("home.productsDescription")}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topSolarProducts.map((product) => (
              <article
                key={product.brand}
                className="group rounded-2xl border border-white/65 bg-linear-to-br from-white/95 via-white/88 to-emerald-50/58 p-5 shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_34px_rgba(15,23,42,0.18)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{product.brand}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-700">{t("home.premiumPanel")}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-300/80 bg-amber-100/85 text-amber-700">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 9h16" />
                      <path d="M4 15h16" />
                      <path d="M9 4v16" />
                      <path d="M15 4v16" />
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                  </span>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">{t("home.panelType")}</dt>
                    <dd className="text-right font-medium text-slate-900">{product.panelType}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">{t("home.efficiency")}</dt>
                    <dd className="text-right font-medium text-slate-900">{product.efficiency}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">{t("home.warranty")}</dt>
                    <dd className="text-right font-medium text-slate-900">{product.warranty}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">{t("home.powerOutput")}</dt>
                    <dd className="text-right font-medium text-slate-900">{product.powerOutput}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 pb-1">
                    <dt className="text-slate-600">{t("home.bestFor")}</dt>
                    <dd className="text-right font-medium text-slate-900">{product.bestFor}</dd>
                  </div>
                </dl>

                <Link
                  href="/compare"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-emerald-300/80 bg-emerald-100/85 px-4 py-2.5 text-sm font-semibold text-emerald-900 transition group-hover:bg-emerald-200"
                >
                  {t("buttons.compareNow")}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BenefitsSection />
      <TrustedBrands />
      <CtaBanner />
      <Testimonials />
    </div>
  );
}
