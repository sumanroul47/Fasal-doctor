import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, CloudSun, Sun, Wind, Droplets, Thermometer, ShieldCheck, ChevronRight, BellRing, Sparkles, WifiOff, RefreshCw, Check, Bell, BellOff, Info, Volume2, VolumeX, AlertTriangle, Play, Settings } from 'lucide-react';
import { User, Screen, Language } from '../types';
import { t } from '../localization';

interface WeatherInsightsProps {
  user: User;
  onNavigate: (screen: Screen) => void;
  isOnline: boolean;
}

const getLocalizedDay = (day: string, lang: Language): string => {
  const map: Record<string, Partial<Record<Language, string>>> = {
    'Today': { English: 'Today', Hindi: 'आज', Punjabi: 'ਅੱਜ', Marathi: 'आज', Telugu: 'ఈరోజు', Bengali: 'আজ' },
    'Tomorrow': { English: 'Tomorrow', Hindi: 'कल', Punjabi: 'ਭਲਕੇ', Marathi: 'उद्या', Telugu: 'రేపు', Bengali: 'আগামীকাল' },
    'Wednesday': { English: 'Wednesday', Hindi: 'बुधवार', Punjabi: 'ਬੁੱਧਵਾਰ', Marathi: 'बुधवार', Telugu: 'బుధవారం', Bengali: 'বুধবার' },
    'Thursday': { English: 'Thursday', Hindi: 'गुरुवार', Punjabi: 'ਵੀਰਵਾਰ', Marathi: 'गुरुवार', Telugu: 'గురువారం', Bengali: 'বৃহস্পতিবার' },
    'Friday': { English: 'Friday', Hindi: 'शुक्रवार', Punjabi: 'ਸ਼ੁੱਕਰਵਾਰ', Marathi: 'शुक्रवार', Telugu: 'శుక్రవారం', Bengali: 'শুক্রবার' },
    'Saturday': { English: 'Saturday', Hindi: 'शनिवार', Punjabi: 'ਸ਼ਨੀਵਾਰ', Marathi: 'शनिवार', Telugu: 'శనివారం', Bengali: 'শনিবার' },
    'Sunday': { English: 'Sunday', Hindi: 'रविवार', Punjabi: 'ਐਤਵਾਰ', Marathi: 'रविवार', Telugu: 'ఆదివారం', Bengali: 'রবিবার' },
  };
  return map[day]?.[lang] || day;
};

const getLocalizedLabel = (label: string, lang: Language): string => {
  const map: Record<string, Partial<Record<Language, string>>> = {
    'Cloudy Intervals': { English: 'Cloudy Intervals', Hindi: 'बादल छाए रहेंगे', Punjabi: 'ਬੱਦਲਵਾਈ', Marathi: 'ढगाळ हवामान', Telugu: 'పాక్షిక మేఘావృతం', Bengali: 'মেঘলা আকাশ' },
    'Sunny Day': { English: 'Sunny Day', Hindi: 'तेज धूप', Punjabi: 'ਸਾਫ਼ ਧੁੱਪ', Marathi: 'कडक ऊन', Telugu: 'ఎండగా ఉంటుంది', Bengali: 'রৌদ্রোজ্জ্বল দিন' },
    'Partly Sunny': { English: 'Partly Sunny', Hindi: 'हल्की धूप', Punjabi: 'ਆਮ ਧੁੱਪ', Marathi: 'अंशतः ऊन', Telugu: 'పాక్షిక ఎండ', Bengali: 'আংশিক রৌদ্রোজ্জ্বল' },
    'Overcast Skies': { English: 'Overcast Skies', Hindi: 'घने बादल', Punjabi: 'ਘਣੇ ਬੱਦਲ', Marathi: 'पूर्ण ढगाळ', Telugu: 'మబ్బులతో కూడిన గాలి', Bengali: 'মেঘাচ্ছন্ন আকাশ' },
    'Heavy Showers': { English: 'Heavy Showers', Hindi: 'भारी बारिश', Punjabi: 'ਭਾਰੀ ਮੀਂਹ', Marathi: 'मुसळधार पाऊस', Telugu: 'భారీ వర్షం', Bengali: 'ভারী বৃষ্টিপাত' },
    'Scattered Rain': { English: 'Scattered Rain', Hindi: 'रुक-रुक कर बारिश', Punjabi: 'ਛਿੱਟੇ ਪੈਣਗੇ', Marathi: 'रिमझिम पाऊस', Telugu: 'చిరుజల్లులు', Bengali: 'ছিটেফোঁটা বৃষ্টি' },
    'Clear & Calm': { English: 'Clear & Calm', Hindi: 'साफ और शांत', Punjabi: 'ਸਾਫ਼ ਤੇ ਸ਼ਾਂਤ', Marathi: 'हवामान स्वच्छ', Telugu: 'ప్రశాంతమైన వాతావరణం', Bengali: 'পরিষ্কার ও শান্ত' },
  };
  return map[label]?.[lang] || label;
};

const FORECAST_DAYS = [
  { day: 'Today', temp: '32°C', icon: CloudSun, label: 'Cloudy Intervals', rainProb: '10%', wind: '8 km/h' },
  { day: 'Tomorrow', temp: '33°C', icon: Sun, label: 'Sunny Day', rainProb: '5%', wind: '9 km/h' },
  { day: 'Wednesday', temp: '31°C', icon: CloudSun, label: 'Partly Sunny', rainProb: '15%', wind: '12 km/h' },
  { day: 'Thursday', temp: '30°C', icon: CloudSun, label: 'Overcast Skies', rainProb: '40%', wind: '10 km/h' },
  { day: 'Friday', temp: '28°C', icon: CloudRain, label: 'Heavy Showers', rainProb: '85%', wind: '18 km/h' },
  { day: 'Saturday', temp: '29°C', icon: CloudRain, label: 'Scattered Rain', rainProb: '70%', wind: '14 km/h' },
  { day: 'Sunday', temp: '31°C', icon: Sun, label: 'Clear & Calm', rainProb: '10%', wind: '6 km/h' }
];

