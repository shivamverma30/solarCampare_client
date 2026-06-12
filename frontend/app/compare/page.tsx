"use client";

import { Suspense, useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import DCRComparison from "@/components/dcr-comparison";

type CompareVendor = {
  id: string;
  companyName: string;
  businessType: string;
  experience: number;
  serviceArea?: string | null;
  installationCount: number;
  warrantySupport: boolean;
  certifications?: string[];
};

function ComparePageContent() {
  const { t } = useLocale();
  const [vendors, setVendors] = useState<CompareVendor[]>([]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("solar-compare-vendors");
      if (!stored) {
        setVendors([]);
        return;
      }

      const parsed = JSON.parse(stored) as CompareVendor[];
      setVendors(Array.isArray(parsed) ? parsed.slice(0, 3) : []);
    } catch {
      setVendors([]);
    }
  }, []);

  const rows = [
    { label: "Company Name", render: (vendor: CompareVendor) => vendor.companyName },
    { label: "Business Type", render: (vendor: CompareVendor) => vendor.businessType },
    { label: "Experience", render: (vendor: CompareVendor) => `${vendor.experience} years` },
    { label: "Service Area", render: (vendor: CompareVendor) => vendor.serviceArea || "-" },
    { label: "Installations", render: (vendor: CompareVendor) => String(vendor.installationCount) },
    { label: "Warranty", render: (vendor: CompareVendor) => (vendor.warrantySupport ? "Yes" : "No") },
    { label: "Certifications", render: (vendor: CompareVendor) => (vendor.certifications?.length ? vendor.certifications.join(", ") : "-") },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">{t("compare.eyebrow")}</p>
        <h1 className="mt-3 text-4xl text-slate-900">{t("compare.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          {t("compare.description")}
        </p>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80">
          <div className="border-b border-slate-200 bg-white px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Vendor Comparison</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Selected vendors</h2>
            <p className="mt-2 text-sm text-slate-600">Pick up to 3 vendors from Nearby Vendors to compare their company profile and service depth.</p>
          </div>

          {vendors.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead>
                  <tr>
                    <th className="sticky left-0 bg-slate-50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Field</th>
                    {vendors.map((vendor) => (
                      <th key={vendor.id} className="px-5 py-4 align-top text-sm font-semibold text-slate-950">
                        <div>{vendor.companyName}</div>
                        <div className="mt-1 text-xs font-normal text-slate-500">{vendor.businessType}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-slate-200">
                      <th className="sticky left-0 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">{row.label}</th>
                      {vendors.map((vendor) => (
                        <td key={`${row.label}-${vendor.id}`} className="px-5 py-4 text-sm text-slate-600">
                          {row.render(vendor)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-8 text-sm text-slate-600">No vendors selected yet. Open Nearby Vendors and choose up to 3 vendors to compare here.</div>
          )}
        </div>

        <div className="mt-10">
          <DCRComparison />
        </div>
      </div>
    </section>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <ComparePageContent />
    </Suspense>
  );
}
