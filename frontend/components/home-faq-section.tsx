"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { getMoreContent } from "@/data/more-content";

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { locale, t } = useLocale();
  const faqItems = getMoreContent(locale).faqItems;

  return (
    <section id="home-faq" className="mx-auto mt-16 mb-8 w-full max-w-7xl px-4 md:mb-10 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">{t("faq.eyebrow")}</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-slate-900 md:text-4xl">{t("faq.title")}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-7 text-slate-600 md:text-base">{t("faq.description")}</p>

        <div className="mt-6 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <button
                  type="button"
                  onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-semibold text-slate-900">{item.question}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen ? <div className="border-t border-slate-200 px-5 py-4 text-sm leading-7 text-slate-600">{item.answer}</div> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
