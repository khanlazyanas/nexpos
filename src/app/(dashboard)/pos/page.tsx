'use client';

import { useState, useEffect } from 'react';
import { IProduct } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Search, ShoppingCart, Plus, Minus, Trash2, CreditCard, ScanBarcode, Receipt, Sparkles, Zap, Printer, CheckCircle2, X, User, Phone, Percent, Banknote, QrCode } from 'lucide-react';

// Razorpay SDK Load karne ka function
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

  // Receipt States
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

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

  // 🧮 Finance Calculations
  const subTotal = cartTotal();
  const taxAmount = applyTax ? Math.round(subTotal * 0.18) : 0; 
  const finalTotal = Math.max(0, subTotal + taxAmount - discount);

  // 💾 Database me Order Save karne ka function
  const saveOrderToDatabase = async (orderId: string, orderDate: string, transactionId: string = 'CASH') => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          orderId,
          customerName,
          customerMobile,
          subTotal,
          discount,
          tax: taxAmount,
          totalAmount: finalTotal,
          paymentMethod,
          transactionId
        })
      });

      if (response.ok) {
        setReceiptData({
          items: [...cart],
          subTotal, discount, taxAmount, finalTotal,
          date: orderDate,
          orderId, customerName, customerMobile, paymentMethod, transactionId
        });

        clearCart();
        setCustomerName('');
        setCustomerMobile('');
        setDiscount(0);
        setApplyTax(false);
        setPaymentMethod('Cash');
        fetchProducts(); 
        setShowReceipt(true);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Checkout fail ho gaya!');
      }
    } catch (error) {
      console.error("Save Order Error:", error);
      alert('Order save karne me problem aayi.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // 🚀 Main Checkout Logic (Cash vs Online)
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    const orderDate = new Date().toLocaleString('en-IN');

    // Agar Cash hai, toh direct Database me save karo
    if (paymentMethod === 'Cash') {
      await saveOrderToDatabase(orderId, orderDate);
      return;
    }

    // Agar Online Payment hai, toh Razorpay open karo
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK load nahi hua. Check your internet.');
      setIsCheckingOut(false);
      return;
    }

    try {
      // Backend se Razorpay Order ID mangwana
      const orderResponse = await fetch('/api/razorpay', {
        method: 'POST',
        body: JSON.stringify({ amount: finalTotal })
      });
      const orderData = await orderResponse.json();

      if (!orderData.success) {
        alert('Server error while creating payment.');
        setIsCheckingOut(false);
        return;
      }

      // Razorpay Popup Settings
      const options = {
        key: 'rzp_test_8YGiWeZrGctMwH',
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'NexPOS Store',
        description: 'Store Purchase',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Payment Success! Ab DB me save karo
          await saveOrderToDatabase(orderId, orderDate, response.razorpay_payment_id);
        },
        prefill: {
          name: customerName || 'Customer',
          contact: customerMobile || '9999999999',
        },
        theme: {
          color: '#10b981' // Tailwind Emerald 500
        },
        modal: {
          ondismiss: function() {
            setIsCheckingOut(false); // Modal close karne par loading hatana
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
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
      <div className="flex justify-between items-end"><div className="h-6 w-16 bg-gray-200/60 rounded-lg"></div><div className="h-5 w-20 bg-gray-200/60 rounded-full"></div></div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 h-[calc(100dvh-100px)] lg:h-[calc(100vh-100px)] relative z-10 animate-in fade-in duration-500">
      
      {/* ================= LEFT SIDE: Products Section ================= */}
      <div className="flex-1 h-[50%] lg:h-full flex flex-col bg-white/60 backdrop-blur-3xl rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
        <div className="p-3 sm:p-6 pb-3 border-b border-white/50 flex flex-col sm:flex-row gap-3 justify-between z-10 bg-white/30 shrink-0">
          <div className="flex justify-between w-full sm:w-auto items-center">
            <div>
              <h1 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tighter mb-0.5">Terminal</h1>
            </div>
            <span className="sm:hidden bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-lg font-bold">{filteredProducts.length} Items</span>
          </div>
          <div className="w-full sm:w-[300px]">
            <div className="bg-white/80 border border-gray-200 rounded-xl p-1 flex items-center shadow-sm">
              <ScanBarcode size={16} className="mx-2 text-gray-400" />
              <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent py-1.5 outline-none text-sm font-bold text-gray-800" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">{[1, 2, 3, 4, 5, 6].map(i => <ProductSkeleton key={i} />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map(product => {
                const isOutOfStock = product.stock_quantity === 0;
                return (
                  <div key={product._id} onClick={() => !isOutOfStock && addToCart(product)} className={`relative rounded-2xl p-3 sm:p-5 border select-none transition-all ${isOutOfStock ? 'bg-gray-50 opacity-60 grayscale' : 'bg-white shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer active:scale-95'}`}>
                    <h3 className="font-bold text-gray-800 line-clamp-2 text-sm sm:text-base leading-tight min-h-[2.5rem]">{product.name}</h3>
                    <div className="flex justify-between items-end mt-3">
                      <span className="font-black text-lg sm:text-xl text-emerald-600">₹{product.price}</span>
                      <span className={`text-[9px] px-1.5 py-1 rounded-md font-bold uppercase ${isOutOfStock ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>{isOutOfStock ? 'Empty' : `${product.stock_quantity} Left`}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE: Cart / Billing Section ================= */}
      <div className="w-full h-[50%] lg:h-full lg:w-[400px] xl:w-[420px] flex flex-col bg-white/60 backdrop-blur-3xl rounded-3xl sm:rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
        
        <div className="p-3 sm:p-6 pb-2 sm:pb-4 border-b border-white/50 bg-white/30 shrink-0 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2"><Receipt size={16} /> Billing</h2>
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">{cart.length} Items</span>
        </div>

        {/* Customer Details */}
        <div className="px-3 sm:px-6 py-2 bg-white/40 border-b border-gray-100 shrink-0 flex gap-2">
          <input type="text" placeholder="Customer Name" value={customerName} onChange={(e)=>setCustomerName(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-xs font-bold outline-none focus:border-emerald-400" />
          <input type="text" placeholder="Mobile No." value={customerMobile} onChange={(e)=>setCustomerMobile(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-xs font-bold outline-none focus:border-emerald-400" />
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2"><ShoppingCart size={32} className="opacity-30" /><p className="text-sm font-bold text-gray-500">Cart is empty</p></div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="flex flex-col p-3 bg-white border border-gray-100 shadow-sm rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-1 pr-2">{item.name}</h4>
                  <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-rose-500"><Trash2 size={14} /></button>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-black text-emerald-600 text-sm">₹{(item.price * item.cartQuantity).toLocaleString()}</p>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1 rounded-lg">
                    <button onClick={() => updateQuantity(item._id, item.cartQuantity - 1)} className="p-1 hover:bg-white rounded text-gray-500"><Minus size={12} /></button>
                    <span className="w-5 text-center font-bold text-xs">{item.cartQuantity}</span>
                    <button onClick={() => { if(item.cartQuantity < item.stock_quantity) updateQuantity(item._id, item.cartQuantity + 1); }} className="p-1 hover:bg-white rounded text-gray-500"><Plus size={12} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Finance & Checkout Area */}
        <div className="bg-white border-t border-gray-100 shrink-0">
          <div className="px-3 sm:px-6 py-2 border-b border-gray-100 flex justify-between bg-gray-50/50">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={applyTax} onChange={(e)=>setApplyTax(e.target.checked)} className="rounded text-emerald-500" />
              <span className="text-[10px] font-bold text-gray-600">+ 18% GST</span>
            </label>
            <input type="number" placeholder="Discount ₹" value={discount || ''} onChange={(e)=>setDiscount(Number(e.target.value))} className="w-20 text-[11px] font-bold border border-gray-200 rounded px-2 py-0.5 outline-none text-right text-rose-500" />
          </div>

          <div className="px-3 sm:px-6 py-2 flex gap-2">
            {['Cash', 'Card', 'UPI'].map(method => (
              <button key={method} onClick={()=>setPaymentMethod(method)} className={`flex-1 py-1.5 rounded-lg border-2 text-[10px] font-bold tracking-wide transition-all ${paymentMethod === method ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-500'}`}>
                {method}
              </button>
            ))}
          </div>

          <div className="p-3 sm:p-6 pt-1">
            <div className="flex justify-between items-end mb-2 sm:mb-4">
              <span className="text-emerald-600 font-bold uppercase text-[10px] sm:text-xs">Total</span>
              <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tighter">₹{finalTotal.toLocaleString()}</span>
            </div>
            
            <button onClick={handleCheckout} disabled={cart.length === 0 || isCheckingOut} className="w-full bg-emerald-500 disabled:bg-gray-300 text-white font-bold py-3 sm:py-4 rounded-xl shadow-md active:scale-[0.98] flex justify-center items-center gap-2">
              {isCheckingOut ? <Sparkles className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
              <span className="text-sm">Pay via {paymentMethod}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= RECEIPT MODAL ================= */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <style dangerouslySetInnerHTML={{__html: `@media print { body * { visibility: hidden; } #printable-receipt, #printable-receipt * { visibility: visible; position: absolute; left: 0; top: 0; } }`}} />
          <div id="printable-receipt" className="bg-white w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="bg-emerald-500 p-4 text-center text-white print:hidden">
              <CheckCircle2 size={32} className="mx-auto mb-1" />
              <h2 className="text-lg font-black">Success!</h2>
            </div>
            <div className="p-6 bg-white font-mono text-gray-800 text-xs">
              <h2 className="text-2xl font-black text-center mb-4">NexPOS</h2>
              <div className="border-b-2 border-dashed pb-2 mb-2 space-y-1">
                <div className="flex justify-between"><span>Bill:</span> <span>{receiptData.orderId}</span></div>
                <div className="flex justify-between"><span>Date:</span> <span>{receiptData.date}</span></div>
                {receiptData.customerName && <div className="flex justify-between"><span>Name:</span> <span>{receiptData.customerName}</span></div>}
              </div>
              <div className="space-y-1 mb-4">
                {receiptData.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between"><span className="line-clamp-1 flex-1">{item.cartQuantity}x {item.name}</span><span>₹{item.price * item.cartQuantity}</span></div>
                ))}
              </div>
              <div className="border-t-2 border-dashed pt-2 mb-2 space-y-1">
                <div className="flex justify-between"><span>Subtotal:</span> <span>₹{receiptData.subTotal}</span></div>
                {receiptData.taxAmount > 0 && <div className="flex justify-between"><span>GST:</span> <span>+₹{receiptData.taxAmount}</span></div>}
                {receiptData.discount > 0 && <div className="flex justify-between text-rose-500"><span>Disc:</span> <span>-₹{receiptData.discount}</span></div>}
              </div>
              <div className="border-t-2 border-gray-800 pt-2 mb-4 flex justify-between font-black text-sm">
                <span>TOTAL</span><span>₹{receiptData.finalTotal}</span>
              </div>
              <p className="text-center text-[10px] text-gray-500">Paid via {receiptData.paymentMethod}</p>
            </div>
            <div className="p-4 flex gap-2 bg-gray-50 print:hidden">
              <button onClick={() => setShowReceipt(false)} className="flex-1 p-2 bg-white border text-gray-600 rounded-lg font-bold">Close</button>
              <button onClick={() => window.print()} className="flex-1 p-2 bg-gray-900 text-white rounded-lg font-bold">Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}