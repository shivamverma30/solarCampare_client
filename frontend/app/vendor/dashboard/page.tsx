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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.dashboard.getVendorStats(token);
      if (!response.success) {
        setError(response.error || "Failed to load vendor dashboard");
        setLoading(false);
        return;
      }
      setStats(response.stats as VendorStats);
      setLoading(false);
    };

    void run();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Vendor Overview</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Run your vendor workspace with confidence</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Monitor products, leads, quote requests and notifications with an interface that matches the premium admin experience.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-105">
            <HeroChip label="Products" value={String(stats?.productsCount || 0)} />
            <HeroChip label="Leads" value={String(stats?.leadCount || 0)} />
          </div>
        </div>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {stats?.vendor?.status && stats.vendor.status !== "APPROVED" ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800 shadow-sm">
          <div className="font-semibold uppercase tracking-[0.18em] text-amber-700">Account review</div>
          <p className="mt-2 leading-6">Your account is under admin review. The dashboard remains accessible while the status is pending.</p>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Products" value={stats?.productsCount || 0} tone="emerald" icon="grid" />
          <StatCard label="Leads" value={stats?.leadCount || 0} tone="amber" icon="leads" />
          <StatCard label="Quote Requests" value={stats?.quoteRequests || 0} tone="slate" icon="inbox" />
          <StatCard label="Notifications" value={stats?.unreadNotifications || 0} tone="emerald" icon="bell" />
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Workspace snapshot</h2>
              <p className="mt-1 text-sm text-slate-600">A quick visual summary of your current vendor activity.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Live</span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MiniTile title="Company" value={stats?.vendor?.companyName || "-"} description={stats?.vendor?.ownerName || "Owner"} icon="building" />
            <MiniTile title="Status" value={stats?.vendor?.status || "-"} description="Review and approvals" icon="shield" />
            <MiniTile title="Products" value={String(stats?.productsCount || 0)} description="Listed offerings" icon="grid" />
            <MiniTile title="Notifications" value={String(stats?.unreadNotifications || 0)} description="Unread alerts" icon="bell" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Quick actions</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950">Keep your profile active</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">Update products, track leads, and monitor notifications from the same streamlined control center.</p>

          <div className="mt-5 space-y-3">
            <ActionRow label="Products" description="Manage catalog items and pricing." />
            <ActionRow label="Leads" description="Review inquiries and response status." />
            <ActionRow label="Notifications" description="Stay current with account updates." />
          </div>
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

function StatCard({ label, value, tone, icon }: { label: string; value: number; tone: "emerald" | "amber" | "slate"; icon: "grid" | "leads" | "inbox" | "bell" }) {
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

function MiniTile({ title, value, description, icon }: { title: string; value: string; description: string; icon: "building" | "shield" | "grid" | "bell" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200">
          <StatIcon type={icon} />
        </div>
      </div>
    </div>
  );
}

function ActionRow({ label, description }: { label: string; description: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50 hover:shadow-sm">
      <p className="font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function StatIcon({ type }: { type: "grid" | "leads" | "inbox" | "bell" | "building" | "shield" }) {
  if (type === "grid") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    );
  }

  if (type === "leads") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M8 7h13M8 12h13M8 17h13" />
        <path d="M3 7h.01M3 12h.01M3 17h.01" />
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

  if (type === "building") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 21V5a2 2 0 0 1 2-2h8v18" />
        <path d="M14 8h4a2 2 0 0 1 2 2v11" />
        <path d="M8 7h.01M8 11h.01M8 15h.01M12 7h.01M12 11h.01M12 15h.01" />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 3 20 6v5c0 5-3.5 8.7-8 10-4.5-1.3-8-5-8-10V6l8-3Z" />
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
