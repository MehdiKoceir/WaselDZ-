import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  TrendingUp, 
  UserCheck, 
  Play, 
  Filter,
  Package,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';

export const HeroSection: React.FC = () => {
  const { setCurrentView, loginDemo } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'drivers' | 'stats'>('orders');

  return (
    <section className="relative pt-8 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-slate-100/60 border-b border-slate-200/70">
      {/* Background soft ambient logistics grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f018_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f018_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs sm:text-sm font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Plateforme Logistique Dédiée au Marché Algérien 🇩🇿</span>
            <span className="text-slate-400">|</span>
            <span className="text-blue-600 font-medium">58 Wilayas</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-10 md:mb-14">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Gérez chaque livraison.{' '}
            <span className="text-blue-600 inline-block">
              Développez votre activité.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            WaselDZ aide les commerçants, marques et e-commerçants algériens à gérer les commandes,
            assigner les livreurs et sécuriser le paiement à la livraison (Cash on Delivery & BaridiMob)
            depuis une plateforme tout-en-un.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => setCurrentView('signup')}
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer hover:translate-y-[-1px]"
            >
              <span>Démarrer gratuitement</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={loginDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2 text-base cursor-pointer hover:border-slate-400"
            >
              <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span>Tester la Démo Interactive</span>
            </button>
          </div>

          {/* Small feature bullets */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sans carte de crédit requise</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Paiement à la livraison & BaridiMob</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Compatible smartphones livreurs</span>
            </div>
          </div>
        </div>

        {/* Hero Product Visual Preview */}
        <div className="relative mx-auto max-w-5xl">
          {/* Subtle outer glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-500/20 rounded-2xl blur-xl opacity-70" />

          {/* SaaS Frame Container */}
          <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden">
            
            {/* Window titlebar */}
            <div className="px-4 py-3 bg-slate-900 text-slate-200 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="ml-3 hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-slate-200 font-semibold">app.waseldz.com</span>
                  <span>/</span>
                  <span className="text-blue-400">dashboard</span>
                </div>
              </div>

              {/* View Switcher Tabs inside Mockup */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-medium text-slate-300">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1 rounded transition-colors ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-white'}`}
                >
                  Commandes récentes
                </button>
                <button
                  onClick={() => setActiveTab('drivers')}
                  className={`px-3 py-1 rounded transition-colors ${activeTab === 'drivers' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-white'}`}
                >
                  Flotte livreurs
                </button>
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-1 rounded transition-colors ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-xs' : 'hover:text-white'}`}
                >
                  KPIs du jour
                </button>
              </div>

              {/* Live Status indicator */}
              <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>En direct</span>
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="p-4 sm:p-6 bg-slate-50/50 space-y-5">
              
              {/* Top Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                    <span>Commandes du jour</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">42 colis</div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
                    <TrendingUp className="w-3 h-3" /> +18% vs hier
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                    <span>Livrées avec succès</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-700">38 colis</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Taux succès : <span className="text-emerald-600 font-bold">95.2%</span>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                    <span>En cours de route</span>
                    <Clock className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-700">3 colis</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    2 livreurs actifs sur le terrain
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                    <span>Encaissements (DZD)</span>
                    <span className="text-xs font-bold text-blue-600">DA</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">
                    {formatDZD(248500)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Cash & BaridiMob réconciliés
                  </div>
                </div>
              </div>

              {/* Dynamic View Section based on selected tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">Dernières expéditions</h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        Aujourd'hui
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5" />
                      <span>Filtré : Alger & Blida</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80">
                        <tr>
                          <th className="px-4 py-2.5">Réf. & Client</th>
                          <th className="px-4 py-2.5">Destination</th>
                          <th className="px-4 py-2.5">Montant & Mode</th>
                          <th className="px-4 py-2.5">Livreur assigné</th>
                          <th className="px-4 py-2.5">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">DZ-1001</div>
                            <div className="text-slate-500 font-medium">Amine Belkacem</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-slate-900 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-blue-600" />
                              <span>16 - Alger (El Biar)</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">Livraison à domicile</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{formatDZD(13700)}</div>
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              Cash à la livraison
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                                KB
                              </div>
                              <span className="font-medium text-slate-800">Karim (Moto)</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ● Livrée avec succès
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">DZ-1002</div>
                            <div className="text-slate-500 font-medium">Sarah Mansouri</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-slate-900 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                              <span>09 - Blida (Boufarik)</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">Rue de la Gare</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{formatDZD(12900)}</div>
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700">
                              BaridiMob
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-[10px]">
                                YL
                              </div>
                              <span className="font-medium text-slate-800">Yacine (Fourgon)</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                              ● En cours de route
                            </span>
                          </td>
                        </tr>

                        <tr className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">DZ-1004</div>
                            <div className="text-slate-500 font-medium">Yasmine Kaci</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-slate-900 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-purple-600" />
                              <span>31 - Oran (Bir El Djir)</span>
                            </div>
                            <div className="text-slate-400 text-[11px]">Résidence El Bahia</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-900">{formatDZD(9150)}</div>
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                              Cash à la livraison
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                                MB
                              </div>
                              <span className="font-medium text-slate-800">Mohamed (Voiture)</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              ● Assignée livreur
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'drivers' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Karim Benacer</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Disponible
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">Moto • Zone Alger Centre</div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="text-slate-600 font-medium">148 livraisons</span>
                      <span className="text-amber-600 font-bold">★ 4.9 / 5</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Yacine Larbi</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        En course (4 colis)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">Fourgon • Blida / Boumerdès</div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="text-slate-600 font-medium">230 livraisons</span>
                      <span className="text-amber-600 font-bold">★ 4.8 / 5</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Mohamed Brahimi</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Disponible
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">Voiture • Oran & Environs</div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="text-slate-600 font-medium">95 livraisons</span>
                      <span className="text-amber-600 font-bold">★ 4.95 / 5</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-bold text-sm text-slate-900">Performance par Wilaya</h5>
                    <span className="text-xs text-slate-500">Top destinations du mois</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>16 - Alger (142 colis)</span>
                        <span className="text-blue-600">97% de succès</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '97%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>09 - Blida (86 colis)</span>
                        <span className="text-blue-600">94% de succès</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-slate-700 mb-1">
                        <span>31 - Oran (74 colis)</span>
                        <span className="text-blue-600">95% de succès</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '95%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Interactive Callout */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-3.5 sm:p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Testez WaselDZ dès maintenant</div>
                    <div className="text-xs text-blue-100">
                      Explorez l'espace commerçant avec données réelles sans engagement.
                    </div>
                  </div>
                </div>
                <button
                  onClick={loginDemo}
                  className="px-4 py-2 bg-white text-blue-800 hover:bg-blue-50 font-bold rounded-lg text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  Ouvrir le Tableau de Bord
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
