
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
    <aside className="w-20 lg:w-64 glass border-r border-slate-200 flex flex-col h-screen sticky top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl nusa-gradient-bg flex items-center justify-center font-black text-xl text-white shadow-lg">
          N
        </div>
        <span className="text-xl font-black tracking-tighter text-slate-900 hidden lg:block">
          NusaAI <span className="text-blue-600">Hub</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentModule(item.id as ModuleType)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group ${
              currentModule === item.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon size={22} className={currentModule === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
            <span className={`font-bold text-sm hidden lg:block tracking-tight ${currentModule === item.id ? 'text-white' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentModule('admin')}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
                currentModule === 'admin' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              <ShieldAlert size={22} />
              <span className="font-bold text-sm hidden lg:block tracking-tight">OPERATIONS</span>
            </button>
          </div>
        )}
      </nav>

      <div className="px-4 py-6 space-y-4">
        {!isPro && !isGuest && (
          <div className="hidden lg:block">
            <div className="glass-card p-4 rounded-2xl border border-slate-100 space-y-2 bg-white/40">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Credits</span>
                <span className="text-blue-600 font-bold text-xs">{credits} Left</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600"
                  style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {isGuest ? (
          <button onClick={onLoginClick} className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg">
            <LogIn size={18} />
            <span className="hidden lg:block">Sign In</span>
          </button>
        ) : !isPro && (
          <button onClick={() => setCurrentModule('pricing')} className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:opacity-90 transition-all font-bold text-sm shadow-md">
            <Crown size={18} />
            <span className="hidden lg:block">Ascend Pro</span>
          </button>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 space-y-1">
        <button
          onClick={() => isGuest ? onLoginClick?.() : setCurrentModule('settings')}
          className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
            currentModule === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          <SettingsIcon size={20} />
          <span className="font-bold text-sm hidden lg:block">{TRANSLATIONS.settings[lang]}</span>
        </button>
        {!isGuest && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-4 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm hidden lg:block tracking-tight">Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
