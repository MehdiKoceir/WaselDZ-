import React from 'react';
import { XCircle, CheckCircle, ArrowRight, MessageSquare, FileSpreadsheet, PhoneMissed, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProblemSection: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span>Le problème du quotidien</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            La gestion manuelle de livraison vous fait perdre temps et argent
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Messages WhatsApp perdus, numéros de téléphone mal notés, livreurs perdus en route et encaissements Cash introuvables : la réalité sans système centralisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Chaos / Manual side */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl border border-rose-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Sans WaselDZ (Gestion Manuelle)</h3>
                <p className="text-xs text-rose-600 font-medium">Frustrant, chronophage & source d'erreurs</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Commandes éparpillées</strong>
                  Messages Instagram, audios WhatsApp, SMS et appels non enregistrés.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <PhoneMissed className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Clients injoignables & retours non maîtrisés</strong>
                  Le livreur arrive sans prévenir, le client est absent, le colis revient sans traçabilité.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Cahiers & Fichiers Excel désynchronisés</strong>
                  Temps infini passé chaque soir à recalculer qui a payé en Cash et qui a payé par BaridiMob.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <XCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Aucune visibilité sur la rentabilité</strong>
                  Impossible de savoir quel livreur est le plus efficace ou quelles wilayas rapportent le plus.
                </div>
              </li>
            </ul>
          </div>

          {/* Solution / WaselDZ side */}
          <div className="bg-white p-7 sm:p-8 rounded-2xl border border-blue-300 shadow-md relative overflow-hidden bg-gradient-to-b from-white to-blue-50/20">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Avec WaselDZ</h3>
                <p className="text-xs text-blue-700 font-medium">Contrôle total, automatisé & instantané</p>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Un seul tableau de bord centralisé</strong>
                  Toutes vos commandes saisies ou importées avec wilaya, commune, contact et produits.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Assignation livreur en 1 clic</strong>
                  Attribuez instantanément chaque colis au bon livreur avec fiche adresse et contact direct.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Pipeline de suivi de A à Z</strong>
                  Nouvelle → Confirmée → En préparation → Assignée → En route → Livrée.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-slate-900 block">Réconciliation financière en Dinar (DZD)</strong>
                  Total encaissé en Cash à la livraison et paiements électroniques clairs et sans écart.
                </div>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Prêt à passer au digital ?</span>
              <button
                onClick={() => setCurrentView('signup')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Créer mon compte WaselDZ <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
