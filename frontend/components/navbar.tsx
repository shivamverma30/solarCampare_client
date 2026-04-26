"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/data/site";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const authButtonClass =
    "rounded-full border border-white/45 bg-white/12 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/24";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/22 bg-black/38 px-4 py-3 shadow-2xl shadow-black/25 backdrop-blur-2xl dark:border-white/18 dark:bg-black/62 md:px-6">
        <Link href="/" className="font-serif text-xl tracking-wide text-white md:text-2xl">
          SOLARCOMPARE
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive ? "text-white" : "text-white/86 hover:text-amber-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className={authButtonClass}
          >
            Login
          </Link>
          <Link
            href="/calculator"
            className="rounded-full border border-white/20 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 dark:border-amber-200/70 dark:bg-amber-300 dark:hover:bg-amber-200"
          >
            Get Proposal
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="rounded-md border border-white/40 p-2 text-white md:hidden"
        >
          {open ? "X" : "☰"}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/30 bg-black/78 p-4 backdrop-blur md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-2 py-1 text-sm ${
                    isActive ? "bg-white/24 text-white" : "text-white/90 hover:bg-white/12"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={authButtonClass}
            >
              Login
            </Link>
            <Link
              href="/calculator"
              onClick={() => setOpen(false)}
              className="rounded-full border border-white/20 bg-white px-4 py-2 text-sm font-semibold text-black dark:border-amber-200/70 dark:bg-amber-300"
            >
              Get Proposal
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
