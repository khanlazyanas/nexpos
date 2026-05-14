'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Package, AlertTriangle, TrendingUp } from 'lucide-react';

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

  // Premium Skeleton Loader for API waiting time
  const SkeletonCard = () => (
    <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm animate-pulse flex items-center gap-5">
      <div className="w-16 h-16 bg-gray-200/50 rounded-2xl"></div>
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-200/50 rounded-full w-1/2"></div>
        <div className="h-8 bg-gray-200/50 rounded-full w-3/4"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Business Overview
        </h1>
        <p className="text-gray-500 font-medium flex items-center gap-2">
          Here's what's happening with your store today <TrendingUp size={18} className="text-emerald-500" />
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Revenue Card - Ultra Premium */}
          <div className="group relative bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all duration-500"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
                <IndianRupee size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
                <h3 className="text-3xl font-black text-gray-800">
                  ₹{stats.totalRevenue.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="group relative bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all duration-500"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Sales</p>
                <h3 className="text-3xl font-black text-gray-800">
                  {stats.totalOrders} <span className="text-lg text-gray-400 font-medium">Orders</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="group relative bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-all duration-500"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform duration-300">
                <Package size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Products</p>
                <h3 className="text-3xl font-black text-gray-800">
                  {stats.totalProducts} <span className="text-lg text-gray-400 font-medium">Items</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="group relative bg-white/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl transition-all duration-500 ${stats.lowStockCount > 0 ? 'bg-red-400/10 group-hover:bg-red-400/20' : 'bg-gray-400/10 group-hover:bg-gray-400/20'}`}></div>
            <div className="relative flex items-center gap-5">
              <div className={`p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                stats.lowStockCount > 0 
                  ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-red-200' 
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 shadow-gray-200'
              }`}>
                <AlertTriangle size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Low Stock Alert</p>
                <h3 className="text-3xl font-black text-gray-800">
                  {stats.lowStockCount} <span className="text-lg text-gray-400 font-medium">Items</span>
                </h3>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}