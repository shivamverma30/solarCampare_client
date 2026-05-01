import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/50 bg-linear-to-r from-amber-100 via-orange-100 to-yellow-100 p-8 shadow-xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">Ready to go solar?</p>
          <h3 className="mt-3 font-serif text-3xl text-slate-900">Get your personalized savings proposal in minutes.</h3>
          <p className="mt-3 text-sm text-slate-700">
            Analyze your property, compare panel options, and estimate monthly returns with one guided experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              Start Calculation
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-slate-400/60 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/70"
            >
              Compare Panels
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
