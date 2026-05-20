'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Zap, Lock,Receipt,Users } from 'lucide-react';
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
      toast.error("Access Denied: Admin role required! 🚫", {
        style: { borderRadius: '16px', background: '#1e293b', color: '#fff', fontWeight: 'bold', border: '1px solid #f43f5e' }
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
  ];

  return (
    <aside className="w-72 h-full bg-white/70 backdrop-blur-2xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-r-3xl lg:rounded-[2.5rem] flex flex-col justify-between overflow-hidden">
      
      <Toaster position="top-right" />
      
      <div>
        <div className="h-24 flex items-center px-8 border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-lg">
                <ShoppingCart className="text-white" size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter">NexPOS</h1>
              <div className="inline-flex items-center gap-1 mt-0.5">
                <Zap size={10} className="fill-emerald-500 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {/* 🛠️ Error fixed: using safely casted 'user' variable */}
                  {status === 'loading' ? 'Syncing...' : `${user?.role || 'Staff'} Mode`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            if (item.isProtected) {
              return (
                <button key={item.name} onClick={() => handleNavigation(item.href)} className={`flex items-center justify-between w-full px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden cursor-pointer ${isActive ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                  <div className="flex items-center gap-4">
                    <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-gray-400'}`} />
                    <span className="font-bold text-sm tracking-wide">{item.name}</span>
                  </div>
                  {status !== 'loading' && !isAdmin && <Lock size={14} className="text-rose-400 animate-pulse" />}
                </button>
              );
            }
            
            return (
              <Link key={item.name} href={item.href} onClick={() => onClose && onClose()} className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-700 shadow-sm border border-emerald-100/50' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-gray-400'}`} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 m-4 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-black border border-emerald-100 uppercase">
             {/* 🛠️ Error fixed: using safely casted 'user' variable */}
            {status === 'loading' ? '...' : user?.name ? user.name[0] : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">
               {/* 🛠️ Error fixed: using safely casted 'user' variable */}
              {status === 'loading' ? 'Fetching...' : user?.name || 'NexPOS Staff'}
            </p>
            <p className="text-xs font-bold text-gray-400 truncate">
               {/* 🛠️ Error fixed: using safely casted 'user' variable */}
              {status === 'loading' ? 'Loading...' : `${user?.role || 'Staff'} Member`}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}