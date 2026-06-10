"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import PrivacyNote from "@/components/privacy-note";

type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

const initialState: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  message: "",
};

export default function ContactEnquiryForm() {
  const [form, setForm] = useState<ContactFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const validationError = useMemo(() => {
    if (!form.fullName.trim()) return "Full Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Please enter a valid email address.";
    if (!form.phone.trim()) return "Phone Number is required.";
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ""))) return "Please enter a valid 10-digit phone number.";
    if (!form.city.trim()) return "City is required.";
    if (!form.message.trim() || form.message.trim().length < 15) return "Message should be at least 15 characters.";
    return null;
  }, [form]);

  const updateField = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (validationError) {
      setFeedback({ type: "error", text: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.leads.submitInquiry({
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        subject: `Contact Us - ${form.city}`,
        message: `City: ${form.city}\n\n${form.message}`,
        source: "contact-us-page",
      });

      if (!response.success) {
        throw new Error(response.error || "Unable to submit enquiry right now.");
      }

      setForm(initialState);
      setFeedback({ type: "success", text: "Your enquiry has been submitted successfully." });
    } catch (error) {
      setFeedback({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to submit enquiry right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-xl font-semibold text-slate-950">Send us your enquiry</h2>
      <p className="mt-2 text-sm text-slate-600">Our team will review your request and contact you with the right next steps.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <Field label="Full Name" value={form.fullName} onChange={(value) => updateField("fullName", value)} required />
        <Field label="Email" value={form.email} onChange={(value) => updateField("email", value)} type="email" required />
        <Field label="Phone Number" value={form.phone} onChange={(value) => updateField("phone", value)} type="tel" required />
        <Field label="City" value={form.city} onChange={(value) => updateField("city", value)} required />
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            value={form.message}
            onChange={(event) => updateField("message", event.target.value)}
            required
            rows={5}
            placeholder="Tell us your requirement, expected timeline, or any project details."
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>
      </div>

      {feedback ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting
          </span>
        ) : (
          "Submit Enquiry"
        )}
      </button>
      <PrivacyNote />
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
      />
    </div>
  );
}
