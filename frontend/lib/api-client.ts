const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  token?: string;
  admin?: T;
  product?: T;
  count?: number;
  products?: T[];
  stats?: T;
}

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const headers: any = {
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

    async updateProfile(token: string, name: string, email: string) {
      return apiClient.request(
        "/auth/profile",
        {
          method: "PUT",
          body: JSON.stringify({ name, email }),
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
  },

  products: {
    async create(token: string, product: any) {
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

    async update(token: string, id: string, product: any) {
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
};
