"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === "/";
  const isOverlayMode = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open && isScrolled) {
      setOpen(false);
    }
  }, [isScrolled, open]);

  const headerClassName = isOverlayMode
    ? "bg-transparent text-white"
    : isHomePage
      ? "bg-slate-950/88 text-white shadow-[0_10px_30px_rgba(2,6,23,0.28)]"
      : "border-b border-slate-200/80 bg-white/96 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)]";

  const wrapperClassName = isScrolled
    ? "py-2"
    : "py-3 md:py-4";

  const logoClassName = isOverlayMode
    ? "font-serif text-lg tracking-[0.2em] text-amber-50/92 md:text-[1.55rem]"
    : isHomePage
      ? "font-serif text-lg tracking-[0.2em] text-amber-50/92 md:text-[1.45rem]"
      : "font-serif text-lg tracking-[0.2em] text-slate-900 md:text-[1.45rem]";

  const navLinkClass = (isActive: boolean) =>
    `group relative px-1 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] transition duration-300 md:text-[0.74rem] ${
      isActive
        ? isOverlayMode || isHomePage
          ? "text-amber-200"
          : "text-amber-700"
        : isOverlayMode || isHomePage
          ? "text-white/86 hover:text-white"
          : "text-slate-600 hover:text-slate-900"
    }`;

  const pillButtonClass = isOverlayMode || isHomePage
    ? "rounded-full border border-white/16 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-50/95 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/18"
    : "rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${headerClassName}`}>
      <div className={`relative w-full transition-all duration-500 ease-out ${wrapperClassName}`}>
        <div
          className={`pointer-events-none absolute inset-0 ${
            isOverlayMode
              ? "bg-linear-to-b from-black/24 via-black/8 to-transparent opacity-80"
              : "bg-transparent"
          }`}
        />

        <div className="relative mx-auto flex w-full max-w-420 items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-w-0 flex-1 items-center">
            <Link href="/" className={logoClassName}>
              SOLARCOMPARE
            </Link>
          </div>

          <nav className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link key={link.href} href={link.href} className={navLinkClass(isActive)}>
                  <span className="relative inline-flex items-center justify-center">
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-amber-200 transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              <Link href="/login" className={pillButtonClass}>
                Login
              </Link>
              <Link
                href="/calculator"
                className="rounded-full bg-linear-to-r from-amber-300 via-amber-200 to-amber-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.28)] transition duration-300 hover:-translate-y-0.5 hover:from-amber-200 hover:to-amber-50"
              >
                Get Proposal
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border backdrop-blur-xl transition lg:hidden ${
                isOverlayMode || isHomePage
                  ? "border-white/16 bg-white/8 text-white hover:bg-white/14"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {open ? "×" : "☰"}
            </button>
          </div>
        </div>

        <div
          className={`absolute inset-x-0 top-full z-50 overflow-hidden border-b px-4 py-3 backdrop-blur-2xl transition-all duration-500 ease-out lg:hidden ${
            isOverlayMode || isHomePage
              ? "border-white/10 bg-slate-950/95 shadow-[0_24px_60px_rgba(2,6,23,0.32)]"
              : "border-slate-200 bg-white/95 shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          } ${
            open ? "max-h-112 opacity-100" : "pointer-events-none max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto w-full max-w-420 px-0 sm:px-2">
            <nav className="grid gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-lg px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] transition ${
                      isOverlayMode || isHomePage
                        ? isActive
                          ? "bg-white/10 text-amber-200"
                          : "text-white/85 hover:bg-white/8 hover:text-white"
                        : isActive
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <Link href="/login" onClick={() => setOpen(false)} className={pillButtonClass}>
                Login
              </Link>
              <Link
                href="/calculator"
                onClick={() => setOpen(false)}
                className="rounded-full bg-linear-to-r from-amber-300 via-amber-200 to-amber-100 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.28)]"
              >
                Get Proposal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
