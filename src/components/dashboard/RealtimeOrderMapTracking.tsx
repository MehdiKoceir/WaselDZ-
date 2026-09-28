import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Radio, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  Eye, 
  Printer, 
  Phone, 
  ExternalLink, 
  Share2, 
  ChevronRight, 
  SlidersHorizontal, 
  Zap, 
  Layers, 
  Compass, 
  ShieldCheck, 
  X, 
  Maximize2, 
  Minimize2, 
  Navigation, 
  TrendingUp, 
  Send,
  Bike,
  Car,
  Database,
  Wifi,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { WILAYA_GEO_MAP, DEPOT_CENTRAL, getWilayaGeo, WilayaGeoPoint } from '../../data/wilayaCoordinates';
import { OrderFirestoreService } from '../../services/orderFirestoreService';

export const RealtimeOrderMapTracking: React.FC = () => {
  const { 
    orders: contextOrders, 
    drivers, 
    business, 
    setSelectedOrderId, 
    setSlipOrderId, 
    showToast 
  } = useApp();

  // Local state for live Firestore orders with real-time onSnapshot subscription
  const [liveOrders, setLiveOrders] = useState<Order[]>(contextOrders);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);
  const [lastFirestoreSync, setLastFirestoreSync] = useState<Date>(new Date());
  const [isSimulatingEvent, setIsSimulatingEvent] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'transit' | 'delivered' | 'preparing' | 'issues'>('all');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'centre' | 'est' | 'ouest' | 'sud'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIdOnMap, setSelectedOrderIdOnMap] = useState<string | null>(null);
  const [hoveredWilayaCode, setHoveredWilayaCode] = useState<string | null>(null);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');
  const [showSideFeed, setShowSideFeed] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Subscribe directly to Firestore orders collection in real-time
  useEffect(() => {
    let isSubscribed = true;
    const unsubscribe = OrderFirestoreService.subscribeToOrders(
      (firestoreOrders) => {
        if (!isSubscribed) return;
        if (firestoreOrders && firestoreOrders.length > 0) {
          setLiveOrders(firestoreOrders);
        } else if (contextOrders && contextOrders.length > 0) {
          setLiveOrders(contextOrders);
        }
        setIsFirestoreConnected(true);
        setLastFirestoreSync(new Date());
      },
      (error) => {
        console.warn('[RealtimeOrderMapTracking] Notice écoute Firestore:', error);
        setIsFirestoreConnected(false);
      }
    );

    return () => {
      isSubscribed = false;
      if (unsubscribe) unsubscribe();
    };
  }, [contextOrders]);

  // Keep liveOrders in sync with context if context changes and liveOrders is empty
  useEffect(() => {
    if (contextOrders.length > 0 && liveOrders.length === 0) {
      setLiveOrders(contextOrders);
    }
  }, [contextOrders, liveOrders.length]);

  // Filter orders by status tab, region, and search query
  const filteredOrders = useMemo(() => {
    return liveOrders.filter(order => {
      // 1. Status Filter
      let matchesStatus = true;
      if (activeTab === 'transit') {
        matchesStatus = order.status === 'out_for_delivery' || order.status === 'assigned';
      } else if (activeTab === 'delivered') {
        matchesStatus = order.status === 'delivered';
      } else if (activeTab === 'preparing') {
        matchesStatus = ['new', 'confirmed', 'preparing'].includes(order.status);
      } else if (activeTab === 'issues') {
        matchesStatus = ['failed', 'returned', 'cancelled'].includes(order.status);
      }

      // 2. Region Filter
      let matchesRegion = true;
      if (selectedRegion !== 'all') {
        const geo = getWilayaGeo(order.wilaya);
        matchesRegion = geo.region === selectedRegion;
      }

      // 3. Search Query
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        matchesSearch = 
          order.trackingNumber.toLowerCase().includes(q) ||
          order.customerName.toLowerCase().includes(q) ||
          order.customerPhone.includes(q) ||
          order.wilaya.toLowerCase().includes(q) ||
          order.commune.toLowerCase().includes(q) ||
          order.id.toLowerCase().includes(q);
      }

      return matchesStatus && matchesRegion && matchesSearch;
    });
  }, [liveOrders, activeTab, selectedRegion, searchQuery]);

  // Metrics summary
  const transitOrders = useMemo(() => liveOrders.filter(o => o.status === 'out_for_delivery' || o.status === 'assigned'), [liveOrders]);
  const deliveredOrders = useMemo(() => liveOrders.filter(o => o.status === 'delivered'), [liveOrders]);
  const preparingOrders = useMemo(() => liveOrders.filter(o => ['new', 'confirmed', 'preparing'].includes(o.status)), [liveOrders]);
  const issueOrders = useMemo(() => liveOrders.filter(o => ['failed', 'returned', 'cancelled'].includes(o.status)), [liveOrders]);

  const transitCodAmount = useMemo(() => {
    return transitOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  }, [transitOrders]);

  // Group filtered orders by wilaya code to display pins & badges
  const ordersByWilaya = useMemo(() => {
    const map: Record<string, Order[]> = {};
    filteredOrders.forEach(order => {
      const geo = getWilayaGeo(order.wilaya);
      if (!map[geo.code]) {
        map[geo.code] = [];
      }
      map[geo.code].push(order);
    });
    return map;
  }, [filteredOrders]);

  // Active selected order
  const activeSelectedOrder = useMemo(() => {
    if (!selectedOrderIdOnMap) return null;
    return liveOrders.find(o => o.id === selectedOrderIdOnMap) || null;
  }, [liveOrders, selectedOrderIdOnMap]);

  // Handle direct Firestore status update from the map component
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    try {
      setIsSimulatingEvent(true);
      const updated = await OrderFirestoreService.updateOrderStatus(
        orderId, 
        newStatus, 
        note || `Mise à jour en direct depuis la Carte Firestore WaselDZ`, 
        business.ownerName
      );

      // Optimistic local update
      setLiveOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setLastFirestoreSync(new Date());

      showToast({
        type: newStatus === 'delivered' ? 'success' : newStatus === 'failed' ? 'error' : 'info',
        title: `Statut Colis Actualisé (${STATUS_LABELS[newStatus]?.label || newStatus})`,
        message: `La commande ${updated.trackingNumber} est synchronisée en temps réel dans Firestore.`,
      });
    } catch (err: any) {
      console.error('Erreur mise à jour Firestore:', err);
      showToast({
        type: 'error',
        title: 'Erreur Firestore',
        message: err.message || 'Impossible d\'actualiser le statut.',
      });
    } finally {
      setIsSimulatingEvent(false);
    }
  };

  // Demo: simulate a real-time courier update directly in Firestore
  const handleSimulateCourierPing = async () => {
    // Find an order that can be progressed (preparing -> out_for_delivery, or out_for_delivery -> delivered)
    const candidate = liveOrders.find(o => o.status === 'out_for_delivery') 
      || liveOrders.find(o => o.status === 'assigned')
      || liveOrders.find(o => o.status === 'preparing')
      || liveOrders[0];

    if (!candidate) return;

    setIsSimulatingEvent(true);
    let nextStatus: OrderStatus = 'out_for_delivery';
    let note = 'Scan livreur en direct via terminal mobile';

    if (candidate.status === 'out_for_delivery') {
      nextStatus = 'delivered';
      note = 'Colis remis en main propre au client. C.O.D perçu en espèces.';
    } else if (candidate.status === 'assigned' || candidate.status === 'preparing') {
      nextStatus = 'out_for_delivery';
      note = 'Livreur en route vers la wilaya de destination.';
    }

    try {
      const updated = await OrderFirestoreService.updateOrderStatus(
        candidate.id, 
        nextStatus, 
        note, 
        'Livreur WaselDZ (Mobile)'
      );
      setLiveOrders(prev => prev.map(o => o.id === candidate.id ? updated : o));
      setSelectedOrderIdOnMap(candidate.id);
      setLastFirestoreSync(new Date());

      showToast({
        type: 'success',
        title: '⚡ Événement Firestore Reçu en Direct !',
        message: `Colis ${candidate.trackingNumber} (${candidate.customerName}) passé à "${STATUS_LABELS[nextStatus].label}"`,
      });
    } catch (e: any) {
      console.error('Erreur simulation:', e);
    } finally {
      setIsSimulatingEvent(false);
    }
  };

  // SVG ViewBox based on Region Zoom
  const viewBox = useMemo(() => {
    if (selectedRegion === 'centre') return '320 100 280 180';
    if (selectedRegion === 'ouest') return '120 140 280 180';
    if (selectedRegion === 'est') return '540 120 300 200';
    if (selectedRegion === 'sud') return '120 280 620 360';
    return '100 80 750 560'; // Full Algeria Overview
  }, [selectedRegion]);

  return (
    <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
      mapTheme === 'dark' 
        ? 'bg-slate-950 border-slate-800 text-white shadow-2xl' 
        : 'bg-white border-slate-200 text-slate-900 shadow-xl'
    } ${isExpanded ? 'fixed inset-4 z-50 overflow-y-auto' : 'relative'}`}>
      
      {/* Top Bar: Live Status & Firestore Connection Badge */}
      <div className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b ${
        mapTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 relative shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
                <span>Carte des Colis en Temps Réel 🇩🇿</span>
              </h3>

              {/* Firestore Real-Time Connectivity Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Database className="w-3 h-3" />
                <span>Firestore Connecté en direct</span>
              </div>
            </div>

            <p className={`text-xs mt-0.5 ${mapTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Surveillance géographique des livraisons en cours, des colis livrés et du cash C.O.D
            </p>
          </div>
        </div>

        {/* Action Controls: Live Simulation, Theme & Fullscreen Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real-time simulation trigger */}
          <button
            onClick={handleSimulateCourierPing}
            disabled={isSimulatingEvent}
            className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Simule un scan livreur et persiste la modification dans Firestore"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Simuler Scan Livreur (Firestore)</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setMapTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              mapTheme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Basculer le style de la carte"
          >
            {mapTheme === 'dark' ? '☀️ Mode Clair' : '🌙 Radar Sombre'}
          </button>

          {/* Expand / Minimize */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              mapTheme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isExpanded ? 'Réduire' : 'Plein écran'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Toggle Side Feed */}
          <button
            onClick={() => setShowSideFeed(prev => !prev)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              showSideFeed
                ? 'bg-blue-600 text-white border-blue-600'
                : mapTheme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Liste</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x border-b ${
        mapTheme === 'dark' 
          ? 'bg-slate-900/50 border-slate-800 divide-slate-800' 
          : 'bg-slate-50/70 border-slate-200 divide-slate-200'
      }`}>
        {/* En transit */}
        <div 
          onClick={() => setActiveTab('transit')}
          className={`p-3 sm:p-4 text-center cursor-pointer transition-colors ${
            activeTab === 'transit' ? (mapTheme === 'dark' ? 'bg-cyan-950/40' : 'bg-cyan-50') : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-cyan-500 text-xs font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Truck className="w-4 h-4" />
            <span>En Transit Live</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
            {transitOrders.length} <span className="text-xs font-medium text-slate-400">colis</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            C.O.D en route : <strong className="text-cyan-300">{formatDZD(transitCodAmount)}</strong>
          </div>
        </div>

        {/* Livrés */}
        <div 
          onClick={() => setActiveTab('delivered')}
          className={`p-3 sm:p-4 text-center cursor-pointer transition-colors ${
            activeTab === 'delivered' ? (mapTheme === 'dark' ? 'bg-emerald-950/40' : 'bg-emerald-50') : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-emerald-500 text-xs font-bold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Colis Livrés</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {deliveredOrders.length} <span className="text-xs font-medium text-slate-400">livrés</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Remis en main propre
          </div>
        </div>

        {/* En Préparation */}
        <div 
          onClick={() => setActiveTab('preparing')}
          className={`p-3 sm:p-4 text-center cursor-pointer transition-colors ${
            activeTab === 'preparing' ? (mapTheme === 'dark' ? 'bg-amber-950/40' : 'bg-amber-50') : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>En Préparation</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
            {preparingOrders.length} <span className="text-xs font-medium text-slate-400">dépôt</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Prêts pour expédition
          </div>
        </div>

        {/* Incidents / Retours */}
        <div 
          onClick={() => setActiveTab('issues')}
          className={`p-3 sm:p-4 text-center cursor-pointer transition-colors ${
            activeTab === 'issues' ? (mapTheme === 'dark' ? 'bg-rose-950/40' : 'bg-rose-50') : ''
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 text-rose-500 text-xs font-bold mb-1">
            <AlertCircle className="w-4 h-4" />
            <span>Alertes / Retours</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono">
            {issueOrders.length} <span className="text-xs font-medium text-slate-400">alertes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            À régulariser
          </div>
        </div>
      </div>

      {/* Filter and Zoom Navigation Toolbar */}
      <div className={`p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 border-b ${
        mapTheme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `Tous (${liveOrders.length})` },
            { id: 'transit', label: `🚚 En transit (${transitOrders.length})` },
            { id: 'delivered', label: `✅ Livrés (${deliveredOrders.length})` },
            { id: 'preparing', label: `📦 En préparation (${preparingOrders.length})` },
            { id: 'issues', label: `⚠️ Retours (${issueOrders.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : mapTheme === 'dark'
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Region & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Region selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <span className="text-[10px] text-slate-400 px-1 font-bold">Zone :</span>
            {(['all', 'centre', 'est', 'ouest', 'sud'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {reg === 'all' ? 'DZ' : reg}
              </button>
            ))}
          </div>

          {/* Quick search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Suivi, Wilaya, Client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                mapTheme === 'dark'
                  ? 'bg-slate-800 text-white border-slate-700 placeholder-slate-400'
                  : 'bg-slate-100 text-slate-900 border-slate-200 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Map Body with Side Feed */}
      <div className="relative flex flex-col lg:flex-row min-h-[520px]">
        
        {/* Interactive SVG Geographic Map */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4 select-none">
          
          {/* Subtle Radar Background Grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none" 
            style={{ 
              backgroundImage: mapTheme === 'dark' 
                ? 'radial-gradient(circle, #38bdf8 1px, transparent 1px)' 
                : 'radial-gradient(circle, #64748b 1px, transparent 1px)', 
              backgroundSize: '30px 30px' 
            }} 
          />

          {/* Map Compass & Telemetry overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-2 backdrop-blur-md ${
              mapTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-700'
            }`}>
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Algérie : 58 Wilayas • Hub Alger</span>
            </div>

            <div className={`px-3 py-1.5 rounded-xl border text-[11px] flex items-center gap-2 backdrop-blur-md ${
              mapTheme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-emerald-400' : 'bg-white/80 border-slate-200 text-emerald-700'
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Dernier flux : {lastFirestoreSync.toLocaleTimeString('fr-DZ')}</span>
            </div>
          </div>

          {/* Legend overlay */}
          <div className={`absolute bottom-4 left-4 z-20 p-2.5 rounded-xl border text-[11px] backdrop-blur-md hidden sm:flex flex-col gap-1.5 ${
            mapTheme === 'dark' ? 'bg-slate-900/85 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700'
          }`}>
            <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">Légende des Colis :</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-500/40 animate-pulse" />
              <span>En transit (En cours de route)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Livré avec succès & C.O.D perçu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>En préparation au dépôt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Échec / Retour</span>
            </div>
          </div>

          {/* The Main SVG Canvas */}
          <svg 
            className="w-full h-full max-h-[580px] drop-shadow-md" 
            viewBox={viewBox} 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Route line gradients */}
              <linearGradient id="transitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>

              {/* Central hub glow */}
              <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Stylized Mediterranean Sea Coastline Header Area */}
            <path
              d="M 120,135 Q 240,110 360,125 T 470,115 T 600,120 T 730,110 T 820,125"
              fill="none"
              stroke={mapTheme === 'dark' ? '#0284c7' : '#93c5fd'}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            <text x="320" y="98" fill={mapTheme === 'dark' ? '#0284c7' : '#60a5fa'} fontSize="11" fontWeight="bold" opacity="0.6">
              MER MÉDITERRANÉE (LITTORAL NORD)
            </text>

            {/* Approximate stylized polygon border of Algeria */}
            <path
              d="M 150,220 
                 L 220,175 
                 L 300,160 
                 L 470,130 
                 L 590,140 
                 L 770,130 
                 L 815,160 
                 L 790,265 
                 L 720,380 
                 L 640,460 
                 L 590,620 
                 L 290,560 
                 L 140,410 
                 L 150,300 Z"
              fill={mapTheme === 'dark' ? '#0f172a' : '#f8fafc'}
              stroke={mapTheme === 'dark' ? '#334155' : '#cbd5e1'}
              strokeWidth="2"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Regional Boundaries Subdivision (Subtle) */}
            {/* Ouest separation */}
            <line x1="330" y1="165" x2="330" y2="350" stroke={mapTheme === 'dark' ? '#1e293b' : '#e2e8f0'} strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Est separation */}
            <line x1="560" y1="140" x2="560" y2="350" stroke={mapTheme === 'dark' ? '#1e293b' : '#e2e8f0'} strokeWidth="1.5" strokeDasharray="4 4" />
            {/* Sud separation */}
            <line x1="150" y1="350" x2="750" y2="350" stroke={mapTheme === 'dark' ? '#1e293b' : '#e2e8f0'} strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Regional Label Watermarks */}
            <text x="210" y="290" fill={mapTheme === 'dark' ? '#334155' : '#cbd5e1'} fontSize="18" fontWeight="900" opacity="0.3">
              OUEST
            </text>
            <text x="430" y="270" fill={mapTheme === 'dark' ? '#334155' : '#cbd5e1'} fontSize="18" fontWeight="900" opacity="0.3">
              CENTRE
            </text>
            <text x="660" y="280" fill={mapTheme === 'dark' ? '#334155' : '#cbd5e1'} fontSize="18" fontWeight="900" opacity="0.3">
              EST
            </text>
            <text x="410" y="470" fill={mapTheme === 'dark' ? '#334155' : '#cbd5e1'} fontSize="22" fontWeight="900" opacity="0.25">
              SUD / SAHARA
            </text>

            {/* Active Delivery Routes (Animated Lines from Depot Alger to Destination Wilayas) */}
            {transitOrders.map((order, idx) => {
              const destGeo = getWilayaGeo(order.wilaya);
              // Calculate curved quadratic path
              const midX = (DEPOT_CENTRAL.x + destGeo.x) / 2 + (idx % 2 === 0 ? 15 : -15);
              const midY = (DEPOT_CENTRAL.y + destGeo.y) / 2 - 25;
              const pathD = `M ${DEPOT_CENTRAL.x},${DEPOT_CENTRAL.y} Q ${midX},${midY} ${destGeo.x},${destGeo.y}`;

              const isSelected = order.id === selectedOrderIdOnMap;

              return (
                <g key={`route-${order.id}`}>
                  {/* Outer glow line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth={isSelected ? '3' : '1.5'}
                    strokeDasharray="6 4"
                    opacity={isSelected ? 0.9 : 0.6}
                    className="animate-pulse"
                  />
                  {/* Moving courier marker indicator along the curve */}
                  <circle
                    r={isSelected ? '5' : '3.5'}
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  >
                    <animateMotion
                      path={pathD}
                      dur={`${6 + (idx % 3) * 2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}

            {/* Inactive Wilaya Hub Base Nodes (for geographical context) */}
            {Object.values(WILAYA_GEO_MAP).map(point => {
              const hasOrders = !!ordersByWilaya[point.code];
              if (hasOrders) return null; // Rendered below with active badge
              return (
                <g 
                  key={`wilaya-node-${point.code}`}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                  opacity={mapTheme === 'dark' ? 0.35 : 0.45}
                  onMouseEnter={() => setHoveredWilayaCode(point.code)}
                  onMouseLeave={() => setHoveredWilayaCode(null)}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={point.isHub ? 4 : 2.5}
                    fill={mapTheme === 'dark' ? '#94a3b8' : '#64748b'}
                  />
                  <text
                    x={point.x}
                    y={point.y + 12}
                    textAnchor="middle"
                    fontSize="9"
                    fill={mapTheme === 'dark' ? '#64748b' : '#94a3b8'}
                    fontWeight="500"
                  >
                    {point.name}
                  </text>
                </g>
              );
            })}

            {/* Central Depot: Alger (Headquarters & Dispatch Center) */}
            <g transform={`translate(${DEPOT_CENTRAL.x}, ${DEPOT_CENTRAL.y})`}>
              {/* Radar sweep wave */}
              <circle r="22" fill="url(#hubGlow)" className="animate-ping" opacity="0.4" />
              <circle r="14" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                DZ
              </text>
              <rect x="-45" y="-28" width="90" height="18" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
              <text x="0" y="-16" textAnchor="middle" fill="#60a5fa" fontSize="9" fontWeight="bold">
                Hub Alger (Dépôt)
              </text>
            </g>

            {/* Active Wilayas with Orders */}
            {(Object.entries(ordersByWilaya) as [string, Order[]][]).map(([wilayaCode, ordersInWilaya]) => {
              const point = WILAYA_GEO_MAP[wilayaCode] || getWilayaGeo(wilayaCode);
              const orderCount = ordersInWilaya.length;

              // Dominant status in this wilaya
              const hasTransit = ordersInWilaya.some(o => o.status === 'out_for_delivery' || o.status === 'assigned');
              const hasDelivered = ordersInWilaya.some(o => o.status === 'delivered');
              const hasIssues = ordersInWilaya.some(o => ['failed', 'returned', 'cancelled'].includes(o.status));

              let pinColor = '#3b82f6'; // default
              let pinBg = 'bg-blue-600';
              let ringColor = 'ring-blue-400';

              if (hasIssues) {
                pinColor = '#f43f5e';
                pinBg = 'bg-rose-600';
                ringColor = 'ring-rose-400';
              } else if (hasTransit) {
                pinColor = '#06b6d4';
                pinBg = 'bg-cyan-500';
                ringColor = 'ring-cyan-400';
              } else if (hasDelivered) {
                pinColor = '#10b981';
                pinBg = 'bg-emerald-600';
                ringColor = 'ring-emerald-400';
              } else {
                pinColor = '#f59e0b';
                pinBg = 'bg-amber-500';
                ringColor = 'ring-amber-400';
              }

              const isWilayaSelected = ordersInWilaya.some(o => o.id === selectedOrderIdOnMap);

              return (
                <g 
                  key={`active-wilaya-${wilayaCode}`}
                  transform={`translate(${point.x}, ${point.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedOrderIdOnMap(ordersInWilaya[0].id);
                  }}
                  onMouseEnter={() => setHoveredWilayaCode(wilayaCode)}
                  onMouseLeave={() => setHoveredWilayaCode(null)}
                >
                  {/* Ping radar ring if has orders in transit */}
                  {hasTransit && (
                    <circle
                      r="20"
                      fill="none"
                      stroke={pinColor}
                      strokeWidth="2"
                      className="animate-ping"
                      opacity="0.6"
                    />
                  )}

                  {/* Highlight ring if selected */}
                  {isWilayaSelected && (
                    <circle
                      r="18"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                    />
                  )}

                  {/* Main Marker Pin */}
                  <circle
                    r={isWilayaSelected ? 12 : 9.5}
                    fill={pinColor}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="drop-shadow-lg transition-transform duration-200 group-hover:scale-125"
                  />

                  {/* Parcel Count Text inside pin */}
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    {orderCount}
                  </text>

                  {/* Wilaya Label Pill below marker */}
                  <rect
                    x="-32"
                    y="13"
                    width="64"
                    height="16"
                    rx="5"
                    fill={mapTheme === 'dark' ? '#0f172a' : '#ffffff'}
                    stroke={pinColor}
                    strokeWidth="1.2"
                    className="drop-shadow-xs"
                  />
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fill={mapTheme === 'dark' ? '#f1f5f9' : '#0f172a'}
                    fontSize="8.5"
                    fontWeight="bold"
                  >
                    {point.name} ({orderCount})
                  </text>

                  {/* Status Indicator Tag */}
                  {hasTransit && (
                    <g transform="translate(10, -10)">
                      <circle r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
                      <text x="0" y="2.5" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">
                        ⚡
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Card for Active Selected Order */}
          {activeSelectedOrder && (
            <div className={`absolute top-4 right-4 z-30 w-80 sm:w-88 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
              mapTheme === 'dark' 
                ? 'bg-slate-900/95 border-slate-700 text-white' 
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b pb-3 mb-3 border-slate-700/60">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-cyan-400">
                      {activeSelectedOrder.trackingNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      STATUS_LABELS[activeSelectedOrder.status]?.bg || 'bg-blue-50'
                    } ${STATUS_LABELS[activeSelectedOrder.status]?.text || 'text-blue-700'}`}>
                      {STATUS_LABELS[activeSelectedOrder.status]?.label || activeSelectedOrder.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {activeSelectedOrder.commune}, <strong className="text-slate-200">{activeSelectedOrder.wilaya}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrderIdOnMap(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Customer & Delivery Details */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Client :</span>
                  <span className="font-bold">{activeSelectedOrder.customerName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Téléphone :</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-300">
                    <Phone className="w-3 h-3" />
                    <span>{activeSelectedOrder.customerPhone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Montant C.O.D :</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">
                    {formatDZD(activeSelectedOrder.totalAmount)}
                  </span>
                </div>

                {activeSelectedOrder.driverId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Livreur assigné :</span>
                    <span className="font-semibold text-purple-400">
                      {drivers.find(d => d.id === activeSelectedOrder.driverId)?.name || 'Coursier WaselDZ'}
                    </span>
                  </div>
                )}
              </div>

              {/* Firestore Real-Time Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Changer le statut en direct (Firestore) :
                </span>

                <div className="grid grid-cols-2 gap-1.5">
                  {activeSelectedOrder.status !== 'out_for_delivery' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(activeSelectedOrder.id, 'out_for_delivery', 'Livreur en route vers la Wilaya')}
                      disabled={isSimulatingEvent}
                      className="px-2.5 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>🚚 En Transit</span>
                    </button>
                  )}

                  {activeSelectedOrder.status !== 'delivered' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(activeSelectedOrder.id, 'delivered', 'Colis remis en main propre. C.O.D encaissé')}
                      disabled={isSimulatingEvent}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>✅ Marquer Livré</span>
                    </button>
                  )}

                  {activeSelectedOrder.status !== 'preparing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(activeSelectedOrder.id, 'preparing', 'En préparation au dépôt')}
                      disabled={isSimulatingEvent}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600 border border-amber-500/40 text-amber-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      <span>📦 Préparation</span>
                    </button>
                  )}

                  {activeSelectedOrder.status !== 'failed' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(activeSelectedOrder.id, 'failed', 'Client absent ou injoignable')}
                      disabled={isSimulatingEvent}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 border border-rose-500/40 text-rose-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>⚠️ Échec / Retour</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSlipOrderId(activeSelectedOrder.id);
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Bon de livraison</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedOrderId(activeSelectedOrder.id);
                    }}
                    className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Fiche complète</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collapsible Right Feed: List of Packages Sorted by Status / Updates */}
        {showSideFeed && (
          <div className={`w-full lg:w-80 border-t lg:border-t-0 lg:border-l flex flex-col max-h-[520px] ${
            mapTheme === 'dark' ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                Flux des Colis ({filteredOrders.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Live Firestore
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Aucun colis ne correspond aux critères sélectionnés.
                </div>
              ) : (
                filteredOrders.map(order => {
                  const isSelected = order.id === selectedOrderIdOnMap;
                  const isTransit = order.status === 'out_for_delivery' || order.status === 'assigned';
                  const isDelivered = order.status === 'delivered';

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderIdOnMap(order.id)}
                      className={`p-3 rounded-xl transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-blue-600/30 border border-blue-500/50 shadow-md'
                          : mapTheme === 'dark'
                            ? 'hover:bg-slate-800/80 bg-slate-900/40 border border-transparent'
                            : 'hover:bg-white bg-slate-100/60 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          {isTransit && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          )}
                          <span className="font-mono font-bold text-xs text-white">
                            {order.trackingNumber}
                          </span>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDelivered 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : isTransit 
                              ? 'bg-cyan-500/20 text-cyan-300' 
                              : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {STATUS_LABELS[order.status]?.label || order.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-slate-300 font-medium truncate max-w-[140px]">
                          {order.customerName}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {order.wilaya.split('-')[1]?.trim() || order.wilaya}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] mt-1 pt-1 border-t border-slate-800/40">
                        <span className="text-slate-400">Total C.O.D :</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {formatDZD(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Real-time sync footer */}
            <div className="p-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/40">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Écoute Firestore Active
              </span>
              <button
                onClick={handleSimulateCourierPing}
                className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
              >
                + Tester mise à jour
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
