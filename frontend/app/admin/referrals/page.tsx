"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type AdminReferral = {
  id: string;
  referrerName: string;
  referredUserName: string;
  signupStatus: string;
  installationStatus: string;
  createdAt: string;
};

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<AdminReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.referrals.listAdmin(token);
      if (!response.success) {
        setError(response.error || "Failed to load referrals");
      } else {
        setReferrals((response.referrals as AdminReferral[]) || []);
      }

      setLoading(false);
    };

    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Referral desk</p>
        <h1 className="mt-3 text-3xl text-slate-950 md:text-5xl">Referral management</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          Track referral signups and installation progress using the existing referral and tracker systems.
        </p>
      </div>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referrer</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Referred User</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Signup Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Installation Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>
                    Loading referrals...
                  </td>
                </tr>
              ) : referrals.length ? (
                referrals.map((referral) => (
                  <tr key={referral.id} className="border-t border-slate-200">
                    <td className="px-4 py-4 text-sm font-semibold text-slate-950">{referral.referrerName}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{referral.referredUserName}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{formatStatus(referral.signupStatus)}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{formatStatus(referral.installationStatus)}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{new Date(referral.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>
                    No referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatStatus(status: string): string {
  if (status === "DONE") return "Done";
  if (status === "IN_PROGRESS") return "In Progress";
  if (status === "COMPLETED") return "Completed";
  return status;
}
