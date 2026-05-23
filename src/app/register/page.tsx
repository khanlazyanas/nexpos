'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🛠️ YAHAN DHYAN DEIN: Role ab default 'Admin' jayega backend ko, dropdown hat gaya hai
        body: JSON.stringify({ ...form, role: 'Admin' }) 
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Workspace Created Successfully!", {
          style: { background: '#10b981', color: '#fff', fontWeight: 'bold', borderRadius: '12px' }
        });
        setTimeout(() => router.push('/login'), 1500);
      } else {
        toast.error(data.error || "Registration failed. Try again.");
      }
    } catch (error) {
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-[#f8fafc] font-sans">
      <Toaster position="top-center" />

      {/* 🌌 Ultra-Premium Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] -z-20"></div>
      <div className="absolute left-[-10%] top-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-emerald-400 opacity-20 blur-[120px] animate-pulse duration-[5000ms]"></div>
      <div className="absolute right-[-10%] bottom-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-teal-300/30 blur-[120px] animate-pulse delay-1000 duration-[7000ms]"></div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white/60 backdrop-blur-3xl backdrop-saturate-200 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-white p-8 md:p-12 transition-all duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-[1.2rem] shadow-xl shadow-emerald-500/20 mb-6 border border-white/20">
            <Zap size={28} className="text-white fill-white animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tighter mb-2">
            Create Workspace
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Register as Store Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <User size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                required
                placeholder="Full Name" 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <Mail size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="email" 
                required
                placeholder="Work Email" 
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                autoComplete="email" 
                autoCapitalize="none"
                className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                <Lock size={18} strokeWidth={2.5} />
              </div>
              <input 
                type="password" 
                required
                placeholder="Secure Password" 
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full pl-14 pr-6 py-4 bg-white/60 backdrop-blur-md border border-white rounded-[1.2rem] outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-300 transition-all font-bold text-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="group relative overflow-hidden w-full bg-gray-900 text-white hover:bg-emerald-600 py-4.5 rounded-[1.2rem] font-black tracking-widest uppercase text-xs shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
          >
            {!loading && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>}
            {loading ? <Loader2 size={18} className="animate-spin relative z-10" /> : <ShieldCheck size={18} className="relative z-10" />}
            <span className="relative z-10">{loading ? 'CREATING WORKSPACE...' : 'CREATE ADMIN ACCOUNT'}</span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-600 hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
              Sign in securely <ArrowRight size={14} className="inline mb-0.5" />
            </Link>
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}