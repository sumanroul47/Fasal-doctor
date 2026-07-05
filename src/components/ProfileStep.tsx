import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Mic, ArrowLeft, Check, Compass, Star } from 'lucide-react';
import { Language } from '../types';

interface ProfileStepProps {
  language: Language;
  name: string;
  onSetName: (name: string) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

const localT = {
  step3of3: {
    English: "Step 3 of 3",
    Hindi: "चरण 3 का 3",
    Punjabi: "ਕਦਮ 3 ਦਾ 3",
    Marathi: "पायरी ३ पैकी ३",
    Telugu: "స్టెప్ 3/3",
    Bengali: "ধাপ ৩ এর ৩",
  },
  welcomeToFasalDoctor: {
    English: "Welcome to Fasal Doctor",
    Hindi: "फसल डॉक्टर में आपका स्वागत है",
    Punjabi: "ਫਸਲ ਡਾਕਟਰ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
    Marathi: "फसल डॉक्टर मध्ये आपले स्वागत आहे",
    Telugu: "ఫసల్ డాక్టర్‌కు స్వాగతం",
    Bengali: "ফসল ডক্টরে আপনাকে স্বাগত",
  },
  secureAccountDesc: {
    English: "Secure your agricultural account with 100% verified credentials",
    Hindi: "100% सत्यापित क्रेडेंशियल्स के साथ अपने कृषि खाते को सुरक्षित करें",
    Punjabi: "100% ਪ੍ਰਮਾਣਿਤ ਵੇਰਵਿਆਂ ਨਾਲ ਆਪਣੇ ਖੇਤੀਬਾੜੀ ਖਾਤੇ ਨੂੰ ਸੁਰੱਖਿਅਤ ਕਰੋ",
    Marathi: "१००% सत्यापित क्रेडेन्शियल्ससह तुमचे कृषी खाते सुरक्षित करा",
    Telugu: "100% ధృవీకరించబడిన ఆధారాలతో మీ వ్యవసాయ ఖాతాను సురక్షితం చేసుకోండి",
    Bengali: "১০০% যাচাইকৃত বিবরণ দিয়ে আপনার কৃষি অ্যাকাউন্ট সুরক্ষিত করুন",
  },
  identityAuthenticated: {
    English: "Identity Authenticated",
    Hindi: "पहचान सत्यापित",
    Punjabi: "ਪਛਾਣ ਦੀ ਪੁਸ਼ਟੀ ਹੋਈ",
    Marathi: "ओळख सत्यापित",
    Telugu: "గుర్తింపు ధృవీకరించబడింది",
    Bengali: "পরিচয় যাচাইকৃত",
  },
  identityAuthenticatedDesc: {
    English: "Your farm mobile number is verified, and data is saved securely in our cloud storage.",
    Hindi: "आपके खेत का मोबाइल नंबर सत्यापित है, और डेटा हमारे क्लाउड स्टोरेज में सुरक्षित रूप से सहेजा गया है।",
    Punjabi: "ਤੁਹਾਡੇ ਫਾਰਮ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਪ੍ਰਮਾਣਿਤ ਹੈ, ਅਤੇ ਡੇਟਾ ਸਾਡੇ ਕਲਾਉਡ ਸਟੋਰੇਜ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰੂਪ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਹੈ।",
    Marathi: "तुमचा शेताचा मोबाईल नंबर सत्यापित आहे आणि डेटा आमच्या क्लाउड स्टोरेजमध्ये सुरक्षितपणे जतन केला आहे।",
    Telugu: "మీ వ్యవసాయ మొబైల్ నంబర్ ధృవీకరించబడింది మరియు డేటా మా క్లౌడ్ స్టోరేజ్‌లో సురక్షितంగా సేవ్ చేయబడింది.",
    Bengali: "আপনার খামারের মোবাইল নম্বর যাচাই করা হয়েছে এবং ডেটা আমাদের ক্লাউড স্টোরেজে নিরাপদভাবে সংরক্ষিত রয়েছে।",
  },
  yourFullName: {
    English: "Your Full Name",
    Hindi: "आपका पूरा नाम",
    Punjabi: "ਤੁਹਾਡਾ ਪੂਰਾ ਨਾਮ",
    Marathi: "तुमचे पूर्ण नाव",
    Telugu: "మీ పూర్తి పేరు",
    Bengali: "আপনার সম্পূর্ণ নাম",
  },
  fullNamePlaceholder: {
    English: "e.g. Ramesh Patel",
    Hindi: "जैसे: रमेश पटेल",
    Punjabi: "ਜਿਵੇਂ: ਰਮੇਸ਼ ਪਟੇਲ",
    Marathi: "उदा. रमेश पटेल",
    Telugu: "ఉదా: రమేష్ పటేల్",
    Bengali: "যেমন: রমেশ প্যাটেল",
  },
  enterNameError: {
    English: "Please enter your name to complete registration",
    Hindi: "पंजीकरण पूरा करने के लिए कृपया अपना नाम दर्ज करें",
    Punjabi: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ",
    Marathi: "नोंदणी पूर्ण करण्यासाठी कृपया तुमचे नाव टाका",
    Telugu: "నమోదును పూర్తి చేయడానికి దయచేసి మీ పేరును నమోదు చేయండి",
    Bengali: "নিবন্ধন সম্পন্ন করতে অনুগ্রহ করে আপনার নাম লিখুন",
  },
  enableVoiceAssistant: {
    English: "Enable Voice Assistant",
    Hindi: "आवाज सहायक सक्षम करें",
    Punjabi: "ਆਵਾਜ਼ ਸਹਾਇਕ ਚਾਲੂ ਕਰੋ",
    Marathi: "आवाज सहाय्यक सक्षम करा",
    Telugu: "వాయిస్ అసిస్టెంట్‌ని ప్రారంభించండి",
    Bengali: "ভয়েস অ্যাসিস্ট্যান্ট সক্রিয় করুন",
  },
  voiceAssistantDesc: {
    English: "Ask questions and hear real-time AI solutions spoken back to you",
    Hindi: "प्रश्न पूछें और वास्तविक समय के एआई समाधानों को आवाज में वापस सुनें",
    Punjabi: "ਸਵਾਲ ਪੁੱਛੋ ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਏਆਈ ਹੱਲ ਸੁਣੋ",
    Marathi: "प्रश्न विचारा आणि रिअल-टाइम एआय उपाय ऐका",
    Telugu: "ప్రశ్నలు అడగండి మరియు నిజ-సమయ AI పరిష్కారాలను వాయిస్ ద్వారా వినండి",
    Bengali: "প্রশ্ন জিজ্ঞাসা করুন এবং রিয়েল-টাইম এআই সমাধানগুলি ভয়েসের মাধ্যমে শুনুন",
  },
  voiceEngineReady: {
    English: "Fasal Doctor voice audio engine is ready in English & Regional Language!",
    Hindi: "फसल डॉक्टर आवाज ऑडियो इंजन अंग्रेजी और क्षेत्रीय भाषा में तैयार है!",
    Punjabi: "ਫਸਲ ਡਾਕਟਰ ਵੌਇਸ ਆਡੀਓ ਇੰਜਨ ਅੰਗਰੇਜ਼ੀ ਅਤੇ ਖੇਤਰੀ ਭਾਸ਼ਾ ਵਿੱਚ ਤਿਆਰ ਹੈ!",
    Marathi: "फसल डॉक्टर व्हॉइस ऑडिओ इंजिन इंग्रजी आणि प्रादेशिक भाषेत तयार आहे!",
    Telugu: "ఫసల్ డాక్టర్ వాయిస్ ఆడియో ఇంజిన్ ఇంగ్లీష్ & ప్రాంతీయ భాషలో సిద్ధంగా ఉంది!",
    Bengali: "ফসল ডক্টর ভয়েস অডিও ইঞ্জিন ইংরেজি এবং আঞ্চলিক ভাষায় প্রস্তুত রয়েছে!",
  },
  back: {
    English: "Back",
    Hindi: "पीछे",
    Punjabi: "ਪਿੱਛੇ",
    Marathi: "मागे",
    Telugu: "వెనుకకు",
    Bengali: "পিছনে",
  },
  goToDashboard: {
    English: "Go to Dashboard",
    Hindi: "डैशबोर्ड पर जाएं",
    Punjabi: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਜਾਓ",
    Marathi: "डॅशबोर्डवर जा",
    Telugu: "డ్యాష్‌బోర్డ్‌కు వెళ్లండి",
    Bengali: "ড্যাশবোর্ডে যান",
  }
};

const STEP_LABELS = {
  1: {
    English: 'Language',
    Hindi: 'भाषा',
    Punjabi: 'ਭਾਸ਼ਾ',
    Marathi: 'भाषा',
    Telugu: 'భాష',
    Bengali: 'ভাষা',
    Tamil: 'மொழி',
    Kannada: 'ಭಾಷೆ',
    Malayalam: 'ഭാഷ',
    Gujarati: 'ભાષા',
    Odia: 'ଭାଷା',
    Assamese: 'ভাষা',
  },
  2: {
    English: 'Crops',
    Hindi: 'फसलें',
    Punjabi: 'ਫਸਲਾਂ',
    Marathi: 'पिके',
    Telugu: 'పంటలు',
    Bengali: 'ফসল',
    Tamil: 'பயிர்கள்',
    Kannada: 'ಬೆಳೆಗಳು',
    Malayalam: 'വിളകൾ',
    Gujarati: 'પાક',
    Odia: 'ଫସଲ',
    Assamese: 'শস্য',
  },
  3: {
    English: 'Profile',
    Hindi: 'प्रोफाइल',
    Punjabi: 'ਪ੍ਰੋਫਾਈਲ',
    Marathi: 'प्रोफाइल',
    Telugu: 'ప్రొఫైల్',
    Bengali: 'প্রোফাইল',
    Tamil: 'சுயவிவரம்',
    Kannada: 'ಪ್ರೊಫೈಲ್',
    Malayalam: 'പ്രൊഫൈൽ',
    Gujarati: 'პ્રોଫાઇલ',
    Odia: 'ପ୍ରୋଫାଇଲ୍',
    Assamese: 'প্রোফাইল',
  }
};

export default function ProfileStep({ language, name, onSetName, voiceEnabled, onToggleVoice, onBack, onSubmit }: ProfileStepProps) {
  const [error, setError] = useState('');

  const getLocal = (key: keyof typeof localT) => {
    return localT[key][language] || localT[key]['English'];
  };

  const handleGoToDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(getLocal('enterNameError'));
      return;
    }
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Onboarding progress bar */}
        <div className="h-2 w-full bg-slate-100">
          <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: '100%' }}></div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Stepper Progress Indicator */}
          <div className="pb-6 border-b border-slate-100/80">
            <div className="flex items-center justify-between relative max-w-md mx-auto px-4">
              {/* Background connecting line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
              {/* Active progress connecting line */}
              <div 
                className="absolute top-4 left-6 h-0.5 bg-emerald-500 -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: '100%' }}
              ></div>
              
              {/* Step 1: Language */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50">
                  ✓
                </div>
                <span className="text-[10px] font-bold mt-1.5 transition-colors uppercase tracking-wider text-emerald-600">
                  {STEP_LABELS[1][language] || STEP_LABELS[1]['English']}
                </span>
              </div>

              {/* Step 2: Crops */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50">
                  ✓
                </div>
                <span className="text-[10px] font-bold mt-1.5 transition-colors uppercase tracking-wider text-emerald-600">
                  {STEP_LABELS[2][language] || STEP_LABELS[2]['English']}
                </span>
              </div>

              {/* Step 3: Profile */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all bg-emerald-50 border-2 border-emerald-600 text-emerald-700 font-extrabold ring-4 ring-emerald-50">
                  3
                </div>
                <span className="text-[10px] font-extrabold mt-1.5 transition-colors uppercase tracking-wider text-emerald-700">
                  {STEP_LABELS[3][language] || STEP_LABELS[3]['English']}
                </span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
              {getLocal('step3of3')}
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {getLocal('welcomeToFasalDoctor')}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {getLocal('secureAccountDesc')}
            </p>
          </div>

          {/* Secure Badge */}
          <div className="bg-emerald-50 border border-emerald-100/50 rounded-2xl p-4 flex items-center space-x-3.5 animate-fade-in text-left">
            <div className="p-3 bg-emerald-600 text-white rounded-full">
              <ShieldCheck className="h-6 w-6 stroke-[2.5px]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm sm:text-base text-slate-900">
                {getLocal('identityAuthenticated')}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {getLocal('identityAuthenticatedDesc')}
              </p>
            </div>
          </div>

          <form onSubmit={handleGoToDashboard} className="space-y-6 text-left">
            {/* NAME INPUT */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {getLocal('yourFullName')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  <UserCheck className="h-5 w-5 text-slate-400" />
                </span>
                <input
                  type="text"
                  placeholder={getLocal('fullNamePlaceholder')}
                  value={name}
                  onChange={(e) => {
                    onSetName(e.target.value);
                    if (e.target.value) setError('');
                  }}
                  className="w-full bg-slate-50 text-slate-900 border-0 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm sm:text-base font-semibold focus:ring-2 focus:ring-emerald-500 shadow-inner transition-all outline-none"
                  required
                />
              </div>
              {error && <p className="text-xs text-rose-600 font-bold">{error}</p>}
            </div>

            {/* VOICE ASSISTANT ADVISORY ACCENT */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-slate-900">
                    {getLocal('enableVoiceAssistant')}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {getLocal('voiceAssistantDesc')}
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={onToggleVoice}
                  className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors outline-none ${
                    voiceEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                      voiceEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {voiceEnabled && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-slate-600 animate-fade-in text-left">
                  <Mic className="h-4 w-4 text-emerald-600 animate-pulse shrink-0" />
                  <span>"{getLocal('voiceEngineReady')}"</span>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTONS */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 gap-4">
              <button
                type="button"
                onClick={onBack}
                className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm py-3 px-5 rounded-2xl flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{getLocal('back')}</span>
              </button>
              
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-8 rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-100 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
              >
                <span>{getLocal('goToDashboard')}</span>
                <Check className="h-4 w-4 stroke-[3.5px]" />
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
