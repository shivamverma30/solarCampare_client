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
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  businessType: string;
  experience: number;
  services: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorName, setVendorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState("ALL");
  const [companyName, setCompanyName] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [lastActivityAt, setLastActivityAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / pageSize)), [count, pageSize]);

  const loadVendors = async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await apiClient.vendors.getAdmin(token, {
      vendorName,
      companyName,
      email,
      phone,
      city,
      state,
      pincode,
      status,
      page,
      pageSize,
    });

    if (!response.success) {
      setError(response.error || "Failed to load vendors");
      setVendors([]);
      setCount(0);
      setActiveCount(0);
      setLastActivityAt(null);
    } else {
      setError("");
      setVendors((response.vendors as Vendor[]) || []);
      setCount(response.count || 0);
      setActiveCount(response.activeCount || 0);
      setLastActivityAt(response.lastActivityAt || null);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadVendors();
  }, [city, companyName, email, page, pageSize, phone, pincode, state, status, vendorName]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setBusyId(id);
    const response = action === "approve"
      ? await apiClient.vendors.approve(token, id, "Approved from admin panel")
      : await apiClient.vendors.reject(token, id, "Rejected from admin panel");

    if (response.success) {
      await loadVendors();
    } else {
      setError(response.error || `Failed to ${action} vendor`);
    }

    setBusyId(null);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin</p>
            <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Vendors</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              View vendor applications, search by identity or location, and track verification status without leaving the admin shell.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <StatChip label="Total Vendors" value={String(count)} />
            <StatChip label="Active Vendors" value={String(activeCount)} />
            <StatChip label="Current Page" value={`${page}/${totalPages}`} />
            <StatChip label="Last Activity" value={lastActivityAt ? new Date(lastActivityAt).toLocaleString() : "-"} />
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4 md:p-5">
        <input
          value={vendorName}
          onChange={(event) => {
            setPage(1);
            setVendorName(event.target.value);
          }}
          placeholder="Search vendor name"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
        <input
          value={email}
          onChange={(event) => {
            setPage(1);
            setEmail(event.target.value);
          }}
          placeholder="Search email"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
        <input
          value={phone}
          onChange={(event) => {
            setPage(1);
            setPhone(event.target.value);
          }}
          placeholder="Search phone"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value);
          }}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        >
          <option value="ALL">All verification statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input
          value={companyName}
          onChange={(event) => {
            setPage(1);
            setCompanyName(event.target.value);
          }}
          placeholder="Filter by company name"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
        <input
          value={city}
          onChange={(event) => {
            setPage(1);
            setCity(event.target.value);
          }}
          placeholder="Filter by city"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
        <input
          value={state}
          onChange={(event) => {
            setPage(1);
            setState(event.target.value);
          }}
          placeholder="Filter by state"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
        <input
          value={pincode}
          onChange={(event) => {
            setPage(1);
            setPincode(event.target.value);
          }}
          placeholder="Filter by pincode"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-3xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100/90 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">City / State / Pincode</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Last Activity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-950">{vendor.companyName}</p>
                        <p className="mt-1 text-xs text-slate-500">{vendor.ownerName} • {vendor.email}</p>
                        <p className="mt-1 text-xs text-slate-500">{vendor.businessType}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{vendor.phone || "-"}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <p>{vendor.city || "-"}</p>
                      <p className="text-xs text-slate-500">{vendor.state || "-"} • {vendor.pincode || "-"}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{new Date(vendor.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-600">{vendor.updatedAt ? new Date(vendor.updatedAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{vendor.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVendor(vendor)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          Open Profile
                        </button>
                        <button
                          type="button"
                          disabled={busyId === vendor.id || vendor.status === "APPROVED"}
                          onClick={() => void handleAction(vendor.id, "approve")}
                          className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-50"
                        >
                          {busyId === vendor.id ? "Processing..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={busyId === vendor.id || vendor.status === "REJECTED"}
                          onClick={() => void handleAction(vendor.id, "reject")}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, count)} of {count} vendors
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedVendor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setSelectedVendor(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Vendor Profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{selectedVendor.companyName}</h2>
                <p className="mt-1 text-sm text-slate-600">{selectedVendor.ownerName} • {selectedVendor.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVendor(null)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoTile label="Phone" value={selectedVendor.phone || "-"} />
              <InfoTile label="City" value={selectedVendor.city || "-"} />
              <InfoTile label="State" value={selectedVendor.state || "-"} />
              <InfoTile label="Pincode" value={selectedVendor.pincode || "-"} />
              <InfoTile label="Business Type" value={selectedVendor.businessType} />
              <InfoTile label="Experience" value={`${selectedVendor.experience} years`} />
              <InfoTile label="Registered" value={new Date(selectedVendor.createdAt).toLocaleString()} />
              <InfoTile label="Last Activity" value={selectedVendor.updatedAt ? new Date(selectedVendor.updatedAt).toLocaleString() : "-"} />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Services</p>
              <p className="mt-2 text-sm leading-7 text-slate-700">{selectedVendor.services.length ? selectedVendor.services.join(", ") : "Not specified"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
