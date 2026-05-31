"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import { navLinks } from "@/data/site";
import { ChevronDown, Globe, Menu, PanelTop, ShieldCheck, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

type NavLinkItem = {
  label: string;
  href: string;
  description: string;
};

type NavGroup = {
  label: string;
  href?: string;
  items: NavLinkItem[];
};

const menuGroups: NavGroup[] = [
  {
    label: "Solutions",
    href: "/calculator",
    items: [
      { label: "Solar Calculator", href: "/calculator", description: "Estimate roof size, savings, subsidy, and payback." },
      { label: "EMI Calculator", href: "/emi", description: "Model loan amount, tenure, and monthly repayment." },
      { label: "Panel Comparison", href: "/compare", description: "Evaluate technical and commercial tradeoffs side by side." },
    ],
  },
  {
    label: "Company",
    href: "/#our-products",
    items: [
      { label: "Our Products", href: "/#our-products", description: "Browse premium solar products and brand highlights." },
      { label: "Verified Vendors", href: "/", description: "Explore the vendor network and service coverage." },
      { label: "How It Works", href: "/", description: "See the guided solar buying flow from inquiry to install." },
    ],
  },
  {
    label: "Resources",
    href: "/compare",
    items: [
      { label: "Government Schemes", href: "/", description: "Understand subsidy context and eligibility basics." },
      { label: "Education Center", href: "/", description: "Learn the fundamentals behind the solar journey." },
      { label: "Contact Support", href: "/login", description: "Reach the team or continue to account access." },
    ],
  },
];

function getLabel(item: { labelKey?: string; label?: string }, t: (key: string) => string) {
  return item.labelKey ? t(item.labelKey) : item.label || "";
}

function LanguageSwitcher({
  locale,
  setLocale,
  overlay,
}: {
  locale: string;
  setLocale: (l: string) => void;
  overlay: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = () => setOpen(false);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("click", handleOutsideClick, { once: true });
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
          overlay
            ? "border-white/18 bg-white/10 text-white hover:bg-white/16 focus-visible:ring-white/30"
            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
        }`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+0.6rem)] w-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_50px_rgba(15,23,42,0.14)] transition duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        role="menu"
        aria-label="Language options"
      >
        <button
          type="button"
          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${locale === "en" ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
          onClick={() => {
            setLocale("en");
            setOpen(false);
          }}
        >
          English
          {locale === "en" ? <span className="text-xs font-semibold text-emerald-700">Active</span> : null}
        </button>
        <button
          type="button"
          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${locale === "hi" ? "bg-slate-50 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
          onClick={() => {
            setLocale("hi");
            setOpen(false);
          }}
        >
          हिन्दी
          {locale === "hi" ? <span className="text-xs font-semibold text-emerald-700">Active</span> : null}
        </button>
      </div>
    </div>
  );
}

function DropdownGroup({
  group,
  overlay,
  isActive,
  isOpen,
  onToggle,
  pathname,
  closeMenu,
}: {
  group: NavGroup;
  overlay: boolean;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  closeMenu: () => void;
}) {
  const triggerStyles = overlay
    ? isActive
      ? "bg-white/16 text-white font-semibold ring-1 ring-white/20"
      : "border-transparent text-white/95 hover:bg-white/10 hover:text-white/95"
    : isActive
      ? "border-slate-900/10 bg-slate-50 text-slate-900 font-semibold shadow-sm"
      : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900";

  return (
    <div className="relative group">
      <button
        type="button"
        className={`inline-flex h-11 items-center gap-1 rounded-full border px-4 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${triggerStyles}`}
        aria-expanded={isOpen}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
      >
        {group.label}
        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute left-0 top-[calc(100%+0.75rem)] w-104 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_28px_60px_rgba(15,23,42,0.12)] transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        } lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:scale-100 lg:group-hover:opacity-100`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-2 p-3">
          {group.items.map((item) => {
            const active = pathname === item.href || (item.href.startsWith("/#") && pathname === "/");
            const itemKey = `${group.label}-${item.label}-${item.href}`;

            return (
              <Link
                key={itemKey}
                href={item.href}
                onClick={closeMenu}
                className={`rounded-2xl border px-4 py-3 transition ${
                  active
                    ? "border-slate-200 bg-slate-50"
                    : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700">
                    {group.label === "Company" ? <ShieldCheck className="h-4 w-4" /> : <PanelTop className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          {group.href ? (
            <Link href={group.href} onClick={closeMenu} className="font-semibold text-slate-700 transition hover:text-slate-900">
              Explore {group.label.toLowerCase()}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === "/";
  const overlay = isHome && !isScrolled;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setActiveGroup(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const primaryLinks = useMemo(() => navLinks.filter((link) => link.href !== "/#our-products"), []);

  const closeMenus = () => {
    setMobileOpen(false);
    setActiveGroup(null);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        overlay
          ? "border-transparent bg-[rgba(0,0,0,0.28)] backdrop-blur-md text-white"
          : "border-slate-200 bg-white text-slate-900 shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className={`mx-auto flex w-full max-w-screen-2xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8 ${overlay ? "lg:py-4" : "lg:py-3.5"}`}>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <BrandMark
            href="/"
            compact
            titleClassName={overlay ? "text-white" : "text-slate-900"}
            taglineClassName={overlay ? "text-white/70" : "text-slate-500"}
          />

          <div className="hidden xl:flex min-w-0 items-center gap-2 pl-4">
            {primaryLinks.map((link) => {
              const label = getLabel(link, t);
              const isActive = pathname === link.href;
              const navKey = `${link.href}-${label}`;

              return (
                <Link
                  key={navKey}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                    overlay
                      ? isActive
                        ? "bg-white/16 text-white font-semibold ring-1 ring-white/20"
                        : "text-white/95 hover:bg-white/10 hover:text-white/95"
                      : isActive
                        ? "bg-slate-100 text-slate-900 font-semibold ring-1 ring-slate-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {menuGroups.map((group) => (
              <DropdownGroup
                key={group.label}
                group={group}
                overlay={overlay}
                isActive={group.items.some((item) => pathname === item.href || (item.href.startsWith("/#") && pathname === "/"))}
                isOpen={activeGroup === group.label}
                onToggle={() => setActiveGroup((current) => (current === group.label ? null : group.label))}
                pathname={pathname}
                closeMenu={closeMenus}
              />
            ))}
          </div>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} setLocale={setLocale} overlay={overlay} />

          <Link
            href="/login"
            className={`inline-flex h-11 items-center rounded-full border px-5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              overlay
                ? "border-white/18 bg-white/10 text-white hover:bg-white/16 focus-visible:ring-white/30"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {t("buttons.login")}
          </Link>

          <Link
            href="/calculator"
            className="inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            {t("buttons.getProposal")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden focus-visible:ring-2 focus-visible:ring-amber-400 ${
            overlay
              ? "border-white/18 bg-white/10 text-white"
              : "border-slate-200 bg-white text-slate-700 shadow-sm"
          }`}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`lg:hidden ${mobileOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "pointer-events-none max-h-0 opacity-0"} overflow-hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl transition-all duration-300`}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-4 sm:px-6">
          <nav className="space-y-3">
            {primaryLinks.map((link) => {
              const label = getLabel(link, t);
              const navKey = `${link.href}-${label}`;

              return (
                <Link
                  key={navKey}
                  href={link.href}
                  onClick={closeMenus}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>{label}</span>
                  <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
                </Link>
              );
            })}

            {menuGroups.map((group) => {
              const isOpen = activeGroup === group.label;

              return (
                <div key={group.label} className="rounded-2xl border border-slate-200 bg-slate-50/80">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800"
                    onClick={() => setActiveGroup((current) => (current === group.label ? null : group.label))}
                    aria-expanded={isOpen}
                  >
                    {group.label}
                    <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`${isOpen ? "block" : "hidden"} space-y-2 border-t border-slate-200 px-3 py-3`}>
                    {group.items.map((item) => {
                      const itemKey = `${group.label}-${item.label}-${item.href}`;

                      return (
                        <Link
                          key={itemKey}
                          href={item.href}
                          onClick={closeMenus}
                          className="block rounded-xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm transition hover:text-slate-900"
                        >
                          <span className="block font-medium text-slate-900">{item.label}</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1">
              <LanguageSwitcher locale={locale} setLocale={setLocale} overlay={false} />
            </div>

            <Link
              href="/login"
              onClick={closeMenus}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm"
            >
              {t("buttons.login")}
            </Link>
          </div>

          <Link
            href="/calculator"
            onClick={closeMenus}
            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]"
          >
            {t("buttons.getProposal")}
          </Link>
        </div>
      </div>
    </header>
  );
}


