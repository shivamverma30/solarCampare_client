"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

interface ProductStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: Array<{ id: string; title: string; brand: string; wattage: number; createdAt: string }>;
}

interface SuperAdminStats {
  totalUsers: number;
  totalVendors: number;
  pendingVendors: number;
  approvedVendors: number;
  rejectedVendors: number;
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  assignedLeads: number;
  recentUsers: Array<{ id: string; fullName: string; email: string; createdAt: string }>;
  recentVendors: Array<{ id: string; companyName: string; email: string; status: string; createdAt: string }>;
  recentLeads: Array<{ id: string; userName: string; userEmail: string; status: string; vendorId: string; createdAt: string }>;
  recentInquiries: Array<{ id: string; name: string; email: string; subject?: string; createdAt: string }>;
  calculatorUsage: number;
  quoteRequests: number;
  vendorServiceAreas: number;
  revenueAnalytics: { currentMonth: number; projected: number; placeholder: boolean };
  leadConversion: { closedWon: number; closedLost: number };
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
}

interface StatCard {
  title: string;
  value: string;
  description: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats | null>(null);
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const [superAdminResponse, productResponse, notificationsResponse, unreadResponse] = await Promise.all([
        apiClient.dashboard.getSuperAdminStats(token),
        apiClient.products.getStats(token),
        apiClient.notifications.list(token),
        apiClient.notifications.unreadCount(token),
      ]);

      if (!superAdminResponse.success) {
        setError(superAdminResponse.error || "Failed to fetch dashboard stats");
      } else {
        setStats(superAdminResponse.stats as SuperAdminStats);
      }

      if (productResponse.success) {
        setProductStats(productResponse.stats as ProductStats);
      }

      if (Array.isArray((notificationsResponse as { notifications?: NotificationItem[] }).notifications)) {
        setNotifications((notificationsResponse as { notifications?: NotificationItem[] }).notifications || []);
      }

