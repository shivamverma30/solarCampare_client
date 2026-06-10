"use client";

import { motion } from "framer-motion";
import Countdown from "@/components/countdown";
import { useLocale } from "@/components/locale-provider";

export default function SubsidyCountdownSection() {
  const { locale } = useLocale();
  const isHindi = locale === "hi";
  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <section className="relative mx-auto mt-8 w-full max-w-375 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200/80 bg-white/95 px-4 py-10 shadow-sm sm:px-8 sm:py-12 md:px-10 md:py-14">
        <motion.div {...fadeUp} className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600">{isHindi ? "सब्सिडी विंडो" : "Subsidy Window"}</p>
          <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-5xl">{isHindi ? "अभी सब्सिडी लाभ सुरक्षित करें" : "Grab the Subsidy Benefit Now"}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg md:leading-9">
            {isHindi
              ? "अंतिम तिथि पर नज़र रखें और अपडेट बंद होने से पहले अधिकतम सरकारी सब्सिडी लाभ सुरक्षित करें।"
              : "Track the deadline and secure maximum government subsidy benefits before the update closes."}
          </p>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.76, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="mx-auto mt-8 w-full max-w-5xl">
          <Countdown variant="subsidy" />
        </motion.div>
      </div>
    </section>
  );
}
