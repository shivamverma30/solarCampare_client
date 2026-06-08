"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { apiClient } from "@/lib/api-client";
import { setSessionProfile, setSessionRole, setToken, setUser, setVendor } from "@/lib/auth";

type LoginRole = "user" | "vendor";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [role, setRole] = useState<LoginRole>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectPath = searchParams.get("redirect");
  const signupHref = redirectPath ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : "/signup";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = role === "vendor"
      ? await apiClient.auth.loginVendor(email, password)
      : await apiClient.auth.loginUser(email, password);

    if (!response.success) {
      setError(response.error || "Unable to sign in");
      setLoading(false);
      return;
    }

    if (response.token) setToken(response.token);

    if (role === "vendor" && response.vendor) {
      setSessionRole("VENDOR");
      setSessionProfile(response.vendor);
      setVendor(response.vendor);
      router.push("/vendor/dashboard");
      return;
    }

    if (role === "user" && response.user) {
      setSessionRole("USER");
      setSessionProfile(response.user);
      setUser(response.user);
      router.push(redirectPath || "/user/dashboard");
      return;
    }

    router.push("/");
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl lg:grid-cols-2">
        <div className="relative hidden bg-linear-to-br from-slate-950 via-emerald-950 to-slate-900 p-10 text-white lg:block">
          <BrandMark href="/" compact className="items-start" titleClassName="text-white" taglineClassName="text-emerald-200/80" />

          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">{t("auth.welcomeBack")}</p>
          <h1 className="mt-3 text-5xl">{t("auth.powerFuture")}</h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">{t("auth.signinDescription")}</p>
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-white/85">New here?</p>
            <Link href={signupHref} className="mt-3 inline-flex rounded-full border border-emerald-300/70 bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              {t("buttons.createAccount")}
            </Link>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600">{t("auth.login")}</p>
          <h2 className="mt-3 text-4xl text-slate-900">{t("auth.signInToAccount")}</h2>

          {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-700">
              Account type
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as LoginRole)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-400"
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("auth.email")}
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("auth.password")}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-400"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-emerald-500" />
                {t("auth.rememberMe")}
              </label>
              <Link href={signupHref} className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600">
                {t("buttons.createAccount")}
              </Link>
            </div>

            <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl border border-emerald-300/80 bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60">
              {loading ? "Signing in..." : t("buttons.login")}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            {t("auth.dontHaveAccount")} <Link href={signupHref} className="font-semibold text-emerald-700 transition hover:text-emerald-600">{t("buttons.signUp")}</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}