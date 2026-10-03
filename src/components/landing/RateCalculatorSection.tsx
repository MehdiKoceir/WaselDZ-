import React, { useState } from 'react';
import { 
  Calculator, 
  MapPin, 
  Clock, 
  Check, 
  Truck, 
  Building2,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { ALGERIAN_WILAYAS, formatDZD } from '../../data/algeriaData';

export const RateCalculatorSection: React.FC = () => {
  const [selectedCode, setSelectedCode] = useState('16'); // Default Alger

  const currentWilaya = ALGERIAN_WILAYAS.find(w => w.code === selectedCode) || ALGERIAN_WILAYAS[0];

  const homeFee = currentWilaya.defaultFee;
  const stopDeskFee = Math.max(300, homeFee - 150);

  const getEstimatedDelay = (zone: string) => {
    switch (zone) {
      case 'centre':
        return '24 heures (Service J+0 disponible sur Alger)';
      case 'est':
      case 'ouest':
        return '24 à 48 heures';
      case 'sud':
        return '48 à 72 heures';
      default:
        return '24 à 48 heures';
    }
  };

  return (
    <section id="rates" className="py-16 md:py-20 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            Barème Tarifaire Standardisé
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Simulation des tarifs d'expédition par wilaya.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Tarifs réglementés applicables aux colis standard jusqu'à 5 kg. Encaissement C.O.D et assurance inclus.
          </p>
        </div>

        {/* Calculator Frame */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-5 sm:p-7 max-w-3xl">
          
          <div className="space-y-6">
            
            {/* Wilaya Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase font-mono tracking-wider mb-2">
                Sélectionner la wilaya de destination :
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white border border-slate-300 rounded-md text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 cursor-pointer"
                >
                  {ALGERIAN_WILAYAS.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name} ({w.arabicName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rates Comparison Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Domicile */}
              <div className="p-5 rounded-md border-2 border-slate-900 bg-white flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-900">
                      Livraison à Domicile
                    </span>
                    <Truck className="w-4 h-4 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                      {formatDZD(homeFee)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Remise directe au destinataire</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-900" />
                    <span>Contact téléphonique avant passage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-900" />
                    <span>Encaissement sécurisé Cash / BaridiMob</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Stop-Desk */}
              <div className="p-5 rounded-md border border-slate-200 bg-white flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-600">
                      Point Relais (Stop-Desk)
                    </span>
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                      {formatDZD(stopDeskFee)}
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">Retrait en centre de tri de wilaya</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-600" />
                    <span>Avisage par SMS à réception au hub</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-600" />
                    <span>Mise en instance jusqu'à 7 jours</span>
                  </div>
                </div>
              </div>

            </div>

            {/* SLA Delay Indicator */}
            <div className="p-3.5 rounded bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Délai contractuel estimé ({currentWilaya.name}) :</span>
              </div>
              <strong className="text-slate-900 font-mono font-semibold">{getEstimatedDelay(currentWilaya.zone)}</strong>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
