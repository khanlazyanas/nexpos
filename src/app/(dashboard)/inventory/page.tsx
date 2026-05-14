'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal aur Form ke states
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

  // Naya product save karne ka function
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
        // Form clear karein aur modal band karein
        setFormData({ name: '', barcode_sku: '', price: '', stock_quantity: '' });
        setIsModalOpen(false);
        // Table ko update karne ke liye data wapas fetch karein
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

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">Barcode/SKU</th>
                <th className="p-4 font-semibold">Price (₹)</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No products found. Please add a new product.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-gray-500 text-sm">{product.barcode_sku}</td>
                    <td className="p-4 text-gray-800 font-semibold">₹{product.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock_quantity > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="p-4 flex gap-3 text-gray-400">
                      <button className="hover:text-blue-500 transition-colors"><Edit size={18} /></button>
                      <button className="hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Popup Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" required 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barcode / SKU</label>
                <input 
                  type="text" required 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.barcode_sku} onChange={(e) => setFormData({...formData, barcode_sku: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
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