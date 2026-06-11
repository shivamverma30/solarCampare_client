"use client";

import {
  BadgeCheck,
  BarChart3,
  Calculator,
  ClipboardCheck,
  Coins,
  Gauge,
  HandCoins,
  Headphones,
  Percent,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export default function BenefitsSection() {
  const { locale, t } = useLocale();

  const benefits = [
    { label: locale === "hi" ? "₹78,000 सब्सिडी सहायता" : "₹78,000 Subsidy Support", icon: HandCoins },
    { label: locale === "hi" ? "सत्यापित विक्रेता" : "Verified Vendors", icon: BadgeCheck },
    { label: locale === "hi" ? "रियल-टाइम ट्रैकिंग" : "Real-Time Tracking", icon: Gauge },
    { label: locale === "hi" ? "शून्य कमीशन" : "Zero Commission", icon: Sparkles },
    { label: locale === "hi" ? "फाइनेंसिंग सहायता" : "Financing Assistance", icon: Workflow },
    { label: locale === "hi" ? "एंड-टू-एंड सपोर्ट" : "End-to-End Support", icon: ShieldCheck },
  ];

  const reasons = [
    {
      title: locale === "hi" ? "सही मूल्य पारदर्शिता" : "Real price transparency",
      description: locale === "hi" ? "कोटेशन, उपकरण और कार्य-क्षेत्र को बिना छिपी लागत के समझें।" : "Understand quotations, equipment, and scope without hidden cost surprises.",
      icon: BarChart3,
    },
    {
      title: locale === "hi" ? "₹78,000 सब्सिडी सहायता" : "₹78,000 subsidy support",
      description: locale === "hi" ? "पात्रता और दावों की तैयारी को स्पष्ट रखकर बेहतर नेट निवेश योजना बनाएं।" : "Keep eligibility and claim preparation clear so your net investment plan stays accurate.",
      icon: Coins,
    },
    {
      title: locale === "hi" ? "27-पॉइंट विक्रेता सत्यापन" : "27-point vendor verification",
      description: locale === "hi" ? "सत्यापित गुणवत्ता, दस्तावेज़ और निष्पादन मानकों के साथ जोखिम कम करें।" : "Reduce risk with vetted quality, documentation, and execution standards.",
      icon: ClipboardCheck,
    },
    {
      title: locale === "hi" ? "सटीक बचत गणना" : "Real savings calculation",
      description: locale === "hi" ? "टैरिफ, लोड और सिस्टम आकार के आधार पर वास्तविक ROI और पेबैक देखें।" : "See real ROI and payback based on tariff, load, and system size.",
      icon: Calculator,
    },
    {
      title: locale === "hi" ? "पोस्ट-इंस्टॉल सपोर्ट & O&M" : "Post-install support & O&M",
      description: locale === "hi" ? "इंस्टॉलेशन के बाद मॉनिटरिंग, सर्विस और रखरखाव में सहायता जारी रहती है।" : "Support continues after installation with monitoring, service, and maintenance help.",
      icon: Headphones,
    },
    {
      title: locale === "hi" ? "शून्य कमीशन" : "Zero commission",
      description: locale === "hi" ? "निर्णय का फोकस कीमत और मूल्य पर रखें, न कि कमीशन दबाव पर।" : "Keep the decision focused on value and pricing, not commission pressure.",
      icon: Percent,
    },
  ];

  return (
    <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(236,253,245,0.84))] p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">{t("benefits.eyebrow")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
            {locale === "hi" ? "समझदार ग्राहक Solar Compare क्यों चुनते हैं" : "Why Smart Buyers Choose Solar Compare"}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-700 md:text-2xl md:leading-10">
            {locale === "hi" ? (
              "समझदार ग्राहक सिर्फ सोलर नहीं अपनाते। वे सही सोलर अपनाते हैं।"
            ) : (
              <>
                Smart buyers don't just go solar. They go solar <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text font-extrabold text-transparent">right.</span>
              </>
            )}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
            {locale === "hi"
              ? "एक ही जगह पर मूल्य स्पष्टता, सत्यापित नेटवर्क, सब्सिडी सहायता और निरंतर पोस्ट-इंस्टॉलेशन आत्मविश्वास।"
              : "One premium workflow for price clarity, verified vendors, subsidy support, and ongoing post-install confidence."}
          </p>
        </div>

        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-full border border-emerald-100 bg-white/90 px-4 py-2.5 text-sm font-semibold text-emerald-950 shadow-[0_10px_22px_rgba(15,23,42,0.05)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="leading-5">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            const isAlt = index % 2 === 1;

            return (
              <article
                key={reason.title}
                className={`group flex h-full flex-col rounded-3xl border p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.1)] ${
                  isAlt
                    ? "border-emerald-200 bg-[linear-gradient(180deg,rgba(236,253,245,0.95),rgba(255,255,255,0.98))]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition ${isAlt ? "bg-emerald-100 text-emerald-700 ring-emerald-200" : "bg-slate-950 text-white ring-slate-900/10"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
                      {locale === "hi" ? `कारण ${index + 1}` : `Reason ${index + 1}`}
                    </p>
                    <h3 className="mt-1 text-[1.05rem] font-semibold leading-7 text-slate-950">{reason.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{reason.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
