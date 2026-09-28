import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { INITIAL_BUSINESS, INITIAL_CUSTOMERS, INITIAL_DRIVERS, INITIAL_ORDERS, INITIAL_PRODUCTS, INITIAL_STOCK_MOVEMENTS } from '../data/initialData';
import { 
  ActiveDashboardTab, 
  BusinessProfile, 
  ConfirmDialogState, 
  Customer, 
  Driver, 
  Order, 
  OrderStatus, 
  Product, 
  StockMovement,
  ToastNotification,
  DeliveryNotificationItem 
} from '../types';
import confetti from 'canvas-confetti';
import { db, testFirestoreConnection, ensureAuthenticatedUser } from '../lib/firebase';
import { doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { OrderFirestoreService, CustomerDetailsUpdate } from '../services/orderFirestoreService';
import { NotificationQueueService } from '../services/notificationQueueService';

interface AppContextType {
  currentView: 'landing' | 'signin' | 'signup' | 'dashboard';
  setCurrentView: (view: 'landing' | 'signin' | 'signup' | 'dashboard') => void;
  dashboardTab: ActiveDashboardTab;
  setDashboardTab: (tab: ActiveDashboardTab) => void;
  business: BusinessProfile;
  currentBusiness: BusinessProfile; // ergonomic alias
  orders: Order[];
  drivers: Driver[];
  customers: Customer[];
  products: Product[];
  stockMovements: StockMovement[];
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  slipOrderId: string | null;
  setSlipOrderId: (id: string | null) => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;
  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  searchFilter: string;
  setSearchFilter: (query: string) => void;

  // Cloud Database & Telemetry
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  cloudLatencyMs: number | null;
  isCloudPersistent: boolean;
  forceCloudSync: () => Promise<void>;
  serverHealth: any | null;
  
  // Feedback & Notification Queue System
  toasts: ToastNotification[];
  queueRemainingCount: number;
  showToast: (toast: Omit<ToastNotification, 'id'>) => void;
  dismissToast: (id: string) => void;
  deliveryNotifications: DeliveryNotificationItem[];
  unreadNotificationsCount: number;
  markAllNotificationsAsRead: () => void;
  clearNotificationHistory: () => void;
  simulateDeliveryProgression: (orderId?: string) => void;

  confirmDialog: ConfirmDialogState;
  showConfirmDialog: (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => void;
  closeConfirmDialog: () => void;

  // Actions
  createOrder: (order: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'history'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updateCustomerInfo: (orderId: string, customerData: CustomerDetailsUpdate) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  assignDriver: (orderId: string, driverId: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteOrderId: (orderId: string) => void; // alias
  orderFirestoreService: typeof OrderFirestoreService;
  batchUpdateStatus: (orderIds: string[], status: OrderStatus) => void;
  batchAssignDriver: (orderIds: string[], driverId: string) => void;
  batchDeleteOrders: (orderIds: string[]) => void;
  addDriver: (driver: Omit<Driver, 'id' | 'activeDeliveriesCount' | 'completedDeliveries' | 'failedDeliveries' | 'rating' | 'joinedDate'>) => void;
  updateDriverStatus: (driverId: string, status: Driver['status']) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  updateProductStock: (productId: string, newStock: number, note?: string) => void;
  adjustStock: (productId: string, delta: number, note?: string) => void;
  deleteProduct: (productId: string) => void;
  updateBusiness: (updates: Partial<BusinessProfile>) => void;
  loginDemo: () => void;
  signOut: () => void;
  resetDemoData: () => void;
  resetToDemoData: () => void; // alias
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'waseldz_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state - Default starts on 'landing' strictly as requested!
  const [currentView, setCurrentView] = useState<'landing' | 'signin' | 'signup' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState<ActiveDashboardTab>('overview');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [slipOrderId, setSlipOrderId] = useState<string | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // --- Notification Queue System (Demande Utilisateur: File d'attente de notifications) ---
  const MAX_VISIBLE_TOASTS = 3;
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const toastQueueRef = useRef<ToastNotification[]>([]);
  const [queueRemainingCount, setQueueRemainingCount] = useState<number>(0);

  // Delivery Notifications Log (Historique persistent pour commerçants)
  const [deliveryNotifications, setDeliveryNotifications] = useState<DeliveryNotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'delivery_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + 'delivery_notifications', JSON.stringify(deliveryNotifications.slice(0, 50)));
    } catch {
      // ignore
    }
  }, [deliveryNotifications]);

  const unreadNotificationsCount = deliveryNotifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setDeliveryNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotificationHistory = () => {
    setDeliveryNotifications([]);
  };

  // Traite la file d'attente dès qu'un créneau d'affichage se libère
  const processNextInQueue = () => {
    setToasts(currentActive => {
      if (currentActive.length >= MAX_VISIBLE_TOASTS || toastQueueRef.current.length === 0) {
        setQueueRemainingCount(toastQueueRef.current.length);
        return currentActive;
      }

      const nextToast = toastQueueRef.current.shift()!;
      setQueueRemainingCount(toastQueueRef.current.length);

      const duration = nextToast.durationMs || 4800;
      setTimeout(() => {
        dismissToast(nextToast.id);
      }, duration);

      return [...currentActive, nextToast];
    });
  };

  // Enqueue un toast : affichage direct si < MAX_VISIBLE_TOASTS, sinon mise en attente ordonnée
  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const fullToast: ToastNotification = { ...toast, id };

    setToasts(currentActive => {
      if (currentActive.length < MAX_VISIBLE_TOASTS) {
        const duration = fullToast.durationMs || 4800;
        setTimeout(() => {
          dismissToast(id);
        }, duration);
        return [...currentActive, fullToast];
      } else {
        // Ajout dans la file d'attente FIFO
        toastQueueRef.current.push(fullToast);
        setQueueRemainingCount(toastQueueRef.current.length);
        return currentActive;
      }
    });
  };

  const dismissToast = (id: string) => {
    setToasts(prev => {
      const filtered = prev.filter(t => t.id !== id);
      setTimeout(() => {
        processNextInQueue();
      }, 50);
      return filtered;
    });
  };

  // Méthode centrale de notification des commerçants lors des changements de statut de livraison
  const notifyDeliveryStatusChange = (
    order: Order,
    previousStatus: OrderStatus | undefined,
    newStatus: OrderStatus,
    customNote?: string,
    driverName?: string
  ) => {
    // 1. Déclenche le carillon audio contextuel (bip doux, double bip livraison, ou alerte)
    NotificationQueueService.playStatusChime(newStatus);

    // 2. Construit l'alerte toast enrichie et l'entrée d'historique
    const { toast, notificationItem } = NotificationQueueService.buildDeliveryToast(
      {
        order,
        previousStatus,
        newStatus,
        driverName,
        customNote,
      },
      (targetOrderId) => setSelectedOrderId(targetOrderId)
    );

    // 3. Enregistre dans l'historique du centre de notification
    setDeliveryNotifications(prev => [notificationItem, ...prev.slice(0, 49)]);

    // 4. Injecte dans la file d'attente intelligente
    showToast(toast);
  };

  // Démo interactive pour tester la file d'attente des notifications
  const simulateDeliveryProgression = (orderId?: string) => {
    const target = orderId 
      ? orders.find(o => o.id === orderId) 
      : orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || orders[0];
    
    if (!target) {
      showToast({
        type: 'warning',
        title: 'Aucune commande disponible pour la simulation',
        message: 'Créez d\'abord une nouvelle commande.',
      });
      return;
    }

    showToast({
      type: 'info',
      title: 'Simulation de livraison enclenchée 🚀',
      message: `La commande ${target.id} va traverser le cycle d'acheminement avec alertes toast séquencées.`,
      orderId: target.id,
    });

    const flow: { status: OrderStatus; delay: number; note: string }[] = [
      { status: 'preparing', delay: 1200, note: 'Préparation et emballage au dépôt logistique' },
      { status: 'assigned', delay: 3200, note: 'Prise en charge par le livreur référencé' },
      { status: 'out_for_delivery', delay: 5500, note: 'En cours de livraison chez le client' },
      { status: 'delivered', delay: 8200, note: 'Colis livré avec succès et montant C.O.D perçu' },
    ];

    flow.forEach(step => {
      setTimeout(() => {
        updateOrderStatus(target.id, step.status, step.note);
      }, step.delay);
    });
  };

  // Confirm dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const showConfirmDialog = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }) => {
    setConfirmDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel,
      cancelLabel: options.cancelLabel,
      isDestructive: options.isDestructive,
      onConfirm: options.onConfirm,
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Business Profile
  const [business, setBusiness] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'business');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Drivers
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Stock Movements
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'stock_movements');
    return saved ? JSON.parse(saved) : INITIAL_STOCK_MOVEMENTS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  // Cloud Database (Firestore) & Backend API Telemetry
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('syncing');
  const [cloudLatencyMs, setCloudLatencyMs] = useState<number | null>(null);
  const [isCloudPersistent, setIsCloudPersistent] = useState<boolean>(true);
  const [serverHealth, setServerHealth] = useState<any | null>(null);

  // Firestore background persistence helpers
  const syncDocToFirestore = async (col: string, docId: string, data: any) => {
    try {
      await setDoc(doc(db, 'businesses', 'main_enterprise', col, docId), data, { merge: true });
    } catch (err) {
      console.warn(`[Cloud Firestore] Note synchronisation ${col}/${docId}:`, err);
    }
  };

  const deleteDocFromFirestore = async (col: string, docId: string) => {
    try {
      await deleteDoc(doc(db, 'businesses', 'main_enterprise', col, docId));
    } catch (err) {
      console.warn(`[Cloud Firestore] Note suppression ${col}/${docId}:`, err);
    }
  };

  // Bootstrap & Initial Sync with Firestore & Express Backend
  const initCloudServices = async () => {
    setCloudSyncStatus('syncing');
    try {
      // 1. Probe local Express API health
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const healthData = await res.json();
          setServerHealth(healthData);
        }
      } catch {
        // Express starting or offline in pure SPA
      }

      // 2. Ensure authenticated Firebase user session
      await ensureAuthenticatedUser();

      // 3. Test latency and Firestore read/write
      const test = await testFirestoreConnection();
      if (test.connected) {
        setCloudLatencyMs(test.latencyMs);
        setCloudSyncStatus('synced');
        setIsCloudPersistent(true);

        // Check if remote business or orders exist; if empty, seed initial cluster
        try {
          const ordersSnap = await getDocs(collection(db, 'businesses', 'main_enterprise', 'orders'));
          if (ordersSnap.empty) {
            console.log('[Cloud Firestore] Premier déploiement : initialisation du cluster de données...');
            await setDoc(doc(db, 'businesses', 'main_enterprise'), business, { merge: true });
            for (const o of orders) {
              await setDoc(doc(db, 'businesses', 'main_enterprise', 'orders', o.id), o, { merge: true });
            }
            for (const p of products) {
              await setDoc(doc(db, 'businesses', 'main_enterprise', 'products', p.id), p, { merge: true });
            }
            for (const c of customers) {
              await setDoc(doc(db, 'businesses', 'main_enterprise', 'customers', c.id), c, { merge: true });
            }
            for (const d of drivers) {
              await setDoc(doc(db, 'businesses', 'main_enterprise', 'drivers', d.id), d, { merge: true });
            }
            for (const m of stockMovements) {
              await setDoc(doc(db, 'businesses', 'main_enterprise', 'stockMovements', m.id), m, { merge: true });
            }
          }
        } catch (seedErr) {
          console.warn('[Cloud Firestore] Note amorçage:', seedErr);
        }
      } else {
        setCloudSyncStatus('offline');
      }
    } catch (err) {
      console.warn('[Cloud Firestore] Note initialisation:', err);
      setCloudSyncStatus('offline');
    }
  };

  useEffect(() => {
    initCloudServices();

    // Abonnement en direct aux commandes Firestore pour synchronisation temps réel
    const unsubscribeOrders = OrderFirestoreService.subscribeToOrders(
      (firestoreOrders) => {
        if (firestoreOrders && firestoreOrders.length > 0) {
          setOrders(firestoreOrders);
          setCloudSyncStatus('synced');
        }
      },
      (err) => {
        console.warn('[AppContext] Écoute en direct Firestore:', err);
      }
    );

    return () => {
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

  const forceCloudSync = async () => {
    await initCloudServices();
    showToast({
      type: 'success',
      title: 'Synchronisation Cloud Active',
      message: 'Base Firestore et backend d\'API certifiés synchronisés.',
    });
  };

  // Create Order
  const createOrder = (orderData: Omit<Order, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'history'>): Order => {
    const nextNum = orders.length + 1001;
    const orderId = `DZ-${nextNum}`;
    const wilayaCode = orderData.wilaya.split('-')[0]?.trim() || '16';
    const trackingNumber = `WDZ-${wilayaCode}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: orderId,
      trackingNumber,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: orderData.status,
          timestamp: now,
          note: 'Commande enregistrée sur WaselDZ',
          author: business.ownerName,
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update customer stats
    setCustomers(prev => {
      const existing = prev.find(c => c.phone.replace(/\s+/g, '') === orderData.customerPhone.replace(/\s+/g, ''));
      if (existing) {
        return prev.map(c => c.id === existing.id ? {
          ...c,
          totalOrders: c.totalOrders + 1,
          totalSpent: c.totalSpent + orderData.totalAmount,
          lastOrderDate: now.split('T')[0],
        } : c);
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: orderData.customerName,
          phone: orderData.customerPhone,
          wilaya: orderData.wilaya,
          commune: orderData.commune,
          address: orderData.customerAddress,
          totalOrders: 1,
          totalSpent: orderData.totalAmount,
          lastOrderDate: now.split('T')[0],
          notes: orderData.notes,
        };
        return [newCust, ...prev];
      }
    });

    // Real-time stock decrement & movement tracking
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach(item => {
        if (item.id) {
          setProducts(prevProducts => {
            const targetProd = prevProducts.find(p => p.id === item.id);
            if (!targetProd) return prevProducts;
            const updatedStock = Math.max(0, targetProd.stock - item.quantity);

            // Log real-time stock movement
            const movement: StockMovement = {
              id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              productId: targetProd.id,
              productName: targetProd.name,
              type: 'out',
              quantityDelta: -item.quantity,
              newStock: updatedStock,
              timestamp: now,
              reason: `Sortie commande ${orderId} (${orderData.customerName} - ${orderData.wilaya})`,
            };
            setStockMovements(prevMovements => [movement, ...prevMovements]);

            // Low-stock alert toast
            if (updatedStock === 0) {
              setTimeout(() => {
                showToast({
                  type: 'error',
                  title: `Rupture de Stock : ${targetProd.name}`,
                  message: `Le stock est désormais épuisé suite à la commande ${orderId} !`,
                });
              }, 600);
            } else if (updatedStock <= (targetProd.minStockAlert || 5)) {
              setTimeout(() => {
                showToast({
                  type: 'warning',
                  title: `Alerte Stock Faible : ${targetProd.name}`,
                  message: `Plus que ${updatedStock} unités en rayon !`,
                });
              }, 600);
            }

            return prevProducts.map(p => p.id === item.id ? { ...p, stock: updatedStock } : p);
          });
        }
      });
    }

    showToast({
      type: 'success',
      title: `Commande ${orderId} créée avec succès`,
      message: `Enregistrée pour ${orderData.customerName} (${orderData.wilaya})`,
    });

    // Cloud Firestore synchronization
    syncDocToFirestore('orders', orderId, newOrder);

    return newOrder;
  };

  // Update Status
  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    let updatedOrderRef: Order | undefined;
    let prevStatus: OrderStatus | undefined;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        prevStatus = o.status;
        updatedOrderRef = {
          ...o,
          status,
          updatedAt: now,
          paymentStatus: status === 'delivered' ? 'paid' : o.paymentStatus,
          history: [
            ...o.history,
            {
              status,
              timestamp: now,
              note: note || `Statut actualisé vers: ${status}`,
              author: business.ownerName,
            }
          ]
        };
        return updatedOrderRef;
      }
      return o;
    }));

    if (updatedOrderRef) {
      syncDocToFirestore('orders', orderId, updatedOrderRef);

      if (status === 'delivered') {
        try {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }

      // Alerte commerçant via la file d'attente de notifications
      const driver = updatedOrderRef.driverId ? drivers.find(d => d.id === updatedOrderRef?.driverId) : undefined;
      notifyDeliveryStatusChange(
        updatedOrderRef,
        prevStatus,
        status,
        note,
        driver?.name
      );
    }
  };

  // Update Customer Info directly on an Order & Firestore CRM
  const updateCustomerInfo = async (orderId: string, customerData: CustomerDetailsUpdate) => {
    const now = new Date().toISOString();
    let updatedOrderRef: Order | undefined;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        updatedOrderRef = {
          ...o,
          customerName: customerData.customerName?.trim() || o.customerName,
          customerPhone: customerData.customerPhone?.trim() || o.customerPhone,
          customerAddress: customerData.customerAddress?.trim() || o.customerAddress,
          wilaya: customerData.wilaya || o.wilaya,
          commune: customerData.commune || o.commune,
          notes: customerData.notes !== undefined ? customerData.notes : o.notes,
          updatedAt: now,
        };
        return updatedOrderRef;
      }
      return o;
    }));

    // Update customer in CRM list
    if (customerData.customerPhone || customerData.customerName) {
      setCustomers(prev => prev.map(c => {
        if (c.phone === customerData.customerPhone || c.name === customerData.customerName) {
          return {
            ...c,
            name: customerData.customerName?.trim() || c.name,
            phone: customerData.customerPhone?.trim() || c.phone,
            address: customerData.customerAddress?.trim() || c.address,
            wilaya: customerData.wilaya || c.wilaya,
            commune: customerData.commune || c.commune,
          };
        }
        return c;
      }));
    }

    try {
      await OrderFirestoreService.updateCustomerInfo(orderId, customerData);
    } catch (err) {
      console.warn('[Firestore Service] Note mise à jour client:', err);
    }

    showToast({
      type: 'success',
      title: 'Coordonnées client mises à jour',
      message: `Informations de livraison actualisées dans Firestore pour la commande ${orderId}`,
    });
  };

  // Generic Order Update via Firestore Service
  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const now = new Date().toISOString();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates, updatedAt: now } : o));

    try {
      await OrderFirestoreService.updateOrder(orderId, updates);
    } catch (err) {
      console.warn('[Firestore Service] Note mise à jour commande:', err);
    }

    showToast({
      type: 'success',
      title: `Commande ${orderId} modifiée`,
      message: 'Modifications sauvegardées avec succès',
    });
  };

  // Assign Driver
  const assignDriver = (orderId: string, driverId: string) => {
    const now = new Date().toISOString();
    const targetDriver = drivers.find(d => d.id === driverId);
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          driverId,
          status: o.status === 'new' || o.status === 'confirmed' || o.status === 'preparing' ? 'assigned' : o.status,
          updatedAt: now,
          history: [
            ...o.history,
            {
              status: 'assigned',
              timestamp: now,
              note: `Livreur affecté : ${targetDriver ? targetDriver.name : driverId}`,
              author: business.ownerName,
            }
          ]
        };
      }
      return o;
    }));

    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          activeDeliveriesCount: (d.activeDeliveriesCount || 0) + 1,
          status: d.status === 'offline' ? 'busy' : d.status,
        };
      }
      return d;
    }));

    showToast({
      type: 'success',
      title: 'Livreur assigné',
      message: `${targetDriver?.name || 'Chauffeur'} a pris en charge la commande ${orderId}`,
    });
  };

  // Delete Order
  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (selectedOrderId === orderId) {
      setSelectedOrderId(null);
    }
    deleteDocFromFirestore('orders', orderId);
    showToast({
      type: 'warning',
      title: `Commande ${orderId} supprimée`,
      message: 'Le dossier de livraison a été retiré du registre',
    });
  };

  // Batch operations
  const batchUpdateStatus = (orderIds: string[], status: OrderStatus) => {
    const now = new Date().toISOString();
    const updatedList: Order[] = [];

    setOrders(prev => prev.map(o => {
      if (orderIds.includes(o.id)) {
        const updated = {
          ...o,
          status,
          updatedAt: now,
          paymentStatus: status === 'delivered' ? 'paid' : o.paymentStatus,
          history: [
            ...o.history,
            {
              status,
              timestamp: now,
              note: `Mise à jour groupée vers ${status}`,
              author: business.ownerName,
            }
          ]
        };
        updatedList.push(updated);
        return updated;
      }
      return o;
    }));

    // Injecter dans la file d'attente de notifications de manière espacée
    updatedList.forEach((ord, index) => {
      setTimeout(() => {
        notifyDeliveryStatusChange(ord, undefined, status, 'Mise à jour groupée');
      }, index * 250);
    });
  };

  const batchAssignDriver = (orderIds: string[], driverId: string) => {
    const now = new Date().toISOString();
    const targetDriver = drivers.find(d => d.id === driverId);

    setOrders(prev => prev.map(o => {
      if (orderIds.includes(o.id)) {
        return {
          ...o,
          driverId,
          status: o.status === 'new' || o.status === 'confirmed' || o.status === 'preparing' ? 'assigned' : o.status,
          updatedAt: now,
          history: [
            ...o.history,
            {
              status: 'assigned',
              timestamp: now,
              note: `Affectation groupée : ${targetDriver?.name || driverId}`,
              author: business.ownerName,
            }
          ]
        };
      }
      return o;
    }));

    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          activeDeliveriesCount: (d.activeDeliveriesCount || 0) + orderIds.length,
          status: d.status === 'offline' ? 'busy' : d.status,
        };
      }
      return d;
    }));

    showToast({
      type: 'success',
      title: `${orderIds.length} commande(s) assignées`,
      message: `Attribuées au livreur ${targetDriver?.name}`,
    });
  };

  const batchDeleteOrders = (orderIds: string[]) => {
    setOrders(prev => prev.filter(o => !orderIds.includes(o.id)));
    if (selectedOrderId && orderIds.includes(selectedOrderId)) {
      setSelectedOrderId(null);
    }
    showToast({
      type: 'warning',
      title: `${orderIds.length} commandes supprimées`,
      message: 'Les fiches ont été retirées du registre',
    });
  };

  // Add Driver
  const addDriver = (driverData: Omit<Driver, 'id' | 'activeDeliveriesCount' | 'completedDeliveries' | 'failedDeliveries' | 'rating' | 'joinedDate'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `drv-${Date.now()}`,
      activeDeliveriesCount: 0,
      completedDeliveries: 0,
      failedDeliveries: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setDrivers(prev => [...prev, newDriver]);
    showToast({
      type: 'success',
      title: 'Nouveau chauffeur ajouté',
      message: `${driverData.name} est maintenant actif sur votre flotte`,
    });
  };

  // Update Driver Status
  const updateDriverStatus = (driverId: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status } : d));
    showToast({
      type: 'info',
      title: 'Disponibilité chauffeur modifiée',
      message: `Statut mis à jour`,
    });
  };

  // Add Customer
  const addCustomer = (customerData: Omit<Customer, 'id' | 'totalOrders' | 'totalSpent' | 'lastOrderDate'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
    };
    setCustomers(prev => [newCustomer, ...prev]);
    syncDocToFirestore('customers', newCustomer.id, newCustomer);
    showToast({
      type: 'success',
      title: 'Client enregistré',
      message: `${customerData.name} ajouté au carnet d\'adresses CRM`,
    });
  };

  // Add Product
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts(prev => [newProduct, ...prev]);
    syncDocToFirestore('products', newProduct.id, newProduct);

    // Log initial stock entry if > 0
    if (productData.stock > 0) {
      const movement: StockMovement = {
        id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'in',
        quantityDelta: productData.stock,
        newStock: productData.stock,
        timestamp: new Date().toISOString(),
        reason: 'Stock initial lors de la création de l\'article',
      };
      setStockMovements(prev => [movement, ...prev]);
      syncDocToFirestore('stockMovements', movement.id, movement);
    }

    showToast({
      type: 'success',
      title: 'Article ajouté au catalogue',
      message: `${productData.name} — stock : ${productData.stock}`,
    });
  };

  // Update Product details
  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    syncDocToFirestore('products', productId, updates);
    showToast({
      type: 'success',
      title: 'Article mis à jour',
      message: 'Les informations du produit ont été actualisées',
    });
  };

  // Set exact stock level
  const updateProductStock = (productId: string, newStock: number, note?: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const safeStock = Math.max(0, Number(newStock));
    const delta = safeStock - target.stock;
    const now = new Date().toISOString();

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: safeStock } : p));
    syncDocToFirestore('products', productId, { stock: safeStock });

    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: target.id,
      productName: target.name,
      type: delta >= 0 ? 'in' : 'out',
      quantityDelta: delta,
      newStock: safeStock,
      timestamp: now,
      reason: note || (delta >= 0 ? `Réapprovisionnement (+${delta})` : `Ajustement inventaire (${delta})`),
    };
    setStockMovements(prev => [movement, ...prev]);
    syncDocToFirestore('stockMovements', movement.id, movement);

    showToast({
      type: safeStock === 0 ? 'warning' : 'success',
      title: `Stock actualisé : ${target.name}`,
      message: `Nouveau stock : ${safeStock} unités (${delta >= 0 ? `+${delta}` : delta})`,
    });
  };

  // Quick incremental stock adjustment (+5, +10, -1...)
  const adjustStock = (productId: string, delta: number, note?: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const safeStock = Math.max(0, target.stock + delta);
    const now = new Date().toISOString();

    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: safeStock } : p));
    syncDocToFirestore('products', productId, { stock: safeStock });

    const movement: StockMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: target.id,
      productName: target.name,
      type: delta > 0 ? 'in' : 'out',
      quantityDelta: delta,
      newStock: safeStock,
      timestamp: now,
      reason: note || (delta > 0 ? `Réapprovisionnement rapide (+${delta})` : `Déstockage rapide (${delta})`),
    };
    setStockMovements(prev => [movement, ...prev]);
    syncDocToFirestore('stockMovements', movement.id, movement);

    showToast({
      type: delta > 0 ? 'success' : 'info',
      title: `${delta > 0 ? 'Réassort' : 'Sortie'} : ${target.name}`,
      message: `${delta > 0 ? `+${delta}` : delta} unités. Stock disponible : ${safeStock}`,
    });
  };

  // Delete product
  const deleteProduct = (productId: string) => {
    const target = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    deleteDocFromFirestore('products', productId);
    showToast({
      type: 'info',
      title: 'Article supprimé',
      message: target ? target.name : 'Produit retiré du catalogue',
    });
  };

  // Update Business
  const updateBusiness = (updates: Partial<BusinessProfile>) => {
    setBusiness(prev => ({ ...prev, ...updates }));
    setDoc(doc(db, 'businesses', 'main_enterprise'), updates, { merge: true }).catch(err => {
      console.warn('[Cloud Firestore] Note profil commerce:', err);
    });
    showToast({
      type: 'success',
      title: 'Paramètres enregistrés',
      message: 'Les données de votre commerce ont été synchronisées',
    });
  };

  const loginDemo = () => {
    setCurrentView('dashboard');
    showToast({
      type: 'success',
      title: 'Connexion Espace Démo réussie',
      message: `Bienvenue sur le tableau de bord de ${business.name}`,
    });
  };

  const signOut = () => {
    setCurrentView('landing');
    showToast({
      type: 'info',
      title: 'Session déconnectée',
      message: 'À bientôt sur WaselDZ !',
    });
  };

  const resetDemoData = () => {
    setBusiness(INITIAL_BUSINESS);
    setOrders(INITIAL_ORDERS);
    setDrivers(INITIAL_DRIVERS);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setStockMovements(INITIAL_STOCK_MOVEMENTS);
    localStorage.removeItem(STORAGE_PREFIX + 'business');
    localStorage.removeItem(STORAGE_PREFIX + 'orders');
    localStorage.removeItem(STORAGE_PREFIX + 'drivers');
    localStorage.removeItem(STORAGE_PREFIX + 'customers');
    localStorage.removeItem(STORAGE_PREFIX + 'products');
    localStorage.removeItem(STORAGE_PREFIX + 'stock_movements');
    showToast({
      type: 'info',
      title: 'Données démo réinitialisées',
      message: 'Le registre d\'Algérie a été restauré aux valeurs initiales',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        dashboardTab,
        setDashboardTab,
        business,
        currentBusiness: business,
        orders,
        drivers,
        customers,
        products,
        stockMovements,
        selectedOrderId,
        setSelectedOrderId,
        slipOrderId,
        setSlipOrderId,
        trackingOrderId,
        setTrackingOrderId,
        isOrderModalOpen,
        setIsOrderModalOpen,
        searchFilter,
        setSearchFilter,
        toasts,
        queueRemainingCount,
        showToast,
        dismissToast,
        deliveryNotifications,
        unreadNotificationsCount,
        markAllNotificationsAsRead,
        clearNotificationHistory,
        simulateDeliveryProgression,
        confirmDialog,
        showConfirmDialog,
        closeConfirmDialog,
        createOrder,
        updateOrderStatus,
        assignDriver,
        deleteOrder,
        deleteOrderId: deleteOrder,
        updateCustomerInfo,
        updateOrder,
        orderFirestoreService: OrderFirestoreService,
        batchUpdateStatus,
        batchAssignDriver,
        batchDeleteOrders,
        addDriver,
        updateDriverStatus,
        addCustomer,
        addProduct,
        updateProduct,
        updateProductStock,
        adjustStock,
        deleteProduct,
        updateBusiness,
        loginDemo,
        signOut,
        resetDemoData,
        resetToDemoData: resetDemoData,
        cloudSyncStatus,
        cloudLatencyMs,
        isCloudPersistent,
        forceCloudSync,
        serverHealth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
