"use client";

import { Calculator, ClipboardCheck, Handshake, SearchCheck, Sparkles } from "lucide-react";
import { howItWorksSteps } from "@/data/more-content";

const iconMap: Record<string, typeof Calculator> = {
  calculate: Calculator,
  compare: SearchCheck,
  proposal: ClipboardCheck,
  connect: Handshake,
  install: Sparkles,
};

export default function HowSolarCompareWorks() {
  return (
    <section className="mx-auto mt-8 w-full max-w-7xl px-4 md:mt-10 md:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.98),rgba(15,23,42,0.96))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.35)] md:p-8 lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_26%)]" />
        <div className="relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/90">How SolarCompare Works</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">How SolarCompare Works</h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            {howItWorksSteps.map((step, index) => {
              const Icon = iconMap[step.key] || Sparkles;

              return (
                <article
                  key={step.key}
                  className="group flex h-full flex-col rounded-[1.35rem] border border-white/12 bg-white/10 p-5 shadow-[0_16px_48px_rgba(2,6,23,0.2)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:bg-white/16"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/30 bg-white/95 text-slate-900 shadow-[0_0_24px_rgba(16,185,129,0.16)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-950/40 px-2.5 py-1 text-xs font-semibold text-slate-300">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
