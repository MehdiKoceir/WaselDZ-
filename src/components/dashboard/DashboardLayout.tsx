import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Users, 
  UserCheck, 
  Boxes, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell, 
  Menu, 
  X, 
  Globe, 
  Building2,
  ChevronDown,
  RotateCcw,
  Printer,
  ShieldCheck,
  Database,
  CheckCircle2,
  Clock,
  TrendingUp,
  TableProperties,
  CheckCheck,
  Trash2,
  PlayCircle,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';
import { DashboardTab } from '../../types';
import { OverviewView } from './OverviewView';
import { OrdersView } from './OrdersView';
import { DeliveriesView } from './DeliveriesView';
import { CustomersView } from './CustomersView';
import { DriversView } from './DriversView';
import { ProductsView } from './ProductsView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { SecurityCapacityView } from './SecurityCapacityView';
import { OrdersSummaryTable } from './OrdersSummaryTable';
import { CreateOrderModal } from './CreateOrderModal';
import { OrderDrawer } from './OrderDrawer';
import { DeliverySlipModal } from './DeliverySlipModal';
import { RealtimeTrackingModal } from './RealtimeTrackingModal';
import { ToastContainer } from '../common/ToastContainer';
import { ConfirmModal } from '../common/ConfirmModal';

export const DashboardLayout: React.FC = () => {
  const { 
    dashboardTab, 
    setDashboardTab, 
    business,
    currentBusiness, 
    setIsOrderModalOpen, 
    setCurrentView, 
    orders,
    drivers,
    slipOrderId,
    setSlipOrderId,
    trackingOrderId,
    setTrackingOrderId,
    toasts,
    dismissToast,
    queueRemainingCount,
    deliveryNotifications,
    unreadNotificationsCount,
    markAllNotificationsAsRead,
    clearNotificationHistory,
    simulateDeliveryProgression,
    setSelectedOrderId,
    confirmDialog,
    closeConfirmDialog,
    showConfirmDialog,
    resetDemoData,
    cloudSyncStatus,
    cloudLatencyMs,
    searchFilter,
    setSearchFilter
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter orders by customer name or tracking number
  const trimmedSearch = searchFilter.trim().toLowerCase();
  const searchMatchingOrders = useMemo(() => {
    if (!trimmedSearch) return [];
    return orders.filter(o => 
      o.customerName.toLowerCase().includes(trimmedSearch) ||
      o.trackingNumber.toLowerCase().includes(trimmedSearch) ||
      o.id.toLowerCase().includes(trimmedSearch)
    );
  }, [orders, trimmedSearch]);

  const pendingCount = orders.filter(o => ['new', 'confirmed', 'preparing', 'assigned', 'out_for_delivery'].includes(o.status)).length;
  const activeBusiness = currentBusiness || business;
  const slipOrder = orders.find(o => o.id === slipOrderId) || null;
  const slipDriver = slipOrder?.driverId ? drivers.find(d => d.id === slipOrder.driverId) : undefined;

  // Key Order Statistics (total, en cours, livrées)
  const totalOrdersCount = orders.length;
  const inProgressOrdersCount = pendingCount;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const deliverySuccessRate = totalOrdersCount > 0 
    ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100) 
    : 0;

  const navigationItems: { id: DashboardTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Vue d\'ensemble & Récapitulatif', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: Package, badge: orders.length },
    { id: 'deliveries', label: 'Courses & Livraisons', icon: Truck, badge: pendingCount },
    { id: 'customers', label: 'Clients (CRM)', icon: Users },
    { id: 'drivers', label: 'Flotte Livreurs', icon: UserCheck },
    { id: 'products', label: 'Catalogue & Stocks', icon: Boxes },
    { id: 'analytics', label: 'Finances & Rentabilité', icon: BarChart3 },
    { id: 'security', label: 'Sécurité & Base Cloud', icon: ShieldCheck },
    { id: 'settings', label: 'Paramètres Boutique', icon: Settings },
  ];

  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchFilter.trim()) {
      setDashboardTab('orders');
      setIsSearchFocused(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside 
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 border-r border-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-mono font-bold text-xs">
                DZ
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-white block">
                  Wasel<span className="text-slate-400 font-normal">Logistics</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Terminal Opérations
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Business Mini Card */}
          <div className="p-3 m-3 bg-slate-800/80 rounded-md border border-slate-700/80 flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {activeBusiness.name}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {activeBusiness.wilaya} · {activeBusiness.currency || 'DZD'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-0.5 overflow-y-auto flex-1 py-2">
            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = dashboardTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setDashboardTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-white pl-2.5 shadow-xs' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white text-blue-700' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          <button
            onClick={() => {
              showConfirmDialog({
                title: 'Réinitialiser le registre de démonstration ?',
                message: 'Cette action réinitialisera toutes les commandes, clients et chauffeurs aux données par défaut d\'Algérie.',
                confirmLabel: 'Réinitialiser les données',
                cancelLabel: 'Garder mes données',
                onConfirm: resetDemoData,
              });
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Réinitialiser Démo</span>
          </button>

          <button
            onClick={() => setCurrentView('landing')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Page d'accueil WaselDZ</span>
          </button>

          <button
            onClick={() => setCurrentView('signin')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:block">
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                {activeBusiness.name}
              </span>
              <span className="text-[11px] text-slate-500 block">
                Session commerçant • {activeBusiness.wilaya}
              </span>
            </div>
          </div>

          {/* Topbar Search Bar: Filtrer par nom de client ou numéro de suivi */}
          <div ref={searchContainerRef} className="flex-1 max-w-md mx-2 sm:mx-6 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher par nom de client ou N° suivi..."
                value={searchFilter}
                onChange={(e) => {
                  setSearchFilter(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setDashboardTab('orders');
                    setIsSearchFocused(false);
                  }
                }}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
              />
              {searchFilter ? (
                <button
                  onClick={() => {
                    setSearchFilter('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="hidden sm:inline absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded pointer-events-none">
                  /
                </span>
              )}
            </div>

            {/* Quick dropdown preview when searching */}
            {isSearchFocused && trimmedSearch.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 p-2 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-2 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 border-b border-slate-100">
                  <span>Résultats ({searchMatchingOrders.length})</span>
                  <span className="text-[10px] text-slate-400 font-medium">Nom client ou N° suivi</span>
                </div>

                {searchMatchingOrders.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Aucune commande trouvée pour "{searchFilter}"
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 mt-1">
                    {searchMatchingOrders.slice(0, 5).map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setDashboardTab('orders');
                          setIsSearchFocused(false);
                        }}
                        className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            <span>{o.customerName}</span>
                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-normal">
                              {o.trackingNumber}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {o.wilaya} • {formatDZD(o.totalAmount)}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 whitespace-nowrap">
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setDashboardTab('orders');
                      setIsSearchFocused(false);
                    }}
                    className="w-full text-center py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Voir dans le registre complet ({searchMatchingOrders.length}) &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Real-time Cloud Status Pill */}
            <button
              onClick={() => setDashboardTab('security')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-md cursor-pointer text-slate-700 transition-colors text-xs font-medium shadow-xs"
              title="Cluster Firestore actif & sécurisé. Cliquez pour inspecter la capacité et la sécurité."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-slate-900 font-semibold">Cluster Cloud</span>
              {cloudLatencyMs !== null && (
                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1 py-0.5 rounded">
                  {cloudLatencyMs}ms
                </span>
              )}
            </button>

            {/* Quick Create Order Button */}
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="px-3 sm:px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Créer une Expédition</span>
              <span className="sm:hidden">Ajouter</span>
            </button>

            {/* Notifications Bell & Delivery Queue Center */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors relative cursor-pointer border border-slate-200 bg-white"
                aria-label="Centre de notifications et file d'attente"
                title="File d'attente des notifications de livraison"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 ? (
                  <span className="min-w-4.5 h-4.5 px-1 bg-rose-600 text-white text-[10px] font-black rounded-full absolute -top-1 -right-1 flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                ) : queueRemainingCount > 0 ? (
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full absolute top-1 right-1 animate-ping" />
                ) : (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-1.5 right-1.5" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 text-xs animate-in fade-in zoom-in-95 divide-y divide-slate-100 max-h-[85vh] flex flex-col">
                  {/* Dropdown Header */}
                  <div className="pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">
                          File d'attente & Alertes
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Changements de statut de livraison
                        </div>
                      </div>
                    </div>

                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        title="Marquer toutes les alertes comme lues"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Tout lire</span>
                      </button>
                    )}
                  </div>

                  {/* Active Queue Status Ribbon */}
                  {queueRemainingCount > 0 && (
                    <div className="py-2.5 px-3 my-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-center justify-between">
                      <span className="text-[11px] font-semibold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        File active : <strong>+{queueRemainingCount}</strong> en cours d'affichage
                      </span>
                    </div>
                  )}

                  {/* Notification Items List */}
                  <div className="py-2 overflow-y-auto max-h-72 space-y-2 pr-1">
                    {deliveryNotifications.length === 0 ? (
                      <div className="text-center py-6 px-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                          <Bell className="w-5 h-5 opacity-60" />
                        </div>
                        <p className="font-bold text-slate-700">Aucune alerte récente</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Les changements de statut de livraison déclencheront des alertes toast et s'afficheront ici.
                        </p>
                      </div>
                    ) : (
                      deliveryNotifications.slice(0, 15).map((notif) => {
                        const isDelivered = notif.newStatus === 'delivered';
                        const isOut = notif.newStatus === 'out_for_delivery';
                        const isFailed = notif.newStatus === 'failed' || notif.newStatus === 'returned';

                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              setSelectedOrderId(notif.orderId);
                              setShowNotifications(false);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${
                              !notif.read 
                                ? 'bg-blue-50/50 border-blue-200/80 hover:bg-blue-100/60' 
                                : 'bg-slate-50/70 border-slate-200/70 hover:bg-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono font-bold text-[10px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                {notif.orderId}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isDelivered 
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isOut
                                    ? 'bg-blue-100 text-blue-800'
                                    : isFailed
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                              }`}>
                                {notif.newStatus}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                              {notif.message}
                            </p>

                            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                              <span>{notif.customerName} ({notif.wilaya})</span>
                              <span className="text-blue-600 font-bold group-hover:underline">
                                Voir commande &rarr;
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer Actions */}
                  <div className="pt-3 mt-1 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        simulateDeliveryProgression();
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-colors flex items-center gap-1.5 text-[11px] cursor-pointer"
                      title="Lancer une simulation de progression de livraison pour observer la file d'attente"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Simuler une livraison</span>
                    </button>

                    {deliveryNotifications.length > 0 && (
                      <button
                        onClick={clearNotificationHistory}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Vider l'historique des alertes"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div 
              onClick={() => setDashboardTab('settings')}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {activeBusiness.ownerName.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {activeBusiness.ownerName}
                </div>
                <div className="text-[10px] text-slate-500">Gérant</div>
              </div>
            </div>
          </div>

        </header>

        {/* Key Orders Statistics Ribbon (Total, En cours, Livrées) - Demande Utilisateur */}
        <section className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 shadow-2xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Context Badge */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                Statistiques Clés Commandes
              </span>
            </div>

            {/* Key KPI Stats Cards: Total, En cours, Livrées */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-1 max-w-3xl">
              
              {/* Total Commandes Card */}
              <div 
                onClick={() => setDashboardTab('orders')}
                className="bg-slate-50 hover:bg-blue-50/60 p-2.5 rounded-xl border border-slate-200 transition-all flex items-center justify-between cursor-pointer group"
                title="Consulter le registre complet des commandes"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Total Commandes
                    </span>
                    <span className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {totalOrdersCount}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                  Global
                </span>
              </div>

              {/* Commandes En Cours Card */}
              <div 
                onClick={() => setDashboardTab('orders')}
                className="bg-amber-50/60 hover:bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/80 transition-all flex items-center justify-between cursor-pointer group"
                title="Consulter les commandes en cours de traitement et livraison"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      En Cours
                    </span>
                    <span className="text-base font-black text-amber-950 group-hover:text-amber-800 transition-colors">
                      {inProgressOrdersCount}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                  Actives
                </span>
              </div>

              {/* Commandes Livrées Card */}
              <div 
                onClick={() => setDashboardTab('orders')}
                className="bg-emerald-50/60 hover:bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-200/80 transition-all flex items-center justify-between cursor-pointer group"
                title="Consulter les commandes livrées avec succès"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Livrées
                    </span>
                    <span className="text-base font-black text-emerald-950 group-hover:text-emerald-800 transition-colors">
                      {deliveredOrdersCount}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  {deliverySuccessRate}% succès
                </span>
              </div>

            </div>

            {/* Quick Action to Tableau Récapitulatif */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDashboardTab('overview')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  dashboardTab === 'overview'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Accéder au tableau récapitulatif des commandes"
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Tableau Récapitulatif</span>
              </button>
            </div>

          </div>
        </section>

        {/* Active Search Filter Banner */}
        {trimmedSearch && (
          <div className="bg-blue-50/90 border-b border-blue-200/90 px-4 sm:px-8 py-2.5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-blue-900">
                  Filtre actif par nom de client ou N° suivi : <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-200 text-blue-950">"{searchFilter}"</strong>
                </span>
                <span className="text-blue-700 font-bold">
                  ({searchMatchingOrders.length} résultat{searchMatchingOrders.length > 1 ? 's' : ''})
                </span>
              </div>
              <div className="flex items-center gap-3">
                {dashboardTab !== 'orders' && (
                  <button
                    onClick={() => setDashboardTab('orders')}
                    className="text-blue-700 font-bold hover:underline cursor-pointer"
                  >
                    Voir dans le tableau des commandes &rarr;
                  </button>
                )}
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Effacer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {dashboardTab === 'overview' && <OverviewView />}
          {dashboardTab === 'orders' && <OrdersView />}
          {dashboardTab === 'deliveries' && <DeliveriesView />}
          {dashboardTab === 'customers' && <CustomersView />}
          {dashboardTab === 'drivers' && <DriversView />}
          {dashboardTab === 'products' && <ProductsView />}
          {dashboardTab === 'analytics' && <AnalyticsView />}
          {dashboardTab === 'security' && <SecurityCapacityView />}
          {dashboardTab === 'settings' && <SettingsView />}
        </main>

      </div>

      {/* Global Modals & Drawers */}
      <CreateOrderModal />
      <OrderDrawer />
      <DeliverySlipModal 
        order={slipOrder}
        business={activeBusiness}
        driver={slipDriver}
        isOpen={Boolean(slipOrderId)}
        onClose={() => setSlipOrderId(null)}
      />
      <RealtimeTrackingModal
        orderId={trackingOrderId}
        onClose={() => setTrackingOrderId(null)}
      />

      {/* Accessible Notifications & Feedback */}
      <ToastContainer 
        toasts={toasts} 
        onDismiss={dismissToast} 
        queueRemainingCount={queueRemainingCount} 
      />
      <ConfirmModal state={confirmDialog} onClose={closeConfirmDialog} />

    </div>
  );
};
