import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'WaselDZ remplace-t-il les sociétés de livraison comme Yalidine ou ZR Express ?',
      a: 'WaselDZ est votre cockpit de contrôle central. Vous pouvez l\'utiliser pour gérer vos propres livreurs internes (motos, camionnettes de votre boutique), mais aussi pour centraliser et tracer les colis confiés aux transporteurs nationaux. Vous avez ainsi une vue unique sur toutes vos commandes quel que soit le canal d\'expédition.'
    },
    {
      q: 'Comment fonctionne la gestion du Cash on Delivery (Paiement à la livraison) ?',
      a: 'Chaque commande indique le montant exact des produits et les frais de livraison. Lorsque le livreur marque le colis comme "Livré", WaselDZ enregistre automatiquement l\'encaissement en Cash ou par BaridiMob. À la fin de la journée, vous comparez la recette du livreur avec le total calculé par le système en 1 clic.'
    },
    {
      q: 'Mes livreurs doivent-ils installer une application compliquée ?',
      a: 'Non ! WaselDZ est entièrement responsive et s\'utilise sur n\'importe quel smartphone (Android / iPhone) sans téléchargement lourd. De plus, WaselDZ intègre des raccourcis WhatsApp directs pour envoyer la fiche de livraison, l\'adresse GPS et le numéro du client au chauffeur en un tap.'
    },
    {
      q: 'Prenez-vous en charge toutes les 58 Wilayas d\'Algérie ?',
      a: 'Oui, WaselDZ intègre nativement la liste officielle des 58 Wilayas algériennes avec leurs communes principales et vous permet de paramétrer des frais d\'expédition sur mesure par zone (Alger, Centre, Est, Ouest, Sud).'
    },
    {
      q: 'Puis-je exporter mes commandes vers Excel ou imprimer des bordereaux ?',
      a: 'Absolument. En un clic depuis votre espace commerçant, vous pouvez exporter votre registre de commandes, vos clients et vos bilans de livraison sous format Excel ou imprimer les détails de chaque commande.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Foire Aux Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Questions fréquentes sur WaselDZ
          </h2>
          <p className="text-base text-slate-600">
            Tout ce que vous devez savoir pour démarrer la gestion de vos livraisons.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
