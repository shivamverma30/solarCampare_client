"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardCheck, Gauge, HandCoins, SearchCheck, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import type { InfoPage } from "@/data/info-pages";
import { getMoreContent } from "@/data/more-content";

type AboutPageContentProps = {
  page: InfoPage;
};

const trustIcons = [ShieldCheck, BadgeCheck, Sparkles, Workflow] as const;

export default function AboutPageContent({ page }: AboutPageContentProps) {
  const { locale, t } = useLocale();
  const isHindi = locale === "hi";
  const content = getMoreContent(locale);

  const supportCards = content.aboutTrustPillars.map((item, index) => {
    const Icon = trustIcons[index % trustIcons.length];

    return {
      ...item,
      icon: Icon,
    };
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,249,255,0.9))] p-6 shadow-[0_24px_62px_rgba(15,23,42,0.08)] md:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-sky-200/35 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">{t("aboutPage.eyebrow")}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-6xl">{page.heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg md:leading-9">{page.heroDescription}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {page.highlights.map((item) => (
              <span key={item} className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
          <article className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("aboutPage.storyLabel")}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{page.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base md:leading-8">{content.aboutOverview.companyOverview}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {content.platformStats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.96),rgba(255,255,255,0.96))] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{t("aboutPage.missionLabel")}</p>
              <p className="mt-3 text-base leading-8 text-slate-700 md:text-lg">{content.aboutOverview.mission}</p>
            </div>

            <div className="rounded-[28px] border border-sky-100 bg-[linear-gradient(180deg,rgba(239,246,255,0.96),rgba(255,255,255,0.96))] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">{t("aboutPage.visionLabel")}</p>
              <p className="mt-3 text-base leading-8 text-slate-700 md:text-lg">{content.aboutOverview.vision}</p>
            </div>
          </article>
        </div>

        <div className="relative z-10 mt-6 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("aboutPage.whyLabel")}</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{t("aboutPage.whyTitle")}</h3>
            <div className="mt-5 space-y-3">
              {content.whyChooseSolarCompare.map((point) => (
                <div key={point} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                    <SearchCheck className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-slate-700">{point}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("aboutPage.journeyLabel")}</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{t("aboutPage.journeyTitle")}</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {content.aboutJourney.map((step, index) => {
                const icons = [Gauge, ClipboardCheck, HandCoins, Workflow, ShieldCheck];
                const Icon = icons[index % icons.length];

                return (
                  <div key={step.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">0{index + 1}</span>
                    </div>
                    <h4 className="mt-4 text-base font-semibold text-slate-950">{step.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </div>

        <div className="relative z-10 mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("aboutPage.trustLabel")}</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{t("aboutPage.trustTitle")}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {supportCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h4 className="mt-4 text-base font-semibold text-slate-950">{item.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,rgba(236,253,245,0.95),rgba(255,255,255,0.98))] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">{isHindi ? "संपूर्ण सहायता" : "Complete support"}</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{page.summary}</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {page.details.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {t("aboutPage.ctaPrimary")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                {t("aboutPage.ctaSecondary")}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}