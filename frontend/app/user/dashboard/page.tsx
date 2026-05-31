"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type UserStats = {
  user: { fullName: string; pincode?: string | null; city?: string | null; state?: string | null };
  historyCount: number;
  quoteCount: number;
  notificationCount: number;
  nearbyVendors: Array<{
    id: string;
    companyName: string;
    ownerName: string;
    businessType: string;
    experience: number;
    city?: string | null;
    state?: string | null;
    pincode?: string | null;
  }>;
};

export default function UserDashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.dashboard.getUserStats(token);
      if (!response.success) {
        setError(response.error || "Failed to load dashboard");
        setLoading(false);
        return;
      }
      setStats(response.stats as UserStats);
      setLoading(false);
    };

    void run();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">User Overview</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Manage your solar journey with clarity</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Track your activity, review nearby vendors, and stay on top of quotes and notifications from one clean workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-105">
            <HeroChip label="Saved vendors" value={stats?.nearbyVendors?.length ? String(stats.nearbyVendors.length) : "0"} />
            <HeroChip label="Quotes" value={String(stats?.quoteCount || 0)} />
            <HeroChip label="Alerts" value={String(stats?.notificationCount || 0)} />
          </div>
        </div>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Calculator History" value={stats?.historyCount || 0} tone="emerald" icon="calculator" />
          <StatCard label="Quote Requests" value={stats?.quoteCount || 0} tone="amber" icon="inbox" />
          <StatCard label="Notifications" value={stats?.notificationCount || 0} tone="slate" icon="bell" />
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Nearby Vendors</h2>
            <p className="mt-1 text-sm text-slate-600">Matched by your pincode first, then city/state proximity.</p>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Premium match list</div>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
              ))}
            </div>
          ) : stats?.nearbyVendors?.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {stats.nearbyVendors.map((vendor, index) => (
                <article key={vendor.id} className={`grid gap-3 px-4 py-4 sm:grid-cols-[1.2fr_0.9fr_0.7fr] sm:items-center ${index !== stats.nearbyVendors.length - 1 ? "border-b border-slate-200" : ""}`}>
                  <div>
                    <p className="font-semibold text-slate-950">{vendor.companyName}</p>
                    <p className="mt-1 text-sm text-slate-600">{vendor.ownerName}</p>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>{vendor.businessType}</p>
                    <p className="mt-1 text-xs text-slate-500">{vendor.experience} years experience</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                      {vendor.city || "-"}, {vendor.state || "-"}
                    </span>
                    <p className="mt-2 text-xs text-slate-500">Pincode {vendor.pincode || "-"}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600">
              No nearby vendors found yet. Add your pincode in profile for better results.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function StatCard({ label, value, tone, icon }: { label: string; value: number; tone: "emerald" | "amber" | "slate"; icon: "calculator" | "inbox" | "bell" }) {
  const tones = {
    emerald: "from-emerald-50 to-white text-emerald-700 ring-emerald-100",
    amber: "from-amber-50 to-white text-amber-700 ring-amber-100",
    slate: "from-slate-50 to-white text-slate-700 ring-slate-200",
  };

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${tones[tone]} ring-1`}>
          <StatIcon type={icon} />
        </div>
      </div>
    </div>
  );
}

function StatIcon({ type }: { type: "calculator" | "inbox" | "bell" }) {
  if (type === "calculator") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="5" y="3" width="14" height="18" rx="3" />
        <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" />
      </svg>
    );
  }

  if (type === "inbox") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 7h16v10H4z" />
        <path d="M4 13h4l2 3h4l2-3h4" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M15 17h5l-1.5-1.5A2 2 0 0 1 18 14v-3a6 6 0 1 0-12 0v3a2 2 0 0 1-.5 1.5L4 17h5" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}
