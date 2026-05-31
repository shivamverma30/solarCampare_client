"use client";

import { useEffect, useState } from "react";
import { getAdmin, getSessionProfile, getSessionRole, getToken, getUser, getVendor, type AuthRole } from "@/lib/auth";

type AuthAdmin = {
  id?: string;
  name?: string;
  email?: string;
};

type AuthProfile = {
  id?: string;
  name?: string;
  fullName?: string;
  ownerName?: string;
  companyName?: string;
  email?: string;
  status?: string;
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<AuthAdmin | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [role, setRole] = useState<AuthRole | null>(null);

  useEffect(() => {
    setIsAuthenticated(Boolean(getToken()));

    const detectedRole = getSessionRole();
    setRole(detectedRole);

    if (detectedRole === "SUPERADMIN" || detectedRole === "ADMIN") {
      const adminProfile = (getAdmin() || getSessionProfile()) as AuthProfile | null;
      setAdmin(adminProfile as AuthAdmin | null);
      setProfile(adminProfile);
    } else if (detectedRole === "USER") {
      const userProfile = (getUser() || getSessionProfile()) as AuthProfile | null;
      setAdmin(null);
      setProfile(userProfile);
    } else if (detectedRole === "VENDOR") {
      const vendorProfile = (getVendor() || getSessionProfile()) as AuthProfile | null;
      setAdmin(null);
      setProfile(vendorProfile);
    } else {
      setAdmin(getAdmin() as AuthAdmin | null);
      setProfile((getSessionProfile() || getAdmin()) as AuthProfile | null);
    }

    setIsLoading(false);
  }, []);

  return { isLoading, isAuthenticated, admin, profile, role };
};
