import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogPostCard } from "@/data/more-content";

type BlogCardProps = {
  post: BlogPostCard;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/more/blogs?article=${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(15,23,42,0.12)]">
        <div className="relative h-44 w-full">
          <Image
            src="/images/blogs/solar-compare-office.png"
            alt="Solar Compare office branding"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.05),rgba(2,6,23,0.55))]" />
      </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Solar Compare Editorial</p>
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Clock3 className="h-3.5 w-3.5" />
              {post.readTime}
            </p>
          </div>

          <h3 className="mt-3 text-xl font-semibold leading-7 text-slate-950">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:border-emerald-200 group-hover:text-emerald-700">
            Open article
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}
