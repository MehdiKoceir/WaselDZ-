import React from 'react';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  ArrowRight, 
  Eye, 
  Truck,
  AlertCircle,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { RealtimeTrackingWidget } from './RealtimeTrackingWidget';
import { RevenueDeliveryChart } from './RevenueDeliveryChart';
import { StockManagementWidget } from './StockManagementWidget';
import { OrdersSummaryTable } from './OrdersSummaryTable';

export const OverviewView: React.FC = () => {
  const { orders, drivers, setSelectedOrderId, setSlipOrderId, setIsOrderModalOpen, setDashboardTab } = useApp();

  // Metrics computation
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingDeliveries = orders.filter(o => ['new', 'confirmed', 'preparing', 'assigned', 'out_for_delivery'].includes(o.status)).length;
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalAmount, 0);
  const successRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  // Recent 6 orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  // Wilaya distribution count
  const wilayaStats: Record<string, number> = {};
  orders.forEach(o => {
    const w = o.wilaya.split('-')[1]?.trim() || o.wilaya;
    wilayaStats[w] = (wilayaStats[w] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Fast Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Tableau de Bord & Vue d'Ensemble
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Suivi en temps réel de votre activité de livraison en Algérie 🇩🇿
          </p>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Package className="w-4 h-4" />
          <span>+ Nouvelle Commande</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Commandes</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalOrders}</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>Activité soutenue ce mois</span>
            </div>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Livrées avec Succès</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">{deliveredOrders}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Taux de succès : <strong className="text-emerald-600">{successRate}%</strong>
            </div>
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">En cours / Attente</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-amber-700">{pendingDeliveries}</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              Dans le pipeline logistique
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Revenu Encaissé (DZD)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="font-bold text-xs">DA</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatDZD(totalRevenue)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Cash & BaridiMob validés
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Tracking Hub for Packages (Demande Utilisateur) */}
      <RealtimeTrackingWidget />

      {/* Analytics & Performance Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 cols: Orders / Revenue Volume Chart with Recharts */}
        <div className="lg:col-span-2">
          <RevenueDeliveryChart />
        </div>

        {/* Right 1 col: Wilayas distribution */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Top Wilayas</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer" onClick={() => setDashboardTab('deliveries')}>
              Voir tout
            </span>
          </div>

          <p className="text-xs text-slate-500">Répartition géographique de vos livraisons</p>

          <div className="space-y-3 pt-2 text-xs">
            {Object.entries(wilayaStats).slice(0, 5).map(([wilayaName, count], i) => {
              const pct = Math.round((count / totalOrders) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {wilayaName}
                    </span>
                    <span className="text-slate-900 font-mono">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.max(10, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
            <strong>Conseil logistique :</strong> Les livraisons sur Alger et Blida affichent un taux de délivrabilité de 98% en moins de 24h.
          </div>
        </div>

      </div>

      {/* Real-time Inventory & Stock Availability Hub (Demande Utilisateur) */}
      <StockManagementWidget />

      {/* Tableau Récapitulatif des Commandes (Demande Utilisateur: Statistiques et Tableau Récapitulatif) */}
      <OrdersSummaryTable 
        maxItems={10} 
        title="Tableau Récapitulatif des Commandes Récentes" 
        subtitle="Suivi synthétique des statuts de livraison, destinataires et montants C.O.D en Algérie"
      />

    </div>
  );
};
