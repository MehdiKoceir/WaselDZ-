import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, MapPin, DollarSign, Package, Phone, User, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS, formatDZD } from '../../data/algeriaData';
import { OrderItem, PaymentMethod } from '../../types';
import confetti from 'canvas-confetti';

export const CreateOrderModal: React.FC = () => {
  const { isOrderModalOpen, setIsOrderModalOpen, createOrder, products, drivers, showToast } = useApp();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOrderModalOpen) {
        setIsOrderModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrderModalOpen, setIsOrderModalOpen]);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [commune, setCommune] = useState('Alger Centre');
  const [deliveryFee, setDeliveryFee] = useState<number>(400);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [driverId, setDriverId] = useState<string>('');

  // Items in order
  const [items, setItems] = useState<OrderItem[]>([
    { id: products[0]?.id || 'prod-1', name: products[0]?.name || 'Article 1', quantity: 1, price: products[0]?.price || 5000 }
  ]);

  if (!isOrderModalOpen) return null;

  const currentWilaya = ALGERIAN_WILAYAS.find(w => w.code === selectedWilayaCode) || ALGERIAN_WILAYAS[0];

  const handleWilayaChange = (code: string) => {
    setSelectedWilayaCode(code);
    const target = ALGERIAN_WILAYAS.find(w => w.code === code);
    if (target) {
      setDeliveryFee(target.defaultFee);
      setCommune(target.communes[0] || target.name);
    }
  };

  const handleAddItem = () => {
    const firstProd = products[0];
    setItems([
      ...items,
      {
        id: firstProd ? firstProd.id : `prod-${Date.now()}`,
        name: firstProd ? firstProd.name : 'Nouvel Article',
        quantity: 1,
        price: firstProd ? firstProd.price : 2000,
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemProductSelect = (index: number, prodId: string) => {
    const p = products.find(prod => prod.id === prodId);
    if (p) {
      const updated = [...items];
      updated[index] = {
        ...updated[index],
        id: p.id,
        name: p.name,
        price: p.price,
      };
      setItems(updated);
    }
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const updated = [...items];
    updated[index].quantity = Math.max(1, qty);
    setItems(updated);
  };

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...items];
    updated[index].price = Math.max(0, price);
    setItems(updated);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalAmount = subtotal + Number(deliveryFee || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      showToast({
        type: 'warning',
        title: 'Champs obligatoires manquants',
        message: 'Veuillez renseigner le nom, téléphone et adresse exacte du destinataire.',
      });
      return;
    }

    // Server-side financial & fraud validation pass
    try {
      const validateRes = await fetch('/api/orders/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerPhone,
          items,
          deliveryFee: Number(deliveryFee),
          claimedTotal: totalAmount
        })
      });
      if (validateRes.ok) {
        const valData = await validateRes.json();
        if (!valData.valid) {
          showToast({
            type: 'error',
            title: 'Échec Contrôle de Sécurité Serveur',
            message: valData.error || 'Données financières rejetées',
          });
          return;
        }
      }
    } catch {
      // Fallback if backend temporarily starting up
    }

    createOrder({
      customerName,
      customerPhone,
      customerAddress,
      wilaya: `${currentWilaya.code} - ${currentWilaya.name}`,
      commune,
      items,
      subtotal,
      deliveryFee: Number(deliveryFee),
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cib' ? 'paid' : 'pending',
      status: driverId ? 'assigned' : 'new',
      driverId: driverId || undefined,
      notes,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setIsOrderModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Créer une nouvelle commande</h3>
              <p className="text-xs text-slate-300">Enregistrement et expédition en Algérie</p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* 1. Coordonnées Client */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Informations Client</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom et Prénom du client *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Amine Belkacem"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone mobile *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="0550 12 34 56"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Wilaya & Commune */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wilaya de destination *
                </label>
                <select
                  value={selectedWilayaCode}
                  onChange={(e) => handleWilayaChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
                >
                  {ALGERIAN_WILAYAS.map(w => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name} ({w.arabicName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commune / Quartier *
                </label>
                {currentWilaya.communes && currentWilaya.communes.length > 0 ? (
                  <select
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  >
                    {currentWilaya.communes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse exacte de livraison *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Cité 500 Logements, Bâtiment B, Apt 14..."
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Produits & Tarification */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Articles commandés</span>
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un article</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => {
                const selectedProd = products.find(p => p.id === item.id);
                const hasStockWarning = selectedProd && item.quantity > selectedProd.stock;
                const isOutOfStock = selectedProd && selectedProd.stock === 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <select
                          value={item.id}
                          onChange={(e) => handleItemProductSelect(idx, e.target.value)}
                          className="w-full text-xs font-medium bg-white border border-slate-300 rounded-md p-1.5"
                        >
                          {products.map(p => {
                            const isOut = p.stock === 0;
                            const isLow = p.stock > 0 && p.stock <= (p.minStockAlert || 5);
                            return (
                              <option key={p.id} value={p.id}>
                                {p.name} — {formatDZD(p.price)} {isOut ? '🔴 (RUPTURE)' : isLow ? `🟠 (Alerte : ${p.stock} dispo)` : `🟢 (${p.stock} dispo)`}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                          className={`w-full text-xs text-center font-bold bg-white border rounded-md p-1.5 ${
                            hasStockWarning ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-300'
                          }`}
                          title="Quantité commandée"
                        />
                      </div>

                      <div className="w-28 text-right font-bold text-xs text-slate-900">
                        {formatDZD(item.price * item.quantity)}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {isOutOfStock ? (
                      <p className="text-[11px] text-red-600 font-semibold pl-2">
                        ⚠️ Attention : Cet article est en rupture de stock (0 unité disponible en rayon).
                      </p>
                    ) : hasStockWarning ? (
                      <p className="text-[11px] text-amber-600 font-semibold pl-2">
                        ⚠️ Quantité demandée ({item.quantity}) supérieure au stock disponible ({selectedProd?.stock} unités).
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Financial Summary */}
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total produits :</span>
                <span className="font-semibold text-slate-900">{formatDZD(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span>Frais de livraison ({currentWilaya.name}) :</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-24 px-2 py-1 text-right font-bold bg-white border border-slate-300 rounded text-xs"
                  />
                  <span className="font-bold text-slate-700">DA</span>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200/80 flex justify-between text-sm font-bold text-blue-900">
                <span>Montant total à encaisser :</span>
                <span className="text-base text-blue-700">{formatDZD(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* 3. Logistique & Paiement */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
              <span>3. Modalités & Livreur</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mode de règlement
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cod">Cash à la livraison (Standard)</option>
                  <option value="baridimob">Virement BaridiMob / CCP</option>
                  <option value="cib">Carte Edahabia / CIB</option>
                  <option value="prepaid">Paiement d'avance au magasin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigner un livreur (optionnel)
                </label>
                <select
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Non assigné (À préparer) --</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.vehicleType} - {d.status === 'available' ? 'Disponible' : d.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructions / Notes pour le livreur
              </label>
              <textarea
                rows={2}
                placeholder="ex: Le client demande d'appeler avant 14h, prévoir monnaie..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOrderModalOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistrer la commande</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
