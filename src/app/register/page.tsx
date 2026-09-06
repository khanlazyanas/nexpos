'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Sparkles, AlertCircle, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
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
        setSuccess('Account registered successfully! Redirecting...');
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
    <div className="relative min-h-screen flex items-center justify-center bg-[#030712] px-4 py-12 overflow-hidden font-sans selection:bg-emerald-500/30">
      
      {/* Background Architectural Grid & Noise */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030712_100%)] opacity-80 pointer-events-none"></div>
      
      {/* Premium Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-[440px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
        
        <div className="bg-[#0a0f1a]/80 backdrop-blur-2xl rounded-[2rem] border border-white/[0.06] border-t-white/[0.12] shadow-[0_0_80px_-20px_rgba(16,185,129,0.15)] p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle Card Inner Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 mb-5 shadow-[0_0_30px_rgba(52,211,153,0.1)]">
              <Sparkles size={24} className="drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight mb-2">
              Create Workspace
            </h1>
            <p className="text-sm font-medium text-slate-400">
              Enter your details to configure your environment.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border-l-4 border-rose-500 text-rose-300 rounded-r-xl text-sm font-medium flex items-start gap-3 animate-in shake duration-300 shadow-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 rounded-r-xl text-sm font-medium flex items-start gap-3 animate-in fade-in duration-300 shadow-sm">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                <input 
                  type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:bg-emerald-500/[0.02] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white font-medium placeholder:text-slate-600 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Work Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                <input 
                  type="email" required placeholder="admin@workspace.com" value={email} onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none" autoComplete="email" spellCheck={false}
                  className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:bg-emerald-500/[0.02] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white font-medium placeholder:text-slate-600 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300" />
                <input 
                  type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:bg-emerald-500/[0.02] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white font-medium placeholder:text-slate-600 transition-all duration-300 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">System Role</label>
              <div className="relative group">
                <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300 pointer-events-none z-10" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#030712]/50 border border-white/[0.08] rounded-xl py-3.5 pl-12 pr-4 outline-none focus:bg-emerald-500/[0.02] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 text-white font-medium transition-all duration-300 text-sm sm:text-base appearance-none cursor-pointer relative"
                >
                  <option value="User" className="bg-slate-900 text-white py-2">System User</option>
                  <option value="Admin" className="bg-slate-900 text-white py-2">Workspace Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" disabled={loading}
                className="group relative flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-500 text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:cursor-not-allowed overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                {!loading && (
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent skew-x-12 pointer-events-none"></div>
                )}
                <span className="relative z-10 text-sm sm:text-base">
                  {loading ? 'Initializing...' : 'Initialize Workspace'}
                </span>
                {!loading && <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-white/[0.05] text-center text-sm font-medium text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors hover:underline underline-offset-4 decoration-emerald-500/30">
              Authenticate here
            </Link>
          </div>
        </div>

        {/* Brand Watermark */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          <Shield size={12} /> System Guard v2.0
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