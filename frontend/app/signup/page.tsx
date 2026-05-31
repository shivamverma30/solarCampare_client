"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { apiClient } from "@/lib/api-client";
import { setSessionProfile, setSessionRole, setToken, setUser } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const response = await apiClient.auth.registerUser(
      formData.fullName,
      formData.email,
      formData.password,
      formData.phone || undefined,
      formData.city || undefined,
      formData.state || undefined,
      formData.pincode || undefined
    );
    if (!response.success) {
      setError(response.error || "Unable to create account");
      setLoading(false);
      return;
    }

    // If backend returned a token but no user, it means OTP flow started
    if (response.token && !response.user) {
      setVerificationToken(response.token);
      setLoading(false);
      return;
    }

    if (response.user) {
      if (response.token) setToken(response.token);
      setSessionRole("USER");
      setSessionProfile(response.user);
      setUser(response.user);
      router.push("/user/dashboard");
      return;
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl lg:grid-cols-2">
        <div className="p-6 md:p-10">
          <BrandMark href="/" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">{t("auth.signup")}</p>
          <h1 className="mt-3 text-4xl text-slate-900">{t("auth.createAccountTitle")}</h1>

          {error && <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {verificationToken ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">Enter the 6-digit verification code sent to your email.</p>
                <Input label="Verification code" value={otp} onChange={(value) => setOtp(value)} placeholder="123456" required />
                <div className="flex items-center gap-4">
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      setLoading(true);
                      const res = await apiClient.authExtras.confirmVerification(verificationToken, otp);
                      setLoading(false);
                      if (!res.success) {
                        setError(res.error || "Invalid code");
                        return;
                      }
                      if (res.user) {
                        if (res.token) setToken(res.token);
                        setSessionRole("USER");
                        setSessionProfile(res.user);
                        setUser(res.user);
                        router.push("/user/dashboard");
                        return;
                      }
                      router.push("/login");
                    }}
                    className="rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black"
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </button>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!verificationToken) return;
                      setResendLoading(true);
                      const r = await apiClient.authExtras.resendVerification(verificationToken);
                      setResendLoading(false);
                      if (!r.success) setError(r.error || "Unable to resend");
                    }}
                    className="text-sm text-slate-600 underline"
                  >
                    {resendLoading ? "Resending..." : "Resend code"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Input label={t("auth.fullName")} value={formData.fullName} onChange={(value) => setFormData({ ...formData, fullName: value })} placeholder={t("auth.namePlaceholder")} required />
                <Input label={t("auth.email")} value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} placeholder={t("auth.emailPlaceholder")} required type="email" />
                <Input label={t("auth.phone")} value={formData.phone} onChange={(value) => setFormData({ ...formData, phone: value })} placeholder={t("auth.phonePlaceholder")} type="tel" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="City" value={formData.city} onChange={(value) => setFormData({ ...formData, city: value })} placeholder="City" />
                  <Input label="State" value={formData.state} onChange={(value) => setFormData({ ...formData, state: value })} placeholder="State" />
                </div>
                <Input label="PIN Code" value={formData.pincode} onChange={(value) => setFormData({ ...formData, pincode: value })} placeholder="PIN code" />
                <Input label={t("auth.password")} value={formData.password} onChange={(value) => setFormData({ ...formData, password: value })} placeholder={t("auth.createPasswordPlaceholder")} required type="password" />
                <Input label={t("auth.confirmPassword")} value={formData.confirmPassword} onChange={(value) => setFormData({ ...formData, confirmPassword: value })} placeholder={t("auth.confirmPasswordPlaceholder")} required type="password" />

                <button type="submit" disabled={loading} className="mt-2 w-full rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-60">
                  {loading ? "Creating account..." : t("buttons.signUp")}
                </button>
              </>
            )}
          </form>

          <div className="mt-5 flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              {t("auth.alreadyHaveAccount")} <Link href="/login" className="font-semibold text-amber-600 transition hover:text-amber-500">{t("buttons.login")}</Link>
            </p>
            <Link href="/become-vendor" className="font-semibold text-slate-700 transition hover:text-slate-950">
              Become a Vendor
            </Link>
          </div>
        </div>

        <div className="relative hidden bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">{t("auth.getStarted")}</p>
          <h2 className="mt-3 text-5xl">{t("auth.designJourney")}</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">{t("auth.signupDescription")}</p>
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-white/85">Need vendor onboarding?</p>
            <Link href="/become-vendor" className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; required?: boolean; }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
      />
    </label>
  );
}