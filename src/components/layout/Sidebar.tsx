'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Loader2, Lock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // 🔥 Toast Notification Import

export default function Sidebar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const isAdmin = (session?.user as any)?.role === 'Admin';

  // 🛡️ Sidebar Protected Navigation
  const handleNavigation = (path: string) => {
    if (!isAdmin) {
      toast.error("Access Denied: Admin role required! 🚫", {
        style: { borderRadius: '12px', background: '#1e293b', color: '#fff', fontWeight: 'bold' }
      });
      return;
    }
    router.push(path);
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-5 z-40 shadow-xl">
      
      {/* Local Toaster to render sidebar notifications over layout */}
      <Toaster position="top-right" />

      <div className="mb-8">
        <h2 className="text-2xl font-black text-emerald-400 tracking-tight">NexPOS</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
          {status === 'loading' ? 'Verifying...' : `${(session?.user as any)?.role || 'Staff'} Mode`}
        </p>
      </div>

      <nav className="space-y-3">
        
        {/* 📊 Dashboard Button */}
        {status !== 'loading' && (
          <button 
            onClick={() => handleNavigation('/orders')}
            className={`flex items-center justify-between w-full p-3.5 rounded-xl font-bold text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all cursor-pointer text-left`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} className="text-emerald-400" />
              <span>Dashboard</span>
            </div>
            {!isAdmin && <Lock size={14} className="text-rose-400" />}
          </button>
        )}
        
        {/* 🛒 POS Billing - Open for all roles */}
        <Link href="/pos" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-800/60 font-bold text-sm text-gray-300 hover:text-white transition-all">
          <ShoppingCart size={18} className="text-emerald-400" />
          <span>POS Billing</span>
        </Link>

        {/* 📦 Inventory Button */}
        {status !== 'loading' && (
          <button 
            onClick={() => handleNavigation('/inventory')}
            className={`flex items-center justify-between w-full p-3.5 rounded-xl font-bold text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all cursor-pointer text-left`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} className="text-emerald-400" />
              <span>Inventory</span>
            </div>
            {!isAdmin && <Lock size={14} className="text-rose-400" />}
          </button>
        )}

        {/* Loading Skeleton */}
        {status === 'loading' && (
          <div className="pt-4 flex items-center justify-center text-gray-500">
            <Loader2 size={20} className="animate-spin text-emerald-500/50" />
          </div>
        )}
      </nav>
    </div>
  );
}