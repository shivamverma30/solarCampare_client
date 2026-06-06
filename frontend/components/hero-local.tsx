"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import HeroSlider from "@/components/hero-slider"
import Countdown from "@/components/countdown"

export default function HeroLocal() {
  const { t } = useLocale()

  return (
    <section className="relative isolate mx-auto w-full max-w-375 overflow-hidden px-4 pb-0 pt-24 md:px-8 md:pt-28 min-h-screen">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.64))]" />
      <HeroSlider background />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.24),rgba(2,6,23,0.42),rgba(2,6,23,0.18))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_24%)]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-1 lg:gap-12">
        <div className="space-y-7 max-w-4xl">
          <p className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-500/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-100 shadow-sm">
            {t("site.premium")}
          </p>

          <h1 className="max-w-4xl text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            {t("site.heroTitle")}
          </h1>

          <p className="max-w-2xl text-base leading-7 text-slate-100/88 md:text-lg md:leading-8">
            {t("site.heroDescription")}
          </p>

          <div className="flex flex-wrap items-stretch gap-3">
            <Link
              href="/calculator"
              className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500 px-7 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(15,23,42,0.28)] transition hover:bg-emerald-600"
            >
              {t("buttons.calculateMySavings")}
            </Link>
            <Link
              href="/compare"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white shadow-sm transition hover:border-white/30 hover:bg-white/18"
            >
              {t("buttons.comparePanels")}
            </Link>
          </div>
        </div>

        {/* Compact countdown positioned top-right on large screens */}
        <div className="absolute right-6 top-6 z-20 hidden lg:block">
          <Countdown variant="hero" />
        </div>
      </div>
    </section>
  )
}
