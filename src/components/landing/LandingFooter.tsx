import React from 'react';
import { Truck, MapPin, Mail, Phone, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingFooter: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Wasel<span className="text-blue-500">DZ</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              La plateforme SaaS de gestion des commandes et livraisons conçue pour les commerçants et e-commerçants en Algérie 🇩🇿.
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Alger • Oran • Constantine • 58 Wilayas</span>
            </div>
          </div>

          {/* Solution Links */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Produit & Fonctionnalités
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-white transition-colors">Gestion des Commandes</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Pipeline de Livraison</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Attribution des Livreurs</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Réconciliation Cash on Delivery</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Statistiques & Analyse DZD</a></li>
            </ul>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Pour votre activité
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#business-types" className="hover:text-white transition-colors">Boutiques Prêt-à-porter</a></li>
              <li><a href="#business-types" className="hover:text-white transition-colors">Vendeurs Instagram & TikTok</a></li>
              <li><a href="#business-types" className="hover:text-white transition-colors">Restaurants & Fast-Food</a></li>
              <li><a href="#business-types" className="hover:text-white transition-colors">Électronique & High-Tech</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Tarifs en Dinars (DZD)</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-4">
              Assistance & Accès
            </h4>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>contact@waseldz.com</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+213 (0) 555 00 12 34</span>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setCurrentView('signin')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors cursor-pointer text-xs"
              >
                Espace Commerçant (Connexion)
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            © {new Date().getFullYear()} WaselDZ (وصل ديزاد) — Tous droits réservés.
          </div>
          <div className="flex items-center gap-1">
            <span>Fait avec fierté pour les entrepreneurs algériens</span>
            <span className="text-emerald-500">🇩🇿</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
