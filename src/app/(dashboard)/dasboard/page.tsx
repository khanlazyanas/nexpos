'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Package, AlertTriangle } from 'lucide-react';

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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Business Overview</h1>

      {loading ? (
        <p className="text-gray-500">Loading dashboard data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <IndianRupee size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders} Orders</h3>
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 p-4 rounded-full text-purple-600">
              <Package size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts} Items</h3>
            </div>
          </div>

          {/* Low Stock Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stats.lowStockCount > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} p-4 rounded-full`}>
              <AlertTriangle size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Alert</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.lowStockCount} Items</h3>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}