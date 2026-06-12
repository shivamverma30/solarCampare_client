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
  consultationTracking?: Array<{
    id: string;
    status: string;
    notes?: string | null;
    createdAt: string;
    updatedBy: string;
  }>;
};

const vendorTrackerStatuses = ["APPOINTMENT_SCHEDULED", "SITE_VISIT_COMPLETED", "PROPOSAL_SHARED", "NEGOTIATION"];

const vendorTrackerStatusLabels: Record<string, string> = {
  APPOINTMENT_SCHEDULED: "Site Visit Scheduled",
  SITE_VISIT_COMPLETED: "Site Visit Completed",
  PROPOSAL_SHARED: "Quotation Shared",
  NEGOTIATION: "Negotiation",
};

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [trackerStatusByLead, setTrackerStatusByLead] = useState<Record<string, string>>({});
  const [trackerNotesByLead, setTrackerNotesByLead] = useState<Record<string, string>>({});
  const [savingTrackerId, setSavingTrackerId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.leads.getVendorLeads(token);
      if (!response.success) {
        setError(response.error || "Failed to load leads");
        return;
      }
      const rows = (response.leads as Lead[]) || [];
      setLeads(rows);
      setTrackerStatusByLead(
        rows.reduce<Record<string, string>>((acc, lead) => {
          acc[lead.id] = vendorTrackerStatuses[0];
          return acc;
        }, {})
      );
    };

    void load();
  }, []);

  const deleteLead = async (leadId: string) => {
    const token = getToken();
    if (!token || deletingId) return;

    if (!window.confirm("Delete this lead? This action cannot be undone.")) return;

    setDeletingId(leadId);
    const response = await apiClient.leads.delete(token, leadId);

    if (response.success) {
      setLeads((current) => current.filter((lead) => lead.id !== leadId));
    } else {
      setError(response.error || "Failed to delete lead");
    }

    setDeletingId(null);
  };

  const updateTracker = async (leadId: string) => {
    const token = getToken();
    if (!token || savingTrackerId) return;

    const status = trackerStatusByLead[leadId] || vendorTrackerStatuses[0];
    const notes = trackerNotesByLead[leadId] || "";

    setSavingTrackerId(leadId);
    const response = await apiClient.leads.updateConsultationTracker(token, leadId, status, notes);

    if (response.success && response.tracking) {
      setLeads((current) =>
        current.map((lead) => {
          if (lead.id !== leadId) return lead;
          const history = lead.consultationTracking || [];
          return {
            ...lead,
            consultationTracking: [
              ...history,
              response.tracking as { id: string; status: string; notes?: string | null; createdAt: string; updatedBy: string },
            ],
          };
        })
      );
      setTrackerNotesByLead((current) => ({ ...current, [leadId]: "" }));
    } else {
      setError(response.error || "Failed to update consultation tracker");
    }

    setSavingTrackerId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Lead desk</p>
        <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Vendor enquiries</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Review consultation requests without exposing private contact details.
        </p>
      </div>
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      <div className="space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xl font-semibold text-slate-950">{lead.userName}</p>
                <p className="mt-2 text-sm text-slate-600">{lead.serviceRequirement}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{lead.location}</p>
                <p className="mt-2 text-xs text-slate-500">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">{lead.status}</span>
                <button
                  type="button"
                  onClick={() => void deleteLead(lead.id)}
                  disabled={deletingId === lead.id}
                  className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === lead.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Update Tracker Status</p>
              <p className="mt-1 text-xs text-slate-500">Allowed: Appointment Scheduled, Site Visit Completed, Proposal Shared, Negotiation.</p>
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-start">
                <select
                  value={trackerStatusByLead[lead.id] || vendorTrackerStatuses[0]}
                  onChange={(event) => setTrackerStatusByLead((current) => ({ ...current, [lead.id]: event.target.value }))}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  {vendorTrackerStatuses.map((status) => (
                    <option key={`${lead.id}-${status}`} value={status}>{vendorTrackerStatusLabels[status] || status}</option>
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
                  disabled={savingTrackerId === lead.id}
                  className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingTrackerId === lead.id ? "Saving..." : "Save Update"}
                </button>
              </div>

              {lead.consultationTracking?.length ? (
                <div className="mt-3 space-y-2">
                  {lead.consultationTracking.slice(-3).reverse().map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-900">{vendorTrackerStatusLabels[entry.status] || entry.status}</p>
                      <p className="mt-1">{entry.notes || "No notes"}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
