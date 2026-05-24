'use client';

import { useState, useEffect } from 'react';
import { Loader2, QrCode, AlertCircle } from 'lucide-react';

// 🛠️ FIX: Type updated to Promise<{ id: string }>
export default function PublicReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // 🛠️ FIX: Await the params here inside useEffect
        const resolvedParams = await params;
        
        const res = await fetch(`/api/public-receipt/${resolvedParams.id}`);
        const data = await res.json();
        
        if (res.ok) {
          setOrder(data);
        } else {
          setError(data.error || 'Receipt not found');
        }
      } catch (err) {
        setError('Failed to load receipt');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReceipt();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-emerald-500 mb-2" size={40} />
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Fetching Digital Invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="text-rose-500 mb-4" size={48} />
        <h1 className="text-xl font-black text-white tracking-tight">Not Found</h1>
        <p className="text-slate-400 text-sm mt-1 max-w-xs">{error || 'This invoice code does not exist.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-8 font-mono">
      <div className="w-full max-w-sm bg-white rounded-t-xl rounded-b-sm shadow-2xl relative overflow-hidden pb-6 animate-in zoom-in-95 duration-300">
        
        {/* Torn Paper Top Effect */}
        <div className="absolute top-0 left-0 w-full h-3 bg-[linear-gradient(-45deg,transparent_4px,#fff_4px),linear-gradient(45deg,transparent_4px,#fff_4px)] bg-[length:8px_8px] -mt-1 drop-shadow-sm"></div>
        
        <div className="p-8 pt-10 text-gray-800 text-xs">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black mb-1 tracking-tighter text-gray-900">NexPOS<span className="text-emerald-500">.</span></h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ENTERPRISE RETAIL HUB</p>
          </div>
          
          <div className="border-y-2 border-dashed border-gray-300 py-3 mb-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Receipt:</span> 
              <span className="text-gray-900 font-bold uppercase">#{order.orderId?.split('-')[1]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Date:</span> 
              <span className="text-gray-900 font-bold">{new Date(order.createdAt || order.date).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Billed To:</span> 
              <span className="text-gray-900 font-bold">{order.customerName || 'Walk-in'}</span>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <span className="font-bold text-gray-900 block">{item.name || item.productName}</span>
                  <span className="text-gray-500 font-semibold">{item.cartQuantity || item.quantity} x ₹{item.price}</span>
                </div>
                <span className="font-black text-gray-900">₹{item.price * (item.cartQuantity || item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-4 space-y-2">
            <div className="flex justify-between text-gray-600 font-bold"><span>Subtotal</span> <span>₹{order.subTotal || order.totalAmount}</span></div>
            {order.tax > 0 && <div className="flex justify-between text-gray-600 font-bold"><span>GST (18%)</span> <span>+₹{order.tax}</span></div>}
            {order.discount > 0 && <div className="flex justify-between text-rose-500 font-bold"><span>Discount</span> <span>-₹{order.discount}</span></div>}
          </div>

          <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center font-black text-base mb-6 border border-gray-200">
            <span className="tracking-widest uppercase">Total Paid</span>
            <span className="text-xl">₹{order.totalAmount}</span>
          </div>

          <div className="text-center flex flex-col items-center">
            <QrCode size={48} className="text-gray-900 mb-2 opacity-80" />
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black border border-gray-300 px-2 py-0.5 rounded-md mb-3">{order.paymentMethod || 'CASH'} TXN</p>
            <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Thank you! Visit Again.</p>
          </div>
        </div>
        
        {/* Torn Paper Bottom Effect */}
        <div className="absolute bottom-0 left-0 w-full h-3 bg-[linear-gradient(-45deg,#fff_4px,transparent_4px),linear-gradient(45deg,#fff_4px,transparent_4px)] bg-[length:8px_8px] -mb-1 drop-shadow-sm rotate-180"></div>
      </div>
    </div>
  );
}