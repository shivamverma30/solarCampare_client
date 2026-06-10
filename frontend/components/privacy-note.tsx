"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

export default function PrivacyNote() {
  const { t } = useLocale();

  return (
    <div className="mt-4 flex items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-3 text-sm text-slate-600">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
      <p>{t("privacy.note")}</p>
    </div>
  );
}
