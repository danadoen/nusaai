
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { ModuleType, Profile } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreativeStudio from './pages/CreativeStudio';
import ProfessionalSuite from './pages/ProfessionalSuite';
import CareerCenter from './pages/CareerCenter';
import HealthHub from './pages/HealthHub';
import Automation from './pages/Automation';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import About from './pages/About';
import Changelog from './pages/Changelog';
import Legal from './pages/Legal';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleType>('dashboard');
  const [lang, setLang] = useState<'en' | 'id'>('en');
  const [isViewingAuth, setIsViewingAuth] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setIsViewingAuth(false);
        setIsGuestMode(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        setIsViewingAuth(false);
        setIsGuestMode(false);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const profileSubscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session.user.id}`,
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profileSubscription);
    };
  }, [session]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert([{ 
          id: userId, 
          full_name: session?.user?.user_metadata?.full_name || 'New User', 
          language_preference: 'en',
          subscription_status: 'free',
          credits_remaining: 1,
          role: 'user'
        }])
        .select()
        .single();
      setProfile(newProfile);
    } else {
      setProfile(data);
      if (data?.language_preference) setLang(data.language_preference);
    }
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'id' : 'en';
    setLang(next);
    if (session) {
      supabase.from('profiles').update({ language_preference: next }).eq('id', session.user.id);
    }
  };

  const handleStartGuest = (module: ModuleType) => {
    setIsGuestMode(true);
    setCurrentModule(module);
  };

  const handleNavigate = (module: ModuleType) => {
    setCurrentModule(module);
    if (module === 'dashboard' && !session) {
       setIsGuestMode(false);
    }
  };

  // Pengecekan apakah modul saat ini adalah halaman publik
  const isPublicModule = ['pricing', 'about', 'changelog', 'privacy', 'terms'].includes(currentModule);

  // Jika belum login, bukan dalam mode guest, dan bukan halaman publik -> Tampilkan Landing
  if (!session && !isGuestMode && !isPublicModule) {
    if (isViewingAuth) {
      return (
        <div className="relative">
          <button 
            onClick={() => setIsViewingAuth(false)}
            className="fixed top-8 left-8 z-[100] text-slate-400 hover:text-white transition-all text-sm font-bold flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <Auth />
        </div>
      );
    }
    return (
      <Landing 
        lang={lang} 
        toggleLang={toggleLang} 
        onLoginClick={() => setIsViewingAuth(true)}
        onStartGuest={handleStartGuest}
        navigateTo={handleNavigate}
      />
    );
  }

  const renderContent = () => {
    const triggerAuth = () => setIsViewingAuth(true);
    const triggerPricing = () => setCurrentModule('pricing');

    // Protect Admin Module
    if (currentModule === 'admin' && profile?.role !== 'admin') {
      return <Dashboard lang={lang} navigateTo={handleNavigate} profile={profile} isGuest={!session} />;
    }

    switch (currentModule) {
      case 'dashboard': 
        return <Dashboard lang={lang} navigateTo={handleNavigate} profile={profile} isGuest={!session} />;
      case 'creative': 
        return <CreativeStudio lang={lang} profile={profile} isGuest={!session} onPaywallTrigger={session ? triggerPricing : triggerAuth} />;
      case 'professional': 
        return <ProfessionalSuite lang={lang} profile={profile} isGuest={!session} onPaywallTrigger={session ? triggerPricing : triggerAuth} />;
      case 'career': 
        return <CareerCenter lang={lang} profile={profile} isGuest={!session} onPaywallTrigger={session ? triggerPricing : triggerAuth} />;
      case 'health': 
        return <HealthHub lang={lang} profile={profile} isGuest={!session} onPaywallTrigger={session ? triggerPricing : triggerAuth} />;
      case 'automation': 
        return <Automation lang={lang} isGuest={!session} onPaywallTrigger={triggerAuth} />;
      case 'settings': 
        return session ? <Settings lang={lang} /> : <Auth />;
      case 'pricing': 
        return <Pricing lang={lang} />;
      case 'about':
        return <About lang={lang} />;
      case 'changelog':
        return <Changelog lang={lang} />;
      case 'admin':
        return <AdminDashboard lang={lang} />;
      case 'privacy':
      case 'terms':
        return <Legal lang={lang} type={currentModule} />;
      default: 
        return <Dashboard lang={lang} navigateTo={handleNavigate} profile={profile} isGuest={!session} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar 
        currentModule={currentModule} 
        setCurrentModule={handleNavigate} 
        lang={lang} 
        profile={profile}
        isGuest={!session}
        onLoginClick={() => setIsViewingAuth(true)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          lang={lang} 
          toggleLang={toggleLang} 
          profile={profile} 
          isGuest={!session}
          setCurrentModule={handleNavigate}
          onLoginClick={() => setIsViewingAuth(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {!session && isGuestMode && (
            <div className="max-w-7xl mx-auto mb-6">
              <div className="glass-card border-amber-500/30 p-4 rounded-2xl flex items-center justify-between bg-amber-500/5">
                <p className="text-sm font-medium text-amber-200">
                  ⚠️ Guest Mode: You have 1 trial credit. Login to save results and unlock full features.
                </p>
                <button onClick={() => setIsViewingAuth(true)} className="px-4 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-400 transition-all">
                  Sign In
                </button>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
