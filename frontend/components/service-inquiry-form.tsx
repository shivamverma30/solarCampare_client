"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { servicePages, type ServicePage } from "@/data/service-pages";

type ServiceInquiryFormProps = {
  service: ServicePage;
};

type FormState = {
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  state: string;
  pincode: string;
  serviceRequired: string;
  message: string;
};

const initialFormState = (service: ServicePage): FormState => ({
  fullName: "",
  mobileNumber: "",
  email: "",
  city: "",
  state: "",
  pincode: "",
  serviceRequired: service.title,
  message: "",
});

export default function ServiceInquiryForm({ service }: ServiceInquiryFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState(service));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await apiClient.quotes.createQuote({
        fullName: form.fullName,
        email: form.email,
        phone: form.mobileNumber,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        projectType: form.serviceRequired,
        notes: form.message,
        metadata: {
          inquiryType: "service",
          serviceName: form.serviceRequired,
          serviceSlug: service.slug,
          source: "service-page",
        },
      });

      if (!response.success) {
        throw new Error((response as { error?: string }).error || "Unable to submit inquiry");
      }

      setForm(initialFormState(service));
      setFeedback("Inquiry submitted successfully. Our admin team will review and contact you shortly.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to submit inquiry right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Inquiry Form</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Request service details</h2>
        </div>
        <CheckCircle2 className="h-6 w-6 text-slate-400" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Full Name" value={form.fullName} onChange={(value) => updateField("fullName", value)} required />
        <Field label="Mobile Number" value={form.mobileNumber} onChange={(value) => updateField("mobileNumber", value)} type="tel" required />
        <Field label="Email" value={form.email} onChange={(value) => updateField("email", value)} type="email" required />
        <Field label="City" value={form.city} onChange={(value) => updateField("city", value)} required />
        <Field label="State" value={form.state} onChange={(value) => updateField("state", value)} required />
        <Field label="Pincode" value={form.pincode} onChange={(value) => updateField("pincode", value)} inputMode="numeric" required />
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Service Required</label>
          <select
            value={form.serviceRequired}
            onChange={(event) => updateField("serviceRequired", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-950"
          >
            {servicePages.map((item) => (
              <option key={item.slug} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            rows={5}
            placeholder="Tell us about your roof, usage, preferred timeline, or any special requirement."
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          />
        </div>
      </div>

      {feedback ? (
        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${feedback.startsWith("Inquiry submitted") ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {feedback}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting
          </span>
        ) : (
          "Send Inquiry"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        inputMode={inputMode}
        required={required}
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950"
      />
    </div>
  );
}