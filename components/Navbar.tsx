
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
    <header className="h-16 glass border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder={TRANSLATIONS.search_placeholder[lang]}
            className="w-full bg-slate-100 border border-transparent rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:bg-white focus:border-blue-200 transition-all text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors group"
        >
          <Globe size={16} className="text-slate-400 group-hover:text-blue-600" />
          <span className="text-xs font-bold uppercase text-slate-500 group-hover:text-slate-900">{lang}</span>
        </button>

        {isGuest ? (
          <button 
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            <LogIn size={14} /> SIGN IN
          </button>
        ) : (
          <div 
            onClick={() => setCurrentModule('settings')}
            className="flex items-center gap-4 pl-4 border-l border-slate-200 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 tracking-tight">{profile?.full_name || 'Operative'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{profile?.subscription_status === 'pro' ? 'Neural Pro' : 'Free'}</p>
            </div>
            <div className="w-9 h-9 rounded-xl nusa-gradient-bg p-[1px] group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[inherit] bg-white flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-blue-600" />
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
