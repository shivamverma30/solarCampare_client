"use client";

import { useEffect, useState } from "react";
import { AUTH_CHANGE_EVENT, getAdmin, getSessionProfile, getSessionRole, getToken, getUser, getVendor, type AuthRole } from "@/lib/auth";

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

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  admin: AuthAdmin | null;
  profile: AuthProfile | null;
  role: AuthRole | null;
};

const loadingState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  admin: null,
  profile: null,
  role: null,
};

const readAuthState = (): AuthState => {
  const isAuthenticated = Boolean(getToken());
  const role = getSessionRole();

  if (role === "SUPERADMIN" || role === "ADMIN") {
    const adminProfile = (getAdmin() || getSessionProfile()) as AuthProfile | null;
    return {
      isLoading: false,
      isAuthenticated,
      admin: adminProfile as AuthAdmin | null,
      profile: adminProfile,
      role,
    };
  }

  if (role === "USER") {
    const userProfile = (getUser() || getSessionProfile()) as AuthProfile | null;
    return {
      isLoading: false,
      isAuthenticated,
      admin: null,
      profile: userProfile,
      role,
    };
  }

  if (role === "VENDOR") {
    const vendorProfile = (getVendor() || getSessionProfile()) as AuthProfile | null;
    return {
      isLoading: false,
      isAuthenticated,
      admin: null,
      profile: vendorProfile,
      role,
    };
  }

  const adminProfile = getAdmin() as AuthAdmin | null;
  const profile = (getSessionProfile() || adminProfile) as AuthProfile | null;

  return {
    isLoading: false,
    isAuthenticated,
    admin: adminProfile,
    profile,
    role,
  };
};

export const useAuth = () => {
  const [snapshot, setSnapshot] = useState<AuthState>(loadingState);

  useEffect(() => {
    const updateSnapshot = () => setSnapshot(readAuthState());

    updateSnapshot();
    window.addEventListener(AUTH_CHANGE_EVENT, updateSnapshot);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, updateSnapshot);
    };
  }, []);

  return snapshot;
};
