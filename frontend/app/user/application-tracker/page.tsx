"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type TrackerStatus =
  | "CONSULTATION_REQUESTED"
  | "REQUEST_REVIEWED"
  | "VENDOR_ASSIGNED"
  | "APPOINTMENT_SCHEDULED"
  | "SITE_VISIT_COMPLETED"
  | "PROPOSAL_SHARED"
  | "NEGOTIATION"
  | "PROJECT_CONFIRMED"
  | "INSTALLATION_IN_PROGRESS"
  | "INSTALLATION_COMPLETED";

type ConsultationTrackingEntry = {
  id: string;
  status: TrackerStatus;
  notes?: string | null;
  updatedBy: string;
  createdAt: string;
};

type UserConsultation = {
  id: string;
  createdAt: string;
  vendor?: {
    id: string;
    companyName: string;
    ownerName: string;
    city?: string | null;
    state?: string | null;
  } | null;
  consultationTracking: ConsultationTrackingEntry[];
};

const trackerFlow: Array<{ key: TrackerStatus; label: string }> = [
  { key: "CONSULTATION_REQUESTED", label: "Consultation Requested" },
  { key: "REQUEST_REVIEWED", label: "Request Reviewed" },
  { key: "VENDOR_ASSIGNED", label: "Vendor Assigned" },
  { key: "APPOINTMENT_SCHEDULED", label: "Appointment Scheduled" },
  { key: "SITE_VISIT_COMPLETED", label: "Site Visit Completed" },
  { key: "PROPOSAL_SHARED", label: "Proposal Shared" },
  { key: "NEGOTIATION", label: "Negotiation / Discussion" },
  { key: "PROJECT_CONFIRMED", label: "Project Confirmed" },
  { key: "INSTALLATION_IN_PROGRESS", label: "Installation In Progress" },
  { key: "INSTALLATION_COMPLETED", label: "Installation Completed" },
];

export default function UserApplicationTrackerPage() {
  const [consultations, setConsultations] = useState<UserConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.leads.getUserConsultations(token);
      if (!response.success) {
        setError(response.error || "Failed to load application tracker");
      } else {
        setConsultations((response.consultations as UserConsultation[]) || []);
      }

      setLoading(false);
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          Application Tracker
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Track the progress of your solar consultation request
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Follow each stage from consultation request to installation completion, with notes and latest update time.
        </p>
      </section>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : consultations.length ? (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <ConsultationTrackerCard key={consultation.id} consultation={consultation} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-sm text-slate-600">
          No consultation tracker entries yet. Start by clicking Request Consultation from your dashboard vendors.
        </div>
      )}
    </div>
  );
}

function ConsultationTrackerCard({ consultation }: { consultation: UserConsultation }) {
  const latest = consultation.consultationTracking[consultation.consultationTracking.length - 1];
  const activeIndex = latest ? trackerFlow.findIndex((step) => step.key === latest.status) : -1;
  const notes = consultation.consultationTracking.filter((entry) => Boolean(entry.notes));

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-950">{consultation.vendor?.companyName || "Assigned vendor pending"}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Consultation ID: {consultation.id}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Last update: {latest ? new Date(latest.createdAt).toLocaleString() : new Date(consultation.createdAt).toLocaleString()}
        </div>
      </div>

      <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {trackerFlow.map((step, index) => {
          const isDone = index < activeIndex;
          const isCurrent = index === activeIndex;
          const baseTone = isDone ? "text-emerald-700" : isCurrent ? "text-sky-700" : "text-slate-400";
          const symbol = isDone ? "✓" : isCurrent ? "●" : "○";

          return (
            <div key={`${consultation.id}-${step.key}`} className={`flex items-center gap-2 text-sm font-medium ${baseTone}`}>
              <span aria-hidden="true" className="w-4 text-center">{symbol}</span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Notes</p>
        {notes.length ? (
          <div className="mt-2 space-y-2">
            {notes.slice(-3).reverse().map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-sm text-slate-700">{entry.notes}</p>
                <p className="mt-1 text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No notes added yet.</p>
        )}
      </div>
    </article>
  );
}
