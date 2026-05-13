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
};

export default function BrandMark({
  href = "/",
  className = "",
  titleClassName = "",
  taglineClassName = "",
  imageClassName = "",
  compact = false,
  showTagline = true,
}: BrandMarkProps) {
  // Slightly smaller logo when `compact` to keep the header slim
  const imageSize = compact ? 36 : 52;
  const linkClassName = `inline-flex items-center gap-2 ${className}`.trim();
  const titleClasses = `font-serif text-[0.96rem] font-semibold tracking-[0.12em] ${titleClassName}`.trim();
  const taglineClasses = `mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] ${taglineClassName}`.trim();

  return (
    <Link href={href} className={linkClassName}>
      <Image
        src="/images/safwe-logo.png"
        alt="SAFWE ENERGY logo"
        width={imageSize}
        height={imageSize}
        className={`h-auto w-auto object-contain ${imageClassName}`.trim()}
        quality={90}
        priority
      />

      <span className="flex min-w-0 flex-col leading-none">
        <span className={titleClasses}>Solar Compare</span>
        {showTagline && <span className={taglineClasses}>by SAFWE ENERGY</span>}
      </span>
    </Link>
  );
}
