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

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.dashboard.getUserStats(token);
      if (!response.success) {
        setError(response.error || "Failed to load dashboard");
        return;
      }
      setStats(response.stats as UserStats);
    };

    void run();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">User Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your profile, notifications, and nearby vendors.</p>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Calculator History" value={stats?.historyCount || 0} />
        <Card label="Quote Requests" value={stats?.quoteCount || 0} />
        <Card label="Notifications" value={stats?.notificationCount || 0} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Nearby Vendors</h2>
        <p className="mt-1 text-sm text-slate-600">Matched by your pincode first, then city/state proximity.</p>

        <div className="mt-4 space-y-3">
          {stats?.nearbyVendors?.length ? stats.nearbyVendors.map((vendor) => (
            <article key={vendor.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-semibold text-slate-900">{vendor.companyName}</p>
              <p className="text-sm text-slate-600">{vendor.businessType} • {vendor.experience} years</p>
              <p className="text-xs text-slate-500">{vendor.city || "-"}, {vendor.state || "-"} {vendor.pincode || ""}</p>
            </article>
          )) : (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-600">
              No nearby vendors found yet. Add your pincode in profile for better results.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
