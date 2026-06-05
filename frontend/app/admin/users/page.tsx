"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  status: string;
  createdAt: string;
  lastLoginAt?: string | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(count / pageSize)), [count, pageSize]);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await apiClient.auth.listUsers(token, { search, status, city, state, page, pageSize });

      if (!response.success) {
        setError(response.error || "Failed to load users");
        setUsers([]);
      } else {
        setError("");
        setUsers((response.users as AdminUser[]) || []);
        setCount(response.count || 0);
      }

      setLoading(false);
    };

    void load();
  }, [city, page, pageSize, search, state, status]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin</p>
            <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Users</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              View registered users, search by identity or location, and open a user profile without leaving the admin shell.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <StatChip label="Users" value={String(count)} />
            <StatChip label="Active" value={String(users.filter((user) => user.status === "ACTIVE").length)} />
            <StatChip label="Page" value={`${page}/${totalPages}`} />
            <StatChip label="Last Login" value={users.some((user) => user.lastLoginAt) ? "Available" : "-"} />
          </div>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4 md:p-5">
        <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search users" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
        <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white">
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
        <input value={city} onChange={(event) => { setPage(1); setCity(event.target.value); }} placeholder="Filter by city" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
        <input value={state} onChange={(event) => { setPage(1); setState(event.target.value); }} placeholder="Filter by state" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400 focus:bg-white" />
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
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">City / State</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-950">{user.fullName}</p>
                        <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{user.phone || "-"}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <p>{user.city || "-"}</p>
                      <p className="text-xs text-slate-500">{user.state || "-"} • {user.pincode || "-"}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{new Date(user.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-600">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "-"}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{user.status}</span>
                    </td>
                    <td className="px-4 py-4">
                      <button type="button" onClick={() => setSelectedUser(user)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                        Open Profile
                      </button>
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
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, count)} of {count} users
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
            Previous
          </button>
          <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {selectedUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">User Profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">{selectedUser.fullName}</h2>
                <p className="mt-1 text-sm text-slate-600">{selectedUser.email}</p>
              </div>
              <button type="button" onClick={() => setSelectedUser(null)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <InfoTile label="Phone" value={selectedUser.phone || "-"} />
              <InfoTile label="City" value={selectedUser.city || "-"} />
              <InfoTile label="State" value={selectedUser.state || "-"} />
              <InfoTile label="Pincode" value={selectedUser.pincode || "-"} />
              <InfoTile label="Registered" value={new Date(selectedUser.createdAt).toLocaleString()} />
              <InfoTile label="Last Login" value={selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleString() : "-"} />
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
