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
    { label: "Compare Quotes", href: "/compare" },
    { label: "Subsidy Calculator", href: "/calculator" },
    { label: "PM Surya Ghar Help", href: "/more/how-it-works" },
    { label: "Financing & EMI", href: "/emi" },
    { label: "Solar Insurance", href: "/services/solar-maintenance" },
    { label: "Energy Monitor", href: "/services/solar-maintenance" },
  ];

  const learnLinks = [
    { label: "Solar Panel Types", href: "/services/residential-solar" },
    { label: "Inverter Guide", href: "/more/blogs" },
    { label: "DCR Brand List", href: "/#dcr-comparison" },
    { label: "State Subsidies", href: "/calculator" },
    { label: "ROI Calculator", href: "/calculator" },
    { label: "Blog", href: "/more/blogs" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/more/about-us" },
    { label: "Vendor Partners", href: "/become-vendor" },
    { label: "Careers", href: "/more/contact-us" },
    { label: "Contact", href: "/more/contact-us" },
    { label: "Privacy Policy", href: "/more/contact-us" },
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
            Compare verified solar vendors, subsidy opportunities, and financing options through one trusted, India-focused platform.
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Platform</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {platformLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-700 transition hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Learn</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {learnLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-700 transition hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Company</p>
          <div className="mt-4 flex flex-col gap-2.5 text-sm">
            {companyLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-slate-700 transition hover:text-black">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl border-t border-slate-200 px-4 py-5 text-xs text-slate-500 md:px-8">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
