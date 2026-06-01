'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Wallet, LockOpen, Lock, Loader2, IndianRupee, Clock, History, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ShiftPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Cashier';
  
  const [activeShift, setActiveShift] = useState<any>(null);
  const [expectedCash, setExpectedCash] = useState<number>(0);
  const [totalCashSales, setTotalCashSales] = useState<number>(0);
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [openingCash, setOpeningCash] = useState('');
  const [closingCash, setClosingCash] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchShiftData = async () => {
    try {
      const resActive = await fetch(`/api/shift?cashierName=${userName}`);
      const dataActive = await resActive.json();
      setActiveShift(dataActive.activeShift || null);
      
      // 🧮 Live Tally Calculation from Backend API
      if (dataActive.activeShift) {
        setExpectedCash(dataActive.currentExpectedCash || 0);
        setTotalCashSales(dataActive.totalCashSales || 0);
      }

      const resHistory = await fetch('/api/shift');
      const dataHistory = await resHistory.json();
      setShiftHistory(dataHistory);
    } catch (error) {
      toast.error('Failed to fetch shift data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) fetchShiftData();
  }, [userName]);

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openingCash) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cashierName: userName, openingCash: Number(openingCash) })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Cash Drawer Opened!", { style: { background: '#10b981', color: '#fff', fontWeight: 'bold' }});
        setOpeningCash('');
        fetchShiftData();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("System error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closingCash) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/shift', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          shiftId: activeShift._id, 
          closingCash: Number(closingCash),
          expectedCash: expectedCash // 🧮 System calculation goes to backend
        })
      });
      
      const data = await res.json();

      if (res.ok) {
        if (data.cashDiscrepancy === 0) {
           toast.success("Shift Closed Perfectly! Cash Matches.", { style: { background: '#10b981', color: '#fff', fontWeight: 'bold', padding: '16px' }});
        } else if (data.cashDiscrepancy < 0) {
           toast.error(`Shift Closed with SHORTAGE of ₹${Math.abs(data.cashDiscrepancy)}`, { duration: 5000, style: { background: '#9f1239', color: '#fff', fontWeight: 'bold', padding: '16px' }});
        } else {
           toast.success(`Shift Closed with OVERAGE of ₹${data.cashDiscrepancy}`, { duration: 5000, style: { background: '#1e3a8a', color: '#fff', fontWeight: 'bold', padding: '16px' }});
        }
        
        setClosingCash('');
        fetchShiftData();
      } else {
        toast.error("Failed to close shift");
      }
    } catch (error) {
      toast.error("System error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative z-10 pb-20 lg:pb-10 max-w-6xl mx-auto">
      <Toaster />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute left-[-10%] top-[-5%] -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse"></div>

      <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            End-of-Day Z-Report
          </h1>
          <p className="text-gray-500 font-bold mt-2 text-sm flex items-center gap-2">
            Secure cash drawer reconciliation & shift management <Scale size={16} className="text-emerald-500"/>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-emerald-500" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            {!activeShift ? (
              <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white shadow-xl">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 border border-emerald-200">
                  <LockOpen size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Open Register</h2>
                <p className="text-xs font-bold text-gray-400 mb-8 uppercase tracking-widest">Start your daily shift</p>
                
                <form onSubmit={handleOpenShift} className="space-y-6">
                  <div className="relative group">
                    <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" />
                    <input type="number" required min="0" placeholder="Enter Opening Cash" value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-emerald-400 focus:bg-white font-black text-lg transition-all" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black tracking-widest uppercase text-xs py-5 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50">
                    {isSubmitting ? 'Opening...' : 'Start Shift'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Lock size={100} /></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-100 text-rose-600 rounded-xl w-fit text-[10px] font-black uppercase tracking-widest mb-6 border border-rose-200 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Shift is Live
                  </div>
                  
                  <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Tally & Close</h2>
                  <p className="text-xs font-bold text-gray-400 mb-6 flex items-center gap-1.5"><Clock size={14}/> Started at {new Date(activeShift.startTime).toLocaleTimeString()}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Opening Base</span>
                      <span className="text-sm font-black text-gray-900">₹{activeShift.openingCash}</span>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">+ Cash Sales Today</span>
                      <span className="text-sm font-black text-emerald-700">₹{totalCashSales}</span>
                    </div>
                    <div className="bg-gray-900 p-5 rounded-2xl flex justify-between items-center mt-2 shadow-lg shadow-gray-900/20">
                      <span className="text-xs font-black text-gray-300 uppercase tracking-widest">System Expected</span>
                      <span className="text-2xl font-black text-white">₹{expectedCash}</span>
                    </div>
                  </div>

                  <form onSubmit={handleCloseShift} className="space-y-6">
                    <div className="relative group">
                      <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500" />
                      <input type="number" required min="0" placeholder="Count Actual Cash" value={closingCash} onChange={(e) => setClosingCash(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-rose-50/30 border border-rose-100 rounded-2xl outline-none focus:border-rose-400 focus:bg-white font-black text-lg text-rose-900 transition-all placeholder:text-rose-300" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 hover:bg-rose-600 text-white font-black tracking-widest uppercase text-xs py-5 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                      <Lock size={16} /> {isSubmitting ? 'Verifying...' : 'Match & Lock Drawer'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-sm border border-white p-6 md:p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><History size={20} className="text-emerald-500"/> Z-Report History (Branch)</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="pb-4">Cashier</th>
                    <th className="pb-4">Shift Details</th>
                    <th className="pb-4">Expected</th>
                    <th className="pb-4">Actual</th>
                    <th className="pb-4">Variance</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shiftHistory.length === 0 ? (
                    <tr><td colSpan={6} className="py-10 text-center text-sm font-bold text-gray-400">No shift history found.</td></tr>
                  ) : shiftHistory.map(shift => (
                    <tr key={shift._id} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 font-black text-gray-800 text-sm">{shift.cashierName}</td>
                      <td className="py-4 text-xs font-bold text-gray-500">
                        {new Date(shift.startTime).toLocaleDateString()} <br/>
                        {new Date(shift.startTime).toLocaleTimeString()} - {shift.endTime ? new Date(shift.endTime).toLocaleTimeString() : 'Active'}
                      </td>
                      <td className="py-4 font-bold text-gray-500">₹{shift.expectedCash || shift.openingCash}</td>
                      <td className="py-4 font-black text-gray-900">
                        {shift.status === 'Closed' ? `₹${shift.closingCash}` : '-'}
                      </td>
                      <td className="py-4 font-black">
                        {shift.status === 'Closed' ? (
                          shift.cashDiscrepancy === 0 ? (
                            <span className="text-emerald-500">Match ✅</span>
                          ) : shift.cashDiscrepancy < 0 ? (
                            <span className="text-rose-500 bg-rose-50 px-2 py-1 rounded-md">₹{shift.cashDiscrepancy} (Short)</span>
                          ) : (
                            <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-md">+₹{shift.cashDiscrepancy} (Over)</span>
                          )
                        ) : '-'}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${shift.status === 'Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}