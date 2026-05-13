"use client";

import Link from "next/link";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";

export default function Footer() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-black/10 bg-white/70 py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-8">
        <div>
          <BrandMark
            href="/"
            compact
            className="items-start"
            titleClassName="text-slate-900"
            taglineClassName="text-slate-500"
          />
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-700">{t("footer.quickLinks")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/" className="text-slate-700 transition hover:text-black">
              {t("nav.home")}
            </Link>
            <Link href="/calculator" className="text-slate-700 transition hover:text-black">
              {t("nav.calculator")}
            </Link>
            <Link href="/compare" className="text-slate-700 transition hover:text-black">
              {t("nav.compare")}
            </Link>
            <Link href="/emi" className="text-slate-700 transition hover:text-black">
              {t("nav.emi")}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-700">{t("footer.contact")}</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>{t("footer.contactEmail")}</p>
            <p>{t("footer.contactPhone")}</p>
            <p>{t("footer.hours")}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl px-4 text-xs text-slate-500 md:px-8">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
