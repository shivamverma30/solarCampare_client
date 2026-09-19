"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/solarcompare.in/", icon: Instagram, external: true },
  { label: "Facebook", href: "/", icon: Facebook },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/safweenergy/", icon: Linkedin, external: true },
  { label: "YouTube", href: "https://www.youtube.com/@solarcompare", icon: Youtube, external: true },
  { label: "X", href: "/", icon: Twitter },
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
              {socialLinks.map((item) => {
                const Icon = item.icon;
                const isExternal = Boolean(item.external);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    aria-label={item.label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 text-sm leading-7 text-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Address</p>
            <address className="mt-2 not-italic text-slate-700">
              E-29 Girnar Valley, Bhopal, Madhya Pradesh 462010, India
            </address>
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

      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-slate-200 px-4 py-5 text-center text-xs text-slate-500 md:px-8">
        <p className="inline-flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          <span>© 2026 SAFWE ENERGY SOLUTIONS PRIVATE LIMITED. All Rights Reserved.</span>
          <span aria-hidden="true" className="text-slate-300">|</span>
          <span>
            CIN:&nbsp;
            <a
              href="https://www.google.com/search?q=U35105MP2026PTC086766"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
            >
              U35105MP2026PTC086766
            </a>
          </span>
        </p>
        <span aria-hidden="true" className="text-slate-300">|</span>
        <span className="inline-flex items-center gap-1.5">
          <span>Made with ❤️ by</span>
          <Link
            href="https://www.shivamverma.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 transition hover:text-slate-900"
          >
            Shivam Verma
          </Link>
        </span>
        <span aria-hidden="true" className="text-slate-300">|</span>
        <Link
          href="https://www.linkedin.com/in/shubham-kumar-0115a9224/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Shubham Kumar on LinkedIn"
          className="inline-flex items-center font-medium text-slate-600 transition hover:text-slate-900"
        >
          <span>Shubham Kumar</span>
        </Link>
      </div>
    </footer>
  );
}
