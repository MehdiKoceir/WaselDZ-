import React from 'react';
import { Shirt, Utensils, ShoppingCart, Cpu, Apple, Store, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BusinessTypesSection: React.FC = () => {
  const { setCurrentView } = useApp();

  const businessTypes = [
    {
      title: 'Boutiques de Vêtements & Mode',
      icon: Shirt,
      color: 'from-pink-500/10 to-rose-500/10 text-rose-600',
      description: 'Prêt-à-porter, abayas, sneakers & robes de soirée vendus en boutique physique ou sur Instagram.',
      features: ['Gestion des tailles & coloris', 'Option d\'essayage à la livraison', 'Suivi anti-retour strict']
    },
    {
      title: 'Vendeurs E-Commerce & Réseaux',
      icon: ShoppingCart,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600',
      description: 'Boutiques en ligne, pages TikTok et vendeurs WhatsApp expédiant à travers les 58 wilayas.',
      features: ['Saisie express des commandes', 'Génération d\'étiquettes colis', 'Réconciliation BaridiMob & Cash']
    },
    {
      title: 'Restaurants, Fast-Food & Pâtisseries',
      icon: Utensils,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600',
      description: 'Livraison express locale de repas chauds, gâteaux traditionnels et commandes festives.',
      features: ['Délais de livraison stricts', 'Assignation coursiers moto', 'Calcul du trajet urbain']
    },
    {
      title: 'High-Tech & Électronique',
      icon: Cpu,
      color: 'from-cyan-500/10 to-blue-500/10 text-cyan-600',
      description: 'Smartphones, accessoires informatiques, trottinettes et matériel électroménager de valeur.',
      features: ['Suivi des numéros de série / SKU', 'Contrôle à l\'ouverture du colis', 'Preuve de livraison signée']
    },
    {
      title: 'Supérettes & Alimentation',
      icon: Apple,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
      description: 'Livraison de courses à domicile pour les familles d\'un même quartier ou commune.',
      features: ['Paniers multi-produits', 'Créneaux horaires précis', 'Encaissement rapide en Cash']
    },
    {
      title: 'Artisans, Cosmétique & Grossistes',
      icon: Store,
      color: 'from-purple-500/10 to-indigo-500/10 text-purple-600',
      description: 'Créateurs locaux de parfums, savons, artisanat algérien et fournisseurs professionnels.',
      features: ['Gestion des stocks en temps réel', 'Tarifs de livraison dégressifs', 'Fiches clients fidèles']
    }
  ];

  return (
    <section id="business-types" className="py-20 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span>Secteurs d'activité</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Adapté à chaque type de commerce en Algérie
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Que vous livriez 5 commandes par jour ou 200 colis quotidiens, WaselDZ s'adapte à vos besoins métier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTypes.map((b, i) => {
            const Icon = b.icon;
            return (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all hover:translate-y-[-2px] flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {b.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {b.features.map((f, fi) => (
                      <div key={fi} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Démarrer pour ce secteur</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
