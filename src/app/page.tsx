'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShoppingCart, LayoutDashboard, Package, Sparkles, Zap, LogOut, Users, BarChart3, ShieldCheck } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const sessionContext = useSession(); 
  const session = sessionContext?.data;
  const router = useRouter();

  // 🛡️ Protected Navigation Logic
  const handleProtectedNavigation = (path: string) => {
    const isAdmin = (session?.user as any)?.role === 'Admin';
    
    if (!isAdmin) {
      toast.error("Access Denied: Admin privileges required! 🚫", {
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontWeight: '900',
          border: '1px solid #e11d48',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
          padding: '16px 20px'
        },
        duration: 4000
      });
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-[100dvh] relative flex items-center justify-center p-4 sm:p-8 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 bg-[#f4f7f6] font-sans antialiased">
      
      <Toaster position="top-center" />

      {/* Floating Logout Button */}
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 bg-white/70 backdrop-blur-2xl hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-black text-xs uppercase tracking-widest rounded-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-rose-100 hover:-translate-y-0.5 active:scale-95 z-50 ring-1 ring-black/5"
      >
        <LogOut size={16} strokeWidth={3} />
        <span className="hidden sm:inline">Logout</span>
      </button>

      {/* 🌌 Ultra-Premium Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] -z-20 mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)"></div>
      
      <div className="absolute left-[20%] top-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400 opacity-20 blur-[120px] animate-pulse duration-[5000ms] mix-blend-multiply"></div>
      <div className="absolute right-[10%] bottom-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-teal-300/30 blur-[150px] animate-pulse delay-1000 duration-[7000ms] mix-blend-multiply"></div>

      {/* Main Ultra-Premium Glass Card */}
      <div className="relative z-10 w-full max-w-[640px] bg-white/40 backdrop-blur-3xl backdrop-saturate-200 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-white/60 p-8 md:p-14 text-center transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.15)] ring-1 ring-white">
        
        {/* Pro Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 border border-emerald-100/50 shadow-sm text-emerald-700 text-[10px] font-black tracking-[0.2em] uppercase mb-8 backdrop-blur-md">
          <Zap size={14} className="fill-emerald-500 text-emerald-500 animate-pulse" />
          <span>Enterprise Edition</span>
        </div>

        {/* Animated Sparkle Logo Container */}
        <div className="relative inline-block mb-8 group">
          <div className="absolute inset-0 bg-emerald-400/40 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-700 blur-xl mix-blend-multiply"></div>
          <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-teal-700 w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] rotate-3 group-hover:-rotate-3 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 transition-all duration-500 border border-white/30 backdrop-blur-xl">
            <ShoppingCart className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" size={40} strokeWidth={2.5} />
            <Sparkles className="absolute -top-4 -right-4 text-yellow-300 animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" size={28} />
          </div>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent tracking-tighter drop-shadow-sm">
          NexPOS
        </h1>
        <p className="text-gray-500 mb-12 text-sm md:text-base font-semibold leading-relaxed px-4 md:px-8 max-w-lg mx-auto">
          The ultimate control center for your retail business. Lightning-fast checkouts, intelligent stock tracking, and seamless customer management.
        </p>

        {/* 🚀 Ultra-Premium Interactive Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12 text-left">
          
          <div className="group bg-white/40 border border-white/60 hover:border-emerald-200/60 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] hover:-translate-y-1">
            <div className="bg-emerald-50/80 p-3 rounded-2xl shadow-sm text-emerald-600 group-hover:scale-110 transition-transform duration-300"><ShoppingCart size={22} strokeWidth={2.5}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Quick POS</h3>
              <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Thermal Billing</p>
            </div>
          </div>
          
          <div className="group bg-white/40 border border-white/60 hover:border-blue-200/60 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-1">
            <div className="bg-blue-50/80 p-3 rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300"><Package size={22} strokeWidth={2.5}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Live Inventory</h3>
              <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Auto Updates</p>
            </div>
          </div>

          <div className="group bg-white/40 border border-white/60 hover:border-purple-200/60 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(168,85,247,0.12)] hover:-translate-y-1">
            <div className="bg-purple-50/80 p-3 rounded-2xl shadow-sm text-purple-600 group-hover:scale-110 transition-transform duration-300"><Users size={22} strokeWidth={2.5}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Khata CRM</h3>
              <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Client Ledger</p>
            </div>
          </div>

          <div className="group bg-white/40 border border-white/60 hover:border-rose-200/60 p-5 rounded-[1.5rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(244,63,94,0.12)] hover:-translate-y-1">
            <div className="bg-rose-50/80 p-3 rounded-2xl shadow-sm text-rose-600 group-hover:scale-110 transition-transform duration-300"><BarChart3 size={22} strokeWidth={2.5}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Analytics</h3>
              <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Real-time Data</p>
            </div>
          </div>

        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/pos" 
            className="group relative overflow-hidden flex items-center justify-center gap-3 w-full bg-gray-900 text-white hover:bg-emerald-600 py-5 p-4 rounded-[1.5rem] font-black text-sm tracking-widest uppercase shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            <ShoppingCart size={20} strokeWidth={2.5} className="relative z-10" />
            <span className="relative z-10">Launch POS Terminal</span>
            <ArrowRight size={18} strokeWidth={3} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
          </Link>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              onClick={() => handleProtectedNavigation('/dashboard')}
              className="group flex items-center justify-center gap-2 w-full bg-white/60 backdrop-blur-md border border-white hover:border-gray-200 hover:bg-white text-gray-700 py-4.5 rounded-[1.2rem] font-bold text-sm transition-all shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <LayoutDashboard size={18} strokeWidth={2.5} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              Dashboard
            </button>
            
            <button 
              onClick={() => handleProtectedNavigation('/inventory')}
              className="group flex items-center justify-center gap-2 w-full bg-white/60 backdrop-blur-md border border-white hover:border-gray-200 hover:bg-white text-gray-700 py-4.5 rounded-[1.2rem] font-bold text-sm transition-all shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Package size={18} strokeWidth={2.5} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              Inventory
            </button>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-12 pt-6 border-t border-gray-200/50 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50/80 rounded-full border border-emerald-100 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black tracking-widest text-emerald-700 uppercase">System Online</span>
          </div>
          <span className="hidden sm:inline text-gray-300">•</span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck size={16} strokeWidth={2.5} />
            <span className="text-[10px] font-black tracking-widest uppercase">Secured by Next-Auth</span>
          </div>
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