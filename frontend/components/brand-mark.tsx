import Image from "next/image";
import Link from "next/link";

type BrandMarkProps = {
  href?: string;
  className?: string;
  titleClassName?: string;
  taglineClassName?: string;
  imageClassName?: string;
  compact?: boolean;
  showTagline?: boolean;
  stacked?: boolean;
};

export default function BrandMark({
  href = "/",
  className = "",
  titleClassName = "",
  taglineClassName = "",
  imageClassName = "",
  compact = false,
  showTagline = true,
  stacked = false,
}: BrandMarkProps) {
  // Slightly smaller logo when `compact` to keep the header slim
  const imageSize = compact ? 36 : 52;
  const linkClassName = `inline-flex items-center gap-2 ${className}`.trim();
  const titleClasses = `font-serif text-[0.98rem] font-extrabold uppercase tracking-[0.16em] ${titleClassName}`.trim();
  const taglineClasses = `mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] ${taglineClassName}`.trim();

  return (
    <Link href={href} className={linkClassName}>
      <Image
        src="/images/safewe-logo.png"
        alt="SAFWE ENERGY logo"
        width={imageSize}
        height={imageSize}
        className={`h-auto w-auto object-contain ${imageClassName}`.trim()}
        quality={90}
        priority
      />

      <span className={`flex min-w-0 leading-none ${stacked ? "flex-col" : "flex-col"}`}>
        {stacked ? (
          <>
            <span className={`${titleClasses} text-[1.16rem] font-black tracking-[0.11em]`}>Solar</span>
            <span className={`${titleClasses} mt-0.5 text-[1.16rem] font-black tracking-[0.09em]`}>Compare</span>
          </>
        ) : (
          <span className={titleClasses}>Solar Compare</span>
        )}
        {showTagline && <span className={taglineClasses}>by SAFWE ENERGY</span>}
      </span>
    </Link>
  );
}
