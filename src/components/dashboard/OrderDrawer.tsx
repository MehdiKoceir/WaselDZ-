import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Calendar, 
  Truck, 
  CreditCard, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RotateCcw, 
  XCircle, 
  Share2,
  Printer,
  ChevronRight,
  UserCheck,
  Copy,
  Check,
  MessageSquare,
  Trash2,
  ExternalLink,
  Radio,
  Edit3,
  Save,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD, PAYMENT_LABELS, STATUS_LABELS, ALGERIAN_WILAYAS } from '../../data/algeriaData';
import { OrderStatus } from '../../types';

export const OrderDrawer: React.FC = () => {
  const { 
    selectedOrderId, 
    setSelectedOrderId, 
    orders, 
    drivers, 
    updateOrderStatus, 
    updateCustomerInfo,
    assignDriver, 
    deleteOrder, 
    setSlipOrderId,
    setTrackingOrderId,
    showConfirmDialog,
    showToast,
    business
  } = useApp();

  const [statusNote, setStatusNote] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [whatsappTemplate, setWhatsappTemplate] = useState<'driver' | 'client_notice' | 'client_unreachable'>('driver');

  // Customer Editing State
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editCustomerPhone, setEditCustomerPhone] = useState('');
  const [editCustomerWilaya, setEditCustomerWilaya] = useState('');
  const [editCustomerCommune, setEditCustomerCommune] = useState('');
  const [editCustomerAddress, setEditCustomerAddress] = useState('');
  const [editCustomerNotes, setEditCustomerNotes] = useState('');
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedOrderId) {
        setSelectedOrderId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOrderId, setSelectedOrderId]);

  if (!selectedOrderId) return null;

  const order = orders.find(o => o.id === selectedOrderId);
  
  // Synchronize editing fields with active order
  useEffect(() => {
    if (order) {
      setEditCustomerName(order.customerName || '');
      setEditCustomerPhone(order.customerPhone || '');
      setEditCustomerWilaya(order.wilaya || '');
      setEditCustomerCommune(order.commune || '');
      setEditCustomerAddress(order.customerAddress || '');
      setEditCustomerNotes(order.notes || '');
      setIsEditingCustomer(false);
    }
  }, [order?.id]);

  if (!order) return null;

  const currentStatusInfo = STATUS_LABELS[order.status] || STATUS_LABELS['new'];
  const assignedDriver = drivers.find(d => d.id === order.driverId);

  const handleSaveCustomer = async () => {
    if (!editCustomerName.trim() || !editCustomerPhone.trim() || !editCustomerAddress.trim()) {
      showToast({
        type: 'warning',
        title: 'Champs obligatoires',
        message: 'Nom, téléphone et adresse client requis.',
      });
      return;
    }
    setIsSavingCustomer(true);
    try {
      await updateCustomerInfo(order.id, {
        customerName: editCustomerName,
        customerPhone: editCustomerPhone,
        wilaya: editCustomerWilaya,
        commune: editCustomerCommune,
        customerAddress: editCustomerAddress,
        notes: editCustomerNotes,
      });
      setIsEditingCustomer(false);
    } finally {
      setIsSavingCustomer(false);
    }
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus, statusNote || undefined);
    setStatusNote('');
  };

  const handleAssign = () => {
    if (selectedDriverId) {
      assignDriver(order.id, selectedDriverId);
      setSelectedDriverId('');
    }
  };

  const handleDelete = () => {
    showConfirmDialog({
      title: `Supprimer la commande ${order.id} ?`,
      message: `Êtes-vous sûr de vouloir supprimer définitivement la commande de ${order.customerName} (${order.wilaya}) ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer définitivement',
      cancelLabel: 'Conserver la commande',
      isDestructive: true,
      onConfirm: () => {
        deleteOrder(order.id);
      },
    });
  };

  // WhatsApp Messages generator
  const getWhatsAppContent = () => {
    if (whatsappTemplate === 'client_notice') {
      return (
        `Salam ${order.customerName} 👋\n` +
        `Votre commande *${order.id}* chez *${business.name}* est en cours de livraison.\n` +
        `🚚 Livreur : ${assignedDriver ? assignedDriver.name : 'Notre service coursier'}${assignedDriver ? ` (${assignedDriver.phone})` : ''}\n` +
        `💰 Montant à préparer à la livraison : *${formatDZD(order.totalAmount)}*\n` +
        `📍 Adresse : ${order.customerAddress}, ${order.commune} (${order.wilaya})\n` +
        `Merci de rester joignable au ${order.customerPhone}.`
      );
    }

    if (whatsappTemplate === 'client_unreachable') {
      return (
        `Salam ${order.customerName},\n` +
        `Le livreur WaselDZ a tenté de vous joindre pour votre commande *${order.id}* chez *${business.name}*, mais vous étiez indisponible.\n` +
        `Merci de nous rappeler au plus vite afin de replanifier votre passage et éviter le retour du colis.\n` +
        `📞 Contact service client : ${business.phone}`
      );
    }

    // Default: Driver dispatch note
    return (
      `📦 *MISSION DE LIVRAISON WaselDZ — Réf: ${order.id}*\n` +
      `🏪 *Boutique:* ${business.name} (${business.phone})\n` +
      `👤 *Client:* ${order.customerName}\n` +
      `📞 *Tél:* ${order.customerPhone}\n` +
      `📍 *Wilaya:* ${order.wilaya} (${order.commune})\n` +
      `🏠 *Adresse:* ${order.customerAddress}\n` +
      `💰 *TOTAL À ENCAISSER (COD):* ${formatDZD(order.totalAmount)}\n` +
      `📝 *Notes & Consignes:* ${order.notes || 'R.A.S.'}`
    );
  };

  const currentMessageText = getWhatsAppContent();

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessageText);
    setCopiedText(true);
    showToast({
      type: 'info',
      title: 'Texte copié dans le presse-papier',
      message: 'Prêt à être collé dans WhatsApp ou SMS',
    });
    setTimeout(() => setCopiedText(false), 2500);
  };

  const getRecipientPhoneForWhatsApp = () => {
    if (whatsappTemplate === 'driver') {
      if (assignedDriver) {
        return assignedDriver.phone.replace(/[^0-9]/g, '');
      }
      return '';
    }
    return order.customerPhone.replace(/[^0-9]/g, '');
  };

  const openWhatsAppUrl = () => {
    let cleanPhone = getRecipientPhoneForWhatsApp();
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '213' + cleanPhone.slice(1);
    }
    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(currentMessageText)}`
      : `https://wa.me/?text=${encodeURIComponent(currentMessageText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xl font-black text-blue-400">{order.id}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentStatusInfo.bg} ${currentStatusInfo.text}`}>
                {currentStatusInfo.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Suivi colis : <span className="font-mono text-slate-300 font-bold">{order.trackingNumber}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTrackingOrderId(order.id)}
              title="Suivi radar en temps réel"
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Suivi Direct</span>
            </button>

            <button
              onClick={() => setSlipOrderId(order.id)}
              title="Ouvrir le Bon de Livraison Imprimable"
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bon de Livraison</span>
            </button>

            <button
              onClick={() => setSelectedOrderId(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Fermer le panneau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 flex-1 text-slate-900">
          
          {/* Status Pipeline Visual Step Tracker */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3">
              Cycle de vie logistique
            </div>
            <div className="flex items-center justify-between text-xs font-semibold relative">
              {[
                { id: 'new', label: 'Reçue' },
                { id: 'confirmed', label: 'Validée' },
                { id: 'preparing', label: 'Prête' },
                { id: 'assigned', label: 'Assignée' },
                { id: 'out_for_delivery', label: 'En route' },
                { id: 'delivered', label: 'Livrée' },
              ].map((step, i) => {
                const statusOrder = ['new', 'confirmed', 'preparing', 'assigned', 'out_for_delivery', 'delivered'];
                const currentIndex = statusOrder.indexOf(order.status);
                const isPassed = currentIndex >= i;
                const isCurrent = order.status === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-1 flex-1">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                        isCurrent 
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs' 
                          : isPassed 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className={`text-[10px] hidden sm:block ${isCurrent ? 'font-bold text-blue-700' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Status Update Controls */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
              Changer le statut en 1-clic :
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleStatusChange('confirmed')}
                className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  order.status === 'confirmed' 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Validée
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('preparing')}
                className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  order.status === 'preparing' 
                    ? 'bg-amber-600 text-white border-amber-700 shadow-xs' 
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" /> En préparation
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('out_for_delivery')}
                className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  order.status === 'out_for_delivery' 
                    ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs' 
                    : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border-cyan-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" /> En livraison
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('delivered')}
                className={`px-2.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  order.status === 'delivered' 
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 shadow-xs' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Livrée & Payée
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('failed')}
                className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  order.status === 'failed' 
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs' 
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" /> Injoignable
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('returned')}
                className={`px-2.5 py-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  order.status === 'returned' 
                    ? 'bg-orange-600 text-white border-orange-700 shadow-xs' 
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retournée
              </button>
            </div>

            <div className="pt-1">
              <input
                type="text"
                placeholder="Note facultative sur cette étape (ex: deuxième passage prévu à 17h...)"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Customer & Destination Card with Firestore Sync */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Destinataire & Fiche Client (Firestore)</span>
              </h4>

              <div className="flex items-center gap-1.5">
                {!isEditingCustomer ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingCustomer(true)}
                      className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Modifier les coordonnées et synchroniser avec Firestore"
                    >
                      <Edit3 className="w-3 h-3 text-blue-600" />
                      <span>Modifier</span>
                    </button>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      <span>Appeler</span>
                    </a>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomer(false)}
                    className="px-2 py-1 rounded-md text-slate-500 hover:text-slate-700 text-xs font-semibold"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>

            {isEditingCustomer ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={editCustomerName}
                      onChange={(e) => setEditCustomerName(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      placeholder="Ex: Karim Benali"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      N° Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editCustomerPhone}
                      onChange={(e) => setEditCustomerPhone(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                      placeholder="0550 12 34 56"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Wilaya
                    </label>
                    <select
                      value={editCustomerWilaya}
                      onChange={(e) => {
                        setEditCustomerWilaya(e.target.value);
                        const match = ALGERIAN_WILAYAS.find(w => `${w.code} - ${w.name}` === e.target.value || w.name === e.target.value);
                        if (match && match.communes.length > 0) {
                          setEditCustomerCommune(match.communes[0]);
                        }
                      }}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                    >
                      {ALGERIAN_WILAYAS.map(w => (
                        <option key={w.code} value={`${w.code} - ${w.name}`}>
                          {w.code} - {w.name} ({w.arabicName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Commune
                    </label>
                    <input
                      type="text"
                      value={editCustomerCommune}
                      onChange={(e) => setEditCustomerCommune(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                      placeholder="Commune"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Adresse exacte de livraison
                  </label>
                  <input
                    type="text"
                    value={editCustomerAddress}
                    onChange={(e) => setEditCustomerAddress(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="Numéro, rue, bâtiment, repère..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Consignes / Notes spéciales
                  </label>
                  <input
                    type="text"
                    value={editCustomerNotes}
                    onChange={(e) => setEditCustomerNotes(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                    placeholder="Instructions pour le livreur (ex: appeler avant d'arriver)"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingCustomer(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomer}
                    disabled={isSavingCustomer}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingCustomer ? 'Enregistrement...' : 'Sauvegarder dans Firestore'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="text-sm font-black text-slate-900">{order.customerName}</div>
                
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Téléphone :</span>
                  <span className="font-mono font-bold text-slate-900">{order.customerPhone}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">{order.wilaya}</strong> — {order.commune}
                    <br />
                    {order.customerAddress}
                  </span>
                </div>

                {order.notes && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                    <strong>Consignes client :</strong> {order.notes}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Driver Assignment */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Chauffeur / Livreur Assigné</span>
            </h4>

            {assignedDriver ? (
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {assignedDriver.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-slate-900">{assignedDriver.name}</div>
                    <div className="text-slate-500 capitalize">
                      {assignedDriver.vehicleType} {assignedDriver.licensePlate ? `• ${assignedDriver.licensePlate}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${assignedDriver.phone}`}
                    className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Aucun livreur n'est encore assigné à cette commande.</p>
                <div className="flex gap-2">
                  <select
                    value={selectedDriverId}
                    onChange={(e) => setSelectedDriverId(e.target.value)}
                    className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner un livreur...</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.vehicleType} - {d.status})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssign}
                    disabled={!selectedDriverId}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    Assigner
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Dispatch Hub Pro */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-emerald-700" />
                <span>Centre d'Expédition WhatsApp Pro</span>
              </h4>
            </div>

            {/* Template choices */}
            <div className="grid grid-cols-3 gap-1.5 bg-emerald-100/60 p-1 rounded-lg text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setWhatsappTemplate('driver')}
                className={`py-1.5 px-2 rounded-md transition-all text-center cursor-pointer ${
                  whatsappTemplate === 'driver' 
                    ? 'bg-white text-emerald-900 shadow-xs' 
                    : 'text-emerald-800 hover:text-emerald-950'
                }`}
              >
                Fiche Livreur
              </button>
              <button
                type="button"
                onClick={() => setWhatsappTemplate('client_notice')}
                className={`py-1.5 px-2 rounded-md transition-all text-center cursor-pointer ${
                  whatsappTemplate === 'client_notice' 
                    ? 'bg-white text-emerald-900 shadow-xs' 
                    : 'text-emerald-800 hover:text-emerald-950'
                }`}
              >
                Alerte Client
              </button>
              <button
                type="button"
                onClick={() => setWhatsappTemplate('client_unreachable')}
                className={`py-1.5 px-2 rounded-md transition-all text-center cursor-pointer ${
                  whatsappTemplate === 'client_unreachable' 
                    ? 'bg-white text-emerald-900 shadow-xs' 
                    : 'text-emerald-800 hover:text-emerald-950'
                }`}
              >
                Client Injoignable
              </button>
            </div>

            {/* Preview Box */}
            <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {currentMessageText}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copié !' : 'Copier le message'}</span>
              </button>

              <button
                type="button"
                onClick={openWhatsAppUrl}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvrir WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Détail financier & Articles</span>
            </h4>

            <div className="divide-y divide-slate-200 text-xs">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900">{it.name}</span>
                    <span className="text-slate-500 font-mono ml-2">×{it.quantity}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">{formatDZD(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total articles :</span>
                <span className="font-mono font-medium">{formatDZD(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frais d'expédition Wilaya :</span>
                <span className="font-mono font-medium">{formatDZD(order.deliveryFee)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Total C.O.D à encaisser :</span>
                <span className="text-blue-700 font-mono text-base">{formatDZD(order.totalAmount)}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Mode de règlement : <strong className="text-slate-800">{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Timeline History */}
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Historique de traçabilité
            </h4>
            <div className="space-y-3 text-xs border-l-2 border-slate-200 pl-4 ml-1">
              {order.history.map((h, i) => (
                <div key={i} className="relative pb-1">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <div className="font-bold text-slate-900 capitalize">
                    {STATUS_LABELS[h.status]?.label || h.status}
                  </div>
                  <div className="text-slate-500 text-[11px] font-mono">
                    {new Date(h.timestamp).toLocaleDateString('fr-DZ', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  {h.note && <div className="text-slate-600 text-[11px] mt-0.5">{h.note}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[11px] text-slate-500">
              ID dossier : <code className="font-mono">{order.id}</code>
            </span>

            <button
              type="button"
              onClick={handleDelete}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Supprimer la commande</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
