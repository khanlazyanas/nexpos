import Link from 'next/link';
import { ArrowRight, ShoppingCart, LayoutDashboard, Package, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center p-4 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse transition-all duration-1000"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700 transition-all duration-1000"></div>
      <div className="absolute -left-10 bottom-1/4 w-72 h-72 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      {/* Main Premium Glass Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/80 p-10 md:p-12 text-center transform transition-all duration-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]">
        
        {/* Animated Sparkle Logo Container */}
        <div className="relative inline-block mb-8 group">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-500"></div>
          <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 group-hover:scale-110 transition-transform duration-500">
            <ShoppingCart className="text-white" size={44} strokeWidth={2.5} />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-bounce" size={24} />
          </div>
        </div>
        
        {/* Welcome Text with Gradient */}
        <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-600 bg-clip-text text-transparent tracking-tight">
          NexPOS
        </h1>
        <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed px-4">
          The Next-Gen Digital Point of Sale & Inventory Management System.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/pos" 
            className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:-translate-y-1"
          >
            <ShoppingCart size={22} />
            Open POS Terminal 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 w-full bg-white/80 border border-gray-200/80 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 py-3.5 rounded-2xl font-bold transition-all shadow-sm"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            
            <Link 
              href="/inventory" 
              className="flex items-center justify-center gap-2 w-full bg-white/80 border border-gray-200/80 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 py-3.5 rounded-2xl font-bold transition-all shadow-sm"
            >
              <Package size={18} />
              Inventory
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            Powered by Next.js & MongoDB
          </p>
        </div>

      </div>
    </div>
  );
}