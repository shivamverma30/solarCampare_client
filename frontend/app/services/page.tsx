import Link from "next/link";
import { servicePages } from "@/data/service-pages";

export default function ServicesLandingPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Services</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">Service pages built for clear buyer intent</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Explore the dedicated service pages for residential, industrial, financing, cleaning, ground-mounted, and maintenance requests.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {servicePages.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
            >
              <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{service.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}