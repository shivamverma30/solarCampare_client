import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ServiceInquiryForm from "@/components/service-inquiry-form";
import { getServicePage, servicePages } from "@/data/service-pages";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServicePage(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Service</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">{service.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{service.heroDescription}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#inquiry-form"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Request a callback
            </Link>
            <Link
              href="/calculator"
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Open calculator
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Card title="Benefits" items={service.benefits} />
            <Card title="Use cases" items={service.useCases} />
          </div>
        </div>

        <div id="inquiry-form">
          <ServiceInquiryForm service={service} />
        </div>
      </section>
    </main>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}