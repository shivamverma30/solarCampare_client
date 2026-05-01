import { panelData } from "@/data/site";

export default function ComparePage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 md:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">Panel Comparison</p>
        <h1 className="mt-3 text-4xl text-slate-900">Compare Top Solar Panel Brands</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          Evaluate key technical and commercial factors side-by-side to pick the best panel for your usage and budget.
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100/90 text-slate-700">
              <tr>
                <th className="px-4 py-3">Brand</th>
                <th className="px-4 py-3">Wattage</th>
                <th className="px-4 py-3">Efficiency</th>
                <th className="px-4 py-3">Warranty</th>
                <th className="px-4 py-3">Panel Type</th>
                <th className="px-4 py-3">Price Range</th>
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
                  <span className="font-semibold">Wattage:</span> {panel.wattage}
                </p>
                <p>
                  <span className="font-semibold">Efficiency:</span> {panel.efficiency}
                </p>
                <p>
                  <span className="font-semibold">Warranty:</span> {panel.warranty}
                </p>
                <p>
                  <span className="font-semibold">Type:</span> {panel.panelType}
                </p>
                <p>
                  <span className="font-semibold">Price:</span> {panel.priceRange}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
