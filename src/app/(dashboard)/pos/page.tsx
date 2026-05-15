'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, ScanBarcode, Receipt, Sparkles, Zap, Printer, CheckCircle2, X } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Receipt States
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState({
    items: [] as any[],
    total: 0,
    date: '',
    orderId: ''
  });

  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Products lane me error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalAmount: cartTotal()
        })
      });

      if (response.ok) {
        // Bill Generate karna
        const currentTotal = cartTotal();
        const currentItems = [...cart];
        const orderDate = new Date().toLocaleString('en-IN');
        const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
        
        setReceiptData({
          items: currentItems,
          total: currentTotal,
          date: orderDate,
          orderId: orderId
        });

        clearCart();
        fetchProducts(); 
        setShowReceipt(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Checkout fail ho gaya!');
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert('Kuch technical problem aa gayi.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode_sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ProductSkeleton = () => (
    <div className="bg-white/80 border border-gray-100 shadow-sm rounded-2xl p-4 sm:p-6 animate-pulse">
      <div className="h-10 bg-gray-200/60 rounded-xl mb-3"></div>
      <div className="h-3 w-3/4 bg-gray-200/60 rounded-lg mb-6"></div>
      <div className="flex justify-between items-end">
        <div className="h-6 w-16 bg-gray-200/60 rounded-lg"></div>
        <div className="h-5 w-20 bg-gray-200/60 rounded-full"></div>
      </div>
    </div>
  );

  return (
    // Mobile ke liye height ko '100dvh' kiya hai taaki split screen perfect kaam kare
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-[calc(100dvh-100px)] lg:h-[calc(100vh-100px)] relative z-10 animate-in fade-in duration-500">
      
      {/* LEFT SIDE: Products Section (Mobile: 55% Height, Desktop: 100% Height) */}
      <div className="flex-1 h-[55%] lg:h-full flex flex-col bg-white/60 backdrop-blur-3xl rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        
        <div className="p-4 sm:p-6 md:p-8 pb-4 sm:pb-6 border-b border-white/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between z-10 bg-white/30 shrink-0">
          <div className="flex justify-between w-full sm:w-auto items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter mb-0.5">
                Terminal
              </h1>
              <p className="text-[10px] sm:text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={14} className="text-emerald-500 hidden sm:block" /> Point of Sale
              </p>
            </div>
            {/* Mobile indicator for products length */}
            <span className="sm:hidden bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-lg font-bold">
              {filteredProducts.length} Items
            </span>
          </div>

          <div className="relative group w-full sm:w-[300px] md:w-[400px]">
            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 backdrop-blur-xl border border-white shadow-sm rounded-xl sm:rounded-2xl p-1 flex items-center transition-all group-focus-within:bg-white group-focus-within:shadow-md">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-gray-400 ml-1 shadow-inner border border-gray-100/50">
                <ScanBarcode size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search items..." 
                className="w-full bg-transparent pl-3 pr-3 py-1.5 sm:py-2 outline-none text-gray-800 font-bold placeholder:text-gray-400 placeholder:font-medium text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock_quantity === 0;
                return (
                  <div 
                    key={product._id} 
                    onClick={() => !isOutOfStock && addToCart(product)}
                    // MOBILE FIX: active:scale-95 aur active:bg-emerald-50 lagaya hai touch feedback ke liye
                    className={`group relative overflow-hidden rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6 transition-all duration-200 border select-none ${
                      isOutOfStock 
                        ? 'bg-gray-50/50 border-gray-200/50 opacity-60 cursor-not-allowed grayscale' 
                        : 'bg-white border-white shadow-sm hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1 hover:border-emerald-100 cursor-pointer active:scale-95 active:bg-emerald-50/80'
                    }`}
                  >
                    {!isOutOfStock && (
                      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all duration-500"></div>
                    )}
                    <h3 className="font-extrabold text-gray-800 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] text-sm sm:text-lg leading-tight relative z-10">{product.name}</h3>
                    <p className="text-[9px] sm:text-[11px] font-bold font-mono text-gray-400 mt-1 sm:mt-2 mb-3 sm:mb-5 relative z-10 tracking-widest uppercase bg-gray-50 inline-block px-1.5 py-0.5 rounded border border-gray-100">{product.barcode_sku}</p>
                    <div className="flex justify-between items-end relative z-10">
                      <span className="font-black text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">₹{product.price}</span>
                      <span className={`text-[9px] sm:text-[10px] px-2 py-1 sm:py-1.5 rounded-lg font-black uppercase tracking-widest border ${
                        isOutOfStock ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      }`}>
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

      {/* RIGHT SIDE: Cart / Billing Section (Mobile: 45% Height, Desktop: 100% Height) */}
      <div className="w-full h-[45%] lg:h-full lg:w-[420px] xl:w-[450px] flex flex-col bg-white/60 backdrop-blur-3xl rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        <div className="p-4 sm:p-6 pb-3 sm:pb-5 border-b border-white/50 relative bg-white/30 shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2 sm:gap-3 tracking-tight">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl text-white shadow-lg hidden sm:block">
                <Receipt size={20} />
              </div>
              Current Order
            </h2>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm transition-transform animate-in zoom-in">
              {cart.length} Items
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 sm:space-y-4">
              <div className="relative scale-75 sm:scale-100">
                <div className="absolute inset-0 bg-gray-200/50 rounded-full blur-xl animate-pulse"></div>
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center relative shadow-sm">
                  <ShoppingCart size={28} className="text-gray-300" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-base sm:text-xl font-bold text-gray-500">Cart is empty</p>
              <p className="text-xs sm:text-sm font-medium text-gray-400 text-center px-4 sm:px-8">Tap a product above to start billing.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="group flex flex-col gap-2 p-3 sm:p-5 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-gray-800 text-sm sm:text-[15px] line-clamp-2 flex-1 pr-2 leading-tight">{item.name}</h4>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-colors active:scale-90"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-1 sm:mt-2">
                  <p className="font-black text-emerald-600 text-base sm:text-xl tracking-tight">₹{(item.price * item.cartQuantity).toLocaleString()}</p>
                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 p-1 sm:p-1.5 rounded-lg sm:rounded-xl">
                    <button 
                      onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                      className="p-1 sm:p-2 rounded-md sm:rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all active:scale-90"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="w-6 sm:w-8 text-center font-black text-gray-800 text-sm sm:text-base">{item.cartQuantity}</span>
                    <button 
                      onClick={() => {
                        if(item.cartQuantity < item.stock_quantity) updateQuantity(item._id, item.cartQuantity + 1);
                        else alert('Not enough stock!');
                      }}
                      className="p-1 sm:p-2 rounded-md sm:rounded-lg hover:bg-white hover:shadow-sm text-gray-500 transition-all active:scale-90"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Checkout Footer */}
        <div className="p-4 sm:p-8 bg-white/90 border-t border-white backdrop-blur-xl shrink-0">
          <div className="flex justify-between items-end mb-3 sm:mb-6">
            <span className="text-gray-500 font-black uppercase tracking-widest text-[10px] sm:text-xs mb-0.5 sm:mb-1">Grand Total</span>
            <span className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tighter">₹{cartTotal().toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-gray-300 disabled:to-gray-200 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            {!isCheckingOut && cart.length > 0 && (
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            )}
            
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {isCheckingOut ? (
                <Sparkles className="animate-spin" size={20} />
              ) : (
                <CreditCard size={20} strokeWidth={2.5} />
              )}
              <span className="text-base sm:text-lg tracking-wide font-extrabold">{isCheckingOut ? 'Processing...' : 'Checkout & Pay'}</span>
            </div>
          </button>
        </div>
      </div>

      {/* ================= RECEIPT MODAL (PRINTING AREA) ================= */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm print:bg-white print:backdrop-blur-none p-4">
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * { visibility: hidden; }
              #printable-receipt, #printable-receipt * { visibility: visible; }
              #printable-receipt { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; border: none; border-radius: 0; }
            }
          `}} />

          <div id="printable-receipt" className="bg-white w-full max-w-sm rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-500 p-5 sm:p-6 text-center text-white print:hidden">
              <CheckCircle2 size={40} className="mx-auto mb-2" />
              <h2 className="text-xl sm:text-2xl font-black">Payment Successful</h2>
            </div>

            <div className="p-6 sm:p-8 bg-white font-mono text-gray-800">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-1">NexPOS</h2>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Retail Invoice</p>
              </div>

              <div className="border-b-2 border-dashed border-gray-200 pb-3 sm:pb-4 mb-3 sm:mb-4 text-[10px] sm:text-xs font-bold text-gray-500 space-y-1">
                <div className="flex justify-between"><span>Order ID:</span> <span>{receiptData.orderId}</span></div>
                <div className="flex justify-between"><span>Date:</span> <span>{receiptData.date}</span></div>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-xs sm:text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-bold line-clamp-1">{item.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{item.cartQuantity} x ₹{item.price}</p>
                    </div>
                    <p className="font-bold">₹{item.price * item.cartQuantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-gray-200 pt-3 sm:pt-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-black uppercase tracking-widest text-xs sm:text-sm text-gray-500">Total</span>
                  <span className="text-2xl sm:text-3xl font-black">₹{receiptData.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center text-[10px] sm:text-xs font-bold text-gray-400">
                <p>Thank you for shopping with us!</p>
                <p>Visit Again</p>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-gray-50 flex gap-2 sm:gap-3 print:hidden">
              <button 
                onClick={() => setShowReceipt(false)}
                className="flex-1 p-2.5 sm:p-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm sm:text-base active:scale-95"
              >
                <X size={18} /> Close
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 p-2.5 sm:p-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg text-sm sm:text-base active:scale-95"
              >
                <Printer size={18} /> Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}