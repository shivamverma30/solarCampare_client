"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { getToken } from "@/lib/auth";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  recentActivity: any[];
}

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      const token = getToken();
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await apiClient.products.getStats(token);

      if (!response.success) {
        setError(response.error || "Failed to fetch stats");
      } else {
        setStats(response.stats as DashboardStats);
      }

      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: "📦",
      color: "amber",
    },
    {
      title: "Categories",
      value: stats?.totalCategories || 0,
      icon: "📂",
      color: "blue",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Welcome back! Here's an overview of your admin portal.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm"
            >
              <div className="h-4 w-24 rounded bg-slate-300"></div>
              <div className="mt-4 h-8 w-16 rounded bg-slate-300"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {card.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>
                <span className="text-3xl">{card.icon}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-2xl font-serif font-bold text-slate-900">
          Quick Actions
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/products"
            className="rounded-xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-amber-300"
          >
            <span className="text-3xl">📦</span>
            <h3 className="mt-3 font-semibold text-slate-900">
              Manage Products
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              View, add, or edit products
            </p>
          </Link>

          <Link
            href="/admin/profile"
            className="rounded-xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-amber-300"
          >
            <span className="text-3xl">👤</span>
            <h3 className="mt-3 font-semibold text-slate-900">
              Profile
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Update your profile information
            </p>
          </Link>

          <Link
            href="/admin/change-password"
            className="rounded-xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-amber-300"
          >
            <span className="text-3xl">🔐</span>
            <h3 className="mt-3 font-semibold text-slate-900">
              Security
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Change your password
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            Recent Products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm font-semibold text-amber-700 hover:text-amber-600"
          >
            View All →
          </Link>
        </div>

        {!stats?.recentActivity || stats.recentActivity.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white/85 p-8 text-center shadow-sm">
            <p className="text-slate-600">
              No products yet. <Link href="/admin/products" className="font-semibold text-amber-600">Create one</Link>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentActivity.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {product.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {product.brand} • {product.wattage}W
                  </p>
                </div>
                <span className="text-xs font-semibold text-amber-700">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
