"use client";

import { useLocale } from "@/components/locale-provider";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";

type SolarTypeContent = {
  badge: string;
  title: string;
  description: string;
  pros: string[];
};

type SolarTypesSection = {
  eyebrow: string;
  title: string;
  description: string;
  onGrid: SolarTypeContent;
  offGrid: SolarTypeContent;
  hybrid: SolarTypeContent;
};

type LocaleContent = {
  solarTypes: SolarTypesSection;
};

export default function SolarTypes() {
  const { locale, t } = useLocale();
  const localeContent = (locale === "hi" ? hi : en) as unknown as LocaleContent;
  const solarTypes = localeContent.solarTypes;

  const types = [
    {
      key: "onGrid",
      icon: "☀️",
      color: "amber",
    },
    {
      key: "offGrid",
      icon: "🔋",
      color: "emerald",
    },
    {
      key: "hybrid",
      icon: "⚡",
      color: "blue",
    },
  ];

  return (
    <section id="solar-types" className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500">
          {t("solarTypes.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">
          {t("solarTypes.title")}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
          {t("solarTypes.description")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {types.map((type) => {
          const typeData = solarTypes[type.key as keyof Pick<SolarTypesSection, "onGrid" | "offGrid" | "hybrid">];
          const pros = typeData.pros || [];

          return (
            <article
              key={type.key}
              className="group rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{type.icon}</span>
              </div>

              <p className="mb-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
                {typeData.badge}
              </p>

              <h3 className="mt-3 text-xl font-semibold text-slate-900">
                {typeData.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {typeData.description}
              </p>

              <ul className="mt-4 space-y-2">
                {Array.isArray(pros) &&
                  pros.map((pro: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        ✓
                      </span>
                      <span>{pro}</span>
                    </li>
                  ))}
              </ul>
            </article>
          );
        })}
      </div>

      {/* Panel Types Info */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">
            Panel Types Available
          </p>
          <div className="mt-4 space-y-2">
            {[
              { name: "Monocrystalline", eff: "22–24% efficiency" },
              { name: "Polycrystalline", eff: "15–17% efficiency" },
              { name: "Bifacial", eff: "20–25% efficiency" },
              { name: "Thin Film", eff: "10–13% efficiency" },
            ].map((panel) => (
              <div
                key={panel.name}
                className="flex justify-between rounded-lg bg-slate-50 p-2 text-sm"
              >
                <span className="text-slate-600">{panel.name}</span>
                <span className="font-semibold text-amber-600">{panel.eff}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">
            Inverter Types
          </p>
          <div className="mt-4 space-y-2">
            {[
              "String Inverter — most common",
              "Microinverter — per-panel control",
              "Hybrid Inverter — battery ready",
              "MPPT Charge Controller",
            ].map((inverter) => (
              <p
                key={inverter}
                className="rounded-lg bg-slate-50 p-2 text-sm text-slate-600"
              >
                {inverter}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-600">
            Installation Types
          </p>
          <div className="mt-4 space-y-2">
            {[
              "Rooftop — residential & commercial",
              "Ground Mounted — large capacity",
              "Floating Solar — water bodies",
              "BIPV — building integrated",
            ].map((install) => (
              <p
                key={install}
                className="rounded-lg bg-slate-50 p-2 text-sm text-slate-600"
              >
                {install}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
