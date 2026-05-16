'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Cashier'); // Default Cashier
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'User banane me dikkat aayi.');
        setLoading(false);
      } else {
        setSuccess('Account successfully ban gaya bhai! 🎉');
        setLoading(false);
        // 2 second baad login page par bhej do
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Technical error aa gayi.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 px-4 overflow-hidden">
      
      {/* Background Premium Glow Effects */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000"></div>

      {/* Main Glassmorphic Box */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="inline-flex bg-gradient-to-br from-emerald-400 to-teal-500 p-3.5 rounded-2xl text-white shadow-lg shadow-emerald-900/30 mb-4 animate-bounce duration-2000">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 tracking-tighter">
            Create Account
          </h1>
          <p className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest mt-1.5">
            Join NexPOS System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in shake duration-300">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in duration-300">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" required placeholder="e.g. Anas Khan" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold placeholder:text-slate-500 transition-all text-sm shadow-inner"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" required placeholder="e.g. anas@nexpos.com" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold placeholder:text-slate-500 transition-all text-sm shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold placeholder:text-slate-500 transition-all text-sm shadow-inner"
              />
            </div>
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">System Role</label>
            <div className="relative">
              <ShieldCheck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold transition-all text-sm shadow-inner appearance-none cursor-pointer"
              >
                <option value="Cashier" className="bg-slate-900 text-white">Cashier (Staff)</option>
                <option value="Admin" className="bg-slate-900 text-white">Admin (Owner)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button 
              type="submit" disabled={loading}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 font-extrabold py-3.5 rounded-xl sm:rounded-2xl text-white tracking-wide shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {!loading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              )}
              <span className="relative z-10 text-sm">
                {loading ? 'Creating Account...' : 'Register User'}
              </span>
            </button>
          </div>
        </form>

        {/* Link to Login Page */}
        <div className="mt-6 text-center text-xs font-medium text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
}