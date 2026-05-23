'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Zap, Lock, Receipt, Users, Settings, Home } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { data: session, status } = useSession();
  
  // 🛠️ SAFE TYPE CASTING FOR VERCEL BUILD PASS
  const user = session?.user as any; 
  const isAdmin = user?.role === 'Admin';
  
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    if (onClose) onClose(); 
    if (!isAdmin) {
      toast.error("Access Denied: Admin privileges required! 🚫", {
        style: { 
          borderRadius: '16px', 
          background: '#0f172a', 
          color: '#fff', 
          fontWeight: '900', 
          border: '1px solid #e11d48',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
        }
      });
      return;
    }
    router.push(path);
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, isProtected: true },
    { name: 'POS Billing', href: '/pos', icon: ShoppingCart, isProtected: false },
    { name: 'Inventory', href: '/inventory', icon: Package, isProtected: true },
    { name: 'Order History', href: '/orders', icon: Receipt, isProtected: false },
    { name: 'Customers & Khata', href: '/customers', icon: Users, isProtected: false },
    { name: 'Store Settings', href: '/settings', icon: Settings, isProtected: true },
    { name: 'NexPOS Home', href: '/', icon: Home, isProtected: false },
  ];

  return (
    <aside className="w-72 h-full bg-white/40 backdrop-blur-3xl backdrop-saturate-200 border-r border-white/60 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.05)] lg:rounded-r-[2.5rem] flex flex-col justify-between overflow-hidden relative z-50">
      
      <Toaster position="top-right" />
      
      {/* 🌌 Background ambient glows for depth */}
      <div className="absolute top-[-5%] left-[-10%] w-48 h-48 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-20%] w-40 h-40 bg-teal-400/20 rounded-full blur-[60px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* 🚀 Brand Logo Area */}
        <div className="h-28 flex items-center px-8 border-b border-white/40 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-400/40 rounded-[1.2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-md"></div>
              <div className="relative bg-gradient-to-br from-emerald-400 via-teal-500 to-teal-700 p-3 rounded-[1.2rem] shadow-xl shadow-emerald-500/20 border border-white/20 group-hover:-rotate-3 transition-all duration-500">
                <ShoppingCart className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tighter drop-shadow-sm leading-none">
                NexPOS
              </h1>
              <div className="inline-flex items-center gap-1.5 mt-1.5 bg-white/60 px-2 py-0.5 rounded-md border border-white shadow-sm w-fit">
                <Zap size={10} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
                  {status === 'loading' ? 'Syncing...' : `${user?.role || 'Staff'} Mode`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 🧭 Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            const commonClasses = `flex items-center justify-between w-full px-5 py-4 rounded-[1.2rem] transition-all duration-300 group relative overflow-hidden outline-none ${
              isActive 
                ? 'bg-white/80 shadow-[0_8px_20px_rgb(0,0,0,0.04)] border border-white text-emerald-700' 
                : 'text-gray-500 hover:bg-white/40 hover:text-gray-900 border border-transparent'
            }`;

            const Content = () => (
              <>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.6)]" />}
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-transparent text-gray-400 group-hover:bg-white/60 group-hover:text-emerald-500'}`}>
                    <Icon size={20} strokeWidth={2.5} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-active:scale-95'}`} />
                  </div>
                  <span className={`text-sm tracking-wide transition-all ${isActive ? 'font-black' : 'font-bold'}`}>{item.name}</span>
                </div>
                {status !== 'loading' && item.isProtected && !isAdmin && (
                  <Lock size={14} strokeWidth={3} className="text-gray-300 group-hover:text-rose-400 transition-colors relative z-10" />
                )}
              </>
            );
            
            if (item.isProtected) {
              return (
                <button key={item.name} onClick={() => handleNavigation(item.href)} className={`${commonClasses} cursor-pointer active:scale-[0.98]`}>
                  <Content />
                </button>
              );
            }
            
            return (
              <Link key={item.name} href={item.href} onClick={() => onClose && onClose()} className={`${commonClasses} active:scale-[0.98]`}>
                <Content />
              </Link>
            );
          })}
        </nav>

        {/* 👤 User Profile Widget */}
        <div className="p-4 shrink-0">
          <div className="bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 rounded-[1.5rem] flex items-center gap-4 group hover:bg-white/80 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-default relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl -z-10 group-hover:bg-emerald-400/20 transition-all"></div>
            <div className="h-11 w-11 rounded-[1rem] bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-black border border-emerald-200 shadow-sm text-lg uppercase group-hover:scale-105 transition-transform">
              {status === 'loading' ? '...' : user?.name ? user.name[0] : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate tracking-tight">
                {status === 'loading' ? 'Fetching...' : user?.name || 'NexPOS Staff'}
              </p>
              <p className="text-[10px] font-bold text-gray-400 truncate tracking-widest uppercase mt-0.5">
                {status === 'loading' ? 'Loading...' : `${user?.role || 'Staff'} Member`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}