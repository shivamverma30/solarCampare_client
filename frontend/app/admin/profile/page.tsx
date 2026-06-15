"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Mail,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { getToken, setAdmin, type StoredProfile } from "@/lib/auth";

interface AdminProfile extends StoredProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "" });

  async function fetchProfile() {
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
      const profileData = response as unknown as AdminProfile;
      setProfile(profileData);
      setFormData({ name: profileData?.name || "", email: profileData?.email || "" });
    }
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void fetchProfile(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    setError("");
    setSuccess("");
    setSaving(true);

    const response = await apiClient.auth.updateProfile(token, formData.name, formData.email);
    setSaving(false);

    if (!response.success) {
      setError(response.error || "Failed to update profile");
    } else {
      const updatedAdmin = (response.admin as AdminProfile) || profile;
      setProfile(updatedAdmin);
      setAdmin(updatedAdmin as StoredProfile);
      setSuccess("Profile updated successfully!");
      setEditing(false);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSuccess(""), 4000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const initials = getInitials(profile?.name || "A");
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-md">
          {initials || <User className="h-7 w-7" />}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile?.name || "Admin"}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-0.5 text-xs font-semibold text-violet-700">
              <ShieldCheck className="h-3 w-3" />
              Administrator
            </span>
            <span className="text-sm text-slate-500">Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Feedback banners */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Account Information — read-only */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Account Information
            </h2>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          <ReadRow
            label="Account ID"
            value={profile?.id ? `#${String(profile.id).slice(-8).toUpperCase()}` : "—"}
          />
          <ReadRow label="Member Since" value={memberSince} />
        </div>
      </section>

      {/* Profile Details */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Profile Details
            </h2>
          </div>
          {!editing && (
            <button
              type="button"
              onClick={() => { setEditing(true); setError(""); setSuccess(""); }}
              className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="divide-y divide-slate-100">
            <ReadRow
              label="Name"
              value={profile?.name || "—"}
              icon={<User className="h-4 w-4 text-slate-400" />}
            />
            <ReadRow
              label="Email"
              value={profile?.email || "—"}
              icon={<Mail className="h-4 w-4 text-slate-400" />}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 p-6 sm:grid-cols-2">
            <ProfileInput
              label="Name"
              required
              icon={User}
              type="text"
              value={formData.name}
              onChange={(v) => setFormData({ ...formData, name: v })}
              placeholder="Admin name"
            />
            <ProfileInput
              label="Email Address"
              required
              icon={Mail}
              type="email"
              value={formData.email}
              onChange={(v) => setFormData({ ...formData, email: v })}
              placeholder="admin@email.com"
            />

            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({ name: profile?.name || "", email: profile?.email || "" });
                  setError("");
                }}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────────────────── */

function ReadRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

/**
 * ProfileInput — flexbox icon + input. No absolute positioning.
 * The icon is a flex sibling, never overlapping the text.
 */
function ProfileInput({
  label,
  required,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label: string;
  required?: boolean;
  icon?: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <div className="flex items-center rounded-[0.625rem] border border-slate-200 bg-white transition hover:border-slate-300 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-500/15">
        {Icon && (
          <span className="flex shrink-0 items-center pl-3 pr-1 text-slate-400">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          style={{ paddingLeft: Icon ? "0.375rem" : "0.875rem" }}
        />
      </div>
    </div>
  );
}
