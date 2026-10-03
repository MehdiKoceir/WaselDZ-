import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SimpleContactSection: React.FC = () => {
  const { setCurrentView, loginDemo } = useApp();

  return (
    <section id="contact" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-slate-900 rounded-xl p-6 sm:p-10 text-white shadow-sm border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            
            <div className="space-y-4 max-w-xl">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Centre d'Opérations & Dispatch
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Assistance opérationnelle & ouverture de compte B2B.
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Nos régulateurs logistiques sont joignables directement pour coordonner vos ramassages, 
                gérer les anomalies d'acheminement et conventionner votre volume d'expéditions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 bg-slate-800/80 rounded border border-slate-700/60">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Centrale Téléphonique</span>
                  <strong className="text-white text-sm font-mono mt-0.5 block">+213 (0) 555 12 34 56</strong>
                  <span className="text-slate-400 text-[11px]">Samedi au Jeudi · 08h00 - 18h30</span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded border border-slate-700/60">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Dispatch & Réclamations</span>
                  <strong className="text-white text-sm font-mono mt-0.5 block">dispatch@waseldz.com</strong>
                  <span className="text-slate-400 text-[11px]">Accusé de traitement sous 2 heures</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Plateformes de tri : Alger (Oued Smar), Oran (Es Senia), Constantine (Ain Smara).</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="w-full md:w-auto flex flex-col gap-2.5 shrink-0">
              <button
                type="button"
                onClick={loginDemo}
                className="w-full px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Accéder au Terminal Marchand</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('signin')}
                className="w-full px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-xs transition-colors border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Connexion Espace Client Pro</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
