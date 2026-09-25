import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { TrustedSection } from './TrustedSection';
import { ProblemSection } from './ProblemSection';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { InteractiveDashboardPreview } from './InteractiveDashboardPreview';
import { BusinessTypesSection } from './BusinessTypesSection';
import { PricingSection } from './PricingSection';
import { FaqSection } from './FaqSection';
import { CtaSection } from './CtaSection';
import { LandingFooter } from './LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <LandingNavbar />
      <main className="flex-grow">
        <HeroSection />
        <TrustedSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <InteractiveDashboardPreview />
        <BusinessTypesSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
};
