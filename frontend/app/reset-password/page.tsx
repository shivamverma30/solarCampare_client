"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import { apiClient } from "@/lib/api-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const accountType = searchParams.get("type") || "user";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const ready = useMemo(() => Boolean(token), [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!ready) {
      setError("Reset token is missing.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const response = await apiClient.authExtras.resetPassword(token, newPassword);
    if (!response.success) {
      setError(response.error || "Unable to reset password");
    } else {
      setStatus("Password updated successfully. Redirecting to login...");
      window.setTimeout(() => {
        window.location.href = accountType === "vendor" ? "/login" : "/login";
      }, 1200);
    }
    setLoading(false);
  };

  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
        <BrandMark href="/" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
        <h1 className="mt-6 text-3xl text-slate-950">Reset password</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Choose a new secure password for your Solar Compare account.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        {status ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{status}</div> : null}
        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      </div>
    </section>
  );
}

function ResetPasswordFallback() {
  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
        <BrandMark href="/" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
        <h1 className="mt-6 text-3xl text-slate-950">Reset password</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Loading secure reset form...</p>
      </div>
    </section>
  );
}
