import React, { useState } from 'react';
import { Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';

export const PricingSection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Démarrage',
      subtitle: 'Pour tester et lancer votre activité',
      priceMonthly: 0,
      priceAnnual: 0,
      popular: false,
      cta: 'Commencer Gratuitement',
      features: [
        'Jusqu\'à 50 commandes par mois',
        '2 livreurs assignables',
        'Suivi du statut de livraison en direct',
        'Réconciliation Cash à la livraison de base',
        'Support par email & centre d\'aide'
      ]
    },
    {
      name: 'Pro Algérie',
      subtitle: 'Le forfait idéal pour les e-commerçants en plein essor',
      priceMonthly: 3500,
      priceAnnual: 2900,
      popular: true,
      badge: 'Le plus populaire en Algérie',
      cta: 'Lancer mon essai gratuit 14 jours',
      features: [
        'Commandes mensuelles illimitées',
        'Jusqu\'à 10 livreurs assignables',
        'Suivi multi-wilayas (58 Wilayas)',
        'Gestion des stocks & catalogue produits',
        'CRM clients & historique d\'achat complet',
        'Exportation Excel & factures PDF',
        'Support prioritaire par WhatsApp'
      ]
    },
    {
      name: 'Flotte & Entreprise',
      subtitle: 'Pour les réseaux de boutiques et gros expéditeurs',
      priceMonthly: 7900,
      priceAnnual: 6500,
      popular: false,
      cta: 'Contacter notre équipe',
      features: [
        'Commandes & Livreurs illimités',
        'Multi-boutiques & gestion d\'entrepôts',
        'Accès rôles personnalisés (Gérant, Préparateur, Chauffeur)',
        'Analyses financières avancées et audit des caisses',
        'Intégration API personnalisée',
        'Gestionnaire de compte dédié en Algérie'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span>Tarification Transparente en DZD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Des forfaits simples, sans frais cachés
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Payez en Dinar Algérien (DZD) via virement bancaire, BaridiMob ou chèque d'entreprise.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Facturation Mensuelle
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-13 h-7 bg-slate-200 rounded-full p-1 transition-colors relative cursor-pointer focus:outline-none"
              style={{ backgroundColor: isAnnual ? '#2563eb' : '#cbd5e1' }}
              aria-label="Toggle annual billing"
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-semibold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                Facturation Annuelle
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                -20% d'économie
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((p, idx) => {
            const price = isAnnual ? p.priceAnnual : p.priceMonthly;
            return (
              <div 
                key={idx}
                className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  p.popular 
                    ? 'bg-slate-900 text-white border-2 border-blue-600 shadow-xl shadow-blue-600/10 lg:-translate-y-2' 
                    : 'bg-slate-50 text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-sm">
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{p.name}</h3>
                    {p.popular && <Zap className="w-5 h-5 text-amber-400" />}
                  </div>

                  <p className={`text-xs mb-6 ${p.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                    {p.subtitle}
                  </p>

                  {/* Price display */}
                  <div className="mb-6 pb-6 border-b border-slate-200/20">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {price === 0 ? 'Gratuit' : formatDZD(price)}
                      </span>
                      {price > 0 && (
                        <span className={`text-xs font-medium ${p.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                          / mois
                        </span>
                      )}
                    </div>
                    {isAnnual && price > 0 && (
                      <div className="text-[11px] text-emerald-500 mt-1 font-medium">
                        Facturé annuellement (2 mois gratuits)
                      </div>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className={`text-xs font-bold uppercase tracking-wider ${p.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                      Inclus dans le forfait :
                    </p>
                    {p.features.map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-3 text-xs sm:text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${p.popular ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={p.popular ? 'text-slate-200' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => setCurrentView('signup')}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    p.popular 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30' 
                      : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                  }`}
                >
                  <span>{p.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Payment Methods info */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Paiement 100% sécurisé</span>
          </div>
          <span>•</span>
          <span>Facturation officielle en Dinars (DZD)</span>
          <span>•</span>
          <span>Activation immédiate de votre espace</span>
        </div>

      </div>
    </section>
  );
};
