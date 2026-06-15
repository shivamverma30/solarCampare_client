"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) { setPageLoading(false); return; }
      const response = await apiClient.auth.getProfile(token);
      if (response.success) setProfile(response as unknown as UserProfile);
      setPageLoading(false);
    };
    void load();
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return;
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setMessage(null);
    const response = await apiClient.auth.updateProfile(token, profile as unknown as Record<string, unknown>);
    setLoading(false);

    if (!response.success) {
      setMessage({ type: "error", text: response.error || "Update failed" });
      return;
    }

    const updated = (response.user as UserProfile) || profile;
    setProfile(updated);
    setUser(updated);
    setSessionProfile(updated);
    setMessage({ type: "success", text: "Profile updated successfully" });
    setTimeout(() => setMessage(null), 4000);
  };

  if (pageLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-sm text-slate-500">Could not load profile.</p>;
  }

  const initials = getInitials(profile.fullName || "U");

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Page Header */}
      <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-md">
          {initials || <User className="h-7 w-7" />}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {profile.fullName || "My Profile"}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
              User
            </span>
            {profile.city && profile.state && (
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                {profile.city}, {profile.state}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {message && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
          message.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-rose-200 bg-rose-50 text-rose-800"
        }`}>
          {message.type === "success"
            ? <CheckCircle2 className="h-4 w-4 shrink-0" />
            : <XCircle className="h-4 w-4 shrink-0" />}
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">

        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={User}>
          <ProfileInput
            label="Full Name"
            required
            icon={User}
            type="text"
            value={profile.fullName || ""}
            onChange={(v) => setProfile({ ...profile, fullName: v })}
            placeholder="Enter your full name"
          />
          <ProfileInput
            label="Email Address"
            required
            icon={Mail}
            type="email"
            value={profile.email || ""}
            onChange={(v) => setProfile({ ...profile, email: v })}
            placeholder="you@email.com"
          />
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact Information" icon={Phone}>
          <ProfileInput
            label="Phone Number"
            icon={Phone}
            type="tel"
            value={profile.phone || ""}
            onChange={(v) => setProfile({ ...profile, phone: v })}
            placeholder="10-digit mobile number"
          />
          <ProfileInput
            label="City"
            icon={MapPin}
            type="text"
            value={profile.city || ""}
            onChange={(v) => setProfile({ ...profile, city: v })}
            placeholder="e.g. Mumbai"
          />
          <ProfileInput
            label="State"
            icon={MapPin}
            type="text"
            value={profile.state || ""}
            onChange={(v) => setProfile({ ...profile, state: v })}
            placeholder="e.g. Maharashtra"
          />
          <ProfileInput
            label="PIN Code"
            icon={Hash}
            type="text"
            value={profile.pincode || ""}
            onChange={(v) => setProfile({ ...profile, pincode: v })}
            placeholder="6-digit PIN code"
          />
        </SectionCard>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
            ) : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Shared sub-components ─────────────────────────────────────────── */

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-slate-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
        </div>
      </div>
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

/**
 * ProfileInput — flexbox-based icon + input.
 * The icon sits in its own flex child (never absolute-positioned),
 * so text CANNOT overlap the icon regardless of padding or Tailwind layer order.
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
