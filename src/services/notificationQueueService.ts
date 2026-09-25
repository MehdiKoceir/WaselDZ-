import { Order, OrderStatus, ToastNotification, DeliveryNotificationItem } from '../types';
import { STATUS_LABELS, formatDZD } from '../data/algeriaData';

export interface EnqueueDeliveryStatusOptions {
  order: Order;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  driverName?: string;
  customNote?: string;
  author?: string;
}

/**
 * Service gérant la file d'attente intelligente des notifications (Queue)
 * pour alerter les commerçants en temps réel par alertes toast lors des
 * changements de statut de livraison de leurs colis en Algérie.
 */
export class NotificationQueueService {
  private static audioCtx: AudioContext | null = null;

  /**
   * Génère un bip sonore subtil via l'API Web Audio native du navigateur
   * (aucun fichier MP3/WAV externe requis).
   */
  public static playStatusChime(status: OrderStatus) {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx || this.audioCtx.state === 'suspended') {
        this.audioCtx = new AudioCtx();
      }

      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (status === 'delivered') {
        // Double bip aigu festif pour livraison réussie & encaissement
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.0, now + 0.08); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (status === 'failed' || status === 'returned' || status === 'cancelled') {
        // Tonalité d'attention pour échec ou retour
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.setValueAtTime(220.0, now + 0.1); // A3
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        // Tonalité douce de progression logistique
        osc.frequency.setValueAtTime(523.25, now); // C5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch {
      // Audio autoplay policy ou environnement sans haut-parleurs
    }
  }

  /**
   * Formate une alerte toast contextuelle pour le commerçant selon le statut de livraison
   */
  public static buildDeliveryToast(
    options: EnqueueDeliveryStatusOptions,
    onViewOrder?: (orderId: string) => void
  ): { toast: Omit<ToastNotification, 'id'>; notificationItem: DeliveryNotificationItem } {
    const { order, previousStatus, newStatus, driverName, customNote } = options;
    const now = new Date().toISOString();
    const statusMeta = STATUS_LABELS[newStatus] || STATUS_LABELS['new'];
    const wilayaDisplay = order.wilaya.split('-')[1]?.trim() || order.wilaya;

    let toastType: ToastNotification['type'] = 'info';
    let title = `Commande ${order.id} : Statut actualisé`;
    let message = `Nouveau statut : ${statusMeta.label}`;

    switch (newStatus) {
      case 'confirmed':
        toastType = 'info';
        title = `Commande ${order.id} confirmée`;
        message = `Client : ${order.customerName} (${wilayaDisplay}). Prêt pour préparation.`;
        break;

      case 'preparing':
        toastType = 'info';
        title = `Préparation en cours : ${order.id}`;
        message = `Colis en cours d'emballage pour ${order.customerName} (${order.commune}).`;
        break;

      case 'assigned':
        toastType = 'info';
        title = `Livreur assigné : ${order.id}`;
        message = driverName 
          ? `Pris en charge par ${driverName} vers ${wilayaDisplay}.`
          : `Attribué au livreur. Destination : ${wilayaDisplay}.`;
        break;

      case 'out_for_delivery':
        toastType = 'warning';
        title = `En cours de livraison 🚚 : ${order.id}`;
        message = driverName
          ? `${driverName} est en route vers ${order.commune}, ${wilayaDisplay}.`
          : `Colis en tournée de distribution sur ${wilayaDisplay}.`;
        break;

      case 'delivered':
        toastType = 'success';
        title = `Livraison réussie 🎉 : ${order.id}`;
        message = order.paymentMethod === 'cod'
          ? `Remis à ${order.customerName}. Montant C.O.D : ${formatDZD(order.totalAmount)} encaissé.`
          : `Remis à ${order.customerName} (${wilayaDisplay}). Livraison validée.`;
        break;

      case 'failed':
        toastType = 'error';
        title = `Tentative infructueuse ⚠️ : ${order.id}`;
        message = customNote 
          ? `Motif : ${customNote} (Client : ${order.customerPhone})`
          : `Client injoignable ou absent à ${order.commune}. Reprogrammation nécessaire.`;
        break;

      case 'returned':
        toastType = 'warning';
        title = `Colis en retour magasin : ${order.id}`;
        message = `Retour expéditeur vers votre entrepôt depuis ${wilayaDisplay}.`;
        break;

      case 'cancelled':
        toastType = 'error';
        title = `Commande annulée : ${order.id}`;
        message = customNote || `La commande a été marquée comme annulée.`;
        break;

      default:
        toastType = 'info';
        title = `Commande ${order.id} : ${statusMeta.label}`;
        message = `Destinataire : ${order.customerName} (${wilayaDisplay})`;
        break;
    }

    const toast: Omit<ToastNotification, 'id'> = {
      type: toastType,
      title,
      message,
      orderId: order.id,
      status: newStatus,
      timestamp: now,
      actionLabel: 'Voir détails',
      onAction: onViewOrder ? () => onViewOrder(order.id) : undefined,
      durationMs: newStatus === 'delivered' ? 6500 : 5000,
    };

    const notificationItem: DeliveryNotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId: order.id,
      customerName: order.customerName,
      wilaya: order.wilaya,
      commune: order.commune,
      previousStatus,
      newStatus,
      driverName,
      totalAmount: order.totalAmount,
      timestamp: now,
      message,
      type: toastType,
      read: false,
    };

    return { toast, notificationItem };
  }
}