export default function WeatherInsights({ user, onNavigate, isOnline }: WeatherInsightsProps) {
  const [dismissAlert, setDismissAlert] = useState(false);
  const primaryCrop = user.crops[0] || 'Wheat';
  const lang = user.language;

  const [lastSync, setLastSync] = useState(() => localStorage.getItem('fasal_last_sync') || new Date().toLocaleString());
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Stateful Soil Telemetry loaded from cache or default
  const [soilMoisture, setSoilMoisture] = useState(() => localStorage.getItem('fasal_soil_moisture') || '32.4%');
  const [soilTemp, setSoilTemp] = useState(() => localStorage.getItem('fasal_soil_temp') || '21.8°C');

  // Notification states
  const [notificationState, setNotificationState] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [activeInAppAlert, setActiveInAppAlert] = useState<{ title: string; body: string; type: 'rain' | 'wind' | 'pest' } | null>(null);
  const [showIframeHelp, setShowIframeHelp] = useState(false);
  const [autoAlertEnabled, setAutoAlertEnabled] = useState(() => localStorage.getItem('fasal_auto_alerts') !== 'false');
  const [isSpeakingAlert, setIsSpeakingAlert] = useState(false);
  const alertUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      setNotificationState('unsupported');
    } else {
      setNotificationState(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      setNotificationState('unsupported');
      return;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setNotificationState(permission);
      if (permission === 'denied') {
        setShowIframeHelp(true);
      } else if (permission === 'granted') {
        setShowIframeHelp(false);
        playNotificationSound();
        triggerNativeNotification(
          lang === 'Hindi' ? '🔔 सूचनाएं सक्रिय!' : '🔔 Notifications Enabled!',
          lang === 'Hindi' 
            ? 'आपको फसल रक्षक मौसम चेतावनियाँ समय पर मिलेंगी।' 
            : 'You will receive timely severe weather warnings and crop alerts.'
        );
      }
    } catch (err) {
      console.warn("Notification request permission failed:", err);
      setShowIframeHelp(true);
    }
  };

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio Context sound synthesis skipped:", e);
    }
  };

  const triggerNativeNotification = (title: string, body: string) => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === 'granted') {
      try {
        const n = new Notification(title, {
          body: body,
          icon: "/favicon.ico",
          tag: "fasal_doctor_weather",
          renotify: true
        } as any);
        return true;
      } catch (e) {
        console.warn("Native Notification trigger failed (likely iframe restriction):", e);
        return false;
      }
    }
    return false;
  };

  const toggleAutoAlerts = () => {
    const newVal = !autoAlertEnabled;
    setAutoAlertEnabled(newVal);
    localStorage.setItem('fasal_auto_alerts', String(newVal));
  };

  const speakAlertText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingAlert) {
        window.speechSynthesis.cancel();
        setIsSpeakingAlert(false);
        alertUtteranceRef.current = null;
        return;
      }

      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const LANGUAGE_CODES: Record<Language, string> = {
        English: 'en-US',
        Hindi: 'hi-IN',
        Punjabi: 'pa-IN',
        Marathi: 'mr-IN',
        Telugu: 'te-IN',
        Bengali: 'bn-IN',
        Tamil: 'ta-IN',
        Kannada: 'kn-IN',
        Malayalam: 'ml-IN',
        Gujarati: 'gu-IN',
        Odia: 'or-IN',
        Assamese: 'as-IN',
      };
      utterance.lang = LANGUAGE_CODES[lang] || 'en-US';
      alertUtteranceRef.current = utterance;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.startsWith(LANGUAGE_CODES[lang]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => setIsSpeakingAlert(true);
      utterance.onend = () => {
        setIsSpeakingAlert(false);
        alertUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsSpeakingAlert(false);
        alertUtteranceRef.current = null;
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop reading alerts on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const triggerAlert = (type: 'rain' | 'wind' | 'pest') => {
    playNotificationSound();
    const farmLocation = user.location?.address || (lang === 'Hindi' ? 'करनाल कृषि क्षेत्र, हरियाणा' : 'Karnal farming zone, Haryana');
    
    let title = '';
    let body = '';
    
    if (type === 'rain') {
      switch (lang) {
        case 'Hindi':
          title = `⚠️ गंभीर मौसम चेतावनी: ${farmLocation}`;
          body = `शुक्रवार दोपहर को भारी बारिश (85% संभावना) होने की उम्मीद है। यूरिया या रासायनिक कीटनाशकों का छिड़काव रोक दें।`;
          break;
        case 'Punjabi':
          title = `⚠️ ਗੰਭੀਰ ਮੌਸਮ ਚੇਤਾਵਨੀ: ${farmLocation}`;
          body = `ਸ਼ੁੱਕਰਵਾਰ ਦੁਪਹਿਰ ਨੂੰ ਭਾਰੀ ਮੀਂਹ (85% ਸੰਭਾਵਨਾ) ਪੈਣ ਦੀ ਉਮੀਦ ਹੈ। ਯੂਰੀਆ ਜਾਂ ਕੀਟਨਾਸ਼ਕਾਂ ਦਾ ਛਿੜਕਾਅ ਰੋਕੋ।`;
          break;
        case 'Marathi':
          title = `⚠️ गंभीर हवामान इशारा: ${farmLocation}`;
          body = `शुक्रवारी दुपारी मुसळधार पावसाची ८५% शक्यता आहे। खत किंवा कीटकनाशक फवारणी पुढे ढकला।`;
          break;
        case 'Telugu':
          title = `⚠️ తీవ్ర వాతావరణ హెచ్చరిక: ${farmLocation}`;
          body = `శుక్రవారం మధ్యాహ్నం భారీ వర్షం (85% అవకాశం) ఉంది. పురుగుమందుల పిచికారీని వాయిదా వేయండి.`;
          break;
        case 'Bengali':
          title = `⚠️ গুরুতর আবহাওয়া সতর্কতা: ${farmLocation}`;
          body = `শুক্রবার দুপুরে ভারী বৃষ্টির সম্ভাবনা (৮৫% সম্ভাবনা) রয়েছে। সার বা কীটনাশক স্প্রে করা স্থগিত রাখুন।`;
          break;
        default:
          title = `⚠️ Severe Weather Warning: ${farmLocation}`;
          body = `Heavy rain showers (85% probability) expected Friday afternoon. Postpone chemical sprays to prevent fertilizer runoff.`;
      }
    } else if (type === 'wind') {
      switch (lang) {
        case 'Hindi':
          title = `💨 तेज हवा की चेतावनी: ${farmLocation}`;
          body = `शुक्रवार को 18 किमी/घंटे की रफ्तार से चलने वाली तेज हवाएं। ऊंचे पौधों को गिरने से बचाने के लिए सहारा दें।`;
          break;
        case 'Punjabi':
          title = `💨 ਤੇਜ਼ ਹਵਾ ਦੀ ਚੇਤਾਵਨੀ: ${farmLocation}`;
          body = `ਸ਼ੁੱਕਰਵਾਰ ਨੂੰ 18 ਕਿਲੋਮੀਟਰ/ਘੰਟੇ ਦੀ ਤੇਜ਼ ਹਵਾ। ਫਸਲਾਂ ਨੂੰ ਡਿੱਗਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਸਹਾਰਾ ਦਿਓ।`;
          break;
        case 'Marathi':
          title = `💨 वादळी वाऱ्याचा इशारा: ${farmLocation}`;
          body = `शुक्रवारी १८ किमी/तास वेगाने वारे वाहण्याची शक्यता। उंच पिकांना आधार द्या किंवा फवारणी टाळा।`;
          break;
        case 'Telugu':
          title = `💨 బలమైన ఈదురు గాలుల హెచ్చరిక: ${farmLocation}`;
          body = `శుక్రవారం గంటకు 18 కిలోమీటర్ల వేగంతో ఈదురు గాలులు. పంటలు పడిపోకుండా ముందస్తు రక్షణ కల్పించండి.`;
          break;
        case 'Bengali':
          title = `💨 প্রবল ঝোড়ো হাওয়ার সতর্কতা: ${farmLocation}`;
          body = `শুক্রবার ঘণ্টায় ১৮ কিমি বেগে প্রবল হাওয়া বইতে পারে। লম্বা ফসলগুলোর খুঁটি বা বাঁশের বাঁধন শক্ত করুন।`;
          break;
        default:
          title = `💨 High Wind Advisory: ${farmLocation}`;
          body = `Strong winds up to 18 km/h expected Friday. Secure tall seedlings and avoid lightweight spraying operations.`;
      }
    } else {
      const cropText = localizedCropName;
      switch (lang) {
        case 'Hindi':
          title = `🪲 कीट प्रकोप चेतावनी: ${farmLocation}`;
          body = `अत्यधिक नमी और कोहरे के कारण आपकी ${cropText} फसल में तना गलन (Stem-Rot) रोग का खतरा बढ़ गया है।`;
          break;
        case 'Punjabi':
          title = `🪲 ਕੀੜਿਆਂ ਦੇ ਹਮਲੇ ਦੀ ਚੇਤਾਵਨੀ: ${farmLocation}`;
          body = `ਸਿੱਲ੍ਹੇ ਮੌਸਮ ਕਾਰਨ ਤੁਹਾਡੀ ${cropText} ਦੀ ਫਸਲ ਵਿੱਚ ਤਣਾ ਗਲਣ ਰੋਗ ਦਾ ਖਤਰਾ ਵੱਧ ਗਿਆ ਹੈ।`;
          break;
        case 'Marathi':
          title = `🪲 कीड प्रादुर्भाव इशारा: ${farmLocation}`;
          body = `दमट हवामानामुळे तुमच्या ${cropText} पिकावर खोडकुज रोगाचा प्रादुर्भाव वाढण्याची शक्यता आहे। सेंद्रिय फवारणी करा।`;
          break;
        case 'Telugu':
          title = `🪲 పురుగుల దాడి హెచ్చరిక: ${farmLocation}`;
          body = `వాతావరణంలో తేమ కారణంగా మీ ${cropText} పంటకు కాండం కుళ్ళు తెగులు సోకే ప్రమాదం పొంచి ఉంది.`;
          break;
        case 'Bengali':
          title = `🪲 কীড়পঙ্গ আক্রমণের সতর্কতা: ${farmLocation}`;
          body = `স্যাঁতসেঁতে আবহাওয়ার কারণে আপনার ${cropText} ফসলে গোড়া পচা রোগের ঝুঁকি প্রবল। এখনই জৈব ছত্রাকনাশক স্প্রে করুন।`;
          break;
        default:
          title = `🪲 Pest Susceptibility Alert: ${farmLocation}`;
          body = `High humidity and dense morning fog have elevated stem-rot risks for your ${cropText} crop. Take preventive action.`;
      }
    }

    triggerNativeNotification(title, body);
    setActiveInAppAlert({ title, body, type });
  };

  const handleSyncWeather = () => {
    if (!isOnline) return;
    setSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const freshTime = now.toLocaleString();
      const randomMoisture = (31 + Math.random() * 3).toFixed(1) + '%';
      const randomTemp = (20 + Math.random() * 3).toFixed(1) + '°C';
      
      localStorage.setItem('fasal_last_sync', freshTime);
      localStorage.setItem('fasal_soil_moisture', randomMoisture);
      localStorage.setItem('fasal_soil_temp', randomTemp);
      
      setLastSync(freshTime);
      setSoilMoisture(randomMoisture);
      setSoilTemp(randomTemp);
      setSyncing(false);
      setSyncSuccess(true);

      // Auto-trigger severe weather notification on sync if enabled/granted
      if (autoAlertEnabled) {
        const types: Array<'rain' | 'wind' | 'pest'> = ['rain', 'wind', 'pest'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        setTimeout(() => {
          triggerAlert(randomType);
        }, 1000);
      }

      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  const localizedCropName = {
    Rice: lang === 'Hindi' ? 'धान (चावल)' : lang === 'Punjabi' ? 'ਝੋਨਾ (ਚੌਲ)' : lang === 'Marathi' ? 'भात (तांदूळ)' : lang === 'Telugu' ? 'వరి (బియ్యం)' : lang === 'Bengali' ? 'ধান (চাল)' : 'Rice',
    Wheat: lang === 'Hindi' ? 'गेहूं' : lang === 'Punjabi' ? 'ਕਣਕ' : lang === 'Marathi' ? 'गहू' : lang === 'Telugu' ? 'గోధుమ' : lang === 'Bengali' ? 'গম' : 'Wheat',
    Cotton: lang === 'Hindi' ? 'कपास' : lang === 'Punjabi' ? 'ਕਪਾਹ' : lang === 'Marathi' ? 'कापूस' : lang === 'Telugu' ? 'పత్తి' : lang === 'Bengali' ? 'তুলা' : 'Cotton',
    Mustard: lang === 'Hindi' ? 'सरसों' : lang === 'Punjabi' ? 'ਸਰ੍ਹੋਂ' : lang === 'Marathi' ? 'मोहरी' : lang === 'Telugu' ? 'ఆవాలు' : lang === 'Bengali' ? 'সরিষা' : 'Mustard',
    Sugarcane: lang === 'Hindi' ? 'गन्ना' : lang === 'Punjabi' ? 'ਗੰਨਾ' : lang === 'Marathi' ? 'ऊस' : lang === 'Telugu' ? 'చెరకు' : lang === 'Bengali' ? 'আখ' : 'Sugarcane',
    Tomatoes: lang === 'Hindi' ? 'टमाटर' : lang === 'Punjabi' ? 'ਟਮਾਟਰ' : lang === 'Marathi' ? 'टोमॅटो' : lang === 'Telugu' ? 'టమోటాలు' : lang === 'Bengali' ? 'টমেটো' : 'Tomatoes',
  }[primaryCrop] || primaryCrop;

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-sans max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Floating In-App Severe Alert Card (Robust simulated push alerts) */}
      {activeInAppAlert && (
        <div className="fixed top-4 right-4 max-w-md w-full bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-800 z-50 animate-fade-in flex items-start gap-4 ring-2 ring-emerald-500/20">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-2xl shrink-0 mt-0.5 animate-bounce">
            <BellRing className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] bg-red-600 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                {lang === 'Hindi' ? 'ताज़ा चेतावनी' : lang === 'Punjabi' ? 'ਤਾਜ਼ਾ ਚੇਤਾਵਨੀ' : lang === 'Marathi' ? 'नवीन इशारा' : lang === 'Telugu' ? 'తాజా హెచ్చరిక' : lang === 'Bengali' ? 'নতুন সতর্কতা' : 'SEVERE WARNING'}
              </span>
              <button 
                onClick={() => {
                  setActiveInAppAlert(null);
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeakingAlert(false);
                }} 
                className="text-xs text-slate-400 hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <h4 className="font-display font-extrabold text-sm sm:text-base leading-tight text-white">
              {activeInAppAlert.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {activeInAppAlert.body}
            </p>
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60 mt-1">
              <button
                type="button"
                onClick={() => speakAlertText(`${activeInAppAlert.title}. ${activeInAppAlert.body}`)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSpeakingAlert 
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                }`}
              >
                {isSpeakingAlert ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    <span>{lang === 'Hindi' ? 'आवाज़ बंद करें' : lang === 'Punjabi' ? 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ' : lang === 'Marathi' ? 'आवाज बंद करा' : lang === 'Telugu' ? 'ఆపండి' : lang === 'Bengali' ? 'থামান' : 'Stop Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                    <span>{lang === 'Hindi' ? 'आवाज़ में सुनें' : lang === 'Punjabi' ? 'ਆਵਾਜ਼ ਵਿੱਚ ਸੁਣੋ' : lang === 'Marathi' ? 'आवाज ऐका' : lang === 'Telugu' ? 'వినండి' : lang === 'Bengali' ? 'শুনুন' : 'Listen advisory'}</span>
                  </>
                )}
              </button>
              <span className="text-[9px] text-slate-500 font-mono font-bold uppercase">{lang === 'Hindi' ? 'अभी प्राप्त हुआ' : 'RECEIVED JUST NOW'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Smart Rain Advisory Banner */}
      {!dismissAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start space-x-4 animate-fade-in">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0 mt-0.5">
            <BellRing className="h-6 w-6 animate-swing" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-sm sm:text-base text-amber-950">
                {lang === 'Hindi' ? 'रसायन छिड़काव रोकने की चेतावनी' : lang === 'Punjabi' ? 'ਛਿੜਕਾਅ ਰੋਕਣ ਦੀ ਚੇਤਾਵਨੀ' : lang === 'Marathi' ? 'फवारणी पुढे ढकलण्याची चेतावणी' : lang === 'Telugu' ? 'రసాయన పిచికారీ వాయిదా హెచ్చరిక' : lang === 'Bengali' ? 'রাসায়নিক স্প্রে স্থগিত করার সতর্কতা' : 'Postpone Chemical Spraying Warning'}
              </span>
              <button 
                onClick={() => setDismissAlert(true)} 
                className="text-xs font-bold text-amber-800/60 hover:text-amber-800 px-2 py-0.5"
              >
                {lang === 'Hindi' ? 'हटाएं' : lang === 'Punjabi' ? 'ਹਟਾਓ' : lang === 'Marathi' ? 'बंद करा' : lang === 'Telugu' ? 'తీసివేయి' : lang === 'Bengali' ? 'বাতিল' : 'Dismiss'}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {lang === 'Hindi' 
                ? 'हमारे पूर्वानुमान मॉडल के अनुसार शुक्रवार दोपहर को भारी बारिश (85% संभावना) होने की उम्मीद है। यूरिया या किसी अन्य कीटनाशक का छिड़काव शनिवार तक के लिए टाल दें ताकि वह बह न जाए।' 
                : lang === 'Punjabi'
                ? 'ਸਾਡੇ ਪੂਰਵ-ਅਨੁਮਾਨ ਅਨੁਸਾਰ ਸ਼ੁੱਕਰਵਾਰ ਦੁਪਹਿਰ ਨੂੰ ਭਾਰੀ ਮੀਂਹ (85% ਸੰਭਾਵਨਾ) ਪੈਣ ਦੀ ਉਮੀਦ ਹੈ। ਯੂਰੀਆ ਜਾਂ ਕਿਸੇ ਹੋਰ ਕੀਟਨਾਸ਼ਕ ਦਾ ਛਿੜਕਾਅ ਸ਼ਨੀਵਾਰ ਤੱਕ ਟਾਲ ਦਿਓ।'
                : lang === 'Marathi'
                ? 'शुक्रवारी दुपारी मुसळधार पावसाची ८५% शक्यता आहे। पाऊस पडून खत वाहून जाण्यापासून वाचवण्यासाठी युरिया किंवा कीटकनाशक फवारणी शनिवारपर्यंत पुढे ढकला।'
                : lang === 'Telugu'
                ? 'శుక్రవారం మధ్యాహ్నం భారీ వర్షం పడే అవకాశం (85% అవకాశం) ఉంది. ఎరువులు కొట్టుకుపోకుండా ఉండటానికి యూరియా లేదా ఇతర పురుగుమందుల పిచికారీని శనివారం వరకు వాయిదా వేయండి.'
                : lang === 'Bengali'
                ? 'শুক্রবার দুপুরে ভারী বৃষ্টির সম্ভাবনা (৮৫% সম্ভাবনা) রয়েছে। সার বা কীটনাশক ধুয়ে যাওয়া এড়াতে শনিবার পর্যন্ত স্প্রে করা স্থগিত রাখুন।'
                : 'Our regional model predicts an 85% chance of heavy precipitation on Friday afternoon. Postpone applying any chemical nitrogen sprays or liquid urea top-dressing until Saturday to avoid fertilizer washing off into soil.'}
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-600"></span>
              <span className="text-[11px] font-bold text-amber-900">
                {lang === 'Hindi' ? 'वैकल्पिक कार्य: खेतों के आसपास जल निकासी नालियों को मजबूत करें।' : lang === 'Punjabi' ? 'ਵੈਕਲਪਿਕ ਕੰਮ: ਖੇਤਾਂ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਨਿਕਾਸੀ ਨਾਲੀਆਂ ਨੂੰ ਮਜ਼ਬੂਤ ਕਰੋ।' : lang === 'Marathi' ? 'पर्यायी काम: शेताभोवती पाण्याचा निचरा होण्यासाठी बांध मजबूत करा।' : lang === 'Telugu' ? 'ప్రత్యామ్నాయ పని: పొలం చుట్టऊ ఉన్న కాలువలను శుభ్రం చేసుకోండి.' : lang === 'Bengali' ? 'বিকল্প কাজ: খামারের চারপাশের জল নিষ্কাশন পথ পরিষ্কার করুন।' : 'Alternative task: Strengthen drainage ditches around active fields.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Weather Alerts & Push Notification Center Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4 shadow-sm animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Bell className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">
                {lang === 'Hindi' ? 'गंभीर मौसम चेतावनी और सूचनाएं' : lang === 'Punjabi' ? 'ਗੰਭੀਰ ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਨੋਟੀਫਿਕੇਸ਼ਨ' : lang === 'Marathi' ? 'गंभीर हवामान इशारे आणि सूचना' : lang === 'Telugu' ? 'తీవ్ర వాతావరణ హెచ్చరికలు & నోటిఫికేషన్లు' : lang === 'Bengali' ? 'গুরুতর আবহাওয়া সতর্কতা ও বিজ্ঞপ্তি' : 'Severe Weather Alerts & Notifications'}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {lang === 'Hindi' ? 'स्थान आधारित चेतावनी प्रणाली' : lang === 'Punjabi' ? 'ਸਥਾਨ ਅਧਾਰਤ ਚੇਤਾਵਨੀ ਪ੍ਰਣਾਲੀ' : lang === 'Marathi' ? 'स्थान आधारित इशारा यंत्रणा' : lang === 'Telugu' ? 'స్థాన ఆధారిత హెచ్చరికల వ్యవస్థ' : lang === 'Bengali' ? 'অবস্থান ভিত্তিক সতর্কতা সিস্টেম' : 'Coordinate-Based Push Alerts System'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">
              {lang === 'Hindi' ? 'स्थिति:' : lang === 'Punjabi' ? 'ਸਥਿਤੀ:' : lang === 'Marathi' ? 'स्थिती:' : lang === 'Telugu' ? 'స్థితి:' : lang === 'Bengali' ? 'অবস্থা:' : 'Status:'}
            </span>
            {notificationState === 'granted' ? (
              <span className="inline-flex items-center bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="h-1.5 w-1.5 bg-emerald-600 rounded-full mr-1.5 animate-ping"></span>
                {lang === 'Hindi' ? 'सक्रिय' : lang === 'Punjabi' ? 'ਸਕ੍ਰਿਆ' : lang === 'Marathi' ? 'सक्रिय' : lang === 'Telugu' ? 'సక్రియం' : lang === 'Bengali' ? 'সক্রিয়' : 'Active'}
              </span>
            ) : notificationState === 'denied' ? (
              <span className="inline-flex items-center bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200">
                <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mr-1.5"></span>
                {lang === 'Hindi' ? 'अवरुद्ध' : lang === 'Punjabi' ? 'ਬੰਦ' : lang === 'Marathi' ? 'अवरोधित' : lang === 'Telugu' ? 'బ్లాక్' : lang === 'Bengali' ? 'ব্লক' : 'Blocked'}
              </span>
            ) : notificationState === 'unsupported' ? (
              <span className="inline-flex items-center bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                {lang === 'Hindi' ? 'असमर्थित' : lang === 'Punjabi' ? 'ਅਸਮਰਥ' : lang === 'Marathi' ? 'असमर्थित' : lang === 'Telugu' ? 'మద్దతు లేదు' : lang === 'Bengali' ? 'অসমর্থিত' : 'Fallback'}
              </span>
            ) : (
              <span className="inline-flex items-center bg-sky-50 text-sky-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-sky-100 animate-pulse">
                <span className="h-1.5 w-1.5 bg-sky-500 rounded-full mr-1.5"></span>
                {lang === 'Hindi' ? 'चालू करें' : lang === 'Punjabi' ? 'ਚਾਲੂ ਕਰੋ' : lang === 'Marathi' ? 'प्रारंभ करा' : lang === 'Telugu' ? 'కాన్ఫిగర్' : lang === 'Bengali' ? 'কনফিগার' : 'Configure'}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-5 items-start">
          
          {/* Permission Settings block */}
          <div className="md:col-span-7 space-y-3.5">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {lang === 'Hindi' 
                ? `अपने खेत (${user.location?.address || 'कनाल'}) के पास भारी बारिश, चक्रवात, ओलावृष्टि, कोहरा या कीट प्रकोप का पता चलने पर तुरंत सूचनाएं प्राप्त करें।` 
                : lang === 'Punjabi'
                ? `ਆਪਣੇ ਖੇਤ (${user.location?.address || 'ਕਰਨਾਲ'}) ਦੇ ਕੋਲ ਭਾਰੀ ਮੀਂਹ, ਤੂਫ਼ਾਨ, ਗੜ੍ਹੇਮਾਰੀ, ਕੋਹਰਾ ਜਾਂ ਕੀੜਿਆਂ ਦੇ ਹਮਲੇ ਦਾ ਪਤਾ ਲੱਗਣ 'ਤੇ ਤੁਰੰਤ ਨੋਟੀਫਿਕੇਸ਼ਨ ਪ੍ਰਾਪਤ ਕਰੋ।`
                : lang === 'Marathi'
                ? `तुमच्या शेताजवळ (${user.location?.address || 'कर्नाल'}) मुसळधार पाऊस, वादळ, गारपीट, धुके किंवा कीटक प्रादुर्भाव आढळल्यास त्वरित सूचना मिळवा।`
                : lang === 'Telugu'
                ? `మీ పొలం (${user.location?.address || 'కర్నాల్'}) పరిధిలో భారీ వర్షాలు, బలమైన గాలులు, వడగళ్ళు, పొగమంచు లేదా పురుగుల ముప్పు పొంచి ఉన్నప్పుడు తక్షణమే మొబైల్ నోటిఫికేషన్లు పొందండి.`
                : lang === 'Bengali'
                ? `আপনার খামার অঞ্চলের (${user.location?.address || 'কারনাল'}) কাছাকাছি ভারী বৃষ্টি, ঝড়, শিলাবৃষ্টি, ঘন কুয়াশা বা পোকামাকড়ের উপদ্বব সনাক্ত হলে তাৎক্ষণিক পুশ বিজ্ঞপ্তি পান।`
                : `Receive real-time automated browser notification warnings if torrential precipitation, strong cyclone gusts, frost, or severe pathogen outbreaks are forecasted near your farming address (${user.location?.address || 'Karnal zone'}).`}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {notificationState !== 'granted' && (
                <button
                  type="button"
                  onClick={requestPermission}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-emerald-600/10 active:scale-98"
                >
                  <Bell className="h-4 w-4" />
                  <span>
                    {lang === 'Hindi' ? 'सक्रिय करें' : lang === 'Punjabi' ? 'ਨੋਟੀਫਿਕੇਸ਼ਨ ਚਾਲੂ ਕਰੋ' : lang === 'Marathi' ? 'परवानगी द्या' : lang === 'Telugu' ? 'అనుమతించు' : lang === 'Bengali' ? 'বিজ্ঞপ্তি সক্রিয় করুন' : 'Enable Live Alerts'}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={toggleAutoAlerts}
                className={`font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition-all border cursor-pointer ${
                  autoAlertEnabled 
                    ? 'bg-slate-50 border-emerald-200 text-emerald-800' 
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                {autoAlertEnabled ? <Check className="h-4 w-4 text-emerald-600" /> : <BellOff className="h-4 w-4" />}
                <span>
                  {lang === 'Hindi' ? 'सिंक होने पर चेतावनी' : lang === 'Punjabi' ? 'ਸਿੰਕ ਹੋਣ ਤੇ ਅਲਰਟ' : lang === 'Marathi' ? 'सिंक झाल्यावर अलर्ट' : lang === 'Telugu' ? 'సింక్ అలర్ట్' : lang === 'Bengali' ? 'সিঙ্ক হলে এলার্ট' : 'Auto Alert on Sync'}
                </span>
              </button>
            </div>

            {showIframeHelp && (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl space-y-2 animate-fade-in text-xs text-amber-900 leading-relaxed font-semibold">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Info className="h-4 w-4 shrink-0" />
                  <span className="font-extrabold">
                    {lang === 'Hindi' ? 'सुरक्षित आईफ्रेम (Iframe) सीमा विवरण' : 'Iframe Security Policy Notice'}
                  </span>
                </div>
                <p className="font-medium text-[11px] text-slate-600">
                  {lang === 'Hindi' 
                    ? 'सुरक्षा नियमों के कारण, आईफ्रेम पूर्वावलोकन में ब्राउज़र पॉपअप अवरुद्ध हो सकता है। कृपया पूर्ण, मूल पुश सूचनाओं का अनुभव करने के लिए ऊपर दाएं कोने में "Open in New Tab" पर क्लिक करें। तब तक, हमारा इन-ऐप स्मार्ट अलार्म सुचारू रूप से कार्य करता रहेगा।' 
                    : 'Your browser restricts native push permissions within secure sandboxed previews. For a full simulation of live mobile push banners, please click "Open in New Tab" at the top right of the viewport. In the meantime, our high-fidelity in-app overlay is fully functional!'}
                </p>
              </div>
            )}
          </div>

          {/* Alert Simulator Area */}
          <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-3.5">
            <div className="space-y-0.5">
              <h4 className="font-display font-extrabold text-xs sm:text-sm text-slate-800">
                {lang === 'Hindi' ? 'चेतावनी सिम्युलेटर' : lang === 'Punjabi' ? 'ਚੇਤਾਵਨੀ ਸਿਮੂਲੇਟਰ' : lang === 'Marathi' ? 'इशारा सिम्युलेटर' : lang === 'Telugu' ? 'హెచ్చరికల సిమ్యులేటర్' : lang === 'Bengali' ? 'সতর্কতা সিমুলেটর' : 'Advisory Alarm Simulator'}
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">
                {lang === 'Hindi' ? 'तत्काल परीक्षण करने के लिए दबाएं' : lang === 'Punjabi' ? 'ਤੁਰੰਤ ਟੈਸਟ ਕਰੋ' : lang === 'Marathi' ? 'त्वरित चाचणी करा' : lang === 'Telugu' ? 'వెంటనే పరీక్షించండి' : lang === 'Bengali' ? 'তাৎক্ষণিক পরীক্ষা করুন' : 'Tap to test push notifications instantly'}
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => triggerAlert('rain')}
                className="w-full bg-white hover:bg-slate-100/50 border border-slate-200/60 p-3 rounded-xl flex items-center justify-between text-left transition-all hover:translate-x-1 cursor-pointer active:scale-99"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-sky-100 text-sky-800 rounded-lg flex items-center justify-center font-bold">
                    🌧️
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {lang === 'Hindi' ? 'भारी वर्षा चेतावनी' : lang === 'Punjabi' ? 'ਭਾਰੀ ਬਾਰਿਸ਼ ਅਲਰਟ' : lang === 'Marathi' ? 'मुसळधार पाऊस इशारा' : lang === 'Telugu' ? 'భారీ వర్ష హెచ్చరిక' : lang === 'Bengali' ? 'ভারী বৃষ্টির সতর্কতা' : 'Heavy Rain Advisory'}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">Postpone Spray Alert</p>
                  </div>
                </div>
                <Play className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => triggerAlert('wind')}
                className="w-full bg-white hover:bg-slate-100/50 border border-slate-200/60 p-3 rounded-xl flex items-center justify-between text-left transition-all hover:translate-x-1 cursor-pointer active:scale-99"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold">
                    💨
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {lang === 'Hindi' ? 'तेज हवा चेतावनी' : lang === 'Punjabi' ? 'ਤੇਜ਼ ਹਵਾ ਅਲਰਟ' : lang === 'Marathi' ? 'वादळी वारे इशारा' : lang === 'Telugu' ? 'బలమైన గాలుల హెచ్చరిక' : lang === 'Bengali' ? 'প্রবল হাওয়ার সতর্কতা' : 'Strong Winds Advisory'}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">Tall Seedling Lodging Risk</p>
                  </div>
                </div>
                <Play className="h-3.5 w-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => triggerAlert('pest')}
                className="w-full bg-white hover:bg-slate-100/50 border border-slate-200/60 p-3 rounded-xl flex items-center justify-between text-left transition-all hover:translate-x-1 cursor-pointer active:scale-99"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-red-100 text-red-800 rounded-lg flex items-center justify-center font-bold">
                    🪲
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {lang === 'Hindi' ? 'कीट प्रकोप चेतावनी' : lang === 'Punjabi' ? 'ਕੀੜੇ ਅਲਰਟ' : lang === 'Marathi' ? 'कीड प्रादुर्भाव इशारा' : lang === 'Telugu' ? 'పురుగుల ముప్పు హెచ్చరిక' : lang === 'Bengali' ? 'কীটপতঙ্গ আক্রমণ সতর্কতা' : 'Pest Infection Alarm'}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">{localizedCropName} Stem-Rot Hazard</p>
                  </div>
                </div>
                <Play className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Two Column Layout: Daily Grid and Soil Telemetry */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 7-DAY ADVISORY GRID */}
        <div className="md:col-span-7 bg-white p-5 rounded-3xl border border-slate-100 space-y-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h2 className="font-display font-extrabold text-slate-900 text-base sm:text-lg">
              {t('sevenDayForecast', lang)}
            </h2>
            <span className="text-xs text-slate-400 font-bold uppercase">Karnal Grid</span>
          </div>

          <div className="space-y-3.5">
            {FORECAST_DAYS.map((forecast, index) => {
              const Icon = forecast.icon;
              const isRainy = forecast.rainProb && parseInt(forecast.rainProb) > 50;
              return (
                <div 
                  key={index}
                  className={`p-3 rounded-2xl border transition-all hover:bg-slate-50/50 flex items-center justify-between gap-4 ${
                    isRainy ? 'bg-sky-50/40 border-sky-100' : 'bg-slate-50/20 border-slate-100'
                  }`}
                >
                  {/* Day Info */}
                  <div className="flex items-center space-x-3.5 w-28 sm:w-32">
                    <div className={`p-2.5 rounded-xl ${isRainy ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-950">{getLocalizedDay(forecast.day, lang)}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{getLocalizedLabel(forecast.label, lang)}</p>
                    </div>
                  </div>

                  {/* Temp Bar (Responsive visualization of temperature) */}
                  <div className="hidden sm:flex flex-1 items-center space-x-3">
                    <span className="text-[10px] text-slate-400 font-bold">20°C</span>
                    <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute h-full bg-amber-500 rounded-full"
                        style={{ left: '30%', right: '15%' }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-extrabold">{forecast.temp}</span>
                  </div>

                  {/* Details */}
                  <div className="text-right space-y-0.5">
                    <p className="text-xs font-extrabold text-slate-900">{forecast.temp}</p>
                    <div className="flex items-center space-x-2 text-[10px] font-semibold text-slate-400 justify-end">
                      <span className="flex items-center text-sky-700">
                        <CloudRain className="h-3 w-3 inline mr-0.5" />
                        {forecast.rainProb}
                      </span>
                      <span>|</span>
                      <span>{forecast.wind}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: SOIL TELEMETRY & CHATBOT CALLOUT */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Soil condition telemetry dashboard */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base">
              {t('soilTelemetry', lang)} (10cm Depth)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              
              {/* Telemetry Tile 1 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('soilMoisture', lang)}</span>
                  <Droplets className="h-4 w-4 text-sky-600" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-2xl text-slate-950">{soilMoisture}</span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-1">{t('statusFavorable', lang)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              {/* Telemetry Tile 2 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('soilTemp', lang)}</span>
                  <Thermometer className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-2xl text-slate-950">{soilTemp}</span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-1">{t('idealForTillering', lang)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>

              {/* Telemetry Tile 3 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {lang === 'Hindi' ? 'धूप के घंटे' : lang === 'Punjabi' ? 'ਧੁੱਪ ਦੇ ਘੰਟੇ' : lang === 'Marathi' ? 'धुपाचे तास' : lang === 'Telugu' ? 'సూర్యరశ్మి గంటలు' : lang === 'Bengali' ? 'সূর্যালোকের সময়' : 'Daylight Hours'}
                  </span>
                  <Sun className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-2xl text-slate-950">11.5 Hrs</span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-1">
                    {lang === 'Hindi' ? 'उच्च सौर विकिरण' : lang === 'Punjabi' ? 'ਉੱਚ ਸੂਰਜੀ ਵਿਕਿਰਨ' : lang === 'Marathi' ? 'उच्च सौर ऊर्जा' : lang === 'Telugu' ? 'ఎక్కువ సూర్యరశ్మి' : lang === 'Bengali' ? 'উচ্চ সৌর বিকিরণ' : 'High solar irradiance'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              {/* Telemetry Tile 4 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {lang === 'Hindi' ? 'कीट सूचकांक' : lang === 'Punjabi' ? 'ਕੀਟ ਸੂਚਕਾਂਕ' : lang === 'Marathi' ? 'कीड निर्देशांक' : lang === 'Telugu' ? 'పురుగుల సూచిక' : lang === 'Bengali' ? 'কীটপতঙ্গ সূচক' : 'Pest index'}
                  </span>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-display font-extrabold text-2xl text-emerald-700">
                    {lang === 'Hindi' ? 'कम' : lang === 'Punjabi' ? 'ਘੱਟ' : lang === 'Marathi' ? 'कमी' : lang === 'Telugu' ? 'తక్కువ' : lang === 'Bengali' ? 'কম' : 'LOW'}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-medium mt-1">
                    {lang === 'Hindi' ? 'कोई चेतावनी नहीं' : lang === 'Punjabi' ? 'ਕੋਈ ਚੇਤਾਵਨੀ ਨਹੀਂ' : lang === 'Marathi' ? 'कोणतीही चेतावणी नाही' : lang === 'Telugu' ? 'ఎటువంటి హెచ్చరికలు లేవు' : lang === 'Bengali' ? 'কোনো সতর্কতা নেই' : 'No warnings issued'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Pest Risk Advisory */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-3">
            <h4 className="font-display font-extrabold text-slate-900 text-sm">
              {lang === 'Hindi' ? 'रोग संवेदनशीलता' : lang === 'Punjabi' ? 'ਰੋਗ ਸੰਵੇਦਨਸ਼ੀਲਤਾ' : lang === 'Marathi' ? 'रोग संवेदनशीलता' : lang === 'Telugu' ? 'తెగులు సంభావ్యత' : lang === 'Bengali' ? 'রোগ সংবেদনশীলতা' : 'Pathogen Susceptibility'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'Hindi' 
                ? `गीली मिट्टी और कोहरे के कारण बासमती ${localizedCropName} में तना गलन का खतरा बढ़ जाता है। बारिश से पहले जैविक फंगीसाइड का छिड़काव करें।`
                : lang === 'Punjabi'
                ? `ਸਿੱਲ੍ਹੀ ਮਿੱਟੀ ਅਤੇ ਕੋਹਰੇ ਕਾਰਨ ਬਾਸਮਤੀ ${localizedCropName} ਵਿੱਚ ਤਣਾ ਗਲਣ ਦਾ ਖਤਰਾ ਵੱਧ ਜਾਂਦਾ ਹੈ। ਮੀਂਹ ਤੋਂ ਪਹਿਲਾਂ ਜੈਵਿਕ ਫੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।`
                : lang === 'Marathi'
                ? `दमट हवामान आणि धुक्यामुळे बासमती ${localizedCropName} मध्ये खोडकुज रोगाचा प्रादुर्भाव वाढू शकतो। पावसापूर्वी सेंद्रिय फंगीसाइड फवारा।`
                : lang === 'Telugu'
                ? `నేలలో తేమ మరియు పొగమంచు కారణంగా బాస్మతి ${localizedCropName} పంటకు కాండం కుళ్ళు తెగులు సోకే అవకాశం ఉంది. వర్షం పడటానికి ముందే నివారణ చర్యలు తీసుకోండి.`
                : lang === 'Bengali'
                ? `মাটির আর্দ্রতা এবং কুয়াশার কারণে বাসমতি ${localizedCropName} তে গোড়া পচা রোগের ঝুঁকি বৃদ্ধি পায়। বৃষ্টির আগে প্রতিরোধমূলক জৈব ছত্রাকনাশক স্প্রে করুন।`
                : `Damp soil humidity coupled with foggy mornings increases stem-rot risk for Basmati ${localizedCropName}. Spray preventative bio-fungicide (Trichoderma spray @ 5g/liter) before heavy showers.`}
            </p>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold">
                {lang === 'Hindi' ? '१ घंटे पहले अपडेट किया गया' : lang === 'Punjabi' ? '੧ ਘੰਟੇ ਪਹਿਲਾਂ ਅਪਡੇਟ ਕੀਤਾ ਗਿਆ' : lang === 'Marathi' ? '१ तासापूर्वी अपडेट केले' : lang === 'Telugu' ? '1 గంట క్రితం అప్‌డేట్ చేయబడింది' : lang === 'Bengali' ? '১ ঘণ্টা আগে আপডেট করা হয়েছে' : 'UPDATED 1 HOUR AGO'}
              </span>
              <button onClick={() => onNavigate('diagnosis')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer">
                {t('scanWestLeafZone', lang)}
              </button>
            </div>
          </div>

          {/* Conversational chatbot advisory box */}
          <div className="bg-emerald-950 text-white rounded-3xl p-5 space-y-4 shadow-lg shadow-emerald-950/10">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
              <Sparkles className="h-4 w-4" />
              <span>{lang === 'Hindi' ? 'एआई सहायक से पूछें' : lang === 'Punjabi' ? 'ਏਆਈ ਸਹਾਇਕ ਤੋਂ ਪੁੱਛੋ' : lang === 'Marathi' ? 'एआय मदतनीसाला विचारा' : lang === 'Telugu' ? 'ఏఐ సహాయకుడిని అడగండి' : lang === 'Bengali' ? 'এআই সহকারীকে জিজ্ঞাসা করুন' : 'ASK AGRI ASSISTANT'}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {lang === 'Hindi' 
                ? '"क्या शुक्रवार की बारिश मेरे कीटनाशक छिड़काव को प्रभावित करेगी? मुझे क्या करना चाहिए?"'
                : lang === 'Punjabi'
                ? '"ਕੀ ਸ਼ੁੱਕਰਵਾਰ ਦਾ ਮੀਂਹ ਮੇਰੇ ਕੀਟਨਾਸ਼ਕ ਛਿੜਕਾਅ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰੇਗਾ? ਮੈਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?"'
                : lang === 'Marathi'
                ? '"पावसामुळे फवारणीवर काय परिणाम होईल? त्याऐवजी मी काय करावे?"'
                : lang === 'Telugu'
                ? '"వర్షం పడటం వల్ల పిచికారీపై ఏమైనా ప్రభావం పడుతుందా? నేను ఏమి చేయాలి?"'
                : lang === 'Bengali'
                ? '"বৃষ্টির কারণে স্প্রে করার ওপর কী প্রভাব পড়বে? এর বিকল্প কী করা যায়?"'
                : '"How will the Friday rain affect my cotton pesticide spray? What should I do instead?"'}
            </p>

            <button 
              onClick={() => onNavigate('assistant')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>{lang === 'Hindi' ? 'एआई के साथ चैट करें' : lang === 'Punjabi' ? 'ਏਆਈ ਨਾਲ ਗੱਲਬਾत ਕਰੋ' : lang === 'Marathi' ? 'एआय सोबत चॅट करा' : lang === 'Telugu' ? 'ఏఐ తో చాట్ చేయండి' : lang === 'Bengali' ? 'এআই এর সাথে চ্যাট করুন' : 'Chat with Agri AI'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
