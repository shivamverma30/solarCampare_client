"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

export default function UserChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const token = getToken();
    if (!token) return;

    setLoading(true);
    const response = await apiClient.auth.changePassword(token, currentPassword, newPassword);
    setLoading(false);
    setMessage(response.success ? "Password updated successfully" : response.error || "Failed to update password");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Change Password</h1>
      {message ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}
      <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Input label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" />
        <Input label="New Password" value={newPassword} onChange={setNewPassword} type="password" />
        <Input label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{loading ? "Updating..." : "Update Password"}</button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2" />
    </label>
  );
}
