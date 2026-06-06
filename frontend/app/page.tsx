"use client";

import Link from "next/link";
import HeroLocal from "@/components/hero-local";
import BenefitsSection from "@/components/benefits-section";
import TrustedBrands from "@/components/trusted-brands";
import CtaBanner from "@/components/cta-banner";
import SolarTypes from "@/components/solar-types";
import SolarDiscoveryFlow from "@/components/solar-discovery-flow";
import DCRComparison from "@/components/dcr-comparison";
import StickyLeadCTA from "@/components/sticky-lead-cta";

export default function Home() {
  return (
    <div>
      <HeroLocal />

      <BenefitsSection />
      <CtaBanner />

      <SolarDiscoveryFlow />
      <SolarTypes />
      <DCRComparison />
      <TrustedBrands />
      <StickyLeadCTA />
    </div>
  );
}
