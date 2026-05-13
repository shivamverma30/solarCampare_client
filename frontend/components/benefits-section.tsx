"use client";

import { benefits } from "@/data/site";
import { useLocale } from "@/components/locale-provider";

export default function BenefitsSection() {
  const { t } = useLocale();
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">Benefits</p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">{t("benefits.title")}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">{benefit.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