      if ((unreadResponse as { unreadCount?: number }).unreadCount !== undefined) {
        setUnreadCount((unreadResponse as { unreadCount?: number }).unreadCount || 0);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards: StatCard[] = useMemo(
    () => [
      {
        title: "Total Users",
        value: String(stats?.totalUsers || 0),
        description: "Registered customer accounts",
      },
      {
        title: "Total Vendors",
        value: String(stats?.totalVendors || 0),
        description: "All vendor applications",
      },
      {
        title: "Pending Vendors",
        value: String(stats?.pendingVendors || 0),
        description: "Waiting for superadmin review",
      },
      {
        title: "Total Leads",
        value: String(stats?.totalLeads || 0),
        description: "Vendor enquiries captured",
      },
      {
        title: "Calculator Usage",
        value: String(stats?.calculatorUsage || 0),
        description: "Logged estimate sessions",
      },
      {
        title: "Product Catalog",
        value: String(productStats?.totalProducts || 0),
        description: "Existing product records",
      },
      {
        title: "Quote Requests",
        value: String(stats?.quoteRequests || 0),
        description: "Calculator-to-sales handoffs",
      },
      {
        title: "Service Areas",
        value: String(stats?.vendorServiceAreas || 0),
        description: "Mapped vendor coverage zones",
      },
    ],
    [productStats?.totalProducts, stats]
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Superadmin</p>
            <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Operations dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              A central view for vendor approval, lead mediation, customer registration, calculator usage, quote capture, and the existing product catalog.
            </p>
          </div>

          <Link href="/admin/notifications" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">
            <span>Notifications</span>
            <span className="rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">{unreadCount}</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white/80" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{card.title}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{card.value}</p>
                <p className="mt-2 text-sm text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Vendor workflow</p>
                  <h2 className="mt-2 text-2xl text-slate-950">Approval states</h2>
                </div>
                <Link href="/admin/vendors" className="text-sm font-semibold text-amber-700 hover:text-amber-600">
                  Manage vendors →
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniState label="Pending" value={stats?.pendingVendors || 0} tone="bg-amber-50 text-amber-800" />
                <MiniState label="Approved" value={stats?.approvedVendors || 0} tone="bg-emerald-50 text-emerald-800" />
                <MiniState label="Rejected" value={stats?.rejectedVendors || 0} tone="bg-rose-50 text-rose-800" />
              </div>

              <div className="mt-6 space-y-3">
                {stats?.recentVendors?.map((vendor) => (
                  <div key={vendor.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{vendor.companyName}</p>
                        <p className="text-sm text-slate-600">{vendor.email}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {vendor.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Lead funnel</p>
                  <h2 className="mt-2 text-2xl text-slate-950">Conversion stages</h2>
                </div>
                <Link href="/admin/leads" className="text-sm font-semibold text-amber-700 hover:text-amber-600">
                  Manage leads →
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniState label="New" value={stats?.newLeads || 0} tone="bg-slate-100 text-slate-800" />
                <MiniState label="Contacted" value={stats?.contactedLeads || 0} tone="bg-blue-50 text-blue-800" />
                <MiniState label="Assigned" value={stats?.assignedLeads || 0} tone="bg-amber-50 text-amber-800" />
              </div>

              <div className="mt-6 space-y-3">
                {stats?.recentLeads?.map((lead) => (
                  <div key={lead.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{lead.userName}</p>
                        <p className="text-sm text-slate-600">{lead.userEmail}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Notifications</p>
                  <h2 className="mt-2 text-2xl text-slate-950">Recent alerts</h2>
                </div>
                <Link href="/admin/notifications" className="text-sm font-semibold text-amber-700 hover:text-amber-600">
                  Open center →
                </Link>
              </div>

              <div className="mt-5 space-y-3">
                {notifications.slice(0, 4).map((notification) => (
                  <div key={notification.id} className={`rounded-2xl border px-4 py-3 ${notification.isRead ? "border-slate-200 bg-slate-50" : "border-amber-200 bg-amber-50"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700 ring-1 ring-slate-200">
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                ))}

                {notifications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                    No notifications yet. New vendor approvals, leads, and quotes will appear here.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Action queue</p>
                <h2 className="mt-2 text-2xl text-slate-950">Fast links</h2>
              </div>

              <div className="mt-5 grid gap-3">
                <ActionLink href="/admin/vendors" label="Review vendors" description="Approve or reject pending applications." />
                <ActionLink href="/admin/leads" label="Work leads" description="Track contact and assignment states." />
                <ActionLink href="/admin/products" label="Manage products" description="Keep the catalog aligned with sales." />
                <ActionLink href="/admin/notifications" label="Clear notifications" description="Open the alert center and mark items read." />
              </div>
            </section>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recent registrations</p>
                  <h2 className="mt-2 text-2xl text-slate-950">Users</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {stats?.recentUsers?.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-slate-950">{user.fullName}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Recent inquiries</p>
                  <h2 className="mt-2 text-2xl text-slate-950">Contact queue</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {stats?.recentInquiries?.map((inquiry) => (
                  <div key={inquiry.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="font-semibold text-slate-950">{inquiry.name}</p>
                    <p className="text-sm text-slate-600">{inquiry.email}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Existing catalog</p>
                <h2 className="mt-2 text-2xl text-slate-950">Recent products</h2>
              </div>
              <Link href="/admin/products" className="text-sm font-semibold text-amber-700 hover:text-amber-600">
                View all →
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {productStats?.recentActivity?.map((product) => (
                <div key={product.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{product.title}</p>
                      <p className="text-sm text-slate-600">{product.brand} • {product.wattage}W</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MiniState({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-2xl px-4 py-3 ${tone}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function ActionLink({ href, label, description }: { href: string; label: string; description: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:border-slate-300 hover:bg-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition group-hover:ring-slate-300">Open</span>
      </div>
    </Link>
  );
}