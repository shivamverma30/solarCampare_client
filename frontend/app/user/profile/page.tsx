"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken, setSessionProfile, setUser } from "@/lib/auth";

type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  avatarUrl?: string | null;
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      const response = await apiClient.auth.getProfile(token);
      if (response.success) {
        setProfile(response as unknown as UserProfile);
      }
    };

    void load();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return;
    const token = getToken();
    if (!token) return;

    setLoading(true);
    const response = await apiClient.auth.updateProfile(token, profile as unknown as Record<string, unknown>);
    setLoading(false);

    if (!response.success) {
      setMessage(response.error || "Update failed");
      return;
    }

    const updated = (response.user as UserProfile) || profile;
    setProfile(updated);
    setUser(updated);
    setSessionProfile(updated);
    setMessage("Profile updated successfully");
  };

  if (!profile) {
    return <p className="text-sm text-slate-600">Loading profile...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
      {message ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div> : null}

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <Input label="Full Name" value={profile.fullName || ""} onChange={(value) => setProfile({ ...profile, fullName: value })} />
        <Input label="Email" value={profile.email || ""} onChange={(value) => setProfile({ ...profile, email: value })} type="email" />
        <Input label="Phone" value={profile.phone || ""} onChange={(value) => setProfile({ ...profile, phone: value })} />
        <Input label="City" value={profile.city || ""} onChange={(value) => setProfile({ ...profile, city: value })} />
        <Input label="State" value={profile.state || ""} onChange={(value) => setProfile({ ...profile, state: value })} />
        <Input label="PIN Code" value={profile.pincode || ""} onChange={(value) => setProfile({ ...profile, pincode: value })} />
        <Input label="Avatar URL" value={profile.avatarUrl || ""} onChange={(value) => setProfile({ ...profile, avatarUrl: value })} />
        <button type="submit" disabled={loading} className="md:col-span-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2" />
    </label>
  );
}
