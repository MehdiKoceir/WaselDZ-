import React from 'react';
import { X, Printer, Download, CheckCircle2, Truck, Building2, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Order, BusinessProfile, Driver } from '../../types';
import { formatDZD, PAYMENT_LABELS } from '../../data/algeriaData';

interface DeliverySlipModalProps {
  order: Order | null;
  business: BusinessProfile;
  driver?: Driver;
  isOpen: boolean;
  onClose: () => void;
}

export const DeliverySlipModal: React.FC<DeliverySlipModalProps> = ({
  order,
  business,
  driver,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Control Bar - Hidden on print */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-bold">
              Bon de Livraison Officiel — Réf. {order.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le Bon (A4 / Reçu)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-delivery-slip" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 text-xs print:p-0 print:space-y-4">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                  {business.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  EXPÉDITEUR
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Gérant : {business.ownerName} • Tél : {business.phone}
              </p>
              <p className="text-xs text-slate-500">
                {business.address}, {business.wilaya}
              </p>
            </div>

            <div className="text-right sm:text-right">
              <div className="inline-block bg-slate-900 text-white px-3 py-1.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider">
                BON DE LIVRAISON N° {order.id}
              </div>
              <div className="mt-2 text-xs font-mono text-slate-600">
                Suivi: <strong className="text-slate-900">{order.trackingNumber}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Date : {new Date(order.createdAt).toLocaleDateString('fr-DZ', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Barcode representation */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            {/* SVG barcode visualization */}
            <svg className="w-64 h-12" viewBox="0 0 200 40">
              <rect x="10" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="14" y="5" width="4" height="30" fill="#0f172a" />
              <rect x="22" y="5" width="1" height="30" fill="#0f172a" />
              <rect x="26" y="5" width="3" height="30" fill="#0f172a" />
              <rect x="32" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="38" y="5" width="5" height="30" fill="#0f172a" />
              <rect x="46" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="52" y="5" width="4" height="30" fill="#0f172a" />
              <rect x="60" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="66" y="5" width="1" height="30" fill="#0f172a" />
              <rect x="70" y="5" width="4" height="30" fill="#0f172a" />
              <rect x="78" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="84" y="5" width="3" height="30" fill="#0f172a" />
              <rect x="90" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="96" y="5" width="4" height="30" fill="#0f172a" />
              <rect x="104" y="5" width="1" height="30" fill="#0f172a" />
              <rect x="110" y="5" width="3" height="30" fill="#0f172a" />
              <rect x="118" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="124" y="5" width="5" height="30" fill="#0f172a" />
              <rect x="132" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="138" y="5" width="1" height="30" fill="#0f172a" />
              <rect x="144" y="5" width="4" height="30" fill="#0f172a" />
              <rect x="152" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="158" y="5" width="3" height="30" fill="#0f172a" />
              <rect x="166" y="5" width="2" height="30" fill="#0f172a" />
              <rect x="172" y="5" width="4" height="30" fill="#0f172a" />
              <rect x="180" y="5" width="1" height="30" fill="#0f172a" />
              <rect x="186" y="5" width="2" height="30" fill="#0f172a" />
            </svg>
            <span className="font-mono text-xs tracking-widest text-slate-800 font-bold mt-1">
              *{order.trackingNumber}*
            </span>
          </div>

          {/* Grid: Client & Driver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Destinataire */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Client Destinataire</span>
              </div>
              <div className="text-sm font-black text-slate-900">{order.customerName}</div>
              <div className="font-mono font-bold text-blue-700">{order.customerPhone}</div>
              <div className="text-slate-700">
                <strong className="text-slate-900">{order.wilaya}</strong> — {order.commune}
                <br />
                {order.customerAddress}
              </div>
              {order.notes && (
                <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-md border border-amber-200">
                  Instructions : {order.notes}
                </div>
              )}
            </div>

            {/* Transporteur & Livreur */}
            <div className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Prise en charge Chauffeur</span>
              </div>
              {driver ? (
                <>
                  <div className="text-sm font-black text-slate-900">{driver.name}</div>
                  <div className="font-mono font-bold text-slate-700">{driver.phone}</div>
                  <div className="text-slate-600 capitalize">
                    Véhicule : {driver.vehicleType} {driver.licensePlate ? `(${driver.licensePlate})` : ''}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold">
                    ✓ Chauffeur certifié WaselDZ
                  </div>
                </>
              ) : (
                <div className="text-slate-500 italic py-2">
                  En attente d'affectation livreur / Expédition directe
                </div>
              )}
            </div>
          </div>

          {/* Table of items */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-[11px] font-black text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3">Réf</th>
                  <th className="p-3">Désignation de l'article</th>
                  <th className="p-3 text-center">Qté</th>
                  <th className="p-3 text-right">Prix Unitaire</th>
                  <th className="p-3 text-right">Montant (DZD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-mono text-slate-500">#{idx + 1}</td>
                    <td className="p-3 font-semibold text-slate-900">{it.name}</td>
                    <td className="p-3 text-center font-bold">{it.quantity}</td>
                    <td className="p-3 text-right font-mono">{formatDZD(it.price)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatDZD(it.price * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-100/70 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1 text-xs">
              <div className="text-slate-600">
                Mode de règlement : <strong className="text-slate-900">{PAYMENT_LABELS[order.paymentMethod] || 'Espèces à la livraison'}</strong>
              </div>
              <div className="text-slate-600">
                Sous-total articles : <span className="font-mono font-semibold">{formatDZD(order.subtotal)}</span>
              </div>
              <div className="text-slate-600">
                Frais d'expédition Wilaya : <span className="font-mono font-semibold">{formatDZD(order.deliveryFee)}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border-2 border-blue-600 text-right sm:min-w-[240px]">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                NET À RECOUVRER (C.O.D)
              </span>
              <span className="text-2xl font-black text-blue-700 font-mono">
                {formatDZD(order.totalAmount)}
              </span>
            </div>
          </div>

          {/* Signatures & Stamps */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            <div className="h-24 p-3 border border-dashed border-slate-300 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Visa / Signature du Livreur
              </span>
              <span className="text-[10px] text-slate-400 italic">Mention "Colis remis intact"</span>
            </div>

            <div className="h-24 p-3 border border-dashed border-slate-300 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Émargement / Signature du Client
              </span>
              <span className="text-[10px] text-slate-400 italic">Mention "Reçu conforme et payé"</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            Document généré par WaselDZ Logistics Cloud • Support assistance commerçant : contact@waseldz.com • 0550 00 00 00
          </div>

        </div>

      </div>
    </div>
  );
};
