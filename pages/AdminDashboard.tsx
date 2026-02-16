
import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Key, TrendingUp, Search, UserCheck, CreditCard, Save, ShieldCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Profile } from '../types';
import { TRANSLATIONS } from '../constants';

interface AdminDashboardProps {
  lang: 'en' | 'id';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang }) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [masterKey, setMasterKey] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, proUsers: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profiles) {
        setUsers(profiles);
        const proCount = profiles.filter(p => p.subscription_status === 'pro').length;
        setStats({
          totalUsers: profiles.length,
          proUsers: proCount,
          revenue: proCount * 19.99
        });
      }

      const { data: config } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'master_gemini_api_key')
        .single();
      if (config) setMasterKey(config.value);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCredits = async (userId: string, newCredits: number) => {
    const { error } = await supabase
      .from('profiles')
      .update({ credits_remaining: newCredits })
      .eq('id', userId);
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, credits_remaining: newCredits } : u));
    }
  };

  const handleUpdateStatus = async (userId: string, status: 'free' | 'pro') => {
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: status, credits_remaining: status === 'pro' ? 9999 : 1 })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, subscription_status: status, credits_remaining: status === 'pro' ? 9999 : 1 } : u));
    }
  };

  const saveMasterKey = async () => {
    setSavingKey(true);
    await supabase.from('system_config').upsert({ key: 'master_gemini_api_key', value: masterKey });
    setSavingKey(false);
    alert(TRANSLATIONS.save_success[lang]);
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ShieldCheck className="text-rose-500" /> Super Admin Workspace
        </h1>
        <div className="flex gap-4">
          <button onClick={fetchAdminData} className="text-xs font-bold text-slate-500 hover:text-white transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
            <Users size={20} />
          </div>
          <p className="text-4xl font-extrabold">{stats.totalUsers}</p>
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp size={12} /> Active community
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Est. Monthly Revenue</span>
            <DollarSign size={20} />
          </div>
          <p className="text-4xl font-extrabold text-emerald-400">${stats.revenue.toFixed(2)}</p>
          <p className="text-xs text-slate-500">Pro Subscriptions</p>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-rose-400 uppercase">Master API Key</span>
            <Key size={20} className="text-rose-400" />
          </div>
          <input 
            type="password"
            value={masterKey}
            onChange={(e) => setMasterKey(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-xs focus:ring-1 focus:ring-rose-500 outline-none"
            placeholder="Kunci Global Gemini"
          />
          <button 
            onClick={saveMasterKey}
            disabled={savingKey}
            className="w-full py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-500 transition-all flex items-center justify-center gap-2"
          >
            {savingKey ? 'Saving...' : 'Update Master Key'} <Save size={14} />
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-xl font-bold">User Management</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or UUID..."
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none min-w-[300px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role & Plan</th>
                <th className="px-6 py-4">Credits</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${user.role === 'admin' ? 'bg-rose-500 text-white' : 'bg-slate-800'}`}>
                        {user.full_name?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="font-bold">{user.full_name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex gap-2">
                       <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${user.role === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-400'}`}>
                        {user.role}
                      </span>
                      <button 
                        onClick={() => handleUpdateStatus(user.id, user.subscription_status === 'pro' ? 'free' : 'pro')}
                        className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all ${
                          user.subscription_status === 'pro' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                        }`}
                      >
                        {user.subscription_status}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold">
                    {user.subscription_status === 'pro' || user.role === 'admin' ? '∞' : user.credits_remaining}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleUpdateCredits(user.id, (user.credits_remaining || 0) + 10)}
                        title="Add 10 Credits"
                        className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all"
                      >
                        <TrendingUp size={14} />
                      </button>
                      <button 
                         onClick={() => handleUpdateCredits(user.id, Math.max(0, (user.credits_remaining || 0) - 10))}
                         className="p-1.5 bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-700"
                      >
                        -10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center text-slate-500">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
