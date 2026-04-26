import { trustedBrands } from "@/data/site";

export default function TrustedBrands() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl dark:border-slate-700/70 dark:bg-slate-900/78 dark:shadow-[0_14px_34px_rgba(0,0,0,0.38)]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-200">
          Trusted Brands We Compare
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {trustedBrands.map((brand) => (
            <div
              key={brand}
              className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-950/82 dark:text-slate-100"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
