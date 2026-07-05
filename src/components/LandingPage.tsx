import React, { useState } from 'react';
import { Activity, Languages, ArrowRight, ShieldCheck, CloudSun, Mic, FileSpreadsheet, ChevronDown, Check, Sun, Moon } from 'lucide-react';
import { Screen, Language } from '../types';
import { t } from '../localization';

interface LandingPageProps {
  language: Language;
  onStart: () => void;
  onNavigate: (screen: Screen) => void;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const LANGUAGES: { code: Language; name: string; native: string }[] = [
  { code: 'English', name: 'English', native: 'English' },
  { code: 'Hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'Punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'Marathi', name: 'Marathi', native: 'मराठी' },
  { code: 'Telugu', name: 'Telugu', native: 'తెలుగు' },
  { code: 'Bengali', name: 'Bengali', native: 'বাংলা' },
];

export default function LandingPage({ language, onStart, onNavigate, setLanguage, theme, setTheme }: LandingPageProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const lang = language;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 sm:px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">
              Fasal <span className="text-emerald-600">Doctor</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-emerald-600 transition-colors">{t('features', lang)}</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              {lang === 'Hindi' ? 'यह कैसे काम करता है' : lang === 'Punjabi' ? 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ' : lang === 'Marathi' ? 'हे कसे कार्य करते' : lang === 'Telugu' ? 'ఇది ఎలా పనిచేస్తుంది' : lang === 'Bengali' ? 'এটি কীভাবে কাজ করে' : 'How it Works'}
            </a>
            <button onClick={() => onNavigate('about')} className="hover:text-emerald-600 transition-colors">{t('ourMission', lang)}</button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              id="landing-theme-toggle"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all border border-slate-200/40 dark:border-slate-700 cursor-pointer"
              title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-slate-600" />
              ) : (
                <Sun className="h-4 w-4 text-amber-400 animate-pulse" />
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                id="landing-lang-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-1.5 px-3 rounded-lg border border-slate-200/40 dark:border-slate-700 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 animate-fade-in"
              >
                <Languages className="h-4 w-4 text-emerald-600" />
                <span>{LANGUAGES.find(l => l.code === language)?.native || language}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                    {LANGUAGES.map((langItem) => {
                      const isSelected = language === langItem.code;
                      return (
                        <button
                          key={langItem.code}
                          type="button"
                          onClick={() => {
                            setLanguage(langItem.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-300 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="font-semibold">{langItem.native}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{langItem.name}</span>
                          </div>
                          {isSelected && (
                            <Check className="h-4 w-4 text-emerald-600 animate-fade-in" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={onStart}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm py-2 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-100 active:scale-95 transition-all cursor-pointer"
            >
              {t('startFarming', lang)}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-800 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>
                {lang === 'Hindi' ? 'भारतीय किसानों के लिए एआई फसल डॉक्टर' 
                 : lang === 'Punjabi' ? 'ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਏਆਈ ਫਸਲ ਡਾਕਟਰ' 
                 : lang === 'Marathi' ? 'भारतीय शेतकऱ्यांसाठी एआय पीक डॉक्टर' 
                 : lang === 'Telugu' ? 'భారతీయ రైతుల కోసం ఏఐ పంట డాక్టర్' 
                 : lang === 'Bengali' ? 'ভারতীয় কৃষকদের জন্য এআই ফসল ডাক্তার' 
                 : 'AI Crop Doctor for Indian Farmers'}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-none text-center lg:text-left">
              {lang === 'Hindi' ? <>फसल का स्वास्थ्य, <br />निदान तुरंत और सटीक</>
               : lang === 'Punjabi' ? <>ਤੁਹਾਡੀ ਫਸਲ ਦੀ ਸਿਹਤ, <br />ਤੁਰੰਤ ਬਿਮਾਰੀ ਜਾਂਚ</>
               : lang === 'Marathi' ? <>तुमच्या पिकांचे आरोग्य, <br />त्वरित अचूक निदान</>
               : lang === 'Telugu' ? <>మీ పంటల ఆరోగ్యం, <br />తక్షణ రోగ నిర్ధారణ</>
               : lang === 'Bengali' ? <>ফসলের স্বাস্থ্য পরীক্ষা, <br />রোগ নির্ণয় হবে পলকে</>
               : <>Your Crop's Health, <br />Diagnosed Instantly</>}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              {t('landingSubtitle', lang)}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center space-x-2 group active:scale-95 transition-all cursor-pointer"
              >
                <span>
                  {lang === 'Hindi' ? 'ऐप शुरू करें' : lang === 'Punjabi' ? 'ਐਪ ਸ਼ੁਰੂ ਕਰੋ' : lang === 'Marathi' ? 'ॲप सुरू करा' : lang === 'Telugu' ? 'యాప్ ప్రారంభించండి' : lang === 'Bengali' ? 'অ্যাপ চালু করুন' : 'Launch App'}
                </span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-base font-semibold py-3.5 px-8 rounded-2xl shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {lang === 'Hindi' ? 'हमारे बारे में जानें' : lang === 'Punjabi' ? 'ਸਾਡੇ ਬਾਰੇ ਜਾਣੋ' : lang === 'Marathi' ? 'आमच्याबद्दल माहिती' : lang === 'Telugu' ? 'మా గురించి తెలుసుకోండి' : lang === 'Bengali' ? 'আমাদের সম্পর্কে জানুন' : 'Learn More About Us'}
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-100 max-w-md mx-auto lg:mx-0">
              <div className="text-left">
                <span className="block font-display font-extrabold text-2xl text-slate-900">10,000+</span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'Hindi' ? 'सुरक्षित किसान' : lang === 'Punjabi' ? 'ਸੁਰੱਖਿਅਤ ਕਿਸਾਨ' : lang === 'Marathi' ? 'सुरक्षित शेतकरी' : lang === 'Telugu' ? 'రక్షించబడిన రైతులు' : lang === 'Bengali' ? 'সুরক্ষিত কৃষক' : 'Farmers Protected'}
                </span>
              </div>
              <div className="text-left">
                <span className="block font-display font-extrabold text-2xl text-slate-900">98.2%</span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'Hindi' ? 'सटीकता दर' : lang === 'Punjabi' ? 'ਸ਼ੁੱਧਤਾ ਦਰ' : lang === 'Marathi' ? 'अचूकता दर' : lang === 'Telugu' ? 'ఖచ్చితత్వ శాతం' : lang === 'Bengali' ? 'নির্ভুলতার হার' : 'Accuracy Rate'}
                </span>
              </div>
              <div className="text-left">
                <span className="block font-display font-extrabold text-2xl text-slate-900">6+</span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'Hindi' ? 'क्षेत्रीय भाषाएं' : lang === 'Punjabi' ? 'ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ' : lang === 'Marathi' ? 'प्रादेशिक भाषा' : lang === 'Telugu' ? 'ప్రాంతీయ భాషలు' : lang === 'Bengali' ? 'আঞ্চলিক ভাষা' : 'Regional Languages'}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Mockup Widget */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 relative flex justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-100/60 rounded-full blur-3xl -z-10"></div>
            
            {/* Visual crop scanner card mockup */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-xl border border-slate-100 w-full max-w-sm animate-fade-in relative">
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
                  alt="Farmer Scanning Rice Leaves"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* AI Hologram Green Scanning overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-emerald-600/90 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-full flex items-center space-x-1.5 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                  <span>AI LIVE SCAN</span>
                </div>
                
                {/* Scanning green laser line bar */}
                <div className="absolute top-1/3 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce"></div>
                
                {/* Detected target box */}
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/3 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold bg-emerald-600/90 px-1.5 py-0.5 rounded">Rice Blast Spot</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                  <p className="text-xs font-semibold opacity-75">CROP TYPE: BASMATI RICE</p>
                  <p className="text-base font-bold">Magnaporthe oryzae Detected</p>
                </div>
              </div>

              {/* Crop Doctor Prescription Preview */}
              <div className="mt-4 bg-emerald-50 border border-emerald-100/50 p-3.5 rounded-2xl space-y-2 text-left">
                <div className="flex justify-between items-center text-xs font-bold text-emerald-800">
                  <span>SUGGESTED TREATMENT</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[10px]">ORGANIC FIRST</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Apply 5% neem oil extract and avoid overwatering. Top dress with neem cake to enrich resistance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Benefits and Features Grid */}
      <section id="features" className="py-16 bg-white px-4 sm:px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              {lang === 'Hindi' ? 'स्मार्ट किसानों के लिए व्यापक कृषि समाधान' 
               : lang === 'Punjabi' ? 'ਸਮਾਰਟ ਕਿਸਾਨਾਂ ਲਈ ਸੰਪੂਰਨ ਖੇਤੀਬਾੜੀ ਹੱਲ' 
               : lang === 'Marathi' ? 'स्मार्ट शेतकऱ्यांसाठी संपूर्ण कृषी उपाय' 
               : lang === 'Telugu' ? 'స్మార్ట్ రైతుల కోసం సమగ్ర వ్యవసాయ పరిష్కారాలు' 
               : lang === 'Bengali' ? 'স্মার্ট কৃষকদের জন্য সম্পূর্ণ কৃষি সমাধান' 
               : 'Comprehensive Tools Built for Smart Farmers'}
            </h2>
            <p className="text-slate-500 text-base">
              {lang === 'Hindi' ? 'अनुमान लगाना छोड़ें। प्रत्यक्ष, व्यावहारिक और वैज्ञानिक सलाह के साथ अपनी खेती के निर्णयों को सशक्त बनाएं।' 
               : lang === 'Punjabi' ? 'ਅੰਦਾਜ਼ੇ ਲਗਾਉਣੇ ਛੱਡੋ। ਸਿੱਧੀ ਅਤੇ ਵਿਗਿਆਨਕ ਸਲਾਹ ਨਾਲ ਆਪਣੀ ਖੇਤੀ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰੋ।' 
               : lang === 'Marathi' ? 'अंदाज लावणे थांबवा। थेट आणि वैज्ञानिक सल्ल्याने शेतीचे निर्णय सक्षम करा।' 
               : lang === 'Telugu' ? 'అంచనాలకు స్వస్తి చెప్పండి. ప్రత్యక్ష, కార్యాచరణ మరియు శాస్త్రీయ సలహాలతో మీ నిర్ణయాలను బలోపేతం చేసుకోండి.' 
               : lang === 'Bengali' ? 'অনুমান করা বন্ধ করুন। সরাসরি, বাস্তবমুখী এবং বৈজ্ঞানিক পরামর্শের মাধ্যমে আপনার কৃষি সিদ্ধান্তগুলো পরিচালনা করুন।' 
               : 'Say goodbye to guesswork. Empower your farming decisions with direct, actionable scientific advisories.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all space-y-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">{t('aiCropDoctor', lang)}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('aiCropDoctorDesc', lang)}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all space-y-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
                <CloudSun className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">{t('hyperLocalWeather', lang)}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('hyperLocalWeatherDesc', lang)}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all space-y-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">{t('voiceAssist', lang)}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('voiceAssistDesc', lang)}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-all space-y-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">{t('mandiPrices', lang)}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('mandiPricesDesc', lang)}
              </p>
            </div>

          </div>

        </div>
      </section>



      {/* Footer / Final CTA */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="p-3 bg-emerald-500 text-white rounded-2xl w-fit mx-auto shadow-lg shadow-emerald-500/20">
            <Activity className="h-8 w-8 animate-pulse" />
          </div>
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
              {lang === 'Hindi' ? 'आज ही अपनी फसल को सुरक्षित करें' : lang === 'Punjabi' ? 'ਅੱਜ ਹੀ ਆਪਣੀ ਫਸਲ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ' : lang === 'Marathi' ? 'आजच पिकांचे नुकसान वाचवा' : lang === 'Telugu' ? 'ఈరోజే మీ పంటలను కాపాడుకోండి' : lang === 'Bengali' ? 'আজই আপনার ফসল সুরক্ষিত করুন' : 'Protect Your Harvest Today'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {lang === 'Hindi' ? 'भारतीय किसानों के कठिन परिश्रम को समृद्ध करने के लिए विशेष रूप से बनाई गई कृषि तकनीक का अनुभव करें। स्कैन करें, पूछें और समृद्ध बनें।' 
               : lang === 'Punjabi' ? 'ਕਿਸਾਨਾਂ ਦੇ ਕਠਿਨ ਪਰਿਸ਼ਰਮ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ ਤੇ ਬਣਾਈ ਗਈ ਤਕਨੀਕ ਦਾ ਅਨੁਭਵ ਕਰੋ।' 
               : lang === 'Marathi' ? 'शेतकऱ्यांच्या कष्टाची जाणीव ठेवून खास तयार केलेल्या कृषी तंत्रज्ञानाचा अनुभव घ्या। स्कॅन करा, विचारा आणि प्रगती करा।' 
               : lang === 'Telugu' ? 'రైతుల కష్టార్జితాన్ని సఫలం చేయడానికి ప్రత్యేకంగా రూపొందించబడిన వ్యవసాయ సాంకేతికతను అనుభవించండి. పరీక్షించండి, అడగండి.' 
               : lang === 'Bengali' ? 'কৃষকদের অক্লান্ত পরিশ্রমকে সফল করতে বিশেষভাবে তৈরি এই আধুনিক কৃষি প্রযুক্তির অভিজ্ঞতা নিন। পাতা পরীক্ষা করুন, পরামর্শ নিন ও সফল হোন।' 
               : 'Experience the agricultural technology designed from scratch for the hardworking hands of Indian farmers. Scan, ask, and thrive.'}
            </p>
          </div>

          <button 
            onClick={onStart}
            className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-base py-4 px-10 rounded-2xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>
              {lang === 'Hindi' ? 'मुफ्त में शुरुआत करें' : lang === 'Punjabi' ? 'ਮੁਫਤ ਵਿੱਚ ਸ਼ੁਰੂ ਕਰੋ' : lang === 'Marathi' ? 'मोफत नोंदणी करा' : lang === 'Telugu' ? 'ఉచితంగా ప్రారంభించండి' : lang === 'Bengali' ? 'বিনামূল্যে শুরু করুন' : 'Get Started For Free'}
            </span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-500 gap-4">
            <span>&copy; {new Date().getFullYear()} Fasal Doctor Inc. All Rights Reserved.</span>
            <div className="flex space-x-6">
              <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition-colors">
                {lang === 'Hindi' ? 'हमारे बारे में' : lang === 'Punjabi' ? 'ਸਾਡੇ ਬਾਰੇ' : lang === 'Marathi' ? 'आमच्याबद्दल' : lang === 'Telugu' ? 'మా గురించి' : lang === 'Bengali' ? 'আমাদের সম্পর্কে' : 'About Story'}
              </button>
              <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
