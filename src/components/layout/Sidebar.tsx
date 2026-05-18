'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, ShoppingCart, Package, Loader2 } from 'lucide-react';

export default function Sidebar() {
  const { data: session, status } = useSession();
  
  // 🛠️ FIX: TypeScript ko boldo ki user ke paas 'role' field hai (Casting to any)
  const isAdmin = (session?.user as any)?.role === 'Admin';

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-5 z-40 shadow-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-emerald-400 tracking-tight">NexPOS</h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
          {/* 🛠️ FIX: Yahan bhi as any lagana zaroori hai */}
          {status === 'loading' ? 'Verifying...' : `${(session?.user as any)?.role || 'Staff'} Mode`}
        </p>
      </div>

      <nav className="space-y-3">
        {/* 📊 Dashboard - Sirf Admin ko dikhega */}
        {status !== 'loading' && isAdmin && (
          <Link href="/orders" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-800/60 font-bold text-sm text-gray-300 hover:text-white transition-all">
            <LayoutDashboard size={18} className="text-emerald-400" />
            <span>Dashboard</span>
          </Link>
        )}
        
        {/* 🛒 POS Billing - Sabko dikhega (Admin + Cashier) */}
        <Link href="/pos" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-800/60 font-bold text-sm text-gray-300 hover:text-white transition-all">
          <ShoppingCart size={18} className="text-emerald-400" />
          <span>POS Billing</span>
        </Link>

        {/* 📦 Inventory - Sirf Admin ko dikhega */}
        {status !== 'loading' && isAdmin && (
          <Link href="/inventory" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-800/60 font-bold text-sm text-gray-300 hover:text-white transition-all">
            <Package size={18} className="text-emerald-400" />
            <span>Inventory</span>
          </Link>
        )}

        {/* Loading Skeleton if session state is fetching */}
        {status === 'loading' && (
          <div className="pt-4 flex items-center justify-center text-gray-500">
            <Loader2 size={20} className="animate-spin text-emerald-500/50" />
          </div>
        )}
      </nav>
    </div>
  );
}