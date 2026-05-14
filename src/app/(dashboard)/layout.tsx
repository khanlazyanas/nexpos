'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Menu, X, Store } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'POS Billing', href: '/pos', icon: ShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Mobile Sidebar Overlay (Glassmorphism) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Ultra Premium UI */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/60 shadow-2xl lg:shadow-none transform transition-transform duration-500 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100/50 bg-gradient-to-r from-emerald-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
              <Store className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">NexPOS</h1>
              <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold">Pro Edition</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                )}
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Profile/Info Section */}
        <div className="p-4 m-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-700 font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#FAFAFA]">
        
        {/* Mobile Header (Only visible on small screens) */}
        <header className="lg:hidden h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-4 z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg shadow-sm">
              <Store className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">NexPOS</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}