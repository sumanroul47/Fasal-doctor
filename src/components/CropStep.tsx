import React, { useState } from 'react';
import { Search, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Crop, Language } from '../types';

interface CropStepProps {
  language: Language;
  selectedCrops: Crop[];
  onToggleCrop: (crop: Crop) => void;
  onBack: () => void;
  onNext: () => void;
}

const ALL_CROPS: { id: Crop; name: string; native: string; image: string; season: 'Kharif' | 'Rabi' | 'Annual' | 'Zaid / All-Season' }[] = [
  { 
    id: 'Rice', 
    name: 'Rice (Paddy)', 
    native: 'धान / चावल', 
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300', 
    season: 'Kharif' 
  },
  { 
    id: 'Wheat', 
    name: 'Wheat', 
    native: 'गेहूं', 
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=300', 
    season: 'Rabi' 
  },
  { 
    id: 'Cotton', 
    name: 'Cotton', 
    native: 'कपास / रूई', 
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=300', 
    season: 'Kharif' 
  },
  { 
    id: 'Mustard', 
    name: 'Mustard', 
    native: 'सरसों', 
    image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=300', 
    season: 'Rabi' 
  },
  { 
    id: 'Sugarcane', 
    name: 'Sugarcane', 
    native: 'गन्ना', 
    image: 'https://images.unsplash.com/photo-1595181156877-626f86c22f00?auto=format&fit=crop&q=80&w=300', 
    season: 'Annual' 
  },
  { 
    id: 'Tomatoes', 
    name: 'Tomatoes', 
    native: 'टमाटर', 
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300', 
    season: 'Zaid / All-Season' 
  }
];

