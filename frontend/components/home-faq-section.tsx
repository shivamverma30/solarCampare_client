"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

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
  const { locale } = useLocale();

  const faqItems = locale === "hi"
    ? [
        { question: "क्या Solar Compare उपयोग करने के लिए मुफ्त है?", answer: "हाँ। आप बिना किसी प्लेटफ़ॉर्म शुल्क के समाधान तुलना, मार्गदर्शन और प्रस्ताव अनुरोध कर सकते हैं।" },
        { question: "मुझे कितनी सब्सिडी मिल सकती है?", answer: "सब्सिडी सिस्टम आकार, पात्रता और वर्तमान योजना नियमों पर निर्भर करती है। हमारा वर्कफ़्लो उपलब्ध लाभों का अनुमान लगाने और उन्हें ट्रैक करने में मदद करता है।" },
        { question: "इंस्टॉलेशन में कितना समय लगता है?", answer: "आमतौर पर मंज़ूरी और सामग्री उपलब्धता के बाद आवासीय इंस्टॉलेशन कुछ दिनों में पूरा हो जाता है, लेकिन कुल समय स्थान के अनुसार बदल सकता है।" },
        { question: "क्या EMI फाइनेंसिंग मिल सकती है?", answer: "हाँ। कई खरीदार प्रोफ़ाइल के लिए EMI और फाइनेंसिंग विकल्प उपलब्ध हैं, जो ऋणदाता की शर्तों और परियोजना पात्रता पर निर्भर करते हैं।" },
        { question: "क्या विक्रेता सत्यापित हैं?", answer: "हम अनुरोधों को सत्यापित विक्रेता वर्कफ़्लो से गुज़रते हैं ताकि खरीदार अधिक भरोसे और पारदर्शिता के साथ तुलना कर सकें।" },
        { question: "कौन-सी वारंटी शामिल है?", answer: "वारंटी पैनल, इन्वर्टर और इंस्टॉलर के अनुसार अलग-अलग होती है। कोटेशन तुलना के दौरान प्रोडक्ट और परफ़ॉर्मेंस कवरेज स्पष्ट रूप से साझा की जाती है।" },
        { question: "मैं सालाना कितनी बचत कर सकता हूँ?", answer: "बचत टैरिफ, उपयोग पैटर्न, सिस्टम आकार और नेट-मीटरिंग परिणामों पर निर्भर करती है। यथार्थवादी अनुमान के लिए कैलकुलेटर और प्रस्तावों का उपयोग करें।" },
        { question: "प्रस्ताव अनुरोध भेजने के बाद क्या होता है?", answer: "आपके विवरण की समीक्षा की जाती है और विक्रेता फॉलो-अप के लिए भेजा जाता है। अंतिम निर्णय से पहले आपको प्रस्ताव, सब्सिडी उपयुक्तता और फाइनेंसिंग विकल्पों की तुलना में सहायता मिलती है।" },
      ]
    : [
        { question: "Is Solar Compare free to use?", answer: "Yes. You can compare solutions, review guidance, and submit proposal requests without paying any platform fee." },
        { question: "How much subsidy can I receive?", answer: "Subsidy depends on system size, eligibility, and current scheme rules. Our workflow helps you estimate and track available benefits." },
        { question: "How long does installation take?", answer: "Typical residential installations are completed within a few days after approvals and material readiness, while end-to-end timelines vary by location." },
        { question: "Can I get EMI financing?", answer: "Yes. Financing and EMI options are available for many buyer profiles, subject to lender terms and project eligibility." },
        { question: "Are vendors verified?", answer: "We route requests through verified vendor workflows so buyers can compare with better trust and transparency." },
        { question: "What warranty is included?", answer: "Warranties vary by panel, inverter, and installer. Product and performance coverage details are shared clearly during proposal comparison." },
        { question: "How much can I save annually?", answer: "Savings depend on tariff, usage pattern, system size, and net metering outcomes. Use calculators and proposals for realistic annual estimates." },
        { question: "What happens after submitting a proposal request?", answer: "Your details are reviewed and routed for vendor follow-up. You receive support to compare proposals, subsidy fit, and financing options before final decision." },
      ];

  return (
    <section id="home-faq" className="mx-auto mt-16 mb-8 w-full max-w-7xl px-4 md:mb-10 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">{locale === "hi" ? "सामान्य प्रश्न" : "FAQ"}</p>
        <h2 className="mt-3 text-center font-serif text-3xl text-slate-900 md:text-4xl">{locale === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}</h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-7 text-slate-600 md:text-base">
          {locale === "hi"
            ? "सब्सिडी, इंस्टॉलेशन, फाइनेंसिंग, बचत और विक्रेता सहायता से जुड़े सामान्य प्रश्नों के स्पष्ट उत्तर।"
            : "Clear answers to common questions about subsidy, installation, financing, savings, and vendor support."}
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
