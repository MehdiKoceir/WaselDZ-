import React from 'react';
import { ShoppingBag, SlidersHorizontal, UserPlus, Navigation, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HowItWorksSection: React.FC = () => {
  const { setCurrentView } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Recevoir (Receive)',
      icon: ShoppingBag,
      desc: 'Réceptionnez vos commandes issues d\'Instagram, TikTok, WhatsApp, site web ou téléphone et saisissez-les rapidement.',
      badge: 'Capture immédiate',
    },
    {
      num: '02',
      title: 'Gérer (Manage)',
      icon: SlidersHorizontal,
      desc: 'Confirmez la commande avec le client, vérifiez la wilaya et la commune, puis préparez le colis en stock.',
      badge: 'Contrôle & Stock',
    },
    {
      num: '03',
      title: 'Assigner (Assign)',
      icon: UserPlus,
      desc: 'Désignez le livreur ou le coursier le plus adapté selon la zone géographique (Alger centre, Ouest, Est, etc.).',
      badge: 'Dispatch intelligent',
    },
    {
      num: '04',
      title: 'Suivre (Track)',
      icon: Navigation,
      desc: 'Suivez le statut d\'acheminement en temps réel, gérez les éventuels reports de rendez-vous et avertissez le client.',
      badge: 'Zéro angle mort',
    },
    {
      num: '05',
      title: 'Livrer & Encaisser (Deliver)',
      icon: CheckCircle2,
      desc: 'Colis remis en main propre, encaissement du Cash à la livraison ou BaridiMob validé sans erreur de caisse.',
      badge: 'Succès garanti',
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>Cycle Opérationnel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comment fonctionne WaselDZ
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            De la commande client jusqu'à l'encaissement de votre argent : un parcours sans friction en 5 étapes clés.
          </p>
        </div>

        {/* 5 Steps Linear Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-blue-600 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 mb-2">
                    {step.badge}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-blue-600">
                  <span>Étape {index + 1}/5</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom banner for registration */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base sm:text-lg text-slate-900">
              Prêt à fluidifier vos expéditions dès aujourd'hui ?
            </h4>
            <p className="text-xs sm:text-sm text-slate-500">
              Aucune installation logicielle compliquée. Fonctionne directement sur navigateur et smartphone.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('signup')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            Configurer mon commerce
          </button>
        </div>

      </div>
    </section>
  );
};
