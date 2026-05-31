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

  // Mounted flag to ensure we only compute and render time-sensitive values on the client after mount.
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    // Initialize time on mount and start ticking every second.
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // If not mounted yet, show safe placeholders to avoid SSR/CSR mismatch.
  const isReady = mounted && now;

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

  const card = (
    <div className="rounded-[28px] bg-[rgba(255,255,255,0.14)] backdrop-blur-[20px] border border-white/20 p-4 shadow-[0_10px_30px_rgba(2,6,23,0.12)] ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(2,6,23,0.14)] sm:p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-600">TIME LEFT TO GET BENEFIT OF SCHEME</p>
          <h3 className="mt-2 text-lg font-extrabold text-slate-900 sm:text-xl">Scheme closes on 31 March 2027</h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">Hurry — apply before the scheme deadline to secure benefits and subsidies.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {values.map((item) => (
            <div key={item.label} className="rounded-2xl bg-[rgba(255,255,255,0.12)] backdrop-blur border border-white/20 px-3 py-3 text-center shadow-[0_6px_18px_rgba(2,6,23,0.08)] ring-1 ring-white/10">
                  <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">{item.label}</div>
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
