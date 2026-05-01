"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken, setAdmin } from "@/lib/auth";

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = getToken();
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const response = await apiClient.auth.getProfile(token);

    if (!response.success) {
      setError(response.error || "Failed to fetch profile");
    } else {
      const profileData = response.data as AdminProfile;
      setProfile(profileData);
      setFormData({
        name: profileData?.name || "",
        email: profileData?.email || "",
      });
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setError("");
    setSuccess("");

    const response = await apiClient.auth.updateProfile(
      token,
      formData.name,
      formData.email
    );

    if (!response.success) {
      setError(response.error || "Failed to update profile");
    } else {
      const updatedAdmin = (response.admin as AdminProfile) || profile;
      setProfile(updatedAdmin);
      setAdmin(updatedAdmin);
      setSuccess("Profile updated successfully!");
      setEditing(false);

      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"></div>
          <p className="mt-4 text-app-fg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-slate-900">
          Profile
        </h1>
        <p className="mt-2 text-slate-600">
          Manage your admin profile information
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

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm">
        {!editing ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-slate-600">
                Name
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {profile?.name}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-600">
                Email
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {profile?.email}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-600">
                Member Since
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-amber-300/80 bg-amber-400 px-6 py-2 font-semibold text-black transition hover:bg-amber-300"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-amber-400 px-4 py-3 font-semibold text-black transition hover:bg-amber-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
