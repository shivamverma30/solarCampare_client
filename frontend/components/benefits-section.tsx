import { benefits } from "@/data/site";

export default function BenefitsSection() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">Benefits</p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 dark:text-slate-100 md:text-4xl">
          Why Smart Buyers Choose SolarCompare
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-2xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-200">{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
