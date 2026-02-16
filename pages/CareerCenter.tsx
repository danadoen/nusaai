
import React, { useState } from 'react';
import { UserCircle, FileText, CheckCircle, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { Profile } from '../types';
import { TRANSLATIONS } from '../constants';

// Added missing props to resolve type error in App.tsx
interface CareerCenterProps {
  lang: 'en' | 'id';
  profile: Profile | null;
  onPaywallTrigger: () => void;
  // Added isGuest to props to match usage in App.tsx
  isGuest?: boolean;
}

const CareerCenter: React.FC<CareerCenterProps> = ({ lang, profile, onPaywallTrigger, isGuest }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  // Check user access
  const canGenerate = isGuest ? (localStorage.getItem('nusai_guest_trial_used') !== 'true') : (profile?.subscription_status === 'pro' || (profile?.credits_remaining || 0) > 0);

  const handleAnalyze = async () => {
    if (!resumeText) return;
    
    // Enforce paywall
    if (!canGenerate) {
      onPaywallTrigger();
      return;
    }

    setLoading(true);
    try {
      const prompt = `
        Act as a professional Recruiter and ATS Expert.
        Analyze the following resume against this job description (if provided).
        Resume: "${resumeText}"
        Job: "${jobDescription || 'N/A'}"
        
        Provide:
        1. Match Percentage (0-100%)
        2. Keyword gaps (What's missing?)
        3. 5 Specific suggestions to improve visibility for AI screens.
        4. Rewrite the 'About Me' section to be more impactful.
        Response language: ${lang === 'en' ? 'English' : 'Bahasa Indonesia'}.
      `;
      const res = await GeminiService.generate(prompt);
      setReport(res);
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
    <div className="max-w-4xl mx-auto space-y-8 relative">
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
      
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400">
          <UserCircle size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Career Center</h1>
          <p className="text-slate-500">Master your job applications with AI-powered optimization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <FileText size={18} className="text-slate-400" /> Resume Content
            </h3>
            <textarea 
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none text-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-slate-400" /> Target Job Description
            </h3>
            <textarea 
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements here (optional)..."
              className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500/50 outline-none resize-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={handleAnalyze}
          disabled={loading || !resumeText}
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Optimize Resume'} <CheckCircle size={20} />
        </button>
      </div>

      {report && (
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 text-emerald-400">
            <CheckCircle size={24} />
            <h2 className="text-xl font-bold">Analysis Report</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
              {report}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerCenter;
