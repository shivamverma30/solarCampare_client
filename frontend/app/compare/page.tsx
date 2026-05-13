"use client";

import { panelData } from "@/data/site";
import { useLocale } from "@/components/locale-provider";

export default function ComparePage() {
  const { t } = useLocale();

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
      </div>
    </section>
  );
}
