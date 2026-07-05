import React, { useState, useMemo, useEffect } from 'react';
import { Landmark, TrendingUp, Calculator, WifiOff, RefreshCw, Check } from 'lucide-react';
import { MandiPrice, Language, Crop } from '../types';
import { t } from '../localization';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface MarketIntelligenceProps {
  language: Language;
  crops: Crop[];
  isOnline: boolean;
  theme?: 'light' | 'dark';
}

const COMMODITY_MANDIS: Record<string, MandiPrice[]> = {
  Wheat: [
    { mandiName: 'Khanna Mandi', commodity: 'Wheat (Grade A)', price: 2450, change: 5.2, volume: '12,500 Quintals', distance: '12 km away' },
    { mandiName: 'Indore Mandi', commodity: 'Wheat (Durum)', price: 2680, change: 8.4, volume: '8,400 Quintals', distance: '420 km away' },
    { mandiName: 'Karnal Galla Mandi', commodity: 'Wheat (Lokayt)', price: 2420, change: -1.2, volume: '15,200 Quintals', distance: '4 km away' },
    { mandiName: 'Bhatinda Mandi', commodity: 'Wheat (Kanak)', price: 2465, change: 2.1, volume: '9,100 Quintals', distance: '140 km away' }
  ],
  Rice: [
    { mandiName: 'Karnal Grain Market', commodity: 'Basmati Rice (1121)', price: 4450, change: 12.5, volume: '42,000 Quintals', distance: '6 km away' },
    { mandiName: 'Khanna Galla Mandi', commodity: 'Basmati Rice (Pusa)', price: 4320, change: 8.1, volume: '22,000 Quintals', distance: '12 km away' },
    { mandiName: 'Amritsar Market', commodity: 'Paddy (PR 126)', price: 2200, change: -2.4, volume: '85,000 Quintals', distance: '220 km away' },
    { mandiName: 'Gondal Yard', commodity: 'Rice (Rozana)', price: 3850, change: 1.8, volume: '5,300 Quintals', distance: '940 km away' }
  ],
  Cotton: [
    { mandiName: 'Rajkot Cotton Yard', commodity: 'Cotton (Shankar-6)', price: 7120, change: -4.5, volume: '18,500 Bales', distance: '810 km away' },
    { mandiName: 'Adoni Mandi', commodity: 'Cotton (Grade B)', price: 6850, change: 1.2, volume: '12,000 Bales', distance: '1,200 km away' },
    { mandiName: 'Indore Galla Market', commodity: 'Cotton (Desi)', price: 6950, change: 0.5, volume: '4,100 Bales', distance: '410 km away' }
  ],
  Mustard: [
    { mandiName: 'Jaipur APMC', commodity: 'Mustard (42% Oil)', price: 5650, change: 6.8, volume: '14,000 Quintals', distance: '280 km away' },
    { mandiName: 'Hisar Market', commodity: 'Mustard (Rabi Sec)', price: 5510, change: 3.2, volume: '8,200 Quintals', distance: '85 km away' },
    { mandiName: 'Alwar Yard', commodity: 'Mustard Seeds', price: 5580, change: -0.8, volume: '11,000 Quintals', distance: '190 km away' }
  ],
  Sugarcane: [
    { mandiName: 'Meerut Mandi', commodity: 'Sugarcane (Co-0238)', price: 385, change: 1.5, volume: '55,000 Quintals', distance: '45 km away' },
    { mandiName: 'Muzaffarnagar Mandi', commodity: 'Sugarcane (Co-86032)', price: 390, change: 2.2, volume: '80,000 Quintals', distance: '120 km away' },
    { mandiName: 'Kolhapur Mandi', commodity: 'Sugarcane (Heavy)', price: 375, change: -0.5, volume: '35,000 Quintals', distance: '860 km away' }
  ],
  Tomatoes: [
    { mandiName: 'Kolar Mandi', commodity: 'Tomato (Hybrid)', price: 1850, change: -12.4, volume: '15,000 Quintals', distance: '620 km away' },
    { mandiName: 'Pimpalgaon Mandi', commodity: 'Tomato (Local)', price: 1620, change: -8.5, volume: '22,000 Quintals', distance: '710 km away' },
    { mandiName: 'Azadpur Mandi', commodity: 'Tomato (Desi)', price: 2100, change: 15.2, volume: '30,000 Quintals', distance: '15 km away' }
  ]
};

const CROP_COLORS: Record<string, string> = {
  Rice: '#10b981',       // Emerald
  Wheat: '#f59e0b',      // Amber
  Cotton: '#3b82f6',     // Blue
  Mustard: '#ca8a04',    // Darker Yellow/Mustard
  Sugarcane: '#84cc16',   // Lime
  Tomatoes: '#ef4444'    // Red
};

