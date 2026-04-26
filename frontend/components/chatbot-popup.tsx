"use client";

import { useState } from "react";
import { chatbotQuestions } from "@/data/site";

export default function ChatbotPopup() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      <div
        aria-hidden={!open}
        className={`w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-emerald-300/30 bg-white/95 p-4 shadow-2xl backdrop-blur transition-all duration-300 ease-out dark:border-emerald-700/40 dark:bg-slate-900/90 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Solar AI Assistant</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">Try asking:</p>
        <div className="mt-3 space-y-2">
          {chatbotQuestions.map((question) => (
            <button
              key={question}
              type="button"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle AI chat"
        className="inline-flex h-14 items-center gap-2 rounded-full border border-emerald-200/45 bg-[#25D366]/28 px-4 text-sm font-semibold tracking-wide text-white backdrop-blur-xl shadow-[0_14px_34px_rgba(16,185,129,0.38)] ring-1 ring-white/25 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#25D366]/36 hover:shadow-[0_18px_42px_rgba(16,185,129,0.48)]"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
          <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        </svg>
        <span>AI Chat</span>
      </button>
    </div>
  );
}
