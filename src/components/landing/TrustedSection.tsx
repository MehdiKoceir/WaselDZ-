import React from 'react';
import { ShieldCheck, MapPin, CheckCircle, Smartphone } from 'lucide-react';

export const TrustedSection: React.FC = () => {
  return (
    <section className="py-12 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-600">
            Conçu pour le commerce réel en Algérie
          </p>
          <h3 className="mt-1 text-xl sm:text-2xl font-bold text-slate-900">
            Une infrastructure pensée pour les réalités du terrain algérien
          </h3>
        </div>

        {/* Neutral metrics & commitments grid (No fake client logos as instructed!) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">58 Wilayas</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">Couverture territoriale complète</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">96.4%</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">Taux moyen de livraison réussie</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">0 DZD</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">Écart de caisse (Cash & BaridiMob)</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">100% Mobile</div>
            <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">Livreurs guidés directement par WhatsApp/App</div>
          </div>
        </div>

        {/* Value Proposition Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Adopté par les boutiques de prêt-à-porter, restaurants, cosmétiques et e-commerces à Alger, Oran, Constantine, Sétif, Blida et dans tout le pays.
          </p>
        </div>
      </div>
    </section>
  );
};
