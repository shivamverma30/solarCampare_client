"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import HeroSlider from "@/components/hero-slider"
import Countdown from "@/components/countdown"

export default function HeroLocal() {
  const { t } = useLocale()

  return (
    <section className="relative mx-auto min-h-[88vh] w-full max-w-375 overflow-hidden rounded-none px-4 pb-16 pt-28 shadow-2xl md:px-8 md:pb-20 md:pt-32">
      <HeroSlider />
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start">
        <div>
          <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-white backdrop-blur">
            {t("site.tagline")}
          </p>

          <h1 className="mt-5 max-w-4xl text-3xl leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-4xl md:mt-6 md:text-5xl">
            {t("site.heroTitle")}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/92 md:mt-5 md:text-lg md:leading-8">
            {t("site.heroDescription")}
          </p>

          <div className="mt-7 flex flex-wrap gap-3 md:mt-8">
            <Link
              href="/calculator"
              className="rounded-full border border-amber-200/80 bg-amber-400 px-7 py-3 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(251,191,36,0.35)] transition hover:bg-amber-300"
            >
              {t("buttons.calculateMySavings")}
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-white/55 bg-white/18 px-7 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/30"
            >
              {t("buttons.comparePanels")}
            </Link>
          </div>

          <div className="mt-10 md:mt-12">
            <div className="rounded-[28px] bg-[rgba(255,255,255,0.14)] backdrop-blur-[20px] border border-white/20 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.12)] ring-1 ring-white/10 md:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-white">12,000+</p>
                  <p className="mt-1 text-sm text-white/70">{t("home.statSystems")}</p>
                </div>

                <div className="text-center">
                  <p className="text-4xl font-extrabold text-white">INR 18Cr+</p>
                  <p className="mt-1 text-sm text-white/70">{t("home.statSavings")}</p>
                </div>

                <div className="text-center">
                  <p className="text-4xl font-extrabold text-white">4.9/5</p>
                  <p className="mt-1 text-sm text-white/70">{t("home.statRating")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0 lg:justify-self-end">
          <Countdown variant="hero" />
        </div>
      </div>
    </section>
  )
}
