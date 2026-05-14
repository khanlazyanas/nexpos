import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        
        {/* Logo Icon */}
        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingCart className="text-emerald-600" size={40} />
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">NexPOS</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The Next-Gen Digital Point of Sale & Inventory Management System for your business.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/pos" 
            className="flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Open POS Terminal <ArrowRight size={20} />
          </Link>
          
          <Link 
            href="/inventory" 
            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 hover:border-emerald-500 hover:text-emerald-600 text-gray-600 py-3.5 rounded-xl font-bold transition-all"
          >
            Manage Inventory
          </Link>
        </div>

      </div>
    </div>
  );
}