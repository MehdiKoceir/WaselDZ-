import React, { useState } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { SimpleHeroSection } from './SimpleHeroSection';
import { QuickNeedsSection } from './QuickNeedsSection';
import { RateCalculatorSection } from './RateCalculatorSection';
import { SimpleContactSection } from './SimpleContactSection';
import { LandingFooter } from './LandingFooter';
import { RealtimeTrackingModal } from '../dashboard/RealtimeTrackingModal';

export const LandingPage: React.FC = () => {
  const [activeTrackingModalOrderId, setActiveTrackingModalOrderId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 1. Header épuré */}
      <LandingNavbar />

      <main className="flex-grow">
        {/* 2. Hero avec recherche immédiate de colis & accès commerçant */}
        <SimpleHeroSection 
          onOpenTrackingModal={(orderId) => setActiveTrackingModalOrderId(orderId)} 
        />

        {/* 3. Trouver vos besoins rapidement (3 services essentiels) */}
        <QuickNeedsSection />

        {/* 4. Simulateur express de tarifs par Wilaya */}
        <RateCalculatorSection />

        {/* 5. Contact & Support direct (Téléphone & WhatsApp) */}
        <SimpleContactSection />
      </main>

      {/* 6. Pied de page sobre */}
      <LandingFooter />

      {/* Modal de suivi GPS en direct si demandé par le visiteur */}
      {activeTrackingModalOrderId && (
        <RealtimeTrackingModal
          orderId={activeTrackingModalOrderId}
          onClose={() => setActiveTrackingModalOrderId(null)}
        />
      )}
    </div>
  );
};
