'use client';

import { useState, useEffect } from 'react';
import { Settings, Store, MapPin, Phone, Percent, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
        toast.error("Settings load karne me error!");
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
        toast.success(data.message, { style: { borderRadius: '12px', background: '#10b981', color: '#fff' }});
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
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">Loading Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="text-emerald-500" size={32} />
          Store Settings
        </h1>
        <p className="text-sm font-bold text-gray-500 mt-1">Configure your business profile and receipt metadata.</p>
      </div>

      {/* Glassmorphic Card Form */}
      <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] space-y-6">
        
        {/* Store Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><Store size={14}/> Store Name</label>
          <input 
            type="text" 
            required
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 outline-none focus:border-emerald-500 font-bold text-gray-700 shadow-sm"
            placeholder="e.g. NexPOS Supermarket"
          />
        </div>

        {/* Store Address Input */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><MapPin size={14}/> Store Address</label>
          <textarea 
            required
            rows={3}
            value={form.storeAddress}
            onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
            className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 outline-none focus:border-emerald-500 font-bold text-gray-700 shadow-sm resize-none"
            placeholder="Enter store full address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><Phone size={14}/> Store Contact Phone</label>
            <input 
              type="text" 
              required
              value={form.storePhone}
              onChange={(e) => setForm({ ...form, storePhone: e.target.value })}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 outline-none focus:border-emerald-500 font-bold text-gray-700 shadow-sm"
              placeholder="Contact number"
            />
          </div>

          {/* GST Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><Percent size={14}/> Default GST / Tax (%)</label>
            <input 
              type="number" 
              min="0"
              max="100"
              required
              value={form.gstPercentage}
              onChange={(e) => setForm({ ...form, gstPercentage: Number(e.target.value) })}
              className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 outline-none focus:border-emerald-500 font-bold text-gray-700 shadow-sm"
              placeholder="0 for No Tax"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          type="submit" 
          disabled={saving}
          className="w-full mt-4 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-emerald-600 hover:to-teal-600 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          SAVE CONFIGURATION
        </button>

      </form>

    </div>
  );
}