const localT = {
  step2of3: {
    English: "Step 2 of 3",
    Hindi: "चरण 2 का 3",
    Punjabi: "ਕਦਮ 2 ਦਾ 3",
    Marathi: "पायरी २ पैकी ३",
    Telugu: "స్టెప్ 2/3",
    Bengali: "ধাপ ২ এর ৩",
  },
  whatAreYouGrowing: {
    English: "What are you growing?",
    Hindi: "आप क्या उगा रहे हैं?",
    Punjabi: "ਤੁਸੀਂ ਕੀ ਉਗਾ ਰਹੇ ਹੋ?",
    Marathi: "तुम्ही काय पिकवत आहात?",
    Telugu: "మీరు ఏం పండిస్తున్నారు?",
    Bengali: "আপনি কি চাষ করছেন?",
  },
  selectCropsDesc: {
    English: "Select any crop you currently grow to receive customized advisory tracks",
    Hindi: "कस्टमाइज्ड सलाह प्राप्त करने के लिए अपनी वर्तमान खेती चुनें",
    Punjabi: "ਵਿਅਕਤੀਗਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਆਪਣੀ ਮੌਜੂਦਾ ਫਸਲ ਚੁਣੋ",
    Marathi: "वैयक्तिकृत सल्ल्यासाठी तुमची सद्य पीक निवडा",
    Telugu: "వ్యక్తిగతీకరించిన సలహా కోసం మీరు పండిస్తున్న పంటను ఎంచుకోండి",
    Bengali: "কাস্টমাইজড পরামর্শ পেতে আপনার চাষকৃত ফসল নির্বাচন করুন",
  },
  searchPlaceholder: {
    English: "Search crop (e.g. Wheat, Tomato...)",
    Hindi: "फसल खोजें (जैसे गेहूं, टमाटर...)",
    Punjabi: "ਫਸਲ ਖੋਜੋ (ਜਿਵੇਂ ਕਣਕ, ਟਮਾਟਰ...)",
    Marathi: "पीक शोधा (उदा. गहू, टोमॅटो...)",
    Telugu: "పంటను శోధించండి (ఉదా: గోధుమ, టమోటా...)",
    Bengali: "ফসল খুঁজুন (যেমন গম, টমেটো...)",
  },
  requestCrop: {
    English: "Request Crop",
    Hindi: "फसल का अनुरोध करें",
    Punjabi: "ਫਸਲ ਦੀ ਮੰਗ ਕਰੋ",
    Marathi: "पिकाची विनंती करा",
    Telugu: "పంటను అభ్యర్థించండి",
    Bengali: "ফসলের অনুরোধ জানান",
  },
  haveOtherCrops: {
    English: "Have other crops? Tell us",
    Hindi: "अन्य फसलें हैं? हमें बताएं",
    Punjabi: "ਹੋਰ ਫਸਲਾਂ ਹਨ? ਸਾਨੂੰ ਦੱਸੋ",
    Marathi: "इतर पिके आहेत? आम्हाला सांगा",
    Telugu: "ఇతర పంటలు ఉన్నాయా? మాకు చెప్పండి",
    Bengali: "অন্যান্য ফসল আছে? আমাদের জানান",
  },
  selectedCount: {
    English: "Selected count:",
    Hindi: "चुनी गई संख्या:",
    Punjabi: "ਚੁਣੀ ਗਈ ਗਿਣਤੀ:",
    Marathi: "निवडलेली संख्या:",
    Telugu: "ఎంచుకున్న సంఖ్య:",
    Bengali: "নির্বাচিত সংখ্যা:",
  },
  cropsSelected: {
    English: "Crops selected",
    Hindi: "फसलें चुनी गईं",
    Punjabi: "ਫਸਲਾਂ ਚੁਣੀਆਂ ਗਈਆਂ",
    Marathi: "पिके निवडली",
    Telugu: "పంటలు ఎంచుకున్నారు",
    Bengali: "ফসল নির্বাচিত",
  },
  back: {
    English: "Back",
    Hindi: "पीछे",
    Punjabi: "ਪਿੱਛੇ",
    Marathi: "मागे",
    Telugu: "వెనుకకు",
    Bengali: "পিছনে",
  },
  nextStep: {
    English: "Next Step",
    Hindi: "अगला कदम",
    Punjabi: "ਅਗਲਾ ਕਦਮ",
    Marathi: "पुढील पाऊल",
    Telugu: "తదుపరి స్టెప్",
    Bengali: "পরবর্তী ধাপ",
  },
  selectAtLeastOneCrop: {
    English: "Please select at least one crop to receive personalized insights",
    Hindi: "व्यक्तिगत जानकारी प्राप्त करने के लिए कृपया कम से कम एक फसल चुनें",
    Punjabi: "ਵਿਅਕਤੀਗਤ ਜਾਣਕਾਰੀ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਫਸਲ ਚੁਣੋ",
    Marathi: "कृपया वैयक्तिकृत माहितीसाठी किमान एक पीक निवडा",
    Telugu: "వ్యక్తిగతీకరించిన సమాచారం కోసం దయచేసి కనీసం ఒక పంటను ఎంచుకోండి",
    Bengali: "ব্যক্তিগতকৃত তথ্য পেতে অনুগ্রহ করে কমপক্ষে একটি ফসল নির্বাচন করুন",
  },
  thanksSuggestion: {
    English: "Thanks for the suggestion! We are constantly training AI for new crops.",
    Hindi: "सुझाव के लिए धन्यवाद! हम लगातार नई फसलों के लिए एआई को प्रशिक्षित कर रहे हैं।",
    Punjabi: "ਸੁਝਾਅ ਲਈ ਧੰਨਵਾਦ! ਅਸੀਂ ਲਗਾਤਾਰ ਨਵੀਆਂ ਫਸਲਾਂ ਲਈ ਏਆਈ ਨੂੰ ਸਿਖਲਾਈ ਦੇ ਰਹੇ ਹਾਂ।",
    Marathi: "सुचनेबद्दल धन्यवाद! आम्ही सतत नवीन पिकांसाठी एआय प्रशिक्षित करत आहोत।",
    Telugu: "మీ సూచనకు ధన్యవాదాలు! మేము నిరంతరం కొత్త పంటల కోసం AIకి శిక్షణ ఇస్తున్నాము.",
    Bengali: "পরামর্শের জন্য ধন্যবাদ! আমরা ক্রমাগত নতুন ফসলের জন্য এআই প্রশিক্ষণ দিচ্ছি।",
  },
  seasonKharif: {
    English: "Kharif",
    Hindi: "खरीफ",
    Punjabi: "ਖਰੀਫ",
    Marathi: "खरीप",
    Telugu: "ఖరీఫ్",
    Bengali: "খরিফ",
  },
  seasonRabi: {
    English: "Rabi",
    Hindi: "रबी",
    Punjabi: "ਹਾੜੀ (ਰਬੀ)",
    Marathi: "रब्बी",
    Telugu: "రబీ",
    Bengali: "রবি",
  },
  seasonAnnual: {
    English: "Annual",
    Hindi: "वार्षिक",
    Punjabi: "ਸਾਲਾਨਾ",
    Marathi: "वार्षिक",
    Telugu: "వార్షిక",
    Bengali: "বার্ষিক",
  },
  seasonZaid: {
    English: "Zaid / All-Season",
    Hindi: "जायद / सदाबहार",
    Punjabi: "ਜ਼ੈਦ / ਸਦਾਬਹਾਰ",
    Marathi: "झैद / सदाबहार",
    Telugu: "జైద్ / ఏడాది పొడవునా",
    Bengali: "জায়দ / বারোমাসি",
  }
};

