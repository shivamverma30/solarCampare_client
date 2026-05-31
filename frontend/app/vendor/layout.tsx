"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from "@/lib/use-auth";

const links = [
  { href: "/vendor/dashboard", label: "Dashboard" },
  { href: "/vendor/products", label: "Products" },
  { href: "/vendor/leads", label: "Leads" },
  { href: "/vendor/notifications", label: "Notifications" },
  { href: "/vendor/profile", label: "Profile" },
  { href: "/vendor/change-password", label: "Change Password" },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, role, profile } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || role !== "VENDOR") {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated || role !== "VENDOR") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-600">Loading vendor dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 md:flex-row">
      <aside className={`fixed inset-y-0 left-0 z-30 w-72 transform border-r border-slate-200 bg-white transition md:static md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Vendor Panel</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.companyName || profile?.ownerName || profile?.email}</p>
            {profile?.status ? (
              <p className="mt-1 text-xs font-medium text-slate-500">Status: {profile.status}</p>
            ) : null}
          </div>

          <nav className="mt-8 flex-1 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-2 text-sm font-medium ${pathname === link.href ? "bg-amber-100 text-amber-900" : "text-slate-700 hover:bg-slate-100"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white p-4 md:hidden">
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </main>

      {open ? <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}
