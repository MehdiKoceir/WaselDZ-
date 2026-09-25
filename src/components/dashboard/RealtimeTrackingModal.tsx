import React, { useEffect, useState } from 'react';
import { 
  X, 
  Radio, 
  MapPin, 
  Navigation, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Share2, 
  Copy, 
  ExternalLink, 
  RotateCw, 
  ShieldCheck, 
  Printer, 
  AlertCircle,
  Package,
  Calendar,
  Zap,
  Bike,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, STATUS_LABELS } from '../../data/algeriaData';
import { Order, OrderStatus } from '../../types';

interface RealtimeTrackingModalProps {
  orderId: string | null;
  onClose: () => void;
}

export const RealtimeTrackingModal: React.FC<RealtimeTrackingModalProps> = ({ orderId, onClose }) => {
  const { orders, drivers, business, updateOrderStatus, setSlipOrderId, showToast } = useApp();

  const [isSimulating, setIsSimulating] = useState(false);
  const [telemetry, setTelemetry] = useState({
    distanceKm: 1.9,
    etaMinutes: 11,
    speedKmh: 42,
    lastPing: 3
  });

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && orderId) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [orderId, onClose]);

  if (!orderId) return null;

  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const driver = order.driverId ? drivers.find(d => d.id === order.driverId) : null;
  const statusConfig = STATUS_LABELS[order.status] || STATUS_LABELS['new'];

  const handleCopyLink = () => {
    const link = `https://waseldz.dz/suivi/${order.trackingNumber}`;
    navigator.clipboard.writeText(link);
    showToast({
      type: 'success',
      title: 'Lien de suivi copié !',
      message: `${link} prêt à être partagé.`,
    });
  };

  const handleShareWhatsApp = () => {
    const link = `https://waseldz.dz/suivi/${order.trackingNumber}`;
    const text = encodeURIComponent(
      `Salam ${order.customerName} ! Suivi en temps réel de votre commande WaselDZ n° ${order.trackingNumber} : ${link}\nMontant à payer : ${formatDZD(order.totalAmount)}.`
    );
    window.open(`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleAdvanceStep = () => {
    setIsSimulating(true);
    let nextStatus: OrderStatus = 'out_for_delivery';
    let nextNote = 'Statut mis à jour via le radar';

    if (order.status === 'new' || order.status === 'confirmed') {
      nextStatus = 'preparing';
      nextNote = 'Préparation terminée au dépôt';
    } else if (order.status === 'preparing') {
      nextStatus = 'assigned';
      nextNote = `Pris en charge par ${driver ? driver.name : 'le livreur'}`;
    } else if (order.status === 'assigned') {
      nextStatus = 'out_for_delivery';
      nextNote = 'Livreur en route vers le client';
    } else if (order.status === 'out_for_delivery') {
      nextStatus = 'delivered';
      nextNote = 'Colis livré et C.O.D encaissé';
    }

    setTimeout(() => {
      updateOrderStatus(order.id, nextStatus, nextNote);
      setIsSimulating(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 relative">
              <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">
                  Suivi Temps Réel • {order.trackingNumber}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Commande {order.id} • Destination : {order.wilaya}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Live Radar Screen */}
          <div className="relative h-48 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-between shadow-inner">
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none" 
              style={{ 
                backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
              }} 
            />

            <div className="relative z-10 flex items-center justify-between text-xs">
              <div className="bg-slate-800/90 text-slate-300 px-3 py-1 rounded-xl text-[11px] font-mono border border-slate-700">
                GPS : {order.commune}, Algérie
              </div>
              <div className="flex items-center gap-2 bg-slate-800/90 text-emerald-400 px-3 py-1 rounded-xl text-[11px] font-bold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Signal Actif</span>
              </div>
            </div>

            {/* Courier Position */}
            <div className="relative z-10 flex items-center justify-around my-auto">
              <div className="text-center">
                <div className="w-9 h-9 rounded-full bg-blue-600/40 border border-blue-500 flex items-center justify-center text-white mx-auto">
                  <Truck className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[11px] text-slate-300 font-bold mt-1 block">Dépôt WaselDZ</span>
              </div>

              <div className="text-center animate-bounce">
                <div className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] font-mono mx-auto mb-1">
                  {telemetry.speedKmh} km/h
                </div>
                <div className="w-10 h-10 rounded-full bg-cyan-600 border-2 border-white flex items-center justify-center text-white mx-auto shadow-lg">
                  {driver?.vehicleType === 'moto' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                </div>
                <span className="text-[11px] text-cyan-300 font-bold mt-1 block">
                  {driver ? driver.name : 'Livreur en route'}
                </span>
              </div>

              <div className="text-center">
                <div className="w-9 h-9 rounded-full bg-emerald-600/40 border border-emerald-500 flex items-center justify-center text-white mx-auto">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-300 font-bold mt-1 block">{order.customerName}</span>
              </div>
            </div>

            <div className="relative z-10 bg-slate-800/90 rounded-xl p-2 border border-slate-700 flex items-center justify-around text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Distance</span>
                <div className="font-bold text-white font-mono">{telemetry.distanceKm} km</div>
              </div>
              <div className="w-px h-5 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400">Arrivée estimée</span>
                <div className="font-bold text-cyan-400 font-mono">~ {telemetry.etaMinutes} min</div>
              </div>
              <div className="w-px h-5 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400">Montant C.O.D</span>
                <div className="font-bold text-emerald-400 font-mono">{formatDZD(order.totalAmount)}</div>
              </div>
            </div>
          </div>

          {/* Customer & Courier Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Destinataire
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{order.customerName}</h4>
              <p className="text-xs text-slate-600 mt-1">{order.wilaya} — {order.commune}</p>
              <p className="text-[11px] text-slate-500">{order.customerAddress}</p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{order.customerPhone}</span>
                </a>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Chauffeur Référent
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                {driver ? driver.name : 'Non assigné'}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {driver ? `Véhicule: ${driver.vehicleType} (${driver.licensePlate || 'DZ'})` : 'En attente'}
              </p>
              {driver && (
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`tel:${driver.phone}`}
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Appeler livreur</span>
                  </a>
                  <a
                    href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Timeline of Status Events */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Historique Chronologique des Événements
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
              {order.history && order.history.length > 0 ? (
                order.history.map((entry, idx) => {
                  const entryStatus = STATUS_LABELS[entry.status] || STATUS_LABELS['new'];
                  return (
                    <div key={idx} className="p-3 flex items-start justify-between text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${entryStatus.bg.replace('/10', '')} bg-blue-600`} />
                        <div>
                          <span className="font-bold text-slate-900">{entryStatus.label}</span>
                          <p className="text-slate-600 text-[11px] mt-0.5">{entry.note || 'Point de contrôle validé'}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {new Date(entry.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">Aucun historique d'événement</div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp Client</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copier Lien</span>
            </button>
            <button
              onClick={() => {
                setSlipOrderId(order.id);
                onClose();
              }}
              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Bon de livraison</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAdvanceStep}
              disabled={isSimulating || order.status === 'delivered'}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Avancer l'Acheminement</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
