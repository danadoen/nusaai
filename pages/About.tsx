
import React from 'react';
import { Info, Target, Cpu, Globe, Users } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface AboutProps {
  lang: 'en' | 'id';
}

const About: React.FC<AboutProps> = ({ lang }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          {TRANSLATIONS.about[lang]}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          NusaAI is an Indonesian-born AI Super-App designed to empower the global digital workforce with cutting-edge Google Gemini technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold">Our Mission</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            To democratize access to advanced artificial intelligence, making complex automation and professional expertise accessible to everyone, everywhere.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Cpu size={24} />
          </div>
          <h3 className="text-xl font-bold">Tech Stack</h3>
          <p className="text-slate-500 text-sm leading-relaxed">
            Built on top of Google Gemini Pro and Flash models, integrated with Supabase for secure, real-time data management and global scalability.
          </p>
        </div>
      </div>

      <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 space-y-8">
        <div className="flex items-center gap-4">
          <Users size={32} className="text-indigo-400" />
          <h2 className="text-2xl font-bold">The NusaAI Vision</h2>
        </div>
        <div className="space-y-6 text-slate-400 leading-relaxed">
          <p>
            Founded with the spirit of "Nusantara", we aim to bridge the gap between local Indonesian potential and global digital standards. Whether you are a content creator in Jakarta or a business consultant in New York, NusaAI provides the tools to 10x your productivity.
          </p>
          <p>
            We believe in transparency. That's why we allow users to bring their own API keys, ensuring they only pay for what they use while maintaining full control over their AI infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
