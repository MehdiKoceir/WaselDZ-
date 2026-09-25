import React, { useState } from 'react';
import { Truck, ArrowRight, Menu, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingNavbar: React.FC = () => {
  const { setCurrentView, loginDemo } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  Wasel<span className="text-blue-600">DZ</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🇩🇿 Algérie
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Chaque livraison sous contrôle
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => scrollToSection('features')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Fonctionnalités
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Comment ça marche
            </button>
            <button 
              onClick={() => scrollToSection('business-types')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Pour qui ?
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Tarifs
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setCurrentView('signin')}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Se connecter
            </button>
            <button
              onClick={loginDemo}
              className="px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              title="Tester directement l'espace commerçant avec données démo"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Accès Démo Direct
            </button>
            <button
              onClick={() => setCurrentView('signup')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 rounded-lg transition-all flex items-center gap-2 cursor-pointer hover:shadow-md"
            >
              <span>Démarrer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={loginDemo}
              className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md"
            >
              Démo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
          <button 
            onClick={() => scrollToSection('features')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Fonctionnalités
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Comment ça marche
          </button>
          <button 
            onClick={() => scrollToSection('business-types')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Pour les commerces
          </button>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            Tarifs (DZD)
          </button>
          <button 
            onClick={() => scrollToSection('faq')}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-blue-600"
          >
            FAQ
          </button>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView('signin'); }}
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Se connecter
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setCurrentView('signup'); }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-blue-600 rounded-lg flex items-center justify-center gap-2"
            >
              <span>Créer mon compte</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
