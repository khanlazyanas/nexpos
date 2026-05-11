import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Package } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-emerald-400">NexPOS</h2>
        <p className="text-xs text-gray-400 mt-1">Retail Management</p>
      </div>

      <nav className="space-y-4">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link href="/pos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <ShoppingCart size={20} />
          <span>POS Billing</span>
        </Link>

        <Link href="/inventory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Package size={20} />
          <span>Inventory</span>
        </Link>
      </nav>
    </div>
  );
}