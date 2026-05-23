'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit3, Trash2, AlertTriangle, 
  ArrowUpRight, Barcode, Loader2, ArrowDownCircle, 
  ArrowUpCircle, ShoppingBag, Layers, X, Wand2, CheckCircle2,
  Printer, Tag // 🛠️ Naye icons Barcode print ke liye
} from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal & Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🚀 FEATURE 4: BARCODE PRINT STATE
  const [printItem, setPrintItem] = useState<any>(null);

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

  const handleGenerateSKU = () => {
    const randomSKU = 'PROD-' + Math.floor(1000 + Math.random() * 9000);
    setFormData({ ...formData, barcode_sku: randomSKU });
  };

  const openAddModal = () => {
    setFormData({ name: '', barcode_sku: '', category: 'General', price: '', stock_quantity: '' });
    setIsAddModalOpen(true);
  };

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
        alert(data.error || 'Failed to add product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        alert(data.error || 'Failed to update product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
      else alert('Failed to delete product.');
    } catch (error) {
      console.error(error);
    }
  };

  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  const outOfStockItems = products.filter(p => p.stock_quantity === 0).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.barcode_sku && p.barcode_sku.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus === 'Low Stock') return matchesSearch && p.stock_quantity <= 10 && p.stock_quantity > 0;
    if (filterStatus === 'Out of Stock') return matchesSearch && p.stock_quantity === 0;
    if (filterStatus === 'In Stock') return matchesSearch && p.stock_quantity > 10;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 lg:pb-10 relative z-10">
      
      {/* SaaS Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse duration-[3000ms]"></div>

      {/* 1. Pro Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            Inventory Central
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-2 text-sm md:text-base">
            Manage your stock with precision and real-time insights <Layers size={18} className="text-emerald-500" />
          </p>
        </div>

        <button 
          onClick={openAddModal}
          className="group relative overflow-hidden flex items-center justify-center gap-2 w-full md:w-auto bg-gray-900 text-white hover:bg-emerald-600 px-8 py-4 rounded-2xl font-black shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-95 hover:shadow-[0_12px_25px_rgba(16,185,129,0.3)]"
        >
           <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
           <Plus size={20} strokeWidth={3} className="relative z-10" />
           <span className="relative z-10 tracking-widest uppercase text-xs">New Product</span>
        </button>
      </div>

      {/* 2. Advanced Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Products" value={totalItems} icon={<ShoppingBag />} theme="blue" />
        <StatCard title="Inventory Value" value={`₹${totalValue.toLocaleString()}`} icon={<ArrowUpRight />} theme="emerald" />
        <StatCard title="Low Stock" value={lowStockItems} icon={<AlertTriangle />} theme="orange" highlight={lowStockItems > 0} />
        <StatCard title="Out of Stock" value={outOfStockItems} icon={<Trash2 />} theme="rose" highlight={outOfStockItems > 0} />
      </div>

      {/* 3. Search & Filters Hub */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow group">
          <div className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by product name or SKU code..." 
            className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-xl border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar items-center">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
            <button 
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] whitespace-nowrap transition-all border ${
                filterStatus === status 
                ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                : 'bg-white/60 backdrop-blur-md text-gray-500 border-white hover:border-emerald-200 hover:text-emerald-600 shadow-sm'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. The Inventory Table */}
      <div className="bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Product Details</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">SKU / Barcode</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Stock Status</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={40} />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Inventory...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center text-gray-400">
                    <Package size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-sm">No products found. Add a new product to get started!</p>
                  </td>
                </tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-white transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors border border-gray-100 group-hover:border-emerald-100">
                        <Package size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Updated recently</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 w-fit">
                      <Barcode size={14} className="text-emerald-500" />
                      {product.barcode_sku || 'NO-SKU'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600">
                      {product.category || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-gray-900 text-base">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <StockBadge quantity={product.stock_quantity} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      
                      {/* 🚀 NEW: PRINT BARCODE BUTTON */}
                      <button 
                        onClick={() => setPrintItem(product)}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                        title="Print Barcode Label"
                      >
                        <Printer size={16} strokeWidth={2.5} />
                      </button>

                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
                        title="Edit Product"
                      >
                        <Edit3 size={16} strokeWidth={2.5} />
                      </button>

                      <button 
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                        className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm active:scale-95"
                        title="Delete Product"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 BARCODE PRINT MODAL */}
      {printItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          {/* Print specific CSS */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print { 
              body * { visibility: hidden; } 
              #barcode-sticker, #barcode-sticker * { visibility: visible; } 
              #barcode-sticker { position: absolute; left: 0; top: 0; width: 50mm; height: 30mm; padding: 2mm; margin: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; border: none !important; box-shadow: none !important; } 
              .no-print { display: none !important; } 
            }
          `}} />

          <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 no-print border-b border-gray-100 pb-4">
              <h3 className="font-black text-xl flex items-center gap-2 text-gray-900"><Tag size={20} className="text-emerald-500"/> Print Label</h3>
              <button onClick={() => setPrintItem(null)} className="p-2 bg-white hover:bg-rose-50 border border-gray-100 text-gray-400 hover:text-rose-500 rounded-full transition-colors shadow-sm"><X size={18} strokeWidth={3}/></button>
            </div>

            {/* 🔥 ACTUAL PRINTABLE STICKER AREA */}
            <div id="barcode-sticker" className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center mx-auto w-[60mm] h-[40mm] shadow-inner">
              <p className="text-[10px] font-black text-gray-900 truncate w-full text-center mb-1 leading-tight uppercase tracking-widest">{printItem.name}</p>
              <div className="bg-white p-1.5 rounded-lg">
                {/* BWIP-JS Free Barcode API (Code128 Format) */}
                <img 
                  src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${printItem.barcode_sku || '000000'}&scale=3&height=10&includetext`} 
                  alt="Barcode" 
                  className="h-12 object-contain"
                />
              </div>
              <p className="text-sm font-black text-emerald-600 mt-2">₹{printItem.price}</p>
            </div>

            <button 
              onClick={() => window.print()}
              className="no-print w-full mt-8 bg-gray-900 hover:bg-emerald-600 text-white font-black py-4.5 rounded-[1.2rem] flex items-center justify-center gap-2 uppercase tracking-widest text-xs transition-all shadow-[0_8px_20px_rgb(0,0,0,0.15)] active:scale-95"
            >
              <Printer size={18} strokeWidth={2.5} /> Print via Thermal Printer
            </button>
          </div>
        </div>
      )}

      {/* 🚀 ADD / EDIT PRODUCT MODALS */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-3xl w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400 border border-white">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                {isEditModalOpen ? 'Update Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setSelectedProductId(null); }} 
                className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-white shadow-sm border border-gray-100"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleEditProduct : handleAddProduct} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Product Name</label>
                <input type="text" required placeholder="e.g. Wireless Mouse" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-gray-800 shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Price (₹)</label>
                  <input type="number" required min="0" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-gray-800 shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Initial Stock</label>
                  <input type="number" required min="0" placeholder="0" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-gray-800 shadow-sm" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>Barcode / SKU Code</span>
                  <button type="button" onClick={handleGenerateSKU} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1 normal-case tracking-normal font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 active:scale-95 transition-all">
                    <Wand2 size={12} /> Auto
                  </button>
                </label>
                <input type="text" required placeholder="Scan barcode or type..." value={formData.barcode_sku} onChange={(e) => setFormData({...formData, barcode_sku: e.target.value})} className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all font-mono font-bold text-gray-800 shadow-sm" />
              </div>
              
              <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-4 bg-gray-100 text-gray-500 font-black tracking-widest uppercase text-xs rounded-2xl hover:bg-gray-200 hover:text-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-gray-900 text-white hover:bg-emerald-600 font-black tracking-widest uppercase text-xs rounded-2xl transition-all shadow-[0_8px_20px_rgb(0,0,0,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}

// 🎖️ Helper: Stock Badge Component
function StockBadge({ quantity }: { quantity: number }) {
  if (quantity === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-wider border border-rose-100/50 shadow-sm">
        <ArrowDownCircle size={14} strokeWidth={2.5} /> Empty
      </div>
    );
  }
  if (quantity <= 10) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-100/50 shadow-sm">
        <AlertTriangle size={14} strokeWidth={2.5} className="animate-pulse" /> Low: {quantity}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100/50 shadow-sm">
      <ArrowUpCircle size={14} strokeWidth={2.5} /> In Stock: {quantity}
    </div>
  );
}

// 📊 Helper: Stat Card Component
function StatCard({ title, value, icon, theme, highlight = false }: any) {
  const styles: any = {
    blue: 'bg-blue-50/50 text-blue-600 border-blue-100 ring-blue-400',
    emerald: 'bg-emerald-50/50 text-emerald-600 border-emerald-100 ring-emerald-400',
    orange: 'bg-orange-50/50 text-orange-600 border-orange-100 ring-orange-400',
    rose: 'bg-rose-50/50 text-rose-600 border-rose-100 ring-rose-400',
  };

  const selectedStyle = styles[theme];
  const ringClass = highlight ? `ring-2 ring-offset-2 ${selectedStyle.split(' ')[3]}` : '';

  return (
    <div className={`bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 ${ringClass}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3.5 rounded-2xl ${selectedStyle.split(' ')[0]} ${selectedStyle.split(' ')[1]} border ${selectedStyle.split(' ')[2]}`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
        </div>
      </div>
    </div>
  );
}