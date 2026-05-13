"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import { navLinks } from "@/data/site";
import { Menu, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";

// Minimal, single-definition navbar to ensure scrolled text is always visible.
function LanguageSwitcher({ locale, setLocale, isDark }: { locale: string; setLocale: (l: string) => void; isDark: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close, { once: true });
    return () => window.removeEventListener("click", close);
  }, [open]);

  const cls = isDark
    ? "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/18 bg-white/8 text-white"
    : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-black";

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button className={cls} onClick={() => setOpen((s) => !s)} aria-label="Change language">🌐</button>
      <div className={`absolute right-0 top-[calc(100%+0.4rem)] w-36 rounded-xl border bg-slate-900/90 text-white shadow-lg transition-all ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}`}>
        <button className={`block w-full px-3 py-2 text-left text-xs ${locale === "en" ? "bg-white/12 text-amber-200" : "text-white/80"}`} onClick={() => { setLocale("en"); setOpen(false); }}>English</button>
        <button className={`block w-full px-3 py-2 text-left text-xs ${locale === "hi" ? "bg-white/12 text-amber-200" : "text-white/80"}`} onClick={() => { setLocale("hi"); setOpen(false); }}>हिन्दी</button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = pathname === "/";
  const overlay = isHome && !isScrolled;
  const scrolledTextClass = "text-black";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide overlay when not in overlay mode to avoid washing out text
  const overlayClasses = overlay ? "pointer-events-none absolute inset-0 bg-linear-to-b from-black/24 via-black/8 to-transparent opacity-80" : "hidden";

  const headerBase = overlay
    ? "bg-transparent text-white"
    : "bg-white text-black shadow-[0_14px_34px_rgba(15,23,42,0.12)] border-b border-slate-200 backdrop-blur-xl";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${headerBase}`}>
      <div className={`relative mx-auto flex max-w-420 items-center gap-4 px-4 py-3`}> 
        <div className="absolute inset-0 z-0">
          <div className={overlayClasses} />
        </div>

        <div className="relative z-10 flex w-full items-center">
          <div className="flex-1">
            <BrandMark href="/" compact titleClassName={overlay ? "text-amber-50" : scrolledTextClass} taglineClassName={overlay ? "text-amber-100/80" : "text-black/70"} />
          </div>

          <nav className="hidden lg:flex flex-1 justify-center gap-6">
            {navLinks.map((l) => {
              const active = pathname === l.href;
              const base = overlay ? (active ? "text-amber-200" : "text-white/90") : "text-black";
              const labelText = (l as any).labelKey ? t((l as any).labelKey) : (l as any).label;
              return (
                <Link key={l.href} href={l.href} className={`group text-sm uppercase tracking-wider ${base} px-1 py-2`}>
                  <span className="relative inline-block">
                    {labelText}
                    <span className={`absolute left-0 -bottom-1 h-px w-full bg-amber-200 transform transition-transform ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher locale={locale} setLocale={setLocale} isDark={overlay} />
              <Link href="/login" className={overlay ? "rounded-full border border-white/16 bg-white/12 px-4 py-2 text-xs text-amber-50" : "rounded-full border border-slate-300 bg-white px-4 py-2 text-xs text-black shadow-sm"}>{t("buttons.login")}</Link>
              <Link href="/calculator" className="hidden md:inline-block rounded-full bg-amber-300 px-4 py-2 text-xs font-semibold text-black">{t("buttons.getProposal")}</Link>
            </div>

            <button onClick={() => setOpen((s) => !s)} className={overlay ? "inline-flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden" : "inline-flex h-10 w-10 items-center justify-center rounded-lg text-black lg:hidden"} aria-label="Toggle menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`absolute left-0 right-0 top-full z-40 lg:hidden transition-all duration-300 ${open ? "block" : "hidden"}`}>
          <div className={`mx-auto max-w-420 rounded-b-xl bg-white shadow-md border-t border-slate-200`}> 
            <nav className="grid gap-1 p-3">
              {navLinks.map((l) => {
                  const labelText = (l as any).labelKey ? t((l as any).labelKey) : (l as any).label;
                  return (
                    <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-md px-4 py-3 text-sm text-black">{labelText}</Link>
                  );
                })}
              <div className="mt-2 flex gap-2 px-3 pb-3">
                <Link href="/login" className="flex-1 rounded-full border px-4 py-2 text-sm text-black">{t("buttons.login")}</Link>
                <Link href="/calculator" className="flex-1 rounded-full bg-amber-300 px-4 py-2 text-sm text-black">{t("buttons.getProposal")}</Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}


