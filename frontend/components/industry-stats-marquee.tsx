"use client";

const statsItems = [
  "150 GW Solar Installed — Mar 2026",
  "PM Surya Ghar Subsidy — ₹78,000 Available Now",
  "40 Lakh+ Homes Solarised & Counting",
  "Solar Tariff — ₹2.44/unit (Cheaper than Grid)",
  "Collateral-Free Solar Loan @ 6.75% p.a.",
  "India Ranked #3 Globally in Solar Production",
  "210 GW Solar Module Manufacturing Capacity",
  "MNRE Approved Vendors Network",
  "Residential & Commercial Solar Solutions",
  "Government Subsidy Support Available",
];

export default function IndustryStatsMarquee() {
  return (
    <section className="mx-auto mt-12 w-full max-w-7xl px-4 md:mt-14 md:px-8">
      <div className="overflow-hidden rounded-[1.75rem] border border-cyan-400/20 bg-slate-950/95 shadow-[0_20px_70px_rgba(2,6,23,0.38)] backdrop-blur-xl">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-slate-950 via-slate-950/80 to-transparent" />
          <div
            className="flex whitespace-nowrap py-4 md:py-5"
            style={{ animation: "industry-scroll 30s linear infinite" }}
          >
            {[...statsItems, ...statsItems].map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="mx-2 flex items-center gap-2.5 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-slate-100 shadow-[0_8px_24px_rgba(8,47,73,0.2)] backdrop-blur"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.16)]" />
                <span className="tracking-[0.02em]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes industry-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
