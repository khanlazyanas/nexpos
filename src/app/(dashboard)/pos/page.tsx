'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

export default function POSPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false); // Checkout loading state

  // Zustand Store se functions aur data nikalna (clearCart add kiya)
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

  // Naya Checkout Function
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
        clearCart(); // Cart khali karein
        fetchProducts(); // Products list ko refresh karein taaki naya stock dikhe
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

  // Search filter
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode_sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      
      {/* LEFT SIDE: Products Section */}
      <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4 items-center bg-gray-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by product name or barcode..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <div 
                  key={product._id} 
                  onClick={() => product.stock_quantity > 0 && addToCart(product)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    product.stock_quantity === 0 ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-emerald-400'
                  }`}
                >
                  <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-12">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{product.barcode_sku}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-emerald-600">₹{product.price}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.stock_quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} left` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Cart / Billing Section */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={20} /> Current Order
          </h2>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
            {cart.length} Items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                  <p className="font-bold text-emerald-600 text-sm">₹{item.price}</p>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <button 
                    onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                    className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center font-semibold text-sm">{item.cartQuantity}</span>
                  <button 
                    onClick={() => {
                      if(item.cartQuantity < item.stock_quantity) {
                        updateQuantity(item._id, item.cartQuantity + 1);
                      } else {
                        alert('Not enough stock!');
                      }
                    }}
                    className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="p-1 rounded-md text-red-500 hover:bg-red-50 ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-gray-800">₹{cartTotal().toLocaleString()}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isCheckingOut}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <CreditCard size={20} />
            {isCheckingOut ? 'Processing...' : 'Checkout & Pay'}
          </button>
        </div>
      </div>
      
    </div>
  );
}