const COMMODITY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Wheat (Grade A)': {
    English: 'Wheat (Grade A)',
    Hindi: 'गेहूं (श्रेणी ए)',
    Punjabi: 'ਕਣਕ (ਗ੍ਰੇਡ ਏ)',
    Marathi: 'गहू (ग्रेड ए)',
    Telugu: 'గోధుమ (గ్రేడ్ ఎ)',
    Bengali: 'গম (গ্রেড এ)'
  },
  'Wheat (Durum)': {
    English: 'Wheat (Durum)',
    Hindi: 'गेहूं (ड्यूरम)',
    Punjabi: 'ਕਣਕ (ਡਿਊਰਮ)',
    Marathi: 'गहू (ड्यूरम)',
    Telugu: 'గోధుమ (డ్యూరమ్)',
    Bengali: 'গম (ডিউরাম)'
  },
  'Wheat (Lokayt)': {
    English: 'Wheat (Lokayt)',
    Hindi: 'गेहूं (लोकायत)',
    Punjabi: 'ਕਣਕ (ਲੋਕਾਇਤ)',
    Marathi: 'गहू (लोकायत)',
    Telugu: 'గోధుమ (లోకాయత్)',
    Bengali: 'গম (লোকায়ত)'
  },
  'Wheat (Kanak)': {
    English: 'Wheat (Kanak)',
    Hindi: 'गेहूं (कनक)',
    Punjabi: 'ਕਣਕ',
    Marathi: 'गहू',
    Telugu: 'గోధుమ',
    Bengali: 'গম'
  },
  'Basmati Rice (1121)': {
    English: 'Basmati Rice (1121)',
    Hindi: 'बासमती धान (1121)',
    Punjabi: 'ਬਾਸਮਤੀ ਝੋਨਾ (1121)',
    Marathi: 'बासमती भात (1121)',
    Telugu: 'బాస్మతి వరి (1121)',
    Bengali: 'বাসমতি চাল (১১২১)'
  },
  'Basmati Rice (Pusa)': {
    English: 'Basmati Rice (Pusa)',
    Hindi: 'बासमती धान (पूसा)',
    Punjabi: 'ਬਾਸਮਤੀ ਝੋਨਾ (ਪੂਸਾ)',
    Marathi: 'बासमती भात (पुसा)',
    Telugu: 'బాస్మతి వరి (పూసా)',
    Bengali: 'বাসমতি চাল (পুসা)'
  },
  'Paddy (PR 126)': {
    English: 'Paddy (PR 126)',
    Hindi: 'धान (पीआर 126)',
    Punjabi: 'ਝੋਨਾ (ਪੀਆਰ 126)',
    Marathi: 'भात (पीआर १२६)',
    Telugu: 'వరి (పిఆర్ 126)',
    Bengali: 'ধান (পিআর ১২৬)'
  },
  'Rice (Rozana)': {
    English: 'Rice (Rozana)',
    Hindi: 'चावल (रोजाना)',
    Punjabi: 'ਚੌਲ (ਰੋਜ਼ਾਨਾ)',
    Marathi: 'तांदूळ (रोजाना)',
    Telugu: 'बिయ్యం (రోజువారీ)',
    Bengali: 'চাল (রোজানা)'
  },
  'Cotton (Shankar-6)': {
    English: 'Cotton (Shankar-6)',
    Hindi: 'कपास (शंकर-६)',
    Punjabi: 'ਕਪਾਹ (ਸ਼ੰਕਰ-੬)',
    Marathi: 'कापूस (शंकर-६)',
    Telugu: 'పత్తి (శంకర్-6)',
    Bengali: 'তুলা (শঙ্কর-৬)'
  },
  'Cotton (Grade B)': {
    English: 'Cotton (Grade B)',
    Hindi: 'कपास (श्रेणी बी)',
    Punjabi: 'ਕਪਾਹ (ਗ੍ਰੇਡ ਬੀ)',
    Marathi: 'कापूस (ग्रेड बी)',
    Telugu: 'పత్తి (గ్రేਡ బి)',
    Bengali: 'তুলা (গ্রেড বি)'
  },
  'Cotton (Desi)': {
    English: 'Cotton (Desi)',
    Hindi: 'कपास (देशी)',
    Punjabi: 'ਕਪਾਹ (ਦੇਸੀ)',
    Marathi: 'कापूस (देशी)',
    Telugu: 'పత్తి (దేశী)',
    Bengali: 'তুলা (দেশি)'
  },
  'Mustard (42% Oil)': {
    English: 'Mustard (42% Oil)',
    Hindi: 'सरसों (42% तेल)',
    Punjabi: 'ਸਰ੍ਹੋਂ (42% ਤੇਲ)',
    Marathi: 'मोहरी (42% तेल)',
    Telugu: 'ఆవాలు (42% నూనె)',
    Bengali: 'সরিষা (৪২% তেল)'
  },
  'Mustard (Rabi Sec)': {
    English: 'Mustard (Rabi Sec)',
    Hindi: 'सरसों (रबी सीजन)',
    Punjabi: 'ਸਰ੍ਹੋਂ (ਰਬੀ ਸੀਜ਼ਨ)',
    Marathi: 'मोहरी (रब्बी हंगाम)',
    Telugu: 'ఆవాలు (రబీ పంట)',
    Bengali: 'সরিষা (রবি মরশুম)'
  },
  'Mustard Seeds': {
    English: 'Mustard Seeds',
    Hindi: 'सरसों के बीज',
    Punjabi: 'ਸਰ੍ਹੋਂ ਦੇ ਬੀਜ',
    Marathi: 'मोहरी दाणे',
    Telugu: 'ఆవాల గिంజలు',
    Bengali: 'সরিষা বীজ'
  },
  'Sugarcane (Co-0238)': {
    English: 'Sugarcane (Co-0238)',
    Hindi: 'गन्ना (Co-0238)',
    Punjabi: 'ਗੰਨਾ (Co-0238)',
    Marathi: 'ऊस (Co-0238)',
    Telugu: 'చెరకు (Co-0238)',
    Bengali: 'আখ (Co-0238)'
  },
  'Sugarcane (Co-86032)': {
    English: 'Sugarcane (Co-86032)',
    Hindi: 'गन्ना (Co-86032)',
    Punjabi: 'ਗੰਨਾ (Co-86032)',
    Marathi: 'ऊस (Co-86032)',
    Telugu: 'చెరకు (Co-86032)',
    Bengali: 'আখ (Co-86032)'
  },
  'Sugarcane (Heavy)': {
    English: 'Sugarcane (Heavy)',
    Hindi: 'गन्ना (भारी)',
    Punjabi: 'ਗੰਨਾ (ਭਾਰੀ)',
    Marathi: 'ऊस (जड)',
    Telugu: 'చెరకు (హెవీ)',
    Bengali: 'আখ (ভারী)'
  },
  'Tomato (Hybrid)': {
    English: 'Tomato (Hybrid)',
    Hindi: 'टमाटर (हाइब्रिड)',
    Punjabi: 'ਟਮਾਟਰ (ਹਾਈਬ੍ਰਿਡ)',
    Marathi: 'टोमॅटो (हायब्रिड)',
    Telugu: 'టమోటా (హైబ్రిడ్)',
    Bengali: 'টমেটো (হাইব্রিড)'
  },
  'Tomato (Local)': {
    English: 'Tomato (Local)',
    Hindi: 'टमाटर (स्थानीय)',
    Punjabi: 'ਟਮਾਟਰ (ਸਥਾਨਕ)',
    Marathi: 'टोमॅटो (स्थानिक)',
    Telugu: 'టమోటా (లోకల్)',
    Bengali: 'টমেটো (স্থানীয়)'
  },
  'Tomato (Desi)': {
    English: 'Tomato (Desi)',
    Hindi: 'टमाटर (देशी)',
    Punjabi: 'ਟਮਾਟਰ (ਦੇਸੀ)',
    Marathi: 'टोमॅटो (देशी)',
    Telugu: 'టమోటా (దేశీ)',
    Bengali: 'টমেটো (দেশি)'
  }
};

