'use client';

import { useState, useEffect } from 'react';
import { Search, Printer, Receipt, Loader2, Calendar, User, Phone, X, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<any | null>(null);

  // API se Orders fetch karna (Aapki API ke hisaab se direct array aayega)
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        toast.error("Failed to load orders");
      }
    } catch (error) {
      toast.error("Network error!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Refund Handle Karna
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
        toast.success(data.message, { style: { borderRadius: '12px', background: '#333', color: '#fff' }});
        fetchOrders(); // Refresh table after refund
      } else {
        toast.error(data.error || "Refund failed");
      }
    } catch (error) {
      toast.error("Technical error during refund");
    }
  };

  // Search Filter
  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const orderId = order._id?.toLowerCase() || '';
    const phone = order.customerPhone?.toLowerCase() || '';
    const name = order.customerName?.toLowerCase() || '';
    return orderId.includes(searchLower) || phone.includes(searchLower) || name.includes(searchLower);
  });

  return (
    <div className="relative h-full flex flex-col gap-6">
      
      {/* 🖨️ SMART PRINT CSS (Hide everything except the receipt when printing) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #thermal-receipt, #thermal-receipt * { visibility: visible; }
          #thermal-receipt { 
            position: absolute; left: 0; top: 0; 
            width: 80mm; padding: 10px; margin: 0;
            background: white; color: black; font-family: monospace;
          }
          .no-print { display: none !important; }
        }
      `}} />

      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Receipt className="text-emerald-500" size={32} />
            Order History
          </h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Manage past sales, reprints, and refunds.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID, Phone, or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-gray-700 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 p-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Fetching Records...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID & Date</th>
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400 font-bold">No orders found.</td></tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isRefunded = order.status === 'Refunded';
                    return (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                        
                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-700 text-sm">#{order._id?.slice(-6).toUpperCase()}</p>
                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={12} /> {new Date(order.createdAt || order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </td>
                        
                        <td className="py-4 px-4">
                          <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><User size={14} className="text-gray-400"/> {order.customerName || 'Walk-in'}</p>
                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mt-0.5"><Phone size={12} className="text-gray-400"/> {order.customerPhone || 'N/A'}</p>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${isRefunded ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {isRefunded ? 'Refunded' : 'Completed'}
                          </span>
                        </td>
                        
                        <td className={`py-4 px-4 font-black ${isRefunded ? 'text-gray-400 line-through' : 'text-emerald-600'}`}>
                          ₹{order.totalAmount}
                        </td>
                        
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Reprint Button */}
                            <button 
                              onClick={() => setSelectedBill(order)}
                              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                              <Printer size={14} /> Print
                            </button>
                            
                            {/* Refund Button */}
                            {!isRefunded && (
                              <button 
                                onClick={() => handleRefund(order._id)}
                                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                              >
                                <RefreshCcw size={14} /> Refund
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
          )}
        </div>
      </div>

      {/* 🧾 THERMAL RECEIPT POPUP MODAL */}
      {selectedBill && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-100 p-6 rounded-3xl max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setSelectedBill(null)} 
              className="no-print absolute -top-4 -right-4 bg-white text-gray-900 p-2 rounded-full shadow-xl hover:bg-rose-500 hover:text-white transition-colors border border-gray-200"
            >
              <X size={20} />
            </button>

            <div id="thermal-receipt" className="bg-white p-6 rounded-xl shadow-inner border border-gray-200 text-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900">NexPOS Pro</h2>
                <p className="text-gray-500 text-xs font-bold mt-1">Lucknow, Uttar Pradesh</p>
                <div className="border-b-2 border-dashed border-gray-300 my-4"></div>
                <p className="text-xs font-semibold text-gray-600">Date: {new Date(selectedBill.createdAt || selectedBill.date).toLocaleString()}</p>
                <p className="text-xs font-semibold text-gray-600 mt-1">Bill No: #{selectedBill._id?.slice(-6).toUpperCase()}</p>
                <p className="text-xs font-semibold text-gray-600 mt-1">Customer: {selectedBill.customerName || 'Walk-in'}</p>
                
                {selectedBill.status === 'Refunded' && (
                  <p className="text-xs font-black text-rose-600 mt-2 border border-rose-600 inline-block px-2 py-1 uppercase rounded-md">REFUNDED</p>
                )}
                
                <div className="border-b-2 border-dashed border-gray-300 my-4"></div>
              </div>

              <table className="w-full text-left mb-4">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-xs font-bold">Item</th>
                    <th className="py-2 text-xs font-bold text-center">Qty</th>
                    <th className="py-2 text-xs font-bold text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items?.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 text-xs font-semibold text-gray-700">{item.productName || item.name}</td>
                      <td className="py-2 text-xs font-semibold text-gray-700 text-center">{item.quantity}</td>
                      <td className="py-2 text-xs font-semibold text-gray-700 text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-dashed border-gray-300 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Amount:</span>
                <span className="text-xl font-black text-gray-900">₹{selectedBill.totalAmount}</span>
              </div>
              
              <div className="text-center mt-8 text-xs font-bold text-gray-400">
                <p>Thank you for shopping with us!</p>
                <p className="mt-1">Visit Again</p>
              </div>
            </div>

            <button 
              onClick={() => window.print()}
              className="no-print w-full mt-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Printer size={18} /> PRINT RECEIPT
            </button>
          </div>
        </div>
      )}

    </div>
  );
}