"use client";

import { useEffect, useState } from "react";

function format(n: number) {
  return String(n).padStart(2, "0");
}

export default function Countdown({
  target = new Date("2027-03-31T23:59:59Z"),
  variant = "section",
}: {
  target?: Date | string;
  variant?: "section" | "hero";
}) {
  const targetDate = typeof target === "string" ? new Date(target) : target;

  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const isReady = now !== null;

  let days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0;

  if (isReady) {
    const diff = Math.max(0, targetDate.getTime() - (now as Date).getTime());
    const secs = Math.floor(diff / 1000);
    days = Math.floor(secs / (3600 * 24));
    hours = Math.floor((secs % (3600 * 24)) / 3600);
    minutes = Math.floor((secs % 3600) / 60);
    seconds = secs % 60;
  }

  const values = [
    { label: "Days", value: isReady ? String(days) : "00" },
    { label: "Hours", value: isReady ? format(hours) : "00" },
    { label: "Minutes", value: isReady ? format(minutes) : "00" },
    { label: "Seconds", value: isReady ? format(seconds) : "00" },
  ];

  const isHero = variant === "hero";

  const card = (
    <div
      className={`rounded-[28px] border border-emerald-200/30 bg-[rgba(6,23,16,0.46)] ${isHero ? "p-3 w-80" : "p-4 sm:p-5"} shadow-[0_18px_40px_rgba(2,6,23,0.28)] ring-1 ring-white/10 backdrop-blur-[22px] transition duration-300 ${
        isHero ? "hover:translate-y-0" : "hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(2,6,23,0.3)]"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div>
          <p className={`text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200 ${isHero ? "text-[10px]" : ""}`}>Upcoming Solar Subsidy Update</p>
          <h3 className={`mt-1 font-extrabold text-white ${isHero ? "text-lg" : "text-xl sm:text-2xl"}`}>Time left to review the next subsidy window</h3>
          <p className={`mt-1 text-sm leading-5 text-emerald-50/84 ${isHero ? "text-xs leading-4" : "leading-6"}`}>Track the deadline and plan your proposal before the update closes.</p>
        </div>

        <div className={`grid ${isHero ? "grid-cols-2 gap-3" : "grid-cols-2 gap-3 sm:grid-cols-4"}`}>
          {values.map((item) => (
            <div key={item.label} className={`rounded-2xl border border-white/14 bg-white/8 px-4 ${isHero ? "py-2" : "py-3"} text-center shadow-[0_6px_18px_rgba(2,6,23,0.12)] ring-1 ring-white/10 backdrop-blur`}>
              <div className={`font-extrabold text-white ${isHero ? "text-2xl" : "text-3xl"}`}>{item.value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/78">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (variant === "hero") return card;

  return (
    <section aria-labelledby="countdown-heading" className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
      {card}
    </section>
  );
}
