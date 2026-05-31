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
  createdAt: string;
};

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.leads.getVendorLeads(token);
      if (!response.success) {
        setError(response.error || "Failed to load leads");
        return;
      }
      setLeads((response.leads as Lead[]) || []);
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Leads</h1>
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      <div className="space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="font-semibold text-slate-900">{lead.userName}</p>
            <p className="text-sm text-slate-600">{lead.userEmail} • {lead.userPhone || "No phone"}</p>
            <p className="mt-2 text-sm text-slate-700">{lead.serviceRequirement}</p>
            <p className="text-xs text-slate-500">{lead.location} • {lead.status}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
