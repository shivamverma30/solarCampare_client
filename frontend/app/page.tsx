import Link from "next/link";
import HeroSlider from "@/components/hero-slider";
import BenefitsSection from "@/components/benefits-section";
import TrustedBrands from "@/components/trusted-brands";
import Testimonials from "@/components/testimonials";
import CtaBanner from "@/components/cta-banner";

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
  return (
    <div>
      <section className="relative mx-auto min-h-[88vh] w-full max-w-375 overflow-hidden rounded-none px-4 pb-14 pt-28 shadow-2xl md:px-8 md:pt-36">
        <HeroSlider />
        <div className="mx-auto max-w-5xl">
          <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-white backdrop-blur">
            Premium Solar Intelligence Platform
          </p>

          <h1 className="mt-6 max-w-4xl text-4xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] md:text-6xl">
            Build a future-ready solar system with confidence, speed, and transparent economics.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/92 md:text-lg">
            Compare top brands, estimate savings, and calculate financing in one cinematic buying experience crafted for premium homeowners and businesses.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="rounded-full border border-amber-200/80 bg-amber-400 px-7 py-3 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition hover:bg-amber-300"
            >
              Calculate My Savings
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-white/55 bg-white/18 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30"
            >
              Compare Solar Panels
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 rounded-2xl border border-white/28 bg-black/34 p-6 shadow-2xl backdrop-blur md:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-white">12,000+</p>
            <p className="text-sm text-white/82">Systems Assessed</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-white">INR 18Cr+</p>
            <p className="text-sm text-white/82">Projected Client Savings</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-white">4.9/5</p>
            <p className="text-sm text-white/82">Average Client Rating</p>
          </div>
        </div>
      </section>

      <section id="our-products" className="mx-auto mt-14 w-full max-w-375 px-4 md:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-emerald-200/45 bg-white/92 p-6 shadow-[0_18px_52px_rgba(14,116,144,0.12)] backdrop-blur-xl md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">Our Products</p>
          <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-5xl">Top Solar Products</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 md:text-base">
            Compare premium solar brands with transparent specifications and trusted performance.
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
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-emerald-700">Premium Panel</p>
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
                    <dt className="text-slate-600">Panel Type</dt>
                    <dd className="text-right font-medium text-slate-900">{product.panelType}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">Efficiency</dt>
                    <dd className="text-right font-medium text-slate-900">{product.efficiency}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">Warranty</dt>
                    <dd className="text-right font-medium text-slate-900">{product.warranty}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 pb-2">
                    <dt className="text-slate-600">Power Output</dt>
                    <dd className="text-right font-medium text-slate-900">{product.powerOutput}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3 pb-1">
                    <dt className="text-slate-600">Best For</dt>
                    <dd className="text-right font-medium text-slate-900">{product.bestFor}</dd>
                  </div>
                </dl>

                <Link
                  href="/compare"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-emerald-300/80 bg-emerald-100/85 px-4 py-2.5 text-sm font-semibold text-emerald-900 transition group-hover:bg-emerald-200"
                >
                  Compare Now
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
