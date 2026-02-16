
import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Save, CheckCircle, Shield, User, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { TRANSLATIONS } from '../constants';

interface SettingsProps {
  lang: 'en' | 'id';
}

const Settings: React.FC<SettingsProps> = ({ lang }) => {
  const [apiKey, setApiKey] = useState('');
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Fetch API Key
      const { data: keyData } = await supabase
        .from('user_api_keys')
        .select('gemini_api_key')
        .eq('user_id', user.id)
        .single();
      if (keyData) setApiKey(keyData.gemini_api_key);

      // Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      if (profileData) setFullName(profileData.full_name);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update API Key
      const { error: keyError } = await supabase
        .from('user_api_keys')
        .upsert({ 
          user_id: user.id, 
          gemini_api_key: apiKey,
          updated_at: new Date().toISOString()
        });

      // Update Profile Name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (keyError || profileError) throw (keyError || profileError);
      
      setStatus('Settings updated successfully!');
      setTimeout(() => setStatus(null), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400">
          <SettingsIcon size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{TRANSLATIONS.settings[lang]}</h1>
          <p className="text-slate-500">Configure your personal preferences and AI keys.</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <User size={20} className="text-indigo-400" /> Personal Profile
        </h3>
        <div className="space-y-4">
          <label className="text-sm font-medium text-slate-400">Display Name</label>
          <input 
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Name"
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* AI Key Section */}
      <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-lg font-bold flex items-center gap-2">
              <Key size={20} className="text-indigo-400" /> Google Gemini API Key
            </label>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Shield size={12} /> Securely encrypted
            </span>
          </div>
          <p className="text-sm text-slate-500">
            NusaAI can use your personal API key for high-volume tasks. If empty, our global key will be used.
          </p>
          <div className="relative group">
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={TRANSLATIONS.api_key_placeholder[lang]}
              className="w-full bg-slate-900 border border-white/10 rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
          >
            {saving ? 'Saving...' : TRANSLATIONS.save_settings[lang]} <Save size={20} />
          </button>
          
          {status && (
            <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 animate-in slide-in-from-top-2">
              <CheckCircle size={18} />
              <span>{status}</span>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-4">
        <h3 className="font-bold">Subscription Status</h3>
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-indigo-500/20">
          <div>
            <p className="font-bold text-indigo-400">NusaAI Free Trial</p>
            <p className="text-xs text-slate-500">Upgrade to Pro for unlimited generation and agentic features.</p>
          </div>
          <button className="text-sm font-semibold hover:text-white transition-colors underline">Change Plan</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
