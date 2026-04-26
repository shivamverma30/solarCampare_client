"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = ["/hero/1.avif", "/hero/2.jpg", "/hero/3.jpg"];

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
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
      <div className="absolute inset-0 bg-linear-to-b from-black/74 via-black/70 to-black/82" />
    </div>
  );
}
