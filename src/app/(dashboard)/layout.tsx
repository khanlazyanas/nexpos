'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, ScanBarcode, Receipt, Sparkles, Zap } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

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
        alert('🎉 Bill Successfully Ban Gaya! Stock update ho gaya.');
        clearCart();
        fetchProducts(); 
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

  // Premium SaaS Skeleton
  const ProductSkeleton = () => (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[2rem] p-6 animate-pulse">
      <div className="h-14 bg-gray-200/50 rounded-2xl mb-4"></div>
      <div className="h-4 w-3/4 bg-gray-200/50 rounded-lg mb-8"></div>
      <div className="flex justify-between items-end">
        <div className="h-8 w-20 bg-gray-200/50 rounded-lg"></div>
        <div className="h-6 w-24 bg-gray-200/50 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] lg:h-[calc(100vh-8rem)] relative z-10 animate-in fade-in duration-500">
      
      {/* LEFT SIDE: Products Section */}
      <div className="flex-1 flex flex-col gap-6 h-full">
        
        {/* Header & Floating Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between z-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter mb-1">
              Terminal
            </h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Zap size={14} className="text-emerald-500" /> Point of Sale
            </p>
          </div>

          <div className="relative group w-full sm:w-[400px]">
            <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2 flex items-center transition-all group-focus-within:bg-white/80">
              <div className="bg-gradient-to-br from-gray-100 to-white p-3 rounded-xl text-gray-400 ml-1 shadow-sm border border-gray-50">
                <ScanBarcode size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search products or scan barcode..." 
                className="w-full bg-transparent pl-4 pr-4 py-2 outline-none text-gray-800 font-bold placeholder:text-gray-300 placeholder:font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1 overflow-y-auto pb-4 pr-2 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock_quantity === 0;
                return (
                  <div 
                    key={product._id} 
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`group relative overflow-hidden rounded-[2rem] p-6 transition-all duration-500 border ${
                      isOutOfStock 
                        ? 'bg-white/30 border-white/50 opacity-60 cursor-not-allowed grayscale' 
                        : 'bg-white/60 backdrop-blur-3xl border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-1'
                    }`}
                  >
                    {!isOutOfStock && (
                      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all duration-700"></div>
                    )}
                    
                    <h3 className="font-extrabold text-gray-800 line-clamp-2 min-h-[3.5rem] text-lg leading-tight relative z-10">{product.name}</h3>
                    <p className="text-xs font-bold font-mono text-gray-400 mt-2 mb-5 relative z-10 tracking-wider uppercase">{product.barcode_sku}</p>
                    
                    <div className="flex justify-between items-end relative z-10">
                      <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">₹{product.price}</span>
                      <span className={`text-[10px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest border ${
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

      {/* RIGHT SIDE: Cart / Billing Section */}
      <div className="w-full lg:w-[420px] xl:w-[480px] flex flex-col bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden h-full">
        
        {/* Cart Header */}
        <div className="p-8 pb-6 border-b border-gray-100/50 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-2.5 rounded-xl text-white shadow-lg">
                <Receipt size={20} />
              </div>
              Current Order
            </h2>
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              {cart.length} Items
            </span>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-200/50 rounded-full blur-xl animate-pulse"></div>
                <div className="w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center relative shadow-sm">
                  <ShoppingCart size={32} className="text-gray-300" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-500">Cart is empty</p>
              <p className="text-sm font-medium text-gray-400 text-center px-8">Scan a barcode or select products from the grid to start billing.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="group flex flex-col gap-3 p-5 bg-white/60 backdrop-blur-sm border border-white shadow-sm rounded-[1.5rem] hover:shadow-md transition-all duration-300 hover:border-emerald-100/50">
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-gray-800 text-[15px] line-clamp-2 flex-1 pr-4 leading-tight">{item.name}</h4>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="font-black text-emerald-600 text-xl tracking-tight">₹{(item.price * item.cartQuantity).toLocaleString()}</p>
                  
                  {/* Modern Pro Quantity Controls */}
                  <div className="flex items-center gap-1 bg-white border border-gray-100 p-1.5 rounded-xl shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                      className="p-2 rounded-lg hover:bg-gray-50 hover:text-emerald-600 text-gray-400 transition-all"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center font-black text-gray-800">{item.cartQuantity}</span>
                    <button 
                      onClick={() => {
                        if(item.cartQuantity < item.stock_quantity) {
                          updateQuantity(item._id, item.cartQuantity + 1);
                        } else {
                          alert('Not enough stock!');
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-gray-50 hover:text-emerald-600 text-gray-400 transition-all"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer Area */}
        <div className="p-8 bg-white/80 border-t border-gray-100 backdrop-blur-xl rounded-b-[2.5rem]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-400 font-black uppercase tracking-widest text-xs mb-1">Total Amount</span>
            <span className="text-5xl font-black text-gray-900 tracking-tighter">₹{cartTotal().toLocaleString()}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-gray-300 disabled:to-gray-200 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            {/* The Magic Shine Effect */}
            {!isCheckingOut && cart.length > 0 && (
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            )}
            
            <div className="relative z-10 flex items-center gap-3">
              {isCheckingOut ? (
                <Sparkles className="animate-spin" size={22} />
              ) : (
                <CreditCard size={22} strokeWidth={2.5} />
              )}
              <span className="text-lg tracking-wide font-extrabold">{isCheckingOut ? 'Processing Payment...' : 'Checkout & Pay'}</span>
            </div>
          </button>
        </div>
      </div>
      
    </div>
  );
}