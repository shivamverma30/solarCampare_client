import type { Metadata } from "next";
import Image from "next/image";
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
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 md:px-8 md:pt-28">
      <section className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="relative min-h-[420px] w-full overflow-hidden">
          <Image
            src={`/images/services/${slug}.png`}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.95),rgba(2,6,23,0.4))]" />
          <div className="relative flex min-h-[420px] flex-col justify-between p-8 md:p-10 lg:p-12">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">Service</p>
              <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">{service.heroTitle}</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-100/90">{service.heroDescription}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#inquiry-form"
                  className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Request a callback
                </Link>
                <Link
                  href="/calculator"
                  className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Open calculator
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {service.benefits.slice(0, 3).map((benefit) => (
                <div key={benefit} className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 bg-white p-6 md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:p-10">
          <div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Why it matters</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">A structured, trustworthy path to better solar outcomes.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                This service page keeps the core guidance intact while presenting it in a more premium, decision-led format for modern solar buyers.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Card title="Benefits" items={service.benefits} />
              <Card title="Use cases" items={service.useCases} />
            </div>
          </div>

          <div id="inquiry-form">
            <ServiceInquiryForm service={service} />
          </div>
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