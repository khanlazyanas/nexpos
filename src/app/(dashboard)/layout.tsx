'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/layout/Sidebar'; // 🛠️ FIX: Utilizing our dynamic dynamic secure sidebar
import { ShoppingCart, Menu, Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen relative flex overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900 bg-slate-50">
      
      {/* SaaS Background Layout Orbs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 blur-[120px] animate-pulse duration-1000 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[120px] animate-pulse delay-700 duration-1000 pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay Guard */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🛠️ FIX: Dynamic Responsive Sidebar Wrapper injection */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-500 ease-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar />
      </div>

      {/* Main Container Content Canvas */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 h-screen overflow-hidden lg:pl-4">
        
        {/* Mobile Header Controller */}
        <header className="lg:hidden h-20 bg-white/70 backdrop-blur-2xl border-b border-white flex items-center justify-between px-6 z-30 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-md">
              <ShoppingCart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-700 bg-clip-text text-transparent">NexPOS</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Dynamic Inner Layout Body Render viewport */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 scroll-smooth z-10">
          <div className="max-w-[1600px] mx-auto h-full">
            {status === 'loading' ? (
              <div className="h-[70vh] flex flex-col items-center justify-center gap-2">
                <Loader2 className="animate-spin text-emerald-500" size={32} />
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Validating Guard State...</p>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </main>
    </div>
  );
}