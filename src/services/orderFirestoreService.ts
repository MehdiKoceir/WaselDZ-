import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus, StatusHistoryEntry, Customer } from '../types';

export const DEFAULT_BUSINESS_ID = 'main_enterprise';

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  wilaya: string;
  commune: string;
  items: Order['items'];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: Order['paymentMethod'];
  paymentStatus?: 'pending' | 'paid';
  status?: OrderStatus;
  driverId?: string;
  notes?: string;
  estimatedDeliveryDate?: string;
  id?: string;
  trackingNumber?: string;
}

export interface UpdateOrderInput extends Partial<Omit<Order, 'id' | 'createdAt'>> {
  statusNote?: string;
  statusAuthor?: string;
}

export interface CustomerDetailsUpdate {
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  wilaya?: string;
  commune?: string;
  notes?: string;
}

export interface OrderFilterOptions {
  status?: OrderStatus;
  wilaya?: string;
  customerPhone?: string;
  driverId?: string;
  limitCount?: number;
}

/**
 * Service Firestore dédié à la gestion complète du CRUD des commandes (Orders),
 * incluant les statuts de livraison en temps réel et la synchronisation CRM client.
 */
export class OrderFirestoreService {
  /**
   * Helper pour obtenir la référence de la collection des commandes d'une entreprise
   */
  private static getOrdersCollectionRef(businessId: string = DEFAULT_BUSINESS_ID) {
    return collection(db, 'businesses', businessId, 'orders');
  }

  /**
   * Helper pour obtenir la référence du document d'une commande
   */
  private static getOrderDocRef(orderId: string, businessId: string = DEFAULT_BUSINESS_ID) {
    return doc(db, 'businesses', businessId, 'orders', orderId);
  }

  /**
   * Helper pour obtenir la référence du document d'un client
   */
  private static getCustomerDocRef(customerId: string, businessId: string = DEFAULT_BUSINESS_ID) {
    return doc(db, 'businesses', businessId, 'customers', customerId);
  }

