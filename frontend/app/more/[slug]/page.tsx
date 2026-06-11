import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getInfoPage, infoPages } from "@/data/info-pages";
import { getMoreContent } from "@/data/more-content";
import BlogCard from "@/components/more/blog-card";
import ContactEnquiryForm from "@/components/more/contact-enquiry-form";
import AboutPageContent from "@/components/about-page-content";
import { BarChart3, Calculator, ClipboardCheck, Handshake, SearchCheck, Sparkles } from "lucide-react";

type MorePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ article?: string }>;
};

export function generateStaticParams() {
  return infoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: MorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.title,
    description: page.summary,
  };
}

export default async function MorePage({ params, searchParams }: MorePageProps) {
  const { slug } = await params;
  const { article } = await searchParams;
  const cookieStore = await cookies();
  const locale = cookieStore.get("safwe:locale")?.value === "en" ? "en" : "hi";
  const page = getInfoPage(slug, locale);
  const content = getMoreContent(locale);

  if (!page) {
    notFound();
  }

  if (slug === "about-us") {
    return <AboutPageContent page={page} />;
  }

  const howIconByKey: Record<string, typeof Calculator> = {
    calculate: Calculator,
    compare: SearchCheck,
    proposal: ClipboardCheck,
    connect: Handshake,
    install: Sparkles,
  };

  const totalReadMinutes = content.blogPosts.reduce((total, post) => {
    const minutes = Number.parseInt(post.readTime, 10);
    return total + (Number.isFinite(minutes) ? minutes : 0);
  }, 0);

  const blogMetrics = [
    { label: locale === "hi" ? "प्रकाशित लेख" : "Published Articles", value: `${content.blogPosts.length}` },
    { label: locale === "hi" ? "संपादकीय श्रेणियाँ" : "Editorial Categories", value: `${new Set(content.blogPosts.map((post) => post.category)).size}` },
    { label: locale === "hi" ? "औसत पढ़ने का समय" : "Average Read Time", value: `${Math.max(1, Math.round(totalReadMinutes / content.blogPosts.length))} min` },
  ];

  const selectedBlog = slug === "blogs" && article ? content.blogPosts.find((post) => post.slug === article) : null;
  const blogImportantData: Record<string, { summary: string; keyPoints: string[] }> = {
    "solar-subsidy-guide": {
      summary: "Subsidy awareness directly improves budget accuracy and prevents unrealistic payback expectations.",
      keyPoints: [
        "Confirm whether your property and system size meet current residential eligibility rules.",
        "Check the latest subsidy slab by capacity to estimate net project cost correctly.",
        "Validate required documents early, including ownership proof and electricity connection details.",
        "Track state and DISCOM process differences, because timelines and forms can vary by region.",
        "Avoid overcommitting before subsidy confirmation; use pre-subsidy and post-subsidy scenarios.",
        "Compare vendor proposals only after standardizing assumptions for subsidy and generation.",
        "Maintain an application checklist to reduce rework, delays, and approval rejection risk.",
      ],
    },
    "solar-panel-buying-guide": {
      summary: "Panel selection should be performance-led, not discount-led, to protect long-term value.",
      keyPoints: [
        "Review efficiency under realistic rooftop conditions, not only brochure peak values.",
        "Compare annual degradation rates to estimate generation loss over system life.",
        "Assess product warranty and performance warranty as separate risk controls.",
        "Verify brand track record, service responsiveness, and local support availability.",
        "Check compatibility with inverter configuration and your expected load profile.",
        "Use lifetime energy yield and not just upfront price for final decision-making.",
        "Create a side-by-side technical matrix for at least three shortlisted panel options.",
      ],
    },
    "net-metering-explained": {
      summary: "Net metering rules are one of the strongest drivers of actual monthly savings.",
      keyPoints: [
        "Understand how exported solar units are adjusted against imported grid consumption.",
        "Confirm billing cycle treatment to avoid overestimating credit carry-forward benefits.",
        "Review DISCOM-specific limits, caps, and eligibility constraints before installation.",
        "Check if banking periods or settlement windows apply to surplus generation.",
        "Model savings using your actual daytime usage pattern and seasonal variation.",
        "Ask vendors to include net-metering assumptions clearly in ROI calculations.",
        "Reconcile your first three post-installation bills to validate expected economics.",
      ],
    },
    "residential-solar-roi": {
      summary: "Reliable ROI planning requires conservative assumptions and transparent scenario analysis.",
      keyPoints: [
        "Start with your verified monthly consumption trend instead of a single bill snapshot.",
        "Use current tariff slabs and likely escalation assumptions for future savings modeling.",
        "Estimate annual generation with realistic derating for weather, dust, and shading impact.",
        "Include subsidy, financing costs, and maintenance to avoid inflated returns.",
        "Run conservative, expected, and optimistic scenarios for payback comparison.",
        "Track break-even year, internal savings stability, and long-term cash benefit.",
        "Revisit calculations after site survey to align design and financial projection.",
      ],
    },
    "commercial-solar-benefits": {
      summary: "Commercial solar supports margin discipline, cost visibility, and long-term energy planning.",
      keyPoints: [
        "Compare capex and financed models against your business cash-flow priorities.",
        "Map demand profile to generation hours for better self-consumption outcomes.",
        "Quantify annual savings and impact on operating margin over multiple years.",
        "Factor demand charges, contract terms, and load growth in system sizing.",
        "Evaluate downtime risk and service SLAs before vendor finalization.",
        "Use ROI plus risk metrics when presenting investment cases to management.",
        "Monitor post-installation performance monthly to maintain projected business value.",
      ],
    },
    "pm-surya-ghar-updates": {
      summary: "Following policy updates closely reduces approval delays and documentation errors.",
      keyPoints: [
        "Monitor official scheme circulars for any changes in eligibility and process flow.",
        "Validate current application sequence before initiating vendor-side paperwork.",
        "Prepare document sets in advance to avoid bottlenecks during submission.",
        "Track portal-level requirements, acknowledgments, and timeline dependencies.",
        "Align vendor commitments with updated scheme milestones and customer expectations.",
        "Keep proof of submissions organized for faster follow-up and dispute resolution.",
        "Review update frequency monthly so proposals remain policy-compliant and accurate.",
      ],
    },
  };

  const selectedBlogImportantData = selectedBlog ? blogImportantData[selectedBlog.slug] : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-[0_18px_46px_rgba(15,23,42,0.08)] md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Information</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 md:text-5xl">{page.heroTitle}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{page.heroDescription}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-950">Highlights</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {page.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">Details</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
              {page.details.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>

        {slug === "contact-us" ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <ContactEnquiryForm />
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-xl font-semibold text-slate-950">Business contact information</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p><span className="font-semibold text-slate-900">Email:</span> hello@safweenergy.com</p>
                <p><span className="font-semibold text-slate-900">Phone:</span> +91 98765 43210</p>
                <p><span className="font-semibold text-slate-900">Hours:</span> Mon-Sat | 9:00 AM - 7:00 PM</p>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Response commitment</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Most enquiries are reviewed within one business day. Priority project requests are routed immediately to the admin operations queue.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {slug === "blogs" ? (
          <div className="mt-8 space-y-6">
            {selectedBlog ? (
              <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Solar Compare Article</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950 md:text-3xl">{selectedBlog.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  <span>{selectedBlog.category}</span>
                  <span className="text-slate-300">|</span>
                  <span>{selectedBlog.readTime}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{selectedBlog.excerpt}</p>

                {selectedBlogImportantData ? (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Why this article matters</p>
                      <p className="mt-1 text-sm leading-7 text-emerald-900">{selectedBlogImportantData.summary}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Key Points</p>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700">
                        {selectedBlogImportantData.keyPoints.map((point) => (
                          <li key={point} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}

                <div className="mt-5">
                  <Link href="/more/blogs" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                    Back to all articles
                  </Link>
                </div>
              </article>
            ) : null}

            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:p-6">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <BarChart3 className="h-4 w-4 text-emerald-600" />
                  Editorial Desk
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-950 md:text-[1.75rem]">Practical solar insights built for serious buying decisions</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  These articles are written to support policy awareness, procurement planning, and realistic ROI evaluation for Indian rooftop and commercial projects.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                {blogMetrics.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-xl font-semibold text-slate-950">{item.value}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(content.blogPosts.map((post) => post.category))).map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {content.blogPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        ) : null}

        {slug === "faq" ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{locale === "hi" ? "FAQ स्थानांतरित" : "FAQ Relocated"}</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{locale === "hi" ? "FAQ अब होम पेज पर उपलब्ध है" : "FAQ is now available on the Home page"}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {locale === "hi"
                ? "तुलना और प्रस्ताव वर्कफ़्लो के दौरान तेज़ पहुँच के लिए अक्सर पूछे जाने वाले प्रश्न होम अनुभव में स्थानांतरित किए गए हैं।"
                : "We moved frequently asked questions to the Home experience for faster buyer access during comparison and proposal workflows."}
            </p>
            <div className="mt-5">
              <Link href="/#home-faq" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
                {locale === "hi" ? "होम FAQ पर जाएँ" : "Go to Home FAQ"}
              </Link>
            </div>
          </div>
        ) : null}

        {slug === "how-it-works" ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {content.howItWorksSteps.map((step, index) => {
              const Icon = howIconByKey[step.key] || Sparkles;
              return (
                <article key={step.key} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 ring-1 ring-slate-200">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{locale === "hi" ? `चरण ${index + 1}` : `Step ${index + 1}`}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </article>
              );
            })}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/services" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            {locale === "hi" ? "सेवाएँ देखें" : "Browse services"}
          </Link>
          <Link href="/calculator" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
            {locale === "hi" ? "कैलकुलेटर खोलें" : "Open calculator"}
          </Link>
        </div>
      </section>
    </main>
  );
}