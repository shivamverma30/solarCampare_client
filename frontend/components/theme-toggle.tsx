"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return savedTheme ? savedTheme === "dark" : prefersDark;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const onToggle = () => {
    setIsDark((prev) => !prev);
  };

  const buttonClassName =
    "h-10 w-10 rounded-full border border-white/30 bg-white/10 text-sm text-white shadow-lg backdrop-blur transition hover:scale-105 dark:border-white/20 dark:bg-black/30";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        disabled
        className={buttonClassName}
      >
        •
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className={buttonClassName}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
