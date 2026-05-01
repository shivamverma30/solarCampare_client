import { testimonials } from "@/data/site";

export default function Testimonials() {
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">Testimonials</p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">Loved by Solar Buyers</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md"
          >
            <p className="text-sm leading-7 text-slate-600">&ldquo;{testimonial.quote}&rdquo;</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
              <p className="text-xs text-slate-500">{testimonial.company}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
