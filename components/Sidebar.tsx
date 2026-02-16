
import React from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Briefcase, 
  UserCircle, 
  HeartPulse, 
  Zap, 
  Settings as SettingsIcon,
  LogOut,
  ShieldAlert,
  Crown,
  LogIn
} from 'lucide-react';
import { ModuleType, Profile } from '../types';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../supabaseClient';

interface SidebarProps {
  currentModule: ModuleType;
  setCurrentModule: (m: ModuleType) => void;
  lang: 'en' | 'id';
  profile: Profile | null;
  isGuest?: boolean;
  onLoginClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentModule, setCurrentModule, lang, profile, isGuest, onLoginClick }) => {
  const isAdmin = profile?.role === 'admin';
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: TRANSLATIONS.dashboard[lang] },
    { id: 'creative', icon: Video, label: TRANSLATIONS.creative_studio[lang] },
    { id: 'professional', icon: Briefcase, label: TRANSLATIONS.professional_suite[lang] },
    { id: 'career', icon: UserCircle, label: TRANSLATIONS.career_center[lang] },
    { id: 'health', icon: HeartPulse, label: TRANSLATIONS.health_hub[lang] },
    { id: 'automation', icon: Zap, label: TRANSLATIONS.automation[lang] },
  ];

  const isPro = profile?.subscription_status === 'pro';
  const credits = isGuest ? (localStorage.getItem('nusai_guest_trial_used') === 'true' ? 0 : 1) : (profile?.credits_remaining || 0);

  return (
    <aside className="w-24 lg:w-72 glass border-r border-white/5 flex flex-col h-screen sticky top-0 z-50 backdrop-blur-2xl">
      <div className="p-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl nusa-gradient-bg flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(0,98,255,0.4)]">
          N
        </div>
        <span className="text-2xl font-black tracking-tighter text-white hidden lg:block">
          NusaAI <span className="text-[#00F5FF]">Hub</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentModule(item.id as ModuleType)}
            className={`w-full flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 group ${
              currentModule === item.id 
                ? 'bg-gradient-to-r from-[#0062FF]/20 to-[#AD00FF]/5 text-white border border-white/10 shadow-[inset_0_0_20px_rgba(0,98,255,0.1)]' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <item.icon size={26} className={currentModule === item.id ? 'text-[#00F5FF] neon-text-cyan' : 'group-hover:scale-110 transition-transform'} />
            <span className={`font-black text-lg hidden lg:block tracking-tight ${currentModule === item.id ? 'text-white' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}

        {isAdmin && (
          <div className="pt-6 mt-6 border-t border-white/5">
            <button
              onClick={() => setCurrentModule('admin')}
              className={`w-full flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 ${
                currentModule === 'admin' 
                  ? 'bg-[#FF00D6]/20 text-white border border-[#FF00D6]/30 shadow-[0_0_15px_rgba(255,0,214,0.1)]' 
                  : 'text-[#FF00D6]/60 hover:bg-[#FF00D6]/10 hover:text-[#FF00D6]'
              }`}
            >
              <ShieldAlert size={26} />
              <span className="font-black text-lg hidden lg:block tracking-tight">OPERATIONS</span>
            </button>
          </div>
        )}
      </nav>

      <div className="px-6 py-6 space-y-6">
        <div className="hidden lg:block">
          <div className="glass-card p-5 rounded-[2rem] border border-white/5 space-y-3 bg-[#05050A]/40">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Neural Sync</span>
              <span className={isPro ? "text-[#00F5FF] font-black" : "text-white font-black"}>
                {isPro ? "MAXED" : `${credits} LEFT`}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={`h-full nusa-gradient-bg shadow-[0_0_10px_rgba(0,98,255,0.5)]`}
                 style={{ width: isPro ? '100%' : (credits > 0 ? '50%' : '0%') }}
               />
            </div>
          </div>
        </div>

        {isGuest ? (
          <button onClick={onLoginClick} className="w-full flex items-center justify-center gap-3 p-4 bg-[#0062FF] text-white rounded-2xl hover:bg-[#0050D1] transition-all font-black shadow-[0_0_20px_rgba(0,98,255,0.4)]">
            <LogIn size={20} />
            <span className="text-base hidden lg:block tracking-tight">LINK INTERFACE</span>
          </button>
        ) : !isPro && (
          <button onClick={() => setCurrentModule('pricing')} className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#AD00FF]/10 to-[#FF00D6]/10 border border-[#AD00FF]/30 text-[#AD00FF] rounded-2xl hover:bg-[#AD00FF]/20 transition-all group font-black shadow-[0_0_15px_rgba(173,0,255,0.15)]">
            <Crown size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="text-base hidden lg:block tracking-tight uppercase tracking-widest text-xs">Ascend Pro</span>
          </button>
        )}
      </div>

      <div className="p-6 border-t border-white/5 space-y-2 bg-[#05050A]/20">
        <button
          onClick={() => isGuest ? onLoginClick?.() : setCurrentModule('settings')}
          className={`w-full flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 ${
            currentModule === 'settings' ? 'text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          <SettingsIcon size={24} />
          <span className="font-bold text-base hidden lg:block tracking-tight">{TRANSLATIONS.settings[lang]}</span>
        </button>
        {!isGuest && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-5 p-4 rounded-2xl text-slate-600 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            <LogOut size={24} />
            <span className="font-bold text-base hidden lg:block tracking-tight">TERMINATE</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
