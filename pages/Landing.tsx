
import React from 'react';
import { 
  Sparkles, 
  Video, 
  Briefcase, 
  Zap, 
  HeartPulse, 
  UserCircle, 
  Globe, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { ModuleType } from '../types';

interface LandingProps {
  lang: 'en' | 'id';
  toggleLang: () => void;
  onLoginClick: () => void;
  onStartGuest: (module: ModuleType) => void;
  navigateTo: (m: ModuleType) => void;
}

const Landing: React.FC<LandingProps> = ({ lang, toggleLang, onLoginClick, onStartGuest, navigateTo }) => {
  const features = [
    { id: 'creative', icon: Video, title: TRANSLATIONS.creative_studio[lang], desc: TRANSLATIONS.creative_desc[lang], color: 'from-blue-500 to-indigo-500', accent: 'text-blue-600' },
    { id: 'professional', icon: Briefcase, title: TRANSLATIONS.professional_suite[lang], desc: TRANSLATIONS.professional_desc[lang], color: 'from-purple-500 to-pink-500', accent: 'text-purple-600' },
    { id: 'automation', icon: Zap, title: TRANSLATIONS.automation[lang], desc: TRANSLATIONS.automation_desc[lang], color: 'from-cyan-500 to-blue-500', accent: 'text-cyan-600' },
    { id: 'health', icon: HeartPulse, title: TRANSLATIONS.health_hub[lang], desc: TRANSLATIONS.health_desc[lang], color: 'from-emerald-500 to-teal-500', accent: 'text-emerald-600' },
    { id: 'career', icon: UserCircle, title: TRANSLATIONS.career_center[lang], desc: TRANSLATIONS.career_desc[lang], color: 'from-orange-500 to-rose-500', accent: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 glass z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg nusa-gradient-bg flex items-center justify-center font-black text-white text-lg">N</div>
          <span className="text-lg font-black tracking-tighter">NusaAI <span className="text-blue-600">Hub</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <button onClick={() => navigateTo('about')} className="hover:text-blue-600 transition-colors">About</button>
          <button onClick={() => navigateTo('pricing')} className="hover:text-blue-600 transition-colors">Pricing</button>
          <button onClick={() => navigateTo('changelog')} className="hover:text-blue-600 transition-colors">Updates</button>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleLang} className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
            <Globe size={16} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-600">{lang}</span>
          </button>
          <button 
            onClick={onLoginClick}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black tracking-widest hover:bg-slate-800 transition-all shadow-lg"
          >
            SIGN IN
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles size={12} className="animate-pulse" />
            Empowering Digital Workforce
          </div>
          
          <h1 className="max-w-4xl mx-auto nusa-gradient-text animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 text-3xl md:text-5xl">
            {TRANSLATIONS.hero_title[lang]}
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-500 font-medium text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {TRANSLATIONS.hero_subtitle[lang]}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button 
              onClick={() => onStartGuest('creative')}
              className="px-8 py-3.5 nusa-gradient-bg text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all group tracking-widest"
            >
              {TRANSLATIONS.try_free[lang].toUpperCase()} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onLoginClick}
              className="px-8 py-3.5 glass rounded-xl font-bold text-xs border border-slate-200 hover:bg-slate-50 transition-all tracking-widest"
            >
              WATCH DEMO
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div 
                key={feature.id}
                onClick={() => onStartGuest(feature.id as ModuleType)}
                className="glass-card p-6 rounded-3xl border border-white hover:border-blue-100 cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1.5">{feature.title}</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed mb-5">{feature.desc}</p>
                <span className={`text-[9px] font-black uppercase tracking-widest ${feature.accent} flex items-center gap-2 group-hover:gap-3 transition-all`}>
                  Explore Module <ArrowRight size={12} />
                </span>
              </div>
            ))}
            
            {/* Enterprise Card */}
            <div className="lg:col-span-1 glass-card p-6 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center bg-slate-50/20 group">
              <ShieldCheck size={32} className="text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
              <h3 className="text-sm font-bold text-slate-900">Neural Enterprise</h3>
              <p className="text-[10px] text-slate-500 mt-1.5 mb-5 max-w-[180px]">Custom AI integration for business infrastructure.</p>
              <button className="px-5 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                CONTACT SALES
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg nusa-gradient-bg flex items-center justify-center font-black text-white text-sm">N</div>
             <span className="text-sm font-black tracking-tighter text-slate-900">NusaAI Hub</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <button onClick={() => navigateTo('privacy')} className="hover:text-blue-600 transition-colors">Privacy</button>
            <button onClick={() => navigateTo('terms')} className="hover:text-blue-600 transition-colors">Terms</button>
            <button onClick={() => navigateTo('changelog')} className="hover:text-blue-600 transition-colors">Github</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
