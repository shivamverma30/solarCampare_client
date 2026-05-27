"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type Vendor = {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  serviceArea: string;
  businessType: string;
  experience: number;
  services: string[];
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await apiClient.vendors.getAdmin(token);

      if (!response.success) {
        setError(response.error || "Failed to load vendors");
      } else {
        setVendors((response.vendors as Vendor[]) || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const counts = useMemo(() => ({
    pending: vendors.filter((vendor) => vendor.status === "PENDING").length,
    approved: vendors.filter((vendor) => vendor.status === "APPROVED").length,
    rejected: vendors.filter((vendor) => vendor.status === "REJECTED").length,
  }), [vendors]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const token = getToken();
    if (!token) return;

    setBusyId(id);
    const response = action === "approve"
      ? await apiClient.vendors.approve(token, id, "Approved from admin panel")
      : await apiClient.vendors.reject(token, id, "Rejected from admin panel");

    if (response.success) {
      setVendors((current) =>
        current.map((vendor) => vendor.id === id ? { ...vendor, status: action === "approve" ? "APPROVED" : "REJECTED" } : vendor)
      );
    } else {
      setError(response.error || `Failed to ${action} vendor`);
    }

    setBusyId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Vendor control</p>
        <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Vendor applications</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Review vendor onboarding submissions and keep private contact details hidden from public users.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Pending" value={counts.pending} />
        <SummaryCard title="Approved" value={counts.approved} />
        <SummaryCard title="Rejected" value={counts.rejected} />
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-60 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {vendors.map((vendor) => (
            <article key={vendor.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-slate-950">{vendor.companyName}</p>
                  <p className="mt-1 text-sm text-slate-600">{vendor.ownerName} • {vendor.businessType}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{vendor.status}</span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 text-sm text-slate-600">
                <InfoRow label="Service area" value={vendor.serviceArea} />
                <InfoRow label="Experience" value={`${vendor.experience} years`} />
                <InfoRow label="Phone" value={vendor.phone} />
                <InfoRow label="Email" value={vendor.email} />
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Services</p>
                <p className="mt-2 text-sm text-slate-700">{vendor.services.join(", ") || "Not specified"}</p>
              </div>

              {vendor.rejectionReason ? (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  Rejection reason: {vendor.rejectionReason}
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={busyId === vendor.id || vendor.status === "APPROVED"}
                  onClick={() => handleAction(vendor.id, "approve")}
                  className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-50"
                >
                  {busyId === vendor.id ? "Processing..." : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={busyId === vendor.id || vendor.status === "REJECTED"}
                  onClick={() => handleAction(vendor.id, "reject")}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}