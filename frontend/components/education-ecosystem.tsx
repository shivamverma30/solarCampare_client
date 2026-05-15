"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type FAQCategory = "subsidy" | "technical" | "installation" | "maintenance";

export default function EducationEcosystem() {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FAQCategory>("subsidy");
  const [stickyActive, setStickyActive] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setStickyActive(rect.top < 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqData: Record<FAQCategory, Array<{ q: string; a: string }>> = {
    subsidy: [
      {
        q: "What is PM Surya Ghar Muft Bijli Yojana?",
        a: "It's the Government of India's scheme to provide ₹78,000 subsidy for residential rooftop solar installations (up to 3kW). This aims to reach 1 crore homes by 2027. You don't need to wait for money upfront — SAFWE handles all paperwork.",
      },
      {
        q: "Am I eligible for the subsidy?",
        a: "Yes, if you own a residential property with a suitable roof, live in a participating state, and haven't received solar subsidy before. Commercial properties have different eligibility. SAFWE's eligibility checker will confirm your status instantly.",
      },
      {
        q: "How much subsidy will I get?",
        a: "Residential: ₹30,000 for ≤2kW, ₹60,000 for ≤3kW (Non-DCR). DCR panels get ₹78,000. Many states add additional subsidies on top. Check your state on our calculator.",
      },
      {
        q: "How long does subsidy approval take?",
        a: "Usually 2-4 weeks after application. SAFWE submits all documents and tracks the status for you. We notify you at each step.",
      },
      {
        q: "What if I don't have bank account or documents?",
        a: "SAFWE works with your installer to help arrange required documents. We guide you through the process step by step. No hidden requirements.",
      },
    ],
    technical: [
      {
        q: "What's the difference between kW and kWh?",
        a: "kW = Power capacity of your system. kWh = Energy produced. A 5kW system produces ~5-7 kWh per day depending on sunlight. Think of it like water tap: kW = tap size, kWh = water flowing.",
      },
      {
        q: "How many solar panels do I need?",
        a: "Each panel is ~350-400W. A 3kW system needs 8-9 panels. A 5kW system needs 13-15 panels. Our calculator estimates based on your roof size and bill.",
      },
      {
        q: "Do panels work in clouds or rainy weather?",
        a: "Yes, they work 24/7 but generate less in clouds. On cloudy days, you generate 10-30% of normal output. On rainy days, even less. On sunny days, full power.",
      },
      {
        q: "What's the difference between On-Grid, Off-Grid, and Hybrid?",
        a: "On-Grid: No battery, uses grid as backup, cheapest. Off-Grid: Battery storage, no grid dependency, costlier, full independence. Hybrid: Both grid + battery, most flexible.",
      },
      {
        q: "Can I expand my system later?",
        a: "Yes, absolutely. Most systems are designed for future expansion. You can add more panels, inverters, or batteries later without replacing existing equipment.",
      },
    ],
    installation: [
      {
        q: "How long does installation take?",
        a: "Typical residential: 2-5 days. We assess your roof → order panels → install → test → connect. After subsidy approval, the process is smooth.",
      },
      {
        q: "Is my roof suitable for solar?",
        a: "Most roofs are. We look for: 300+ sq ft space, facing South/East, minimal shade, structural capacity. Our rooftop visualizer shows if yours qualifies.",
      },
      {
        q: "Will installation damage my roof?",
        a: "No. We use mounting systems that don't penetrate the roof. Waterproofing is certified. If damage occurs during installation, it's covered by our partner's insurance.",
      },
      {
        q: "Do I need to shut down power during installation?",
        a: "Yes, for 2-4 hours during connections. We coordinate with your electrician. After that, your system is live and generating power.",
      },
      {
        q: "What happens if there's a power outage after installation?",
        a: "On-Grid: You experience outage like before (no backup). Hybrid/Off-Grid: Automatic switch to battery, you have uninterrupted power.",
      },
    ],
    maintenance: [
      {
        q: "How much maintenance do panels need?",
        a: "Minimal. Clean them 2-3 times yearly (rain does 40% of work). Check connections yearly. Most systems run 25+ years with almost no maintenance.",
      },
      {
        q: "What if panels stop generating power?",
        a: "Rare. Possible causes: shade obstruction (easy fix), loose connection (quick repair), inverter fault (replacement). We monitor and alert you instantly.",
      },
      {
        q: "What's the lifespan of solar panels?",
        a: "Panels last 25-30+ years. They degrade ~0.5% annually, so at 25 years you're still at 87-90% efficiency. Most warranties cover this.",
      },
      {
        q: "How do I clean my panels?",
        a: "Use soft water + soft brush yearly. Avoid high-pressure jets. Better yet, hire professionals (₹1,000-2,000 annually) for safe cleaning.",
      },
      {
        q: "Do I need insurance for my system?",
        a: "Recommended. Solar insurance covers damage from storms, theft, accident for ₹500-1,000 annually. SAFWE partners can arrange this.",
      },
    ],
  };

  const categories: Array<{ id: FAQCategory; label: string; icon: string }> = [
    { id: "subsidy", label: "Subsidy & Eligibility", icon: "💰" },
    { id: "technical", label: "Technical Basics", icon: "⚡" },
    { id: "installation", label: "Installation", icon: "🏗️" },
    { id: "maintenance", label: "Maintenance", icon: "🔧" },
  ];

  return (
    <section ref={sectionRef} id="education" className="mx-auto mt-20 w-full px-4 md:px-8">
      <div className="mb-12 text-center max-w-7xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          Learn Solar
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          Solar Education Hub
        </h2>
        <p className="mt-4 mx-auto max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
          Everything you need to know about solar, subsidies, and installation. Expert-backed answers to every question.
        </p>
      </div>

      {/* Sticky Jump Navigation */}
      <div
        className={`transition-all duration-300 ${
          stickyActive
            ? "sticky top-20 z-40 mb-8 -mx-4 -mt-8 bg-white px-4 py-3 shadow-md md:top-20"
            : "mb-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{cat.icon}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {faqData[activeCategory].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === `${activeCategory}-${i}` ? null : `${activeCategory}-${i}`)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-slate-50 transition"
              >
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-amber-500 transition ${
                    openFAQ === `${activeCategory}-${i}` ? "rotate-180" : ""
                  }`}
                />
                <h3 className="font-semibold text-slate-900 flex-1">{item.q}</h3>
              </button>

              {openFAQ === `${activeCategory}-${i}` && (
                <div className="border-t border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm leading-6 text-slate-700">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Educational Info Boxes */}
      <div className="mx-auto max-w-7xl mb-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">💡 Solar Myths Busted</h3>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">❌</span>
                <div>
                  <strong>Myth:</strong> Panels don&apos;t work in India&apos;s climate
                  <div className="text-xs text-slate-600 mt-1">Fact: India gets 300+ sunny days/year. Better than Germany (world leader)!</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">❌</span>
                <div>
                  <strong>Myth:</strong> I need to replace panels every 10 years
                  <div className="text-xs text-slate-600 mt-1">Fact: Panels last 25-30 years. Most lose only 0.5%/year efficiency.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">❌</span>
                <div>
                  <strong>Myth:</strong> Solar is too expensive
                  <div className="text-xs text-slate-600 mt-1">Fact: With ₹78,000 subsidy, net cost is just ₹27,000. Payback in 3 years.</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">📊 Solar 101: Key Terms</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">⚡</span>
                <div>
                  <strong className="text-slate-900">kW (Kilowatt)</strong>
                  <div className="text-xs text-slate-600">Power capacity. Your 3kW system = 3,000 watts of power.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">⚡</span>
                <div>
                  <strong className="text-slate-900">kWh (Kilowatt-hour)</strong>
                  <div className="text-xs text-slate-600">Energy consumed/produced. Your bill is in kWh (units).</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">⚡</span>
                <div>
                  <strong className="text-slate-900">ROI (Return on Investment)</strong>
                  <div className="text-xs text-slate-600">How long to recover your investment through savings.</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA to Calculator */}
      <div className="mx-auto max-w-7xl rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-8 py-12 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Ready to Go Solar?</h3>
        <p className="text-amber-50 mb-6 max-w-2xl mx-auto">
          Use our calculator to see exact savings, subsidy eligibility, and payback period for your situation.
        </p>
        <a
          href="/calculator"
          className="inline-block rounded-lg bg-white px-8 py-3 font-bold text-amber-600 transition hover:bg-amber-50"
        >
          Start Your Calculation →
        </a>
      </div>
    </section>
  );
}
