"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type Lead = {
  id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  serviceRequirement: string;
  location: string;
  status: string;
  vendorId: string;
  createdAt: string;
};

const leadStatuses = ["NEW", "CONTACTED", "VENDOR_ASSIGNED", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
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

      const response = await apiClient.leads.getAdmin(token);
      if (!response.success) {
        setError(response.error || "Failed to load leads");
      } else {
        setLeads((response.leads as Lead[]) || []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = getToken();
    if (!token) return;

    setBusyId(id);
    const response = await apiClient.leads.updateStatus(token, id, status, "Updated from lead panel");

    if (response.success) {
      setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    } else {
      setError(response.error || "Failed to update lead");
    }

    setBusyId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Lead desk</p>
        <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Vendor enquiries</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Manage user enquiries, assign vendors internally, and keep vendor contact information hidden from the public surface.
        </p>
      </div>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <article key={lead.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xl font-semibold text-slate-950">{lead.userName}</p>
                  <p className="mt-1 text-sm text-slate-600">{lead.userEmail}{lead.userPhone ? ` • ${lead.userPhone}` : ""}</p>
                  <p className="mt-3 text-sm text-slate-700">{lead.serviceRequirement}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{lead.location}</p>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{lead.status}</span>
                  <div className="flex flex-wrap gap-2">
                    {leadStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={busyId === lead.id || status === lead.status}
                        onClick={() => updateStatus(lead.id, status)}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition disabled:opacity-50"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}