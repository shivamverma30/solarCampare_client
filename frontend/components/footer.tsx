"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";

const socialPlaceholders = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "LinkedIn", icon: Linkedin },
  { label: "YouTube", icon: Youtube },
  { label: "X", icon: Twitter },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-slate-200 bg-white/85 pt-6 md:pt-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-[1.35fr_1fr_1fr] md:px-8 md:gap-10">
        <div className="max-w-md">
          <BrandMark
            href="/"
            compact
            className="items-start"
            titleClassName="text-slate-900"
            taglineClassName="text-slate-500"
          />
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t("footer.description")}
          </p>

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Social</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {socialPlaceholders.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    href="/"
                    aria-label={`${item.label} placeholder link`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("footer.quickLinks")}</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
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

        <div className="md:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("footer.contact")}</p>
          <div className="mt-4 space-y-2.5 text-sm text-slate-700">
            <p>{t("footer.contactEmail")}</p>
            <p>{t("footer.contactPhone")}</p>
            <p>{t("footer.hours")}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-7xl border-t border-slate-200 px-4 py-4 text-xs text-slate-500 md:px-8">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
