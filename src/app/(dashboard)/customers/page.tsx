'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
import { Search, Users, Loader2, IndianRupee, Phone, UserCheck, WalletCards, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function CustomersPage() {
  const { data: session, status } = useSession(); 
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 📓 Khata Settlement States
  const [settleAmounts, setSettleAmounts] = useState<{ [key: string]: string }>({});
  const [isSettling, setIsSettling] = useState<string | null>(null);

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
    // Sirf tabhi fetch karo jab user authenticated ho
    if (status === 'authenticated') {
      fetchCustomers();
    }
  }, [status]);

  // 🔐 ADMIN SECURITY CHECK
  if (status === 'loading') {
    return <div className="h-[80vh] flex justify-center items-center"><Loader2 size={48} className="animate-spin text-emerald-500" /></div>;
  }

  // 🛠️ FIX: TypeScript Vercel Build Error Bypass
  // TypeScript ko bol rahe hain ki "session.user ko 'any' maan lo, main janta hu isme kya hai"
  const user = session?.user as any; 
  
  const isAdmin = user?.role === 'Admin' || user?.email === 'admin@gmail.com';

  if (!isAdmin) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 relative z-10">
        <ShieldAlert size={80} className="text-rose-500 mb-6 animate-pulse drop-shadow-[0_10px_20px_rgba(244,63,94,0.3)]" />
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Access Denied</h1>
        <p className="text-gray-500 font-bold text-sm bg-white/60 px-6 py-3 rounded-2xl border border-gray-100 shadow-sm backdrop-blur-md">
          Only Administrators can view and manage the Khata CRM.
        </p>
      </div>
    );
  }

  // 📓 Khata Settle Function
  const handleClearDue = async (customerId: string, currentDue: number) => {
    const amount = Number(settleAmounts[customerId]);
    
    if (!amount || amount <= 0) {
      toast.error("Enter a valid amount!", { style: { background: '#333', color: '#fff', borderRadius: '12px' }});
      return;
    }
    if (amount > currentDue) {
      toast.error(`You cannot settle more than the due (₹${currentDue})`, { style: { background: '#9f1239', color: '#fff', borderRadius: '12px' }});
      return;
    }

    setIsSettling(customerId);

    try {
      const res = await fetch('/api/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, amountToClear: amount })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`₹${amount} cleared from Khata!`, { style: { background: '#10b981', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }});
        setSettleAmounts({ ...settleAmounts, [customerId]: '' }); // Input clear karo
        // Real-time table update
        setCustomers(customers.map(c => c._id === customerId ? data.customer : c));
      } else {
        toast.error(data.error || "Failed to settle amount");
      }
    } catch (error) {
      toast.error("System error during settlement.");
    } finally {
      setIsSettling(null);
    }
  };

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
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter flex items-center gap-3">
            Customers CRM <span className="bg-emerald-100 text-emerald-600 text-sm px-3 py-1 rounded-xl border border-emerald-200 shadow-inner flex items-center gap-1"><ShieldAlert size={14}/> Admin Only</span>
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-2 text-sm md:text-base">
            Manage regular clients and secure Khata settlements <WalletCards size={18} className="text-emerald-500" />
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
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Customer Details</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Lifetime Value</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Khata Due</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">Admin Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={40} />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Syncing Secure Database...</p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center text-gray-400">
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

                    {/* Admin Settle Khata Button */}
                    <td className="px-8 py-5">
                      {customer.dueAmount > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <input 
                            type="number" 
                            min="1" 
                            max={customer.dueAmount}
                            placeholder="₹ Amount"
                            value={settleAmounts[customer._id] || ''}
                            onChange={(e) => setSettleAmounts({ ...settleAmounts, [customer._id]: e.target.value })}
                            className="w-24 bg-white/80 border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold outline-none focus:border-indigo-400 text-gray-800 shadow-sm text-center placeholder:text-gray-300"
                          />
                          <button 
                            onClick={() => handleClearDue(customer._id, customer.dueAmount)}
                            disabled={isSettling === customer._id}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isSettling === customer._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Settle
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No Actions</div>
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