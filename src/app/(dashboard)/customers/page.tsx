'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Loader2, IndianRupee, Phone, UserCheck, WalletCards } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('/api/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          toast.error("Failed to load customers");
        }
      } catch (error) {
        toast.error("Network error!");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const searchLower = searchQuery.toLowerCase();
    const phone = c.phone?.toLowerCase() || '';
    const name = c.name?.toLowerCase() || '';
    return phone.includes(searchLower) || name.includes(searchLower);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative z-10 pb-20 lg:pb-10">
      <Toaster />
      
      {/* 🌌 SaaS Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute right-0 top-0 -z-10 m-auto h-[300px] w-[300px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse duration-[3000ms]"></div>
      <div className="absolute left-[-5%] top-[20%] -z-10 h-[250px] w-[250px] rounded-full bg-teal-400/20 blur-[80px] animate-pulse delay-700 duration-[4000ms]"></div>

      {/* 1. Ultra-Premium Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            Customers CRM
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-2 text-sm md:text-base">
            Manage regular clients and track Khata (due amounts) <WalletCards size={18} className="text-emerald-500" />
          </p>
        </div>

        <div className="w-full md:w-96 group relative">
          <div className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by Name or Phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-xl border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:font-medium"
          />
        </div>
      </div>

      {/* 2. Main Table Container */}
      <div className="bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Customer Details</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Lifetime Value</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Khata Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={40} />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Syncing CRM Database...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-sm">No customers found. Process orders to build your CRM!</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-white transition-colors group">
                    
                    {/* Customer Info */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors border border-gray-100 group-hover:border-emerald-100">
                          <UserCheck size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{customer.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 mt-0.5 tracking-widest uppercase">
                            <Phone size={10} className="text-gray-300" /> {customer.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Lifetime Value */}
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center justify-center gap-1 bg-gray-50 border border-gray-100 text-gray-700 font-black px-4 py-2 rounded-xl text-sm shadow-sm group-hover:border-gray-200 transition-colors">
                        <IndianRupee size={14} className="text-emerald-500"/> {customer.totalPurchases.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Khata / Due Amount */}
                    <td className="px-8 py-5 text-right">
                      {customer.dueAmount > 0 ? (
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-black text-rose-600 text-xl tracking-tighter flex items-center gap-0.5">
                            ₹{customer.dueAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] uppercase font-black tracking-widest text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100 shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping absolute"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 relative"></span>
                            Pending Due
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center justify-end gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm">
                          Cleared ✨
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}