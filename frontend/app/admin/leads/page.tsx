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
  consultationTracking?: Array<{
    id: string;
    status: string;
    notes?: string | null;
    createdAt: string;
    updatedBy: string;
  }>;
};

const leadStatuses = ["NEW", "CONTACTED", "VENDOR_ASSIGNED", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST"];
const trackerStatuses = [
  "CONSULTATION_REQUESTED",
  "REQUEST_REVIEWED",
  "VENDOR_ASSIGNED",
  "APPOINTMENT_SCHEDULED",
  "SITE_VISIT_COMPLETED",
  "PROPOSAL_SHARED",
  "NEGOTIATION",
  "PROJECT_CONFIRMED",
  "INSTALLATION_IN_PROGRESS",
  "INSTALLATION_COMPLETED",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [trackerStatusByLead, setTrackerStatusByLead] = useState<Record<string, string>>({});
  const [trackerNotesByLead, setTrackerNotesByLead] = useState<Record<string, string>>({});

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
        const rows = (response.leads as Lead[]) || [];
        setLeads(rows);
        setTrackerStatusByLead(
          rows.reduce<Record<string, string>>((acc, lead) => {
            const latest = lead.consultationTracking?.[lead.consultationTracking.length - 1];
            acc[lead.id] = latest?.status || "CONSULTATION_REQUESTED";
            return acc;
          }, {})
        );
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

  const updateTracker = async (id: string) => {
    const token = getToken();
    if (!token) return;

    const status = trackerStatusByLead[id] || "CONSULTATION_REQUESTED";
    const notes = trackerNotesByLead[id] || "";

    setBusyId(id);
    const response = await apiClient.leads.updateConsultationTracker(token, id, status, notes);

    if (response.success && response.tracking) {
      setLeads((current) =>
        current.map((lead) => {
          if (lead.id !== id) return lead;
          const existing = lead.consultationTracking || [];
          return {
            ...lead,
            consultationTracking: [
              ...existing,
              response.tracking as { id: string; status: string; notes?: string | null; createdAt: string; updatedBy: string },
            ],
          };
        })
      );
      setTrackerNotesByLead((current) => ({ ...current, [id]: "" }));
    } else {
      setError(response.error || "Failed to update tracker");
    }

    setBusyId(null);
  };

  const deleteLead = async (id: string) => {
    const token = getToken();
    if (!token || busyId) return;

    if (!window.confirm("Delete this lead? This action cannot be undone.")) return;

    setBusyId(id);
    const response = await apiClient.leads.delete(token, id);

    if (response.success) {
      setLeads((current) => current.filter((lead) => lead.id !== id));
    } else {
      setError(response.error || "Failed to delete lead");
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
            <article key={lead.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xl font-semibold text-slate-950">{lead.userName}</p>
                  <p className="mt-1 text-sm text-slate-600">{lead.userEmail}{lead.userPhone ? ` • ${lead.userPhone}` : ""}</p>
                  <p className="mt-3 text-sm text-slate-700">{lead.serviceRequirement}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{lead.location}</p>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{lead.status}</span>
                  <button
                    type="button"
                    onClick={() => void deleteLead(lead.id)}
                    disabled={busyId === lead.id}
                    className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyId === lead.id ? "Deleting..." : "Delete"}
                  </button>
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

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Update Tracker Status</p>
                <div className="mt-3 grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-start">
                  <select
                    value={trackerStatusByLead[lead.id] || "CONSULTATION_REQUESTED"}
                    onChange={(event) => setTrackerStatusByLead((current) => ({ ...current, [lead.id]: event.target.value }))}
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    {trackerStatuses.map((status) => (
                      <option key={`${lead.id}-${status}`} value={status}>{status}</option>
                    ))}
                  </select>
                  <textarea
                    rows={2}
                    value={trackerNotesByLead[lead.id] || ""}
                    onChange={(event) => setTrackerNotesByLead((current) => ({ ...current, [lead.id]: event.target.value }))}
                    placeholder="Add optional note"
                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => void updateTracker(lead.id)}
                    disabled={busyId === lead.id}
                    className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyId === lead.id ? "Saving..." : "Save Update"}
                  </button>
                </div>

                {lead.consultationTracking?.length ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {lead.consultationTracking.slice(-4).reverse().map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                        <p className="font-semibold text-slate-900">{entry.status}</p>
                        <p className="mt-1">{entry.notes || "No notes"}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}