const STEP_LABELS = {
  1: {
    English: 'Language',
    Hindi: 'भाषा',
    Punjabi: 'ਭਾਸ਼ਾ',
    Marathi: 'भाषा',
    Telugu: 'భాष',
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
    Gujarati: 'પ્રોફાઇલ',
    Odia: 'ପ୍ରୋଫାଇଲ୍',
    Assamese: 'প্রোফাইল',
  }
};

export default function CropStep({ language, selectedCrops, onToggleCrop, onBack, onNext }: CropStepProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getLocal = (key: keyof typeof localT) => {
    return localT[key][language] || localT[key]['English'];
  };

  const getSeasonLocal = (season: 'Kharif' | 'Rabi' | 'Annual' | 'Zaid / All-Season') => {
    if (season === 'Kharif') return getLocal('seasonKharif');
    if (season === 'Rabi') return getLocal('seasonRabi');
    if (season === 'Annual') return getLocal('seasonAnnual');
    return getLocal('seasonZaid');
  };

  const getCropDisplayNames = (crop: typeof ALL_CROPS[0]) => {
    if (language === 'English') {
      return { primary: crop.name, sub: crop.id };
    }
    return { primary: crop.native, sub: crop.name };
  };

  const filteredCrops = ALL_CROPS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.native.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Onboarding progress bar */}
        <div className="h-2 w-full bg-slate-100">
          <div className="h-full bg-emerald-600 transition-all duration-500" style={{ width: '66.66%' }}></div>
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
                style={{ width: '50%' }}
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
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all bg-emerald-50 border-2 border-emerald-600 text-emerald-700 font-extrabold ring-4 ring-emerald-50">
                  2
                </div>
                <span className="text-[10px] font-extrabold mt-1.5 transition-colors uppercase tracking-wider text-emerald-700">
                  {STEP_LABELS[2][language] || STEP_LABELS[2]['English']}
                </span>
              </div>

              {/* Step 3: Profile */}
              <div className="flex flex-col items-center z-10 relative">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all bg-slate-50 border-2 border-slate-200 text-slate-400">
                  3
                </div>
                <span className="text-[10px] font-bold mt-1.5 transition-colors uppercase tracking-wider text-slate-400">
                  {STEP_LABELS[3][language] || STEP_LABELS[3]['English']}
                </span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
              {getLocal('step2of3')}
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {getLocal('whatAreYouGrowing')}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {getLocal('selectCropsDesc')}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder={getLocal('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 border-0 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 shadow-inner transition-all outline-none"
            />
          </div>

          {/* CROPS SELECTION GRID */}
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrops.includes(crop.id);
              const names = getCropDisplayNames(crop);
              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => onToggleCrop(crop.id)}
                  className={`relative rounded-2xl overflow-hidden border text-left transition-all active:scale-98 flex flex-col cursor-pointer ${
                    isSelected 
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Crop Photo Frame */}
                  <div className="h-28 sm:h-32 w-full relative text-left">
                    <img 
                      src={crop.image} 
                      alt={crop.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                    <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/80 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {getSeasonLocal(crop.season)}
                    </span>
                    
                    {isSelected && (
                      <div className="absolute top-2.5 left-2.5 p-1.5 bg-emerald-600 text-white rounded-xl shadow">
                        <Check className="h-4 w-4 stroke-[3px]" />
                      </div>
                    )}
                  </div>

                  {/* Crop Labels */}
                  <div className="p-3.5 space-y-0.5 text-left">
                    <h4 className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      {names.primary}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{names.sub}</p>
                  </div>
                </button>
              );
            })}

            {/* Request new placeholder card */}
            <div 
              className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 flex flex-col justify-center items-center text-center space-y-2 cursor-pointer transition-colors" 
              onClick={() => alert(getLocal('thanksSuggestion'))}
            >
              <div className="p-2 bg-slate-100 rounded-full text-slate-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">{getLocal('requestCrop')}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">{getLocal('haveOtherCrops')}</p>
            </div>
          </div>

          {/* Selected Count Indicator */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1 pt-2">
            <span>{getLocal('selectedCount')}</span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
              {selectedCrops.length} {getLocal('cropsSelected')}
            </span>
          </div>

          {/* NAVIGATION CONTROLS */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100 gap-4">
            <button
              onClick={onBack}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm py-3 px-5 rounded-2xl flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{getLocal('back')}</span>
            </button>
            
            <button
              onClick={() => {
                if (selectedCrops.length === 0) {
                  alert(getLocal('selectAtLeastOneCrop'));
                  return;
                }
                onNext();
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg hover:shadow-emerald-100 flex items-center space-x-2 transition-all active:scale-95 cursor-pointer"
            >
              <span>{getLocal('nextStep')}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
