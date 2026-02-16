
import React, { useState } from 'react';
import { Video, Sparkles, Send, Copy, CheckCircle2, Lock, LogIn, Image as ImageIcon, Download } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { supabase } from '../supabaseClient';
import { Profile } from '../types';
import { TRANSLATIONS } from '../constants';

interface CreativeStudioProps {
  lang: 'en' | 'id';
  profile: Profile | null;
  isGuest?: boolean;
  onPaywallTrigger: () => void;
}

const CreativeStudio: React.FC<CreativeStudioProps> = ({ lang, profile, isGuest, onPaywallTrigger }) => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'script' | 'thumbnail'>('script');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const guestUsed = localStorage.getItem('nusai_guest_trial_used') === 'true';
  const canGenerate = isGuest ? !guestUsed : (profile?.subscription_status === 'pro' || (profile?.credits_remaining || 0) > 0);

  const handleGenerate = async () => {
    if (!url) return;
    if (!canGenerate) {
      onPaywallTrigger();
      return;
    }

    setLoading(true);
    setResult(null);
    setGeneratedImageUrl(null);

    try {
      if (mode === 'script') {
        const prompt = `
          Act as a viral content creator. I'll provide a video topic or URL: "${url}".
          Generate the following for a TikTok/Reels Short:
          1. Viral Catchy Title
          2. Hook-driven 30-60 second Script
          3. Caption with relevant hashtags
          4. 3 suggestions for visual cuts
          Provide the response in ${lang === 'en' ? 'English' : 'Bahasa Indonesia'} and format it clearly.
        `;
        const response = await GeminiService.generate(prompt);
        setResult(response);
      } else {
        const prompt = `Create a high-quality cinematic YouTube thumbnail for a video titled: "${url}". Professional lighting, 4k, vibrant colors, trending style.`;
        const response = await GeminiService.generate(prompt, 'gemini-2.5-flash-image');
        
        if (response.startsWith('IMAGE_DATA:')) {
          setGeneratedImageUrl(response.replace('IMAGE_DATA:', ''));
        } else {
          setResult(response);
        }
      }

      if (!isGuest) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('ai_history').insert([{
            user_id: user.id,
            module_type: 'creative',
            input_data: { url, mode },
            output_data: { response: result || generatedImageUrl }
          }]);
        }
      }
    } catch (err: any) {
      if (err.message === "AUTH_REQUIRED" || err.message === "PAYWALL_TRIGGERED") {
        onPaywallTrigger();
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (isGuest) {
      onPaywallTrigger();
      return;
    }
    if (result) navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400">
          Creative Studio
        </h1>
        <p className="text-slate-400 text-lg">
          Transform long-form ideas into viral Short-form content or visual thumbnails.
        </p>
      </div>

      <div className="flex justify-center p-1 bg-white/5 rounded-2xl w-fit mx-auto border border-white/10">
        <button 
          onClick={() => setMode('script')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'script' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><Video size={16} /> Script & Hooks</div>
        </button>
        <button 
          onClick={() => setMode('thumbnail')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'thumbnail' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
        >
          <div className="flex items-center gap-2"><ImageIcon size={16} /> Thumbnail Generator</div>
        </button>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative">
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
              className="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center gap-2"
             >
               {isGuest ? <LogIn size={18} /> : null}
               {isGuest ? "Sign In to Continue" : "Upgrade Now"}
             </button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-rose-400 transition-colors">
              {mode === 'script' ? <Video size={20} /> : <ImageIcon size={20} />}
            </div>
            <input 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={mode === 'script' ? "Paste YouTube Link or Video Topic..." : "Describe the thumbnail you want..."}
              className="w-full bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:bg-slate-800 transition-all text-lg"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading || !url}
            className="px-8 py-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
          >
            {loading ? 'Processing...' : 'Generate'} <Sparkles size={20} />
          </button>
        </div>
      </div>

      {generatedImageUrl && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
            <span className="text-sm font-semibold text-rose-400">AI Generated Thumbnail</span>
            <a 
              href={generatedImageUrl} 
              download="thumbnail.png"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-300"
            >
              <Download size={18} /> Download
            </a>
          </div>
          <div className="p-4">
             <img src={generatedImageUrl} alt="Generated Thumbnail" className="w-full h-auto rounded-xl shadow-2xl border border-white/5" />
          </div>
        </div>
      )}

      {result && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
            <span className="text-sm font-semibold text-rose-400">AI Generated {mode === 'script' ? 'Script' : 'Concept'}</span>
            <button 
              onClick={copyToClipboard}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>
          <div className="p-8 prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-lg">
              {result}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeStudio;
