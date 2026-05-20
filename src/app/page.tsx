'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShoppingCart, LayoutDashboard, Package, Sparkles, Zap, LogOut, Users, BarChart3 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const sessionContext = useSession(); 
  const session = sessionContext?.data;
  const router = useRouter();

  // 🛡️ Protected Navigation Logic
  const handleProtectedNavigation = (path: string) => {
    const isAdmin = (session?.user as any)?.role === 'Admin';
    
    if (!isAdmin) {
      toast.error("Access Denied: Admin role required! 🚫", {
        style: {
          borderRadius: '16px',
          background: '#1e293b',
          color: '#fff',
          fontWeight: 'bold',
          border: '1px solid #f43f5e'
        },
        duration: 4000
      });
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 bg-slate-50">
      
      {/* Toaster Container for Alerts */}
      <Toaster position="top-center" />

      {/* Floating Logout Button */}
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-md hover:bg-rose-50 text-gray-700 hover:text-rose-600 font-extrabold text-xs sm:text-sm rounded-xl border border-gray-200/50 shadow-sm transition-all active:scale-95 z-50"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>

      {/* SaaS Background with Grid & Animated Glowing Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/30 blur-[120px] animate-pulse duration-1000"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] animate-pulse delay-700 duration-1000"></div>

      {/* Main Ultra-Premium Glass Card (🛠️ FIX: Increased width slightly to accommodate features grid) */}
      <div className="relative z-10 w-full max-w-[600px] bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-8 md:p-12 text-center transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.15)]">
        
        {/* Pro Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
          <Zap size={14} className="fill-emerald-500 text-emerald-500" />
          <span>Enterprise Edition</span>
        </div>

        {/* Animated Sparkle Logo Container */}
        <div className="relative inline-block mb-6 group">
          <div className="absolute inset-0 bg-emerald-400/30 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-md"></div>
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 md:w-24 md:h-24 rounded-[2rem] rotate-3 group-hover:-rotate-3 flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 transition-all duration-500">
            <ShoppingCart className="text-white drop-shadow-md" size={40} strokeWidth={2.5} />
            <Sparkles className="absolute -top-3 -right-3 text-yellow-300 animate-bounce drop-shadow-sm" size={24} />
          </div>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter">
          NexPOS
        </h1>
        <p className="text-gray-500 mb-8 text-sm md:text-base font-medium leading-relaxed px-2">
          Transform your retail business with a powerful all-in-one system designed for fast checkouts, smart stock tracking, and customer management.
        </p>

        {/* 🛠️ NAYA: SaaS Feature Explainer Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          
          <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3 transition-colors hover:bg-emerald-50">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600"><ShoppingCart size={18}/></div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-gray-800">Quick POS</h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500">Fast thermal billing</p>
            </div>
          </div>
          
          <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl flex items-center gap-3 transition-colors hover:bg-blue-50">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-600"><Package size={18}/></div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-gray-800">Live Inventory</h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500">Auto stock updates</p>
            </div>
          </div>

          <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-2xl flex items-center gap-3 transition-colors hover:bg-purple-50">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-purple-600"><Users size={18}/></div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-gray-800">Khata & CRM</h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500">Manage customer dues</p>
            </div>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-2xl flex items-center gap-3 transition-colors hover:bg-rose-50">
            <div className="bg-white p-2.5 rounded-xl shadow-sm text-rose-600"><BarChart3 size={18}/></div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-gray-800">Smart Analytics</h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-500">Real-time reports</p>
            </div>
          </div>

        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/pos" 
            className="group relative overflow-hidden flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 p-4 rounded-2xl font-bold text-lg shadow-[0_8px_20px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
            <ShoppingCart size={22} className="relative z-10" />
            <span className="relative z-10">Open POS Terminal</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              onClick={() => handleProtectedNavigation('/dashboard')}
              className="group flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-600 hover:text-emerald-700 py-3.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform text-emerald-500" />
              Dashboard
            </button>
            
            <button 
              onClick={() => handleProtectedNavigation('/inventory')}
              className="group flex items-center justify-center gap-2 w-full bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-600 hover:text-emerald-700 py-3.5 rounded-xl font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Package size={18} className="group-hover:scale-110 transition-transform text-emerald-500" />
              Inventory
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
            System Online • Powered by Vercel
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}