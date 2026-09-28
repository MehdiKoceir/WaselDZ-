import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Trash2, 
  Calendar, 
  User, 
  Truck, 
  ChevronDown,
  ArrowUpDown,
  Download,
  Printer,
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  X,
  Phone,
  SlidersHorizontal,
  Radio,
  PlayCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { OrderStatus } from '../../types';
import { ExportOrdersModal } from './ExportOrdersModal';

export const OrdersView: React.FC = () => {
  const { 
    orders, 
    drivers, 
    deleteOrder, 
    setSelectedOrderId, 
    setSlipOrderId,
    setTrackingOrderId,
    setIsOrderModalOpen, 
    updateOrderStatus,
    batchUpdateStatus,
    batchAssignDriver,
    batchDeleteOrders,
    showConfirmDialog,
    showToast,
    simulateDeliveryProgression,
    searchFilter,
    setSearchFilter
  } = useApp();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [driverFilter, setDriverFilter] = useState<string>('all');
  const [quickTab, setQuickTab] = useState<'all' | 'to_process' | 'in_transit' | 'delivered' | 'issues'>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Batch selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchDriverId, setBatchDriverId] = useState<string>('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const selectedOrders = useMemo(() => {
    return orders.filter(o => selectedIds.includes(o.id));
  }, [orders, selectedIds]);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !(document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered and sorted orders (filtering primarily by customer name or tracking number)
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        // Search query
        const q = searchFilter.toLowerCase().trim();
        const matchesSearch = !q || 
          o.customerName.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.wilaya.toLowerCase().includes(q) ||
          o.commune.toLowerCase().includes(q);

        // Status filter
        let matchesStatus = true;
        if (statusFilter !== 'all') {
          matchesStatus = o.status === statusFilter;
        } else if (quickTab === 'to_process') {
          matchesStatus = ['new', 'confirmed', 'preparing'].includes(o.status);
        } else if (quickTab === 'in_transit') {
          matchesStatus = ['assigned', 'out_for_delivery'].includes(o.status);
        } else if (quickTab === 'delivered') {
          matchesStatus = o.status === 'delivered';
        } else if (quickTab === 'issues') {
          matchesStatus = ['failed', 'returned', 'cancelled'].includes(o.status);
        }

        // Driver filter
        const matchesDriver = driverFilter === 'all' || 
          (driverFilter === 'unassigned' ? !o.driverId : o.driverId === driverFilter);

        return matchesSearch && matchesStatus && matchesDriver;
      })
      .sort((a, b) => {
        if (sortField === 'amount') {
          return sortAsc ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
        } else {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return sortAsc ? timeA - timeB : timeB - timeA;
        }
      });
  }, [orders, searchFilter, statusFilter, quickTab, driverFilter, sortField, sortAsc]);

  // Selection toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // CSV Export
  const exportToCSV = () => {
    const targetOrders = selectedIds.length > 0 
      ? orders.filter(o => selectedIds.includes(o.id))
      : filteredOrders;

    if (targetOrders.length === 0) {
      showToast({
        type: 'warning',
        title: 'Aucune commande à exporter',
        message: 'Modifiez vos filtres de recherche',
      });
      return;
    }

    const headers = ['ID', 'N_Suivi', 'Client', 'Telephone', 'Wilaya', 'Commune', 'Montant_DZD', 'Frais_Port_DZD', 'Statut', 'Paiement', 'Date_Creation'];
    const rows = targetOrders.map(o => [
      o.id,
      o.trackingNumber,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.wilaya}"`,
      `"${o.commune}"`,
      o.totalAmount,
      o.deliveryFee,
      o.status,
      o.paymentStatus,
      o.createdAt.split('T')[0]
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `waseldz-commandes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({
      type: 'success',
      title: 'Export CSV réussi',
      message: `${targetOrders.length} lignes exportées au format Excel/CSV`,
    });
  };

  // Batch actions
  const handleBatchStatus = (status: OrderStatus) => {
    if (selectedIds.length === 0) return;
    batchUpdateStatus(selectedIds, status);
    setSelectedIds([]);
  };

  const handleBatchAssign = () => {
    if (selectedIds.length === 0 || !batchDriverId) return;
    batchAssignDriver(selectedIds, batchDriverId);
    setSelectedIds([]);
    setBatchDriverId('');
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    showConfirmDialog({
      title: `Supprimer ${selectedIds.length} commande(s) ?`,
      message: `Êtes-vous sûr de vouloir supprimer définitivement ces ${selectedIds.length} commandes sélectionnées ? Cette opération est irréversible.`,
      confirmLabel: 'Oui, supprimer la sélection',
      cancelLabel: 'Annuler',
      isDestructive: true,
      onConfirm: () => {
        batchDeleteOrders(selectedIds);
        setSelectedIds([]);
      },
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Registre des Commandes
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700">
              {filteredOrders.length}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Centralisation, bon de livraison et expédition sur les 58 Wilayas
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => simulateDeliveryProgression()}
            className="px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Tester la file d'attente des notifications de changement de statut"
          >
            <PlayCircle className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">Simuler File d'Attente</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs border border-emerald-200/80"
            title="Exporter les commandes au format CSV pour la comptabilité (compatible Excel & tableurs)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Exporter CSV Compta</span>
            <span className="sm:hidden">Export CSV</span>
          </button>

          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouvelle Commande</span>
          </button>
        </div>
      </div>

      {/* Quick Stage Tabs (IHM Guidance) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'all', label: 'Toutes les commandes', count: orders.length },
          { id: 'to_process', label: 'À traiter / Préparer', count: orders.filter(o => ['new', 'confirmed', 'preparing'].includes(o.status)).length },
          { id: 'in_transit', label: 'En cours de route', count: orders.filter(o => ['assigned', 'out_for_delivery'].includes(o.status)).length },
          { id: 'delivered', label: 'Livrées & Payées (COD)', count: orders.filter(o => o.status === 'delivered').length },
          { id: 'issues', label: 'Retours & Échecs', count: orders.filter(o => ['failed', 'returned', 'cancelled'].includes(o.status)).length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setQuickTab(tab.id as any);
              setStatusFilter('all');
            }}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              quickTab === tab.id && statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
              quickTab === tab.id && statusFilter === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        {/* Prominent Search Bar at the Top of Orders */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Filtrer les commandes par nom de client ou numéro de suivi (ex: Amine Benali, DZ-98234...)"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {searchFilter ? (
              <button 
                onClick={() => setSearchFilter('')}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200/60 rounded cursor-pointer transition-colors"
                title="Effacer le filtre"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="hidden sm:inline text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded border border-slate-300/50">
                /
              </span>
            )}
          </div>
        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setQuickTab('all');
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">Filtre Statut précis...</option>
              <option value="new">Nouvelles</option>
              <option value="confirmed">Confirmées</option>
              <option value="preparing">En préparation</option>
              <option value="assigned">Assignées chauffeur</option>
              <option value="out_for_delivery">En cours de livraison</option>
              <option value="delivered">Livrées avec succès</option>
              <option value="failed">Échouées (Injoignable)</option>
              <option value="cancelled">Annulées</option>
              <option value="returned">Retournées</option>
            </select>
          </div>

          {/* Driver Filter */}
          <div>
            <select
              value={driverFilter}
              onChange={(e) => setDriverFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">Tous les chauffeurs</option>
              <option value="unassigned">Non assigné à un livreur</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.vehicleType})</option>
              ))}
            </select>
          </div>

          {/* Sort Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (sortField === 'date') setSortAsc(!sortAsc);
                else { setSortField('date'); setSortAsc(false); }
              }}
              className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                sortField === 'date' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-300'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Date {sortField === 'date' ? (sortAsc ? '↑' : '↓') : ''}</span>
            </button>

            <button
              onClick={() => {
                if (sortField === 'amount') setSortAsc(!sortAsc);
                else { setSortField('amount'); setSortAsc(false); }
              }}
              className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                sortField === 'amount' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-300'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Montant {sortField === 'amount' ? (sortAsc ? '↑' : '↓') : ''}</span>
            </button>
          </div>

        </div>

        {(searchFilter || statusFilter !== 'all' || driverFilter !== 'all' || quickTab !== 'all') && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>
                Affichage de <strong className="text-slate-900">{filteredOrders.length}</strong> sur <strong>{orders.length}</strong> commandes
              </span>
              {searchFilter && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded-md font-medium text-[11px] border border-blue-200/80">
                  <Search className="w-3 h-3 text-blue-500" />
                  "{searchFilter}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchFilter('');
                setStatusFilter('all');
                setDriverFilter('all');
                setQuickTab('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer self-start sm:self-auto"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>

      {/* Floating Batch Operations Toolbar (Appears when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="sticky top-18 z-20 bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">
              commande(s) sélectionnée(s)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick batch status buttons */}
            <button
              onClick={() => handleBatchStatus('confirmed')}
              className="px-2.5 py-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 text-xs font-bold rounded-lg border border-indigo-700 transition-colors"
            >
              Valider
            </button>
            <button
              onClick={() => handleBatchStatus('out_for_delivery')}
              className="px-2.5 py-1.5 bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 text-xs font-bold rounded-lg border border-cyan-700 transition-colors"
            >
              En route
            </button>
            <button
              onClick={() => handleBatchStatus('delivered')}
              className="px-2.5 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-lg border border-emerald-700 transition-colors"
            >
              Livrées
            </button>

            {/* Batch assign driver */}
            <div className="flex items-center gap-1">
              <select
                value={batchDriverId}
                onChange={(e) => setBatchDriverId(e.target.value)}
                className="text-xs p-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg"
              >
                <option value="">Assigner à...</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <button
                disabled={!batchDriverId}
                onClick={handleBatchAssign}
                className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Appliquer
              </button>
            </div>

            {/* Batch CSV Export */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-2.5 py-1.5 bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-lg border border-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Exporter les commandes sélectionnées au format CSV comptable"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Exporter CSV ({selectedIds.length})</span>
            </button>

            {/* Batch delete */}
            <button
              onClick={handleBatchDelete}
              className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Supprimer la sélection"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Clear selection */}
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Top Header with Search Bar to filter orders by customer name or tracking number */}
        <div className="p-3.5 sm:p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-600" />
              Tableau des Commandes
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800">
              {filteredOrders.length}
            </span>
            {searchFilter.trim() && (
              <span className="text-[11px] text-slate-500 font-medium">
                (filtré par nom ou N° suivi)
              </span>
            )}
          </div>

          {/* Quick Search bar right at the top of the table */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filtrer par nom de client ou N° suivi..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 font-medium shadow-2xs"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                title="Effacer le filtre"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Aucune commande trouvée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Aucun colis ne correspond à vos critères de recherche actuels.
            </p>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSearchFilter('');
                  setStatusFilter('all');
                  setDriverFilter('all');
                  setQuickTab('all');
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Effacer les filtres
              </button>
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
              >
                + Créer une commande
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                  <th className="p-4 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer flex items-center"
                    >
                      {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Référence & Suivi</th>
                  <th className="p-4">Client Destinataire</th>
                  <th className="p-4">Destination (Wilaya)</th>
                  <th className="p-4">Livreur Assigné</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Montant C.O.D</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map(order => {
                  const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS['new'];
                  const driver = drivers.find(d => d.id === order.driverId);
                  const isSelected = selectedIds.includes(order.id);

                  return (
                    <tr 
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-4" onClick={(e) => toggleSelectOrder(order.id, e)}>
                        <button className="text-slate-400 hover:text-slate-700 cursor-pointer flex items-center">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Reference & Tracking */}
                      <td className="p-4">
                        <div className="font-mono font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {order.id}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {order.trackingNumber}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="font-mono text-[11px] text-slate-500">{order.customerPhone}</div>
                      </td>

                      {/* Destination */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{order.wilaya}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{order.commune}</div>
                      </td>

                      {/* Assigned Driver */}
                      <td className="p-4">
                        {driver ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-semibold text-slate-800">{driver.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Non assigné</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* COD Total */}
                      <td className="p-4 text-right">
                        <div className="font-mono font-black text-slate-900 text-sm">
                          {formatDZD(order.totalAmount)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.paymentStatus === 'paid' ? (
                            <span className="text-emerald-600 font-bold">Encaissé ✓</span>
                          ) : (
                            'À encaisser'
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* Live Tracking Radar */}
                          <button
                            onClick={() => setTrackingOrderId(order.id)}
                            title="Suivi en direct (Radar GPS)"
                            className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Radio className="w-4 h-4 text-cyan-600" />
                          </button>

                          {/* Printable slip */}
                          <button
                            onClick={() => setSlipOrderId(order.id)}
                            title="Imprimer le bon de livraison"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Inspect drawer */}
                          <button
                            onClick={() => setSelectedOrderId(order.id)}
                            title="Voir la fiche détaillée"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete order */}
                          <button
                            onClick={() => {
                              showConfirmDialog({
                                title: `Supprimer la commande ${order.id} ?`,
                                message: `Voulez-vous supprimer définitivement la commande de ${order.customerName} ?`,
                                confirmLabel: 'Supprimer',
                                isDestructive: true,
                                onConfirm: () => deleteOrder(order.id),
                              });
                            }}
                            title="Supprimer la commande"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export CSV Accounting Modal */}
      <ExportOrdersModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        filteredOrders={filteredOrders}
        selectedOrders={selectedOrders}
        drivers={drivers}
      />

    </div>
  );
};
