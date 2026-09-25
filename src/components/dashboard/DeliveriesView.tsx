import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Eye, 
  Layers, 
  List, 
  Phone, 
  Printer, 
  ChevronRight, 
  UserCheck, 
  RotateCcw,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS, formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { OrderStatus } from '../../types';
import { RealtimeTrackingWidget } from './RealtimeTrackingWidget';

export const DeliveriesView: React.FC = () => {
  const { 
    orders, 
    drivers, 
    setSelectedOrderId, 
    setSlipOrderId, 
    setTrackingOrderId, 
    updateOrderStatus, 
    assignDriver 
  } = useApp();

  const [viewStyle, setViewStyle] = useState<'kanban' | 'list' | 'radar'>('kanban');
  const [selectedWilaya, setSelectedWilaya] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [deliveryStatusTab, setDeliveryStatusTab] = useState<'all' | 'pending' | 'active' | 'completed' | 'failed'>('all');

  // Filter deliveries
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesWilaya = selectedWilaya === 'all' || o.wilaya.includes(selectedWilaya);
      const matchesDriver = selectedDriver === 'all' || 
        (selectedDriver === 'unassigned' ? !o.driverId : o.driverId === selectedDriver);

      let matchesTab = true;
      if (deliveryStatusTab === 'pending') {
        matchesTab = ['new', 'confirmed', 'preparing'].includes(o.status);
      } else if (deliveryStatusTab === 'active') {
        matchesTab = ['assigned', 'out_for_delivery'].includes(o.status);
      } else if (deliveryStatusTab === 'completed') {
        matchesTab = o.status === 'delivered';
      } else if (deliveryStatusTab === 'failed') {
        matchesTab = ['failed', 'returned', 'cancelled'].includes(o.status);
      }

      return matchesWilaya && matchesDriver && matchesTab;
    });
  }, [orders, selectedWilaya, selectedDriver, deliveryStatusTab]);

  // Delivery grouped columns for Kanban
  const kanbanColumns: { id: string; title: string; statuses: OrderStatus[]; nextStatus?: OrderStatus; nextLabel?: string; color: string; bg: string }[] = [
    { 
      id: 'pending', 
      title: '1. À Préparer', 
      statuses: ['new', 'confirmed', 'preparing'], 
      nextStatus: 'assigned',
      nextLabel: 'Confier au livreur',
      color: 'text-amber-800', 
      bg: 'bg-amber-50/60 border-amber-200' 
    },
    { 
      id: 'assigned', 
      title: '2. Prêt chez Livreur', 
      statuses: ['assigned'], 
      nextStatus: 'out_for_delivery',
      nextLabel: 'Lancer en route',
      color: 'text-purple-800', 
      bg: 'bg-purple-50/60 border-purple-200' 
    },
    { 
      id: 'out', 
      title: '3. En cours de route', 
      statuses: ['out_for_delivery'], 
      nextStatus: 'delivered',
      nextLabel: 'Marquer Livré & Payé',
      color: 'text-cyan-800', 
      bg: 'bg-cyan-50/60 border-cyan-200' 
    },
    { 
      id: 'delivered', 
      title: '4. Livrées & Encaissées', 
      statuses: ['delivered'], 
      color: 'text-emerald-800', 
      bg: 'bg-emerald-50/60 border-emerald-200' 
    },
    { 
      id: 'issues', 
      title: '5. Retours / Alertes', 
      statuses: ['failed', 'returned', 'cancelled'], 
      color: 'text-rose-800', 
      bg: 'bg-rose-50/60 border-rose-200' 
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Pilotage Logistique & Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Suivi temps réel des courses livreurs et de l'encaissement du cash (C.O.D)
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setViewStyle('kanban')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewStyle === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pipeline Kanban</span>
          </button>
          <button
            onClick={() => setViewStyle('list')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewStyle === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Fiches détaillées</span>
          </button>
          <button
            onClick={() => setViewStyle('radar')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              viewStyle === 'radar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Radar Live 📡</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        {/* Quick status tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Toutes les courses' },
            { id: 'pending', label: 'En attente' },
            { id: 'active', label: 'En transit (Terrain)' },
            { id: 'completed', label: 'Livrées' },
            { id: 'failed', label: 'Retours / Alertes' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDeliveryStatusTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                deliveryStatusTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Wilaya Filter */}
          <select
            value={selectedWilaya}
            onChange={(e) => setSelectedWilaya(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl flex-1 sm:flex-initial font-medium"
          >
            <option value="all">Toutes les wilayas</option>
            {ALGERIAN_WILAYAS.map(w => (
              <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
            ))}
          </select>

          {/* Driver Filter */}
          <select
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-xl flex-1 sm:flex-initial font-medium"
          >
            <option value="all">Tous les livreurs</option>
            <option value="unassigned">Non assigné</option>
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.vehicleType})</option>
            ))}
          </select>
        </div>

      </div>

      {/* Kanban Pipeline View */}
      {viewStyle === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
          {kanbanColumns.map(col => {
            const colOrders = filteredOrders.filter(o => col.statuses.includes(o.status));
            return (
              <div 
                key={col.id} 
                className={`rounded-2xl p-3.5 border ${col.bg} space-y-3 min-h-[480px] flex flex-col`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <h3 className={`text-xs font-black uppercase tracking-wider ${col.color}`}>
                    {col.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white text-slate-800 shadow-xs border border-slate-200">
                    {colOrders.length}
                  </span>
                </div>

                {/* Cards List in column */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs italic">
                      Aucun colis
                    </div>
                  ) : (
                    colOrders.map(order => {
                      const driver = drivers.find(d => d.id === order.driverId);
                      return (
                        <div
                          key={order.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => setSelectedOrderId(order.id)}
                              className="font-mono font-black text-xs text-slate-900 group-hover:text-blue-600 transition-colors text-left"
                            >
                              {order.id}
                            </button>
                            <span className="text-xs font-mono font-black text-slate-900">
                              {formatDZD(order.totalAmount)}
                            </span>
                          </div>

                          <div 
                            onClick={() => setSelectedOrderId(order.id)}
                            className="text-xs font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600"
                          >
                            {order.customerName}
                          </div>

                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="truncate"><strong>{order.wilaya}</strong> ({order.commune})</span>
                          </div>

                          {/* Driver row */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            {driver ? (
                              <span className="text-slate-700 font-semibold flex items-center gap-1">
                                <Truck className="w-3 h-3 text-blue-600" />
                                {driver.name.split(' ')[0]}
                              </span>
                            ) : (
                              <select
                                defaultValue=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    assignDriver(order.id, e.target.value);
                                  }
                                }}
                                className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 rounded px-1 py-0.5 font-bold"
                              >
                                <option value="" disabled>+ Assigner livreur</option>
                                {drivers.map(d => (
                                  <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                              </select>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setTrackingOrderId(order.id)}
                                title="Suivi en direct (Radar GPS)"
                                className="text-slate-400 hover:text-cyan-600 p-1 cursor-pointer"
                              >
                                <Radio className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSlipOrderId(order.id)}
                                title="Bon de livraison"
                                className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* IHM Direct Action: One-click advance stage */}
                          {col.nextStatus && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, col.nextStatus!)}
                              className="w-full mt-1 py-1.5 px-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <span>{col.nextLabel}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List / Cards View */}
      {viewStyle === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(order => {
            const st = STATUS_LABELS[order.status] || STATUS_LABELS['new'];
            const driver = drivers.find(d => d.id === order.driverId);
            return (
              <div 
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono font-black text-sm text-slate-900">{order.id}</span>
                    <p className="text-[11px] text-slate-400 font-mono">{order.trackingNumber}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${st.bg} ${st.text} border ${st.border}`}>
                    {st.label}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{order.wilaya} — {order.commune} ({order.customerAddress})</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Total C.O.D :</div>
                    <div className="font-black text-slate-900 text-base font-mono">{formatDZD(order.totalAmount)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[10px] uppercase font-bold">Frais Wilaya :</div>
                    <div className="font-bold text-blue-600 font-mono">{formatDZD(order.deliveryFee)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="text-slate-600">
                    {driver ? (
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        {driver.name}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        À assigner
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setTrackingOrderId(order.id)}
                      title="Suivi en direct (Radar GPS)"
                      className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Radio className="w-4 h-4 text-cyan-600" />
                    </button>

                    <button
                      onClick={() => setSlipOrderId(order.id)}
                      title="Imprimer Bon de livraison"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Gérer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Radar Mode Live */}
      {viewStyle === 'radar' && (
        <div className="pt-2">
          <RealtimeTrackingWidget />
        </div>
      )}

    </div>
  );
};
