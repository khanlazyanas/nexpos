'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { Plus, Edit, Trash2, X, PackageOpen, Box } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
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
        setIsModalOpen(false);
        fetchProducts(); 
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Kuch galat ho gaya!');
      }
    } catch (error) {
      console.error("Save error:", error);
      alert('Product save nahi ho paya.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Premium Skeleton for Table Rows
  const TableSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-gray-100/50">
          <td className="p-4"><div className="h-5 bg-gray-200/60 rounded-md w-3/4 animate-pulse"></div></td>
          <td className="p-4"><div className="h-4 bg-gray-200/60 rounded-md w-1/2 animate-pulse"></div></td>
          <td className="p-4"><div className="h-5 bg-gray-200/60 rounded-md w-1/3 animate-pulse"></div></td>
          <td className="p-4"><div className="h-6 bg-gray-200/60 rounded-full w-24 animate-pulse"></div></td>
          <td className="p-4"><div className="h-6 bg-gray-200/60 rounded-md w-16 animate-pulse"></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
            Manage your store's products and stock <Box size={16} className="text-emerald-500" />
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 font-semibold"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Premium Glassmorphism Table Section */}
      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-5 font-bold">Product Name</th>
                <th className="p-5 font-bold">Barcode/SKU</th>
                <th className="p-5 font-bold">Price (₹)</th>
                <th className="p-5 font-bold">Stock Status</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <PackageOpen size={48} className="mb-3 opacity-50" />
                      <p className="text-lg font-medium text-gray-600">No products found</p>
                      <p className="text-sm">Click on 'Add Product' to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50/50 hover:bg-white/60 transition-colors group">
                    <td className="p-5 font-bold text-gray-800">{product.name}</td>
                    <td className="p-5 text-gray-500 font-medium font-mono text-sm">{product.barcode_sku}</td>
                    <td className="p-5 text-gray-900 font-black">₹{product.price.toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        product.stock_quantity > 10 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : product.stock_quantity > 0
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Glass Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 p-6 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">Add Product</h2>
                <p className="text-sm text-gray-500 font-medium">Add a new item to your inventory</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Product Name</label>
                <input 
                  type="text" required placeholder="e.g. Logitech Wireless Mouse"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Barcode / SKU</label>
                <input 
                  type="text" required placeholder="e.g. LOGI-M-001"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                  value={formData.barcode_sku} onChange={(e) => setFormData({...formData, barcode_sku: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Price (₹)</label>
                  <input 
                    type="number" required min="0" placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800"
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Stock Quantity</label>
                  <input 
                    type="number" required min="0" placeholder="0"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800"
                    value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}