"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import HeroSlider from "@/components/hero-slider"

export default function HeroLocal() {
  const premiumEase = [0.22, 1, 0.36, 1] as const;
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.65, ease: premiumEase },
  };

  return (
    <section className="relative isolate mx-auto w-full max-w-375 overflow-hidden px-4 pb-20 pt-24 md:px-8 md:pb-28 md:pt-28 min-h-[82vh]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.56))]" />
      <HeroSlider background />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,6,23,0.16),rgba(2,6,23,0.2),rgba(2,6,23,0.12))]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_26%)]" />

      <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col items-center justify-center text-center">
        <div className="w-full max-w-5xl space-y-8 sm:space-y-9 md:space-y-10">
          <motion.h1
            {...fadeUp}
            className="mx-auto max-w-5xl text-4xl font-extrabold leading-[1.02] tracking-[-0.02em] text-white drop-shadow-[0_10px_28px_rgba(2,6,23,0.3)] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Compare Solar with Confidence
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.68, ease: premiumEase, delay: 0.08 }}
            className="mx-auto max-w-4xl text-lg leading-8 text-slate-100 md:text-2xl md:leading-10"
          >
            Compare quotes, track subsidies, explore financing, and connect with verified solar partners-all through one trusted platform.
          </motion.p>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-6 z-20 max-w-[220px] text-left sm:bottom-8 sm:left-8 sm:max-w-[280px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 drop-shadow-[0_2px_8px_rgba(2,6,23,0.35)] sm:text-xs">
            Powering India&apos;s Solar Future
          </p>
        </div>
      </div>
    </section>
  )
}
