'use client';

import { useState, useEffect } from 'react';
import { Search, Printer, Receipt, Loader2, Calendar, User, Phone, X, RefreshCcw, QrCode, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<any | null>(null);
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'NexPOS Pro',
    storeAddress: 'Lucknow, Uttar Pradesh'
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resOrders = await fetch('/api/orders');
        if (resOrders.ok) {
          const data = await resOrders.json();
          setOrders(data);
        } else {
          toast.error("Failed to load orders");
        }

        const resSettings = await fetch('/api/settings');
        if (resSettings.ok) {
          const settingsData = await resSettings.json();
          if (settingsData && settingsData.storeName) {
            setStoreSettings(settingsData);
          }
        }
      } catch (error) {
        toast.error("Network error!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleRefund = async (orderId: string) => {
    if (!confirm("Are you sure you want to refund this order? Inventory will be restored.")) return;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message, { style: { borderRadius: '12px', background: '#10b981', color: '#fff', fontWeight: 'bold' }});
        const refreshRes = await fetch('/api/orders');
        if (refreshRes.ok) setOrders(await refreshRes.json());
      } else {
        toast.error(data.error || "Refund failed");
      }
    } catch (error) {
      toast.error("Technical error during refund");
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const orderId = order._id?.toLowerCase() || '';
    const phone = order.customerPhone?.toLowerCase() || '';
    const name = order.customerName?.toLowerCase() || '';
    return orderId.includes(searchLower) || phone.includes(searchLower) || name.includes(searchLower);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative z-10 pb-20 lg:pb-10">
      <Toaster />
      
      {/* 🌌 SaaS Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse duration-[3000ms]"></div>

      {/* 1. Pro Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            Order History
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-2 text-sm md:text-base">
            Manage past sales, reprints, and customer refunds <Receipt size={18} className="text-emerald-500" />
          </p>
        </div>

        <div className="w-full md:w-96 group relative">
          <div className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by ID, Phone, or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-xl border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:font-medium"
          />
        </div>
      </div>

      {/* 2. The Orders Table */}
      <div className="bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Order ID & Date</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Customer Identity</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Amount Paid</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={40} />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching Ledgers...</p>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center text-gray-400">
                    <Receipt size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-sm">No historical orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isRefunded = order.status === 'Refunded';
                  return (
                    <tr key={order._id} className="hover:bg-white transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-black text-gray-900 text-sm tracking-tight mb-1">#{order._id?.slice(-6).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-widest">
                          <Calendar size={12} className="text-emerald-500" /> 
                          {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                              <User size={12} />
                            </div>
                            {order.customerName || 'Walk-in Customer'}
                          </p>
                          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 ml-8">
                            <Phone size={10} /> {order.customerPhone || 'N/A'}
                          </p>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                          isRefunded 
                          ? 'bg-rose-50 text-rose-600 border-rose-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {!isRefunded && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                          {isRefunded ? 'Refunded' : 'Completed'}
                        </span>
                      </td>
                      
                      <td className="px-8 py-5">
                        <span className={`font-black text-lg ${isRefunded ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                          ₹{order.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedBill(order)}
                            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-200 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                          >
                            <Printer size={14} strokeWidth={2.5} /> Print
                          </button>
                          
                          {!isRefunded && (
                            <button 
                              onClick={() => handleRefund(order._id)}
                              className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-rose-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                              <RefreshCcw size={14} strokeWidth={2.5} /> Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧾 ULTRA REALISTIC THERMAL RECEIPT MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <style dangerouslySetInnerHTML={{__html: `@media print { body * { visibility: hidden; } #thermal-container, #thermal-container * { visibility: visible; } #thermal-container { position: absolute; left: 0; top: 0; width: 80mm; padding: 0; margin: 0; } .no-print { display: none !important; } }`}} />
          
          <div className="w-full max-w-sm flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-500 relative">
            
            <button 
              onClick={() => setSelectedBill(null)} 
              className="no-print absolute -top-4 -right-4 z-10 bg-white text-gray-500 p-2.5 rounded-full shadow-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
            >
              <X size={20} strokeWidth={3} />
            </button>

            {/* The Actual Receipt Paper */}
            <div id="thermal-container" className="bg-white rounded-t-xl rounded-b-sm shadow-2xl relative overflow-hidden pb-4">
              {/* Torn Paper Top Effect */}
              <div className="absolute top-0 left-0 w-full h-3 bg-[linear-gradient(-45deg,transparent_4px,#fff_4px),linear-gradient(45deg,transparent_4px,#fff_4px)] bg-[length:8px_8px] -mt-1 drop-shadow-sm"></div>
              
              <div className="p-8 pt-10 font-mono text-gray-800 text-xs">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black mb-1 tracking-tighter text-gray-900 uppercase">{storeSettings.storeName}</h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight mx-auto max-w-[200px]">{storeSettings.storeAddress}</p>
                </div>
                
                <div className="border-y-2 border-dashed border-gray-300 py-3 mb-4 space-y-2 relative">
                  {selectedBill.status === 'Refunded' && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                       <h1 className="text-5xl font-black text-rose-600 rotate-[-15deg] uppercase tracking-widest border-4 border-rose-600 p-2">Refunded</h1>
                     </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Receipt:</span> 
                    <span className="text-gray-900 font-bold uppercase">#{selectedBill._id?.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Date:</span> 
                    <span className="text-gray-900 font-bold">{new Date(selectedBill.createdAt || selectedBill.date).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Billed To:</span> 
                    <span className="text-gray-900 font-bold">{selectedBill.customerName || 'Walk-in'}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {selectedBill.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <span className="font-bold text-gray-900 block">{item.productName || item.name}</span>
                        <span className="text-gray-500 font-semibold">{item.quantity} x ₹{item.price}</span>
                      </div>
                      <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4 bg-gray-100/50 p-3 rounded-lg flex justify-between items-center font-black text-base mb-6 border border-gray-200">
                  <span className="tracking-widest uppercase">Total Amount</span>
                  <span className="text-xl">₹{selectedBill.totalAmount}</span>
                </div>

                <div className="text-center flex flex-col items-center">
                  <QrCode size={48} className="text-gray-900 mb-2 opacity-80" />
                  <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Thank you! Visit Again.</p>
                </div>
              </div>
              
              {/* Torn Paper Bottom Effect */}
              <div className="absolute bottom-0 left-0 w-full h-3 bg-[linear-gradient(-45deg,#fff_4px,transparent_4px),linear-gradient(45deg,#fff_4px,transparent_4px)] bg-[length:8px_8px] -mb-1 drop-shadow-sm rotate-180"></div>
            </div>

            {/* Action Buttons */}
            <div className="no-print flex gap-3">
              <button 
                onClick={() => window.print()} 
                className="w-full py-4 bg-gray-900 hover:bg-emerald-500 text-white rounded-2xl font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95"
              >
                <Printer size={16} /> PRINT RECEIPT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}