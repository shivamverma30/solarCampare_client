"use client";

import { trustedBrands } from "@/data/site";
import { useLocale } from "@/components/locale-provider";

export default function TrustedBrands() {
  const { t } = useLocale();
  const marqueeBrands = [...trustedBrands, ...trustedBrands];

  return (
    <section className="mt-4 w-full border-t border-cyan-400/20 bg-[linear-gradient(135deg,rgba(2,6,23,0.98),rgba(8,47,73,0.95))] py-8 shadow-[0_-12px_40px_rgba(2,6,23,0.15)] md:py-10">
      <div className="overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200/90">
          {t("trustedBrands.title")}
        </p>
        <div className="relative mt-6 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-slate-950 via-slate-950/80 to-transparent" />
          <div className="flex whitespace-nowrap py-1" style={{ animation: "brand-scroll 24s linear infinite" }}>
            {marqueeBrands.map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="mx-2 flex items-center justify-center rounded-2xl border border-emerald-400/20 bg-white/8 px-4 py-3 text-sm font-semibold text-slate-100 shadow-[0_10px_30px_rgba(8,47,73,0.18)] backdrop-blur md:px-5"
              >
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.16)]" />
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes brand-scroll {
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
