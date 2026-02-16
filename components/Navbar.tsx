
import React from 'react';
import { Search, Globe, User, LogIn } from 'lucide-react';
import { Profile, ModuleType } from '../types';
import { TRANSLATIONS } from '../constants';

interface NavbarProps {
  lang: 'en' | 'id';
  toggleLang: () => void;
  profile: Profile | null;
  isGuest?: boolean;
  setCurrentModule: (m: ModuleType) => void;
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ lang, toggleLang, profile, isGuest, setCurrentModule, onLoginClick }) => {
  return (
    <header className="h-24 glass border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00F5FF] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={TRANSLATIONS.search_placeholder[lang]}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:ring-1 focus:ring-[#00F5FF]/30 focus:bg-white/10 transition-all font-medium text-slate-300 tracking-tight"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group"
        >
          <Globe size={20} className="text-slate-500 group-hover:text-[#00F5FF] transition-colors" />
          <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{lang}</span>
        </button>

        {isGuest ? (
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-3 px-6 py-2.5 bg-[#0062FF]/10 border border-[#0062FF]/40 text-[#0062FF] rounded-xl text-sm font-black hover:bg-[#0062FF]/20 transition-all shadow-[0_0_15px_rgba(0,98,255,0.15)]"
          >
            <LogIn size={20} /> AUTHENTICATE
          </button>
        ) : (
          <div 
            onClick={() => setCurrentModule('settings')}
            className="flex items-center gap-5 pl-6 border-l border-white/5 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-base font-black text-white group-hover:text-[#00F5FF] transition-colors tracking-tight">{profile?.full_name || 'Operative'}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{profile?.subscription_status === 'pro' ? 'Neural Pro' : 'Neural Core'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl nusa-gradient-bg p-[1px] group-hover:scale-110 transition-transform shadow-2xl">
              <div className="w-full h-full rounded-[inherit] bg-slate-950 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-[#00F5FF]" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
