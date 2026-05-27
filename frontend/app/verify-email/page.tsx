"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BrandMark from "@/components/brand-mark";
import { apiClient } from "@/lib/api-client";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const accountType = searchParams.get("type") || "user";
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const ready = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    if (!ready) {
      setError("Verification token is missing.");
      return;
    }

    const run = async () => {
      setLoading(true);
      const response = await apiClient.authExtras.confirmVerification(token);
      if (!response.success) {
        setError(response.error || "Unable to verify email");
      } else {
        setStatus("Email verified successfully.");
        window.setTimeout(() => router.push(accountType === "vendor" ? "/login" : "/login"), 1200);
      }
      setLoading(false);
    };

    void run();
  }, [accountType, ready, router, token]);

  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
        <BrandMark href="/" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
        <h1 className="mt-6 text-3xl text-slate-950">Verify your email</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">We are confirming your account so you can use the platform securely.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {loading ? "Verifying account..." : status || "Waiting for verification."}
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      </div>
    </section>
  );
}

function VerifyEmailFallback() {
  return (
    <section className="mx-auto flex min-h-[72vh] w-full max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-10">
        <BrandMark href="/" compact className="items-start" titleClassName="text-slate-900" taglineClassName="text-slate-500" />
        <h1 className="mt-6 text-3xl text-slate-950">Verify your email</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Loading verification flow...</p>
      </div>
    </section>
  );
}
