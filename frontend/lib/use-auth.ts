"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

type AuthAdmin = {
  id?: string;
  name?: string;
  email?: string;
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(() => typeof window === "undefined");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getToken());
  });
  const [admin, setAdmin] = useState<AuthAdmin | null>(() => {
    if (typeof window === "undefined") return null;
    const adminData = localStorage.getItem("admin");
    return adminData ? (JSON.parse(adminData) as AuthAdmin) : null;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = window.setTimeout(() => {
      const adminData = localStorage.getItem("admin");
      setIsAuthenticated(Boolean(getToken()));
      setAdmin(adminData ? (JSON.parse(adminData) as AuthAdmin) : null);
      setIsLoading(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return { isLoading, isAuthenticated, admin };
};
