export type OrderStatus =
  | 'new'
  | 'confirmed'
  | 'preparing'
  | 'assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'failed'
  | 'returned';

export type PaymentMethod = 'cod' | 'baridimob' | 'cib' | 'prepaid';

export type DriverStatus = 'available' | 'busy' | 'offline';

export type BusinessCategory =
  | 'clothing'
  | 'restaurant'
  | 'ecommerce'
  | 'electronics'
  | 'grocery'
  | 'other';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  author?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  wilaya: string;
  commune: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  driverId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryDate?: string;
  history: StatusHistoryEntry[];
}

export type VehicleType = 'moto' | 'voiture' | 'fourgon' | 'velo' | 'motorcycle' | 'car' | 'van' | 'bicycle';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  wilaya?: string;
  licensePlate?: string;
  status: DriverStatus;
  activeDeliveriesCount?: number;
  completedDeliveries?: number;
  failedDeliveries?: number;
  rating?: number;
  joinedDate?: string;
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  notes?: string;
  isVip?: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStockAlert?: number;
  category: string;
  imageUrl?: string;
  warehouseLocation?: string;
  active: boolean;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantityDelta: number;
  newStock: number;
  timestamp: string;
  reason: string;
}

export interface BusinessProfile {
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  businessType: BusinessCategory;
  currency: string;
  defaultDeliveryFee: number;
  logoUrl?: string;
  registeredAt: string;
}

export type ActiveDashboardTab =
  | 'overview'
  | 'orders'
  | 'deliveries'
  | 'customers'
  | 'drivers'
  | 'products'
  | 'analytics'
  | 'settings'
  | 'security';

export type DashboardTab = ActiveDashboardTab;

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  orderId?: string;
  status?: OrderStatus;
  timestamp?: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export interface DeliveryNotificationItem {
  id: string;
  orderId: string;
  customerName: string;
  wilaya: string;
  commune?: string;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  driverName?: string;
  totalAmount?: number;
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}
