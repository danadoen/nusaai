
import React from 'react';
import { Shield, FileText, Lock, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface LegalProps {
  lang: 'en' | 'id';
  type: 'privacy' | 'terms';
}

const Legal: React.FC<LegalProps> = ({ lang, type }) => {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? TRANSLATIONS.privacy_policy[lang] : TRANSLATIONS.terms_of_service[lang];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-6">
          {isPrivacy ? <Shield size={32} /> : <FileText size={32} />}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-slate-500">Last updated: May 20, 2024</p>
      </div>

      <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 space-y-8 text-slate-300 leading-relaxed">
        {isPrivacy ? (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
              <p>We collect information you provide directly to us when you create an account, update your profile, and use our AI tools. This includes your name, email, and input data provided to Gemini AI models.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. How We Use Your Data</h2>
              <p>Your data is primarily used to process your AI requests. We do not sell your personal data. Input data provided for AI generation is processed through Google Gemini API and is subject to their privacy standards.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. API Key Security</h2>
              <p>When you provide your own Google Gemini API key, it is encrypted and stored securely in your private vault within our database. We only use this key to authenticate requests made by you.</p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">1. Terms of Use</h2>
              <p>By accessing NusaAI Hub, you agree to comply with these terms. You are responsible for any content you generate and must ensure it does not violate any local or international laws.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">2. Subscription & Credits</h2>
              <p>Free accounts are limited to trial credits. Pro subscriptions provide unlimited access. Credits are non-transferable and may expire based on your plan.</p>
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white">3. Disclaimer of Liability</h2>
              <p>NusaAI Hub provides AI-generated content. We are not responsible for inaccuracies in AI outputs. Users should verify critical information, especially in legal, medical, or professional contexts.</p>
            </section>
          </>
        )}
      </div>

      <div className="flex justify-center gap-8 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <Lock size={14} /> Secure Encryption
        </div>
        <div className="flex items-center gap-2">
          <Globe size={14} /> Global Compliance
        </div>
      </div>
    </div>
  );
};

export default Legal;
