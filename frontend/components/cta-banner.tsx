"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export default function CtaBanner() {
  const { t } = useLocale();

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-linear-to-r from-white via-emerald-50 to-slate-100 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_28%)]" />
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-700">{t("cta.eyebrow")}</p>
          <h3 className="mt-3 font-serif text-3xl text-slate-900">{t("cta.title")}</h3>
          <p className="mt-3 text-sm text-slate-700">
            {t("cta.description")}
          </p>
          <div className="mt-7 flex flex-wrap items-stretch gap-3 sm:gap-4">
            <Link
              href="/calculator"
              className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {t("buttons.startCalculation")}
            </Link>
            <Link
              href="/calculator"
              className="inline-flex h-12 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-6 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              {t("buttons.getProposal")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
