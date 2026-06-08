"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function format(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({
  target = new Date("2027-03-31T23:59:59Z"),
  variant = "section",
}: {
  target?: Date | string;
  variant?: "section" | "hero" | "hero-wide" | "subsidy";
}) {
  const targetDate = typeof target === "string" ? new Date(target) : target;

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isReady = now !== null;

  let days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0;

  if (isReady) {
    const diff = Math.max(0, targetDate.getTime() - (now as Date).getTime());
    const secs = Math.floor(diff / 1000);
    days = Math.floor(secs / (3600 * 24));
    hours = Math.floor((secs % (3600 * 24)) / 3600);
    minutes = Math.floor((secs % 3600) / 60);
    seconds = secs % 60;
  }

  const values = [
    { label: "Days", value: isReady ? String(days) : "00" },
    { label: "Hours", value: isReady ? format(hours) : "00" },
    { label: "Minutes", value: isReady ? format(minutes) : "00" },
    { label: "Seconds", value: isReady ? format(seconds) : "00" },
  ];

  const isHero = variant === "hero";
  const isHeroWide = variant === "hero-wide";
  const isSubsidy = variant === "subsidy";
  const fadeUpInView = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.35 },
    transition: { duration: 0.65, ease: "easeOut" as const },
  };

  const card = (
    <motion.div
      {...fadeUpInView}
      className={`rounded-[28px] border ${
        isSubsidy
          ? "border-slate-200/80 bg-white p-5 sm:p-6 md:p-7 text-slate-900 shadow-sm"
          : isHeroWide
          ? "border-emerald-200/50 bg-[linear-gradient(135deg,rgba(6,23,16,0.34),rgba(10,32,23,0.22))] p-5 sm:p-6 md:p-7 text-white shadow-[0_26px_62px_rgba(2,6,23,0.28)]"
          : "border-emerald-200/30 bg-[rgba(6,23,16,0.46)]"
      } ${isHero ? "w-96 p-3" : isHeroWide || isSubsidy ? "w-full" : "p-4 sm:p-5"} shadow-[0_18px_40px_rgba(2,6,23,0.28)] ring-1 ${
        isSubsidy ? "ring-transparent" : isHeroWide ? "ring-white/14 backdrop-blur-[26px]" : "ring-white/10"
      } ${isSubsidy ? "backdrop-blur-0" : "backdrop-blur-[22px]"} transition duration-300 ${
        isHero || isHeroWide || isSubsidy ? "hover:translate-y-0" : "hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(2,6,23,0.3)]"
      }`}
    >
      <div className={`flex flex-col ${isHeroWide || isSubsidy ? "gap-5" : "gap-3"}`}>
        {!isSubsidy ? (
          <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] ${isHeroWide ? "text-emerald-200" : "text-emerald-200"} ${isHero ? "text-[10px]" : ""}`}>Upcoming Solar Subsidy Update</p>
          <h3 className={`mt-1 font-semibold ${isHeroWide ? "text-white" : "text-white"} ${isHero ? "text-lg" : "text-xl sm:text-2xl"}`}>Grab the Subsidy Benefit Now</h3>
          <p className={`mt-1 text-sm ${isHeroWide ? "leading-6 text-emerald-50/88" : "leading-5 text-emerald-50/84"} ${isHero ? "text-xs leading-4" : "leading-6"}`}>Track the deadline and plan your proposal before the update closes.</p>
          </div>
        ) : null}

        {isSubsidy ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{values[0].value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700/85">{values[0].label}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{values[1].value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700/85">{values[1].label}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{values[2].value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700/85">{values[2].label}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{values[3].value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700/85">{values[3].label}</div>
            </div>
            </div>

            <div className="pt-4 text-center">
              <Link
                href="/calculator"
                className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-300/80 bg-emerald-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/70"
              >
                Get Free Quote
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={`grid ${isHero ? "grid-cols-2 gap-3" : "grid-cols-2 gap-3 sm:grid-cols-4"}`}>
              {values.map((item) => (
                <div key={item.label} className={`rounded-2xl border ${isHeroWide ? "border-white/20 bg-white/12 ring-white/16" : "border-white/14 bg-white/8 ring-white/10"} px-4 ${isHero ? "py-2" : "py-3"} text-center shadow-[0_10px_24px_rgba(2,6,23,0.14)] ring-1 backdrop-blur`}>
                  <div className={`font-extrabold tracking-tight ${isHeroWide ? "text-white" : "text-white"} ${isHero ? "text-2xl" : "text-3xl"}`}>{item.value}</div>
                  <div className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isHeroWide ? "text-emerald-100/85" : "text-emerald-100/78"}`}>{item.label}</div>
                </div>
              ))}
            </div>

            {isHeroWide ? (
              <div className="pt-1">
                <Link
                  href="/calculator"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-300/70 bg-emerald-400 px-7 text-sm font-semibold text-slate-950 shadow-[0_14px_34px_rgba(10,80,46,0.34)] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200/70"
                >
                  Get Free Quote
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </motion.div>
  );

  if (variant === "hero" || variant === "hero-wide" || variant === "subsidy") return card;

  return (
    <section aria-labelledby="countdown-heading" className="mx-auto mt-12 w-full max-w-7xl px-4 md:mt-14 md:px-8">
      <div className="rounded-3xl border border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(236,253,245,0.72))] p-4 shadow-[0_20px_52px_rgba(15,23,42,0.1)] sm:p-6">
        {card}
      </div>
    </section>
  );
}
