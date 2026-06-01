'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, ScanBarcode, Receipt, Sparkles, Zap, Printer, CheckCircle2, X, User, Phone, Percent, Banknote, QrCode, AlertTriangle, ShieldCheck, Gift, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Razorpay SDK Load
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function POSPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Advanced States
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [applyTax, setApplyTax] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Loyalty Wallet States
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [usePoints, setUsePoints] = useState<boolean>(false);

  // Receipt States
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto-fetch Customer Points on 10 digit entry
  useEffect(() => {
    const checkCustomer = async () => {
      if (customerMobile.length === 10) {
        try {
          const res = await fetch(`/api/customer/lookup?phone=${customerMobile}`);
          const data = await res.json();
          if (res.ok && data.success && data.customer) {
            setCustomerName(data.customer.name);
            setWalletBalance(data.customer.loyaltyPoints || 0);
          } else {
            setWalletBalance(0);
            setUsePoints(false);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setWalletBalance(0);
        setUsePoints(false);
      }
    };
    checkCustomer();
  }, [customerMobile]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Products Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!receiptData?.customerMobile) {
      toast.error("Customer mobile number not found!");
      return;
    }
    const receiptLink = `${window.location.origin}/receipt/${receiptData.orderId}`;
    const message = `*Receipt from NexPOS*\n\n` +
                    `Order ID: #${receiptData.orderId.split('-')[1]}\n` +
                    `Total Amount: ₹${receiptData.finalTotal}\n` +
                    `${receiptData.paymentMethod === 'Khata' ? 'Status: UNPAID (Added to Khata)\n\n' : '\n'}` +
                    `Click the link below to view your digital receipt:\n${receiptLink}\n\n` +
                    `Thank you for shopping with us!`;
    const whatsappUrl = `https://wa.me/91${receiptData.customerMobile}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = (product: IProduct) => {
    const cartItem = cart.find(item => item._id === product._id);
    const currentQtyInCart = cartItem ? cartItem.cartQuantity : 0;

    if (currentQtyInCart >= product.stock_quantity) {
      toast.error(`Cannot add more! Only ${product.stock_quantity} in stock.`, { style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontWeight: 'bold' } });
      return;
    }

    addToCart(product);
    const remainingStock = product.stock_quantity - (currentQtyInCart + 1);

    if (remainingStock > 0 && remainingStock <= 5) {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-in slide-in-from-top-2' : 'animate-out fade-out'} max-w-sm w-full bg-white border border-rose-100 shadow-2xl shadow-rose-500/10 rounded-2xl flex overflow-hidden`}>
          <div className="flex-1 p-4 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-rose-500 animate-pulse" />
            <div>
              <p className="text-sm font-black uppercase">Low Stock Alert</p>
              <p className="text-xs text-gray-500">{product.name} has <span className="text-rose-600">{remainingStock} left</span>!</p>
            </div>
          </div>
          <button onClick={() => toast.dismiss(t.id)} className="w-16 bg-gray-50 border-l hover:bg-rose-50 text-xs font-bold text-gray-500 hover:text-rose-600">Close</button>
        </div>
      ), { duration: 4000 });
    } else if (remainingStock === 0) {
      toast.error(`${product.name} Out of Stock!`, { icon: '🚨' });
    }
  };

  const subTotal = cartTotal();
  const taxAmount = applyTax ? Math.round(subTotal * 0.18) : 0; 
  let preFinalTotal = Math.max(0, subTotal + taxAmount - discount);
  const pointsToRedeem = usePoints ? Math.min(walletBalance, preFinalTotal) : 0; 
  const finalTotal = preFinalTotal - pointsToRedeem;

  const handleClearAll = () => {
    clearCart();
    setCustomerName('');
    setCustomerMobile('');
    setDiscount(0);
    setApplyTax(false);
    setPaymentMethod('Cash');
    setWalletBalance(0);
    setUsePoints(false);
  };

  const saveOrderToDatabase = async (orderId: string, orderDate: string, transactionId: string = 'CASH') => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart, orderId, customerName, customerMobile, subTotal, discount, tax: taxAmount, 
          totalAmount: finalTotal, paymentMethod, transactionId, usedPoints: pointsToRedeem
        })
      });

      const data = await response.json();

      if (response.ok) {
        setReceiptData({
          items: [...cart], subTotal, discount, taxAmount, finalTotal, date: orderDate, orderId, 
          customerName, customerMobile, paymentMethod, transactionId,
          usedPoints: pointsToRedeem, earnedPoints: data.earnedPoints || 0
        });
        handleClearAll();
        fetchProducts(); 
        setShowReceipt(true);
        // Toast message dynamic for Khata
        toast.success(paymentMethod === 'Khata' ? 'Added to Khata Successfully!' : "Transaction Completed!", { duration: 2000, style: { background: '#10b981', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }});
      } else {
        toast.error(data.error || 'Checkout Failed!');
      }
    } catch (error) {
      toast.error('System error during save.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // 📓 KHATA UI SECURITY: Reject Khata process if mobile number is invalid
    if (paymentMethod === 'Khata' && customerMobile.length < 10) {
      toast.error('Mobile number required to open Khata!', { icon: '⚠️', style: { borderRadius: '12px', background: '#333', color: '#fff', fontWeight: 'bold' }});
      return;
    }

    setIsCheckingOut(true);

    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const orderDate = new Date().toLocaleString('en-IN');

    // Khata aur Cash ke liye direct database save (No Razorpay popup)
    if (paymentMethod === 'Cash' || paymentMethod === 'Khata') {
      await saveOrderToDatabase(orderId, orderDate, paymentMethod === 'Khata' ? 'KHATA-DUE' : 'CASH');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Payment gateway offline. Check internet.');
      setIsCheckingOut(false);
      return;
    }

    try {
      const orderResponse = await fetch('/api/razorpay', { method: 'POST', body: JSON.stringify({ amount: finalTotal }) });
      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast.error('Gateway Error: ' + (orderData.error || 'Initialization failed.'));
        setIsCheckingOut(false);
        return;
      }

      const options = {
        key: 'rzp_test_8YGiWeZrGctMwH',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'NexPOS Enterprise',
        description: 'Secure Store Checkout',
        order_id: orderData.order.id,
        handler: async function (response: any) { await saveOrderToDatabase(orderId, orderDate, response.razorpay_payment_id); },
        prefill: { name: customerName || 'Customer', contact: customerMobile || '9999999999' },
        theme: { color: '#0f172a' },
        modal: { ondismiss: function() { setIsCheckingOut(false); } }
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.barcode_sku.toLowerCase().includes(searchQuery.toLowerCase()));

  const ProductSkeleton = () => (
    <div className="bg-white/50 border border-white shadow-sm rounded-[1.5rem] p-5 animate-pulse">
      <div className="h-12 bg-gray-200/60 rounded-xl mb-4"></div>
      <div className="h-3 w-2/3 bg-gray-200/60 rounded-lg mb-6"></div>
      <div className="flex justify-between items-end"><div className="h-6 w-16 bg-gray-200/60 rounded-lg"></div><div className="h-5 w-20 bg-gray-200/60 rounded-full"></div></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-100px)] relative z-10 animate-in fade-in duration-500 pb-10 lg:pb-0">
      
      <Toaster />

      {/* ================= LEFT SIDE: Terminal ================= */}
      <div className="h-[60vh] shrink-0 lg:shrink lg:h-full lg:flex-1 flex flex-col bg-white/50 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        
        {/* Terminal Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/60 bg-white/40 shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-center z-10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-xl shadow-inner border border-emerald-200">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping absolute"></div>
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full relative"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">Terminal</h1>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">{filteredProducts.length} Active SKUs</p>
            </div>
          </div>
          
          <div className="w-full sm:w-80 group">
            <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-1.5 flex items-center shadow-sm transition-all duration-300 group-focus-within:border-emerald-400 group-focus-within:ring-4 group-focus-within:ring-emerald-500/10 group-focus-within:bg-white group-hover:shadow-md">
              <ScanBarcode size={18} className="mx-3 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input type="text" placeholder="Search items or Scan Barcode..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent py-2 outline-none text-sm font-bold text-gray-800 placeholder:text-gray-400 placeholder:font-medium" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-gray-50/30">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">{[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock_quantity === 0;
                return (
                  <div key={product._id} onClick={() => !isOutOfStock && handleAddToCart(product)} className={`group relative rounded-[1.5rem] p-4 sm:p-5 border transition-all duration-300 select-none ${isOutOfStock ? 'bg-gray-100/50 border-gray-200 opacity-60 grayscale cursor-not-allowed' : 'bg-white border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] hover:border-emerald-100 cursor-pointer active:scale-[0.97] hover:-translate-y-1'}`}>
                    <h3 className="font-black text-gray-800 line-clamp-2 text-xs sm:text-sm leading-snug min-h-[2.5rem] group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-end mt-4">
                      <span className="font-black text-lg sm:text-xl text-gray-900 tracking-tight">₹{product.price}</span>
                      <span className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-wider ${isOutOfStock ? 'bg-rose-100 text-rose-600' : product.stock_quantity <= 5 ? 'bg-orange-100 text-orange-600 animate-pulse border border-orange-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors'}`}>
                        {isOutOfStock ? 'Empty' : `${product.stock_quantity} Left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE: Smart Ledger ================= */}
      <div className="w-full flex-1 lg:h-full lg:w-[420px] xl:w-[440px] flex flex-col bg-white/70 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        
        {/* Ledger Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-white/60 shrink-0 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2"><Receipt size={20} className="text-emerald-500" /> Active Ledger</h2>
          <button onClick={handleClearAll} className="bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all active:scale-95 border border-rose-100 hover:border-rose-500">Clear</button>
        </div>

        {/* Customer Identity */}
        <div className="px-4 sm:px-6 pt-4 pb-2 bg-gray-50/50 shrink-0 flex gap-3">
          <div className="flex-1 relative group">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input type="text" placeholder="Customer Name" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-gray-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm" />
          </div>
          <div className="flex-1 relative group">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input type="text" placeholder="Mobile No. (10-digit)" maxLength={10} value={customerMobile} onChange={(e)=>setCustomerMobile(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs font-bold text-gray-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm" />
          </div>
        </div>

        {/* Loyalty Wallet Widget */}
        {walletBalance > 0 && (
          <div className="mx-4 sm:mx-6 mb-2 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-[1rem] flex items-center justify-between shadow-inner animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-xl text-white shadow-sm"><Gift size={16} /></div>
              <div>
                <p className="text-[10px] font-black text-yellow-800 tracking-widest uppercase">Loyalty Wallet</p>
                <p className="text-xs font-bold text-yellow-600">{walletBalance} Points Available</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer active:scale-95 transition-transform">
              <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="sr-only peer" />
              <div className="w-10 h-5 bg-yellow-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-yellow-500 shadow-sm border border-yellow-300/50"></div>
            </label>
          </div>
        )}

        <div className="border-b border-gray-100"></div>

        {/* Cart Item Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar bg-white/30 min-h-[150px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-3">
              <div className="bg-gray-50 p-6 rounded-full border border-gray-100"><ShoppingCart size={40} strokeWidth={1.5} /></div>
              <p className="text-sm font-bold tracking-widest uppercase">Cart is Empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="group flex flex-col p-4 bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md hover:border-emerald-100 rounded-2xl transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-gray-800 text-sm line-clamp-1 pr-4">{item.name}</h4>
                  <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-rose-500 transition-colors bg-gray-50 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 size={14} /></button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-black text-emerald-600 text-base tracking-tight">₹{(item.price * item.cartQuantity).toLocaleString()}</p>
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 p-1 rounded-xl">
                    <button onClick={() => updateQuantity(item._id, item.cartQuantity - 1)} className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-gray-900 transition-colors shadow-sm"><Minus size={14} strokeWidth={3} /></button>
                    <span className="w-8 text-center font-black text-sm text-gray-800">{item.cartQuantity}</span>
                    <button onClick={() => { if(item.cartQuantity < item.stock_quantity) updateQuantity(item._id, item.cartQuantity + 1); else toast.error('Stock Limit Reached!'); }} className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-emerald-600 transition-colors shadow-sm"><Plus size={14} strokeWidth={3} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Financial Calculation & Checkout Engine */}
        <div className="bg-white border-t border-gray-100 shrink-0 rounded-t-3xl shadow-[0_-10px_40px_rgb(0,0,0,0.03)] z-20">
          
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" checked={applyTax} onChange={(e)=>setApplyTax(e.target.checked)} className="peer sr-only" />
                <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all"></div>
                <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
              </div>
              <span className="text-xs font-black tracking-widest text-gray-500 group-hover:text-gray-800 uppercase transition-colors">Apply 18% GST</span>
            </label>
            <div className="relative group w-28">
              <Percent size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-rose-400" />
              <input type="number" placeholder="Discount" value={discount || ''} onChange={(e)=>setDiscount(Number(e.target.value))} className="w-full bg-rose-50/50 border border-rose-100 rounded-xl py-1.5 pl-7 pr-3 outline-none text-right font-black text-rose-600 text-xs focus:border-rose-300 focus:ring-2 focus:ring-rose-500/10 transition-all" />
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 grid grid-cols-4 gap-2">
            {/* 📓 NAYA: Added Khata Option in Payment Methods Grid */}
            {[
              {id: 'Cash', icon: Banknote}, 
              {id: 'Card', icon: CreditCard}, 
              {id: 'UPI', icon: QrCode}, 
              {id: 'Khata', icon: BookOpen}
            ].map(method => (
              <button key={method.id} onClick={()=>setPaymentMethod(method.id)} className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border-2 transition-all active:scale-95 ${paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600'}`}>
                <method.icon size={18} strokeWidth={2.5} />
                <span className="text-[10px] font-black tracking-widest uppercase">{method.id}</span>
              </button>
            ))}
          </div>

          <div className="px-4 sm:px-6 pb-6 pt-2">
            <div className="flex justify-between items-end mb-4 px-2">
              <div>
                <span className="text-gray-400 font-black uppercase tracking-widest text-xs">Final Total</span>
                {usePoints && pointsToRedeem > 0 && (
                  <p className="text-[10px] font-bold text-yellow-500 mt-1 uppercase tracking-widest animate-pulse">-₹{pointsToRedeem} Points Used</p>
                )}
              </div>
              <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">₹{finalTotal.toLocaleString()}</span>
            </div>
            
            <button onClick={handleCheckout} disabled={cart.length === 0 || isCheckingOut} className={`group relative overflow-hidden w-full text-white py-4 sm:py-5 rounded-[1.5rem] shadow-[0_10px_20px_rgb(0,0,0,0.1)] active:scale-[0.98] flex justify-center items-center gap-2 transition-all duration-300 disabled:shadow-none ${paymentMethod === 'Khata' ? 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_15px_30px_rgba(79,70,229,0.3)]' : 'bg-gray-900 hover:bg-emerald-600 hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)]'} disabled:bg-gray-200`}>
              {!isCheckingOut && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 disabled:hidden"></div>}
              {isCheckingOut ? <Sparkles className="animate-spin relative z-10" size={20} /> : <ShieldCheck size={20} className="relative z-10" />}
              <span className="font-black text-sm tracking-widest uppercase relative z-10 disabled:text-gray-400">Process {paymentMethod}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= ULTRA REALISTIC RECEIPT MODAL ================= */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <style dangerouslySetInnerHTML={{__html: `@media print { body * { visibility: hidden; } #thermal-container, #thermal-container * { visibility: visible; } #thermal-container { position: absolute; left: 0; top: 0; width: 80mm; padding: 0; margin: 0; } .no-print { display: none !important; } }`}} />
          
          <div className="w-full max-w-sm flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-500 max-h-screen overflow-y-auto custom-scrollbar pb-4">
            
            <div className={`no-print text-white rounded-2xl p-4 flex items-center justify-center gap-3 shadow-lg border mt-4 shrink-0 ${receiptData.paymentMethod === 'Khata' ? 'bg-indigo-500 shadow-indigo-500/20 border-indigo-400' : 'bg-emerald-500 shadow-emerald-500/20 border-emerald-400'}`}>
              <CheckCircle2 size={24} className="animate-bounce" />
              <h2 className="font-black tracking-widest uppercase text-sm">
                {receiptData.paymentMethod === 'Khata' ? 'Added to Khata Due' : 'Payment Verified'}
              </h2>
            </div>

            <div id="thermal-container" className="bg-white rounded-t-xl rounded-b-sm shadow-2xl relative overflow-hidden pb-4 shrink-0">
              <div className="absolute top-0 left-0 w-full h-3 bg-[linear-gradient(-45deg,transparent_4px,#fff_4px),linear-gradient(45deg,transparent_4px,#fff_4px)] bg-[length:8px_8px] -mt-1 drop-shadow-sm"></div>
              
              <div className="p-8 pt-10 font-mono text-gray-800 text-xs">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-black mb-1 tracking-tighter text-gray-900">NexPOS<span className="text-emerald-500">.</span></h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Enterprise Retail Hub</p>
                </div>
                
                <div className="border-y-2 border-dashed border-gray-300 py-3 mb-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Receipt:</span> 
                    <span className="text-gray-900 font-bold uppercase">#{receiptData.orderId.split('-')[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Date:</span> 
                    <span className="text-gray-900 font-bold">{receiptData.date}</span>
                  </div>
                  {receiptData.customerName && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Billed To:</span> 
                      <span className="text-gray-900 font-bold">{receiptData.customerName}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  {receiptData.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-start">
                      <div className="flex-1 pr-4">
                        <span className="font-bold text-gray-900 block">{item.name}</span>
                        <span className="text-gray-500 font-semibold">{item.cartQuantity} x ₹{item.price}</span>
                      </div>
                      <span className="font-black text-gray-900">₹{item.price * item.cartQuantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-dashed border-gray-300 pt-3 mb-4 space-y-2">
                  <div className="flex justify-between text-gray-600 font-bold"><span>Subtotal</span> <span>₹{receiptData.subTotal}</span></div>
                  {receiptData.taxAmount > 0 && <div className="flex justify-between text-gray-600 font-bold"><span>GST (18%)</span> <span>+₹{receiptData.taxAmount}</span></div>}
                  {receiptData.discount > 0 && <div className="flex justify-between text-rose-500 font-bold"><span>Discount</span> <span>-₹{receiptData.discount}</span></div>}
                  {receiptData.usedPoints > 0 && <div className="flex justify-between text-yellow-600 font-bold"><span>Points Redeemed</span> <span>-₹{receiptData.usedPoints}</span></div>}
                </div>

                <div className={`p-3 rounded-lg flex justify-between items-center font-black text-base mb-6 border ${receiptData.paymentMethod === 'Khata' ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-gray-100 border-gray-200 text-gray-900'}`}>
                  <span className="tracking-widest uppercase">{receiptData.paymentMethod === 'Khata' ? 'Khata Balance Due' : 'Total Paid'}</span>
                  <span className="text-xl">₹{receiptData.finalTotal}</span>
                </div>

                <div className="text-center flex flex-col items-center">
                  <QrCode size={48} className="text-gray-900 mb-2 opacity-80" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black border border-gray-300 px-2 py-0.5 rounded-md mb-3">{receiptData.paymentMethod} {receiptData.paymentMethod === 'Khata' ? 'ENTRY' : 'TXN'}</p>
                  
                  {receiptData.earnedPoints > 0 && (
                     <div className="mb-3 px-3 py-1.5 border border-dashed border-gray-300 rounded-md">
                       <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Wow! You Earned</p>
                       <p className="text-xs font-black text-gray-900">+{receiptData.earnedPoints} Loyalty Points ✨</p>
                     </div>
                  )}
                  
                  <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Thank you! Visit Again.</p>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-3 bg-[linear-gradient(-45deg,#fff_4px,transparent_4px),linear-gradient(45deg,#fff_4px,transparent_4px)] bg-[length:8px_8px] -mb-1 drop-shadow-sm rotate-180"></div>
            </div>

            <button 
              onClick={handleWhatsApp}
              className="no-print shrink-0 flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-black py-4 rounded-2xl shadow-lg transition-transform active:scale-95 mb-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.003 3.238l-.58 2.16 2.255-.594c.909.525 1.854.794 2.805.795h.005c3.181 0 5.767-2.586 5.768-5.766.001-3.181-2.586-5.767-5.768-5.767z"/></svg>
              SEND ON WHATSAPP
            </button>

            <div className="no-print flex gap-3 shrink-0">
              <button onClick={() => setShowReceipt(false)} className="flex-1 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black tracking-widest uppercase text-xs transition-colors shadow-xl">New Sale</button>
              <button onClick={() => window.print()} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 transition-colors shadow-xl shadow-emerald-500/20 border border-emerald-400"><Printer size={16} /> Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}