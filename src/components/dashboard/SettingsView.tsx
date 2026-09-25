import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Truck,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALGERIAN_WILAYAS } from '../../data/algeriaData';
import { BusinessCategory } from '../../types';

export const SettingsView: React.FC = () => {
  const { business, updateBusiness, resetToDemoData } = useApp();

  const [name, setName] = useState(business.name);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [address, setAddress] = useState(business.address);
  const [wilaya, setWilaya] = useState(business.wilaya);
  const [businessType, setBusinessType] = useState<BusinessCategory>(business.businessType);

  // Settings
  const [smsNotification, setSmsNotification] = useState(true);
  const [whatsAppNotification, setWhatsAppNotification] = useState(true);
  const [autoAssignDrivers, setAutoAssignDrivers] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      name,
      ownerName,
      phone,
      email,
      address,
      wilaya,
      businessType,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Paramètres & Configuration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Profil entreprise, zones tarifaires d'Algérie et préférences système
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Paramètres enregistrés !</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Profil du commerce */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Profil Commercial & Identité</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nom de la Boutique / Entreprise
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nom du gérant
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Téléphone principal (Algérie)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email commercial
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Secteur d'activité
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessCategory)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="clothing">Boutique de vêtements & Prêt-à-porter</option>
                <option value="ecommerce">E-Commerce / Vente en ligne</option>
                <option value="restaurant">Restaurant & Alimentation</option>
                <option value="electronics">Électronique & High-Tech</option>
                <option value="grocery">Supérette & Épicerie</option>
                <option value="other">Autre commerce</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Wilaya du Siège / Magasin
              </label>
              <select
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {ALGERIAN_WILAYAS.map(w => (
                  <option key={w.code} value={`${w.code} - ${w.name}`}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Adresse physique de retrait / Entrepôt
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Devise & Tarifs régionaux */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Devise & Barème d'Expédition</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Devise Principale</div>
              <p className="text-slate-600">Dinar Algérien (DZD / DA) — Norme bancaire officielle</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-1">Couverture Territoriale</div>
              <p className="text-slate-600">Prise en charge intégrale des 58 Wilayas algériennes</p>
            </div>
          </div>
        </div>

        {/* 3. Notifications & Automatisation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">Alertes & Dispatch</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Notifications WhatsApp au livreur</span>
                <span className="text-slate-500">Générer les raccourcis de contact direct avec fiche d'adresse</span>
              </div>
              <input
                type="checkbox"
                checked={whatsAppNotification}
                onChange={(e) => setWhatsAppNotification(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Confirmation client par SMS</span>
                <span className="text-slate-500">Alerter le client dès que son colis est confié au chauffeur</span>
              </div>
              <input
                type="checkbox"
                checked={smsNotification}
                onChange={(e) => setSmsNotification(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Action Save */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Voulez-vous réinitialiser les données avec les exemples démo ?')) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser Données Démo</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les modifications</span>
          </button>
        </div>

      </form>

    </div>
  );
};
