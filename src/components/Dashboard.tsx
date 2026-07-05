import React, { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Sun, AlertTriangle, CheckCircle, ArrowRight, User, TrendingUp, Sparkles, Sprout, Calendar, ArrowUpRight, Languages, Check, ChevronDown, WifiOff, Camera } from 'lucide-react';
import { User as UserType, Crop, Screen, Language } from '../types';
import { t } from '../localization';
import DiagnosisScreen from './DiagnosisScreen';

interface DashboardProps {
  user: UserType;
  onNavigate: (screen: Screen) => void;
  onUpdateLanguage: (lang: Language) => void;
  isOnline: boolean;
  initialTab?: 'overview' | 'diagnosis';
}

const LANGUAGES: { code: Language; name: string; native: string }[] = [
  { code: 'English', name: 'English', native: 'English' },
  { code: 'Hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'Punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'Marathi', name: 'Marathi', native: 'मराठी' },
  { code: 'Telugu', name: 'Telugu', native: 'తెలుగు' },
  { code: 'Bengali', name: 'Bengali', native: 'বাংলা' },
  { code: 'Tamil', name: 'Tamil', native: 'தமிழ்' },
  { code: 'Kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'Malayalam', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'Gujarati', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'Odia', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'Assamese', name: 'Assamese', native: 'অসমীয়া' },
];

export default function Dashboard({ user, onNavigate, onUpdateLanguage, isOnline, initialTab = 'overview' }: DashboardProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'diagnosis'>(initialTab);
  const lang = user.language;

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Extract farm address or use default
  const farmLocation = user.location?.address || "Karnal farming zone, Haryana";
  const primaryCrop = user.crops[0] || "Rice";

  // Localize crop names
  const localizedCropName = {
    Rice: lang === 'Hindi' ? 'धान (चावल)' : lang === 'Punjabi' ? 'ਝੋਨਾ (ਚੌਲ)' : lang === 'Marathi' ? 'भात (तांदूळ)' : lang === 'Telugu' ? 'వరి (బియ్యం)' : lang === 'Bengali' ? 'ধান (চাল)' : 'Rice',
    Wheat: lang === 'Hindi' ? 'गेहूं' : lang === 'Punjabi' ? 'ਕਣਕ' : lang === 'Marathi' ? 'गहू' : lang === 'Telugu' ? 'గోధుమ' : lang === 'Bengali' ? 'গম' : 'Wheat',
    Cotton: lang === 'Hindi' ? 'कपास' : lang === 'Punjabi' ? 'ਕਪਾਹ' : lang === 'Marathi' ? 'कापूस' : lang === 'Telugu' ? 'పత్తి' : lang === 'Bengali' ? 'তুলা' : 'Cotton',
    Mustard: lang === 'Hindi' ? 'सरसों' : lang === 'Punjabi' ? 'ਸਰ੍ਹੋਂ' : lang === 'Marathi' ? 'मोहरी' : lang === 'Telugu' ? 'ఆవాలు' : lang === 'Bengali' ? 'সরিষা' : 'Mustard',
    Sugarcane: lang === 'Hindi' ? 'गन्ना' : lang === 'Punjabi' ? 'ਗੰਨਾ' : lang === 'Marathi' ? 'ऊस' : lang === 'Telugu' ? 'చెరకు' : lang === 'Bengali' ? 'আখ' : 'Sugarcane',
    Tomatoes: lang === 'Hindi' ? 'टमाटर' : lang === 'Punjabi' ? 'ਟਮਾਟਰ' : lang === 'Marathi' ? 'टोमॅटो' : lang === 'Telugu' ? 'టమోటాలు' : lang === 'Bengali' ? 'টমেটো' : 'Tomatoes',
  }[primaryCrop] || primaryCrop;

  // Customize mock alerts based on first crop and language
  const cropHealthData = {
    Rice: { 
      status: `92% ${t('healthy', lang)}`, 
      yield: lang === 'English' ? '4.2 Tons/Acre' : `4.2 ${lang === 'Hindi' ? 'टन/एकड़' : lang === 'Punjabi' ? 'ਟਨ/ਏਕੜ' : lang === 'Marathi' ? 'टन/एकर' : lang === 'Telugu' ? 'టన్నులు/ఎకరా' : 'টন/একর'}`, 
      value: '₹1,02,900', 
      risk: `15% ${t('lowRisk', lang)}` 
    },
    Wheat: { 
      status: `95% ${t('healthy', lang)}`, 
      yield: lang === 'English' ? '2.5 Tons/Acre' : `2.5 ${lang === 'Hindi' ? 'टन/एकड़' : lang === 'Punjabi' ? 'ਟਨ/ਏਕੜ' : lang === 'Marathi' ? 'टन/एकर' : lang === 'Telugu' ? 'టన్నులు/ఎకరా' : 'টন/একর'}`, 
      value: '₹61,250', 
      risk: `5% ${t('lowRisk', lang)}` 
    },
    Cotton: { 
      status: `88% ${t('healthy', lang)}`, 
      yield: lang === 'English' ? '1.1 Tons/Acre' : `1.1 ${lang === 'Hindi' ? 'टन/एकड़' : lang === 'Punjabi' ? 'ਟਨ/ਏਕੜ' : lang === 'Marathi' ? 'टन/एकर' : lang === 'Telugu' ? 'టన్నులు/ఎకరా' : 'টন/একর'}`, 
      value: '₹78,000', 
      risk: `40% ${t('mediumRisk', lang)}` 
    },
    Mustard: { 
      status: `94% ${t('healthy', lang)}`, 
      yield: lang === 'English' ? '0.9 Tons/Acre' : `0.9 ${lang === 'Hindi' ? 'टन/एकड़' : lang === 'Punjabi' ? 'ਟਨ/ਏਕੜ' : lang === 'Marathi' ? 'टन/एकर' : lang === 'Telugu' ? 'టన్నులు/ఎకరా' : 'টন/একর'}`, 
      value: '₹49,500', 
      risk: `10% ${t('lowRisk', lang)}` 
    },
    Sugarcane: { 
      status: `96% ${t('healthy', lang)}`, 
      yield: lang === 'English' ? '32 Tons/Acre' : `32 ${lang === 'Hindi' ? 'टन/एकड़' : lang === 'Punjabi' ? 'ਟਨ/ਏਕੜ' : lang === 'Marathi' ? 'टन/एकर' : lang === 'Telugu' ? 'టన్నులు/ఎకరా' : 'টন/একর'}`, 
      value: '₹1,12,000', 
      risk: `8% ${t('lowRisk', lang)}` 
    },
    Tomatoes: { 
      status: `81% ${t('yellowLeafWarn', lang)}`, 
      yield: lang === 'English' ? '15 Tons/Acre' : `15 ${lang === 'Hindi' ? 'टन/एकड़' : lang === 'Punjabi' ? 'ਟਨ/ਏਕੜ' : lang === 'Marathi' ? 'टन/एकर' : lang === 'Telugu' ? 'టన్నులు/ఎకరా' : 'টন/একর'}`, 
      value: '₹95,000', 
      risk: `65% ${t('highRisk', lang)}` 
    },
  }[primaryCrop] || { status: t('healthy', lang), yield: 'N/A', value: 'N/A', risk: t('lowRisk', lang) };

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-sans max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Greetings Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-3xl border border-slate-100 gap-4">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {t('namaste', lang)}, <span className="text-emerald-600">{user.name || "Ramesh"}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('farmOverviewFor', lang)} <span className="text-slate-700 font-bold">{farmLocation}</span>
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            id="dashboard-lang-selector"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 transition-all p-2 rounded-2xl border border-slate-100 cursor-pointer text-left focus:outline-none select-none active:scale-98"
          >
            <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-800">
              <Languages className="h-5 w-5" />
            </div>
            <div className="pr-3 flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-900">{user.phone || "+91 99999 88888"}</p>
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">
                  {LANGUAGES.find(l => l.code === user.language)?.native || user.language} {t('languageSuffix', lang)}
                </span>
                <ChevronDown className={`h-3 w-3 text-emerald-600 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </button>

          {langDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-45" 
                onClick={() => setLangDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                <div className="px-3 py-1.5 border-b border-slate-50 mb-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                    {t('chooseLanguage', lang)}
                  </span>
                </div>
                {LANGUAGES.map((langItem) => {
                  const isSelected = user.language === langItem.code;
                  return (
                    <button
                      key={langItem.code}
                      type="button"
                      onClick={() => {
                        onUpdateLanguage(langItem.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-950 font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-800">{langItem.native}</span>
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
      </div>

      {/* Sub-tab switcher */}
      <div className="flex p-1.5 bg-slate-100 rounded-2xl max-w-md mx-auto sm:mx-0 border border-slate-200/40 shadow-sm animate-fade-in">
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            onNavigate('dashboard');
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-emerald-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sprout className="h-4.5 w-4.5 stroke-[2.2px]" />
          <span>
            {lang === 'Hindi' ? 'खेत अवलोकन' : lang === 'Punjabi' ? 'ਖੇਤ ਦਾ ਵੇਰਵਾ' : lang === 'Marathi' ? 'शेत आढावा' : lang === 'Telugu' ? 'వ్యవసాయ అవలోకనం' : lang === 'Bengali' ? 'খামার বিবরণ' : 'Farm Overview'}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('diagnosis');
            onNavigate('diagnosis');
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'diagnosis'
              ? 'bg-white text-emerald-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="h-4.5 w-4.5 stroke-[2.2px]" />
          <span>{t('diagnosis', lang)}</span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {!isOnline && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-3xl text-xs sm:text-sm font-semibold animate-fade-in flex items-start space-x-3 shadow-sm">
              <WifiOff className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <p className="font-extrabold text-slate-900">{t('offlineModeActive', lang)}</p>
                <p className="text-slate-600 text-xs font-medium">{t('offlineModeDesc', lang)}</p>
              </div>
            </div>
          )}

          {/* Primary Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: WEATHER, SPRAY STATE, HEALTH OVERVIEW */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Weather and Spray Advisory Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-800">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              
              {/* Climate numbers */}
              <div className="space-y-4">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {t('liveFarmClimate', lang)}
                </span>
                
                <div className="flex items-center space-x-4">
                  <CloudSun className="h-14 w-14 text-emerald-400" />
                  <div>
                    <span className="text-4xl sm:text-5xl font-display font-extrabold">32°C</span>
                    <span className="text-slate-400 text-sm block font-medium">{t('overcastClouds', lang)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-center">
                  <div>
                    <Droplets className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <span className="block text-xs font-bold">64%</span>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">{t('humidity', lang)}</span>
                  </div>
                  <div>
                    <Wind className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <span className="block text-xs font-bold">8 km/h</span>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">{t('wind', lang)}</span>
                  </div>
                  <div>
                    <Sun className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <span className="block text-xs font-bold">Low (1)</span>
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">{t('uvIndex', lang)}</span>
                  </div>
                </div>
              </div>

              {/* Spray Suitability Metric */}
              <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">{t('spraySuitability', lang)}</h3>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {t('highIdeal', lang)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('sprayAdvisoryText', lang)}
                </p>

                <div className="flex justify-between items-center pt-2 text-xs border-t border-slate-800 text-slate-400 font-medium">
                  <span>{t('targetHours', lang)}:</span>
                  <span className="text-emerald-400 font-bold">06:00 AM - 10:30 AM</span>
                </div>
              </div>

            </div>
          </div>

          {/* Current Crops Health Status Box */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display font-extrabold text-lg text-slate-900 flex items-center space-x-2">
                <Sprout className="h-5 w-5 text-emerald-600" />
                <span>{t('cropHealthStatus', lang)}</span>
              </h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">
                {t('activeCropTrack', lang)}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              
              {/* Metric 1 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60">
                <span className="text-slate-400 font-bold text-[10px] uppercase block tracking-wider">{t('cultivatedCrop', lang)}</span>
                <span className="font-display font-extrabold text-base text-slate-900 block mt-1">
                  {localizedCropName}
                </span>
                <span className="text-emerald-600 text-xs font-bold flex items-center space-x-1 mt-1.5">
                  <CheckCircle className="h-3 w-3 inline" />
                  <span>{cropHealthData.status}</span>
                </span>
              </div>

              {/* Metric 2 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60">
                <span className="text-slate-400 font-bold text-[10px] uppercase block tracking-wider">{t('yieldPrediction', lang)}</span>
                <span className="font-display font-extrabold text-base text-slate-900 block mt-1">
                  {cropHealthData.yield}
                </span>
                <span className="text-slate-500 text-xs font-semibold block mt-1.5">
                  {lang === 'Hindi' ? 'औसत अनाज वजन प्रीमियम' : lang === 'Punjabi' ? 'ਔਸਤ ਅਨਾਜ ਵਜ਼ਨ ਪ੍ਰੀਮੀਅਮ' : lang === 'Marathi' ? 'सरासरी धान्य वजन प्रीमियम' : lang === 'Telugu' ? 'సగటు ధాన్యపు బరువు ప్రీమియం' : lang === 'Bengali' ? 'গড় দানা ওজন প্রিমিয়াম' : 'Avg. grain weight premium'}
                </span>
              </div>

              {/* Metric 3 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60">
                <span className="text-slate-400 font-bold text-[10px] uppercase block tracking-wider">{t('estimatedMarketValue', lang)}</span>
                <span className="font-display font-extrabold text-base text-emerald-700 block mt-1">
                  {cropHealthData.value}
                </span>
                <span className="text-emerald-600 text-xs font-semibold block mt-1.5 cursor-pointer hover:underline flex items-center space-x-1" onClick={() => onNavigate('market')}>
                  <span>{t('checkMandiRates', lang)}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>

            </div>
          </div>

          {/* AI Smart Actions / Advisory Panel */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Irrigation Smart action */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">{t('optimalIrrigation', lang)}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('irrigationAdvisoryText', lang)}
              </p>
              <button onClick={() => onNavigate('insights')} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 cursor-pointer">
                <span>{t('viewMoistureChart', lang)}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Nitrogen advisor */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">{t('nitrogenUreaLevel', lang)}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('nitrogenAdvisoryText', lang)}
              </p>
              <button onClick={() => onNavigate('assistant')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 cursor-pointer">
                <span>{t('askCropAssistant', lang)}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: RECENT SCANS, PEST ALERTS, SMART REMINDERS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Pest Alert Area */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>{t('outbreakPestForecast', lang)}</span>
            </h3>
            
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-start space-x-3 text-xs">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-800 shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-amber-900">{t('regionalStemBorerWarning', lang)}</span>
                <p className="text-slate-600 leading-tight">
                  {t('stemBorerAdvisoryText', lang)} <span className="font-bold text-amber-800">{cropHealthData.risk}</span>.
                </p>
                <button onClick={() => onNavigate('diagnosis')} className="text-[10px] font-bold text-amber-800 underline block pt-1 cursor-pointer">
                  {t('initiateAiLeafScan', lang)}
                </button>
              </div>
            </div>
          </div>

          {/* Smart Reminders Action Panel */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <Calendar className="h-4.5 w-4.5 text-emerald-600" />
              <span>{t('smartFarmTodos', lang)}</span>
            </h3>

            <div className="space-y-3">
              
              <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/60 flex items-center justify-between transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-950">{t('scanWestLeafZone', lang)}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">{t('pendingScan', lang)}</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('diagnosis')} className="text-[10px] font-bold bg-emerald-600 text-white py-1 px-2.5 rounded-lg shadow-sm cursor-pointer">
                  {t('scanButton', lang)}
                </button>
              </div>

              <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/60 flex items-center justify-between transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-950">{t('addUreaTopdress', lang)}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">{t('sowingWeek4', lang)}</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg">{t('week4Label', lang)}</span>
              </div>

              <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-100/60 flex items-center justify-between transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  <div>
                    <p className="text-xs font-bold text-slate-950">{t('checkMandiRates', lang)}</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">{t('dailyUpdate', lang)}</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('market')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          </div>

          {/* "What to Plant Next?" Advisory Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
              <span>{t('whatToPlantNext', lang)}</span>
            </h3>

            <div className="rounded-2xl overflow-hidden border border-slate-100">
              <div className="h-24 w-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=300" 
                  alt="Durum Wheat"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                <span className="absolute bottom-2 left-2 text-white text-xs font-bold">{t('durumWheat', lang)}</span>
              </div>
              <div className="p-3.5 space-y-2 bg-slate-50">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>{t('optimalSowing', lang)}</span>
                  <span className="text-slate-800 font-bold">{t('novemberRabi', lang)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>{t('estimatedDemand', lang)}</span>
                  <span className="text-emerald-600 font-extrabold">{t('veryHigh', lang)}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed pt-1 border-t border-slate-200">
                  {t('durumWheatAdvisoryText', lang)}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
      </>
      ) : (
        <div className="animate-fade-in mt-4">
          <DiagnosisScreen language={user.language} crops={user.crops} isOnline={isOnline} />
        </div>
      )}
    </div>
  );
}
