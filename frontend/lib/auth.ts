type StoredProfile = object;

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
};

export const getAdmin = (): StoredProfile | null => {
  if (typeof window === "undefined") return null;
  const admin = localStorage.getItem("admin");
  return admin ? (JSON.parse(admin) as StoredProfile) : null;
};

export const setAdmin = (admin: StoredProfile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin", JSON.stringify(admin));
};

export const setSessionProfile = (profile: StoredProfile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_profile", JSON.stringify(profile));
};

export const getSessionProfile = (): StoredProfile | null => {
  if (typeof window === "undefined") return null;
  const profile = localStorage.getItem("auth_profile");
  return profile ? (JSON.parse(profile) as StoredProfile) : null;
};

export const removeSessionProfile = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_profile");
};

export const removeAdmin = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin");
};

export const logout = (): void => {
  removeToken();
  removeAdmin();
  removeSessionProfile();
};
