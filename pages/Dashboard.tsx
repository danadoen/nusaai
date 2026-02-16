
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
    { id: 'creative', label: TRANSLATIONS.creative_studio[lang], icon: Video, color: 'text-rose-600', bg: 'bg-rose-50', border: 'hover:border-rose-200' },
    { id: 'career', label: TRANSLATIONS.career_center[lang], icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
    { id: 'health', label: TRANSLATIONS.health_hub[lang], icon: HeartPulse, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'hover:border-cyan-200' },
    { id: 'automation', label: TRANSLATIONS.automation[lang], icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', border: 'hover:border-purple-200' },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Immersive Welcome Header */}
      <section className="relative overflow-hidden rounded-[2rem] p-6 md:p-10 glass-card border border-white bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} /> {isPro ? 'Pro Operative' : 'Standard Access'}
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              {TRANSLATIONS.welcome_back[lang]}, <span className="nusa-gradient-text">{profile?.full_name?.split(' ')[0] || 'User'}</span>
            </h1>
            <p className="text-slate-600 text-sm max-w-lg font-medium leading-relaxed">
              {isPro 
                ? "Neural link established. Your specialized AI agents are standing by for execution." 
                : "Unlock the full potential of your digital workflow with NusaAI."}
            </p>
          </div>
          {!isPro && (
            <button 
              onClick={() => navigateTo('pricing')}
              className="px-6 py-3 nusa-gradient-bg text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 group"
            >
              UPGRADE PRO <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Neural Power Score', value: '1,284', trend: '+18%', icon: Activity, color: 'text-blue-600' },
            { label: 'Core Credits', value: isPro ? 'MAX' : (profile?.credits_remaining || 0), trend: isPro ? 'Premium' : 'Active', icon: CreditCard, color: 'text-purple-600' },
            { label: 'Time Saved', value: '48.5h', trend: '+12%', icon: TrendingUp, color: 'text-rose-600' },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 border border-white group relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-lg bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={18} />
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-xl font-black mb-0.5 text-slate-900 relative z-10">{stat.value}</h3>
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wider relative z-10">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-5 border border-purple-100 bg-gradient-to-br from-purple-50/30 to-white flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Lightbulb size={18} />
            </div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight">AI Insight</h4>
            <p className="text-[11px] text-slate-600 font-medium italic leading-relaxed">
              "Deploy Agentic Lab to automate your repetitive weekly reports."
            </p>
          </div>
          <button className="text-[9px] font-bold text-blue-600 mt-4 flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest">
            EXPLORE <ArrowRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black flex items-center gap-2 text-slate-900 uppercase tracking-widest">
            Core Modules <ArrowUpRight size={16} className="text-blue-600" />
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {quickTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => navigateTo(tool.id as ModuleType)}
                className={`flex items-center justify-between p-3 glass-card rounded-xl border border-white ${tool.border} group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tool.bg} ${tool.color} group-hover:rotate-6 transition-all`}>
                    <tool.icon size={16} />
                  </div>
                  <span className="font-bold text-xs text-slate-700 group-hover:text-slate-900 tracking-tight">{tool.label}</span>
                </div>
                <Sparkles size={14} className="text-slate-300 group-hover:text-blue-400 transition-all" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black flex items-center gap-2 text-slate-900 uppercase tracking-widest">
              {TRANSLATIONS.recent_activity[lang]} <History size={16} className="text-purple-600" />
            </h2>
            <button className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700">View All</button>
          </div>

          <div className="glass-card rounded-2xl border border-white overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-slate-400 font-bold text-[9px] uppercase animate-pulse">Syncing...</div>
            ) : history.length === 0 ? (
              <div className="p-10 text-center text-slate-500 space-y-3">
                <Activity size={24} className="mx-auto opacity-20" />
                <p className="font-bold text-xs">No recent activity detected.</p>
                <button onClick={() => navigateTo('creative')} className="px-4 py-1.5 bg-blue-600 rounded-lg text-white font-bold text-[9px] shadow-md uppercase tracking-widest">Start Now</button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all font-bold text-[10px] uppercase">
                        {item.module_type[0]}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 capitalize tracking-tight">{item.module_type} Deployment</p>
                        <p className="text-[9px] text-slate-500 font-medium">{new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <ArrowUpRight size={16} />
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
