import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/70 py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-serif text-2xl text-slate-900">SOLARCOMPARE</p>
          <p className="mt-3 max-w-sm text-sm text-slate-600">
            Premium solar discovery platform for homeowners and businesses seeking faster ROI and cleaner energy.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-700">Quick Links</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/" className="text-slate-700 transition hover:text-black">
              Home
            </Link>
            <Link href="/calculator" className="text-slate-700 transition hover:text-black">
              Solar Calculator
            </Link>
            <Link href="/compare" className="text-slate-700 transition hover:text-black">
              Compare Panels
            </Link>
            <Link href="/emi" className="text-slate-700 transition hover:text-black">
              EMI Calculator
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-700">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <p>hello@solarcompare.in</p>
            <p>+91 98765 43210</p>
            <p>Mon-Sat | 9:00 AM - 7:00 PM</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 w-full max-w-7xl px-4 text-xs text-slate-500 md:px-8">
        <p>© {new Date().getFullYear()} SOLARCOMPARE. All rights reserved.</p>
      </div>
    </footer>
  );
}
