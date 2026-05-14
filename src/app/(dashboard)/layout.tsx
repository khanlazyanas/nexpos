'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Menu, Zap } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'POS Billing', href: '/pos', icon: ShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: Package },
  ];

  return (
    <div className="min-h-screen relative flex overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 bg-slate-50">
      
      {/* SaaS Background with Grid & Animated Glowing Orbs (Shared across all pages) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 blur-[120px] animate-pulse duration-1000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] animate-pulse delay-700 duration-1000 pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Floating Premium Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 h-full lg:h-[calc(100vh-2rem)] lg:my-4 lg:ml-4 bg-white/70 backdrop-blur-2xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-r-3xl lg:rounded-[2.5rem] transform transition-transform duration-500 ease-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center px-8 border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 blur-sm"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-lg transition-transform duration-500">
                <ShoppingCart className="text-white" size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent tracking-tighter">NexPOS</h1>
              <div className="inline-flex items-center gap-1 mt-0.5">
                <Zap size={10} className="fill-emerald-500 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Pro Edition</span>
              </div>
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
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-700 shadow-sm border border-emerald-100/50' 
                    : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
                <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-gray-400'}`} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Bottom Profile/Info Section */}
        <div className="p-4 m-4 bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 font-bold border border-emerald-100">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
              <p className="text-xs font-semibold text-gray-400 truncate">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white/70 backdrop-blur-2xl border-b border-white flex items-center justify-between px-6 z-30 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-md">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent">NexPOS</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 scroll-smooth z-10">
          <div className="max-w-[1600px] mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}