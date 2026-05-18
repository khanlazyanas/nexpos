'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit3, Trash2, AlertTriangle, 
  ArrowUpRight, Barcode, Loader2, ArrowDownCircle, 
  ArrowUpCircle, ShoppingBag, Layers, X, Wand2, CheckCircle2
} from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal & Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // ✏️ Naya Edit Modal State
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null); // Track Active Product
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    barcode_sku: '',
    category: 'General', 
    price: '',
    stock_quantity: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🪄 Auto-Generate SKU
  const handleGenerateSKU = () => {
    const randomSKU = 'PROD-' + Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, barcode_sku: randomSKU });
  };

  // ➕ Add Modal Open Handler (Clears previous values)
  const openAddModal = () => {
    setFormData({ name: '', barcode_sku: '', category: 'General', price: '', stock_quantity: '' });
    setIsAddModalOpen(true);
  };

  // ✏️ Edit Modal Open Handler (Populates item values)
  const openEditModal = (product: any) => {
    setSelectedProductId(product._id);
    setFormData({
      name: product.name,
      barcode_sku: product.barcode_sku,
      category: product.category || 'General',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString()
    });
    setIsEditModalOpen(true);
  };

  // 🚀 Submit Naya Product (POST API Call)
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          barcode_sku: formData.barcode_sku,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity) || 0
        })
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: '', barcode_sku: '', category: 'General', price: '', stock_quantity: '' });
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Product add karne me error aayi');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 💾 Submit Edited Product (PUT API Call)
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${selectedProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          barcode_sku: formData.barcode_sku,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity)
        })
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setSelectedProductId(null);
        setFormData({ name: '', barcode_sku: '', category: 'General', price: '', stock_quantity: '' });
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.error || 'Product update fail ho gaya');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🗑️ Delete Product Handler
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Kya aap sach me "${name}" ko inventory se delete karna chahte hain?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchProducts(); // Refresh Table
      } else {
        alert('Product delete karne me koi dikkat aayi.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🧮 Stats Calculation
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  const outOfStockItems = products.filter(p => p.stock_quantity === 0).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.barcode_sku && p.barcode_sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'Low Stock') return matchesSearch && p.stock_quantity <= 10 && p.stock_quantity > 0;
    if (filterStatus === 'Out of Stock') return matchesSearch && p.stock_quantity === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 lg:pb-10 relative">
      
      {/* 1. Pro Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-800 bg-clip-text text-transparent tracking-tighter">
            Inventory Pro
          </h1>
          <p className="text-gray-500 font-medium flex items-center gap-2 mt-2">
            Manage your stock with precision and real-time insights <Layers size={16} className="text-emerald-500" />
          </p>
        </div>

        <button 
          onClick={openAddModal}
          className="group relative overflow-hidden flex items-center gap-3 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 hover:bg-emerald-700"
        >
           <Plus size={20} strokeWidth={3} />
           <span>Add New Product</span>
        </button>
      </div>

      {/* 2. Advanced Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Products" value={totalItems} icon={<ShoppingBag />} color="blue" />
        <StatCard title="Inventory Value" value={`₹${totalValue.toLocaleString()}`} icon={<ArrowUpRight />} color="emerald" />
        <StatCard title="Low Stock" value={lowStockItems} icon={<AlertTriangle />} color="orange" highlight={lowStockItems > 0} />
        <StatCard title="Out of Stock" value={outOfStockItems} icon={<Trash2 />} color="rose" highlight={outOfStockItems > 0} />
      </div>

      {/* 3. Search & Filters Hub */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-4 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by product name or SKU code..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all border ${
                filterStatus === status 
                ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. The Inventory Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest">
                <th className="px-8 py-6">Product Details</th>
                <th className="px-8 py-6">SKU / Barcode</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6">Stock Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500" size={40} />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400 font-medium">
                    No products found. Add a new product to get started!
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-emerald-500 transition-all border border-transparent group-hover:border-emerald-100">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium">Updated just now</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">SKU</span>
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-fit">
                        <Barcode size={14} className="text-emerald-500" />
                        {product.barcode_sku || 'NO-SKU'}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-semibold text-gray-600">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs">{product.category || 'General'}</span>
                  </td>
                  <td className="px-8 py-6 font-black text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <StockBadge quantity={product.stock_quantity} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* ✏️ Trigger Edit Modal */}
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm cursor-pointer"
                      >
                        <Edit3 size={18} />
                      </button>
                      {/* 🗑️ Trigger Delete Function */}
                      <button 
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-900">Add New Product</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddProduct} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                <input type="text" required placeholder="e.g. Wireless Mouse" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                  <input type="number" required min="0" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Initial Stock</label>
                  <input type="number" required min="0" placeholder="0" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                  <span>Barcode / SKU Code</span>
                  <button type="button" onClick={handleGenerateSKU} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 normal-case tracking-normal font-bold"><Wand2 size={12} /> Auto Generate</button>
                </label>
                <input type="text" required placeholder="Scan barcode or type SKU..." value={formData.barcode_sku} onChange={(e) => setFormData({...formData, barcode_sku: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-mono font-bold text-gray-800" />
              </div>
              <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-3.5 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 EDIT PRODUCT MODAL (Popup Form) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-black text-gray-950">Edit Product Details</h2>
              <button onClick={() => { setIsEditModalOpen(false); setSelectedProductId(null); }} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditProduct} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                  <input type="number" required min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Stock</label>
                  <input type="number" required min="0" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-800" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                  <span>Barcode / SKU Code</span>
                  <button type="button" onClick={handleGenerateSKU} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 normal-case tracking-normal font-bold"><Wand2 size={12} /> Re-Generate</button>
                </label>
                <input type="text" required value={formData.barcode_sku} onChange={(e) => setFormData({...formData, barcode_sku: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-mono font-bold text-gray-800" />
              </div>
              <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setSelectedProductId(null); }} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-3.5 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-100 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// 🎖️ Helper: Stock Badge Component
function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider border border-rose-100">
        <ArrowDownCircle size={12} /> Out of Stock
      </div>
    );
  }
  if (quantity <= 10) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-100">
        <AlertTriangle size={12} /> Low Stock: {quantity}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
      <ArrowUpCircle size={12} /> In Stock: {quantity}
    </div>
  );
}

// 📊 Helper: Stat Card Component
function StatCard({ title, value, icon, color, highlight = false }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md ${highlight ? 'ring-2 ring-offset-2 ring-' + color + '-400' : ''}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${colors[color]} border`}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{value}</h3>
        </div>
      </div>
    </div>
  );
}