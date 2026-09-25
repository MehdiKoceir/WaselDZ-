import React, { useState } from 'react';
import { 
  Truck, 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  CheckCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BusinessCategory } from '../../types';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin' }) => {
  const { setCurrentView, updateBusiness, loginDemo } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form states
  const [email, setEmail] = useState('contact@djazairtrend.dz');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up specific
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState<BusinessCategory>('clothing');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!businessName.trim() || !ownerName.trim() || !phone.trim() || !email.trim()) {
        setError('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      if (!acceptTerms) {
        setError('Veuillez accepter les conditions d\'utilisation.');
        return;
      }

      // Update business in context
      updateBusiness({
        name: businessName,
        ownerName: ownerName,
        email: email,
        phone: phone,
        businessType: businessType,
      });
    }

    // Direct into dashboard
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      {/* Back button to landing */}
      <div className="max-w-md mx-auto w-full px-4 mb-6">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil WaselDZ</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Wasel<span className="text-blue-600">DZ</span>
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                🇩🇿 Algérie
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Espace Gestion Commerçants
            </p>
          </div>
        </div>

        <h2 className="mt-5 text-center text-2xl font-extrabold text-slate-900">
          {mode === 'signin' ? 'Connexion à votre compte' : 'Créer votre compte commerce'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          {mode === 'signin'
            ? 'Gérez vos commandes et pilotez vos livraisons'
            : 'Rejoignez les e-commerces & boutiques en Algérie'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-2xl border border-slate-200">
          
          {/* Quick Demo Access banner */}
          <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-blue-900 block">Accès Immédiat Démo</span>
                <span className="text-blue-700">Explorez le tableau de bord en 1 clic</span>
              </div>
            </div>
            <button
              onClick={loginDemo}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              Tester Démo
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom du commerce / Boutique <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: El-Djazair Boutique, Oran Tech..."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom et Prénom du gérant <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Amine Benali"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Secteur d'activité <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as BusinessCategory)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  >
                    <option value="clothing">Boutique de vêtements & Prêt-à-porter (Clothing store)</option>
                    <option value="ecommerce">Vendeur E-Commerce / Page Instagram & TikTok</option>
                    <option value="restaurant">Restaurant, Fast-food & Pâtisserie</option>
                    <option value="electronics">Électronique & Informatique (Electronics store)</option>
                    <option value="grocery">Supérette & Alimentation (Grocery)</option>
                    <option value="other">Autre commerce de proximité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de téléphone Algérie <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="ex: 0550 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="contact@boutique.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signin' ? (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Se souvenir de moi</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Veuillez contacter le support WaselDZ à support@waseldz.com pour réinitialiser vos identifiants.')}
                  className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            ) : (
              <div className="text-xs">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <span>
                    J'accepte les conditions générales d'utilisation et la politique de confidentialité de WaselDZ en Algérie.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>{mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            {mode === 'signin' ? (
              <p>
                Vous n'avez pas encore de compte ?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Inscrivez votre commerce
                </button>
              </p>
            ) : (
              <p>
                Vous avez déjà un compte ?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Connectez-vous ici
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
