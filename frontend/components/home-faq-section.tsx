"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type HomeFaq = {
  question: string;
  answer: string;
};

const homeFaqs: HomeFaq[] = [
  {
    question: "Is Solar Compare free to use?",
    answer:
      "Yes. You can compare solutions, review guidance, and submit proposal requests without paying any platform fee.",
  },
  {
    question: "How much subsidy can I receive?",
    answer:
      "Subsidy depends on system size, eligibility, and current scheme rules. Our workflow helps you estimate and track available benefits.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Typical residential installations are completed within a few days after approvals and material readiness, while end-to-end timelines vary by location.",
  },
  {
    question: "Can I get EMI financing?",
    answer:
      "Yes. Financing and EMI options are available for many buyer profiles, subject to lender terms and project eligibility.",
  },
  {
    question: "Are vendors verified?",
    answer:
      "We route requests through verified vendor workflows so buyers can compare with better trust and transparency.",
  },
  {
    question: "What warranty is included?",
    answer:
      "Warranties vary by panel, inverter, and installer. Product and performance coverage details are shared clearly during proposal comparison.",
  },
  {
    question: "How much can I save annually?",
    answer:
      "Savings depend on tariff, usage pattern, system size, and net metering outcomes. Use calculators and proposals for realistic annual estimates.",
  },
  {
    question: "What happens after submitting a proposal request?",
    answer:
      "Your details are reviewed and routed for vendor follow-up. You receive support to compare proposals, subsidy fit, and financing options before final decision.",
  },
];

export default function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="home-faq" className="mx-auto mt-16 mb-8 w-full max-w-7xl px-4 md:mb-10 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">FAQ</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-slate-900 md:text-4xl">Frequently Asked Questions</h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-7 text-slate-600 md:text-base">
          Clear answers to common questions about subsidy, installation, financing, savings, and vendor support.
        </p>

        <div className="mt-6 space-y-3">
          {homeFaqs.map((item, index) => {
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
