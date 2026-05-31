'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, ShoppingBag, Package, AlertTriangle, Activity, RefreshCw, BarChart3, Loader2, Plus, Receipt, Banknote, CreditCard, Bot, Sparkles, Info, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
    chartData: [],
    lowStockItems: [],
    todayBills: 0,
    todayCash: 0,
    todayOnline: 0,
    topProducts: [],
    aiInsights: [] // 🚀 Initialize AI state
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
      console.error("Stats fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRestock = async (productId: string) => {
    const qty = restockValues[productId];
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity!", { style: { background: '#333', color: '#fff', borderRadius: '12px' }});
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
        setRestockValues({ ...restockValues, [productId]: 0 }); 
        fetchStats(true); 
      } else {
        toast.error(data.error || "Restock failed!");
      }
    } catch (error) {
      toast.error("Technical error during restock!");
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse flex items-center gap-6">
      <div className="w-16 h-16 bg-gray-200/50 rounded-2xl"></div>
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-200/50 rounded-full w-1/2"></div>
        <div className="h-8 bg-gray-200/50 rounded-full w-3/4"></div>
      </div>
    </div>
  );

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];
  const todayTotal = (stats.todayCash || 0) + (stats.todayOnline || 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative z-10 pb-12 max-w-7xl mx-auto">
      
      {/* 🌌 SaaS Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute left-[-10%] top-[-5%] -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500 opacity-20 blur-[120px] animate-pulse duration-[4000ms]"></div>
      <div className="absolute right-[-5%] top-[20%] -z-10 h-[300px] w-[300px] rounded-full bg-teal-400/20 blur-[100px] animate-pulse delay-1000 duration-[3000ms]"></div>

      {/* 1. Ultra-Premium Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full border border-emerald-200 shadow-inner">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
            </div>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">Live System Metrics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            Overview
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-1 text-sm md:text-base">
            Real-time business performance & stock analytics <Activity size={16} className="text-emerald-500" />
          </p>
        </div>

        <button 
          onClick={() => fetchStats(true)}
          disabled={loading || refreshing}
          className="group self-start sm:self-center p-4 bg-white/80 backdrop-blur-md border border-white shadow-[0_8px_20px_rgb(0,0,0,0.04)] hover:shadow-lg hover:border-emerald-100 text-gray-600 hover:text-emerald-600 rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {refreshing ? <Loader2 size={18} className="animate-spin text-emerald-500" /> : <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />}
          <span className="text-xs font-black tracking-widest uppercase md:hidden">Sync</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {/* 🌟 NEW: Today's Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 md:p-8 rounded-[2rem] text-white shadow-[0_15px_30px_rgba(16,185,129,0.3)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
              <p className="relative z-10 text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-1">Today's Total Revenue</p>
              <h2 className="relative z-10 text-4xl font-black tracking-tighter">₹{todayTotal.toLocaleString()}</h2>
            </div>
            
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-all">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-[1.2rem] border border-blue-200 shadow-inner"><Receipt size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Today's Bills</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.todayBills}</h3>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-all">
              <div className="p-4 bg-purple-100 text-purple-600 rounded-[1.2rem] border border-purple-200 shadow-inner"><CreditCard size={24}/></div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Online / Cash</p>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">₹{stats.todayOnline} <span className="text-gray-400 font-bold text-sm">/</span> ₹{stats.todayCash}</h3>
              </div>
            </div>
          </div>

          {/* 🤖 NEW: AI SMART INSIGHTS ENGINE */}
          {stats.aiInsights && stats.aiInsights.length > 0 && (
            <div className="bg-gray-900 backdrop-blur-3xl rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden text-white border border-gray-800 animate-in slide-in-from-bottom-8 duration-500">
              {/* Background Glow */}
              <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-3 bg-white/10 rounded-[1.2rem] text-emerald-400 border border-white/10 shadow-inner backdrop-blur-md">
                  <Bot size={24} strokeWidth={2} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black tracking-tight text-xl text-white flex items-center gap-2">
                    NexPOS AI Insights <Sparkles size={16} className="text-yellow-400" />
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Live Data Analysis</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {stats.aiInsights.map((insight: any, idx: number) => {
                  let badgeColors = 'bg-gray-800/50 border-gray-700 text-gray-300';
                  let Icon = Info;

                  if (insight.type === 'warning') {
                    badgeColors = 'bg-rose-950/40 border-rose-900 text-rose-300';
                    Icon = AlertTriangle;
                  } else if (insight.type === 'success') {
                    badgeColors = 'bg-emerald-950/40 border-emerald-900 text-emerald-300';
                    Icon = CheckCircle2;
                  } else if (insight.type === 'insight') {
                    badgeColors = 'bg-blue-950/40 border-blue-900 text-blue-300';
                    Icon = Zap;
                  }

                  return (
                    <div key={idx} className={`p-5 rounded-3xl border backdrop-blur-sm ${badgeColors} flex flex-col gap-3 transition-transform hover:-translate-y-1`}>
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="opacity-80" />
                        <h4 className="text-xs font-black uppercase tracking-widest">{insight.title}</h4>
                      </div>
                      <p className="text-sm font-semibold leading-relaxed opacity-90">{insight.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Floating Stat Cards (Legacy Row) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Revenue Card */}
            <div className="group bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl group-hover:scale-150"></div>
              <div className="relative flex items-center gap-5">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-3.5 rounded-[1.2rem] text-white shadow-lg"><IndianRupee size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">All-time Revenue</p>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">₹{stats.totalRevenue.toLocaleString()}</h3>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="group bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl group-hover:scale-150"></div>
              <div className="relative flex items-center gap-5">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-3.5 rounded-[1.2rem] text-white shadow-lg"><ShoppingBag size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Sales</p>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stats.totalOrders}</h3>
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="group bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:-translate-y-1 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl group-hover:scale-150"></div>
              <div className="relative flex items-center gap-5">
                <div className="bg-gradient-to-br from-purple-400 to-fuchsia-600 p-3.5 rounded-[1.2rem] text-white shadow-lg"><Package size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Items</p>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stats.totalProducts}</h3>
                </div>
              </div>
            </div>

            {/* Low Stock Card */}
            <div className={`group bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border shadow-sm transition-all hover:-translate-y-1 overflow-hidden relative ${stats.lowStockCount > 0 ? 'border-rose-100 ring-1 ring-rose-100' : 'border-white'}`}>
              <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 ${stats.lowStockCount > 0 ? 'bg-rose-400/20' : 'bg-gray-400/10'}`}></div>
              <div className="relative flex items-center gap-5">
                <div className={`p-3.5 rounded-[1.2rem] text-white shadow-lg ${stats.lowStockCount > 0 ? 'bg-gradient-to-br from-rose-400 to-red-600' : 'bg-gradient-to-br from-gray-300 to-gray-400'}`}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${stats.lowStockCount > 0 ? 'text-rose-500' : 'text-gray-400'}`}>Low Stock</p>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter">{stats.lowStockCount}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* 📈 3. CHARTS CONTAINER ROW */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Sales Line Chart */}
            <div className="xl:col-span-2 bg-white/60 backdrop-blur-3xl border border-white rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-white border border-emerald-100 rounded-xl text-emerald-600 shadow-sm"><BarChart3 size={20} strokeWidth={2.5} /></div>
                <div>
                  <h3 className="font-black text-gray-900 tracking-tight text-lg">Sales Trends</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Daily processed invoice amounts</p>
                </div>
              </div>

              <div className="w-full h-[320px] font-mono text-xs">
                {!stats.chartData || stats.chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400 font-sans font-bold bg-white/40 rounded-2xl border border-dashed border-gray-200">Process orders to generate analytics!</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} fontFamily="inherit" />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} fontFamily="inherit" tickFormatter={(value) => `₹${value}`} />
                      <RechartsTooltip 
                        contentStyle={{ background: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontWeight: 'bold' }} 
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Area type="monotone" dataKey="Sales" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 🌟 NEW: Top Products Pie Chart */}
            <div className="xl:col-span-1 bg-white/60 backdrop-blur-3xl border border-white rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-500 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white border border-blue-100 rounded-xl text-blue-600 shadow-sm"><Package size={20} strokeWidth={2.5} /></div>
                <div>
                  <h3 className="font-black text-gray-900 tracking-tight text-lg">Top Sellers</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Highest volume products</p>
                </div>
              </div>

              <div className="flex-1 min-h-[220px] w-full relative">
                {!stats.topProducts || stats.topProducts.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-400">No data available.</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={stats.topProducts} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                        {stats.topProducts.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none' }} itemStyle={{ fontWeight: 'bold', color: '#1f2937' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {stats.topProducts?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                      <span className="font-bold text-gray-700 truncate max-w-[150px]">{item.name}</span>
                    </div>
                    <span className="font-black text-gray-900">{item.value}x</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ⚠️ 4. LOW STOCK ACTION CENTER WIDGET */}
          {stats.lowStockCount > 0 && (
            <div className="bg-white/60 backdrop-blur-3xl border border-rose-100 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(244,63,94,0.1)] animate-in slide-in-from-bottom-8 duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 shadow-inner">
                    <AlertTriangle size={20} strokeWidth={2.5} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-black text-rose-950 tracking-tight text-lg">Action Required</h3>
                    <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-0.5">Immediate restock recommended</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-rose-100/50">
                      <th className="py-4 px-4 text-[10px] font-black text-rose-400 uppercase tracking-widest">Item Details</th>
                      <th className="py-4 px-4 text-[10px] font-black text-rose-400 uppercase tracking-widest text-center">Status</th>
                      <th className="py-4 px-4 text-[10px] font-black text-rose-400 uppercase tracking-widest text-right">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.lowStockItems.map((item: any) => (
                      <tr key={item._id} className="border-b border-rose-50 last:border-0 hover:bg-white/50 transition-colors group">
                        <td className="py-5 px-4 font-bold text-gray-900 text-sm">{item.name}</td>
                        <td className="py-5 px-4 text-center">
                          <span className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-600 font-black px-3 py-1.5 rounded-xl text-xs shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                            {item.stock_quantity} Left
                          </span>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <input 
                              type="number" min="1" placeholder="+ Qty"
                              value={restockValues[item._id] || ''}
                              onChange={(e) => setRestockValues({ ...restockValues, [item._id]: Number(e.target.value) })}
                              className="w-24 bg-white/80 border border-rose-200 rounded-xl py-2.5 px-3 text-xs font-bold outline-none focus:border-rose-400 text-gray-800 shadow-sm transition-all text-center"
                            />
                            <button 
                              onClick={() => handleRestock(item._id)}
                              className="bg-gray-900 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-95"
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