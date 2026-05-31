"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandMark from "@/components/brand-mark";
import { apiClient } from "@/lib/api-client";
import { setSessionProfile, setSessionRole, setToken, setVendor } from "@/lib/auth";

const initialForm = {
  fullName: "",
  businessName: "",
  companyName: "",
  ownerName: "",
  email: "",
  phone: "",
  gst: "",
  serviceArea: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  logoUrl: "",
  businessType: "",
  experience: "",
  services: "",
  password: "",
  documentName: "",
  documentUrl: "",
  documentType: "",
};

export default function BecomeVendorPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await apiClient.auth.registerVendor({
      companyName: form.companyName,
      ownerName: form.ownerName,
      businessName: form.businessName,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      gst: form.gst || undefined,
      serviceArea: form.serviceArea,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      logoUrl: form.logoUrl || undefined,
      businessType: form.businessType,
      experience: Number(form.experience || 0),
      services: form.services.split(",").map((service) => service.trim()).filter(Boolean),
      password: form.password,
      documents: form.documentName && form.documentUrl && form.documentType
        ? [{ documentName: form.documentName, fileUrl: form.documentUrl, fileType: form.documentType }]
        : [],
    });

    if (!response.success) {
      setError(response.error || "Unable to submit vendor application");
      setLoading(false);
      return;
    }

    if (response.token && !response.vendor) {
      setVerificationToken(response.token);
      setLoading(false);
      setSuccess("A verification code was sent to your email. Please enter it below.");
      return;
    }

    if (response.vendor) {
      setSuccess("Your account is under admin review.");
      router.push("/login");
      return;
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          <div className="bg-slate-950 p-6 text-white md:p-10">
            <BrandMark href="/" compact className="items-start" titleClassName="text-white" taglineClassName="text-amber-200/80" />
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">Vendor onboarding</p>
            <h1 className="mt-3 text-4xl md:text-5xl">Apply to become a vendor</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/78">
              Vendor contact details remain private. Applications are reviewed by superadmin before approval.
            </p>
          </div>

          <div className="p-6 md:p-10">
            {error && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{success}</div>}

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              {verificationToken ? (
                <div className="md:col-span-2 space-y-4">
                  <p className="text-sm text-slate-600">Enter the 6-digit verification code sent to your email.</p>
                  <Field label="Verification code" value={otp} onChange={(value) => setOtp(value)} required />
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
                        // If vendor created, redirect to login (pending approval)
                        if (res.vendor) {
                          router.push("/login");
                          return;
                        }
                        router.push("/login");
                      }}
                      className="md:col-span-2 rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black"
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
              <Field label="Full Name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} required />
              <Field label="Business/Shop Name" value={form.businessName} onChange={(value) => setForm({ ...form, businessName: value })} required />
              <Field label="Company Name" value={form.companyName} onChange={(value) => setForm({ ...form, companyName: value })} required />
              <Field label="Owner Name" value={form.ownerName} onChange={(value) => setForm({ ...form, ownerName: value })} required />
              <Field label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} type="email" required />
              <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} type="tel" required />
              <Field label="GST (optional)" value={form.gst} onChange={(value) => setForm({ ...form, gst: value })} />
              <Field label="Service Area" value={form.serviceArea} onChange={(value) => setForm({ ...form, serviceArea: value })} required />
              <Field label="Business Type" value={form.businessType} onChange={(value) => setForm({ ...form, businessType: value })} required />
              <Field label="Experience (years)" value={form.experience} onChange={(value) => setForm({ ...form, experience: value })} type="number" required />
              <Field label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} required />
              <Field label="State" value={form.state} onChange={(value) => setForm({ ...form, state: value })} required />
              <Field label="PIN Code" value={form.pincode} onChange={(value) => setForm({ ...form, pincode: value })} required />
              <Field label="Logo URL (optional)" value={form.logoUrl} onChange={(value) => setForm({ ...form, logoUrl: value })} />
              <Field label="Password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} type="password" required />

              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Address
                <textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400" />
              </label>

              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Services offered (comma separated)
                <input value={form.services} onChange={(event) => setForm({ ...form, services: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400" />
              </label>

              <Field label="Document Name" value={form.documentName} onChange={(value) => setForm({ ...form, documentName: value })} />
              <Field label="Document Type" value={form.documentType} onChange={(value) => setForm({ ...form, documentType: value })} />
              <label className="md:col-span-2 block text-sm font-medium text-slate-700">
                Document URL
                <input value={form.documentUrl} onChange={(event) => setForm({ ...form, documentUrl: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400" />
              </label>

              <button type="submit" disabled={loading} className="md:col-span-2 mt-2 w-full rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300 disabled:opacity-60">
                {loading ? "Submitting application..." : "Submit Vendor Application"}
              </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
      />
    </label>
  );
}