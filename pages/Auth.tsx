
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Github, Globe, Sparkles, LogIn } from 'lucide-react';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: window.location.origin,
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
        redirectTo: window.location.origin,
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8 glass-card p-8 md:p-10 rounded-[2.5rem] border border-white/10 relative">
        {/* Glow effect */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full" />
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20 mb-6">
            <span className="text-3xl font-bold text-white">N</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to NusaAI</h1>
          <p className="text-slate-400">The next-gen AI Super-App for your professional and personal life.</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 glass rounded-xl border border-white/10 hover:bg-white/5 transition-all font-medium"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
            Continue with Google
          </button>
          
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-xs uppercase tracking-widest font-bold">Or Email</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending link...' : 'Send Magic Link'} <LogIn size={18} />
            </button>
          </form>

          {message && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm text-center">
              {message}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          By continuing, you agree to NusaAI's <span className="underline cursor-pointer hover:text-slate-300">Terms of Service</span> and <span className="underline cursor-pointer hover:text-slate-300">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Auth;
