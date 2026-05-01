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

export const getAdmin = () => {
  if (typeof window === "undefined") return null;
  const admin = localStorage.getItem("admin");
  return admin ? JSON.parse(admin) : null;
};

export const setAdmin = (admin: any): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("admin", JSON.stringify(admin));
};

export const removeAdmin = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("admin");
};

export const logout = (): void => {
  removeToken();
  removeAdmin();
};
