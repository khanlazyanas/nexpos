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
      toast.error("Access Denied: Admin role required! 🚫", {
        style: {
          borderRadius: '16px',
          background: '#1e293b',
          color: '#fff',
          fontWeight: 'bold',
          border: '1px solid #f43f5e',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)'
        },
        duration: 4000
      });
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 bg-[#f8fafc] font-sans">
      
      {/* Toaster Container for Alerts */}
      <Toaster position="top-center" />

      {/* Floating Logout Button */}
      <button 
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-xl hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-bold text-sm rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-rose-100 hover:-translate-y-0.5 active:scale-95 z-50"
      >
        <LogOut size={16} strokeWidth={2.5} />
        <span>Logout</span>
      </button>

      {/* Ultra-Premium SaaS Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] -z-10 m-auto h-[310px] w-[310px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse duration-[3000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-teal-400/20 blur-[120px] animate-pulse delay-1000 duration-[4000ms]"></div>

      {/* Main Ultra-Premium Glass Card */}
      <div className="relative z-10 w-full max-w-[640px] bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border border-white p-8 md:p-14 text-center transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.12)] hover:-translate-y-1">
        
        {/* Pro Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 border border-emerald-100/50 shadow-sm text-emerald-700 text-xs font-extrabold tracking-widest uppercase mb-8 backdrop-blur-md">
          <Zap size={14} className="fill-emerald-500 text-emerald-500 animate-pulse" />
          <span>Enterprise Edition</span>
        </div>

        {/* Animated Sparkle Logo Container */}
        <div className="relative inline-block mb-8 group">
          <div className="absolute inset-0 bg-emerald-400/30 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-xl"></div>
          <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] rotate-3 group-hover:-rotate-3 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 transition-all duration-500 border border-white/20">
            <ShoppingCart className="text-white drop-shadow-lg" size={40} strokeWidth={2.5} />
            <Sparkles className="absolute -top-3 -right-3 text-yellow-300 animate-bounce drop-shadow-sm" size={24} />
          </div>
        </div>
        
        {/* Welcome Text */}
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
          NexPOS
        </h1>
        <p className="text-gray-500 mb-10 text-base md:text-lg font-medium leading-relaxed px-4 md:px-8">
          The ultimate control center for your retail business. Lightning-fast checkouts, intelligent stock tracking, and seamless customer management.
        </p>

        {/* 🚀 Ultra-Premium Interactive Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10 text-left">
          
          <div className="group bg-white/50 border border-white hover:border-emerald-100 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)] hover:-translate-y-1">
            <div className="bg-emerald-50 p-2.5 rounded-xl shadow-sm text-emerald-600 group-hover:scale-110 transition-transform"><ShoppingCart size={20}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Quick POS</h3>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Fast thermal billing</p>
            </div>
          </div>
          
          <div className="group bg-white/50 border border-white hover:border-blue-100 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(59,130,246,0.12)] hover:-translate-y-1">
            <div className="bg-blue-50 p-2.5 rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform"><Package size={20}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Live Inventory</h3>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Auto stock updates</p>
            </div>
          </div>

          <div className="group bg-white/50 border border-white hover:border-purple-100 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(168,85,247,0.12)] hover:-translate-y-1">
            <div className="bg-purple-50 p-2.5 rounded-xl shadow-sm text-purple-600 group-hover:scale-110 transition-transform"><Users size={20}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Khata & CRM</h3>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Manage regular clients</p>
            </div>
          </div>

          <div className="group bg-white/50 border border-white hover:border-rose-100 p-4 rounded-[1.5rem] flex items-start gap-4 transition-all duration-300 hover:bg-white hover:shadow-[0_8px_30px_rgb(244,63,94,0.12)] hover:-translate-y-1">
            <div className="bg-rose-50 p-2.5 rounded-xl shadow-sm text-rose-600 group-hover:scale-110 transition-transform"><BarChart3 size={20}/></div>
            <div>
              <h3 className="text-sm font-black text-gray-900 tracking-tight">Smart Analytics</h3>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">Real-time daily reports</p>
            </div>
          </div>

        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <Link 
            href="/pos" 
            className="group relative overflow-hidden flex items-center justify-center gap-3 w-full bg-gray-900 text-white hover:bg-emerald-600 py-4 p-4 rounded-2xl font-black text-lg shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_25px_-6px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            <ShoppingCart size={22} className="relative z-10" />
            <span className="relative z-10 tracking-wide">OPEN POS TERMINAL</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              onClick={() => handleProtectedNavigation('/dashboard')}
              className="group flex items-center justify-center gap-2 w-full bg-white/80 backdrop-blur-md border border-gray-200 hover:border-gray-300 hover:bg-white text-gray-700 py-4 rounded-2xl font-bold transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <LayoutDashboard size={18} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              Dashboard
            </button>
            
            <button 
              onClick={() => handleProtectedNavigation('/inventory')}
              className="group flex items-center justify-center gap-2 w-full bg-white/80 backdrop-blur-md border border-gray-200 hover:border-gray-300 hover:bg-white text-gray-700 py-4 rounded-2xl font-bold transition-all shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Package size={18} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
              Inventory
            </button>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">System Online</span>
          </div>
          <span className="hidden sm:inline text-gray-300">•</span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold tracking-widest uppercase">Secured by Next-Auth</span>
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