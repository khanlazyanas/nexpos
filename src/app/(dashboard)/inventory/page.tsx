'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit3, Trash2, AlertTriangle, 
  ArrowUpRight, Barcode, Filter, Loader2, MoreVertical, 
  ArrowDownCircle, ArrowUpCircle, ShoppingBag, Layers
} from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

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

  // 🧮 Stats Calculation
  const totalItems = products.length;
  const lowStockItems = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length;
  const outOfStockItems = products.filter(p => p.stock_quantity === 0).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'Low Stock') return matchesSearch && p.stock_quantity <= 10 && p.stock_quantity > 0;
    if (filterStatus === 'Out of Stock') return matchesSearch && p.stock_quantity === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 lg:pb-10">
      
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

        <button className="group relative overflow-hidden flex items-center gap-3 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 hover:bg-emerald-700">
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
              ) : filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-emerald-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-emerald-500 transition-all border border-transparent group-hover:border-emerald-100">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 font-medium">Updated 2h ago</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-tighter mb-1">SKU</span>
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100 w-fit">
                        <Barcode size={14} className="text-emerald-500" />
                        {product.sku || 'NO-SKU'}
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
                      <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
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