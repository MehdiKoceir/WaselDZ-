import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Tag, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Boxes,
  Warehouse,
  Coins,
  TrendingUp,
  SlidersHorizontal,
  Trash2,
  Edit3,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDZD } from '../../data/algeriaData';
import { Product } from '../../types';
import { StockManagementWidget } from './StockManagementWidget';

export const ProductsView: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    updateProductStock, 
    adjustStock, 
    deleteProduct,
    showConfirmDialog 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSubView, setActiveSubView] = useState<'hub' | 'grid'>('hub');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quick adjust modal state
  const [adjustTargetProduct, setAdjustTargetProduct] = useState<Product | null>(null);
  const [modalStockValue, setModalStockValue] = useState<number>(0);
  const [modalMinAlertValue, setModalMinAlertValue] = useState<number>(5);
  const [modalWarehouseValue, setModalWarehouseValue] = useState<string>('');
  const [modalReasonValue, setModalReasonValue] = useState<string>('');

  // Form states for Add / Edit
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState<number>(3500);
  const [formCostPrice, setFormCostPrice] = useState<number>(2000);
  const [formStock, setFormStock] = useState<number>(20);
  const [formMinAlert, setFormMinAlert] = useState<number>(5);
  const [formWarehouse, setFormWarehouse] = useState('Dépôt Alger (Hub Principal)');
  const [formCategory, setFormCategory] = useState('Prêt-à-porter');
  const [formImageUrl, setFormImageUrl] = useState('');

  const filteredProducts = products.filter(p => {
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      p.sku.toLowerCase().includes(q) || 
      (p.warehouseLocation || '').toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleOpenAddModal = () => {
    setFormName('');
    setFormSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice(3500);
    setFormCostPrice(2200);
    setFormStock(25);
    setFormMinAlert(5);
    setFormWarehouse('Dépôt Alger (Hub Principal)');
    setFormCategory('Prêt-à-porter');
    setFormImageUrl('');
    setIsAddProductOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormPrice(prod.price);
    setFormCostPrice(prod.costPrice || 0);
    setFormStock(prod.stock);
    setFormMinAlert(prod.minStockAlert || 5);
    setFormWarehouse(prod.warehouseLocation || 'Dépôt Alger');
    setFormCategory(prod.category);
    setFormImageUrl(prod.imageUrl || '');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addProduct({
      name: formName.trim(),
      sku: formSku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: Number(formPrice),
      costPrice: Number(formCostPrice),
      stock: Number(formStock),
      minStockAlert: Number(formMinAlert),
      warehouseLocation: formWarehouse.trim(),
      category: formCategory.trim(),
      imageUrl: formImageUrl.trim() || undefined,
    });

    setIsAddProductOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !formName.trim()) return;

    updateProduct(editingProduct.id, {
      name: formName.trim(),
      sku: formSku.trim(),
      price: Number(formPrice),
      costPrice: Number(formCostPrice),
      minStockAlert: Number(formMinAlert),
      warehouseLocation: formWarehouse.trim(),
      category: formCategory.trim(),
      imageUrl: formImageUrl.trim() || undefined,
    });

    // If stock changed
    if (formStock !== editingProduct.stock) {
      updateProductStock(editingProduct.id, Number(formStock), 'Mise à jour fiche produit');
    }

    setEditingProduct(null);
  };

  const handleDeleteClick = (prod: Product) => {
    showConfirmDialog({
      title: 'Supprimer ce produit ?',
      message: `Êtes-vous certain de vouloir retirer "${prod.name}" (${prod.sku}) de votre catalogue ?`,
      confirmLabel: 'Supprimer définitivement',
      isDestructive: true,
      onConfirm: () => deleteProduct(prod.id),
    });
  };

  const handleOpenAdjustModal = (prod: Product) => {
    setAdjustTargetProduct(prod);
    setModalStockValue(prod.stock);
    setModalMinAlertValue(prod.minStockAlert || 5);
    setModalWarehouseValue(prod.warehouseLocation || '');
    setModalReasonValue('');
  };

  const handleSaveModalAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetProduct) return;

    updateProduct(adjustTargetProduct.id, {
      minStockAlert: Number(modalMinAlertValue),
      warehouseLocation: modalWarehouseValue.trim(),
    });

    if (modalStockValue !== adjustTargetProduct.stock) {
      updateProductStock(
        adjustTargetProduct.id, 
        Number(modalStockValue), 
        modalReasonValue.trim() || 'Ajustement rapide depuis la grille produit'
      );
    }

    setAdjustTargetProduct(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Sub-view Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Gestion des Stocks & Catalogue
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Suivi en temps réel de la disponibilité, seuils de réapprovisionnement et valorisation en Dinars (DZD)
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSubView('hub')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubView === 'hub'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Boxes className="w-3.5 h-3.5" />
              <span>Hub Télémétrie</span>
            </button>
            <button
              onClick={() => setActiveSubView('grid')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubView === 'grid'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Fiches Produits ({products.length})</span>
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nouvel Article</span>
          </button>
        </div>
      </div>

      {/* Main Stock Management Widget */}
      {activeSubView === 'hub' && (
        <StockManagementWidget onViewCatalog={() => setActiveSubView('grid')} />
      )}

      {/* Grid View & Catalog Cards */}
      <div className="space-y-4">
        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Rechercher par nom d'article, référence SKU ou dépôt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-xs text-slate-500 whitespace-nowrap font-medium">
              {filteredProducts.length} article(s)
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => {
            const threshold = product.minStockAlert || 5;
            const isOutOfStock = product.stock === 0;
            const isLowStock = product.stock > 0 && product.stock <= threshold;
            const unitMargin = product.costPrice ? (product.price - product.costPrice) : 0;
            const marginPct = product.costPrice ? Math.round((unitMargin / product.price) * 100) : 0;
            const progressPct = Math.min(100, Math.round((product.stock / (threshold * 3)) * 100));

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all ${
                  isOutOfStock 
                    ? 'border-red-300 ring-1 ring-red-100' 
                    : isLowStock 
                    ? 'border-amber-300 ring-1 ring-amber-100' 
                    : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono text-slate-400">
                        {product.sku}
                      </span>
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        title="Modifier la fiche produit"
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        title="Supprimer ce produit"
                        className="p-1 hover:bg-red-50 text-slate-300 hover:text-red-600 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Title & Image */}
                  <div className="mt-3 flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Boxes className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {product.name}
                      </h3>
                      {product.warehouseLocation && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                          <Warehouse className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{product.warehouseLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Margins */}
                  <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Prix public :</span>
                      <span className="text-base font-black text-blue-600 font-mono">
                        {formatDZD(product.price)}
                      </span>
                    </div>
                    {product.costPrice ? (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                        <span>Coût : {formatDZD(product.costPrice)}</span>
                        <span className="text-emerald-700 font-semibold font-mono">
                          Marge : +{formatDZD(unitMargin)} ({marginPct}%)
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Stock Gauge & Live Level */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Disponibilité :</span>
                      <span className={`font-mono font-black ${
                        isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-slate-900'
                      }`}>
                        {product.stock} unités
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(6, progressPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Stock Status Pill */}
                  <div className="mt-2.5">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 w-full justify-center">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        Rupture immédiate de stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 w-full justify-center">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        Alerte Stock Faible (≤ {threshold})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 w-full justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Stock Optimal (&gt; {threshold})
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Instant Restock Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Réassort :
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustStock(product.id, 5)}
                      className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, 10)}
                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => adjustStock(product.id, -1)}
                      disabled={product.stock === 0}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => handleOpenAdjustModal(product)}
                      title="Modifier les seuils et quantités"
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Ajouter un article au catalogue WaselDZ</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Désignation du produit *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Abaya Dubaï Soie de Médine"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Référence SKU
                  </label>
                  <input
                    type="text"
                    placeholder="ex: CLOTH-009"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Robes, High-Tech, Chaussures..."
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix de vente client (DZD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix de revient / Achat (DZD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantité initiale en stock *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seuil d'alerte stock faible
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMinAlert}
                    onChange={(e) => setFormMinAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="ex: 5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emplacement / Dépôt logistique
                </label>
                <input
                  type="text"
                  value={formWarehouse}
                  onChange={(e) => setFormWarehouse(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Dépôt Alger (Hub Principal)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL de l'image (optionnelle)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Enregistrer l'article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Modifier la fiche article</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Désignation du produit *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Référence SKU
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix de vente (DZD) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="50"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix de revient (DZD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock actuel *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seuil alerte stock faible
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formMinAlert}
                    onChange={(e) => setFormMinAlert(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emplacement / Dépôt logistique
                </label>
                <input
                  type="text"
                  value={formWarehouse}
                  onChange={(e) => setFormWarehouse(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Image
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Modal from Grid Cards */}
      {adjustTargetProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Ajuster le stock & seuil</h3>
                <p className="text-[11px] text-slate-400">{adjustTargetProduct.name}</p>
              </div>
              <button 
                onClick={() => setAdjustTargetProduct(null)} 
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModalAdjust} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nouveau niveau de stock en rayon *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={modalStockValue}
                  onChange={(e) => setModalStockValue(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seuil d'alerte stock critique
                </label>
                <input
                  type="number"
                  min="1"
                  value={modalMinAlertValue}
                  onChange={(e) => setModalMinAlertValue(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Emplacement dépôt
                </label>
                <input
                  type="text"
                  value={modalWarehouseValue}
                  onChange={(e) => setModalWarehouseValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Motif de l'opération
                </label>
                <input
                  type="text"
                  value={modalReasonValue}
                  onChange={(e) => setModalReasonValue(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Réception fournisseur, comptage physique..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustTargetProduct(null)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
