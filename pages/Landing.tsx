
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
  ShieldCheck,
  Cpu
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
    { id: 'creative', icon: Video, title: TRANSLATIONS.creative_studio[lang], desc: TRANSLATIONS.creative_desc[lang], color: 'from-blue-600 via-indigo-600 to-purple-600', accent: 'text-[#00F5FF]' },
    { id: 'professional', icon: Briefcase, title: TRANSLATIONS.professional_suite[lang], desc: TRANSLATIONS.professional_desc[lang], color: 'from-[#0062FF] via-[#AD00FF] to-[#FF00D6]', accent: 'text-[#00F5FF]' },
    { id: 'automation', icon: Zap, title: TRANSLATIONS.automation[lang], desc: TRANSLATIONS.automation_desc[lang], color: 'from-cyan-500 via-blue-600 to-indigo-600', accent: 'text-[#AD00FF]' },
    { id: 'health', icon: HeartPulse, title: TRANSLATIONS.health_hub[lang], desc: TRANSLATIONS.health_desc[lang], color: 'from-teal-400 via-emerald-500 to-cyan-500', accent: 'text-[#FF00D6]' },
    { id: 'career', icon: UserCircle, title: TRANSLATIONS.career_center[lang], desc: TRANSLATIONS.career_desc[lang], color: 'from-purple-600 via-magenta-500 to-rose-500', accent: 'text-[#00F5FF]' },
  ];

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-[#00F5FF]/30">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 h-20 px-8 flex items-center justify-between shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigateTo('dashboard')}>
          <div className="w-11 h-11 rounded-xl nusa-gradient-bg flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(0,98,255,0.4)] group-hover:scale-110 transition-transform">
            N
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">NusaAI <span className="text-[#00F5FF] neon-text-cyan">Hub</span></span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <button onClick={scrollToFeatures} className="text-sm font-bold text-slate-400 hover:text-[#00F5FF] transition-all tracking-wider uppercase">
            {TRANSLATIONS.features[lang]}
          </button>
          <button onClick={() => navigateTo('pricing')} className="text-sm font-bold text-slate-400 hover:text-[#AD00FF] transition-all tracking-wider uppercase">
            {TRANSLATIONS.pricing[lang]}
          </button>
          <button onClick={() => navigateTo('about')} className="text-sm font-bold text-slate-400 hover:text-[#FF00D6] transition-all tracking-wider uppercase">
            {TRANSLATIONS.about[lang]}
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={toggleLang} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2 border border-white/5">
            <Globe size={18} />
            <span className="text-xs font-black uppercase tracking-widest">{lang}</span>
          </button>
          <button onClick={onLoginClick} className="hidden sm:block px-6 py-2.5 text-sm font-black border border-[#0062FF]/40 text-[#0062FF] rounded-xl hover:bg-[#0062FF]/10 hover:border-[#0062FF] transition-all shadow-[0_0_15px_rgba(0,98,255,0.2)]">
            {TRANSLATIONS.login[lang]}
          </button>
          <button onClick={onLoginClick} className="px-7 py-3 text-sm font-black nusa-gradient-bg text-white rounded-xl shadow-[0_0_25px_rgba(173,0,255,0.4)] hover:scale-105 active:scale-95 transition-all">
            {TRANSLATIONS.get_started[lang]}
          </button>
        </div>
      </nav>

      <main className="relative pt-48">
        <section className="container mx-auto px-6 text-center space-y-12 pb-48">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF] text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            <Sparkles size={14} /> Intelligence Unlimited
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter max-w-6xl mx-auto leading-[0.95] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="text-white">EVOLVE YOUR</span><br/>
            <span className="nusa-gradient-text drop-shadow-[0_0_50px_rgba(0,98,255,0.3)]">AI POTENTIAL</span>
          </h1>
          
          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium">
            The ultimate Cyber-Nusantara AI ecosystem. Built with the speed of Gemini 3.0 to dominate your professional workflow.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button 
              onClick={() => onStartGuest('creative')}
              className="px-14 py-6 nusa-gradient-bg text-white rounded-2xl font-black text-xl shadow-[0_0_50px_-5px_rgba(0,98,255,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group"
            >
              {TRANSLATIONS.try_free[lang]} 
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 py-48 space-y-32">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
              {TRANSLATIONS.features[lang]}
            </h2>
            <p className="text-slate-400 text-xl max-w-xl mx-auto font-bold uppercase tracking-widest opacity-60">Engineered for Excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                className="group glass-card p-12 rounded-[3rem] border border-white/5 hover:border-[#00F5FF]/30 transition-all hover:-translate-y-4 hover:shadow-[0_0_40px_rgba(0,98,255,0.15)] overflow-hidden relative"
              >
                <div className={`w-18 h-18 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-2xl mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <feature.icon size={36} />
                </div>
                <h3 className="text-3xl font-black mb-5 tracking-tighter group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-10 group-hover:text-slate-300 transition-colors">
                  {feature.desc}
                </p>
                <button 
                  onClick={() => onStartGuest(feature.id as ModuleType)}
                  className={`flex items-center gap-3 ${feature.accent} font-black text-lg group-hover:gap-6 transition-all uppercase tracking-tighter`}
                >
                  Initiate <ArrowRight size={20} />
                </button>
                
                {/* Decorative glow inside card */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0062FF]/5 blur-[60px] group-hover:bg-[#00F5FF]/10 transition-all rounded-full" />
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/5 pt-40 pb-20 relative bg-[#05050A]/80 backdrop-blur-xl">
          <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-4 gap-20">
            <div className="space-y-10 col-span-1 lg:col-span-1">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigateTo('dashboard')}>
                <div className="w-12 h-12 rounded-xl nusa-gradient-bg flex items-center justify-center font-black text-white shadow-2xl">N</div>
                <span className="text-3xl font-black tracking-tighter">NusaAI <span className="text-[#00F5FF]">Hub</span></span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                The apex AI environment. Engineered in Nusantara for the global digital conquest.
              </p>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-20">
              <div className="space-y-8">
                <h4 className="font-black text-xl tracking-tighter uppercase text-white">Product</h4>
                <ul className="text-lg text-slate-500 space-y-5">
                  <li onClick={scrollToFeatures} className="hover:text-[#00F5FF] cursor-pointer transition-all font-bold">Features</li>
                  <li onClick={() => navigateTo('pricing')} className="hover:text-[#AD00FF] cursor-pointer transition-all font-bold">Pricing</li>
                  <li onClick={() => navigateTo('changelog')} className="hover:text-[#FF00D6] cursor-pointer transition-all font-bold">Changelog</li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="font-black text-xl tracking-tighter uppercase text-white">Legal</h4>
                <ul className="text-lg text-slate-500 space-y-5">
                  <li onClick={() => navigateTo('privacy')} className="hover:text-[#00F5FF] cursor-pointer transition-all font-bold">Privacy Policy</li>
                  <li onClick={() => navigateTo('terms')} className="hover:text-[#AD00FF] cursor-pointer transition-all font-bold">Terms of Service</li>
                </ul>
              </div>
              <div className="space-y-8">
                <h4 className="font-black text-xl tracking-tighter uppercase text-white">Network</h4>
                <ul className="text-lg text-slate-500 space-y-5">
                  <li className="hover:text-[#00F5FF] cursor-pointer transition-all font-bold">Docs</li>
                  <li className="hover:text-[#AD00FF] cursor-pointer transition-all font-bold">Status</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-8 pt-40 text-center">
             <p className="text-slate-600 text-xs font-black tracking-[0.4em] uppercase">
               © {new Date().getFullYear()} NusaAI Global Operations. All data encrypted.
             </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Landing;
