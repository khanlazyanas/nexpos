'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { IndianRupee, ShoppingBag, Package, AlertTriangle, Activity, RefreshCw, BarChart3, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    chartData: [],
    lowStockItems: [] // 🛠️ NAYA: Backend se low stock list lene ke liye array
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restockValues, setRestockValues] = useState<{ [key: string]: number }>({});

  const fetchStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (error) {
      console.error("Stats lane me error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 🛠️ NAYA: Quick Restock API call handler
  const handleRestock = async (productId: string) => {
    const qty = restockValues[productId];
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity!");
      return;
    }

    try {
      const res = await fetch('/api/restock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, addedQuantity: qty })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Successfully added ${qty} items to stock!`, { style: { background: '#10b981', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }});
        setRestockValues({ ...restockValues, [productId]: 0 }); // Input box clear karo
        fetchStats(true); // Dashboard table ko fresh reload karo
      } else {
        toast.error(data.error || "Restock failed!");
      }
    } catch (error) {
      toast.error("Technical error during restock!");
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white/50 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-pulse flex items-center gap-6">
      <div className="w-16 h-16 bg-gray-200/60 rounded-2xl"></div>
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-200/60 rounded-full w-1/2"></div>
        <div className="h-8 bg-gray-200/60 rounded-full w-3/4"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 relative z-10 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
            </div>
            <span className="text-sm font-black tracking-widest text-emerald-600 uppercase">Live Metrics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter">
            Business Overview
          </h1>
          <p className="text-gray-500 font-medium flex items-center gap-2 mt-1 text-lg">
            Track your store's performance in real-time <Activity size={18} className="text-emerald-500" />
          </p>
        </div>

        <button 
          onClick={() => fetchStats(true)}
          disabled={loading || refreshing}
          className="self-start sm:self-center p-3.5 bg-white border border-gray-200 hover:border-emerald-200 text-gray-600 hover:text-emerald-600 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center"
        >
          {refreshing ? <Loader2 size={18} className="animate-spin text-emerald-500" /> : <RefreshCw size={18} />}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="group relative bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all duration-700 group-hover:scale-150"></div>
              <div className="relative flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm"></div>
                  <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200 group-hover:-rotate-3 transition-all duration-500">
                    <IndianRupee size={32} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Revenue</p>
                  <h3 className="text-4xl font-black text-gray-800 tracking-tight">
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </h3>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-400/30 transition-all duration-700 group-hover:scale-150"></div>
              <div className="relative flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm"></div>
                  <div className="relative bg-gradient-to-br from-blue-400 to-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 group-hover:-rotate-3 transition-all duration-500">
                    <ShoppingBag size={32} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Sales</p>
                  <h3 className="text-4xl font-black text-gray-800 tracking-tight flex items-baseline gap-1">
                    {stats.totalOrders} <span className="text-lg text-gray-400 font-bold">Orders</span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.15)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl group-hover:bg-purple-400/30 transition-all duration-700 group-hover:scale-150"></div>
              <div className="relative flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400/30 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm"></div>
                  <div className="relative bg-gradient-to-br from-purple-400 to-fuchsia-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-200 group-hover:-rotate-3 transition-all duration-500">
                    <Package size={32} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Total Items</p>
                  <h3 className="text-4xl font-black text-gray-800 tracking-tight flex items-baseline gap-1">
                    {stats.totalProducts} <span className="text-lg text-gray-400 font-bold">Qty</span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
              <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150 ${stats.lowStockCount > 0 ? 'bg-rose-400/20 group-hover:bg-rose-400/30' : 'bg-gray-400/20 group-hover:bg-gray-400/30'}`}></div>
              <div className="relative flex items-center gap-6">
                <div className={`absolute inset-0 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm ${stats.lowStockCount > 0 ? 'bg-rose-400/30' : 'bg-gray-400/30'}`}></div>
                <div className={`relative p-4 rounded-2xl shadow-lg group-hover:-rotate-3 transition-all duration-500 ${stats.lowStockCount > 0 ? 'bg-gradient-to-br from-rose-400 to-red-600 text-white shadow-rose-200' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 shadow-gray-200'}`}>
                  <AlertTriangle size={32} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <p className={`text-xs font-black uppercase tracking-widest mb-1.5 ${stats.lowStockCount > 0 ? 'text-rose-500' : 'text-gray-400'}`}>Low Stock</p>
                <h3 className="text-4xl font-black text-gray-800 tracking-tight flex items-baseline gap-1">
                  {stats.lowStockCount} <span className="text-lg text-gray-400 font-bold">Alerts</span>
                </h3>
              </div>
            </div>
          </div>

          {/* 📈 REAL-TIME DATA CHARTS CONTAINER */}
          <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.08)] transition-all duration-500">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <BarChart3 size={18} />
              </div>
              <div>
                <h3 className="font-black text-gray-900 tracking-tight text-lg">Sales Performance Trends</h3>
                <p className="text-xs text-gray-400 font-medium">Daily processed invoice amounts pipeline</p>
              </div>
            </div>

            <div className="w-full h-[320px] font-mono text-xs">
              {!stats.chartData || stats.chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 font-sans font-bold">
                  No chart data available yet. Process checkout orders to build logs!
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#1e293b', borderRadius: '14px', border: 'none', color: '#fff', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={3.5} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ⚠️ NAYA: LOW STOCK ACTION CENTER WIDGET */}
          {stats.lowStockCount > 0 && (
            <div className="bg-rose-50/50 backdrop-blur-2xl border border-rose-100 rounded-[2.5rem] p-6 sm:p-8 shadow-lg animate-in slide-in-from-bottom-5 duration-500">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 border border-rose-200">
                  <AlertTriangle size={18} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-rose-900 tracking-tight text-lg">Action Required: Low Stock Items</h3>
                  <p className="text-xs text-rose-500 font-bold uppercase tracking-widest">Immediate restock recommended</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-rose-200/50">
                      <th className="py-3 px-4 text-xs font-black text-rose-400 uppercase tracking-widest">Item Name</th>
                      <th className="py-3 px-4 text-xs font-black text-rose-400 uppercase tracking-widest">Current Stock</th>
                      <th className="py-3 px-4 text-xs font-black text-rose-400 uppercase tracking-widest text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockItems.map((item: any) => (
                      <tr key={item._id} className="border-b border-rose-100/50 last:border-0 hover:bg-white/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-800 text-sm">{item.name}</td>
                        <td className="py-4 px-4">
                          <span className="bg-rose-100 text-rose-700 font-black px-3 py-1 rounded-lg text-xs">
                            {item.stock_quantity} left
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <input 
                              type="number"
                              min="1"
                              placeholder="+ Qty"
                              value={restockValues[item._id] || ''}
                              onChange={(e) => setRestockValues({ ...restockValues, [item._id]: Number(e.target.value) })}
                              className="w-20 bg-white border border-rose-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-rose-500 text-gray-700"
                            />
                            <button 
                              onClick={() => handleRestock(item._id)}
                              className="bg-gray-900 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center"
                            >
                              <Plus size={16} strokeWidth={3} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
}