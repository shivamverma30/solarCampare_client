"use client";

import { useLocale } from "@/components/locale-provider";

export default function HowItWorks() {
  const { t } = useLocale();

  const steps = [
    {
      key: "step1",
      num: t("howItWorks.step1.num"),
      title: t("howItWorks.step1.title"),
      desc: t("howItWorks.step1.desc"),
    },
    {
      key: "step2",
      num: t("howItWorks.step2.num"),
      title: t("howItWorks.step2.title"),
      desc: t("howItWorks.step2.desc"),
    },
    {
      key: "step3",
      num: t("howItWorks.step3.num"),
      title: t("howItWorks.step3.title"),
      desc: t("howItWorks.step3.desc"),
    },
    {
      key: "step4",
      num: t("howItWorks.step4.num"),
      title: t("howItWorks.step4.title"),
      desc: t("howItWorks.step4.desc"),
    },
  ];

  return (
    <section id="how" className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          {t("howItWorks.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          {t("howItWorks.title")}
        </h2>
        <p className="mt-3 mx-auto max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          {t("howItWorks.description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 md:gap-0">
        {steps.map((step, idx) => (
          <div key={step.key} className="relative">
            {/* Step Card */}
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50 font-serif text-xl font-bold text-amber-600">
                  {step.num}
                </div>
              </div>

              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">{step.desc}</p>
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="absolute top-8 left-[calc(50%+2rem)] right-[calc(-100%+2rem)] hidden h-0.5 bg-linear-to-r from-amber-400 to-transparent md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
