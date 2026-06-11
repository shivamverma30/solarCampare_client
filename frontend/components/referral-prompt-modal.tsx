"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { REFERRAL_PROMPT_EVENT, REFERRAL_REWARD_SLABS } from "@/lib/referral";

export default function ReferralPromptModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handlePrompt = () => setOpen(true);
    window.addEventListener(REFERRAL_PROMPT_EVENT, handlePrompt);
    return () => window.removeEventListener(REFERRAL_PROMPT_EVENT, handlePrompt);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-120 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-[28px] border border-white/20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_40%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.96))] p-1 shadow-[0_30px_80px_rgba(15,23,42,0.45)]">
        <div className="rounded-[26px] bg-white/96 p-5 text-slate-900 shadow-inner sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-cyan-400 text-white shadow-lg shadow-emerald-500/25">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Referral Rewards</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">Earn rewards while going solar</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              aria-label="Close referral popup"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600">Invite friends and earn Amazon vouchers while the quote flow continues uninterrupted.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {REFERRAL_REWARD_SLABS.map((slab) => (
              <div key={slab.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{slab.label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{slab.reward}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/referral-rewards"
              onClick={() => setOpen(false)}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View Referral Program
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}