import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Store, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Navigation,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STATUS_LABELS, formatDZD } from '../../data/algeriaData';
import { Order } from '../../types';

interface SimpleHeroSectionProps {
  onOpenTrackingModal: (orderId: string) => void;
}

export const SimpleHeroSection: React.FC<SimpleHeroSectionProps> = ({ onOpenTrackingModal }) => {
  const { orders, loginDemo, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'tracking' | 'merchant'>('tracking');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample tracking codes with professional labeling
  const sampleTrackingNumbers = [
    { label: 'Alger Centre', code: 'WDZ-16-0926-001' },
    { label: 'Blida Hub', code: 'WDZ-09-0926-002' },
    { label: 'Oran Express', code: 'WDZ-31-0926-003' },
  ];

  const handleSearch = (codeToSearch?: string) => {
    const term = (codeToSearch ?? searchQuery).trim().toLowerCase();
    setHasSearched(true);

    if (!term) {
      setSearchedOrder(null);
      return;
    }

    const cleanTerm = term.replace(/[\s\-\.]/g, '');
    const found = orders.find(o => 
      o.trackingNumber.toLowerCase().includes(term) ||
      o.id.toLowerCase() === term ||
      o.customerPhone.replace(/[\s\-\.]/g, '').includes(cleanTerm)
    );

    setSearchedOrder(found || null);
  };

  const handleSampleClick = (code: string) => {
    setSearchQuery(code);
    handleSearch(code);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Executive Header & Value Proposition */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 tracking-wider uppercase">
            <span>Réseau Logistique Algérie</span>
            <span aria-hidden="true">·</span>
            <span>58 Wilayas</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 font-semibold">Traçabilité & C.O.D Certifié</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Infrastructure logistique & gestion des flux de livraison.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Plateforme centralisée pour les expéditeurs professionnels et leurs destinataires. 
            Suivi des bordereaux, traçabilité temps réel et sécurisation des règlements à la livraison (Cash & BaridiMob).
          </p>
        </div>

        {/* Technical Freight Operations Console */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 max-w-3xl mx-auto">
          
          {/* Segmented Mode Selector */}
          <div className="flex p-1 bg-slate-200/80 rounded-lg mb-5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-slate-700" />
              <span>Suivi d'expédition (Bordereau / Téléphone)</span>
            </button>

            <button
              onClick={() => setActiveTab('merchant')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-all cursor-pointer ${
                activeTab === 'merchant'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-slate-700" />
              <span>Espace Expéditeur & Marchand</span>
            </button>
          </div>

          {/* Mode 1: Search Console */}
          {activeTab === 'tracking' && (
            <div className="space-y-4">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Numéro de bordereau (ex: WDZ-16-0926-001) ou téléphone..."
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-md text-xs sm:text-sm font-mono text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Rechercher le colis</span>
                </button>
              </form>

              {/* Sample codes */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="text-slate-600 font-medium">Bordereaux de test :</span>
                {sampleTrackingNumbers.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => handleSampleClick(s.code)}
                    className="px-2 py-0.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 rounded font-mono text-[11px] transition-colors cursor-pointer"
                  >
                    {s.code} <span className="text-slate-400 font-sans">({s.label})</span>
                  </button>
                ))}
              </div>

              {/* Operational Manifest Result */}
              {hasSearched && (
                <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-150">
                  {searchedOrder ? (
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-xs">
                      
                      {/* Manifest Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {searchedOrder.trackingNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            STATUS_LABELS[searchedOrder.status]?.bg || 'bg-slate-50'
                          } ${
                            STATUS_LABELS[searchedOrder.status]?.text || 'text-slate-700'
                          } ${
                            STATUS_LABELS[searchedOrder.status]?.border || 'border-slate-200'
                          }`}>
                            {STATUS_LABELS[searchedOrder.status]?.label || searchedOrder.status}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                            Montant C.O.D à percevoir
                          </span>
                          <span className="text-sm font-bold font-mono text-slate-900">
                            {formatDZD(searchedOrder.totalAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Manifest Logistics Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Point de livraison</span>
                          <strong className="text-slate-900 block truncate mt-0.5">
                            {searchedOrder.commune}, {searchedOrder.wilaya}
                          </strong>
                          <span className="text-slate-500 text-[11px] block truncate">{searchedOrder.customerAddress}</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Mode de règlement</span>
                          <strong className="text-slate-900 block mt-0.5">
                            {searchedOrder.paymentMethod === 'cod' ? 'Espèces à la livraison' : 'BaridiMob / CCP'}
                          </strong>
                          <span className="text-emerald-700 text-[11px] block font-medium">Validation à remise</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Horodatage système</span>
                          <strong className="text-slate-900 block font-mono mt-0.5">
                            {new Date(searchedOrder.updatedAt).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </strong>
                          <span className="text-slate-500 text-[11px] block">Réf : {searchedOrder.id}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenTrackingModal(searchedOrder.id)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Télémétrie GPS en direct</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="p-3 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Aucun bordereau enregistré pour cette référence. Vérifiez la saisie ou contactez la centrale au <strong>0555 12 34 56</strong>.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Merchant Portal Direct Access */}
          {activeTab === 'merchant' && (
            <div className="space-y-4 py-1">
              <p className="text-xs text-slate-600 leading-relaxed">
                Accès direct au terminal de gestion pour expéditeurs, e-commerçants et distributeurs agréés. 
                Pilotez vos ramassages, vos remises en banque C.O.D et l'édition de vos bordereaux normalisés.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={loginDemo}
                  className="p-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-left transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-300">Accès Instantané</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Ouvrir la Console Démo</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Explorez l'espace marchand avec données certifiées</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('signup')}
                  className="p-4 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 text-left transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Ouverture Compte</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Inscrire mon Entreprise</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Créer un compte expéditeur professionnel</p>
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 3 Executive SLA Commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8 pt-6 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span>Clôture C.O.D & reversement J+1</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span>Ramassage quotidien sur site B2B</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span>Support opérations dédié 6j/7</span>
          </div>
        </div>

      </div>
    </section>
  );
};
