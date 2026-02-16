
import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, HeartPulse, ListFilter, Lock } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { Profile } from '../types';
import { TRANSLATIONS } from '../constants';

// Added missing props to resolve type error in App.tsx
interface HealthHubProps {
  lang: 'en' | 'id';
  profile: Profile | null;
  onPaywallTrigger: () => void;
  // Added isGuest to props to match usage in App.tsx
  isGuest?: boolean;
}

const HealthHub: React.FC<HealthHubProps> = ({ lang, profile, onPaywallTrigger, isGuest }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  // Check user access
  const canGenerate = isGuest ? (localStorage.getItem('nusai_guest_trial_used') !== 'true') : (profile?.subscription_status === 'pro' || (profile?.credits_remaining || 0) > 0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    // Enforce paywall
    if (!canGenerate) {
      onPaywallTrigger();
      return;
    }

    setLoading(true);
    try {
      const prompt = `
        Analyze this food image. 
        1. Identify the items.
        2. Estimate calories per item and total.
        3. Suggest a healthier alternative.
        4. Provide brief nutritional facts (Protein, Carbs, Fats).
        Format the response nicely in ${lang === 'en' ? 'English' : 'Bahasa Indonesia'}.
      `;
      // Use gemini-3-flash-preview for general image analysis as per guidelines
      const res = await GeminiService.generate(prompt, 'gemini-3-flash-preview', image);
      setAnalysis(res);
    } catch (err: any) {
      if (err.message === "PAYWALL_TRIGGERED" || err.message === "AUTH_REQUIRED") {
        onPaywallTrigger();
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 relative">
      {/* Paywall overlay */}
      {!canGenerate && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 rounded-[2.5rem] flex flex-col items-center justify-center p-6 text-center">
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

      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Health Hub
        </h1>
        <p className="text-slate-400 text-lg">
          Snap your meal. Track your calories. Stay fit with Vision AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="glass-card aspect-square rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
            {image ? (
              <>
                <img src={image} alt="Meal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md"
                >
                  Change
                </button>
              </>
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <Camera size={32} />
                </div>
                <div>
                  <p className="font-bold text-lg">Upload Meal Image</p>
                  <p className="text-slate-500 text-sm">Select a clear photo of your food</p>
                </div>
                <label className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 cursor-pointer transition-colors block">
                  Select File
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleAnalyze}
            disabled={loading || !image}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
          >
            {loading ? 'Analyzing Nutrition...' : 'Scan My Meal'} <Sparkles size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {!analysis ? (
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xl font-bold">Why track with NusaAI?</h3>
              <div className="space-y-4">
                {[
                  { icon: HeartPulse, label: 'Visual Detection', desc: 'No more manual logging. Just snap and go.' },
                  { icon: ListFilter, label: 'Macronutrient Breakdown', desc: 'See Protein, Carbs, and Fats instantly.' },
                  { icon: Sparkles, label: 'AI Health Coaching', desc: 'Get smart suggestions for every meal.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="p-2 h-fit rounded-lg bg-emerald-500/10 text-emerald-400">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 rounded-3xl border border-emerald-500/20 animate-in fade-in duration-500 space-y-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <HeartPulse size={24} />
                <h2 className="text-xl font-bold">Nutritional Analysis</h2>
              </div>
              <div className="prose prose-invert">
                <pre className="whitespace-pre-wrap font-sans text-slate-300 text-sm leading-relaxed">
                  {analysis}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthHub;
