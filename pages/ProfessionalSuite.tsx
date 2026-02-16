
import React, { useState } from 'react';
import { Briefcase, Gavel, Building2, Sparkles, Send, Lock } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { supabase } from '../supabaseClient';
import { Profile } from '../types';
import { TRANSLATIONS } from '../constants';

// Added missing props to resolve type error in App.tsx
interface ProfessionalSuiteProps {
  lang: 'en' | 'id';
  profile: Profile | null;
  onPaywallTrigger: () => void;
  // Added isGuest to props to match usage in App.tsx
  isGuest?: boolean;
}

const ProfessionalSuite: React.FC<ProfessionalSuiteProps> = ({ lang, profile, onPaywallTrigger, isGuest }) => {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<{role: 'user' | 'ai', text: string}[]>([]);

  // Check if user has access based on profile status and remaining credits
  const canGenerate = isGuest ? (localStorage.getItem('nusai_guest_trial_used') !== 'true') : (profile?.subscription_status === 'pro' || (profile?.credits_remaining || 0) > 0);

  const niches = [
    { id: 'legal', icon: Gavel, label: 'Legal Advisor', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'architect', icon: Building2, label: 'Architect Assistant', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'business', icon: Briefcase, label: 'Business Consultant', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  const handleSend = async () => {
    if (!input || !selectedNiche) return;
    
    // Enforce paywall if user lacks credits/pro status
    if (!canGenerate) {
      onPaywallTrigger();
      return;
    }

    const currentInput = input;
    setInput('');
    setChats(prev => [...prev, { role: 'user', text: currentInput }]);
    setLoading(true);

    try {
      const prompt = `
        You are a top-tier ${selectedNiche.toUpperCase()} expert. 
        Provide professional advice in ${lang === 'en' ? 'English' : 'Bahasa Indonesia'}. 
        User query: ${currentInput}
        If Legal: Focus on Indonesian/Global regulatory clarity.
        If Architect: Focus on space optimization and modern aesthetics.
        If Business: Focus on ROI and scalability.
      `;
      
      const response = await GeminiService.generate(prompt);
      setChats(prev => [...prev, { role: 'ai', text: response }]);

      // Log activity only for registered users
      if (!isGuest) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('ai_history').insert([{
            user_id: user.id,
            module_type: 'professional',
            input_data: { niche: selectedNiche, query: currentInput },
            output_data: { response }
          }]);
        }
      }
    } catch (err: any) {
      if (err.message === "PAYWALL_TRIGGERED" || err.message === "AUTH_REQUIRED") {
        onPaywallTrigger();
      } else {
        setChats(prev => [...prev, { role: 'ai', text: "Error: " + err.message }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 h-full flex flex-col relative">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Professional Suite</h1>
        <p className="text-slate-500">Expert-level AI assistants for specialized niches.</p>
      </div>

      {!selectedNiche ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {niches.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelectedNiche(n.id)}
              className="glass-card p-8 rounded-3xl border border-white/5 hover:border-indigo-500/40 hover:scale-105 transition-all flex flex-col items-center gap-6 group"
            >
              <div className={`p-5 rounded-2xl ${n.bg} ${n.color} group-hover:scale-110 transition-transform`}>
                <n.icon size={48} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold">{n.label}</h3>
                <p className="text-slate-500 mt-2 text-sm">Tap to start a conversation with our specialized {n.id} engine.</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex-1 glass-card rounded-3xl border border-white/10 flex flex-col overflow-hidden min-h-[500px] relative">
          {/* Visual lock overlay when user is out of credits */}
          {!canGenerate && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
               <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                 <Lock size={32} />
               </div>
               <p className="font-bold text-white mb-2">
                 {isGuest ? "Free trial ended." : TRANSLATIONS.paywall_upgrade[lang]}
               </p>
               <button 
                onClick={onPaywallTrigger}
                className="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all"
               >
                 {isGuest ? "Sign In to Continue" : "Upgrade Now"}
               </button>
            </div>
          )}
          
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <span className="font-bold capitalize">{selectedNiche} Consultant</span>
            </div>
            <button 
              onClick={() => setSelectedNiche(null)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Change Expert
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chats.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <p className="text-center max-w-sm">
                  How can I help you today regarding your {selectedNiche} project?
                </p>
              </div>
            )}
            {chats.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  chat.role === 'user' 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'glass-card text-slate-200 border border-white/10'
                }`}>
                  <p className="whitespace-pre-wrap">{chat.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="glass-card rounded-2xl p-4 animate-pulse text-slate-400">
                  Expert is thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-slate-900/50">
            <div className="flex gap-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalSuite;
