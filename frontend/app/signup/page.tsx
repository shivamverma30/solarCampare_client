"use client";

import Link from "next/link";
import BrandMark from "@/components/brand-mark";
import { useLocale } from "@/components/locale-provider";

export default function SignupPage() {
  const { t } = useLocale();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl lg:grid-cols-2">
        <div className="p-6 md:p-10">
          <BrandMark
            href="/"
            compact
            className="items-start"
            titleClassName="text-slate-900"
            taglineClassName="text-slate-500"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">{t("auth.signup")}</p>
          <h1 className="mt-3 text-4xl text-slate-900">{t("auth.createAccountTitle")}</h1>

          <form className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              {t("auth.fullName")}
              <input
                type="text"
                placeholder={t("auth.namePlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("auth.email")}
              <input
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("auth.phone")}
              <input
                type="tel"
                placeholder={t("auth.phonePlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("auth.password")}
              <input
                type="password"
                placeholder={t("auth.createPasswordPlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {t("auth.confirmPassword")}
              <input
                type="password"
                placeholder={t("auth.confirmPasswordPlaceholder")}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              {t("buttons.signUp")}
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            {t("auth.alreadyHaveAccount")} {" "}
            <Link href="/login" className="font-semibold text-amber-600 transition hover:text-amber-500">
              {t("buttons.login")}
            </Link>
          </p>
        </div>

        <div className="relative hidden bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">{t("auth.getStarted")}</p>
          <h2 className="mt-3 text-5xl">{t("auth.designJourney")}</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
            {t("auth.signupDescription")}
          </p>
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-white/85">{t("auth.alreadyRegistered")}</p>
            <Link
              href="/login"
              className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {t("buttons.goToLogin")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
