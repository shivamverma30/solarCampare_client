"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type VendorStats = {
  vendor: { status: string; companyName: string; ownerName: string };
  leadCount: number;
  quoteRequests: number;
  productsCount: number;
  unreadNotifications: number;
};

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.dashboard.getVendorStats(token);
      if (!response.success) {
        setError(response.error || "Failed to load vendor dashboard");
        return;
      }
      setStats(response.stats as VendorStats);
    };

    void run();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Vendor Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your products, leads, and profile.</p>
      </div>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {stats?.vendor?.status && stats.vendor.status !== "APPROVED" ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your account is under admin review.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <Card label="Products" value={stats?.productsCount || 0} />
        <Card label="Leads" value={stats?.leadCount || 0} />
        <Card label="Quote Requests" value={stats?.quoteRequests || 0} />
        <Card label="Notifications" value={stats?.unreadNotifications || 0} />
      </div>
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
