'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Package, AlertTriangle, TrendingUp, Sparkles, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (error) {
        console.error("Stats lane me error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Premium SaaS Skeleton Loader
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
    <div className="space-y-10 animate-in fade-in duration-500 relative z-10">
      
      {/* Header Section with Live Indicator */}
      <div className="flex flex-col gap-2 relative">
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Revenue Card - Ultra Premium */}
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

          {/* Orders Card */}
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

          {/* Products Card */}
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

          {/* Low Stock Card */}
          <div className="group relative bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150 ${stats.lowStockCount > 0 ? 'bg-rose-400/20 group-hover:bg-rose-400/30' : 'bg-gray-400/20 group-hover:bg-gray-400/30'}`}></div>
            <div className="relative flex items-center gap-6">
              <div className="relative">
                <div className={`absolute inset-0 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm ${stats.lowStockCount > 0 ? 'bg-rose-400/30' : 'bg-gray-400/30'}`}></div>
                <div className={`relative p-4 rounded-2xl shadow-lg group-hover:-rotate-3 transition-all duration-500 ${
                  stats.lowStockCount > 0 
                    ? 'bg-gradient-to-br from-rose-400 to-red-600 text-white shadow-rose-200' 
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 shadow-gray-200'
                }`}>
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

        </div>
      )}
    </div>
  );
}