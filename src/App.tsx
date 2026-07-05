import React, { useState, useEffect } from 'react';
import { Home, Camera, MessageSquare, CloudSun, Landmark, Info, LogOut, Activity, Wifi, WifiOff, User as UserIcon, Sun, Moon } from 'lucide-react';
import { Screen, Language, Crop, User } from './types';
import { t } from './localization';

// Import modular pages/components
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import LanguageStep from './components/LanguageStep';
import CropStep from './components/CropStep';
import ProfileStep from './components/ProfileStep';
import Dashboard from './components/Dashboard';
import WeatherInsights from './components/WeatherInsights';
import DiagnosisScreen from './components/DiagnosisScreen';
import ChatScreen from './components/ChatScreen';
import MarketIntelligence from './components/MarketIntelligence';
import AboutUs from './components/AboutUs';
import ProfileTab from './components/ProfileTab';

// Helper to initialize local storage cache with some default mock data if not set
const initializeOfflineCache = () => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem('fasal_last_sync')) {
    const now = new Date();
    localStorage.setItem('fasal_last_sync', now.toLocaleString());
  }
};

const getProfileTabLabel = (lang: Language): string => {
  const map: Record<Language, string> = {
    English: 'Profile',
    Hindi: 'प्रोफ़ाइल',
    Punjabi: 'ਪ੍ਰੋਫਾਈਲ',
    Marathi: 'प्रोफाइल',
    Telugu: 'ప్రొఫైల్',
    Bengali: 'প্রোফাইল',
    Tamil: 'சுயவிவரம்',
    Kannada: 'ಪ್ರೊಫೈಲ್',
    Malayalam: 'പ്രൊഫൈൽ',
    Gujarati: 'પ્રોફાઇલ',
    Odia: 'ପ୍ରୋଫାଇଲ୍',
    Assamese: 'প্ৰফাইল'
  };
  return map[lang] || 'Profile';
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  
  // Theme State (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fasal_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fasal_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fasal_theme', 'light');
    }
  }, [theme]);
  
  // Master User Authentication and Onboarding States
  const [user, setUser] = useState<User | null>(null);
  
  // Registration temporary states
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [selectedCrops, setSelectedCrops] = useState<Crop[]>([]);
  const [coords, setCoords] = useState<{ lat?: number; lng?: number; address?: string } | null>(null);
  const [name, setName] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Network connectivity state
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Listen to browser network changes
  useEffect(() => {
    initializeOfflineCache();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Authentication Handlers
  const handleLoginSuccess = (phoneNumber: string) => {
    setPhone(phoneNumber);
    setScreen('onboarding-1'); // Proceed to Step 1 of onboarding
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setCoords({ lat, lng, address });
  };

  const handleToggleCrop = (crop: Crop) => {
    setSelectedCrops((prev) => 
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleFinishOnboarding = () => {
    const newUser: User = {
      name: name || 'Ramesh',
      phone: phone || '+91 99999 88888',
      language,
      location: coords,
      crops: selectedCrops,
      voiceEnabled
    };
    setUser(newUser);
    setScreen('dashboard'); // Enter main authenticated app dashboard!
  };

  const handleLogOut = () => {
    // Clear state
    setUser(null);
    setPhone('');
    setSelectedCrops([]);
    setCoords(null);
    setName('');
    setScreen('landing');
  };

  const handleUpdateLanguage = (newLang: Language) => {
    setLanguage(newLang);
    if (user) {
      setUser({
        ...user,
        language: newLang
      });
    }
  };

  // Helper to check if a screen is part of authenticated dashboard shell
  const isAuthenticatedScreen = [
    'dashboard', 'insights', 'diagnosis', 'assistant', 'market', 'profile'
  ].includes(screen) && user !== null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      
      {/* 1. RENDER AUTHENTICATED MASTER SHELL WITH TOP & BOTTOM NAV */}
      {isAuthenticatedScreen && user ? (
        <div className="flex-1 flex flex-col">
          
          {/* TOP NAV BAR */}
          <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 sm:px-6 shadow-sm transition-colors duration-200">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              
              <div 
                className="flex items-center space-x-2 cursor-pointer" 
                onClick={() => setScreen('dashboard')}
              >
                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-sm">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-slate-100 tracking-tight">
                  Fasal <span className="text-emerald-600 font-extrabold">Doctor</span>
                </span>
              </div>

               {/* User overview, connection status and LogOut button */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Simulated Network Toggle */}
                <button
                  type="button"
                  id="network-toggle-btn"
                  onClick={() => setIsOnline(!isOnline)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-extrabold flex items-center space-x-1 sm:space-x-1.5 transition-all border ${
                    isOnline
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                      : 'bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 animate-pulse hover:bg-rose-100 dark:hover:bg-rose-900/30'
                  }`}
                  title={isOnline ? "Switch to Offline Mode" : "Switch to Online Mode"}
                >
                  {isOnline ? (
                    <>
                      <Wifi className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="hidden xs:inline">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
                      <span className="hidden xs:inline">Offline</span>
                    </>
                  )}
                </button>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  id="theme-toggle-btn"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all border border-slate-100 dark:border-slate-700 cursor-pointer"
                  title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                >
                  {theme === 'light' ? (
                    <Moon className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
                  )}
                </button>

                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{user.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    {user.crops[0] || 'Rice'} Cultivator
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogOut}
                  className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition-colors border border-slate-100 dark:border-slate-700 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

            </div>
          </header>

          {/* MAIN SCROLLABLE CONTENT BODY */}
          <main className="flex-1 py-6 bg-slate-50/60 overflow-y-auto">
            {(screen === 'dashboard' || screen === 'diagnosis') && (
              <Dashboard 
                user={user} 
                onNavigate={setScreen} 
                onUpdateLanguage={handleUpdateLanguage} 
                isOnline={isOnline} 
                initialTab={screen === 'diagnosis' ? 'diagnosis' : 'overview'}
              />
            )}
            {screen === 'insights' && <WeatherInsights user={user} onNavigate={setScreen} isOnline={isOnline} />}
            {screen === 'assistant' && <ChatScreen language={user.language} crops={user.crops} isOnline={isOnline} />}
            {screen === 'market' && <MarketIntelligence language={user.language} crops={user.crops} isOnline={isOnline} />}
            {screen === 'profile' && (
              <ProfileTab 
                user={user} 
                onUpdateLanguage={handleUpdateLanguage} 
                onLogOut={handleLogOut} 
                isOnline={isOnline} 
                theme={theme}
                setTheme={setTheme}
              />
            )}
          </main>

          {/* BOTTOM PERSISTENT TAB BAR */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_16px_rgba(15,23,42,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.2)] px-2 py-2 transition-colors duration-200">
            <div className="max-w-md mx-auto flex justify-between items-center text-center">
              
              {/* Tab 1: Dashboard */}
              <button
                onClick={() => setScreen('dashboard')}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all outline-none cursor-pointer ${
                  screen === 'dashboard' || screen === 'diagnosis' ? 'text-emerald-600 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Home className="h-5 w-5 stroke-[2.2px]" />
                <span className="text-[9px] font-bold tracking-tight block">{t('home', language)}</span>
              </button>

              {/* Tab 2: Chatbot Assistant */}
              <button
                onClick={() => setScreen('assistant')}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all outline-none cursor-pointer ${
                  screen === 'assistant' ? 'text-emerald-600 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <MessageSquare className="h-5 w-5 stroke-[2.2px]" />
                <span className="text-[9px] font-bold tracking-tight block">{t('assistant', language)}</span>
              </button>

              {/* Tab 3: Climate Weather */}
              <button
                onClick={() => setScreen('insights')}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all outline-none cursor-pointer ${
                  screen === 'insights' ? 'text-emerald-600 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <CloudSun className="h-5 w-5 stroke-[2.2px]" />
                <span className="text-[9px] font-bold tracking-tight block">{t('insights', language)}</span>
              </button>

              {/* Tab 4: Mandis prices */}
              <button
                onClick={() => setScreen('market')}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all outline-none cursor-pointer ${
                  screen === 'market' ? 'text-emerald-600 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Landmark className="h-5 w-5 stroke-[2.2px]" />
                <span className="text-[9px] font-bold tracking-tight block">{t('market', language)}</span>
              </button>

              {/* Tab 5: Farmer Profile */}
              <button
                onClick={() => setScreen('profile')}
                className={`flex-1 py-1.5 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all outline-none cursor-pointer ${
                  screen === 'profile' ? 'text-emerald-600 font-bold' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <UserIcon className="h-5 w-5 stroke-[2.2px]" />
                <span className="text-[9px] font-bold tracking-tight block">{getProfileTabLabel(language)}</span>
              </button>

            </div>
          </nav>

        </div>
      ) : (
        
        /* 2. RENDER UNAUTHENTICATED VISITOR SCREENS (LANDING, LOGIN, ONBOARDING) */
        <div className="flex-1 flex flex-col">
          {screen === 'landing' && (
            <LandingPage 
              language={language}
              onStart={() => setScreen('login')} 
              onNavigate={setScreen} 
              setLanguage={setLanguage} 
              theme={theme}
              setTheme={setTheme}
            />
          )}

          {screen === 'login' && (
            <LoginScreen 
              language={language}
              onLoginSuccess={handleLoginSuccess} 
              onNavigate={setScreen} 
            />
          )}

          {screen === 'onboarding-1' && (
            <LanguageStep 
              language={language} 
              onSetLanguage={setLanguage} 
              onLocationSelect={handleLocationSelect} 
              onNext={() => setScreen('onboarding-2')} 
            />
          )}

          {screen === 'onboarding-2' && (
            <CropStep 
              language={language}
              selectedCrops={selectedCrops} 
              onToggleCrop={handleToggleCrop} 
              onBack={() => setScreen('onboarding-1')} 
              onNext={() => setScreen('onboarding-3')} 
            />
          )}

          {screen === 'onboarding-3' && (
            <ProfileStep 
              language={language}
              name={name} 
              onSetName={setName} 
              voiceEnabled={voiceEnabled} 
              onToggleVoice={() => setVoiceEnabled(!voiceEnabled)} 
              onBack={() => setScreen('onboarding-2')} 
              onSubmit={handleFinishOnboarding} 
            />
          )}

          {/* Fallback support for about-us view prior to registering */}
          {screen === 'about' && (
            <div className="pt-12">
              <nav className="fixed top-0 left-0 right-0 bg-white/80 border-b border-slate-100 p-4 flex justify-between items-center z-50">
                <span className="font-display font-extrabold text-lg text-slate-900">Fasal Doctor</span>
                <button 
                  onClick={() => setScreen('landing')} 
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Back to Home
                </button>
              </nav>
              <div className="mt-12">
                <AboutUs language={language} onStart={() => setScreen('login')} />
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
