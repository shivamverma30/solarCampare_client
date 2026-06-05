export type StoredProfile = Record<string, unknown>;
export type AuthRole = "SUPERADMIN" | "ADMIN" | "USER" | "VENDOR";
export const AUTH_CHANGE_EVENT = "solar-auth-change";

const emitAuthChange = (): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

const readStoredJson = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
  emitAuthChange();
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  emitAuthChange();
};

export const getAdmin = (): StoredProfile | null => {
  return readStoredJson<StoredProfile>("admin");
};

export const setAdmin = (admin: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin", JSON.stringify(admin));
  emitAuthChange();
};

export const setSessionProfile = (profile: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_profile", JSON.stringify(profile));
  emitAuthChange();
};

export const setSessionRole = (role: AuthRole): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_role", role);
  emitAuthChange();
};

export const setAdminSession = (payload: { token: string; admin: unknown }): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem("auth_token", payload.token);
  localStorage.setItem("admin", JSON.stringify(payload.admin));
  localStorage.setItem("auth_profile", JSON.stringify(payload.admin));
  localStorage.setItem("auth_role", "SUPERADMIN");
  emitAuthChange();
};

export const getSessionRole = (): AuthRole | null => {
  if (typeof window === "undefined") return null;
  const role = localStorage.getItem("auth_role");
  if (!role) return null;
  return role as AuthRole;
};

export const getSessionProfile = (): StoredProfile | null => {
  return readStoredJson<StoredProfile>("auth_profile");
};

export const removeSessionProfile = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_profile");
  localStorage.removeItem("auth_role");
  emitAuthChange();
};

export const removeAdmin = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin");
  emitAuthChange();
};

export const setUser = (user: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
  emitAuthChange();
};

export const getUser = (): StoredProfile | null => {
  return readStoredJson<StoredProfile>("user");
};

export const removeUser = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  emitAuthChange();
};

export const setVendor = (vendor: unknown): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("vendor", JSON.stringify(vendor));
  emitAuthChange();
};

export const getVendor = (): StoredProfile | null => {
  return readStoredJson<StoredProfile>("vendor");
};

export const removeVendor = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("vendor");
  emitAuthChange();
};

export const logout = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth_token");
  localStorage.removeItem("admin");
  localStorage.removeItem("user");
  localStorage.removeItem("vendor");
  localStorage.removeItem("auth_profile");
  localStorage.removeItem("auth_role");
  emitAuthChange();
};
