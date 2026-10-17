"use client";

import { Suspense } from "react";
import DCRComparison from "@/components/dcr-comparison";

function ComparePageContent() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <DCRComparison />
      </div>
    </section>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <ComparePageContent />
    </Suspense>
  );
}
