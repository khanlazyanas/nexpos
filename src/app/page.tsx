import Link from 'next/link';
import { ArrowRight, ShoppingCart, LayoutDashboard, Package, Sparkles, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 bg-slate-50">
      
      {/* 1. SaaS Background with Grid & Animated Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/30 blur-[120px] animate-pulse duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] animate-pulse delay-700 duration-1000"></div>

      {/* 2. Main Ultra-Premium Glass Card */}
      <div className="relative z-10 w-full max-w-[520px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-10 md:p-12 text-center transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)]">
        
        {/* Pro Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black tracking-widest uppercase mb-8 shadow-sm">
          <Zap size={14} className="fill-emerald-500 text-emerald-500" />
          <span>Pro Edition</span>
        </div>

        {/* Animated Sparkle Logo Container */}
        <div className="relative inline-block mb-8 group">
          <div className="absolute inset-0 bg-emerald-400/30 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-md"></div>
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 w-24 h-24 rounded-[2rem] rotate-3 group-hover:-rotate-3 flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 transition-all duration-500">
            <ShoppingCart className="text-white drop-shadow-md" size={44} strokeWidth={2.5} />
            <Sparkles className="absolute -top-3 -right-3 text-yellow-300 animate-bounce drop-shadow-sm" size={28} />
          </div>
        </div>
        
        {/* Welcome Text with Refined Typography */}
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter">
          NexPOS
        </h1>
        <p className="text-gray-500 mb-10 text-lg font-medium leading-relaxed px-2">
          The Next-Gen Digital Point of Sale & Inventory Management System.
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          {/* 3. Primary Button with Hover Shine Effect */}
          <Link 
            href="/pos" 
            className="group relative overflow-hidden flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4.5 p-4 rounded-2xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Shine Animation element */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            
            <ShoppingCart size={22} className="relative z-10" />
            <span className="relative z-10">Open POS Terminal</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <Link 
              href="/dashboard" 
              className="group flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-600 hover:text-emerald-700 py-3.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow"
            >
              <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform text-emerald-500" />
              Dashboard
            </Link>
            
            <Link 
              href="/inventory" 
              className="group flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-600 hover:text-emerald-700 py-3.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow"
            >
              <Package size={18} className="group-hover:scale-110 transition-transform text-emerald-500" />
              Inventory
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            System Online • Powered by Vercel
          </p>
        </div>

      </div>

      {/* Tailwind Custom Animation Injection for the Shine effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}