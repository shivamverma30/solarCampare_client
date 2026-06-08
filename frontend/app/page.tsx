"use client";

import HeroLocal from "@/components/hero-local";
import SubsidyCountdownSection from "@/components/subsidy-countdown-section";
import VisionMissionSection from "@/components/vision-mission-section";
import BenefitsSection from "@/components/benefits-section";
import DCRComparison from "@/components/dcr-comparison";
import HomeFaqSection from "@/components/home-faq-section";
import CtaBanner from "@/components/cta-banner";
import SolarTypes from "@/components/solar-types";
import SolarDiscoveryFlow from "@/components/solar-discovery-flow";
import SolarCtaSection from "@/components/solar-cta-section";
import StickyLeadCTA from "@/components/sticky-lead-cta";

export default function Home() {
  return (
    <div>
      <HeroLocal />
      <SubsidyCountdownSection />
      <VisionMissionSection />

      <BenefitsSection />
      <CtaBanner />

      <SolarDiscoveryFlow />
      <SolarTypes />
      <DCRComparison />
      <HomeFaqSection />
      <SolarCtaSection />
      <StickyLeadCTA />
    </div>
  );
}
