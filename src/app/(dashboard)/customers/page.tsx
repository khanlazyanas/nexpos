'use client';

import { useState, useEffect } from 'react';
import { Search, Users, Loader2, IndianRupee, Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="relative h-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="text-emerald-500" size={32} />
            Customers & Khata
          </h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Manage regular clients and track due amounts.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Name or Phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500 font-bold text-gray-700 shadow-sm"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="flex-1 bg-white/70 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1 p-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-emerald-500" size={40} />
              <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Loading Customers...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer Details</th>
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Total Lifetime Value</th>
                  <th className="py-4 px-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Due Amount (Udhaar)</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-12 text-gray-400 font-bold">No customers found.</td></tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <UserCheck size={16} className="text-emerald-500"/> {customer.name}
                        </p>
                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5 mt-1">
                          <Phone size={12} className="text-gray-400"/> {customer.phone}
                        </p>
                      </td>
                      
                      <td className="py-4 px-4 text-center">
                        <span className="bg-gray-100 text-gray-700 font-black px-3 py-1.5 rounded-xl text-sm flex items-center justify-center gap-1 w-fit mx-auto">
                          <IndianRupee size={14}/> {customer.totalPurchases.toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {customer.dueAmount > 0 ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-black text-rose-600 text-lg flex items-center gap-1">
                              ₹{customer.dueAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-widest text-rose-400 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">Pending</span>
                          </div>
                        ) : (
                          <span className="font-black text-emerald-500 flex items-center justify-end gap-1">
                            Cleared ✨
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}