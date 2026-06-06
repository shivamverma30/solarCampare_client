"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, X, ArrowRight } from "lucide-react";

export default function StickyLeadCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past 30% of page
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setIsVisible(scrolled > 15 && !isDismissed);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5 md:p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-6">
          <h3 className="text-lg font-bold text-slate-900">
            ☀️ Ready to Go Solar?
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Get personalized quotes in 2 minutes
          </p>
        </div>

        {/* Quick Selection */}
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => (window.location.href = "/calculator")}
            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <span>📊</span> Calculator
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition"
          >
            <span>📋</span> Form
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2">
          <Link
            href="/calculator"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-center font-bold text-white transition hover:from-emerald-600 hover:to-emerald-700"
          >
            Get Estimate <ArrowRight className="h-4 w-4" />
          </Link>

          <div className="flex gap-2">
            <a
              href="tel:+919876543210"
              className="flex-1 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition flex items-center justify-center gap-1"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
            <a
              href="https://wa.me/919876543210"
              className="flex-1 rounded-lg bg-green-100 hover:bg-green-200 px-3 py-2 text-sm font-semibold text-green-700 transition flex items-center justify-center gap-1"
            >
              <span>💬</span> Chat
            </a>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="mt-4 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
          <span className="font-semibold text-emerald-600">✓ 5000+ Happy Customers</span>
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="text-emerald-500">★★★★★</span>
            <span className="text-slate-500">4.8/5 Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
