import React, { useState } from 'react';
import { ArrowRight, Menu, X, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingNavbar: React.FC = () => {
  const { setCurrentView, loginDemo } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single Brand Wordmark (High-end freight identity) */}
          <div 
            onClick={() => scrollTo('top')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider transition-colors group-hover:bg-blue-900">
              DZ
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                Wasel<span className="text-slate-500 font-medium">Logistics</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
                58 Wilayas Distribution
              </span>
            </div>
          </div>

          {/* Zone 2: 4 Clean Nav Links with subtle underline hover */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <button 
              onClick={() => scrollTo('top')}
              className="hover:text-slate-900 transition-colors cursor-pointer tracking-wide"
            >
              Suivi d'expédition
            </button>
            <button 
              onClick={() => scrollTo('services')}
              className="hover:text-slate-900 transition-colors cursor-pointer tracking-wide"
            >
              Solutions Entreprise
            </button>
            <button 
              onClick={() => scrollTo('rates')}
              className="hover:text-slate-900 transition-colors cursor-pointer tracking-wide"
            >
              Barème 58 Wilayas
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="hover:text-slate-900 transition-colors cursor-pointer tracking-wide"
            >
              Support Opérationnel
            </button>
          </nav>

          {/* Zone 3: Executive Pro Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={loginDemo}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-300 transition-all cursor-pointer whitespace-nowrap"
            >
              Tester Démo Marchand
            </button>

            <button
              onClick={() => setCurrentView('signin')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-xs"
            >
              <span>Espace Client / Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={loginDemo}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md border border-slate-200"
            >
              Démo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <button 
            onClick={() => scrollTo('top')}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Suivi d'expédition
          </button>
          <button 
            onClick={() => scrollTo('services')}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Solutions Entreprise
          </button>
          <button 
            onClick={() => scrollTo('rates')}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Barème 58 Wilayas
          </button>
          <button 
            onClick={() => scrollTo('contact')}
            className="block w-full text-left py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Support Opérationnel
          </button>
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={loginDemo}
              className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-md border border-slate-200"
            >
              Tester Démo
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView('signin'); }}
              className="flex-1 py-2 text-center text-xs font-semibold text-white bg-slate-900 rounded-md"
            >
              Connexion Pro
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
