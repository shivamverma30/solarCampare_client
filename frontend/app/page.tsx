"use client";

import HeroLocal from "@/components/hero-local";
import SubsidyCountdownSection from "@/components/subsidy-countdown-section";
import IndustryStatsMarquee from "@/components/industry-stats-marquee";
import VisionMissionSection from "@/components/vision-mission-section";
import BenefitsSection from "@/components/benefits-section";
import HomeFaqSection from "@/components/home-faq-section";
import CtaBanner from "@/components/cta-banner";
import TrustedBrands from "@/components/trusted-brands";
import SolarTypes from "@/components/solar-types";
import SolarDiscoveryFlow from "@/components/solar-discovery-flow";
import SolarCtaSection from "@/components/solar-cta-section";
import StickyLeadCTA from "@/components/sticky-lead-cta";
import HowSolarCompareWorks from "@/components/how-solarcompare-works";

export default function Home() {
  return (
    <div>
      <HeroLocal />
      <IndustryStatsMarquee />
      <SubsidyCountdownSection />
      <VisionMissionSection />

      <BenefitsSection />
      <CtaBanner />

      <SolarDiscoveryFlow />
      <SolarTypes />
      <HowSolarCompareWorks />
      <SolarCtaSection />
      <HomeFaqSection />
      <TrustedBrands />
      <StickyLeadCTA />
    </div>
  );
}
