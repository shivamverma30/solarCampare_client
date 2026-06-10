"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  FileText,
  Globe,
  HandCoins,
  Info,
  Menu,
  PanelsTopLeft,
  Phone,
  Sparkles,
  SunMedium,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { servicePages } from "@/data/service-pages";
import { infoPages } from "@/data/info-pages";

type NavLinkItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type NavGroup = {
  label: string;
  href?: string;
  items: NavLinkItem[];
};

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
        className={`inline-flex h-11 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
          overlay
            ? "border-white/18 bg-white/10 text-white hover:bg-white/16 focus-visible:ring-white/30"
            : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50"
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
      ? "border-white/18 bg-white/14 text-white font-semibold ring-1 ring-white/20"
      : "border-white/10 text-white/95 hover:border-white/18 hover:bg-white/10 hover:text-white"
    : isActive
      ? "border-slate-900/10 bg-slate-50 text-slate-900 font-semibold shadow-sm"
      : "border-transparent text-slate-900 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900";

  return (
    <div className="relative group">
      <button
        type="button"
        className={`inline-flex h-11 items-center gap-1 rounded-full border px-4 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${triggerStyles}`}
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
        className={`absolute left-0 top-[calc(100%+0.75rem)] w-104 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/98 shadow-[0_24px_50px_rgba(15,23,42,0.12)] transition-all duration-200 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        } lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:scale-100 lg:group-hover:opacity-100`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-2">
          {group.items.map((item) => {
            const active = pathname === item.href || (item.href.startsWith("/#") && pathname === "/");
            const itemKey = `${group.label}-${item.label}-${item.href}`;

            return (
              <Link
                key={itemKey}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm transition ${
                  active
                    ? "bg-slate-50 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon ? (
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                      <item.icon className="h-4 w-4" />
                    </span>
                  ) : null}
                  <span className="font-semibold">{item.label}</span>
                </span>
                <ChevronDown className="h-4 w-4 -rotate-90 text-slate-600" />
              </Link>
            );
          })}
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

  const closeMenus = () => {
    setMobileOpen(false);
    setActiveGroup(null);
  };

  const serviceGroupItems = useMemo(
    () =>
      [
        { slug: "residential-solar", icon: SunMedium },
        { slug: "industrial-solar", icon: Building2 },
        { slug: "solar-loan", icon: HandCoins },
        { slug: "solar-cleaning", icon: Sparkles },
        { slug: "ground-mounted-solar", icon: PanelsTopLeft },
        { slug: "solar-maintenance", icon: Wrench },
      ]
        .map(({ slug, icon }) => {
          const service = servicePages.find((item) => item.slug === slug);
          if (!service) return null;
          return {
            label: service.title,
            href: `/services/${service.slug}`,
            icon,
          } satisfies NavLinkItem;
        })
        .filter((service): service is NavLinkItem & { icon: LucideIcon } => Boolean(service)),
    []
  );

  const moreGroupItems = useMemo(
    () => {
      const pages = [
        "about-us",
        "contact-us",
        "blogs",
        "how-it-works",
      ]
        .map((slug) => infoPages.find((page) => page.slug === slug))
        .filter((page): page is (typeof infoPages)[number] => Boolean(page))
        .map((page) => ({
          label: page.title,
          href: `/more/${page.slug}`,
          icon: ({
            "about-us": Info,
            "contact-us": Phone,
            blogs: FileText,
            "how-it-works": Workflow,
          } as Record<string, LucideIcon>)[page.slug],
        }));

      return [
        ...pages,
        {
          label: "DCR vs Non-DCR",
          href: "/compare",
          icon: BadgeCheck,
        },
      ];
    },
    []
  );

  const primaryLinks = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.calculator"), href: "/calculator" },
    { label: t("nav.emi"), href: "/emi" },
  ];

  const menuGroups: NavGroup[] = [
    {
      label: t("nav.services"),
      href: "/services",
      items: serviceGroupItems,
    },
    {
      label: t("nav.more"),
      href: "/more",
      items: moreGroupItems,
    },
  ];

  const isHome = pathname === "/";
  const overlay = false;

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-90 border-b transition-[background-color,box-shadow,transform] duration-300 ${
        overlay
          ? "border-white/18 bg-slate-950/12 text-white shadow-[0_16px_40px_rgba(2,6,23,0.14)] backdrop-blur-2xl"
          : "border-slate-200 bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm"
      }`}
    >
      <div className={`mx-auto flex min-w-0 w-full max-w-screen-2xl items-center gap-4 px-1 py-3 sm:px-3 lg:px-4 ${overlay ? "lg:py-4" : "lg:py-3.5"}`}>
        <div className="flex min-w-0 flex-1 items-center gap-8">
          <BrandMark
            href="/"
            compact
            stacked
            showTagline={false}
            className="mr-10 lg:mr-12"
            titleClassName={overlay ? "text-white drop-shadow-sm" : "text-slate-950"}
            imageClassName="shrink-0"
          />

          <div className="hidden min-w-0 items-center gap-6 xl:flex ml-auto">
            {(isHome ? primaryLinks.filter((link) => link.href !== "/compare") : primaryLinks).map((link) => {
              const isActive = pathname === link.href;
              const navKey = `${link.href}-${link.label}`;

              return (
                <Link
                  key={navKey}
                  href={link.href}
                  className={`inline-flex h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                    overlay
                      ? isActive
                        ? "bg-white/16 text-white font-semibold ring-1 ring-white/20"
                        : "text-white/92 hover:bg-white/10 hover:text-white"
                      : isActive
                        ? "bg-slate-100 text-slate-900 font-semibold ring-1 ring-slate-200"
                        : "text-slate-900 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.label}
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
            className={`inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              overlay
                ? "border-white/18 bg-white/10 text-white hover:bg-white/16 focus-visible:ring-white/30"
                : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {t("buttons.login")}
          </Link>

          <Link
            href="/calculator"
            className="inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.14)] transition hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
          >
            {t("buttons.getProposal")}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition lg:hidden focus-visible:ring-2 focus-visible:ring-emerald-400 ${
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
        className={`lg:hidden ${mobileOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "pointer-events-none max-h-0 opacity-0"} overflow-hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl transition-all duration-300`}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-4 sm:px-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="space-y-3">
            {primaryLinks.map((link) => {
              const navKey = `${link.href}-${link.label}`;

              return (
                <Link
                  key={navKey}
                  href={link.href}
                  onClick={closeMenus}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>{link.label}</span>
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
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"
                    onClick={() => setActiveGroup((current) => (current === group.label ? null : group.label))}
                    aria-expanded={isOpen}
                  >
                    {group.label}
                    <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <div className={`${isOpen ? "block" : "hidden"} border-t border-slate-200 px-2 py-2`}>
                    {group.items.map((item) => {
                      const itemKey = `${group.label}-${item.label}-${item.href}`;

                      return (
                        <Link
                          key={itemKey}
                          href={item.href}
                          onClick={closeMenus}
                          className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-slate-700 transition hover:bg-white hover:text-slate-950"
                        >
                          <span className="flex items-center gap-3">
                            {item.icon ? (
                              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                                <item.icon className="h-4 w-4" />
                              </span>
                            ) : null}
                            <span className="font-semibold">{item.label}</span>
                          </span>
                          <ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
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


