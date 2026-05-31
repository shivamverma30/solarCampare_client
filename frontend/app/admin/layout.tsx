"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import { useAuth } from "@/lib/use-auth";
import { logout } from "@/lib/auth";

interface SidebarLink {
  name: string;
  href: string;
  icon: string;
}

const sidebarLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Notifications", href: "/admin/notifications", icon: "🔔" },
  { name: "Vendors", href: "/admin/vendors", icon: "🏢" },
  { name: "Leads", href: "/admin/leads", icon: "🧭" },
  { name: "Profile", href: "/admin/profile", icon: "👤" },
  { name: "Change Password", href: "/admin/change-password", icon: "🔐" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated, admin, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdminLoginPage = pathname === "/admin";

  useEffect(() => {
    if (isAdminLoginPage || isLoading) {
      return;
    }

    const isAdminRole = role === "SUPERADMIN" || role === "ADMIN";

    if (!isAuthenticated || !isAdminRole) {
      router.replace("/admin");
    }
  }, [isAdminLoginPage, isLoading, isAuthenticated, role, router, pathname]);

  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  const isAdminRole = role === "SUPERADMIN" || role === "ADMIN";

  if (isLoading || !isAuthenticated || !isAdminRole) {
    return (
      <div className="flex h-screen items-center justify-center bg-app">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
          <p className="mt-4 text-app-fg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.08),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] text-slate-900 md:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-white/70 bg-white/92 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:transition-none`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-slate-200/80 p-6">
            <BrandMark
              href="/admin/dashboard"
              compact
              className="items-start"
              titleClassName="text-slate-900"
              taglineClassName="text-slate-500"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-6">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-200/80"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200/80 p-6">
            <div className="mb-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80">
              <p className="text-xs font-semibold text-slate-500">
                Logged in as
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {admin?.name || admin?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="sticky top-0 z-20 border-b border-white/70 bg-white/85 p-4 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm"
          >
            {sidebarOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Page Content */}
        <div className="p-5 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
