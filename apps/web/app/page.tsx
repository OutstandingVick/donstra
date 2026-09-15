import { HeroSection } from "./marketing/hero-section";
import { ExistingSystemsSection } from "./marketing/existing-systems-section";
import { EconomicAccountabilitySection } from "./marketing/economic-accountability-section";
import { FinalCtaSection } from "./marketing/final-cta-section";
import { HowDonstraWorksSection } from "./marketing/how-donstra-works-section";
import { LiveAccountabilitySection } from "./marketing/live-accountability-section";
import { MarketingHeader } from "./marketing/marketing-header";
import { ProblemSection } from "./marketing/problem-section";
import { SiteFooter } from "./marketing/site-footer";
import { WhatDonstraProvesSection } from "./marketing/what-donstra-proves-section";
import { VerifiableReceiptsSection } from "./marketing/verifiable-receipts-section";

export default function Home() {
  return (
    <div id="donstra-app" className="min-h-screen bg-[#080D07] text-[#F3F8F1] antialiased">
      <a href="#main-content" className="fixed start-4 top-4 z-50 -translate-y-24 rounded-md bg-[#16DB65] px-4 py-3 text-sm font-semibold text-[#071006] focus:translate-y-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white">Skip to content</a>
      <MarketingHeader />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <ExistingSystemsSection />
        <HowDonstraWorksSection />
        <LiveAccountabilitySection />
        <WhatDonstraProvesSection />
        <EconomicAccountabilitySection />
        <VerifiableReceiptsSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