  /**
   * CREATE: Enregistre une nouvelle commande dans Firestore et synchronise automatiquement
   * les données du client (carnet d'adresses, total commandes, dépenses cumulées).
   */
  public static async createOrder(
    input: CreateOrderInput, 
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Order> {
    const now = new Date().toISOString();
    const orderId = input.id || `DZ-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = input.trackingNumber || `WZ-${Math.floor(100000 + Math.random() * 900000)}`;
    const initialStatus = input.status || 'new';

    const initialHistoryEntry: StatusHistoryEntry = {
      status: initialStatus,
      timestamp: now,
      note: 'Création de la commande et bordereau d\'expédition',
      author: 'Système / Commerçant',
    };

    const newOrder: Order = {
      id: orderId,
      trackingNumber,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerAddress: input.customerAddress.trim(),
      wilaya: input.wilaya,
      commune: input.commune,
      items: input.items || [],
      subtotal: Number(input.subtotal),
      deliveryFee: Number(input.deliveryFee || 0),
      totalAmount: Number(input.totalAmount),
      paymentMethod: input.paymentMethod || 'cod',
      paymentStatus: input.paymentStatus || 'pending',
      status: initialStatus,
      driverId: input.driverId,
      notes: input.notes,
      estimatedDeliveryDate: input.estimatedDeliveryDate,
      createdAt: now,
      updatedAt: now,
      history: [initialHistoryEntry],
    };

    // 1. Sauvegarde de la commande dans Firestore
    const orderDocRef = this.getOrderDocRef(orderId, businessId);
    await setDoc(orderDocRef, newOrder, { merge: true });

    // 2. Synchronisation automatique des informations du client (CRM Firestore)
    await this.syncCustomerFromOrder(newOrder, businessId);

    return newOrder;
  }

  /**
   * READ: Récupère une commande par son identifiant unique
   */
  public static async getOrderById(
    orderId: string, 
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Order | null> {
    const orderDocRef = this.getOrderDocRef(orderId, businessId);
    const snap = await getDoc(orderDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as Order;
  }

  /**
   * READ: Récupère toutes les commandes avec filtres optionnels
   */
  public static async getOrders(
    filters?: OrderFilterOptions, 
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Order[]> {
    const collectionRef = this.getOrdersCollectionRef(businessId);
    let q = query(collectionRef);

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.wilaya) {
      q = query(q, where('wilaya', '==', filters.wilaya));
    }
    if (filters?.customerPhone) {
      q = query(q, where('customerPhone', '==', filters.customerPhone));
    }
    if (filters?.driverId) {
      q = query(q, where('driverId', '==', filters.driverId));
    }
    if (filters?.limitCount) {
      q = query(q, limit(filters.limitCount));
    }

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach(docSnap => {
      orders.push(docSnap.data() as Order);
    });

    // Tri par date décroissante (plus récent d'abord)
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * REAL-TIME SUBSCRIPTION: Écoute en direct les commandes de l'entreprise
   */
  public static subscribeToOrders(
    onOrdersUpdated: (orders: Order[]) => void,
    onError?: (err: Error) => void,
    businessId: string = DEFAULT_BUSINESS_ID
  ): Unsubscribe {
    const collectionRef = this.getOrdersCollectionRef(businessId);
    
    return onSnapshot(
      collectionRef,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as Order);
        });
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onOrdersUpdated(orders);
      },
      (error) => {
        console.error('[OrderFirestoreService] Erreur d\'écoute en direct Firestore:', error);
        if (onError) onError(error);
      }
    );
  }

  /**
   * UPDATE STATUS: Met à jour le statut de livraison d'une commande
   * et consigne la trace d'audit dans l'historique de statut.
   */
  public static async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    author: string = 'Opérateur WaselDZ',
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Order> {
    const orderDocRef = this.getOrderDocRef(orderId, businessId);
    const existingSnap = await getDoc(orderDocRef);

    if (!existingSnap.exists()) {
      throw new Error(`Commande introuvable dans Firestore: ${orderId}`);
    }

    const existingOrder = existingSnap.data() as Order;
    const now = new Date().toISOString();

    const historyEntry: StatusHistoryEntry = {
      status: newStatus,
      timestamp: now,
      note: note || `Changement de statut vers: ${newStatus}`,
      author,
    };

    const updatedHistory = [...(existingOrder.history || []), historyEntry];
    const paymentStatusUpdate = newStatus === 'delivered' && existingOrder.paymentMethod === 'cod'
      ? 'paid' 
      : existingOrder.paymentStatus;

    const updates: Partial<Order> = {
      status: newStatus,
      paymentStatus: paymentStatusUpdate,
      updatedAt: now,
      history: updatedHistory,
    };

    await updateDoc(orderDocRef, updates);

    const fullUpdatedOrder: Order = {
      ...existingOrder,
      ...updates,
    };

    // Si le statut passe à "delivered", mettre à jour le montant cumulé client si nécessaire
    if (newStatus === 'delivered') {
      await this.syncCustomerFromOrder(fullUpdatedOrder, businessId);
    }

    return fullUpdatedOrder;
  }

  /**
   * UPDATE CUSTOMER INFO: Met à jour les informations du client associées à la commande
   * et met à jour le profil client correspondant dans Firestore.
   */
  public static async updateCustomerInfo(
    orderId: string,
    customerData: CustomerDetailsUpdate,
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Order> {
    const orderDocRef = this.getOrderDocRef(orderId, businessId);
    const snap = await getDoc(orderDocRef);

    if (!snap.exists()) {
      throw new Error(`Commande introuvable: ${orderId}`);
    }

    const currentOrder = snap.data() as Order;
    const now = new Date().toISOString();

    const orderUpdates: Partial<Order> = {
      customerName: customerData.customerName?.trim() || currentOrder.customerName,
      customerPhone: customerData.customerPhone?.trim() || currentOrder.customerPhone,
      customerAddress: customerData.customerAddress?.trim() || currentOrder.customerAddress,
      wilaya: customerData.wilaya || currentOrder.wilaya,
      commune: customerData.commune || currentOrder.commune,
      notes: customerData.notes !== undefined ? customerData.notes : currentOrder.notes,
      updatedAt: now,
    };

    await updateDoc(orderDocRef, orderUpdates);

    const updatedOrder = {
      ...currentOrder,
      ...orderUpdates,
    };

    // Synchronisation vers le document client
    await this.syncCustomerFromOrder(updatedOrder, businessId);

    return updatedOrder;
  }

  /**
   * UPDATE: Mise à jour générique d'une commande (articles, prix, livreur, etc.)
   */
  public static async updateOrder(
    orderId: string,
    updates: UpdateOrderInput,
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Order> {
    const orderDocRef = this.getOrderDocRef(orderId, businessId);
    const snap = await getDoc(orderDocRef);

    if (!snap.exists()) {
      throw new Error(`Commande introuvable: ${orderId}`);
    }

    const currentOrder = snap.data() as Order;
    const now = new Date().toISOString();

    let updatedHistory = currentOrder.history || [];
    if (updates.status && updates.status !== currentOrder.status) {
      updatedHistory = [
        ...updatedHistory,
        {
          status: updates.status,
          timestamp: now,
          note: updates.statusNote || `Mise à jour: ${updates.status}`,
          author: updates.statusAuthor || 'Opérateur',
        }
      ];
    }

    const sanitizedUpdates: Partial<Order> = {
      ...updates,
      updatedAt: now,
      history: updatedHistory,
    };
    delete (sanitizedUpdates as any).statusNote;
    delete (sanitizedUpdates as any).statusAuthor;

    await updateDoc(orderDocRef, sanitizedUpdates);

    return {
      ...currentOrder,
      ...sanitizedUpdates,
    };
  }

  /**
   * DELETE: Supprime une commande de Firestore
   */
  public static async deleteOrder(
    orderId: string, 
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<boolean> {
    const orderDocRef = this.getOrderDocRef(orderId, businessId);
    await deleteDoc(orderDocRef);
    return true;
  }

  /**
   * SYNCHRONISATION CLIENT: Crée ou met à jour la fiche client correspondante
   * dans la collection CRM `/businesses/{businessId}/customers/{customerId}`.
   */
  public static async syncCustomerFromOrder(
    order: Order, 
    businessId: string = DEFAULT_BUSINESS_ID
  ): Promise<Customer> {
    const normalizedPhone = order.customerPhone.replace(/[\s\-\.]/g, '');
    const customerId = `cust-${normalizedPhone || order.customerName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const customerDocRef = this.getCustomerDocRef(customerId, businessId);

    const existingCustomerSnap = await getDoc(customerDocRef);
    const today = new Date().toISOString().split('T')[0];

    let customer: Customer;

    if (existingCustomerSnap.exists()) {
      const existingData = existingCustomerSnap.data() as Customer;
      customer = {
        ...existingData,
        name: order.customerName || existingData.name,
        phone: order.customerPhone || existingData.phone,
        wilaya: order.wilaya || existingData.wilaya,
        commune: order.commune || existingData.commune,
        address: order.customerAddress || existingData.address,
        lastOrderDate: today,
        totalOrders: (existingData.totalOrders || 0) + 1,
        totalSpent: (existingData.totalSpent || 0) + (order.totalAmount || 0),
      };
    } else {
      customer = {
        id: customerId,
        name: order.customerName,
        phone: order.customerPhone,
        wilaya: order.wilaya,
        commune: order.commune,
        address: order.customerAddress,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        lastOrderDate: today,
        notes: `Créé automatiquement via commande ${order.id}`,
      };
    }

    await setDoc(customerDocRef, customer, { merge: true });
    return customer;
  }
}
