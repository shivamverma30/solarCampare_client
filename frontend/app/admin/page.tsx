"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import { apiClient } from "@/lib/api-client";
import { setAdmin, setToken } from "@/lib/auth";
import { useAuth } from "@/lib/use-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading || !isAuthenticated || redirecting) {
      return;
    }

    setRedirecting(true);
    router.replace("/admin/dashboard");
  }, [isLoading, isAuthenticated, redirecting, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await apiClient.auth.login(email, password);

    if (!response.success) {
      setError(response.error || "Invalid email or password");
      setLoading(false);
      return;
    }

    setToken(response.token!);
    setAdmin(response.admin);
    setRedirecting(true);
    router.replace("/admin/dashboard");
  };

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Checking admin session...</p>
        </div>
      </section>
    );
  }

  if (redirecting || isAuthenticated) {
    return (
      <section className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Redirecting to dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_38%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_32px_70px_rgba(15,23,42,0.14)] lg:grid-cols-[1.1fr_1fr]">
        <div className="hidden border-r border-slate-200/80 bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandMark
              href="/"
              compact
              className="items-start"
              titleClassName="text-white"
              taglineClassName="text-amber-200/80"
            />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Admin Access</p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05]">Admin Control Center</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/86">
              Manage premium solar products, monitor dashboard metrics, and control account settings from one secure workspace.
            </p>
          </div>

          <div className="rounded-xl border border-white/14 bg-white/6 p-5 backdrop-blur-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Authorized Access</p>
            <p className="mt-3 text-sm text-white/86">Use your administrator account to continue.</p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              Back to Website
            </Link>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Admin Login</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Sign in to Dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">Enter your credentials to access the admin panel.</p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <form className="mt-7 space-y-5" onSubmit={handleLogin}>
            <label className="block text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@solar.com"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/70"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200/70"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-7 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <p className="font-semibold uppercase tracking-[0.16em]">Demo Credentials</p>
            <p className="mt-2">Email: admin@solar.com</p>
            <p>Password: Admin@123</p>
          </div>
        </div>
      </div>
    </section>
  );
}
