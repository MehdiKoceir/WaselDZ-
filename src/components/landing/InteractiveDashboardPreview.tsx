import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Phone, 
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';

export const InteractiveDashboardPreview: React.FC = () => {
  const { loginDemo } = useApp();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'orders' | 'drivers'>('pipeline');
  const [demoFilterWilaya, setDemoFilterWilaya] = useState<string>('all');

  return (
    <section className="py-20 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aperçu Interactif en Direct</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explorez l'interface de travail de WaselDZ
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Une expérience fluide, réactive et ergonomique pensée pour vous faire gagner 3 heures par jour dans vos opérations.
          </p>
        </div>

        {/* Interactive Workspace Mock Container */}
        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 shadow-2xl overflow-hidden">
          
          {/* Top Mock Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                DZ
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>WaselDZ Console Pro</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    v2.4 Production
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Commerce : <span className="text-slate-200 font-medium">Boutique Mode Alger Express</span>
                </div>
              </div>
            </div>

            {/* Tab controls */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700 text-xs font-medium">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pipeline' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pipeline Livraisons
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tableau des Commandes
              </button>
              <button
                onClick={() => setActiveTab('drivers')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'drivers' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Flotte des Livreurs
              </button>
            </div>

            {/* Launch full dashboard CTA */}
            <button
              onClick={loginDemo}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ouvrir l'application</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Sandbox Body */}
          <div className="p-6 bg-slate-950/60 min-h-[380px]">
            
            {activeTab === 'pipeline' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Flux opérationnel temps réel (Aujourd'hui)</span>
                  <span className="text-emerald-400 font-mono">18 livraisons programmées</span>
                </div>

                {/* 4 Pipeline Columns */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  {/* Column 1: A préparer */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-300 pb-2 border-b border-slate-800">
                      <span>1. En préparation</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">2</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>DZ-1003</span>
                        <span className="text-blue-400">{formatDZD(13800)}</span>
                      </div>
                      <div className="text-slate-300">Karim Meziani</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400" /> Boumerdès (Boudouaou)
                      </div>
                      <div className="text-[10px] text-amber-300 font-medium">Colisage en cours</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>DZ-1005</span>
                        <span className="text-blue-400">{formatDZD(6800)}</span>
                      </div>
                      <div className="text-slate-300">Bilal Haddad</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400" /> Chlef (Ténès)
                      </div>
                      <div className="text-[10px] text-slate-400">Sneakers DZ Streetwear</div>
                    </div>
                  </div>

                  {/* Column 2: Assignées */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-300 pb-2 border-b border-slate-800">
                      <span>2. Prêtes / Assignées</span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">1</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>DZ-1004</span>
                        <span className="text-blue-400">{formatDZD(9150)}</span>
                      </div>
                      <div className="text-slate-300">Yasmine Kaci</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-purple-400" /> Oran (Bir El Djir)
                      </div>
                      <div className="text-[10px] text-purple-300 font-medium flex items-center gap-1">
                        <Truck className="w-3 h-3" /> Mohamed B. (Voiture)
                      </div>
                    </div>
                  </div>

                  {/* Column 3: En route */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-300 pb-2 border-b border-slate-800">
                      <span>3. En cours de livraison</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono">1</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>DZ-1002</span>
                        <span className="text-blue-400">{formatDZD(12900)}</span>
                      </div>
                      <div className="text-slate-300">Sarah Mansouri</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" /> Blida (Boufarik)
                      </div>
                      <div className="text-[10px] text-cyan-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Chauffeur à 15 min du client
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Livrées avec succès */}
                  <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-300 pb-2 border-b border-slate-800">
                      <span>4. Livrées & Encaissées</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">1</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>DZ-1001</span>
                        <span className="text-emerald-400">{formatDZD(13700)}</span>
                      </div>
                      <div className="text-slate-300">Amine Belkacem</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" /> Alger (El Biar)
                      </div>
                      <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Cash encaissé à la remise
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dernières commandes enregistrées</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDemoFilterWilaya('all')}
                      className={`px-2 py-1 rounded text-[11px] ${demoFilterWilaya === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Toutes les wilayas
                    </button>
                    <button 
                      onClick={() => setDemoFilterWilaya('16')}
                      className={`px-2 py-1 rounded text-[11px] ${demoFilterWilaya === '16' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Alger (16)
                    </button>
                    <button 
                      onClick={() => setDemoFilterWilaya('09')}
                      className={`px-2 py-1 rounded text-[11px] ${demoFilterWilaya === '09' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Blida (09)
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Client & Tél</th>
                        <th className="p-2.5">Wilaya</th>
                        <th className="p-2.5">Articles</th>
                        <th className="p-2.5">Montant DZD</th>
                        <th className="p-2.5">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                      <tr>
                        <td className="p-2.5 font-bold text-white font-mono">DZ-1001</td>
                        <td className="p-2.5">Amine Belkacem (0552...)</td>
                        <td className="p-2.5">16 - Alger</td>
                        <td className="p-2.5">Abaya Brodée + Sac Cuir</td>
                        <td className="p-2.5 font-bold text-emerald-400">{formatDZD(13700)}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                            Livrée
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white font-mono">DZ-1002</td>
                        <td className="p-2.5">Sarah Mansouri (0771...)</td>
                        <td className="p-2.5">09 - Blida</td>
                        <td className="p-2.5">2x Sneakers DZ</td>
                        <td className="p-2.5 font-bold text-cyan-400">{formatDZD(12900)}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                            En route
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-white font-mono">DZ-1007</td>
                        <td className="p-2.5">Samir Bouzid (0670...)</td>
                        <td className="p-2.5">25 - Constantine</td>
                        <td className="p-2.5">2x Montre Connectée Pro</td>
                        <td className="p-2.5 font-bold text-blue-400">{formatDZD(11500)}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                            Confirmée CIB
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'drivers' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Karim Benacer</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Disponible</span>
                  </div>
                  <div className="text-slate-400 text-xs">Moto • Alger Centre & Hydra</div>
                  <div className="text-slate-300">Tél : 0550 44 88 12</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
                    <span>148 livraisons</span>
                    <span className="text-amber-400">★ 4.9/5</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Yacine Larbi</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">En course</span>
                  </div>
                  <div className="text-slate-400 text-xs">Fourgon • Blida / Boumerdès</div>
                  <div className="text-slate-300">Tél : 0770 19 28 37</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
                    <span>230 livraisons</span>
                    <span className="text-amber-400">★ 4.8/5</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">Mohamed Brahimi</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Disponible</span>
                  </div>
                  <div className="text-slate-400 text-xs">Voiture • Oran & Ouest</div>
                  <div className="text-slate-300">Tél : 0661 55 90 23</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
                    <span>95 livraisons</span>
                    <span className="text-amber-400">★ 4.95/5</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom interactive teaser */}
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              Voulez-vous tester l'ajout d'une vraie commande et l'assignation de livreurs ?
            </span>
            <button
              onClick={loginDemo}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Accéder à la démo complète</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
