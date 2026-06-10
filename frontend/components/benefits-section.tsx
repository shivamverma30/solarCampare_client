"use client";

import { BadgeCheck, Gauge, HandCoins, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { getBenefits } from "@/data/site";
import { useLocale } from "@/components/locale-provider";

export default function BenefitsSection() {
  const { locale, t } = useLocale();
  const benefits = getBenefits(locale);

  const trustStrip = [
    { label: locale === "hi" ? "₹78,000 सब्सिडी सहायता" : "₹78,000 Subsidy Support", icon: HandCoins },
    { label: locale === "hi" ? "सत्यापित विक्रेता" : "Verified Vendors", icon: BadgeCheck },
    { label: locale === "hi" ? "रियल-टाइम ट्रैकिंग" : "Real-Time Tracking", icon: Gauge },
    { label: locale === "hi" ? "शून्य कमीशन" : "Zero Commission", icon: Sparkles },
    { label: locale === "hi" ? "फाइनेंसिंग सहायता" : "Financing Assistance", icon: Workflow },
    { label: locale === "hi" ? "एंड-टू-एंड सपोर्ट" : "End-to-End Support", icon: ShieldCheck },
  ];

  const introTitle = locale === "hi" ? "समझदार ग्राहक Solar Compare क्यों चुनते हैं" : "Why Smart Buyers Choose Solar Compare";
  const authorityLine = locale === "hi" ? "समझदार ग्राहक सिर्फ सोलर नहीं अपनाते। वे सही सोलर अपनाते हैं।" : "Smart buyers don't just go solar. They go solar right.";
  const subcopy =
    locale === "hi"
      ? "एक ही जगह पर मूल्य स्पष्टता, सत्यापित नेटवर्क, सब्सिडी सहायता और निरंतर पोस्ट-इंस्टॉलेशन सपोर्ट।"
      : "One premium workflow for price clarity, verified vendors, subsidy support, and ongoing post-install confidence.";
  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="rounded-[2rem] border border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(236,253,245,0.82))] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">{t("benefits.eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{introTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700 md:text-xl">{authorityLine}</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">{subcopy}</p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-white/80 px-3 py-3 shadow-sm">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {trustStrip.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl bg-emerald-50/80 px-3 py-2.5 text-sm font-semibold text-emerald-950">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="leading-5">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="group flex h-full flex-col rounded-[1.5rem] border border-emerald-100/80 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition group-hover:bg-emerald-100">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[1.05rem] font-semibold leading-7 text-slate-950">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{benefit.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
