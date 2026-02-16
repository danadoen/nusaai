
import React from 'react';
import { Zap, CheckCircle2, Calendar } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface ChangelogProps {
  lang: 'en' | 'id';
}

const Changelog: React.FC<ChangelogProps> = ({ lang }) => {
  const updates = [
    {
      version: 'v1.0.0',
      date: 'May 2024',
      title: 'The Grand Launch',
      items: [
        'Initial release of NusaAI Hub with 5 core modules.',
        'Integration with Google Gemini 3.0 Pro & Flash.',
        'Supabase real-time database and authentication.',
        'Support for Indonesian & English (Bilingual).',
        'Guest mode with trial credits.'
      ]
    },
    {
      version: 'v0.9.0',
      date: 'April 2024',
      title: 'Beta Testing Phase',
      items: [
        'Stress testing the Creative Studio module.',
        'Implemented "Bring Your Own Key" (BYOK) settings.',
        'Responsive UI refinements for mobile devices.'
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{TRANSLATIONS.changelog[lang]}</h1>
        <p className="text-slate-500">Tracking our journey to build the ultimate AI Super-App.</p>
      </div>

      <div className="space-y-12">
        {updates.map((update, i) => (
          <div key={i} className="relative pl-10 border-l border-white/10 group">
            <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/50 group-hover:scale-125 transition-transform" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-indigo-400">
                  {update.version}
                </span>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  <Calendar size={14} /> {update.date}
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white">{update.title}</h3>
              
              <ul className="space-y-3">
                {update.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-400 text-sm">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Changelog;
