"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = ["/hero/1.avif", "/hero/2.jpg", "/hero/3.jpg"];

export default function HeroSlider({ background = false }: { background?: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={background ? "absolute inset-0 overflow-hidden" : "relative h-full min-h-105 overflow-hidden rounded-[36px] border border-white/20 bg-slate-950 shadow-[0_24px_70px_rgba(2,6,23,0.24)] ring-1 ring-white/10"}>
      {slides.map((src, index) => {
        const isActive = active === index;

        return (
          <div
            key={src}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isActive ? "scale-110 opacity-100" : "scale-100 opacity-0"
            }`}
          >
            <Image src={src} alt="Solar installation" fill className="object-cover" priority={index === 0} />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18),rgba(2,6,23,0.36),rgba(2,6,23,0.62))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.2),transparent_30%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(2,6,23,0),rgba(2,6,23,0.55))]" />
    </div>
  );
}
