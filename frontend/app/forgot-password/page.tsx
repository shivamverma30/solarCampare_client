"use client";

import Link from "next/link";
import { useState } from "react";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";
import { apiClient } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [accountType, setAccountType] = useState<"user" | "vendor" | "admin">("user");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "success">("request");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const response = await apiClient.authExtras.requestPasswordReset(email, accountType);
    setLoading(false);

    if (!response.success) {
      setError(response.error || t("forgotPassword.errorSend"));
      return;
    }

    setStep("verify");
    setSuccess(t("forgotPassword.otpSent"));
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError(t("forgotPassword.passwordMismatch"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("forgotPassword.passwordShort"));
      return;
    }

    setLoading(true);
    const response = await apiClient.authExtras.completePasswordReset(email, otp, newPassword, accountType);
    setLoading(false);

    if (!response.success) {
      setError(response.error || t("forgotPassword.errorReset"));
      return;
    }

    setStep("success");
    setSuccess(t("forgotPassword.success"));
  };

  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
        <BrandMark href="/" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
        <h1 className="mt-6 text-3xl text-slate-950">{t("forgotPassword.title")}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">{t("forgotPassword.description")}</p>

        {error ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
        {success ? <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div> : null}

        {step === "request" ? (
          <form className="mt-6 space-y-4" onSubmit={handleSendOtp}>
            <label className="block text-sm font-medium text-slate-700">
              {t("forgotPassword.accountType")}
              <select value={accountType} onChange={(event) => setAccountType(event.target.value as "user" | "vendor" | "admin") } className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white">
                <option value="user">{t("forgotPassword.user")}</option>
                <option value="vendor">{t("forgotPassword.vendor")}</option>
                <option value="admin">{t("forgotPassword.admin")}</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("forgotPassword.email")}
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("forgotPassword.emailPlaceholder")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white" required />
            </label>

            <button type="submit" disabled={loading} className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loading ? t("forgotPassword.sending") : t("forgotPassword.sendOtp")}
            </button>
          </form>
        ) : null}

        {step === "verify" ? (
          <form className="mt-6 space-y-4" onSubmit={handleResetPassword}>
            <label className="block text-sm font-medium text-slate-700">
              {t("forgotPassword.otp")}
              <input type="text" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder={t("forgotPassword.otpPlaceholder")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white" required />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("forgotPassword.newPassword")}
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder={t("forgotPassword.passwordPlaceholder")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white" required />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("forgotPassword.confirmPassword")}
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={t("forgotPassword.confirmPlaceholder")} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white" required />
            </label>

            <button type="submit" disabled={loading} className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
              {loading ? t("forgotPassword.updating") : t("forgotPassword.updatePassword")}
            </button>
          </form>
        ) : null}

        {step === "success" ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm leading-7 text-slate-600">{t("forgotPassword.successDetails")}</p>
            <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700">
              {t("forgotPassword.backToLogin")}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