const MANDI_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Khanna Mandi': {
    English: 'Khanna Mandi',
    Hindi: 'खन्ना मंडी',
    Punjabi: 'ਖੰਨਾ ਮੰਡੀ',
    Marathi: 'खन्ना बाजार',
    Telugu: 'ఖన్నా మార్కెట్',
    Bengali: 'খন্না মান্ডি'
  },
  'Indore Mandi': {
    English: 'Indore Mandi',
    Hindi: 'इंदौर मंडी',
    Punjabi: 'ਇੰਦੌਰ ਮੰਡੀ',
    Marathi: 'इंदूर बाजार',
    Telugu: 'ఇండోర్ మార్కెట్',
    Bengali: 'ইন্দোর মান্ডি'
  },
  'Karnal Galla Mandi': {
    English: 'Karnal Galla Mandi',
    Hindi: 'करनाल गल्ला मंडी',
    Punjabi: 'ਕਰਨਾਲ ਗੱਲਾ ਮੰਡੀ',
    Marathi: 'कर्नाल धान्य बाजार',
    Telugu: 'కర్నాల్ గల్లా మార్కెట్',
    Bengali: 'করনাল গাল্লা মান্ডি'
  },
  'Bhatinda Mandi': {
    English: 'Bhatinda Mandi',
    Hindi: 'बठिंडा मंडी',
    Punjabi: 'ਬਠਿੰਡਾ ਮੰਡੀ',
    Marathi: 'बठिंडा बाजार',
    Telugu: 'బటిండా మార్కెట్',
    Bengali: 'ভাটিণ্ডਾ মান্ডি'
  },
  'Karnal Grain Market': {
    English: 'Karnal Grain Market',
    Hindi: 'करनाल अनाज मंडी',
    Punjabi: 'ਕਰਨਾਲ ਅਨਾਜ ਮੰਡੀ',
    Marathi: 'कर्नाल धान्य बाजार',
    Telugu: 'కర్నాల్ ధాన్య మార్కెట్',
    Bengali: 'করনাল শস্য বাজার'
  },
  'Khanna Galla Mandi': {
    English: 'Khanna Galla Mandi',
    Hindi: 'खन्ना गल्ला मंडी',
    Punjabi: 'ਖੰਨਾ ਗੱਲਾ ਮੰਡੀ',
    Marathi: 'खन्ना धान्य बाजार',
    Telugu: 'ఖన్నా గల్లా మార్కెట్',
    Bengali: 'খন্না গাল্লা ਮੰਡੀ'
  },
  'Amritsar Market': {
    English: 'Amritsar Market',
    Hindi: 'अमृतसर मंडी',
    Punjabi: 'ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀ',
    Marathi: 'अमृतसर बाजार',
    Telugu: 'అమృతసర్ మార్కెట్',
    Bengali: 'অমৃতসর বাজার'
  },
  'Gondal Yard': {
    English: 'Gondal Yard',
    Hindi: 'गोंडल यार्ड',
    Punjabi: 'ਗੋਂਡਲ ਯਾਰਡ',
    Marathi: 'गोंडल यार्ड',
    Telugu: 'గోండల్ యార్డ్',
    Bengali: 'গোন্ডাল ইয়ার্ড'
  },
  'Rajkot Cotton Yard': {
    English: 'Rajkot Cotton Yard',
    Hindi: 'राजकोट कपास मंडी',
    Punjabi: 'ਰਾਜਕੋਟ ਕਪਾਹ ਯਾਰਡ',
    Marathi: 'राजकोट कापूस बाजार',
    Telugu: 'రాజ్‌కోట్ పత్తి మార్కెట్',
    Bengali: 'রাজকোট তুলা ইয়ার্ড'
  },
  'Adoni Mandi': {
    English: 'Adoni Mandi',
    Hindi: 'अदोनी मंडी',
    Punjabi: 'ਅਦੋਨੀ ਮੰਡੀ',
    Marathi: 'अदनी बाजार',
    Telugu: 'అదోని మార్కెట్',
    Bengali: 'আদোনি মান্ডি'
  },
  'Indore Galla Market': {
    English: 'Indore Galla Market',
    Hindi: 'इंदौर गल्ला मंडी',
    Punjabi: 'ਇੰਦੌਰ ਗੱਲਾ ਮੰਡੀ',
    Marathi: 'इंदूर धान्य बाजार',
    Telugu: 'ఇండోర్ గల్లా మార్కెట్',
    Bengali: 'ইন্দোর গাল্লা বাজার'
  },
  'Jaipur APMC': {
    English: 'Jaipur APMC',
    Hindi: 'जयपुर एपीएमसी',
    Punjabi: 'ਜੈਪੁਰ ਏਪੀਐਮसी',
    Marathi: 'जयपूर एपीएमसी',
    Telugu: 'జైపూర్ APMC',
    Bengali: 'জয়পুর এপিএমসি'
  },
  'Hisar Market': {
    English: 'Hisar Market',
    Hindi: 'हिसार मंडी',
    Punjabi: 'ਹਿਸਾਰ ਮੰਡੀ',
    Marathi: 'हिसार बाजार',
    Telugu: 'హిసార్ మార్కెట్',
    Bengali: 'হিসার বাজার'
  },
  'Alwar Yard': {
    English: 'Alwar Yard',
    Hindi: 'अलवर यार्ड',
    Punjabi: 'ਅਲਵਰ ਯਾਰਡ',
    Marathi: 'अलवर यार्ड',
    Telugu: 'అల్వార్ యార్డ్',
    Bengali: 'আলওয়ার ইয়ার্ড'
  },
  'Meerut Mandi': {
    English: 'Meerut Mandi',
    Hindi: 'मेरठ मंडी',
    Punjabi: 'ਮੇਰਠ ਮੰਡੀ',
    Marathi: 'मेरठ बाजार',
    Telugu: 'మీరట్ మార్కెట్',
    Bengali: 'মিরাট মান্ডি'
  },
  'Muzaffarnagar Mandi': {
    English: 'Muzaffarnagar Mandi',
    Hindi: 'मुजफ्फरनगर मंडी',
    Punjabi: 'ਮੁਜ਼ੱਫਰਨਗਰ ਮੰਡੀ',
    Marathi: 'मुझफ्फरनगर बाजार',
    Telugu: 'ముజఫర్‌నగర్ మార్కెట్',
    Bengali: 'মুজাফফরনগর মান্ডি'
  },
  'Kolhapur Mandi': {
    English: 'Kolhapur Mandi',
    Hindi: 'कोल्हापुर मंडी',
    Punjabi: 'ਕੋਲਹਾਪੁਰ ਮੰਡੀ',
    Marathi: 'कोल्हापूर बाजार',
    Telugu: 'కొల్హాపూర్ మార్కెట్',
    Bengali: 'কোলহাপুর মান্ডি'
  },
  'Kolar Mandi': {
    English: 'Kolar Mandi',
    Hindi: 'कोलार मंडी',
    Punjabi: 'ਕੋਲਾਰ ਮੰਡੀ',
    Marathi: 'कोलार बाजार',
    Telugu: 'కోలార్ మార్కెట్',
    Bengali: 'কোলার মান্ডি'
  },
  'Pimpalgaon Mandi': {
    English: 'Pimpalgaon Mandi',
    Hindi: 'पिंपलगांव मंडी',
    Punjabi: 'ਪਿੰਪਲਗਾਓਂ ਮੰਡੀ',
    Marathi: 'पिंपळगाव बाजार',
    Telugu: 'పింపల్‌గావ్ మార్కెట్',
    Bengali: 'পিম্পলগাঁও মান্ডি'
  },
  'Azadpur Mandi': {
    English: 'Azadpur Mandi',
    Hindi: 'आजादपुर मंडी',
    Punjabi: 'ਆਜ਼ਾਦਪੁਰ ਮੰਡੀ',
    Marathi: 'आझादपूर बाजार',
    Telugu: 'ఆజాద్‌పూర్ మార్కెట్',
    Bengali: 'আজাদপুর মান্ডি'
  }
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  theme: 'light' | 'dark';
  lang: Language;
  getLocalizedCommodityLabel: (comm: string) => string;
}

