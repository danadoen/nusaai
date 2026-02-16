
import React, { useEffect, useState } from 'react';
import { 
  History, 
  ArrowUpRight, 
  Video, 
  Briefcase, 
  HeartPulse, 
  Sparkles,
  TrendingUp,
  Activity,
  CreditCard,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { supabase } from '../supabaseClient';
import { AIHistoryItem, ModuleType, Profile } from '../types';

interface DashboardProps {
  lang: 'en' | 'id';
  navigateTo: (m: ModuleType) => void;
  profile: Profile | null;
  isGuest?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, navigateTo, profile, isGuest }) => {
  const [history, setHistory] = useState<AIHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('ai_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setHistory(data);
    }
    setLoading(false);
  };

  const isPro = profile?.subscription_status === 'pro';

  const quickTools = [
    { id: 'creative', label: TRANSLATIONS.creative_studio[lang], icon: Video, color: 'text-[#FF00D6]', bg: 'bg-[#FF00D6]/10', border: 'hover:border-[#FF00D6]/40' },
    { id: 'career', label: TRANSLATIONS.career_center[lang], icon: Briefcase, color: 'text-[#0062FF]', bg: 'bg-[#0062FF]/10', border: 'hover:border-[#0062FF]/40' },
    { id: 'health', label: TRANSLATIONS.health_hub[lang], icon: HeartPulse, color: 'text-[#00F5FF]', bg: 'bg-[#00F5FF]/10', border: 'hover:border-[#00F5FF]/40' },
    { id: 'automation', label: TRANSLATIONS.automation[lang], icon: Sparkles, color: 'text-[#AD00FF]', bg: 'bg-[#AD00FF]/10', border: 'hover:border-[#AD00FF]/40' },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Immersive Welcome Header */}
      <section className="relative overflow-hidden rounded-[3.5rem] p-12 md:p-16 glass-card border border-white/5 bg-gradient-to-br from-[#0062FF]/10 via-[#AD00FF]/5 to-transparent shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] text-[10px] font-black uppercase tracking-[0.3em] border border-[#00F5FF]/20 shadow-[0_0_20px_rgba(0,245,255,0.15)]">
              <Sparkles size={14} /> {isPro ? 'Pro Operative' : 'Standard Access'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight">
              {TRANSLATIONS.welcome_back[lang]}, <span className="nusa-gradient-text drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{profile?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl leading-relaxed font-semibold">
              {isPro 
                ? "Neural link established. Your specialized AI agents are standing by for execution." 
                : "Unlock the full Cyber-Nusantara potential. Professional agents await your command."}
            </p>
          </div>
          {!isPro && (
            <button 
              onClick={() => navigateTo('pricing')}
              className="px-12 py-6 nusa-gradient-bg text-white rounded-2xl font-black text-xl flex items-center gap-4 transition-all shadow-[0_0_40px_rgba(0,98,255,0.4)] hover:scale-110 active:scale-95 group"
            >
              UPGRADE PRO <ArrowUpRight size={26} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#AD00FF]/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#0062FF]/10 blur-[120px] rounded-full" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: 'Neural Power Score', value: '1,284', trend: '+18%', icon: Activity, color: 'text-[#00F5FF]', glow: 'shadow-[#00F5FF]/20' },
            { label: 'Core Credits', value: isPro ? 'MAX' : (profile?.credits_remaining || 0), trend: isPro ? 'Premium' : 'Active', icon: CreditCard, color: 'text-[#AD00FF]', glow: 'shadow-[#AD00FF]/20' },
            { label: 'Time Optimization', value: '48.5h', trend: '+12%', icon: TrendingUp, color: 'text-[#FF00D6]', glow: 'shadow-[#FF00D6]/20' },
          ].map((stat, i) => (
            <div key={i} className={`glass-card rounded-[3rem] p-10 border border-white/5 group relative overflow-hidden ${stat.glow}`}>
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={`p-5 rounded-3xl bg-white/5 ${stat.color} group-hover:scale-125 transition-all duration-700`}>
                  <stat.icon size={32} />
                </div>
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${stat.trend.includes('+') ? 'bg-[#00F5FF]/10 text-[#00F5FF]' : 'bg-[#AD00FF]/10 text-[#AD00FF]'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-5xl font-black mb-2 tracking-tighter text-white relative z-10">{stat.value}</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] relative z-10">{stat.label}</p>
              
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full" />
            </div>
          ))}
        </div>

        <div className="glass-card rounded-[3rem] p-10 border border-[#AD00FF]/20 bg-gradient-to-br from-[#AD00FF]/10 to-transparent flex flex-col justify-between">
          <div className="space-y-8">
            <div className="w-14 h-14 rounded-2xl bg-[#AD00FF]/20 text-[#AD00FF] flex items-center justify-center shadow-2xl">
              <Lightbulb size={28} />
            </div>
            <h4 className="text-2xl font-black text-white tracking-tighter">Strategic Insight</h4>
            <p className="text-base text-slate-400 leading-relaxed font-bold">
              "Deploy the Agentic Lab to create high-velocity automation scripts for your recurring data workflows."
            </p>
          </div>
          <button className="text-xs font-black text-[#00F5FF] mt-10 flex items-center gap-3 hover:gap-6 transition-all uppercase tracking-widest">
            OPERATIONS <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-6">
        <div className="lg:col-span-1 space-y-10">
          <h2 className="text-3xl font-black flex items-center gap-4 text-white tracking-tighter">
            Core Modules <ArrowUpRight size={28} className="text-[#0062FF]" />
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {quickTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigateTo(tool.id as ModuleType)}
                className={`flex items-center justify-between p-6 glass-card rounded-3xl border border-white/5 ${tool.border} group`}
              >
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-2xl ${tool.bg} ${tool.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <tool.icon size={28} />
                  </div>
                  <span className="font-black text-xl text-slate-200 group-hover:text-white transition-colors tracking-tight">{tool.label}</span>
                </div>
                <Sparkles size={22} className="text-slate-700 group-hover:text-[#00F5FF] group-hover:scale-125 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black flex items-center gap-4 text-white tracking-tighter">
              {TRANSLATIONS.recent_activity[lang]} <History size={28} className="text-[#AD00FF]" />
            </h2>
            <button className="text-xs font-black text-[#00F5FF] uppercase tracking-[0.2em] hover:text-white transition-colors">Access Logs</button>
          </div>

          <div className="glass-card rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl">
            {loading ? (
              <div className="p-24 text-center text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Syncing Neural Data...</div>
            ) : history.length === 0 ? (
              <div className="p-24 text-center text-slate-600 space-y-10">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner">
                   <Activity size={40} className="opacity-20" />
                </div>
                <p className="text-2xl font-black tracking-tighter">No operations detected in current cycle.</p>
                <button onClick={() => navigateTo('creative')} className="px-10 py-4 nusa-gradient-bg rounded-2xl text-white font-black shadow-2xl hover:scale-105 transition-all uppercase tracking-widest text-sm">Initiate First Link</button>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {history.map((item) => (
                  <div key={item.id} className="p-9 hover:bg-white/5 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div className="w-18 h-18 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-700 group-hover:text-[#00F5FF] group-hover:border-[#00F5FF]/20 transition-all font-black text-2xl shadow-inner uppercase">
                        {item.module_type[0]}
                      </div>
                      <div>
                        <p className="font-black text-2xl text-slate-200 capitalize group-hover:text-white transition-colors tracking-tighter">{item.module_type} Deployment</p>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    <button className="p-5 text-slate-700 hover:text-[#00F5FF] hover:bg-white/5 rounded-2xl transition-all">
                      <ArrowUpRight size={28} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
