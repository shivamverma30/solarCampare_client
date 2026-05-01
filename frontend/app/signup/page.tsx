import Link from "next/link";

export default function SignupPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl lg:grid-cols-2">
        <div className="p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">Sign Up</p>
          <h1 className="mt-3 text-4xl text-slate-900">Create Your SolarCompare Account</h1>

          <form className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Full Name
              <input
                type="text"
                placeholder="Your full name"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Phone
              <input
                type="tel"
                placeholder="+91"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                placeholder="Create password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Confirm Password
              <input
                type="password"
                placeholder="Confirm password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-amber-600 transition hover:text-amber-500">
              Login
            </Link>
          </p>
        </div>

        <div className="relative hidden bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">Get Started</p>
          <h2 className="mt-3 text-5xl">Design Your Premium Solar Journey</h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
            Build your profile, compare panels faster, and unlock personalized savings calculations with one account.
          </p>
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-white/85">Already registered?</p>
            <Link
              href="/login"
              className="mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
