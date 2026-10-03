import React from 'react';
import { 
  Package, 
  Store, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileCheck2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickNeedsSection: React.FC = () => {
  const { loginDemo } = useApp();

  return (
    <section id="services" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section title */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            Architecture des Solutions
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Des processus logistiques conçus pour la performance.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Des circuits courts, une traçabilité rigoureuse et un contrôle financier strict pour chaque flux en Algérie.
          </p>
        </div>

        {/* 3 Executive Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Destinataires */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-400">01</span>
                <Package className="w-4 h-4 text-slate-700" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Destinataires & Clients Finaux
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Réception sécurisée sans contrainte technique ni création de compte obligatoire.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">·</span>
                  <span>Notification par SMS et contact téléphonique préalable par le livreur.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">·</span>
                  <span>Règlement à réception en espèces ou par virement BaridiMob sécurisé.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">·</span>
                  <span>Possibilité de remise à domicile ou retrait en point relais (Stop-Desk).</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>Accéder au formulaire de suivi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: E-Commerce & Expéditeurs */}
          <div className="bg-white border-2 border-slate-900 rounded-lg p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-900">02</span>
                <Store className="w-4 h-4 text-slate-900" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Expéditeurs & Boutiques E-Commerce
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Gestion automatisée de vos expéditions et élimination des litiges de reversement.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-slate-900 font-mono text-[10px] mt-0.5">·</span>
                  <span>Ramassage quotidien sur site ou en dépôt logistique régional.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-900 font-mono text-[10px] mt-0.5">·</span>
                  <span>Édition automatisée des bordereaux normalisés avec code-barres.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-900 font-mono text-[10px] mt-0.5">·</span>
                  <span>Réconciliation financière C.O.D transparente et reversements réguliers.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={loginDemo}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Tester la console marchande</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Réseau de Flotte */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-slate-400">03</span>
                <Truck className="w-4 h-4 text-slate-700" />
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Flotte Opérationnelle 58 Wilayas
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Maillage complet des wilayas avec traçabilité télémétrique des tournées.
              </p>

              <div className="mt-5 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">·</span>
                  <span>Hubs de transit régionaux connectés (Alger, Oran, Constantine, Sétif).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">·</span>
                  <span>Délais de livraison : 24h sur le Centre, 24h à 48h Est/Ouest.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-slate-400 font-mono text-[10px] mt-0.5">·</span>
                  <span>Gestion rigoureuse des retours et motifs de non-remise certifiés.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href="#rates"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <span>Consulter la grille tarifaire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
