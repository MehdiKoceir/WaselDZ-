import React from 'react';
import { useApp } from '../../context/AppContext';

export const LandingFooter: React.FC = () => {
  const { setCurrentView, loginDemo } = useApp();

  return (
    <footer className="bg-white text-slate-500 border-t border-slate-200 text-xs py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-[10px]">
              DZ
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                Wasel<span className="text-slate-500 font-medium">Logistics</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px] block">
                Réseau de distribution et de traçabilité 58 Wilayas Algérie
              </span>
            </div>
          </div>

          {/* Corporate Links */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600 text-xs font-medium">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Suivi d'expédition
            </button>
            <button 
              onClick={() => document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' })} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Barème 58 Wilayas
            </button>
            <button 
              onClick={loginDemo} 
              className="hover:text-slate-900 font-semibold transition-colors cursor-pointer text-slate-900"
            >
              Terminal Marchand Démo
            </button>
            <button 
              onClick={() => setCurrentView('signin')} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Espace Client Pro
            </button>
          </div>

        </div>

        {/* Legal & Regulatory notices */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
          <p>© {new Date().getFullYear()} Wasel Logistics Algeria. Plateforme conforme Loi n° 18-07 relative à la protection des données à caractère personnel.</p>
          <p>Supervision Centrale : Alger · Oran · Constantine</p>
        </div>
      </div>
    </footer>
  );
};
