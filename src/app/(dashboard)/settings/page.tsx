'use client';

import { useState, useEffect } from 'react';
import { Settings, Store, MapPin, Phone, Percent, Save, Loader2, ShieldCheck, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const [form, setForm] = useState({ storeName: '', storeAddress: '', storePhone: '', gstPercentage: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings load karna database se
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setForm(data);
        }
      } catch (error) {
        toast.error("Error loading configuration!");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Form Submit / Save Settings
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message, { style: { borderRadius: '12px', background: '#10b981', color: '#fff', fontWeight: 'bold' }});
      } else {
        toast.error(data.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Technical error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-emerald-500" size={40} strokeWidth={2.5} />
        <p className="text-sm font-black text-gray-400 tracking-widest uppercase">Loading Core Configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative z-10 pb-20 lg:pb-10 max-w-4xl mx-auto">
      
      <Toaster />

      {/* 🌌 SaaS Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -z-20"></div>
      <div className="absolute right-[-10%] top-[-5%] -z-10 h-[300px] w-[300px] rounded-full bg-emerald-500 opacity-20 blur-[100px] animate-pulse duration-[4000ms]"></div>
      <div className="absolute left-[-5%] bottom-[-5%] -z-10 h-[250px] w-[250px] rounded-full bg-teal-400/20 blur-[80px] animate-pulse delay-700 duration-[4000ms]"></div>

      {/* 1. Ultra-Premium Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-6 h-6 bg-gray-900 rounded-full border border-gray-700 shadow-inner">
              <Zap size={12} className="text-emerald-400" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">System Configuration</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter">
            Store Settings
          </h1>
          <p className="text-gray-500 font-bold flex items-center gap-2 mt-2 text-sm md:text-base">
            Configure your business profile and receipt metadata.
          </p>
        </div>
      </div>

      {/* 2. Glassmorphic Control Panel Form */}
      <div className="bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 gap-8">
            {/* Store Name Input */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 group-focus-within:text-emerald-500 transition-colors">
                <Store size={16}/> Business Name
              </label>
              <input 
                type="text" 
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-black text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400 placeholder:font-bold text-lg"
                placeholder="e.g. NexPOS Supermarket"
              />
            </div>

            {/* Store Address Input */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 group-focus-within:text-emerald-500 transition-colors">
                <MapPin size={16}/> Business Location
              </label>
              <textarea 
                required
                rows={3}
                value={form.storeAddress}
                onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400 resize-none text-base leading-relaxed custom-scrollbar"
                placeholder="Enter complete store address..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phone Input */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 group-focus-within:text-emerald-500 transition-colors">
                <Phone size={16}/> Support Contact
              </label>
              <input 
                type="text" 
                required
                value={form.storePhone}
                onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
                className="w-full px-5 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* GST Input */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 group-focus-within:text-emerald-500 transition-colors">
                <Percent size={16}/> Default Tax Rate (%)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  required
                  value={form.gstPercentage}
                  onChange={(e) => setForm({ ...form, gstPercentage: Number(e.target.value) })}
                  className="w-full pl-5 pr-12 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.5rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-black text-emerald-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400 text-lg"
                  placeholder="0"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-300 text-xl">%</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100/50 mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Data encrypted & securely stored.</span>
            </div>
            
            <button 
              type="submit" 
              disabled={saving}
              className="group relative overflow-hidden w-full md:w-auto min-w-[250px] bg-gray-900 text-white hover:bg-emerald-600 py-5 px-8 rounded-[1.5rem] font-black tracking-widest uppercase text-sm shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-[0.98] flex justify-center items-center gap-3 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-gray-900"
            >
              {!saving && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 disabled:hidden"></div>}
              {saving ? <Loader2 className="animate-spin relative z-10" size={18} /> : <Save size={18} className="relative z-10" />}
              <span className="relative z-10">{saving ? 'SAVING...' : 'SAVE CONFIGURATION'}</span>
            </button>
          </div>

        </form>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}