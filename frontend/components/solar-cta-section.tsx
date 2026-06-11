"use client";

import { useRouter } from "next/navigation";

export default function SolarCtaSection() {
  const router = useRouter();

  return (
    <section className="mx-auto mt-20 mb-14 w-full max-w-7xl px-4 md:mb-20 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-linear-to-br from-white via-emerald-50 to-[#d9f6e8] p-10 shadow-[0_26px_62px_rgba(10,80,46,0.16)] md:p-16">
        {/* Decorative radial glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-emerald-400/22 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-60 w-60 rounded-full bg-[#1f8f4d]/14 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(31,143,77,0.12),transparent_55%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          {/* Badge */}
          <span className="inline-flex items-center rounded-full border border-emerald-400/35 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 ring-1 ring-emerald-400/20 backdrop-blur-sm">
            Start Free...
          </span>

          {/* Heading */}
          <h2 className="max-w-2xl font-serif text-3xl leading-tight text-slate-900 md:text-5xl">
            <span className="block">Ready to go <span className="text-emerald-300">solar?</span></span>
            <span className="mt-1 block">Compare now — free.</span>
          </h2>

          {/* Subheading */}
          <p className="max-w-xl text-sm leading-7 text-slate-700 md:text-base">
            Help users compare solar solutions and get the best proposal.
          </p>

          {/* Buttons */}
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/calculator?openFlow=proposal")}
              className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/50 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              Get Free Quotes in 2 Min
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 shrink-0"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => router.push("/more/how-it-works")}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 bg-white/70 px-7 py-3.5 text-sm font-semibold text-emerald-900 backdrop-blur-sm transition hover:border-emerald-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
            >
              See How It Works
            </button>

            <button
              type="button"
              onClick={() => router.push("/referral-rewards")}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/70 bg-cyan-50/70 px-7 py-3.5 text-sm font-semibold text-cyan-950 backdrop-blur-sm transition hover:border-cyan-400 hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
            >
              🎉 Referral Rewards Program
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
