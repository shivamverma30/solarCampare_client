import Link from "next/link";
import { infoPages } from "@/data/info-pages";

export default function MoreLandingPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">More</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">Information pages for buyers who need context</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          These pages collect the platform information that does not belong on the homepage, so the main experience stays focused.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {infoPages.map((page) => (
            <Link
              key={page.slug}
              href={`/more/${page.slug}`}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-slate-300 hover:bg-white"
            >
              <h2 className="text-xl font-semibold text-slate-950">{page.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{page.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}