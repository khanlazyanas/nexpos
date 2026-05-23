'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Loader2, ShieldCheck, Mail, Lock, UserCircle, Zap, X, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      toast.error("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Cashier account created successfully!", { style: { background: '#10b981', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }});
        setIsModalOpen(false);
        setForm({ name: '', email: '', password: '' });
        fetchStaff(); 
      } else {
        toast.error(data.error || "Failed to create account");
      }
    } catch (error) {
      toast.error("Technical error occurred");
    } finally {
      setSaving(false);
    }
  };

  // 🛠️ NAYA: Delete Handle function
  const handleDeleteStaff = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke system access for ${name}? This action cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/staff?id=${id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success(`${name}'s access has been revoked.`, { style: { background: '#e11d48', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }});
        fetchStaff(); 
      } else {
        toast.error("Failed to remove staff member.");
      }
    } catch (error) {
      toast.error("Network error while deleting.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative z-10 pb-20 lg:pb-10 max-w-6xl mx-auto">
      <Toaster />

      {/* 🌌 SaaS Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute right-0 top-[-5%] -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse duration-[4000ms]"></div>
      
      {/* Ultra-Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-6 h-6 bg-gray-900 rounded-full border border-gray-700 shadow-inner">
              <Zap size={12} className="text-emerald-400" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Access Control</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            Staff Management
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-2 text-sm md:text-base">
            Create and manage secure login access for your cashiers.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative overflow-hidden flex items-center justify-center gap-2 w-full md:w-auto bg-gray-900 text-white hover:bg-emerald-600 px-8 py-4 rounded-2xl font-black shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 active:scale-95 hover:shadow-[0_12px_25px_rgba(16,185,129,0.3)]"
        >
           <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
           <Plus size={20} strokeWidth={3} className="relative z-10" />
           <span className="relative z-10 tracking-widest uppercase text-xs">Add Cashier</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100/50">
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Team Member</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest">Email Access ID</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-center">System Role</th>
                <th className="px-8 py-5 text-gray-400 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-3" size={40} />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fetching Team Data...</p>
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center text-gray-400">
                    <Users size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-sm">No cashiers found. Add your first team member!</p>
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr key={member._id} className="hover:bg-white transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-500 font-black text-lg border border-gray-200 uppercase group-hover:from-emerald-100 group-hover:to-teal-50 group-hover:text-emerald-700 transition-all">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{member.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Active Account</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 w-fit">
                        <Mail size={14} className="text-gray-400" /> {member.email}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest shadow-sm">
                        <ShieldCheck size={14} /> Cashier
                      </span>
                    </td>
                    {/* 🛠️ NAYA: Delete Actions Column */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDeleteStaff(member._id, member.name)}
                          className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm active:scale-95"
                          title="Revoke Access"
                        >
                          <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 ADD STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-3xl w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-400 border border-white">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Create Cashier Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-white shadow-sm border border-gray-100">
                <X size={18} strokeWidth={3} />
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="p-8 space-y-5">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Staff Name</label>
                  <div className="relative">
                    <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input type="text" required placeholder="e.g. Rahul Kumar" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-sm placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Access Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input type="email" required placeholder="rahul@nexpos.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-sm placeholder:text-gray-400" />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Temporary Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-sm placeholder:text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 mt-6 border-t border-gray-100 flex gap-3">
                <button type="submit" disabled={saving} className="group relative overflow-hidden w-full bg-gray-900 text-white hover:bg-emerald-600 py-4 rounded-[1.2rem] font-black tracking-widest uppercase text-xs shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  {!saving && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>}
                  {saving ? <Loader2 size={16} className="animate-spin relative z-10" /> : <ShieldCheck size={16} className="relative z-10" />}
                  <span className="relative z-10">{saving ? 'CREATING...' : 'AUTHORIZE CASHIER'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}