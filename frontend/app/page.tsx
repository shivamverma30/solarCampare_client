import Link from "next/link";
import HeroSlider from "@/components/hero-slider";
import BenefitsSection from "@/components/benefits-section";
import TrustedBrands from "@/components/trusted-brands";
import Testimonials from "@/components/testimonials";
import CtaBanner from "@/components/cta-banner";

export default function Home() {
  return (
    <div>
      <section className="relative mx-auto min-h-[88vh] w-full max-w-375 overflow-hidden rounded-4xl border border-white/20 px-4 pb-14 pt-28 shadow-2xl md:px-8 md:pt-36">
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

      <BenefitsSection />
      <TrustedBrands />
      <CtaBanner />
      <Testimonials />
    </div>
  );
}
