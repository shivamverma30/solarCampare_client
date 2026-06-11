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

  const platformLinks = [
    { label: t("footer.compareQuotes"), href: "/compare" },
    { label: t("footer.subsidyCalculator"), href: "/calculator" },
    { label: t("footer.suryaGharHelp"), href: "/more/how-it-works" },
    { label: t("footer.financingEmi"), href: "/emi" },
    { label: t("footer.solarInsurance"), href: "/services/solar-maintenance" },
    { label: t("footer.energyMonitor"), href: "/services/solar-maintenance" },
  ];

  const learnLinks = [
    { label: t("footer.solarPanelTypes"), href: "/services/residential-solar" },
    { label: t("footer.inverterGuide"), href: "/more/blogs" },
    { label: t("footer.dcrBrandList"), href: "/#dcr-comparison" },
    { label: t("footer.stateSubsidies"), href: "/calculator" },
    { label: t("footer.roiCalculator"), href: "/calculator" },
    { label: t("footer.blog"), href: "/more/blogs" },
  ];

  const companyLinks = [
    { label: t("footer.aboutUs"), href: "/more/about-us" },
    { label: t("footer.vendorPartners"), href: "/become-vendor" },
    { label: t("footer.careers"), href: "/more/contact-us" },
    { label: t("footer.contact"), href: "/more/contact-us" },
    { label: t("footer.privacyPolicy"), href: "/more/contact-us" },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white/90 pt-8 md:pt-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:gap-10 md:px-8">
        <div className="max-w-sm">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{t("footer.social")}</p>
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("footer.platform")}</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {platformLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-700 font-semibold transition hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("footer.learn")}</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {learnLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-700 font-semibold transition hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{t("footer.company")}</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {companyLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-700 font-semibold transition hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl border-t border-slate-200 px-4 py-5 text-xs text-slate-500 md:px-8">
        <p>{t("© 2026 Solar Compare. All Rights Reserved.", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
