"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      const adminData = localStorage.getItem("admin");
      if (adminData) {
        setAdmin(JSON.parse(adminData));
      }
    }
    setIsLoading(false);
  }, []);

  return { isLoading, isAuthenticated, admin };
};
