import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  DollarSign, 
  Package, 
  Truck, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { Order, Driver } from '../../types';
import { exportOrdersToCsv } from '../../utils/csvExport';
import { formatDZD } from '../../data/algeriaData';
import { useApp } from '../../context/AppContext';

interface ExportOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredOrders: Order[];
  selectedOrders: Order[];
  drivers: Driver[];
}

export const ExportOrdersModal: React.FC<ExportOrdersModalProps> = ({
  isOpen,
  onClose,
  filteredOrders,
  selectedOrders,
  drivers
}) => {
  const { showToast } = useApp();

  const [exportScope, setExportScope] = useState<'filtered' | 'selected'>(
    selectedOrders.length > 0 ? 'selected' : 'filtered'
  );
  const [separator, setSeparator] = useState<';' | ','>(';');
  const [includeTotals, setIncludeTotals] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered_only' | 'pending_only'>('all');

  if (!isOpen) return null;

  // Determine base set of orders
  let baseOrders = exportScope === 'selected' && selectedOrders.length > 0 
    ? selectedOrders 
    : filteredOrders;

  // Apply optional modal-level status filter
  let targetOrders = baseOrders;
  if (statusFilter === 'delivered_only') {
    targetOrders = baseOrders.filter(o => o.status === 'delivered');
  } else if (statusFilter === 'pending_only') {
    targetOrders = baseOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  }

  // Calculate accounting figures
  const totalCodAmount = targetOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalDeliveryFees = targetOrders.reduce((sum, o) => sum + (o.deliveryFee || 0), 0);
  const netMerchantAmount = targetOrders.reduce((sum, o) => {
    return sum + ((o.subtotal || (o.totalAmount - o.deliveryFee)) || 0);
  }, 0);
  const totalItemsCount = targetOrders.reduce((sum, o) => {
    return sum + (o.items ? o.items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 1);
  }, 0);

  const handleExport = () => {
    if (targetOrders.length === 0) {
      showToast({
        type: 'warning',
        title: 'Aucune commande à exporter',
        message: 'Modifiez vos filtres ou sélectionnez des commandes.',
      });
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const filename = `waseldz-export-comptabilite-${today}.csv`;

    const result = exportOrdersToCsv(targetOrders, drivers, {
      separator,
      includeAccountingTotals: includeTotals,
      customFilename: filename,
    });

    showToast({
      type: 'success',
      title: 'Exportation CSV terminée !',
      message: `${result.count} commandes exportées (Total C.O.D: ${formatDZD(result.totalAmount)} - Net commerçant: ${formatDZD(result.netMerchant)})`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Export Comptable des Commandes (CSV)
              </h3>
              <p className="text-xs text-slate-500">
                Génération de fichier compatible Excel, Google Sheets et logiciels de comptabilité
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Accounting Summary Cards */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Bilan synthétique des commandes à exporter
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[11px] text-slate-500 font-medium block">Commandes</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {targetOrders.length}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{totalItemsCount} articles</span>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl">
                <span className="text-[11px] text-blue-700 font-medium block">Total C.O.D</span>
                <span className="text-base font-black text-blue-900 font-mono">
                  {formatDZD(totalCodAmount)}
                </span>
                <span className="text-[10px] text-blue-600 block mt-0.5">Montant à encaisser</span>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                <span className="text-[11px] text-amber-700 font-medium block">Frais Livraison</span>
                <span className="text-base font-black text-amber-900 font-mono">
                  {formatDZD(totalDeliveryFees)}
                </span>
                <span className="text-[10px] text-amber-600 block mt-0.5">Part transporteur</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                <span className="text-[11px] text-emerald-700 font-medium block">Net Commerçant</span>
                <span className="text-base font-black text-emerald-900 font-mono">
                  {formatDZD(netMerchantAmount)}
                </span>
                <span className="text-[10px] text-emerald-600 block mt-0.5 font-semibold">Chiffre net boutique</span>
              </div>
            </div>
          </div>

          {/* Export Scope Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Périmètre de l'export
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  exportScope === 'filtered' 
                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  checked={exportScope === 'filtered'}
                  onChange={() => setExportScope('filtered')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Commandes actuellement filtrées
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Prend en compte vos recherches, dates et statuts en cours ({filteredOrders.length} commandes)
                  </span>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  exportScope === 'selected' 
                    ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-500' 
                    : 'border-slate-200 hover:bg-slate-50'
                } ${selectedOrders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="exportScope"
                  disabled={selectedOrders.length === 0}
                  checked={exportScope === 'selected'}
                  onChange={() => setExportScope('selected')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Sélection manuelle ({selectedOrders.length})
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {selectedOrders.length > 0 
                      ? 'Exporter uniquement les cases cochées' 
                      : 'Aucune case cochée dans la liste'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Filter preset within selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Filtre comptable rapide
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors cursor-pointer text-center ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Toutes ({baseOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('delivered_only')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors cursor-pointer text-center ${
                  statusFilter === 'delivered_only'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Livrées & Payées ({baseOrders.filter(o => o.status === 'delivered').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending_only')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors cursor-pointer text-center ${
                  statusFilter === 'pending_only'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                En cours d'encaissement ({baseOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})
              </button>
            </div>
          </div>

          {/* CSV Format Options */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              Paramètres du fichier CSV
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 block mb-1">
                  Séparateur de colonnes
                </label>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value as ';' | ',')}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value=";">Point-virgule ';' (Recommandé pour Excel fr / algérien)</option>
                  <option value=",">Virgule ',' (Standard international / Google Sheets)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={includeTotals}
                    onChange={(e) => setIncludeTotals(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ajouter une ligne de totalisation comptable en fin de fichier</span>
                </label>
              </div>
            </div>
          </div>

          {/* Included Columns Notice */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Colonnes incluses dans le rapport comptable :</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Réf Commande, N° Suivi, Date & Heure, Client, Téléphone, Wilaya, Commune, Adresse, Détails Articles, Quantités, Sous-total HT, Frais de port, Total C.O.D, Net Commerçant, Mode de règlement, Statut Paiement, Statut Livraison, Livreur Assigné.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Fichier encodé en <strong className="text-slate-700">UTF-8 avec BOM</strong> (accents préservés)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              onClick={handleExport}
              disabled={targetOrders.length === 0}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger le CSV ({targetOrders.length})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
