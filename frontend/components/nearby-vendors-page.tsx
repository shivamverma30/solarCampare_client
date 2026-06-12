"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Sparkles, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

type NearbyVendor = {
  id: string;
  companyName: string;
  ownerName: string;
  businessType: string;
  experience: number;
  services: string[];
  certifications?: string[];
  installationCount: number;
  warrantySupport: boolean;
  responseTimeHours?: number | null;
  serviceArea?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  matchScore?: number;
};

type DashboardStats = {
  user: { fullName: string; pincode?: string | null; city?: string | null; state?: string | null };
  nearbyVendors: NearbyVendor[];
};

type MatchResponse = {
  vendors?: NearbyVendor[];
};

export default function NearbyVendorsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vendors, setVendors] = useState<NearbyVendor[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCompareVendors, setSelectedCompareVendors] = useState<NearbyVendor[]>([]);
  const [compareSelectionReady, setCompareSelectionReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("solar-compare-vendors");
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as NearbyVendor[];
      setSelectedCompareVendors(Array.isArray(parsed) ? parsed.slice(0, 3) : []);
    } catch {
      setSelectedCompareVendors([]);
    }

    setCompareSelectionReady(true);
  }, []);

  useEffect(() => {
    if (!compareSelectionReady) {
      return;
    }

    window.localStorage.setItem("solar-compare-vendors", JSON.stringify(selectedCompareVendors));
  }, [compareSelectionReady, selectedCompareVendors]);

  useEffect(() => {
    const run = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await apiClient.dashboard.getUserStats(token);
      if (response.success) {
        const payload = response.stats as DashboardStats;
        setStats(payload);
        setVendors(payload.nearbyVendors || []);

      } else {
        setMessage(response.error || "Failed to load nearby vendors");
      }

      setLoading(false);
    };

    void run();
  }, []);

  const filteredVendors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return vendors;
    }

    return vendors.filter((vendor) => {
      const haystack = [
        vendor.companyName,
        vendor.ownerName,
        vendor.businessType,
        vendor.serviceArea,
        vendor.city,
        vendor.state,
        vendor.pincode,
        vendor.services.join(" "),
        (vendor.certifications || []).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, vendors]);

  const openComparePage = () => {
    if (!selectedCompareVendors.length) {
      setMessage("Select up to 3 vendors to compare.");
      return;
    }

    router.push("/compare");
  };

  const toggleCompareVendor = (vendor: NearbyVendor) => {
    setSelectedCompareVendors((current) => {
      const exists = current.some((item) => item.id === vendor.id);

      if (exists) {
        return current.filter((item) => item.id !== vendor.id);
      }

      if (current.length >= 3) {
        setMessage("You can compare up to 3 vendors at a time.");
        return current;
      }

      return [...current, vendor];
    });
  };

  const requestConsultation = async (vendor: NearbyVendor) => {
    const token = getToken();
    if (!token) {
      setMessage("Please sign in to request a consultation.");
      return;
    }

    setSearching(true);
    try {
      const response = await apiClient.leads.requestConsultation(token, vendor.id);

      if (!response.success) {
        setMessage(response.error || "Could not send consultation request.");
        return;
      }

      setMessage(`Consultation request sent to ${vendor.companyName}.`);
    } catch {
      setMessage("Could not send consultation request.");
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    setMessage(query.trim() ? `Filtering results for ${query.trim()}.` : "Showing all approved vendors.");
    window.setTimeout(() => setSearching(false), 0);
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
              <MapPin className="h-3.5 w-3.5" />
              Nearby Vendors
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Find the right approved vendor without exposing private contact data.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              Search by vendor name, business type, or location. Results are ranked by pincode and proximity, while direct contact details stay hidden until you make a consultation request.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-90">
            <MetricCard label="Visible vendors" value={String(filteredVendors.length)} tone="cyan" />
            <MetricCard label="Saved profile" value={stats?.user.pincode || "Location"} tone="amber" />
            <MetricCard label="Privacy" value="Protected" tone="emerald" />
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_auto]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by vendor name, service, city, state, or pincode"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={() => void handleSearch()}
            disabled={searching || loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Sparkles className="h-4 w-4" />
            {searching ? "Searching..." : "Filter vendors"}
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Compare up to 3 approved vendors, or request consultation directly from a vendor card.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openComparePage}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
            >
              Compare selected ({selectedCompareVendors.length})
            </button>
            {selectedCompareVendors.length ? (
              <button
                type="button"
                onClick={() => setSelectedCompareVendors([])}
                className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
              >
                Clear selection
              </button>
            ) : null}
          </div>
        </div>

        {message ? <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</div> : null}
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ranked results</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Approved vendors matched to your location</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <ShieldAlert className="h-3.5 w-3.5" />
            Contact details hidden
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
              ))}
            </div>
          ) : filteredVendors.length ? (
            filteredVendors.map((vendor, index) => (
              <article key={vendor.id} className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 md:p-5 ${index === 0 ? "ring-1 ring-cyan-200/70" : ""}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">{vendor.companyName}</h3>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Match {vendor.matchScore ?? 0}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{vendor.businessType} • {vendor.experience} years • {vendor.ownerName}</p>
                    <p className="mt-2 text-sm text-slate-500">{[vendor.city, vendor.state, vendor.pincode].filter(Boolean).join(", ") || "Location not listed"}</p>
                    <p className="mt-2 text-xs text-slate-500">{vendor.services.slice(0, 4).join(", ") || "Services not listed"}</p>
                  </div>

                  <div className="space-y-3 lg:min-w-90">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <DetailPill label="Installations" value={String(vendor.installationCount)} />
                      <DetailPill label="Warranty" value={vendor.warrantySupport ? "Yes" : "No"} />
                      <DetailPill label="Response" value={vendor.responseTimeHours ? `${vendor.responseTimeHours} hrs` : "-"} />
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => toggleCompareVendor(vendor)}
                        className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          selectedCompareVendors.some((item) => item.id === vendor.id)
                            ? "border-cyan-300 bg-cyan-50 text-cyan-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:text-cyan-800"
                        }`}
                      >
                        {selectedCompareVendors.some((item) => item.id === vendor.id) ? "Selected for compare" : "Compare vendor"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void requestConsultation(vendor)}
                        disabled={searching}
                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Request consultation
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-600">
              No vendors matched that filter. Try a nearby pincode or a broader search term.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "emerald" }) {
  const tones = {
    cyan: "from-cyan-50 to-white text-cyan-900 border-cyan-100",
    amber: "from-amber-50 to-white text-amber-900 border-amber-100",
    emerald: "from-emerald-50 to-white text-emerald-900 border-emerald-100",
  };

  return (
    <div className={`rounded-[22px] border bg-linear-to-br p-4 shadow-sm ${tones[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}

function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
