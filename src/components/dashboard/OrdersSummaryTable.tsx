import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  Radio, 
  Truck, 
  MapPin, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { OrderStatus } from '../../types';

interface OrdersSummaryTableProps {
  maxItems?: number;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
  initialTab?: 'all' | 'in_progress' | 'delivered';
}

export const OrdersSummaryTable: React.FC<OrdersSummaryTableProps> = ({
  maxItems,
  showFilters = true,
  title = "Tableau Récapitulatif des Commandes",
  subtitle = "Vue synthétique de l'état d'acheminement de vos colis en Algérie"
}) => {
  const { 
    orders, 
    drivers, 
    setSelectedOrderId, 
    setSlipOrderId, 
    setTrackingOrderId,
    setDashboardTab 
  } = useApp();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'delivered'>('all');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Stats computation
  const totalCount = orders.length;
  const inProgressCount = orders.filter(o => 
    ['new', 'confirmed', 'preparing', 'assigned', 'out_for_delivery'].includes(o.status)
  ).length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  // Extract unique wilayas for dropdown
  const uniqueWilayas = useMemo(() => {
    const set = new Set<string>();
    orders.forEach(o => {
      if (o.wilaya) set.add(o.wilaya);
    });
    return Array.from(set).sort();
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        // Tab filter
        if (activeTab === 'in_progress') {
          if (!['new', 'confirmed', 'preparing', 'assigned', 'out_for_delivery'].includes(o.status)) {
            return false;
          }
        } else if (activeTab === 'delivered') {
          if (o.status !== 'delivered') {
            return false;
          }
        }

        // Wilaya filter
        if (selectedWilaya !== 'all' && o.wilaya !== selectedWilaya) {
          return false;
        }

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const match = 
            o.id.toLowerCase().includes(q) ||
            o.trackingNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerPhone.includes(q) ||
            o.wilaya.toLowerCase().includes(q) ||
            o.commune.toLowerCase().includes(q);
          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [orders, activeTab, selectedWilaya, search, sortOrder]);

  const displayedOrders = maxItems ? filteredOrders.slice(0, maxItems) : filteredOrders;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header with Tabs */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Filter Tabs (Total / En cours / Livrées) */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Toutes</span>
              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded-full text-[10px] font-mono">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'in_progress'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>En cours</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {inProgressCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('delivered')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'delivered'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Livrées</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'delivered' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {deliveredCount}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {showFilters && (
        <div className="p-3 sm:px-5 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par réf, tracking, client, téléphone, wilaya..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:border-blue-500"
            >
              <option value="all">Toutes les wilayas ({uniqueWilayas.length})</option>
              {uniqueWilayas.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Changer l'ordre chronologique"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>{sortOrder === 'desc' ? 'Plus récentes' : 'Plus anciennes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Table Data Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="px-4 py-3.5 pl-5">Réf & Tracking</th>
              <th className="px-4 py-3.5">Destinataire (Client)</th>
              <th className="px-4 py-3.5">Destination</th>
              <th className="px-4 py-3.5">Livreur Assigné</th>
              <th className="px-4 py-3.5">Montant C.O.D</th>
              <th className="px-4 py-3.5">Statut de Livraison</th>
              <th className="px-4 py-3.5 text-right pr-5">Actions Rapides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
            {displayedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600 text-sm">Aucune commande trouvée</p>
                  <p className="text-xs text-slate-400 mt-0.5">Essayez de modifier vos filtres ou effectuez une recherche différente.</p>
                </td>
              </tr>
            ) : (
              displayedOrders.map(order => {
                const statusMeta = STATUS_LABELS[order.status] || STATUS_LABELS['new'];
                const driver = drivers.find(d => d.id === order.driverId);

                return (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    {/* Order IDs */}
                    <td className="px-4 py-3.5 pl-5">
                      <div className="font-bold text-slate-900 font-mono text-xs flex items-center gap-1.5">
                        <span>{order.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <span>Trk:</span>
                        <span className="text-blue-600 font-semibold">{order.trackingNumber}</span>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {order.customerName}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="font-mono">{order.customerPhone}</span>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-slate-800">{order.wilaya}</div>
                          <div className="text-slate-400 text-[11px] truncate max-w-[150px]">{order.commune}</div>
                        </div>
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="px-4 py-3.5">
                      {driver ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                            {driver.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-[11px]">{driver.name}</div>
                            <div className="text-slate-400 text-[10px]">{driver.vehicleType}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-medium italic">
                          Non assigné
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900 font-mono text-xs">
                        {formatDZD(order.totalAmount)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {order.paymentMethod === 'cod' ? 'À la livraison (C.O.D)' : 'Payé d\'avance'}
                      </div>
                    </td>

                    {/* Delivery Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusMeta.bg} ${statusMeta.text} border ${statusMeta.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{statusMeta.label}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Live Tracking */}
                        <button
                          onClick={() => setTrackingOrderId(order.id)}
                          title="Suivi de colis temps réel"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          <Radio className="w-3.5 h-3.5" />
                        </button>

                        {/* Print Delivery Slip */}
                        <button
                          onClick={() => setSlipOrderId(order.id)}
                          title="Imprimer le bon de livraison"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* View Drawer */}
                        <button
                          onClick={() => setSelectedOrderId(order.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Détails</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Summary & Link */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Affichage de <strong>{displayedOrders.length}</strong> commande(s) sur <strong>{orders.length}</strong> au total</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 font-semibold">{deliveredCount} livrées</span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-700 font-semibold">{inProgressCount} en cours</span>
        </div>

        <button
          onClick={() => setDashboardTab('orders')}
          className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>Gérer l'ensemble du registre des commandes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
