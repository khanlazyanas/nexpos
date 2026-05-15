'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { Plus, Edit, Trash2, X, PackageOpen, Box, Sparkles } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal aur Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); 
  
  const [formData, setFormData] = useState({
    name: '',
    barcode_sku: '',
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
      console.error("Products lane me error:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', barcode_sku: '', price: '', stock_quantity: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: IProduct) => {
    setFormData({
      name: product.name,
      barcode_sku: product.barcode_sku,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString()
    });
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchProducts(); 
      } else {
        alert('Delete fail ho gaya!');
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          barcode_sku: formData.barcode_sku,
          price: Number(formData.price),
          stock_quantity: Number(formData.stock_quantity)
        })
      });

      if (response.ok) {
        setFormData({ name: '', barcode_sku: '', price: '', stock_quantity: '' });
        setEditingId(null);
        setIsModalOpen(false);
        fetchProducts(); 
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error("Save error:", error);
      alert('Action fail ho gaya.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-100/30">
          <td className="p-4 sm:p-6"><div className="h-5 bg-gray-200/50 rounded-lg w-3/4 animate-pulse"></div></td>
          <td className="p-4 sm:p-6"><div className="h-4 bg-gray-200/50 rounded-lg w-1/2 animate-pulse"></div></td>
          <td className="p-4 sm:p-6"><div className="h-6 bg-gray-200/50 rounded-lg w-1/3 animate-pulse"></div></td>
          <td className="p-4 sm:p-6"><div className="h-7 bg-gray-200/50 rounded-full w-24 animate-pulse"></div></td>
          <td className="p-4 sm:p-6"><div className="h-8 bg-gray-200/50 rounded-lg w-16 animate-pulse"></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 relative z-10 pb-20 lg:pb-0">
      
      {/* Header Section - Mobile Fixes Added */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 w-full">
        <div>
          <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter">
            Inventory
          </h1>
          <p className="text-gray-500 font-medium flex items-center gap-2 mt-1 sm:mt-2 text-sm sm:text-lg">
            Manage your store's products <Box size={16} className="text-emerald-500 hidden sm:inline" />
          </p>
        </div>
        
        {/* Button is now w-full on mobile, auto on desktop */}
        <button 
          onClick={openAddModal}
          className="group w-full sm:w-auto relative overflow-hidden flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
          <Plus size={20} className="relative z-10" strokeWidth={3} />
          <span className="relative z-10">Add Product</span>
        </button>
      </div>

      {/* Premium Glassmorphism Table Area */}
      <div className="bg-white/60 backdrop-blur-3xl rounded-2xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/40 border-b border-gray-100/60 text-gray-400 text-xs uppercase tracking-widest">
                <th className="p-4 sm:p-6 font-black">Product Name</th>
                <th className="p-4 sm:p-6 font-black">Barcode/SKU</th>
                <th className="p-4 sm:p-6 font-black">Price (₹)</th>
                <th className="p-4 sm:p-6 font-black">Stock Status</th>
                <th className="p-4 sm:p-6 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 sm:p-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100/50 rounded-full flex items-center justify-center mb-4">
                        <PackageOpen size={40} className="opacity-50 text-emerald-600" />
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-700 mb-1">No products found</p>
                      <p className="text-xs sm:text-sm font-medium">Click on 'Add Product' to stock your shelves.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100/30 hover:bg-white/80 transition-colors group">
                    <td className="p-4 sm:p-6 font-extrabold text-gray-800 text-base sm:text-lg">{product.name}</td>
                    <td className="p-4 sm:p-6 text-gray-400 font-bold font-mono text-xs sm:text-sm tracking-wide">{product.barcode_sku}</td>
                    <td className="p-4 sm:p-6 text-emerald-700 font-black text-base sm:text-lg">₹{product.price.toLocaleString()}</td>
                    <td className="p-4 sm:p-6">
                      <div className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider border ${
                        product.stock_quantity > 10 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                          : product.stock_quantity > 0
                            ? 'bg-amber-50 border-amber-100 text-amber-600'
                            : 'bg-rose-50 border-rose-100 text-rose-600'
                      }`}>
                        {product.stock_quantity > 0 ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current"></span>
                            {product.stock_quantity} left
                          </>
                        ) : 'Out of Stock'}
                      </div>
                    </td>
                    <td className="p-4 sm:p-6">
                      {/* Mobile Fix: Actions are always visible on mobile (opacity-100), hidden-until-hover on desktop (lg:opacity-0) */}
                      <div className="flex gap-2 justify-end opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(product)} 
                          className="p-2 sm:p-2.5 text-blue-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg sm:rounded-xl transition-all"
                        >
                          <Edit size={18} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)} 
                          className="p-2 sm:p-2.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg sm:rounded-xl transition-all"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ultra-Premium Glass Modal - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:px-4 animate-in fade-in zoom-in-95 sm:zoom-in-95 slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white/90 sm:bg-white/80 backdrop-blur-2xl rounded-t-[2rem] sm:rounded-[2.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.2)] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border-t sm:border border-white p-6 sm:p-8 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none hidden sm:block"></div>

            {/* Mobile Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>

            <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 sm:p-2.5 rounded-xl text-white shadow-lg shadow-emerald-200">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {editingId ? 'Edit Product' : 'Add Product'}
                  </h2>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5 sm:mt-1">Inventory Management</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 sm:p-2.5 bg-white border border-gray-100 hover:bg-gray-50 text-gray-500 rounded-full transition-colors shadow-sm"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 relative z-10">
              <div>
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Product Name</label>
                <input 
                  type="text" required placeholder="e.g. Mechanical Keyboard"
                  className="w-full bg-white/50 border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium shadow-sm text-sm sm:text-base"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Barcode / SKU</label>
                <input 
                  type="text" required placeholder="e.g. KEY-MEC-001"
                  className="w-full bg-white/50 border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300 placeholder:font-medium shadow-sm text-sm sm:text-base"
                  value={formData.barcode_sku} onChange={(e) => setFormData({...formData, barcode_sku: e.target.value})}
                />
              </div>
              
              {/* Mobile Fix: Grid changes to 1 column on extra small screens, 2 on sm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                    <input 
                      type="number" required min="0" placeholder="0"
                      className="w-full bg-white/50 border border-gray-200 rounded-xl sm:rounded-2xl pl-8 p-3.5 sm:p-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 shadow-sm text-sm sm:text-base"
                      value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 sm:mb-2 ml-1">Stock Qty</label>
                  <input 
                    type="number" required min="0" placeholder="0"
                    className="w-full bg-white/50 border border-gray-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-gray-800 shadow-sm text-sm sm:text-base"
                    value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="w-full sm:flex-1 py-3.5 sm:py-4 px-4 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 font-bold rounded-xl sm:rounded-2xl transition-all shadow-sm order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="group w-full sm:flex-1 relative overflow-hidden py-3.5 sm:py-4 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl sm:rounded-2xl transition-all shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 active:scale-[0.98]"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                  <span className="relative z-10">
                    {isSubmitting ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}