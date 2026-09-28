import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  MapPin, 
  Calendar,
  Award,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';
import { RevenueDeliveryChart } from './RevenueDeliveryChart';
import { DeliveryAnalytics30DaysWidget } from './DeliveryAnalytics30DaysWidget';

export const AnalyticsView: React.FC = () => {
  const { orders, drivers } = useApp();
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'all'>('month');

  // Metrics
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const deliveredCount = deliveredOrders.length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const failedCount = orders.filter(o => ['failed', 'returned'].includes(o.status)).length;
  
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalDeliveryFees = deliveredOrders.reduce((sum, o) => sum + o.deliveryFee, 0);
  const averageOrderValue = deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0;
  const successRate = totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0;

  // Wilaya distribution
  const wilayaCounts: Record<string, { count: number; revenue: number }> = {};
  orders.forEach(o => {
    const w = o.wilaya.split('-')[1]?.trim() || o.wilaya;
    if (!wilayaCounts[w]) wilayaCounts[w] = { count: 0, revenue: 0 };
    wilayaCounts[w].count += 1;
    if (o.status === 'delivered') wilayaCounts[w].revenue += o.totalAmount;
  });

  const sortedWilayas = Object.entries(wilayaCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Analyses Financières & Performance Logistique
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Indicateurs clés de rentabilité et d'efficacité de distribution en Dinar Algérien (DZD)
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { id: 'today', label: 'Aujourd\'hui' },
            { id: 'week', label: '7 jours' },
            { id: 'month', label: 'Ce mois-ci' },
            { id: 'all', label: 'Tout l\'historique' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeframe === t.id ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main KPI Quad Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Chiffre d'affaires Réalisé</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="font-bold">DA</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatDZD(totalRevenue)}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Colis livrés et encaissés</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Panier Moyen (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatDZD(averageOrderValue)}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Par commande finalisée
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Frais Livraison Collectés</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{formatDZD(totalDeliveryFees)}</div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">
              Recouvrement transporteurs
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Taux de Délivrabilité</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{successRate}%</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {deliveredCount} livrées / {totalOrders} créées
            </div>
          </div>
        </div>

      </div>
 
      {/* Widget Analytique 30 Jours Recharts (Volume, Taux de succès, Délais moyens) */}
      <DeliveryAnalytics30DaysWidget />

      {/* Daily Revenue and Deliveries Volume Chart (Recharts) */}
      <RevenueDeliveryChart />

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution Pie / Bar representation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Répartition par Statut de Commande
          </h3>
          <p className="text-xs text-slate-500">
            État de santé global des expéditions
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Colis Livrés avec succès
                </span>
                <span className="font-mono text-slate-900">{deliveredCount} ({totalOrders > 0 ? Math.round((deliveredCount/totalOrders)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(deliveredCount/totalOrders)*100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-cyan-700">
                  <Truck className="w-3.5 h-3.5" /> En cours d'acheminement
                </span>
                <span className="font-mono text-slate-900">
                  {orders.filter(o => ['assigned', 'out_for_delivery'].includes(o.status)).length}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(orders.filter(o => ['assigned', 'out_for_delivery'].includes(o.status)).length/totalOrders)*100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-amber-700">
                  <Calendar className="w-3.5 h-3.5" /> Nouvelles & En préparation
                </span>
                <span className="font-mono text-slate-900">
                  {orders.filter(o => ['new', 'confirmed', 'preparing'].includes(o.status)).length}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(orders.filter(o => ['new', 'confirmed', 'preparing'].includes(o.status)).length/totalOrders)*100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-semibold">
                <span className="flex items-center gap-1.5 text-rose-700">
                  <XCircle className="w-3.5 h-3.5" /> Échecs, Retours & Annulations
                </span>
                <span className="font-mono text-slate-900">
                  {failedCount + cancelledCount}
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${((failedCount + cancelledCount)/totalOrders)*100}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mt-4">
            Un taux de retour inférieur à 5% témoigne d'une excellente confirmation téléphonique préalable des commandes avant envoi.
          </div>
        </div>

        {/* Top Wilayas Revenue Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Performance par Wilaya de Livraison
          </h3>
          <p className="text-xs text-slate-500">
            Classement des volumes et chiffres d'affaires par région
          </p>

          <div className="space-y-3 pt-2 text-xs">
            {sortedWilayas.map(([wilayaName, stat], idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {wilayaName}
                    </div>
                    <div className="text-slate-400 text-[11px]">{stat.count} colis expédiés</div>
                  </div>
                </div>
                <div className="text-right font-black text-slate-900 font-mono">
                  {formatDZD(stat.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Driver Performance Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Évaluation de la Flotte & Livreurs
          </h3>
          <p className="text-xs text-slate-500">
            Efficacité individuelle, volume de courses et taux de réussite
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Livreur</th>
                <th className="px-5 py-3">Véhicule</th>
                <th className="px-5 py-3">Courses Livrées</th>
                <th className="px-5 py-3">Échecs / Retours</th>
                <th className="px-5 py-3">Taux de Succès</th>
                <th className="px-5 py-3 text-right">Note Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {drivers.map(driver => {
                const driverOrders = orders.filter(o => o.driverId === driver.id);
                const delivered = driverOrders.filter(o => o.status === 'delivered').length;
                const failed = driverOrders.filter(o => ['failed', 'returned'].includes(o.status)).length;
                const total = driverOrders.length;
                const rate = total > 0 ? Math.round((delivered / total) * 100) : 100;

                return (
                  <tr key={driver.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {driver.name}
                    </td>
                    <td className="px-5 py-3.5 capitalize text-slate-600">
                      {driver.vehicleType}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-emerald-600">
                      {delivered} colis
                    </td>
                    <td className="px-5 py-3.5 text-rose-600 font-semibold">
                      {failed}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rate}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-amber-500">
                      ★ {driver.rating?.toFixed(1) || '4.9'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
