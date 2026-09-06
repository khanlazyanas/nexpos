'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Sparkles, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Added role state with default value
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
        // Passing the dynamically selected role from the dropdown
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account. Please try again.');
        setLoading(false);
      } else {
        setSuccess('Registered successfully! Redirecting...');
        setLoading(false);
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError('A technical error occurred. Please contact system admin.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 px-4 overflow-hidden">
      
      {/* Background Premium Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-3000"></div>

      {/* Main Glassmorphic Box */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-gradient-to-br from-emerald-400 to-teal-500 p-3.5 rounded-2xl text-white shadow-lg shadow-emerald-900/30 mb-4 animate-bounce duration-2000">
            <Sparkles size={28} />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 tracking-tighter">
            Create Account
          </h1>
          <p className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest mt-1.5">
            Register your profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in shake duration-300">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in duration-300">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" required placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold placeholder:text-slate-500 transition-all text-sm sm:text-base shadow-inner"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="email" required placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none" autoComplete="email" spellCheck={false}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold placeholder:text-slate-500 transition-all text-sm sm:text-base shadow-inner"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold placeholder:text-slate-500 transition-all text-sm sm:text-base shadow-inner"
              />
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Role</label>
            <div className="relative">
              <Shield size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl py-3.5 pl-11 pr-4 outline-none focus:bg-white/10 focus:border-emerald-500 text-white font-bold transition-all text-sm sm:text-base shadow-inner appearance-none cursor-pointer"
              >
                <option value="User" className="bg-slate-900 text-white">User</option>
                <option value="Admin" className="bg-slate-900 text-white">Admin</option>
              </select>
              {/* Custom arrow for the dropdown */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-400 font-extrabold py-4 rounded-xl sm:rounded-2xl text-white tracking-wide shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {!loading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
              )}
              <span className="relative z-10 text-sm sm:text-base">
                {loading ? 'Processing...' : 'Create Account'}
              </span>
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center text-xs font-medium text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline transition-all hover:text-emerald-300">
            Login securely
          </Link>
        </div>

        {/* Bottom Helper Info */}
        <div className="mt-6 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          System Guard Active v2.0
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