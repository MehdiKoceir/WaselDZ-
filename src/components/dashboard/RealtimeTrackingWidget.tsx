import React, { useState, useMemo, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  MapPin, 
  Truck, 
  Bike, 
  Car, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Share2, 
  Copy, 
  ExternalLink, 
  RotateCw, 
  ShieldCheck, 
  ChevronRight, 
  Printer, 
  Eye, 
  Sparkles,
  Compass,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { Order, OrderStatus } from '../../types';

export const RealtimeTrackingWidget: React.FC = () => {
  const { 
    orders, 
    drivers, 
    business, 
    setSelectedOrderId, 
    setSlipOrderId, 
    updateOrderStatus, 
    showToast 
  } = useApp();

  // Find active orders prioritizing those in delivery or assigned
  const activeOrders = useMemo(() => {
    return orders.filter(o => 
      ['out_for_delivery', 'assigned', 'preparing', 'confirmed', 'new'].includes(o.status)
    );
  }, [orders]);

  // Default selected order: pick the first out_for_delivery, or first assigned, or first order
  const defaultSelectedId = useMemo(() => {
    const out = orders.find(o => o.status === 'out_for_delivery');
    if (out) return out.id;
    const assigned = orders.find(o => o.status === 'assigned');
    if (assigned) return assigned.id;
    return activeOrders[0]?.id || orders[0]?.id || '';
  }, [orders, activeOrders]);

  const [selectedId, setSelectedId] = useState<string>(defaultSelectedId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimulatingMove, setIsSimulatingMove] = useState(false);
  const [telemetry, setTelemetry] = useState({
    distanceKm: 2.3,
    etaMinutes: 14,
    speedKmh: 36,
    lastPingSeconds: 4,
    pulseOffset: 65, // % along route
  });

  // Keep selectedId valid if orders change
  useEffect(() => {
    if (!selectedId && defaultSelectedId) {
      setSelectedId(defaultSelectedId);
    }
  }, [defaultSelectedId, selectedId]);

  // Real-time telemetry ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const newPing = (prev.lastPingSeconds + 3) % 15;
        const newSpeed = Math.floor(28 + Math.random() * 18);
        return {
          ...prev,
          lastPingSeconds: newPing,
          speedKmh: newSpeed,
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filtered orders for quick select or search
  const searchedOrders = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return orders.filter(o => 
      o.trackingNumber.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.wilaya.toLowerCase().includes(q) ||
      o.commune.toLowerCase().includes(q)
    );
  }, [orders, searchQuery]);

  const currentOrder = orders.find(o => o.id === selectedId) || orders[0];
  const currentDriver = currentOrder?.driverId ? drivers.find(d => d.id === currentOrder.driverId) : null;

  if (!currentOrder) return null;

  const currentStatusConfig = STATUS_LABELS[currentOrder.status] || STATUS_LABELS['new'];

  // Status progression step
  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    { key: 'new', label: '1. Reçue', desc: 'Commande enregistrée', icon: Clock },
    { key: 'preparing', label: '2. En Préparation', desc: 'Emballage au dépôt', icon: ShieldCheck },
    { key: 'assigned', label: '3. Chez le livreur', desc: 'Prise en charge logistique', icon: Truck },
    { key: 'out_for_delivery', label: '4. En cours de route', desc: 'Livreur sur le terrain', icon: Navigation },
    { key: 'delivered', label: '5. Livrée & Encaissée', desc: 'C.O.D versé au commerçant', icon: CheckCircle2 },
  ];

  const getStepState = (stepKey: OrderStatus) => {
    const orderFlow: OrderStatus[] = ['new', 'confirmed', 'preparing', 'assigned', 'out_for_delivery', 'delivered'];
    const currentIndex = orderFlow.indexOf(currentOrder.status);
    const stepIndex = orderFlow.indexOf(stepKey);

    if (currentOrder.status === 'delivered') return 'completed';
    if (['failed', 'returned', 'cancelled'].includes(currentOrder.status)) {
      return 'alert';
    }
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const handleCopyTrackingLink = () => {
    const trackingLink = `https://waseldz.dz/suivi/${currentOrder.trackingNumber}`;
    navigator.clipboard.writeText(trackingLink);
    showToast({
      type: 'success',
      title: 'Lien de suivi copié !',
      message: `${trackingLink} est prêt à être envoyé à ${currentOrder.customerName}.`,
    });
  };

  const handleShareWhatsApp = () => {
    const trackingLink = `https://waseldz.dz/suivi/${currentOrder.trackingNumber}`;
    const text = encodeURIComponent(
      `Salam ${currentOrder.customerName} ! 👋\nVoici le lien de suivi en direct de votre colis WaselDZ n° ${currentOrder.trackingNumber} :\n${trackingLink}\nMontant à payer : ${formatDZD(currentOrder.totalAmount)}.\nMerci pour votre confiance ! 🇩🇿`
    );
    window.open(`https://wa.me/${currentOrder.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleAdvanceProgression = () => {
    setIsSimulatingMove(true);
    let nextStatus: OrderStatus = 'out_for_delivery';
    let nextNote = 'Progression en temps réel mise à jour';

    if (currentOrder.status === 'new' || currentOrder.status === 'confirmed') {
      nextStatus = 'preparing';
      nextNote = 'Colis préparé au stock et scellé';
    } else if (currentOrder.status === 'preparing') {
      nextStatus = 'assigned';
      nextNote = `Pris en charge par ${currentDriver ? currentDriver.name : 'le coursier'}`;
    } else if (currentOrder.status === 'assigned') {
      nextStatus = 'out_for_delivery';
      nextNote = 'Chauffeur parti en tournée de livraison';
    } else if (currentOrder.status === 'out_for_delivery') {
      nextStatus = 'delivered';
      nextNote = 'Colis remis en main propre, C.O.D encaissé avec succès';
    }

    setTimeout(() => {
      updateOrderStatus(currentOrder.id, nextStatus, nextNote);
      setIsSimulatingMove(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Top Header with live radar indicator */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 relative">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                Suivi de Livraison en Temps Réel 🇩🇿
              </h3>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                Signal GPS Actif
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Surveillance télémétrique et localisation des coursiers pour vos clients
            </p>
          </div>
        </div>

        {/* Search by tracking number or customer */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="N° de suivi (ex: WDZ-16), Nom, Tél..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 text-white placeholder-slate-400 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-700/60">
              {searchedOrders.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">Aucun colis trouvé</div>
              ) : (
                searchedOrders.map(order => (
                  <button
                    key={order.id}
                    onClick={() => {
                      setSelectedId(order.id);
                      setSearchQuery('');
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-700 flex items-center justify-between text-xs transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white font-mono">{order.trackingNumber}</div>
                      <div className="text-[11px] text-slate-300">{order.customerName} • {order.wilaya}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600/30 text-blue-300">
                      {order.status}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Select Carousel of Active Shipments */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          Colis Actifs :
        </span>
        {orders.slice(0, 6).map(order => {
          const isSelected = order.id === currentOrder.id;
          const isEnRoute = order.status === 'out_for_delivery';
          return (
            <button
              key={order.id}
              onClick={() => setSelectedId(order.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 border ${
                isSelected 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isEnRoute && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              )}
              <span className="font-mono font-bold">{order.trackingNumber.slice(-7)}</span>
              <span className="opacity-80">({order.customerName.split(' ')[0]})</span>
            </button>
          );
        })}
      </div>

      {/* Main Radar & Live Tracking Display */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Interactive Radar & Visual Progress */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Header of selected order */}
          <div className="flex flex-wrap items-start justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-900 text-base">
                  {currentOrder.trackingNumber}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${currentStatusConfig.bg} ${currentStatusConfig.text} border ${currentStatusConfig.border}`}>
                  {currentStatusConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Destinataire : <strong className="text-slate-800">{currentOrder.customerName}</strong> • {currentOrder.customerPhone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Montant à encaisser</span>
              <span className="font-black text-emerald-700 text-base font-mono">
                {formatDZD(currentOrder.totalAmount)}
              </span>
            </div>
          </div>

          {/* Interactive Simulated Algerian Radar / Map Canvas */}
          <div className="relative h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-between shadow-inner">
            
            {/* Background Grid and Radial Radar Sweep */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
              }} 
            />

            {/* Simulated Live Route Path */}
            <div className="absolute inset-0 flex items-center justify-center px-8 pointer-events-none">
              <svg className="w-full h-32 overflow-visible" viewBox="0 0 500 120">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Dotted base line */}
                <path 
                  d="M 30,60 Q 150,15 260,60 T 470,60" 
                  fill="none" 
                  stroke="#334155" 
                  strokeWidth="4" 
                  strokeDasharray="6 6"
                />
                {/* Active animated progress route */}
                <path 
                  d="M 30,60 Q 150,15 260,60 T 470,60" 
                  fill="none" 
                  stroke="url(#routeGradient)" 
                  strokeWidth="4"
                  strokeDasharray="12 4"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* Radar Coordinates & Telemetry Overlay */}
            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200">
                <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span className="font-mono text-[11px]">36.7538° N, 3.0588° E ({currentOrder.commune})</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 font-bold text-[11px]">
                  Ping : {telemetry.lastPingSeconds}s ago
                </span>
              </div>
            </div>

            {/* Middle: Live Vehicle Marker */}
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 my-auto">
              
              {/* Origin Store */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/40 border-2 border-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                  <Truck className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-[11px] font-bold text-slate-200">
                  {business.name.slice(0, 14)}
                </div>
                <div className="text-[10px] text-slate-400">Dépôt central</div>
              </div>

              {/* Moving Courier Marker */}
              <div className="flex flex-col items-center gap-1 text-center animate-bounce">
                <div className="px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center gap-1 shadow-lg shadow-cyan-500/40 font-mono">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{telemetry.speedKmh} km/h</span>
                </div>
                <div className="w-11 h-11 rounded-full bg-cyan-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
                  {currentDriver?.vehicleType === 'moto' ? (
                    <Bike className="w-5 h-5" />
                  ) : (
                    <Car className="w-5 h-5" />
                  )}
                </div>
                <div className="text-[11px] font-bold text-cyan-300">
                  {currentDriver?.name.split(' ')[0] || 'Livreur'}
                </div>
              </div>

              {/* Destination Client */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600/40 border-2 border-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[11px] font-bold text-slate-200">
                  {currentOrder.customerName.split(' ')[0]}
                </div>
                <div className="text-[10px] text-slate-400">{currentOrder.commune}</div>
              </div>

            </div>

            {/* Bottom Live Metrics Bar */}
            <div className="relative z-10 bg-slate-800/90 backdrop-blur-xs rounded-xl p-2.5 border border-slate-700 flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Distance restante</span>
                <span className="font-bold text-white font-mono">{telemetry.distanceKm} km</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 block">Arrivée estimée (ETA)</span>
                <span className="font-bold text-cyan-400 font-mono">~ {telemetry.etaMinutes} minutes</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 block">Zone Wilaya</span>
                <span className="font-bold text-emerald-400">{currentOrder.wilaya.split('-')[1] || currentOrder.wilaya}</span>
              </div>
            </div>

          </div>

          {/* 5-Step Stepper */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Jalons d'acheminement en temps réel
            </h4>
            <div className="space-y-2">
              {steps.map((st, i) => {
                const state = getStepState(st.key);
                const Icon = st.icon;
                return (
                  <div 
                    key={st.key} 
                    className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                      state === 'completed'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : state === 'current'
                        ? 'bg-blue-50 border-blue-300 text-blue-950 ring-1 ring-blue-400/40 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        state === 'completed' 
                          ? 'bg-emerald-600 text-white' 
                          : state === 'current' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{st.label}</div>
                        <div className="text-[11px] opacity-75">{st.desc}</div>
                      </div>
                    </div>

                    {state === 'completed' && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Validé
                      </span>
                    )}

                    {state === 'current' && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                        <Radio className="w-3 h-3" />
                        En cours
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 5 cols: Driver Contact, Quick Share & Quick Actions */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          
          {/* Driver Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Livreur Assigné
                </span>
                <h4 className="font-extrabold text-slate-900 text-base mt-0.5">
                  {currentDriver ? currentDriver.name : 'Non encore assigné'}
                </h4>
                <div className="text-xs text-slate-500">
                  {currentDriver ? `${currentDriver.vehicleType.toUpperCase()} • Matr. ${currentDriver.licensePlate || '16-12345-Alger'}` : 'En attente de prise en charge'}
                </div>
              </div>

              {currentDriver && (
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {currentDriver.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {currentDriver && (
              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${currentDriver.phone}`}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Appeler</span>
                </a>
                <a
                  href={`https://wa.me/${currentDriver.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            )}
          </div>

          {/* Delivery Details Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Détails de Livraison Client
            </h5>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{currentOrder.wilaya} — {currentOrder.commune}</span>
                  <p className="text-[11px] text-slate-500">{currentOrder.customerAddress}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 text-slate-600">
                <span>Nombre d'articles :</span>
                <span className="font-bold text-slate-900">{currentOrder.items.length} produit(s)</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Mode de règlement :</span>
                <span className="font-bold uppercase text-slate-900">{currentOrder.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Share with customer buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Envoyer le lien de suivi au client (WhatsApp)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyTrackingLink}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le lien</span>
              </button>

              <button
                onClick={() => setSlipOrderId(currentOrder.id)}
                className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Bon de livraison</span>
              </button>
            </div>

            {/* Merchant quick simulator action */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={handleAdvanceProgression}
                disabled={isSimulatingMove || currentOrder.status === 'delivered'}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSimulatingMove ? 'animate-spin' : ''}`} />
                <span>
                  {currentOrder.status === 'delivered' 
                    ? 'Colis déjà acheminé et encaissé' 
                    : 'Actualiser la position / Avancer l\'étape'}
                </span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
