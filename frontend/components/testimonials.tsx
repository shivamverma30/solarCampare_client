import { testimonials } from "@/data/site";

export default function Testimonials() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">Testimonials</p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 dark:text-slate-100 md:text-4xl">Loved by Solar Buyers</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-md dark:border-slate-700/75 dark:bg-slate-900/80 dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
          >
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-200">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{testimonial.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">{testimonial.company}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
