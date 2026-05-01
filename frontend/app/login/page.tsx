import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl lg:grid-cols-2">
        <div className="relative hidden bg-linear-to-br from-slate-950 via-slate-900 to-amber-950 p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-300">Welcome Back</p>
          <h1 className="mt-3 text-5xl">Power Your Future with Solar</h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">
            Sign in to access personalized savings, panel comparisons, and your solar planning journey.
          </p>
          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-white/85">New to SOLARCOMPARE?</p>
            <Link
              href="/signup"
              className="mt-3 inline-flex rounded-full border border-amber-300/80 bg-amber-400 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-amber-500">Login</p>
          <h2 className="mt-3 text-4xl text-slate-900">Sign In to Your Account</h2>

          <form className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                placeholder="Enter password"
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-500 focus:border-amber-400"
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-amber-500" />
                Remember me
              </label>
              <Link href="/login" className="text-sm font-semibold text-amber-600 transition hover:text-amber-500">
                Forgot password
              </Link>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl border border-amber-300/80 bg-amber-400 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-300"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Do not have an account?{" "}
            <Link href="/signup" className="font-semibold text-amber-600 transition hover:text-amber-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
