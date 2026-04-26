import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/50 bg-linear-to-r from-amber-100 via-orange-100 to-yellow-100 p-8 shadow-xl dark:border-amber-400/35 dark:from-slate-950/92 dark:via-amber-950/48 dark:to-slate-900/92 dark:shadow-[0_16px_40px_rgba(0,0,0,0.42)]">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700 dark:text-amber-300">Ready to go solar?</p>
          <h3 className="mt-3 font-serif text-3xl text-slate-900 dark:text-slate-50">Get your personalized savings proposal in minutes.</h3>
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-200">
            Analyze your property, compare panel options, and estimate monthly returns with one guided experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black dark:bg-amber-300 dark:text-black dark:shadow-[0_10px_24px_rgba(251,191,36,0.32)] dark:hover:bg-amber-200"
            >
              Start Calculation
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-slate-400/60 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/70 dark:border-slate-300/70 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/14"
            >
              Compare Panels
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
