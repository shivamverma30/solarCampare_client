"use client";

import { useLocale } from "@/components/locale-provider";
import { useRef, useState } from "react";

interface Panel {
  id: string;
  x: number;
  y: number;
  type: string;
}

export default function RooftopVisualizer() {
  const { t } = useLocale();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [orientation, setOrientation] = useState("landscape");
  const [panelType, setPanelType] = useState("mono");
  const [draggingPanel, setDraggingPanel] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const addPanel = () => {
    const newPanel: Panel = {
      id: `panel-${Date.now()}`,
      x: Math.random() * 200,
      y: Math.random() * 100,
      type: panelType,
    };
    setPanels([...panels, newPanel]);
  };

  const clearPanels = () => {
    setPanels([]);
  };

  const handlePanelMouseDown = (e: React.MouseEvent, panelId: string) => {
    e.preventDefault();
    const panel = panels.find((p) => p.id === panelId);
    if (panel && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDraggingPanel(panelId);
      setDragOffset({
        x: e.clientX - rect.left - panel.x,
        y: e.clientY - rect.top - panel.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingPanel || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 80));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 45));

    setPanels((prev) =>
      prev.map((p) => (p.id === draggingPanel ? { ...p, x, y } : p))
    );
  };

  const handleMouseUp = () => {
    setDraggingPanel(null);
  };

  const systemKw = panels.length * 0.4;
  const monthlyGeneration = Math.round(systemKw * 120);
  const monthlySavings = monthlyGeneration * 7;

  const panelColors: Record<string, string> = {
    mono: "bg-blue-400",
    bifacial: "bg-emerald-400",
    poly: "bg-purple-400",
  };

  const panelBorders: Record<string, string> = {
    mono: "border-blue-500",
    bifacial: "border-emerald-500",
    poly: "border-purple-500",
  };

  return (
    <section id="visualizer" className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          {t("visualizer.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          {t("visualizer.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          {t("visualizer.description")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Upload and Controls */}
        <div>
          {/* Upload Zone */}
          <div className="mb-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-amber-400 hover:bg-amber-50">
            <p className="text-2xl">📸</p>
            <p className="mt-2 font-semibold text-slate-900">
              {t("visualizer.uploadTitle")}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {t("visualizer.uploadHint")}
              <br />
              {t("visualizer.uploadHintSmall")}
            </p>
          </div>

          {/* Control Cards */}
          <div className="space-y-3">
            {/* Orientation */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {t("visualizer.panelOrientation")}
              </p>
              <div className="mt-3 flex gap-2">
                {[
                  { value: "landscape", label: t("visualizer.landscape") },
                  { value: "portrait", label: t("visualizer.portrait") },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setOrientation(opt.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      orientation === opt.value
                        ? "bg-amber-400 text-black"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Type */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {t("visualizer.panelType")}
              </p>
              <div className="mt-3 flex gap-2">
                {[
                  { value: "mono", label: t("visualizer.mono") },
                  { value: "bifacial", label: t("visualizer.bifacial") },
                  { value: "poly", label: t("visualizer.poly") },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPanelType(opt.value)}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      panelType === opt.value
                        ? "bg-amber-400 text-black"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Count */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                {t("visualizer.panelCount")}
              </p>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-amber-50 p-2">
                <span className="text-xs text-slate-600">
                  {t("visualizer.panelsPlaced")}
                </span>
                <span className="font-serif text-xl font-bold text-amber-600">
                  {panels.length}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={addPanel}
                  className="flex-1 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                >
                  + {t("visualizer.addPanel")}
                </button>
                <button
                  onClick={clearPanels}
                  className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                >
                  {t("visualizer.clearAll")}
                </button>
              </div>
            </div>

            {/* Estimated Output */}
            {panels.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                  {t("visualizer.estimatedOutput")}
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">
                      {t("visualizer.systemCapacity")}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {systemKw.toFixed(1)} kW
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">
                      {t("visualizer.monthlyGeneration")}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {monthlyGeneration} units
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">
                      {t("visualizer.monthlySavings")}
                    </span>
                    <span className="font-semibold text-emerald-600">
                      ₹{monthlySavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Canvas */}
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-md">
            {/* Header */}
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">
                {t("visualizer.rooftopPreview")}
              </p>
              <p className="text-xs text-slate-500">
                {t("visualizer.dragPanels")}
              </p>
            </div>

            {/* Canvas Area */}
            <div
              ref={canvasRef}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative h-80 bg-linear-to-br from-blue-100 to-slate-100 cursor-move overflow-hidden"
            >
              {/* Roof SVG */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 300"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Ground */}
                <rect x="0" y="230" width="400" height="70" fill="#e2e8f0" opacity="0.5" />

                {/* House */}
                <rect x="80" y="140" width="240" height="100" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.5" />

                {/* Roof */}
                <polygon
                  points="60,145 200,60 340,145"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                />

                {/* Door */}
                <rect x="170" y="190" width="60" height="50" rx="3" fill="#d1d5db" stroke="#9ca3af" strokeWidth="1" />

                {/* Windows */}
                <rect x="100" y="155" width="50" height="40" rx="2" fill="#bfdbfe" stroke="#0284c7" strokeWidth="1" />
                <rect x="250" y="155" width="50" height="40" rx="2" fill="#bfdbfe" stroke="#0284c7" strokeWidth="1" />
              </svg>

              {/* Panels */}
              <div className="absolute inset-0">
                {panels.map((panel) => {
                  const isLandscape = orientation === "landscape";
                  return (
                    <div
                      key={panel.id}
                      onMouseDown={(e) => handlePanelMouseDown(e, panel.id)}
                      style={{
                        left: `${(panel.x / 400) * 100}%`,
                        top: `${(panel.y / 300) * 100}%`,
                      }}
                      className={`absolute w-16 h-10 ${panelColors[panel.type] || "bg-blue-400"} border-2 ${panelBorders[panel.type] || "border-blue-500"} rounded cursor-grab active:cursor-grabbing flex items-center justify-center text-lg font-bold text-white shadow-lg transition ${
                        draggingPanel === panel.id ? "opacity-90 scale-110" : ""
                      }`}
                    >
                      ☀️
                    </div>
                  );
                })}
              </div>

              {/* Hint */}
              {panels.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-slate-500 text-center px-4">
                    {t("visualizer.uploadRoof")}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
              💡 Upload your roof photo for real visualization
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
