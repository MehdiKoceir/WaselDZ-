import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Phone, 
  Eye, 
  EyeOff,
  ShieldCheck
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
        setError('Veuillez renseigner tous les champs obligatoires.');
        return;
      }
      if (!acceptTerms) {
        setError('Veuillez accepter les conditions générales de service logistique.');
        return;
      }

      updateBusiness({
        name: businessName,
        ownerName: ownerName,
        email: email,
        phone: phone,
        businessType: businessType,
      });
    }

    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      
      {/* Back button */}
      <div className="max-w-md mx-auto w-full px-4 mb-6">
        <button
          onClick={() => setCurrentView('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au portail d'accueil</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand identity */}
        <div className="flex justify-center items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white font-mono font-bold text-xs">
            DZ
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Wasel<span className="text-slate-500 font-medium">Logistics</span>
            </span>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Terminal Opérateurs & Expéditeurs
            </p>
          </div>
        </div>

        <h2 className="mt-5 text-center text-xl font-bold text-slate-900">
          {mode === 'signin' ? 'Connexion Espace Expéditeur Pro' : 'Ouverture de Compte Marchand'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          {mode === 'signin'
            ? 'Supervision de vos bordereaux, tournées et encaissements C.O.D'
            : 'Raccordement de votre commerce au réseau logistique national'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-6 px-6 sm:px-8 shadow-xs rounded-lg border border-slate-200">
          
          {/* Quick Demo Access banner */}
          <div className="mb-5 p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Accès Démo Immédiat</span>
              <span className="text-slate-500 text-[11px]">Consultez la console avec données de test</span>
            </div>
            <button
              onClick={loginDemo}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              Tester Démo
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Raison sociale / Nom commercial <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="ex: El-Djazair Distribution, Oran Tech..."
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Responsable logistique / Gérant <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Amine Benali"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Secteur d'activité <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as BusinessCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white cursor-pointer"
                  >
                    <option value="clothing">Prêt-à-porter & Vêtements</option>
                    <option value="ecommerce">E-Commerce & Vente en ligne</option>
                    <option value="electronics">Informatique & Électronique</option>
                    <option value="restaurant">Alimentation & Restauration</option>
                    <option value="grocery">Supérette & Grande Consommation</option>
                    <option value="other">Autre distribution professionnelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Téléphone opérationnel <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="ex: 0550 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Adresse email professionnelle <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="contact@entreprise.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mot de passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs font-mono bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-slate-900 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {mode === 'signin' ? (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>Mémoriser la session</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Contactez la régulation logistique à dispatch@waseldz.com pour réinitialiser vos accès.')}
                  className="font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Identifiants oubliés ?
                </button>
              </div>
            ) : (
              <div className="text-xs pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 mt-0.5"
                  />
                  <span>
                    J'adhère aux conditions d'acheminement et à la politique de gestion des fonds C.O.D.
                  </span>
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs"
            >
              <span>{mode === 'signin' ? 'Accéder à la console' : 'Valider l\'inscription'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            {mode === 'signin' ? (
              <p>
                Nouvel expéditeur ?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="font-semibold text-slate-900 hover:underline cursor-pointer"
                >
                  Ouvrir un compte professionnel
                </button>
              </p>
            ) : (
              <p>
                Déjà conventionné ?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="font-semibold text-slate-900 hover:underline cursor-pointer"
                >
                  Se connecter à l'espace existant
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
