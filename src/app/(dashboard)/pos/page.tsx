'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, ScanBarcode, Receipt } from 'lucide-react';

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

  // Premium Skeleton for Products
  const ProductSkeleton = () => (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-5 animate-pulse">
      <div className="h-12 bg-gray-200/60 rounded-xl mb-3"></div>
      <div className="h-4 w-2/3 bg-gray-200/60 rounded-md mb-6"></div>
      <div className="flex justify-between items-end">
        <div className="h-6 w-16 bg-gray-200/60 rounded-md"></div>
        <div className="h-6 w-20 bg-gray-200/60 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] lg:h-[calc(100vh-120px)] animate-in fade-in duration-500">
      
      {/* LEFT SIDE: Products Section (65%) */}
      <div className="flex-1 flex flex-col gap-5 h-full">
        
        {/* Floating Search Bar */}
        <div className="relative group z-10">
          <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-2 flex items-center">
            <div className="bg-gray-100/50 p-3 rounded-xl text-gray-400 ml-1">
              <ScanBarcode size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Search by product name or scan barcode..." 
              className="w-full bg-transparent pl-4 pr-4 py-3 outline-none text-gray-700 font-medium placeholder:text-gray-400 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto pb-4 pr-2 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock_quantity === 0;
                return (
                  <div 
                    key={product._id} 
                    onClick={() => !isOutOfStock && addToCart(product)}
                    className={`group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 border ${
                      isOutOfStock 
                        ? 'bg-gray-50/50 border-gray-200/50 opacity-60 cursor-not-allowed grayscale' 
                        : 'bg-white/70 backdrop-blur-2xl border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] hover:-translate-y-1 hover:border-emerald-200'
                    }`}
                  >
                    {!isOutOfStock && (
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all duration-500"></div>
                    )}
                    
                    <h3 className="font-extrabold text-gray-800 line-clamp-2 min-h-[3rem] text-lg leading-tight relative z-10">{product.name}</h3>
                    <p className="text-xs font-mono text-gray-400 mt-2 mb-4 relative z-10">{product.barcode_sku}</p>
                    
                    <div className="flex justify-between items-end relative z-10">
                      <span className="font-black text-xl text-emerald-600">₹{product.price}</span>
                      <span className={`text-xs px-3 py-1.5 rounded-xl font-bold ${
                        isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100/80 text-emerald-700'
                      }`}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stock_quantity} left`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Cart / Billing Section (35%) */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden h-full">
        
        {/* Cart Header */}
        <div className="p-6 border-b border-gray-100/50 bg-white/50 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <Receipt size={24} />
            </div>
            Current Bill
          </h2>
          <span className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
            {cart.length} Items
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingCart size={40} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
              <p className="text-sm">Scan a barcode or click a product to add</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="group flex flex-col gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-100">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-sm line-clamp-2 flex-1 pr-4 leading-tight">{item.name}</h4>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <p className="font-black text-emerald-600 text-lg">₹{(item.price * item.cartQuantity).toLocaleString()}</p>
                  
                  {/* Modern Quantity Controls */}
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200/60">
                    <button 
                      onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                      className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                    >
                      <Minus size={16} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center font-bold text-gray-800">{item.cartQuantity}</span>
                    <button 
                      onClick={() => {
                        if(item.cartQuantity < item.stock_quantity) {
                          updateQuantity(item._id, item.cartQuantity + 1);
                        } else {
                          alert('Not enough stock!');
                        }
                      }}
                      className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-emerald-50/30 border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Grand Total</span>
            <span className="text-4xl font-black text-gray-900 tracking-tight">₹{cartTotal().toLocaleString()}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full relative overflow-hidden group bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20 active:scale-[0.98]"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 disabled:hidden"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <CreditCard size={22} />
              <span className="text-lg tracking-wide">{isCheckingOut ? 'Processing Payment...' : 'Checkout & Pay'}</span>
            </div>
          </button>
        </div>
      </div>
      
    </div>
  );
}