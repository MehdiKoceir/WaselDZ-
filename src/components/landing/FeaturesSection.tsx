import React, { useState } from 'react';
import { 
  PackageCheck, 
  MapPin, 
  Truck, 
  Users, 
  BarChart3, 
  Check, 
  Layers, 
  CreditCard, 
  Clock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FeaturesSection: React.FC = () => {
  const { setCurrentView } = useApp();
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const features = [
    {
      id: 'orders',
      title: 'Gestion des Commandes',
      badge: 'Cœur opérationnel',
      icon: PackageCheck,
      color: 'blue',
      description: 'Centralisez toutes vos commandes dans un registre digital unique adapté aux adresses et habitudes en Algérie.',
      highlights: [
        'Création et modification de commandes en 30 secondes',
        'Coordonnées clients complètes (Nom, tél mobile, wilaya et commune)',
        'Détails des articles, quantités et calcul automatique du montant en DZD',
        'Frais de livraison personnalisés par wilaya',
        'Suivi du mode de paiement : Cash à la livraison (COD) ou BaridiMob'
      ],
      previewStats: '100% traçabilité'
    },
    {
      id: 'tracking',
      title: 'Suivi des Livraisons',
      badge: 'Pipeline dynamique',
      icon: MapPin,
      color: 'cyan',
      description: 'Un pipeline visuel clair pour suivre chaque colis de sa réception jusqu\'à la remise en main propre.',
      highlights: [
        'Statuts séquentiels : Nouvelle → Confirmée → En préparation → Assignée → En route → Livrée',
        'Gestion des aléas : Client injoignable, Échouée ou Retournée au stock',
        'Historique horodaté avec notes internes pour chaque changement d\'état',
        'Filtrage instantané par wilaya (Alger, Blida, Oran, etc.) et par statut',
        'Alerte immédiate pour relancer les clients absents'
      ],
      previewStats: '6 étapes claires'
    },
    {
      id: 'drivers',
      title: 'Gestion des Livreurs',
      badge: 'Flotte & Attribution',
      icon: Truck,
      color: 'indigo',
      description: 'Gérez vos livreurs internes ou partenaires, assignez les colis et mesurez leur ponctualité.',
      highlights: [
        'Profils détaillés avec type de véhicule (Moto, Voiture, Fourgon)',
        'Statut de disponibilité en temps réel (Disponible, En course, Hors-ligne)',
        'Assignation de lots de commandes en 1 clic',
        'Historique des courses réussies et des retours par livreur',
        'Lien WhatsApp et appel direct pour communiquer avec le chauffeur'
      ],
      previewStats: 'Assignation en 1 clic'
    },
    {
      id: 'customers',
      title: 'Gestion des Clients',
      badge: 'CRM & Fidélité',
      icon: Users,
      color: 'emerald',
      description: 'Conservez l\'historique d\'achat de chaque client algérien pour réduire les retours et booster vos ventes.',
      highlights: [
        'Fiches clients avec adresses préférées et historique de commandes',
        'Suivi du panier moyen et du total dépensé en DZD',
        'Notes personnalisées (ex: "Appeler avant 14h", "Habite au 3ème étage")',
        'Identification des clients réguliers et fiables (VIP)',
        'Exportation et recherche rapide par numéro de téléphone'
      ],
      previewStats: 'Moins de retours'
    },
    {
      id: 'analytics',
      title: 'Analytique & Finance',
      badge: 'Pilotage & Chiffres',
      icon: BarChart3,
      color: 'amber',
      description: 'Prenez les bonnes décisions grâce à des statistiques claires sur votre chiffre d\'affaires et votre rentabilité.',
      highlights: [
        'Tableau de bord des KPIs : Commandes totales, livrées, en cours et annulées',
        'Suivi du chiffre d\'affaires net et des frais d\'expédition encaissés',
        'Taux de réussite des livraisons calculé en continu',
        'Répartition des ventes par Wilaya pour cibler votre publicité',
        'Filtres temporels : Aujourd\'hui, cette semaine, ce mois'
      ],
      previewStats: 'Vue 360° en DZD'
    }
  ];

  const current = features[selectedPillar];

  return (
    <section id="features" className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span>Fonctionnalités Clés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tout ce dont votre commerce a besoin pour livrer sans stress
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Un écosystème complet conçu pour les vendeurs Instagram, les boutiques physiques et les e-commerces d'Algérie.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 mb-10 gap-2 no-scrollbar">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = selectedPillar === idx;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedPillar(idx)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Feature Card Showcase */}
        <div className="max-w-5xl mx-auto bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {current.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">WaselDZ Core Suite</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {current.title}
              </h3>

              <p className="text-slate-600 text-base leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setCurrentView('signup')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Essayer ce module gratuitement</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Mini Visual */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <current.icon className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-sm text-slate-900">{current.title}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {current.previewStats}
                </span>
              </div>

              {selectedPillar === 0 && (
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                    <span className="font-semibold text-slate-900">Nouvelle commande DZ-1014</span>
                    <span className="text-blue-600 font-bold">14 500 DA</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between">
                    <span>Destinataire : Bilal Amrani (0550...)</span>
                    <span className="text-slate-500">16 - Alger</span>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex justify-between font-medium">
                    <span>Mode : Cash à la livraison</span>
                    <span>Colisage prêt</span>
                  </div>
                </div>
              )}

              {selectedPillar === 1 && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600">1. Commande reçue</span>
                    <span className="text-emerald-600 font-bold">10:15</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600">2. Confirmée au téléphone</span>
                    <span className="text-emerald-600 font-bold">11:00</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50">
                    <span className="text-slate-600">3. Assignée à Karim (Livreur)</span>
                    <span className="text-emerald-600 font-bold">11:30</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200">
                    <span>4. En cours de livraison à domicile</span>
                    <span>En direct</span>
                  </div>
                </div>
              )}

              {selectedPillar === 2 && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                    <span className="font-bold text-slate-900">Karim Benacer</span>
                    <span className="text-emerald-600 font-semibold">Disponible (Moto)</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                    <span className="font-bold text-slate-900">Yacine Larbi</span>
                    <span className="text-amber-600 font-semibold">En course (Fourgon)</span>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-center font-medium">
                    Notification automatique envoyée au livreur par WhatsApp
                  </div>
                </div>
              )}

              {selectedPillar === 3 && (
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-slate-900">Sarah Mansouri</div>
                    <div className="text-slate-500">0771 99 88 77 • Boufarik, Blida</div>
                    <div className="mt-2 text-emerald-700 font-semibold">
                      3 commandes passées • 0 retour • Client VIP
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 italic">
                    Note : "Toujours appeler 30min avant pour préparer le paiement en Cash."
                  </div>
                </div>
              )}

              {selectedPillar === 4 && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Taux de succès de livraison</span>
                    <span className="font-bold text-emerald-600">96.4%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Chiffre d'Affaires</span>
                    <span className="font-bold text-slate-900">1 420 000 DA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frais de livraison perçus</span>
                    <span className="font-bold text-blue-600">98 500 DA</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
