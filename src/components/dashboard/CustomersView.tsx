import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Share2, 
  ShoppingBag, 
  DollarSign,
  X,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS, formatDZD } from '../../data/algeriaData';
import { Customer } from '../../types';

export const CustomersView: React.FC = () => {
  const { customers, orders, addCustomer, setSelectedOrderId } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // New Customer Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16');
  const [commune, setCommune] = useState('Alger Centre');

  const filteredCustomers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return customers.filter(c => 
      !q || 
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.wilaya.toLowerCase().includes(q) ||
      c.commune.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerOrders = orders.filter(o => activeCustomer && (o.customerPhone === activeCustomer.phone || o.customerName === activeCustomer.name));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;

    const targetWilaya = ALGERIAN_WILAYAS.find(w => w.code === wilayaCode) || ALGERIAN_WILAYAS[0];

    addCustomer({
      name,
      phone,
      address,
      wilaya: `${targetWilaya.code} - ${targetWilaya.name}`,
      commune,
    });

    setName('');
    setPhone('');
    setAddress('');
    setIsAddCustomerOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Fichier Clients (CRM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Répertoire centralisé de vos acheteurs fidèles et historique d'expéditions
          </p>
        </div>

        <button
          onClick={() => setIsAddCustomerOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter un client</span>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, wilaya..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold hidden sm:block">
          Total : {filteredCustomers.length} clients enregistrés
        </div>
      </div>

      {/* Customers Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map(customer => {
          const matchingOrders = orders.filter(o => o.customerPhone === customer.phone || o.customerName === customer.name);
          const totalSpent = matchingOrders.reduce((sum, o) => sum + (o.status === 'delivered' ? o.totalAmount : 0), 0);

          return (
            <div
              key={customer.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{customer.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`tel:${customer.phone}`} className="hover:text-blue-600 font-medium">
                        {customer.phone}
                      </a>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{customer.wilaya} — {customer.commune}</span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-500">Commandes</div>
                    <div className="font-bold text-slate-900">{matchingOrders.length} colis</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl">
                    <div className="text-[10px] text-slate-500">Dépenses DZD</div>
                    <div className="font-bold text-emerald-600">{formatDZD(totalSpent)}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${customer.phone}`}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex-1 text-center transition-colors"
                >
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex-1 text-center transition-colors"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex-1 text-center transition-colors cursor-pointer"
                >
                  Historique
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Detail / Order History Modal */}
      {activeCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Fiche Client — {activeCustomer.name}</h3>
                <p className="text-xs text-slate-400">{activeCustomer.phone} • {activeCustomer.wilaya}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-900">Adresse de livraison habituelle :</div>
                <div className="text-slate-600">{activeCustomer.address}, {activeCustomer.commune}, {activeCustomer.wilaya}</div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Historique des achats ({customerOrders.length})
                </h4>

                {customerOrders.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune commande enregistrée pour l'instant.</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map(order => (
                      <div 
                        key={order.id} 
                        className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-blue-400 transition-colors"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-900">{order.id}</div>
                          <div className="text-[11px] text-slate-500">{new Date(order.createdAt).toLocaleDateString('fr-DZ')}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{formatDZD(order.totalAmount)}</div>
                          <button
                            onClick={() => {
                              setSelectedCustomerId(null);
                              setSelectedOrderId(order.id);
                            }}
                            className="text-[11px] text-blue-600 hover:underline font-semibold"
                          >
                            Voir détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Ajouter une nouvelle fiche client</h3>
              <button onClick={() => setIsAddCustomerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom et Prénom du client *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Yacine Benmoussa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Téléphone Algérie *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0770 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wilaya
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => {
                      setWilayaCode(e.target.value);
                      const w = ALGERIAN_WILAYAS.find(x => x.code === e.target.value);
                      if (w && w.communes[0]) setCommune(w.communes[0]);
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ALGERIAN_WILAYAS.map(w => (
                      <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Commune
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Commune"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse exacte
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Quartier des oliviers, Bâtiment 4"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Enregistrer client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
