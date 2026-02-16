
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Globe, Sparkles, LogIn, ArrowLeft } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getRedirectUrl = () => {
    // Memastikan redirect URL selalu valid baik di dev maupun prod
    let url = window.location.origin;
    // Hapus trailing slash jika ada
    url = url.endsWith('/') ? url.slice(0, -1) : url;
    return url;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: getRedirectUrl(),
      }
    });
    if (error) {
      alert(error.message);
    } else {
      setMessage('Check your email for the login link!');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050A] px-4 relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-[3rem] border border-white/5 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 nusa-gradient-bg rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,98,255,0.4)] mb-8">
            <span className="text-4xl font-black text-white">N</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Neural Interface</h1>
          <p className="text-slate-400 font-medium">Link your consciousness to the Cyber-Nusantara grid.</p>
        </div>

        <div className="space-y-5">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-4 py-4 px-6 glass rounded-2xl border border-[#0062FF]/30 text-white hover:bg-[#0062FF]/10 transition-all font-bold shadow-[0_0_15px_rgba(0,98,255,0.1)] group"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="G" />
            Sign in with Google
          </button>
          
          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-6 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Quantum Mail</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00F5FF] transition-colors" size={20} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@nusa-ai.hub"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-1 focus:ring-[#00F5FF]/30 transition-all font-medium text-white"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-5 nusa-gradient-bg text-white rounded-2xl font-black shadow-[0_0_30px_rgba(173,0,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {loading ? 'Initializing...' : 'Request Magic Link'} <LogIn size={20} />
            </button>
          </form>

          {message && (
            <div className="p-5 bg-[#00F5FF]/5 border border-[#00F5FF]/20 rounded-2xl text-[#00F5FF] text-xs font-bold text-center animate-pulse">
              {message}
            </div>
          )}
        </div>

        <div className="pt-8 text-center">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
            Identity verification via Supabase Quantum Auth
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
