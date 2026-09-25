import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Star, 
  ShieldCheck, 
  Navigation,
  Car,
  Bike
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Driver, VehicleType, DriverStatus } from '../../types';

export const DriversView: React.FC = () => {
  const { drivers, orders, addDriver, updateDriverStatus } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [licensePlate, setLicensePlate] = useState('');
  const [wilayaZone, setWilayaZone] = useState('16 - Alger & Blida');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addDriver({
      name,
      phone,
      vehicleType,
      licensePlate: licensePlate || undefined,
      status: 'available',
    });

    setName('');
    setPhone('');
    setLicensePlate('');
    setIsAddModalOpen(false);
  };

  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'motorcycle':
      case 'moto': return <Bike className="w-4 h-4 text-blue-600" />;
      case 'car':
      case 'voiture': return <Car className="w-4 h-4 text-emerald-600" />;
      case 'van':
      case 'fourgon': return <Truck className="w-4 h-4 text-indigo-600" />;
      case 'bicycle':
      case 'velo': return <Bike className="w-4 h-4 text-amber-600" />;
      default: return <Truck className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Flotte & Livreurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Gérez vos chauffeurs internes ou transporteurs partenaires ({drivers.length} actifs)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Ajouter un livreur</span>
        </button>
      </div>

      {/* Drivers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map(driver => {
          const activeOrdersCount = orders.filter(o => o.driverId === driver.id && ['assigned', 'out_for_delivery'].includes(o.status)).length;
          const completedOrdersCount = orders.filter(o => o.driverId === driver.id && o.status === 'delivered').length;
          const failedCount = orders.filter(o => o.driverId === driver.id && ['failed', 'returned'].includes(o.status)).length;

          return (
            <div
              key={driver.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
            >
              <div>
                {/* Driver Top Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-base border border-slate-200">
                      {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{driver.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        {getVehicleIcon(driver.vehicleType)}
                        <span className="capitalize">{driver.vehicleType}</span>
                        {driver.licensePlate && <span>• {driver.licensePlate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={driver.status}
                    onChange={(e) => updateDriverStatus(driver.id, e.target.value as DriverStatus)}
                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                      driver.status === 'available'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : driver.status === 'busy'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    <option value="available">Disponible</option>
                    <option value="busy">En course</option>
                    <option value="offline">Hors ligne</option>
                  </select>
                </div>

                {/* Rating & Phone */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`tel:${driver.phone}`} className="font-semibold text-blue-600 hover:underline">
                      {driver.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{driver.rating ? driver.rating.toFixed(1) : '4.9'} / 5</span>
                  </div>
                </div>

                {/* Performance Stats Cards */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-medium">En cours</div>
                    <div className="font-black text-sm text-blue-600">{activeOrdersCount}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-medium">Livrées</div>
                    <div className="font-black text-sm text-emerald-600">{completedOrdersCount}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-medium">Échecs</div>
                    <div className="font-black text-sm text-rose-600">{failedCount}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${driver.phone}`}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </a>
                <a
                  href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">Ajouter un nouveau livreur</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom et Prénom du livreur *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Khaled Boudiaf"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numéro de téléphone mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0555 12 34 56"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Type de véhicule
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="motorcycle">Moto (Express)</option>
                    <option value="car">Voiture</option>
                    <option value="van">Fourgonnette / Van</option>
                    <option value="bicycle">Vélo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Matricule / Immatriculation
                  </label>
                  <input
                    type="text"
                    placeholder="12345 116 16"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Ajouter le livreur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
