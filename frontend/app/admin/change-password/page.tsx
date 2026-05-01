"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      return;
    }

    setLoading(true);

    const response = await apiClient.auth.changePassword(
      token,
      formData.currentPassword,
      formData.newPassword
    );

    if (!response.success) {
      setError(response.error || "Failed to change password");
    } else {
      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setSuccess(""), 3000);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-slate-900">
          Change Password
        </h1>
        <p className="mt-2 text-slate-600">
          Update your account password to keep your admin portal secure
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          ✓ {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="max-w-xl rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentPassword: e.target.value,
                })
              }
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  newPassword: e.target.value,
                })
              }
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-amber-300/80 bg-amber-400 px-4 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:opacity-50"
          >
            {loading ? "Changing Password..." : "Change Password"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">
            Password Requirements:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>✓ At least 6 characters</li>
            <li>✓ Different from your current password</li>
            <li>✓ Passwords must match</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
