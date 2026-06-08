import { frontendEnv } from "./env";

function normalizeApiUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");

  if (trimmed.endsWith("/api")) {
    return trimmed;
  }

  return `${trimmed}/api`;
}

const API_URL = normalizeApiUrl(frontendEnv.NEXT_PUBLIC_API_URL);

type JsonObject = Record<string, unknown>;

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  token?: string;
  admin?: T;
  product?: T;
  count?: number;
  page?: number;
  pageSize?: number;
  products?: T[];
  stats?: T;
  user?: T;
  users?: T[];
  vendor?: T;
  vendors?: T[];
  lead?: T;
  leads?: T[];
  inquiry?: T;
  history?: T;
  quoteRequest?: T;
  note?: T;
  notes?: T[];
  notifications?: T[];
  unreadCount?: number;
  uploadAsset?: T;
  uploadAssets?: T[];
  consultations?: T[];
  tracking?: T;
}

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "An error occurred",
        };
      }

      return {
        success: true,
        ...data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  },

  auth: {
    async register(email: string, password: string, name: string) {
      return apiClient.request(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
        }
      );
    },

    async login(email: string, password: string) {
      return apiClient.request(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
    },

    async getProfile(token: string) {
      return apiClient.request("/auth/profile", {}, token);
    },

    async updateProfile(token: string, payloadOrName: JsonObject | string, email?: string) {
      const payload = typeof payloadOrName === "string"
        ? { name: payloadOrName, email }
        : payloadOrName;

      return apiClient.request(
        "/auth/profile",
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token
      );
    },

    async changePassword(
      token: string,
      currentPassword: string,
      newPassword: string
    ) {
      return apiClient.request(
        "/auth/change-password",
        {
          method: "POST",
          body: JSON.stringify({ currentPassword, newPassword }),
        },
        token
      );
    },

    async registerUser(fullName: string, email: string, password: string, phone?: string, city?: string, state?: string, pincode?: string) {
      return apiClient.request(
        "/auth/user/register",
        {
          method: "POST",
          body: JSON.stringify({ fullName, email, password, phone, city, state, pincode }),
        }
      );
    },

    async loginUser(email: string, password: string) {
      return apiClient.request(
        "/auth/user/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
    },

    async registerVendor(payload: JsonObject) {
      return apiClient.request(
        "/auth/vendor/register",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    },

    async loginVendor(email: string, password: string) {
      return apiClient.request(
        "/auth/vendor/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
    },

    async listUsers(token: string, params: { search?: string; status?: string; city?: string; state?: string; page?: number; pageSize?: number } = {}) {
      const search = new URLSearchParams();
      if (params.search) search.set("search", params.search);
      if (params.status) search.set("status", params.status);
      if (params.city) search.set("city", params.city);
      if (params.state) search.set("state", params.state);
      if (params.page) search.set("page", String(params.page));
      if (params.pageSize) search.set("pageSize", String(params.pageSize));

      return apiClient.request(`/auth/admin/users?${search.toString()}`, {}, token);
    },
  },

  products: {
    async create(token: string, product: JsonObject) {
      return apiClient.request(
        "/products",
        {
          method: "POST",
          body: JSON.stringify(product),
        },
        token
      );
    },

    async getAll(token: string) {
      return apiClient.request("/products", {}, token);
    },

    async getStats(token: string) {
      return apiClient.request("/products/stats", {}, token);
    },

    async getOne(token: string, id: string) {
      return apiClient.request(`/products/${id}`, {}, token);
    },

    async update(token: string, id: string, product: JsonObject) {
      return apiClient.request(
        `/products/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(product),
        },
        token
      );
    },

    async delete(token: string, id: string) {
      return apiClient.request(
        `/products/${id}`,
        {
          method: "DELETE",
        },
        token
      );
    },
  },

  vendors: {
    async getPublic() {
      return apiClient.request("/vendors");
    },

    async getAdmin(token: string) {
      return apiClient.request("/vendors/admin/all", {}, token);
    },

    async approve(token: string, id: string, note?: string) {
      return apiClient.request(
        `/vendors/${id}/approve`,
        {
          method: "POST",
          body: JSON.stringify({ note }),
        },
        token
      );
    },

    async reject(token: string, id: string, reason?: string) {
      return apiClient.request(
        `/vendors/${id}/reject`,
        {
          method: "POST",
          body: JSON.stringify({ reason }),
        },
        token
      );
    },

    async getMyProfile(token: string) {
      return apiClient.request("/vendors/me/profile", {}, token);
    },

    async updateMyProfile(token: string, payload: JsonObject) {
      return apiClient.request(
        "/vendors/me/profile",
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token
      );
    },
      async getNotes(token: string, id: string) {
        return apiClient.request(`/vendors/${id}/notes`, {}, token);
      },
      async addNote(token: string, id: string, note: string) {
        return apiClient.request(`/vendors/${id}/notes`, { method: "POST", body: JSON.stringify({ note }) }, token);
      },

    async listMyServiceAreas(token: string) {
      return apiClient.request("/vendors/me/service-areas", {}, token);
    },

    async addMyServiceArea(token: string, payload: JsonObject) {
      return apiClient.request(
        "/vendors/me/service-areas",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token
      );
    },

    async updateMyServiceArea(token: string, id: string, payload: JsonObject) {
      return apiClient.request(
        `/vendors/me/service-areas/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        },
        token
      );
    },

    async matchByPincode(params: { pincode?: string; city?: string; state?: string }) {
      const search = new URLSearchParams();
      if (params.pincode) search.set("pincode", params.pincode);
      if (params.city) search.set("city", params.city);
      if (params.state) search.set("state", params.state);
      return apiClient.request(`/vendors/match?${search.toString()}`);
    },
  },

  leads: {
    async submitInquiry(payload: JsonObject) {
      return apiClient.request(
        "/leads/inquiry",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    },

    async submitVendorLead(payload: JsonObject) {
      return apiClient.request(
        "/leads/vendor",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    },

    async requestConsultation(token: string, vendorId: string) {
      return apiClient.request(
        "/leads/consultation",
        {
          method: "POST",
          body: JSON.stringify({ vendorId }),
        },
        token
      );
    },

    async delete(token: string, id: string) {
      return apiClient.request(
        `/leads/${id}`,
        {
          method: "DELETE",
        },
        token
      );
    },

    async getAdmin(token: string) {
      return apiClient.request("/leads/admin", {}, token);
    },

    async updateStatus(token: string, id: string, status: string, note?: string) {
      return apiClient.request(
        `/leads/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status, note }),
        },
        token
      );
    },

    async assign(token: string, id: string, assignedAdminId?: string, note?: string) {
      return apiClient.request(
        `/leads/${id}/assign`,
        {
          method: "PATCH",
          body: JSON.stringify({ assignedAdminId, note }),
        },
        token
      );
    },

    async addCommissionNote(token: string, id: string, note: string, amount?: number) {
      return apiClient.request(
        `/leads/${id}/commission`,
        {
          method: "POST",
          body: JSON.stringify({ note, amount }),
        },
        token
      );
    },

    async getVendorLeads(token: string) {
      return apiClient.request("/leads/vendor/me", {}, token);
    },

    async getUserConsultations(token: string) {
      return apiClient.request("/leads/user/consultations", {}, token);
    },

    async updateConsultationTracker(token: string, id: string, status: string, notes?: string) {
      return apiClient.request(
        `/leads/${id}/tracker`,
        {
          method: "PATCH",
          body: JSON.stringify({ status, notes }),
        },
        token
      );
    },
  },

  calculators: {
    async saveHistory(token: string, calculatorType: string, inputs: JsonObject, outputs: JsonObject) {
      return apiClient.request(
        "/calculators/history",
        {
          method: "POST",
          body: JSON.stringify({ calculatorType, inputs, outputs }),
        },
        token
      );
    },

    async listHistory(token: string) {
      return apiClient.request("/calculators/history", {}, token);
    },
  },

  quotes: {
    async createQuote(payload: JsonObject) {
      return apiClient.request(
        "/quotes/request",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
    },

    async listQuotes(token: string) {
      return apiClient.request("/quotes/admin", {}, token);
    },

    async listVendorQuotes(token: string) {
      return apiClient.request("/quotes/vendor/me", {}, token);
    },

    async listUserQuotes(token: string) {
      return apiClient.request("/quotes/user/me", {}, token);
    },
  },

  notifications: {
    async list(token: string) {
      return apiClient.request("/notifications", {}, token);
    },

    async unreadCount(token: string) {
      return apiClient.request("/notifications/unread-count", {}, token);
    },

    async markRead(token: string, id: string) {
      return apiClient.request(
        `/notifications/${id}/read`,
        {
          method: "PATCH",
        },
        token
      );
    },

    async markAllRead(token: string) {
      return apiClient.request(
        "/notifications/read-all",
        {
          method: "PATCH",
        },
        token
      );
    },
    async delete(token: string, id: string) {
      return apiClient.request(
        `/notifications/${id}`,
        {
          method: "DELETE",
        },
        token
      );
    },
  },

  uploads: {
    async createMetadata(token: string, payload: JsonObject) {
      return apiClient.request(
        "/uploads/metadata",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token
      );
    },

    async uploadFile(token: string, formData: FormData) {
      return fetch(`${API_URL}/uploads/file`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      }).then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        return {
          success: response.ok,
          ...data,
        } as ApiResponse<unknown>;
      });
    },
  },

  authExtras: {
    async requestVerification(email: string, accountType: string) {
      return apiClient.request(
        "/auth/verify-email/request",
        {
          method: "POST",
          body: JSON.stringify({ email, accountType }),
        }
      );
    },

    async confirmVerification(token: string, otp?: string) {
      return apiClient.request(
        "/auth/verify-email/confirm",
        {
          method: "POST",
          body: JSON.stringify(otp ? { token, otp } : { token }),
        }
      );
    },
    async resendVerification(token: string) {
      return apiClient.request(
        "/auth/verify-email/resend",
        {
          method: "POST",
          body: JSON.stringify({ token }),
        }
      );
    },

    async requestPasswordReset(email: string, accountType: string) {
      return apiClient.request(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email, accountType }),
        }
      );
    },

    async resetPassword(token: string, newPassword: string) {
      return apiClient.request(
        "/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({ token, newPassword }),
        }
      );
    },
  },

  dashboard: {
    async getSuperAdminStats(token: string) {
      return apiClient.request("/dashboard/superadmin/stats", {}, token);
    },

    async getVendorStats(token: string) {
      return apiClient.request("/dashboard/vendor/stats", {}, token);
    },

    async getUserStats(token: string) {
      return apiClient.request("/dashboard/user/stats", {}, token);
    },
  },
};