const CustomTooltip = ({ active, payload, label, theme, lang, getLocalizedCommodityLabel }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-xl space-y-1.5 text-left text-xs transition-colors duration-200">
        <p className="font-extrabold text-slate-800 dark:text-slate-200">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const cropName = entry.name || entry.dataKey;
            const localizedCrop = getLocalizedCommodityLabel(cropName);
            return (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.stroke }} />
                <span className="font-semibold text-slate-500 dark:text-slate-400">{localizedCrop}:</span>
                <span className="font-extrabold text-slate-950 dark:text-slate-100">
                  ₹{entry.value.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  /{lang === 'Hindi' ? 'क्विंटल' : lang === 'Punjabi' ? 'ਕੁਇੰਟਲ' : lang === 'Marathi' ? 'क्विंटल' : lang === 'Telugu' ? 'క్వింటాల్‌కు' : lang === 'Bengali' ? 'প্রতি কুইন্টাল' : 'quintal'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function MarketIntelligence({ language, crops, isOnline, theme = 'light' }: MarketIntelligenceProps) {
  const lang = language;

  const validCropsList = useMemo(() => {
    return crops.filter(c => ['Rice', 'Wheat', 'Cotton', 'Mustard', 'Sugarcane', 'Tomatoes'].includes(c));
  }, [crops]);

  const [selectedComm, setSelectedComm] = useState<Crop>(() => {
    if (validCropsList.length > 0) {
      return validCropsList[0];
    }
    return 'Rice';
  });

  const [compareMyCrops, setCompareMyCrops] = useState(false);
  
  const [lastSync, setLastSync] = useState(() => localStorage.getItem('fasal_last_sync') || new Date().toLocaleString());
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncPrices = () => {
    if (!isOnline) return;
    setSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const freshTime = now.toLocaleString();
      localStorage.setItem('fasal_last_sync', freshTime);
      setLastSync(freshTime);
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 4000);
    }, 1200);
  };

  // Profitability Calculator States
  const [acres, setAcres] = useState<number>(5);
  const [expectedYield, setExpectedYield] = useState<number>(22); // quintals per acre
  const [fertilizerCost, setFertilizerCost] = useState<number>(3500); // rs per acre
  const [laborCost, setLaborCost] = useState<number>(4500); // rs per acre
  const [seedCost, setSeedCost] = useState<number>(2000); // rs per acre

  // Update expected yield & cost defaults when selectedComm changes to make the calculator smart
  useEffect(() => {
    if (selectedComm === 'Sugarcane') {
      setExpectedYield(350);
      setSeedCost(8000);
      setFertilizerCost(6000);
      setLaborCost(12000);
    } else if (selectedComm === 'Tomatoes') {
      setExpectedYield(80);
      setSeedCost(4000);
      setFertilizerCost(5000);
      setLaborCost(8000);
    } else if (selectedComm === 'Wheat') {
      setExpectedYield(20);
      setSeedCost(1800);
      setFertilizerCost(3000);
      setLaborCost(4000);
    } else if (selectedComm === 'Cotton') {
      setExpectedYield(12);
      setSeedCost(2200);
      setFertilizerCost(4500);
      setLaborCost(5500);
    } else if (selectedComm === 'Mustard') {
      setExpectedYield(8);
      setSeedCost(1200);
      setFertilizerCost(2500);
      setLaborCost(3500);
    } else { // Rice
      setExpectedYield(22);
      setSeedCost(2000);
      setFertilizerCost(3500);
      setLaborCost(4500);
    }
  }, [selectedComm]);

  const mandiRates = COMMODITY_MANDIS[selectedComm] || COMMODITY_MANDIS['Rice'];
  const topMandi = mandiRates[0];

  // Calculations
  const totalProductionWeight = acres * expectedYield; // in quintals
  const pricePerQuintal = topMandi ? topMandi.price : 4000;
  const grossRevenue = totalProductionWeight * pricePerQuintal;
  
  const costPerAcre = fertilizerCost + laborCost + seedCost;
  const totalCost = acres * costPerAcre;
  const netProfit = grossRevenue - totalCost;
  const profitMarginPercent = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : "0";

  // Localized commodity name helper
  const getLocalizedCommodityLabel = (comm: string): string => {
    const map: Record<string, Partial<Record<Language, string>>> = {
      'Rice': { English: 'Basmati Rice', Hindi: 'बासमती धान', Punjabi: 'ਬਾਸਮਤੀ ਝੋਨਾ', Marathi: 'तांदूळ (भात)', Telugu: 'బాస్మతి వరి', Bengali: 'বাসমতি চাল' },
      'Wheat': { English: 'Wheat', Hindi: 'गेहूं', Punjabi: 'ਕਣਕ', Marathi: 'गहू', Telugu: 'గోధుమ', Bengali: 'গম' },
      'Cotton': { English: 'Cotton', Hindi: 'कपास', Punjabi: 'ਕਪਾਹ', Marathi: 'कापूस', Telugu: 'పత్తి', Bengali: 'তুলা' },
      'Mustard': { English: 'Mustard', Hindi: 'सरसों', Punjabi: 'ਸਰ੍ਹੋਂ', Marathi: 'मोहरी', Telugu: 'ఆవాలు', Bengali: 'সরিষা' },
      'Sugarcane': { English: 'Sugarcane', Hindi: 'गन्ना', Punjabi: 'ਗੰਨਾ', Marathi: 'ऊस', Telugu: 'చెరకు', Bengali: 'আখ' },
      'Tomatoes': { English: 'Tomatoes', Hindi: 'टमाटर', Punjabi: 'ਟਮਾਟਰ', Marathi: 'टोमॅटो', Telugu: 'టమోటాలు', Bengali: 'টমেটো' }
    };
    return map[comm]?.[lang] || comm;
  };

  const trendData = useMemo(() => {
    const data = [];
    const basePrices: Record<string, number> = {
      Wheat: 2450,
      Rice: 4450,
      Cotton: 7120,
      Mustard: 5650,
      Sugarcane: 385,
      Tomatoes: 1850
    };

    const trends: Record<string, number[]> = {
      Wheat: [0.95, 0.96, 0.95, 0.97, 0.96, 0.98, 0.99, 1.00, 0.99, 0.98, 0.99, 1.01, 1.02, 1.01, 1.00, 1.01, 1.02, 1.03, 1.04, 1.03, 1.02, 1.03, 1.04, 1.05, 1.04, 1.03, 1.04, 1.05, 1.06, 1.05],
      Rice: [0.92, 0.93, 0.94, 0.93, 0.95, 0.96, 0.95, 0.96, 0.97, 0.98, 0.97, 0.98, 0.99, 1.00, 1.01, 1.02, 1.01, 1.03, 1.04, 1.05, 1.06, 1.05, 1.07, 1.08, 1.09, 1.10, 1.11, 1.12, 1.13, 1.125],
      Cotton: [1.05, 1.04, 1.03, 1.04, 1.02, 1.01, 1.00, 0.99, 0.98, 0.97, 0.96, 0.97, 0.96, 0.95, 0.96, 0.97, 0.98, 0.97, 0.99, 1.00, 1.01, 1.00, 0.99, 0.98, 0.97, 0.96, 0.95, 0.96, 0.95, 0.955],
      Mustard: [0.94, 0.94, 0.95, 0.96, 0.95, 0.96, 0.97, 0.98, 0.99, 1.00, 0.99, 1.00, 1.01, 1.02, 1.01, 1.02, 1.03, 1.02, 1.03, 1.04, 1.05, 1.04, 1.05, 1.06, 1.07, 1.06, 1.07, 1.08, 1.07, 1.068],
      Sugarcane: [0.98, 0.98, 0.99, 0.99, 0.99, 1.00, 1.00, 1.00, 1.01, 1.01, 1.01, 1.02, 1.02, 1.02, 1.01, 1.01, 1.02, 1.02, 1.03, 1.03, 1.03, 1.02, 1.02, 1.02, 1.01, 1.01, 1.01, 1.02, 1.02, 1.015],
      Tomatoes: [1.12, 1.10, 1.08, 1.05, 1.03, 1.00, 0.98, 0.95, 0.92, 0.90, 0.88, 0.85, 0.82, 0.84, 0.87, 0.90, 0.93, 0.96, 0.99, 1.02, 1.05, 1.08, 1.12, 1.15, 1.10, 1.06, 1.02, 0.98, 0.94, 0.876]
    };

    const startDate = new Date('2026-06-05');
    const list = [];

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toLocaleDateString(lang === 'English' ? 'en-US' : 'hi-IN', {
        day: '2-digit',
        month: 'short'
      });

      const point: any = {
        name: dateStr
      };

      Object.keys(basePrices).forEach((crop) => {
        const multiplier = trends[crop][i] || 1.0;
        point[crop] = Math.round(basePrices[crop] * multiplier);
      });

      list.push(point);
    }
    return list;
  }, [lang]);

  // Localized details helper
  const getLocalizedMandiDetails = (commName: string, distanceStr: string): string => {
    // Distance translation
    let dist = distanceStr;
    if (lang !== 'English') {
      const match = distanceStr.match(/(\d+)\s*km\s*away/);
      if (match) {
        const km = match[1];
        dist = {
          Hindi: `${km} किमी दूर`,
          Punjabi: `${km} ਕਿਲੋਮੀਟਰ ਦੂਰ`,
          Marathi: `${km} किमी लांब`,
          Telugu: `${km} కిమీ దూరంలో`,
          Bengali: `${km} কিমি দূরে`,
          English: `${km} km away`
        }[lang] || distanceStr;
      }
    }
    
    // Commodity translation prefix/suffix
    let cName = commName;
    if (lang !== 'English') {
      cName = cName
        .replace('Wheat (Grade A)', lang === 'Hindi' ? 'गेहूं (श्रेणी ए)' : lang === 'Punjabi' ? 'ਕਣਕ (ਗ੍ਰੇਡ ਏ)' : lang === 'Marathi' ? 'गहू (ग्रेड ए)' : lang === 'Telugu' ? 'గోధుమ (గ్రేడ్ ఎ)' : lang === 'Bengali' ? 'গম (গ্রেড এ)' : 'Wheat (Grade A)')
        .replace('Wheat (Durum)', lang === 'Hindi' ? 'गेहूं (ड्यूरम)' : lang === 'Punjabi' ? 'ਕਣਕ (ਡਿਊਰਮ)' : lang === 'Marathi' ? 'गहू (ड्यूरम)' : lang === 'Telugu' ? 'గోధుమ (డ్యూరమ్)' : lang === 'Bengali' ? 'গম (ডিউরাম)' : 'Wheat (Durum)')
        .replace('Wheat (Lokayt)', lang === 'Hindi' ? 'गेहूं (लोकायत)' : lang === 'Punjabi' ? 'ਕਣਕ (ਲੋਕਾਇਤ)' : lang === 'Marathi' ? 'गहू (लोकायत)' : lang === 'Telugu' ? 'గోధుమ (లోకాయత్)' : lang === 'Bengali' ? 'গম (লোকায়ত)' : 'Wheat (Lokayt)')
        .replace('Wheat (Kanak)', lang === 'Hindi' ? 'गेहूं (कनक)' : lang === 'Punjabi' ? 'ਕਣਕ' : lang === 'Marathi' ? 'गहू' : lang === 'Telugu' ? 'గోధుమ' : lang === 'Bengali' ? 'গম' : 'Wheat')
        .replace('Basmati Rice (1121)', lang === 'Hindi' ? 'बासमती धान (1121)' : lang === 'Punjabi' ? 'ਬਾਸਮਤੀ ਝੋਨਾ (1121)' : lang === 'Marathi' ? 'बासमती भात (1121)' : lang === 'Telugu' ? 'బాస్మతి వరి (1121)' : lang === 'Bengali' ? 'বাসমতি চাল (১১২১)' : 'Basmati Rice (1121)')
        .replace('Basmati Rice (Pusa)', lang === 'Hindi' ? 'बासमती धान (पूसा)' : lang === 'Punjabi' ? 'ਬਾਸਮਤੀ ਝੋਨਾ (ਪੂਸਾ)' : lang === 'Marathi' ? 'बासमती भात (पुसा)' : lang === 'Telugu' ? 'బాస్మతి వరి (పూసా)' : lang === 'Bengali' ? 'বাসমতি চাল (পুসা)' : 'Basmati Rice (Pusa)')
        .replace('Paddy (PR 126)', lang === 'Hindi' ? 'धान (पीआर 126)' : lang === 'Punjabi' ? 'ਝੋਨਾ (ਪੀਆਰ 126)' : lang === 'Marathi' ? 'भात (पीआर १२६)' : lang === 'Telugu' ? 'వరి (పిఆర్ 126)' : lang === 'Bengali' ? 'ধান (পিআর ১২৬)' : 'Paddy (PR 126)')
        .replace('Rice (Rozana)', lang === 'Hindi' ? 'चावल (रोजाना)' : lang === 'Punjabi' ? 'ਚੌਲ (ਰੋਜ਼ਾਨਾ)' : lang === 'Marathi' ? 'तांदूळ (रोजाना)' : lang === 'Telugu' ? 'బియ్యం (రోజువారీ)' : lang === 'Bengali' ? 'চাল (রোজানা)' : 'Rice (Rozana)')
        .replace('Cotton (Shankar-6)', lang === 'Hindi' ? 'कपास (शंकर-६)' : lang === 'Punjabi' ? 'ਕਪਾਹ (ਸ਼ੰਕਰ-੬)' : lang === 'Marathi' ? 'कापूस (शंकर-६)' : lang === 'Telugu' ? 'పత్తి (శంకర్-6)' : lang === 'Bengali' ? 'তুলা (শঙ্কর-৬)' : 'Cotton (Shankar-6)');
    }
    
    return `${cName} • ${dist}`;
  };

  const localizedMandiName = (mName: string): string => {
    if (lang === 'English') return mName;
    const mandiTranslations: Record<string, Record<string, string>> = {
      'Khanna Mandi': {
        Hindi: 'खन्ना मंडी',
        Punjabi: 'ਖੰਨਾ ਮੰਡੀ',
        Marathi: 'खन्ना बाजार',
        Telugu: 'ఖన్నా మార్కెట్',
        Bengali: 'খন্না মান্ডি'
      },
      'Indore Mandi': {
        Hindi: 'इंदौर मंडी',
        Punjabi: 'ਇੰਦੌਰ ਮੰਡੀ',
        Marathi: 'इंदूर बाजार',
        Telugu: 'ఇండోర్ మార్కెట్',
        Bengali: 'ইন্দোর মান্ডি'
      },
      'Karnal Galla Mandi': {
        Hindi: 'करनाल गल्ला मंडी',
        Punjabi: 'ਕਰਨਾਲ ਗੱਲਾ ਮੰਡੀ',
        Marathi: 'कर्नाल धान्य बाजार',
        Telugu: 'కర్నాల్ గల్లా మార్కెట్',
        Bengali: 'করনাল গাল্লা মান্ডি'
      },
      'Bhatinda Mandi': {
        Hindi: 'बठिंडा मंडी',
        Punjabi: 'ਬਠਿੰਡਾ ਮੰਡੀ',
        Marathi: 'बठिंडा बाजार',
        Telugu: 'బటిండా మార్కెట్',
        Bengali: 'ভাটিণ্ডা মান্ডি'
      },
      'Karnal Grain Market': {
        Hindi: 'करनाल अनाज मंडी',
        Punjabi: 'ਕਰਨਾਲ ਅਨਾਜ ਮੰਡੀ',
        Marathi: 'कर्नाल धान्य बाजार',
        Telugu: 'కర్నాల్ ధాన్య మార్కెట్',
        Bengali: 'করনাল শস্য বাজার'
      },
      'Khanna Galla Mandi': {
        Hindi: 'खन्ना गल्ला मंडी',
        Punjabi: 'ਖੰਨਾ ਗੱਲਾ ਮੰਡੀ',
        Marathi: 'खन्ना धान्य बाजार',
        Telugu: 'ఖన్నా గల్లా మార్కెట్',
        Bengali: 'খন্না গাল্লা মান্ডি'
      },
      'Amritsar Market': {
        Hindi: 'अमृतसर मंडी',
        Punjabi: 'ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀ',
        Marathi: 'अमृतसर बाजार',
        Telugu: 'అమృతசர் మార్కెట్',
        Bengali: 'অমৃতসর বাজার'
      },
      'Gondal Yard': {
        Hindi: 'गोंडल यार्ड',
        Punjabi: 'ਗੋਂਡਲ ਯਾਰਡ',
        Marathi: 'गोंडल यार्ड',
        Telugu: 'గోండల్ యార్డ్',
        Bengali: 'গোন্ডাল ইয়ার্ড'
      },
      'Rajkot Cotton Yard': {
        Hindi: 'राजकोट कपास मंडी',
        Punjabi: 'ਰਾਜਕੋਟ ਕਪਾਹ ਯਾਰਡ',
        Marathi: 'राजकोट कापूस बाजार',
        Telugu: 'రాజ్‌కోట్ పత్తి మార్కెట్',
        Bengali: 'রাজকোট তুলা ইয়ার্ড'
      },
      'Adoni Mandi': {
        Hindi: 'अदोनी मंडी',
        Punjabi: 'ਅਦੋਨੀ ਮੰਡੀ',
        Marathi: 'अदोनी बाजार',
        Telugu: 'అదోని మార్కెట్',
        Bengali: 'আদোনি মান্ডি'
      },
      'Indore Galla Market': {
        Hindi: 'इंदौर गल्ला मंडी',
        Punjabi: 'ਇੰਦੌਰ ਗੱਲਾ ਮੰਡੀ',
        Marathi: 'इंदूर धान्य बाजार',
        Telugu: 'ఇండోర్ గల్లా మార్కెట్',
        Bengali: 'ইন্দোর গাল্লা বাজার'
      },
      'Jaipur APMC': {
        Hindi: 'जयपुर एपीएमसी',
        Punjabi: 'ਜੈਪੁਰ ਏਪੀਐਮਸੀ',
        Marathi: 'जयपूर एपीएमसी',
        Telugu: 'జైపూర్ APMC',
        Bengali: 'জয়পুর এপিএমসি'
      },
      'Hisar Market': {
        Hindi: 'हिसार मंडी',
        Punjabi: 'ਹਿਸਾਰ ਮੰਡੀ',
        Marathi: 'हिसार बाजार',
        Telugu: 'హిసార్ మార్కెట్',
        Bengali: 'হিসার বাজার'
      },
      'Alwar Yard': {
        Hindi: 'अलवर यार्ड',
        Punjabi: 'ਅਲਵਰ ਯਾਰਡ',
        Marathi: 'अलवर यार्ड',
        Telugu: 'అల్వార్ యార్డ్',
        Bengali: 'আলওয়ার ইয়ার্ড'
      },
      'Meerut Mandi': {
        Hindi: 'मेरठ मंडी',
        Punjabi: 'ਮੇਰਠ ਮੰਡੀ',
        Marathi: 'मेरठ बाजार',
        Telugu: 'मीరట్ మార్కెట్',
        Bengali: 'মিরাট মান্ডি'
      },
      'Muzaffarnagar Mandi': {
        Hindi: 'मुजफ्फरनगर मंडी',
        Punjabi: 'ਮੁਜ਼ੱਫਰਨਗਰ ਮੰਡੀ',
        Marathi: 'मुझफ्फरनगर बाजार',
        Telugu: 'ముజఫర్‌నగర్ మార్కెట్',
        Bengali: 'মুজাফফরনগর মান্ডি'
      },
      'Kolhapur Mandi': {
        Hindi: 'कोल्हापुर मंडी',
        Punjabi: 'ਕੋਲਹਾਪੁਰ ਮੰਡੀ',
        Marathi: 'कोल्हापूर बाजार',
        Telugu: 'కొల్హాపూర్ మార్కెట్',
        Bengali: 'কোলহাপুর মান্ডি'
      },
      'Kolar Mandi': {
        Hindi: 'कोलार मंडी',
        Punjabi: 'ਕੋਲਾਰ ਮੰਡੀ',
        Marathi: 'कोलार बाजार',
        Telugu: 'కోలార్ మార్కెట్',
        Bengali: 'কোলার মান্ডি'
      },
      'Pimpalgaon Mandi': {
        Hindi: 'पिंपलगांव मंडी',
        Punjabi: 'ਪਿੰਪਲਗਾਓਂ ਮੰਡੀ',
        Marathi: 'पिंपळगाव बाजार',
        Telugu: 'पिంపల్‌గావ్ మార్కెట్',
        Bengali: 'পিম্পলগাঁও মান্ডি'
      },
      'Azadpur Mandi': {
        Hindi: 'आजादपुर मंडी',
        Punjabi: 'ਆਜ਼ਾਦਪੁਰ ਮੰਡੀ',
        Marathi: 'आझादपूर बाजार',
        Telugu: 'ఆజాద్‌పూర్ మార్కెట్',
        Bengali: 'আজাদপুর মান্ডি'
      }
    };
    return mandiTranslations[mName]?.[lang] || mName;
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-sans max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header with offline/online cache synchronization panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 transition-colors duration-200">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 tracking-tight">
            {t('marketIntelMandi', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium text-left">
            {t('marketIntelDesc', lang)}
          </p>
        </div>

        {/* Caching/Network status bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isOnline ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 rounded-2xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{t('liveIndex', lang)} (Last: {lastSync})</span>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 rounded-2xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 animate-pulse">
              <WifiOff className="h-4 w-4 text-amber-600" />
              <span>{t('offlineCache', lang)} (Synced: {lastSync})</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleSyncPrices}
            disabled={!isOnline || syncing}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center space-x-1.5 border transition-all cursor-pointer select-none ${
              !isOnline 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-750 cursor-not-allowed'
                : syncing
                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-250 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-sm'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{syncing ? t('syncing', lang) : t('syncPrices', lang)}</span>
          </button>
        </div>
      </div>

      {syncSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{t('syncSuccessPrices', lang)}</span>
        </div>
      )}

      {/* Commodity Selector tab group */}
      <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto whitespace-nowrap transition-colors duration-200">
        {(['Rice', 'Wheat', 'Cotton', 'Mustard', 'Sugarcane', 'Tomatoes'] as const).map((comm) => {
          const isUserCrop = crops.includes(comm);
          return (
            <button
              key={comm}
              type="button"
              onClick={() => setSelectedComm(comm)}
              className={`py-2 px-6 rounded-xl font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
                selectedComm === comm
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {getLocalizedCommodityLabel(comm)}
                {isUserCrop && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedComm === comm ? 'bg-white' : 'bg-emerald-500'}`} title="My Crop" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: MANDIS RATES & 30-DAY RECHARTS CHART */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Nearby Mandi Rates table list */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 transition-colors duration-200">
            <h3 className="font-display font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-emerald-600" />
              <span>{t('mandiPriceTrends', lang)}</span>
            </h3>

            <div className="space-y-3">
              {mandiRates && mandiRates.length > 0 ? (
                mandiRates.map((mandi, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100/50 dark:border-slate-800/40 flex items-center justify-between gap-4 transition-colors duration-200"
                  >
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-950 dark:text-slate-100">{localizedMandiName(mandi.mandiName)}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{getLocalizedMandiDetails(mandi.commodity, mandi.distance)}</p>
                    </div>

                    <div className="text-right flex items-center space-x-4">
                      <div className="space-y-0.5">
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">₹{mandi.price.toLocaleString('en-IN')}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{lang === 'Hindi' ? 'प्रति क्विंटल' : lang === 'Punjabi' ? 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ' : lang === 'Marathi' ? 'प्रति क्विंटल' : lang === 'Telugu' ? 'క్వింటాల్‌కు' : lang === 'Bengali' ? 'প্রতি কুইন্টাল' : 'per quintal'}</p>
                      </div>

                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        mandi.change > 0 
                          ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400' 
                          : 'bg-rose-100 dark:bg-rose-950/30 text-rose-800 dark:text-rose-400'
                      }`}>
                        {mandi.change > 0 ? `+${mandi.change}%` : `${mandi.change}%`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  {lang === 'Hindi' ? 'कोई मंडी दरें उपलब्ध नहीं हैं' : 'No mandi rates available'}
                </div>
              )}
            </div>
          </div>

          {/* 30-Day price trends custom Recharts line chart */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5 text-left">
                <h3 className="font-display font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center space-x-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                  <span>
                    {compareMyCrops 
                      ? (lang === 'Hindi' ? 'मेरी फसलों का मूल्य रुझान' : lang === 'Punjabi' ? 'ਮੇਰੀਆਂ ਫ਼ਸਲਾਂ ਦਾ ਰੁਝਾਨ' : lang === 'Marathi' ? 'माझ्या पिकांचे बाजार भाव कल' : lang === 'Telugu' ? 'నా పంటల ధరల సరళి' : lang === 'Bengali' ? 'আমার ফসলের মূল্যের গতিধারা' : 'My Crops Price Trends')
                      : (lang === 'Hindi' ? `३० दिवसीय मूल्य रुझान (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Punjabi' ? `੩੦ ਦਿਨਾ ਦਾ ਰੁਝਾਨ (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Marathi' ? `३० दिवसीय बाजार भाव कल (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Telugu' ? `30 రోజుల ధరల సరళి (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Bengali' ? `৩০ দিনের মূল্যের গতিধারা (${getLocalizedCommodityLabel(selectedComm)})` : `30-Day Price Trend (${selectedComm})`)
                    }
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium text-left">
                  {lang === 'Hindi' ? '३० दिनों का ऐतिहासिक दैनिक बंद भाव' : '30-day historical daily closing rates'}
                </p>
              </div>

              {/* Toggle to compare my crops */}
              {validCropsList.length > 1 && (
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-100/60 dark:border-slate-800/80 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                  <input
                    type="checkbox"
                    id="compare-crops-toggle"
                    checked={compareMyCrops}
                    onChange={(e) => setCompareMyCrops(e.target.checked)}
                    className="h-3.5 w-3.5 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 rounded cursor-pointer"
                  />
                  <label htmlFor="compare-crops-toggle" className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    {lang === 'Hindi' ? 'मेरी फसलों की तुलना करें' : lang === 'Punjabi' ? 'ਮੇਰੀਆਂ ਫ਼ਸਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ' : lang === 'Marathi' ? 'माझ्या सर्व पिकांची तुलना करा' : lang === 'Telugu' ? 'నా పంటలను పోల్చండి' : lang === 'Bengali' ? 'আমার ফসল তুলনা করুন' : 'Compare My Crops'}
                  </label>
                </div>
              )}
            </div>

            {/* Recharts graph container */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={theme === 'dark' ? '#334155' : '#f1f5f9'} 
                    vertical={false}
                  />
                  
                  <XAxis 
                    dataKey="name" 
                    stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} 
                    style={{ fontSize: '10px', fontWeight: '700' }}
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    interval={5}
                  />
                  
                  <YAxis 
                    stroke={theme === 'dark' ? '#64748b' : '#94a3b8'} 
                    style={{ fontSize: '10px', fontWeight: '700' }}
                    tickLine={false}
                    axisLine={false}
                    dx={-4}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  
                  <Tooltip
                    content={
                      <CustomTooltip 
                        theme={theme} 
                        lang={lang} 
                        getLocalizedCommodityLabel={getLocalizedCommodityLabel} 
                      />
                    }
                  />

                  {compareMyCrops && (
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {getLocalizedCommodityLabel(value)}
                        </span>
                      )}
                    />
                  )}

                  {compareMyCrops ? (
                    validCropsList.map((crop) => (
                      <Line
                        key={crop}
                        type="monotone"
                        dataKey={crop}
                        name={crop}
                        stroke={CROP_COLORS[crop] || '#10b981'}
                        strokeWidth={2.5}
                        dot={{ r: 0 }}
                        activeDot={{ r: 5, strokeWidth: 1.5 }}
                        animationDuration={600}
                      />
                    ))
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={selectedComm}
                      name={selectedComm}
                      stroke={CROP_COLORS[selectedComm] || '#10b981'}
                      strokeWidth={3}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      animationDuration={600}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase pt-2 border-t border-slate-50 dark:border-slate-800">
              <span>{lang === 'Hindi' ? '३० दिन पहले' : lang === 'Punjabi' ? '੩੦ ਦਿਨ ਪਹਿਲਾਂ' : lang === 'Marathi' ? '३० दिवसांपूर्वी' : lang === 'Telugu' ? '30 రోజుల క్రితం' : lang === 'Bengali' ? '৩০ দিন আগে' : '30 Days Ago'}</span>
              <span>{lang === 'Hindi' ? '१५ दिन पहले' : lang === 'Punjabi' ? '੧੫ ਦਿਨ ਪਹਿਲਾਂ' : lang === 'Marathi' ? '१५ दिवसांपूर्वी' : lang === 'Telugu' ? '15 రోజుల క్రితం' : lang === 'Bengali' ? '১৫ দিন আগে' : '15 Days Ago'}</span>
              <span className="text-emerald-750 dark:text-emerald-450 font-extrabold">
                {lang === 'Hindi' ? 'आज' : lang === 'Punjabi' ? 'ਅੱਜ' : lang === 'Marathi' ? 'आज' : lang === 'Telugu' ? 'ఈరోజు' : lang === 'Bengali' ? 'আজ' : 'Today'}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: DYNAMIC COST ESTIMATOR CALCULATOR */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-5 shadow-inner transition-colors duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800">
            <h3 className="font-display font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <span>{t('profitabilityCalc', lang)}</span>
            </h3>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded-md">
              {lang === 'Hindi' ? 'क्षेत्रफल गणना' : lang === 'Punjabi' ? 'ਰਕਬਾ ਗਣਨਾ' : lang === 'Marathi' ? 'क्षेत्रफळ गणना' : lang === 'Telugu' ? 'ఎకరాల లెక్క' : lang === 'Bengali' ? 'জমি পরিমাপ' : 'Acreage calculation'}
            </span>
          </div>

          {/* Calculator Parameters form */}
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Sowing Area */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-left">
                  {t('acresLabel', lang)}
                </label>
                <input
                  type="number"
                  value={acres}
                  onChange={(e) => setAcres(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-0 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>

              {/* Crop Yield */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-left">
                  {t('expectedYieldLabel', lang)}
                </label>
                <input
                  type="number"
                  value={expectedYield}
                  onChange={(e) => setExpectedYield(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-0 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800/80 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">
                {lang === 'Hindi' ? 'अनुमानित लागत (प्रति एकड़)' : lang === 'Punjabi' ? 'ਅਨੁਮਾਨਿਤ ਲਾਗਤ (ਪ੍ਰਤੀ ਏਕੜ)' : lang === 'Marathi' ? 'अंदाजे खर्च (प्रति एकर)' : lang === 'Telugu' ? 'అంచనా వ్యయం (ఎకరానికి)' : lang === 'Bengali' ? 'আনুমানিক খরচ (প্রতি একর)' : 'Estimated Costs (Per Acre)'}
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Seed cost */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold block text-left">
                    {lang === 'Hindi' ? 'बीज (₹)' : lang === 'Punjabi' ? 'ਬੀਜ (₹)' : lang === 'Marathi' ? 'बियाणे (₹)' : lang === 'Telugu' ? 'విత్తనాలు (₹)' : lang === 'Bengali' ? 'বীজ (₹)' : 'Seed (₹)'}
                  </span>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={(e) => setSeedCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-0 rounded-xl py-1.5 px-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Fertilizers */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold block text-left">
                    {lang === 'Hindi' ? 'खाद (₹)' : lang === 'Punjabi' ? 'ਖਾਦ (₹)' : lang === 'Marathi' ? 'खत (₹)' : lang === 'Telugu' ? 'ఎరువులు (₹)' : lang === 'Bengali' ? 'সার (₹)' : 'Fertilizer (₹)'}
                  </span>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-0 rounded-xl py-1.5 px-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Labor */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold block text-left">
                    {lang === 'Hindi' ? 'मजदूरी (₹)' : lang === 'Punjabi' ? 'ਮਜ਼ਦੂਰੀ (₹)' : lang === 'Marathi' ? 'मजुरी (₹)' : lang === 'Telugu' ? 'కూలి (₹)' : lang === 'Bengali' ? 'মজুরি (₹)' : 'Labor (₹)'}
                  </span>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-0 rounded-xl py-1.5 px-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Sheet Result */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-800/30 rounded-2xl p-4 space-y-3 animate-fade-in mt-4 text-left transition-colors duration-200">
              <div className="flex justify-between items-center text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                <span>{lang === 'Hindi' ? 'अनुमानित आय-व्यय' : lang === 'Punjabi' ? 'ਅਨੁਮਾਨਿਤ ਆਮਦਨ-ਖਰਚ' : lang === 'Marathi' ? 'अंदाजे नफा-तोटा' : lang === 'Telugu' ? 'అంచనా వేసిన బ్యాలెన్స్' : lang === 'Bengali' ? 'আনুমানিক আয়-ব্যয় হিসাব' : 'PREDICTED ACCOUNT BALANCE'}</span>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider font-extrabold">
                  {profitMarginPercent}% {lang === 'Hindi' ? 'मार्जिन' : lang === 'Punjabi' ? 'ਮਾਰਜਿਨ' : lang === 'Marathi' ? 'मार्जिन' : lang === 'Telugu' ? 'మార్జిన్' : lang === 'Bengali' ? 'মার্জিন' : 'Margin'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-emerald-100/30 dark:border-emerald-900/20 pt-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{lang === 'Hindi' ? 'कुल अनाज पैदावार' : lang === 'Punjabi' ? 'ਕੁੱਲ ਝਾੜ' : lang === 'Marathi' ? 'एकूण उत्पादन' : lang === 'Telugu' ? 'మొత్తం దిగుబడి' : lang === 'Bengali' ? 'মোট ফলন' : 'Total Grain Yield'}</span>
                  <span className="font-display font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                    {totalProductionWeight} {lang === 'Hindi' ? 'क्विंटल' : lang === 'Punjabi' ? 'ਕੁਇੰਟਲ' : lang === 'Marathi' ? 'क्विंटल' : lang === 'Telugu' ? 'క్వింటాళ్ళు' : lang === 'Bengali' ? 'কুইন্টাল' : 'Quintals'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{lang === 'Hindi' ? 'उत्पादन लागत' : lang === 'Punjabi' ? 'ਖੇਤੀ ਲਾਗਤ' : lang === 'Marathi' ? 'उत्पादन खर्च' : lang === 'Telugu' ? 'పెట్టుబడి వ్యయం' : lang === 'Bengali' ? 'চাষের খরচ' : 'Production Cost'}</span>
                  <span className="font-display font-extrabold text-sm text-rose-700 dark:text-rose-400 block">
                    ₹{totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{t('estimatedRevenue', lang)}</span>
                  <span className="font-display font-extrabold text-sm text-slate-900 dark:text-slate-100 block">
                    ₹{grossRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{t('netProfit', lang)} (₹)</span>
                  <span className="font-display font-extrabold text-base text-emerald-800 dark:text-emerald-400 block">
                    ₹{netProfit.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
