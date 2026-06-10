"use client";

import { Suspense } from "react";
import { useLocale } from "@/components/locale-provider";
import DCRComparison from "@/components/dcr-comparison";

function ComparePageContent() {
  const { t } = useLocale();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">{t("compare.eyebrow")}</p>
        <h1 className="mt-3 text-4xl text-slate-900">{t("compare.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          {t("compare.description")}
        </p>

        <div className="mt-10">
          <DCRComparison />
        </div>
      </div>
    </section>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <ComparePageContent />
    </Suspense>
  );
}
