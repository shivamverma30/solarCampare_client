import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInfoPage, infoPages } from "@/data/info-pages";

type MorePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return infoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: MorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.title,
    description: page.summary,
  };
}

export default async function MorePage({ params }: MorePageProps) {
  const { slug } = await params;
  const page = getInfoPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Information</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">{page.heroTitle}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{page.heroDescription}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-950">Highlights</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {page.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">Details</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              {page.details.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Browse services
          </Link>
          <Link href="/calculator" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
            Open calculator
          </Link>
        </div>
      </section>
    </main>
  );
}