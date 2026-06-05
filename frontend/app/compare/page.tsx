"use client";

import { useEffect, useMemo, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";
import { panelData } from "@/data/site";
import { useLocale } from "@/components/locale-provider";
import DCRComparison from "@/components/dcr-comparison";

type PublicVendor = {
  id: string;
  companyName: string;
  ownerName: string;
  serviceArea: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  businessType: string;
  experience: number;
  services: string[];
  certifications: string[];
  installationCount: number;
  warrantySupport: boolean;
  responseTimeHours?: number | null;
  serviceAreas?: Array<{ city?: string | null; state?: string | null; pincode: string; isPrimary: boolean }>;
};

export default function ComparePage() {
  const { t } = useLocale();
  const [vendors, setVendors] = useState<PublicVendor[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      const response = await apiClient.vendors.getPublic();
      if (response.success && Array.isArray(response.vendors)) {
        setVendors(response.vendors as PublicVendor[]);
      }
    };

    void run();
  }, []);

  const selectedVendors = useMemo(
    () => vendors.filter((vendor) => selectedVendorIds.includes(vendor.id)).slice(0, 3),
    [selectedVendorIds, vendors]
  );

  const toggleVendor = (vendorId: string) => {
    setSelectedVendorIds((current) => {
      if (current.includes(vendorId)) {
        return current.filter((id) => id !== vendorId);
      }

      if (current.length >= 3) {
        return [current[1], current[2], vendorId].filter(Boolean) as string[];
      }

      return [...current, vendorId];
    });
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">{t("compare.eyebrow")}</p>
        <h1 className="mt-3 text-4xl text-slate-900">{t("compare.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          {t("compare.description")}
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100/90 text-slate-700">
              <tr>
                <th className="px-4 py-3">{t("compare.brand")}</th>
                <th className="px-4 py-3">{t("compare.wattage")}</th>
                <th className="px-4 py-3">{t("compare.efficiency")}</th>
                <th className="px-4 py-3">{t("compare.warranty")}</th>
                <th className="px-4 py-3">{t("compare.panelType")}</th>
                <th className="px-4 py-3">{t("compare.priceRange")}</th>
              </tr>
            </thead>
            <tbody>
              {panelData.map((panel) => (
                <tr key={panel.brand} className="border-t border-slate-200 bg-white/80">
                  <td className="px-4 py-3 font-semibold text-slate-900">{panel.brand}</td>
                  <td className="px-4 py-3 text-slate-700">{panel.wattage}</td>
                  <td className="px-4 py-3 text-slate-700">{panel.efficiency}</td>
                  <td className="px-4 py-3 text-slate-700">{panel.warranty}</td>
                  <td className="px-4 py-3 text-slate-700">{panel.panelType}</td>
                  <td className="px-4 py-3 text-slate-700">{panel.priceRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 md:p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Vendor comparison</p>
              <h2 className="mt-2 text-2xl text-slate-950">Select vendors to compare</h2>
            </div>
            <p className="text-sm text-slate-600">Up to 3 public vendors. Contact details stay hidden.</p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {vendors.map((vendor) => {
              const active = selectedVendorIds.includes(vendor.id);

              return (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => toggleVendor(vendor.id)}
                  className={`rounded-2xl border p-4 text-left transition ${active ? "border-amber-300 bg-white shadow-sm" : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950">{vendor.companyName}</p>
                      <p className="mt-1 text-sm text-slate-600">{vendor.ownerName}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${active ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                      {active ? "Selected" : "Compare"}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <p>{vendor.businessType}</p>
                    <p>{vendor.experience} years experience</p>
                    <p>{vendor.services.slice(0, 3).join(", ") || "Services not listed"}</p>
                    <p>{vendor.city || "-"}, {vendor.state || "-"}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedVendors.length ? (
            <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100/90 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Metric</th>
                    {selectedVendors.map((vendor) => (
                      <th key={vendor.id} className="px-4 py-3">{vendor.companyName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Experience", (vendor: PublicVendor) => `${vendor.experience} years`],
                    ["Services", (vendor: PublicVendor) => vendor.services.join(", ") || "-"],
                    ["Certifications", (vendor: PublicVendor) => vendor.certifications.join(", ") || "-"],
                    ["Installation Count", (vendor: PublicVendor) => String(vendor.installationCount || 0)],
                    ["Cities Served", (vendor: PublicVendor) => Array.from(new Set((vendor.serviceAreas || []).map((serviceArea) => serviceArea.city).filter(Boolean))).join(", ") || vendor.city || "-"],
                    ["Warranty Support", (vendor: PublicVendor) => (vendor.warrantySupport ? "Yes" : "No")],
                    ["Response Time", (vendor: PublicVendor) => vendor.responseTimeHours ? `${vendor.responseTimeHours} hrs` : "-"],
                  ].map(([label, formatter]) => (
                    <tr key={label as string} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-semibold text-slate-700">{label as string}</td>
                      {selectedVendors.map((vendor) => (
                        <td key={`${vendor.id}-${label as string}`} className="px-4 py-3 text-slate-600">
                          {(formatter as (vendor: PublicVendor) => string)(vendor)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-sm text-slate-600">
              Pick up to three vendors to see the comparison table.
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {panelData.map((panel) => (
            <article
              key={`${panel.brand}-card`}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <h2 className="text-xl text-slate-900">{panel.brand}</h2>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold">{t("compare.wattage")}:</span> {panel.wattage}
                </p>
                <p>
                  <span className="font-semibold">{t("compare.efficiency")}:</span> {panel.efficiency}
                </p>
                <p>
                  <span className="font-semibold">{t("compare.warranty")}:</span> {panel.warranty}
                </p>
                <p>
                  <span className="font-semibold">{t("compare.type")}:</span> {panel.panelType}
                </p>
                <p>
                  <span className="font-semibold">{t("compare.price")}:</span> {panel.priceRange}
                </p>
              </div>
            </article>
          ))}
        </div>

        <DCRComparison />
      </div>
    </section>
  );
}
