
import React, { useState } from 'react';
import { Zap, Mail, Database, Bot, ArrowRight, Lock, Sparkles, Send, Terminal, Clipboard } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface AutomationProps {
  lang: 'en' | 'id';
  isGuest?: boolean;
  onPaywallTrigger?: () => void;
}

const Automation: React.FC<AutomationProps> = ({ lang, isGuest, onPaywallTrigger }) => {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [workflow, setWorkflow] = useState<string | null>(null);

  const handleGenerateWorkflow = async () => {
    if (!task) return;
    if (isGuest) {
      onPaywallTrigger?.();
      return;
    }

    setLoading(true);
    try {
      const prompt = `
        Act as an Agentic AI Architect. The user wants to automate this task: "${task}".
        Design a complete automation workflow.
        Structure:
        1. Trigger (e.g., New Email, Schedule)
        2. Logic (AI Processing)
        3. Actions (e.g., Send SMS, Update Sheet)
        4. Tooling (Recommended Zapier/Make.com steps)
        
        Provide the result in ${lang === 'en' ? 'English' : 'Bahasa Indonesia'}.
        Keep it professional and technical yet easy to implement.
      `;
      const res = await GeminiService.generate(prompt);
      setWorkflow(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 relative">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Agentic Lab
        </h1>
        <p className="text-slate-400 text-lg">
          Describe a workflow, and our AI will build the automation logic for you.
        </p>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="relative group">
          <Terminal className="absolute left-4 top-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <textarea 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., When I receive an invoice via Gmail, extract the total and save it to my Monthly Budget Google Sheet..."
            className="w-full h-32 bg-slate-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm resize-none"
          />
        </div>
        <button 
          onClick={handleGenerateWorkflow}
          disabled={loading || !task}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
        >
          {loading ? 'Designing Workflow...' : 'Design Agentic Workflow'} <Zap size={20} />
        </button>
      </div>

      {workflow && (
        <div className="glass-card rounded-3xl border border-indigo-500/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between p-4 bg-indigo-600/10 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-indigo-400" />
              <span className="text-sm font-bold">Automation Blueprint</span>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 text-xs">
              <Clipboard size={14} /> Copy Blueprint
            </button>
          </div>
          <div className="p-8 prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-sm">
              {workflow}
            </pre>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="text-indigo-400" size={20} />
            <h3 className="font-bold">Email Agent</h3>
          </div>
          <p className="text-xs text-slate-500">Available in Pro. Automate Gmail threads with natural language understanding.</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <Database className="text-cyan-400" size={20} />
            <h3 className="font-bold">Sheet Connector</h3>
          </div>
          <p className="text-xs text-slate-500">Available in Pro. Extract data from any unstructured text into clean rows.</p>
        </div>
      </div>
    </div>
  );
};

export default Automation;
