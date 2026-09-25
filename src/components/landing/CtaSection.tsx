import React from 'react';
import { ArrowRight, CheckCircle2, Truck, ShieldCheck, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CtaSection: React.FC = () => {
  const { setCurrentView, loginDemo } = useApp();

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative ambient logistics shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-8">
        
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
          <Truck className="w-7 h-7" />
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Reprenez le contrôle de chaque commande et livraison
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Rejoignez les commerces et marques qui ont éliminé le chaos des cahiers et de WhatsApp grâce à WaselDZ.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setCurrentView('signup')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer hover:scale-[1.02]"
          >
            <span>Créer un compte WaselDZ</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={loginDemo}
            className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 text-base cursor-pointer backdrop-blur-xs"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>Tester la Démo Immédiatement</span>
          </button>
        </div>

        {/* Reassurance pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Installation en 2 minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sans engagement de durée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Données hébergées en toute sécurité</span>
          </div>
        </div>

      </div>
    </section>
  );
};
