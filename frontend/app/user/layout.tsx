"use client";

import Link from "next/link";
import BrandMark from "@/components/brand-mark";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from "@/lib/use-auth";

const links = [
  { href: "/user/dashboard", label: "Dashboard" },
  { href: "/user/profile", label: "Profile" },
  { href: "/user/notifications", label: "Notifications" },
  { href: "/user/change-password", label: "Change Password" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, role, profile } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || role !== "USER") {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated || role !== "USER") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-600">Loading user dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.02),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900 md:flex-row">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200/80 p-6">
            <BrandMark href="/user/dashboard" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
          </div>

          <nav className="flex-1 space-y-2 p-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-200/80" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">•</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200/80 p-6">
            <div className="mb-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80">
              <p className="text-xs font-semibold text-slate-500">Logged in as</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{profile?.fullName || profile?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 border-b border-white/70 bg-white/85 p-4 backdrop-blur-xl md:hidden">
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </main>

      {open ? <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}
