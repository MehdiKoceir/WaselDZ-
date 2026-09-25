import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight, 
  History, 
  SlidersHorizontal, 
  Layers, 
  DollarSign, 
  Warehouse, 
  RefreshCw, 
  TrendingDown, 
  Sparkles,
  ExternalLink,
  Filter,
  Check,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';
import { Product, StockMovement } from '../../types';

export const StockManagementWidget: React.FC<{ onViewCatalog?: () => void }> = ({ onViewCatalog }) => {
  const { 
    products, 
    stockMovements, 
    adjustStock, 
    updateProductStock, 
    updateProduct, 
    setDashboardTab, 
    showToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'critical' | 'out' | 'low' | 'healthy'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'inventory' | 'movements'>('inventory');

  // Modal for fine-tuning stock
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [newStockInput, setNewStockInput] = useState<number>(0);
  const [minAlertInput, setMinAlertInput] = useState<number>(5);
  const [warehouseLocationInput, setWarehouseLocationInput] = useState<string>('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, [products]);

  // Inventory KPI calculations
  const totalProductsCount = products.length;
  const outOfStockCount = useMemo(() => products.filter(p => p.stock === 0).length, [products]);
  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock > 0 && p.stock <= (p.minStockAlert || 5)).length;
  }, [products]);
  const healthyStockCount = totalProductsCount - outOfStockCount - lowStockCount;

  const totalPhysicalUnits = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock, 0);
  }, [products]);

  const totalStockValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  }, [products]);

  const availabilityRate = totalProductsCount > 0 
    ? Math.round(((totalProductsCount - outOfStockCount) / totalProductsCount) * 100) 
    : 100;

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        p.name.toLowerCase().includes(q) || 
        p.sku.toLowerCase().includes(q) || 
        (p.warehouseLocation || '').toLowerCase().includes(q);

      const threshold = p.minStockAlert || 5;
      const isOut = p.stock === 0;
      const isLow = p.stock > 0 && p.stock <= threshold;
      const isHealthy = p.stock > threshold;

      let matchesStatus = true;
      if (statusFilter === 'critical') matchesStatus = isOut || isLow;
      else if (statusFilter === 'out') matchesStatus = isOut;
      else if (statusFilter === 'low') matchesStatus = isLow;
      else if (statusFilter === 'healthy') matchesStatus = isHealthy;

      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const handleOpenAdjustModal = (prod: Product) => {
    setAdjustModalProduct(prod);
    setNewStockInput(prod.stock);
    setMinAlertInput(prod.minStockAlert || 5);
    setWarehouseLocationInput(prod.warehouseLocation || '');
    setAdjustmentReason('');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProduct) return;

    // Update threshold & warehouse if changed
    updateProduct(adjustModalProduct.id, {
      minStockAlert: Number(minAlertInput),
      warehouseLocation: warehouseLocationInput.trim(),
    });

    // Update stock if quantity changed
    if (newStockInput !== adjustModalProduct.stock) {
      updateProductStock(
        adjustModalProduct.id, 
        Number(newStockInput), 
        adjustmentReason.trim() || 'Ajustement manuel depuis le tableau de bord'
      );
    }

    setAdjustModalProduct(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/70 via-white to-blue-50/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Gestion des Stocks en Temps Réel
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveillance de disponibilité, seuils d'alerte et réassort instantané de vos produits
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inventory' 
                  ? 'bg-white text-blue-600 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Inventaire ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'movements' 
                  ? 'bg-white text-blue-600 shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Mouvements ({stockMovements.length})</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (onViewCatalog) onViewCatalog();
              else setDashboardTab('products');
            }}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Catalogue</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y lg:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/40">
        {/* Availability Rate */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Disponibilité Globale
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
              {availabilityRate}%
            </span>
            <span className="text-[11px] font-medium text-emerald-600">
              {healthyStockCount}/{totalProductsCount} en rayon
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${availabilityRate}%` }}
            />
          </div>
        </div>

        {/* Out of Stock Alert */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'out' ? 'all' : 'out')}
          className={`p-4 sm:p-5 cursor-pointer transition-colors ${
            statusFilter === 'out' ? 'bg-red-50/80' : 'hover:bg-slate-100/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              En Rupture
            </span>
            {outOfStockCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl sm:text-2xl font-black font-mono ${outOfStockCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {outOfStockCount}
            </span>
            <span className="text-[11px] text-slate-500">article(s) à 0</span>
          </div>
          <span className="text-[10px] text-red-600 font-medium block mt-1">
            {outOfStockCount > 0 ? 'Réassort urgent requis' : 'Aucune rupture critique'}
          </span>
        </div>

        {/* Low Stock Alert */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'low' ? 'all' : 'low')}
          className={`p-4 sm:p-5 cursor-pointer transition-colors ${
            statusFilter === 'low' ? 'bg-amber-50/80' : 'hover:bg-slate-100/60'
          }`}
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Stock Faible
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl sm:text-2xl font-black font-mono ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {lowStockCount}
            </span>
            <span className="text-[11px] text-slate-500">≤ seuil alerte</span>
          </div>
          <span className="text-[10px] text-amber-600 font-medium block mt-1">
            {lowStockCount > 0 ? 'À commander sous peu' : 'Niveaux sous contrôle'}
          </span>
        </div>

        {/* Total Physical Units */}
        <div className="p-4 sm:p-5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Unités en Dépôt
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
              {totalPhysicalUnits}
            </span>
            <span className="text-[11px] text-slate-500">articles physiques</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">
            Répartis sur vos entrepôts
          </span>
        </div>

        {/* Total Stock Valuation */}
        <div className="p-4 sm:p-5 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Valeur du Stock
          </span>
          <div className="mt-1">
            <span className="text-lg sm:text-xl font-black text-emerald-700 font-mono block">
              {formatDZD(totalStockValuation)}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block mt-1">
            Actif circulant marchand
          </span>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Quick Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par article, SKU, emplacement dépôt..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === 'all' 
                    ? 'bg-slate-900 text-white font-bold' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tous ({totalProductsCount})
              </button>

              <button
                onClick={() => setStatusFilter('critical')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  statusFilter === 'critical' 
                    ? 'bg-amber-600 text-white font-bold' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Alertes ({outOfStockCount + lowStockCount})</span>
              </button>

              <button
                onClick={() => setStatusFilter('out')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === 'out' 
                    ? 'bg-red-600 text-white font-bold' 
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
              >
                Rupture ({outOfStockCount})
              </button>

              <button
                onClick={() => setStatusFilter('healthy')}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === 'healthy' 
                    ? 'bg-emerald-600 text-white font-bold' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                Optimal ({healthyStockCount})
              </button>

              {/* Category selector */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table of Products Stock */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Article & Référence</th>
                  <th className="py-3 px-3">Prix Unitaire</th>
                  <th className="py-3 px-3">Disponibilité Actuelle</th>
                  <th className="py-3 px-3">Statut & Seuil</th>
                  <th className="py-3 px-3">Valeur Stock</th>
                  <th className="py-3 px-4 text-right">Ajustement Immédiat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Aucun article ne correspond aux filtres de stock actuels.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => {
                    const threshold = product.minStockAlert || 5;
                    const isOut = product.stock === 0;
                    const isLow = product.stock > 0 && product.stock <= threshold;
                    const progressPercent = Math.min(100, Math.round((product.stock / (threshold * 3)) * 100));

                    return (
                      <tr 
                        key={product.id} 
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isOut ? 'bg-red-50/20' : isLow ? 'bg-amber-50/15' : ''
                        }`}
                      >
                        {/* Article Info */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                              {product.imageUrl ? (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <Boxes className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">
                                {product.name}
                              </span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="font-mono text-[10px] text-slate-400">
                                  {product.sku}
                                </span>
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="text-[10px] text-slate-500">
                                  {product.category}
                                </span>
                              </div>
                              {product.warehouseLocation && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                                  <Warehouse className="w-3 h-3 text-slate-300" />
                                  <span>{product.warehouseLocation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Unit Price */}
                        <td className="py-3 px-3 font-medium text-slate-800 font-mono">
                          {formatDZD(product.price)}
                        </td>

                        {/* Availability Bar & Quantity */}
                        <td className="py-3 px-3 min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex items-baseline justify-between text-xs">
                              <span className="font-black text-slate-900 font-mono text-sm">
                                {product.stock}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                unité(s)
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isOut ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.max(4, progressPercent)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status badge & threshold */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <XCircle className="w-3.5 h-3.5 text-red-600" />
                              Rupture de Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              Stock Faible (≤ {threshold})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              Optimal (&gt; {threshold})
                            </span>
                          )}
                        </td>

                        {/* Valuation */}
                        <td className="py-3 px-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {formatDZD(product.stock * product.price)}
                        </td>

                        {/* Instant Stock Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            {/* Fast +5 */}
                            <button
                              onClick={() => adjustStock(product.id, 5)}
                              title="Réapprovisionner rapidement +5 unités"
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              +5
                            </button>

                            {/* Fast +10 */}
                            <button
                              onClick={() => adjustStock(product.id, 10)}
                              title="Réapprovisionner rapidement +10 unités"
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              +10
                            </button>

                            {/* Fast -1 */}
                            <button
                              onClick={() => adjustStock(product.id, -1)}
                              disabled={product.stock === 0}
                              title="Déstocker -1 unité"
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              -1
                            </button>

                            {/* Fine adjust modal button */}
                            <button
                              onClick={() => handleOpenAdjustModal(product)}
                              title="Définir un stock précis ou ajuster le seuil d'alerte"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer ml-1"
                            >
                              <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Notice footer */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Décrémentation automatique en direct :</strong> chaque commande validée pour livraison déduit automatiquement les quantités commandées et alerte le commerçant en cas de stock critique.
              </span>
            </div>
            <button
              onClick={() => {
                if (onViewCatalog) onViewCatalog();
                else setDashboardTab('products');
              }}
              className="text-xs font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
            >
              Ajouter un nouveau produit →
            </button>
          </div>

        </div>
      ) : (
        /* Stock Movements Ledger Tab */
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Journal des Mouvements de Stock
              </h4>
              <p className="text-xs text-slate-500">
                Traçabilité horodatée de toutes les entrées (réassorts), sorties (commandes livrées) et ajustements
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
              {stockMovements.length} opérations enregistrées
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-3">Article Concerné</th>
                  <th className="py-3 px-3">Type Mouvement</th>
                  <th className="py-3 px-3">Quantité</th>
                  <th className="py-3 px-3">Stock Résultant</th>
                  <th className="py-3 px-4">Motif & Référence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map(mov => {
                  const isIn = mov.type === 'in' || mov.quantityDelta > 0;
                  const isOut = mov.type === 'out' || mov.quantityDelta < 0;
                  const dateFormatted = new Date(mov.timestamp).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {mov.productName}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isIn ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                            Entrée (Réassort)
                          </span>
                        ) : isOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <ArrowDownRight className="w-3 h-3 text-blue-600" />
                            Sortie (Expédition)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                            <RefreshCw className="w-3 h-3 text-slate-500" />
                            Ajustement
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold whitespace-nowrap">
                        <span className={isIn ? 'text-emerald-700' : 'text-slate-900'}>
                          {mov.quantityDelta > 0 ? `+${mov.quantityDelta}` : mov.quantityDelta}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-black text-slate-800">
                        {mov.newStock} unités
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {mov.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjustment & Restock Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Ajuster le Stock & Emplacement</h3>
                <p className="text-[11px] text-slate-400">{adjustModalProduct.name}</p>
              </div>
              <button 
                onClick={() => setAdjustModalProduct(null)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-6 space-y-4">
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Stock actuel en rayon :</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">
                    {adjustModalProduct.stock} unités
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Référence SKU :</span>
                  <span className="font-mono text-slate-700 font-bold">
                    {adjustModalProduct.sku}
                  </span>
                </div>
              </div>

              {/* Exact Stock Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nouveau stock disponible en entrepôt *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    required
                    min="0"
                    value={newStockInput}
                    onChange={(e) => setNewStockInput(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold text-slate-900"
                  />
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setNewStockInput(prev => prev + 10)}
                      className="px-2.5 py-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-xs hover:bg-emerald-100 cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewStockInput(prev => prev + 50)}
                      className="px-2.5 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs hover:bg-blue-100 cursor-pointer"
                    >
                      +50
                    </button>
                  </div>
                </div>
              </div>

              {/* Alert Threshold */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seuil d'alerte critique (Stock faible)
                </label>
                <input
                  type="number"
                  min="1"
                  value={minAlertInput}
                  onChange={(e) => setMinAlertInput(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="ex: 5 unités"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Une alerte ambre sera déclenchée dès que le stock descend à ce niveau ou en-dessous.
                </p>
              </div>

              {/* Warehouse Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dépôt / Emplacement de stockage
                </label>
                <input
                  type="text"
                  value={warehouseLocationInput}
                  onChange={(e) => setWarehouseLocationInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Dépôt Alger Centre (Étagère B3)"
                />
              </div>

              {/* Reason for adjustment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motif de l'opération (pour la traçabilité)
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Réception arrivage fournisseur, inventaire annuel..."
                />
              </div>

              {/* Modal buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalProduct(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Enregistrer l'ajustement
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
