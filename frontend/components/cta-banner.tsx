"use client";

import Link from "next/link";
import { useLocale } from "@/components/locale-provider";

export default function CtaBanner() {
  const { t } = useLocale();

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-amber-200/50 bg-linear-to-r from-amber-100 via-orange-100 to-yellow-100 p-8 shadow-xl">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-700">{t("cta.eyebrow")}</p>
          <h3 className="mt-3 font-serif text-3xl text-slate-900">{t("cta.title")}</h3>
          <p className="mt-3 text-sm text-slate-700">
            {t("cta.description")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              {t("buttons.startCalculation")}
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-slate-400/60 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/70"
            >
              {t("buttons.comparePanels")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
