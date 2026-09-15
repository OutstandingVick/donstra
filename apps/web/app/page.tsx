import { HeroSection } from "./marketing/hero-section";
import { MarketingHeader } from "./marketing/marketing-header";
import { ProblemSection } from "./marketing/problem-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080D07] antialiased">
      <a href="#main-content" className="fixed start-4 top-4 z-50 -translate-y-24 rounded-md bg-[#16DB65] px-4 py-3 text-sm font-semibold text-[#071006] focus:translate-y-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white">Skip to content</a>
      <MarketingHeader />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
      </main>
    </div>
  );
}
