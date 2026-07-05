import React, { useState } from 'react';
import { Landmark, TrendingUp, Calculator, WifiOff, RefreshCw, Check } from 'lucide-react';
import { MandiPrice, Language, Crop } from '../types';
import { t } from '../localization';

interface MarketIntelligenceProps {
  language: Language;
  crops: Crop[];
  isOnline: boolean;
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
  ]
};

export default function MarketIntelligence({ language, crops, isOnline }: MarketIntelligenceProps) {
  const [selectedComm, setSelectedComm] = useState<'Wheat' | 'Rice' | 'Cotton' | 'Mustard'>('Rice');
  const lang = language;
  
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

  const mandiRates = COMMODITY_MANDIS[selectedComm] || COMMODITY_MANDIS['Rice'];
  const topMandi = mandiRates[0];

  // Calculations
  const totalProductionWeight = acres * expectedYield; // in quintals
  const pricePerQuintal = topMandi.price;
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
      'Mustard': { English: 'Mustard', Hindi: 'सरसों', Punjabi: 'ਸਰ੍ਹੋਂ', Marathi: 'मोहरी', Telugu: 'ఆవాలు', Bengali: 'সরিষা' }
    };
    return map[comm]?.[lang] || comm;
  };

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
        .replace('Cotton (Shankar-6)', lang === 'Hindi' ? 'कपास (शंकर-६)' : lang === 'Punjabi' ? 'ਕਪਾਹ (ਸ਼ੰਕਰ-੬)' : lang === 'Marathi' ? 'कापूस (शंकर-६)' : lang === 'Telugu' ? 'పత్తి (శంకర్-6)' : lang === 'Bengali' ? 'তুলা (শঙ্কর-৬)' : 'Cotton (Shankar-6)')
        .replace('Cotton (Grade B)', lang === 'Hindi' ? 'कपास (श्रेणी बी)' : lang === 'Punjabi' ? 'ਕਪਾਹ (ਗ੍ਰੇਡ ਬੀ)' : lang === 'Marathi' ? 'कापूस (ग्रेड बी)' : lang === 'Telugu' ? 'పత్తి (గ్రేడ్ బి)' : lang === 'Bengali' ? 'তুলা (গ্রেড বি)' : 'Cotton (Grade B)')
        .replace('Cotton (Desi)', lang === 'Hindi' ? 'कपास (देसी)' : lang === 'Punjabi' ? 'ਕਪਾਹ (ਦੇਸੀ)' : lang === 'Marathi' ? 'कापूस (देशी)' : lang === 'Telugu' ? 'పత్తి (దేశీ)' : lang === 'Bengali' ? 'তুলা (দেশী)' : 'Cotton (Desi)')
        .replace('Mustard (42% Oil)', lang === 'Hindi' ? 'सरसों (४२% तेल)' : lang === 'Punjabi' ? 'ਸਰ੍ਹੋਂ (੪੨% ਤੇਲ)' : lang === 'Marathi' ? 'मोहरी (४२% तेल)' : lang === 'Telugu' ? 'ఆవాలు (42% నూనె)' : lang === 'Bengali' ? 'সরিষা (৪২% তেল)' : 'Mustard (42% Oil)')
        .replace('Mustard (Rabi Sec)', lang === 'Hindi' ? 'सरसों (रबी सीजन)' : lang === 'Punjabi' ? 'ਸਰ੍ਹੋਂ (ਰਬੀ ਸੀਜ਼ਨ)' : lang === 'Marathi' ? 'मोहरी (रब्बी हंगाम)' : lang === 'Telugu' ? 'ఆవాలు (రబీ పంట)' : lang === 'Bengali' ? 'সরিষা (রবি মরশুম)' : 'Mustard (Rabi Sec)')
        .replace('Mustard Seeds', lang === 'Hindi' ? 'सरसों के बीज' : lang === 'Punjabi' ? 'ਸਰ੍ਹੋਂ ਦੇ ਬੀਜ' : lang === 'Marathi' ? 'मोहरी दाणे' : lang === 'Telugu' ? 'ఆవాల గింజలు' : lang === 'Bengali' ? 'সরিষা বীজ' : 'Mustard Seeds');
    }
    return `${cName} • ${dist}`;
  };

  const localizedMandiName = (mName: string): string => {
    if (lang === 'English') return mName;
    return mName
      .replace('Khanna Mandi', lang === 'Hindi' ? 'खन्ना मंडी' : lang === 'Punjabi' ? 'ਖੰਨਾ ਮੰਡੀ' : lang === 'Marathi' ? 'खन्ना बाजार' : lang === 'Telugu' ? 'ఖన్నా మార్కెట్' : lang === 'Bengali' ? 'খন্না মান্ডি' : 'Khanna Mandi')
      .replace('Indore Mandi', lang === 'Hindi' ? 'इंदौर मंडी' : lang === 'Punjabi' ? 'ਇੰਦੌਰ ਮੰਡੀ' : lang === 'Marathi' ? 'इतवार बाजार' : lang === 'Telugu' ? 'ఇండోర్ మార్కెట్' : lang === 'Bengali' ? 'ইন্দোর মান্ডি' : 'Indore Mandi')
      .replace('Karnal Galla Mandi', lang === 'Hindi' ? 'करनाल गल्ला मंडी' : lang === 'Punjabi' ? 'ਕਰਨਾਲ ਗੱਲਾ ਮੰਡੀ' : lang === 'Marathi' ? 'कर्नाल धान्य बाजार' : lang === 'Telugu' ? 'కర్నాల్ గల్లా మార్కెట్' : lang === 'Bengali' ? 'করনাল গাল্লা মান্ডি' : 'Karnal Galla Mandi')
      .replace('Bhatinda Mandi', lang === 'Hindi' ? 'बठिंडा मंडी' : lang === 'Punjabi' ? 'ਬਠਿੰਡਾ ਮੰਡੀ' : lang === 'Marathi' ? 'बठिंडा बाजार' : lang === 'Telugu' ? 'బటిండా మార్కెట్' : lang === 'Bengali' ? 'ভাটিণ্ডা মান্ডি' : 'Bhatinda Mandi')
      .replace('Karnal Grain Market', lang === 'Hindi' ? 'करनाल अनाज मंडी' : lang === 'Punjabi' ? 'ਕਰਨਾਲ ਅਨਾਜ ਮੰਡੀ' : lang === 'Marathi' ? 'कर्नाल धान्य बाजार' : lang === 'Telugu' ? 'కర్నాల్ గ్రెయిన్ మార్కెట్' : lang === 'Bengali' ? 'করনাল শস্য আড়ত' : 'Karnal Grain Market')
      .replace('Khanna Galla Mandi', lang === 'Hindi' ? 'खन्ना गल्ला मंडी' : lang === 'Punjabi' ? 'ਖੰਨਾ ਗੱਲਾ ਮੰਡੀ' : lang === 'Marathi' ? 'खन्ना धान्य बाजार' : lang === 'Telugu' ? 'ఖన్నా గల్లా మార్కెట్' : lang === 'Bengali' ? 'খন্না গাল্লা মান্ডি' : 'Khanna Galla Mandi')
      .replace('Amritsar Market', lang === 'Hindi' ? 'अमृतसर मंडी' : lang === 'Punjabi' ? 'ਅੰਮ੍ਰਿਤਸਰ ਮੰਡੀ' : lang === 'Marathi' ? 'अमृतसर बाजार' : lang === 'Telugu' ? 'అమృతసర్ మార్కెట్' : lang === 'Bengali' ? 'অমৃতসর মান্ডি' : 'Amritsar Market')
      .replace('Gondal Yard', lang === 'Hindi' ? 'गोंडल यार्ड' : lang === 'Punjabi' ? 'ਗੋਂਡਲ ਯਾਰਡ' : lang === 'Marathi' ? 'गोंडल यार्ड' : lang === 'Telugu' ? 'గోండల్ యార్డ్' : lang === 'Bengali' ? 'গোন্ডাল ইয়ার্ড' : 'Gondal Yard')
      .replace('Rajkot Cotton Yard', lang === 'Hindi' ? 'राजकोट कपास यार्ड' : lang === 'Punjabi' ? 'ਰਾਜਕੋਟ ਕਪਾਹ ਯਾਰਡ' : lang === 'Marathi' ? 'राजकोट कापूस यार्ड' : lang === 'Telugu' ? 'రాజ్‌కోట్ కాటన్ యార్డ్' : lang === 'Bengali' ? 'রাজকোট তুলা আড়ত' : 'Rajkot Cotton Yard')
      .replace('Adoni Mandi', lang === 'Hindi' ? 'अदोनी मंडी' : lang === 'Punjabi' ? 'ਅਦੋਨੀ ਮੰਡੀ' : lang === 'Marathi' ? 'अदोनी बाजार' : lang === 'Telugu' ? 'ఆదోని మార్కెట్' : lang === 'Bengali' ? 'আদোনি মান্ডি' : 'Adoni Mandi')
      .replace('Indore Galla Market', lang === 'Hindi' ? 'इंदौर गल्ला बाजार' : lang === 'Punjabi' ? 'ਇੰਦੌਰ ਗੱਲਾ ਬਜ਼ਾਰ' : lang === 'Marathi' ? 'इतवार धान्य बाजार' : lang === 'Telugu' ? 'ఇండోర్ గల్లా మార్కెట్' : lang === 'Bengali' ? 'ইন্দোর গাল্লা বাজার' : 'Indore Galla Market')
      .replace('Jaipur APMC', lang === 'Hindi' ? 'जयपुर एपीएमसी' : lang === 'Punjabi' ? 'ਜੈਪੁਰ ਏਪੀਐਮਸੀ' : lang === 'Marathi' ? 'जयपूर एपीएमसी' : lang === 'Telugu' ? 'జైపూర్ ఏపీఎంసీ' : lang === 'Bengali' ? 'জয়পুর এপিএমসি' : 'Jaipur APMC')
      .replace('Hisar Market', lang === 'Hindi' ? 'हिसार मंडी' : lang === 'Punjabi' ? 'ਹਿਸਾਰ ਮੰਡੀ' : lang === 'Marathi' ? 'हिसार बाजार' : lang === 'Telugu' ? 'హిసార్ మార్కెట్' : lang === 'Bengali' ? 'হিসার মান্ডি' : 'Hisar Market')
      .replace('Alwar Yard', lang === 'Hindi' ? 'अलवर यार्ड' : lang === 'Punjabi' ? 'ਅਲਵਰ ਯਾਰਡ' : lang === 'Marathi' ? 'अलवर यार्ड' : lang === 'Telugu' ? 'అల్వార్ యార్డ్' : lang === 'Bengali' ? 'আলোয়ার ইয়ার্ড' : 'Alwar Yard');
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-sans max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header with offline/online cache synchronization panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {t('marketIntelMandi', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t('marketIntelDesc', lang)}
          </p>
        </div>

        {/* Caching/Network status bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isOnline ? (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>{t('liveIndex', lang)} (Last: {lastSync})</span>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-3 py-1.5 text-xs font-bold flex items-center space-x-1.5 animate-pulse">
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
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : syncing
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
            <span>{syncing ? t('syncing', lang) : t('syncPrices', lang)}</span>
          </button>
        </div>
      </div>

      {syncSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{t('syncSuccessPrices', lang)}</span>
        </div>
      )}

      {/* Commodity Selector tab group */}
      <div className="bg-white p-2 rounded-2xl border border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap">
        {(['Rice', 'Wheat', 'Cotton', 'Mustard'] as const).map((comm) => (
          <button
            key={comm}
            type="button"
            onClick={() => setSelectedComm(comm)}
            className={`py-2 px-6 rounded-xl font-display font-extrabold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedComm === comm
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {getLocalizedCommodityLabel(comm)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: MANDIS RATES & 30-DAY SVG CHART */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Nearby Mandi Rates table list */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Landmark className="h-5 w-5 text-emerald-600" />
              <span>{t('mandiPriceTrends', lang)}</span>
            </h3>

            <div className="space-y-3">
              {mandiRates.map((mandi, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-950">{localizedMandiName(mandi.mandiName)}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{getLocalizedMandiDetails(mandi.commodity, mandi.distance)}</p>
                  </div>

                  <div className="text-right flex items-center space-x-4">
                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900">₹{mandi.price.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{lang === 'Hindi' ? 'प्रति क्विंटल' : lang === 'Punjabi' ? 'ਪ੍ਰਤੀ ਕੁਇੰਟਲ' : lang === 'Marathi' ? 'प्रति क्विंटल' : lang === 'Telugu' ? 'క్వింటాల్‌కు' : lang === 'Bengali' ? 'প্রতি কুইন্টাল' : 'per quintal'}</p>
                    </div>

                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      mandi.change > 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {mandi.change > 0 ? `+${mandi.change}%` : `${mandi.change}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 30-Day price trends custom SVG drawing chart */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-slate-900 text-sm sm:text-base flex items-center space-x-2">
                <TrendingUp className="h-4.5 w-4.5 text-emerald-600" />
                <span>{lang === 'Hindi' ? `३० दिवसीय मूल्य रुझान (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Punjabi' ? `੩੦ ਦਿਨਾ ਦਾ ਰੁਝਾਨ (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Marathi' ? `३० दिवसीय बाजार भाव कल (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Telugu' ? `30 రోజుల ధరల సరళి (${getLocalizedCommodityLabel(selectedComm)})` : lang === 'Bengali' ? `৩০ দিনের মূল্যের গতিধারা (${getLocalizedCommodityLabel(selectedComm)})` : `30-Day Price Trend (${selectedComm})`}</span>
              </h3>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg font-bold">
                {lang === 'Hindi' ? 'मंडी चरम मांग' : lang === 'Punjabi' ? 'ਮੰਡੀ ਸਿਖਰ ਮੰਗ' : lang === 'Marathi' ? 'बाजार उच्चतम मागणी' : lang === 'Telugu' ? 'మార్కెట్ గరిష్ట డిమాండ్' : lang === 'Bengali' ? 'মান্ডির সর্বোচ্চ চাহিদা' : 'Mandi peak demand'}
              </span>
            </div>

            {/* Custom SVG chart */}
            <div className="relative pt-4 pb-2">
              <svg viewBox="0 0 400 150" className="w-full h-44 overflow-visible">
                {/* Gridlines */}
                <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="40" x2="400" y2="40" stroke="#f1f5f9" strokeWidth="1" />

                {/* Simulated Chart curve */}
                <path
                  d="M 10 110 C 60 95, 120 105, 180 70 S 280 40, 390 20"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Fill shadow path */}
                <path
                  d="M 10 110 C 60 95, 120 105, 180 70 S 280 40, 390 20 L 390 140 L 10 140 Z"
                  fill="url(#emeraldGradient)"
                  opacity="0.1"
                />

                {/* Gradients declaration */}
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Dots along path */}
                <circle cx="10" cy="110" r="4" fill="#059669" />
                <circle cx="180" cy="70" r="4" fill="#059669" />
                <circle cx="390" cy="20" r="5" fill="#10b981" />
              </svg>

              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase pt-2 border-t border-slate-50">
                <span>{lang === 'Hindi' ? '३० दिन पहले' : lang === 'Punjabi' ? '੩੦ ਦਿਨ ਪਹਿਲਾਂ' : lang === 'Marathi' ? '३० दिवसांपूर्वी' : lang === 'Telugu' ? '30 రోజుల క్రితం' : lang === 'Bengali' ? '৩০ দিন আগে' : '30 Days Ago'}</span>
                <span>{lang === 'Hindi' ? '१५ दिन पहले' : lang === 'Punjabi' ? '੧੫ ਦਿਨ ਪਹਿਲਾਂ' : lang === 'Marathi' ? '१५ दिवसांपूर्वी' : lang === 'Telugu' ? '15 రోజుల క్రితం' : lang === 'Bengali' ? '১৫ দিন আগে' : '15 Days Ago'}</span>
                <span className="text-emerald-700">{lang === 'Hindi' ? 'आज (उच्चतम)' : lang === 'Punjabi' ? 'ਅੱਜ (ਉੱਚਤਮ)' : lang === 'Marathi' ? 'आज (उच्चतम)' : lang === 'Telugu' ? 'ఈరోజు (గరిష్టం)' : lang === 'Bengali' ? 'আজ (সর্বোচ্চ)' : 'Today (Highest)'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: DYNAMIC COST ESTIMATOR CALCULATOR */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-100 space-y-5 shadow-inner">
          <div className="flex justify-between items-center pb-2 border-b border-slate-50">
            <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <span>{t('profitabilityCalc', lang)}</span>
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
              {lang === 'Hindi' ? 'क्षेत्रफल गणना' : lang === 'Punjabi' ? 'ਰਕਬਾ ਗਣਨਾ' : lang === 'Marathi' ? 'क्षेत्रफळ गणना' : lang === 'Telugu' ? 'ఎకరాల లెక్క' : lang === 'Bengali' ? 'জমি পরিমাপ' : 'Acreage calculation'}
            </span>
          </div>

          {/* Calculator Parameters form */}
          <div className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              {/* Sowing Area */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                  {t('acresLabel', lang)}
                </label>
                <input
                  type="number"
                  value={acres}
                  onChange={(e) => setAcres(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 text-slate-900 border-0 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>

              {/* Crop Yield */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-left">
                  {t('expectedYieldLabel', lang)}
                </label>
                <input
                  type="number"
                  value={expectedYield}
                  onChange={(e) => setExpectedYield(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-50 text-slate-900 border-0 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-50 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                {lang === 'Hindi' ? 'अनुमानित लागत (प्रति एकड़)' : lang === 'Punjabi' ? 'ਅਨੁਮਾਨਿਤ ਲਾਗਤ (ਪ੍ਰਤੀ ਏਕੜ)' : lang === 'Marathi' ? 'अंदाजे खर्च (प्रति एकर)' : lang === 'Telugu' ? 'అంచనా వ్యయం (ఎకరానికి)' : lang === 'Bengali' ? 'আনুমানিক খরচ (প্রতি একর)' : 'Estimated Costs (Per Acre)'}
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Seed cost */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-semibold block text-left">
                    {lang === 'Hindi' ? 'बीज (₹)' : lang === 'Punjabi' ? 'ਬੀਜ (₹)' : lang === 'Marathi' ? 'बियाणे (₹)' : lang === 'Telugu' ? 'విత్తనాలు (₹)' : lang === 'Bengali' ? 'বীজ (₹)' : 'Seed (₹)'}
                  </span>
                  <input
                    type="number"
                    value={seedCost}
                    onChange={(e) => setSeedCost(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-900 border-0 rounded-xl py-1.5 px-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Fertilizers */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-semibold block text-left">
                    {lang === 'Hindi' ? 'खाद (₹)' : lang === 'Punjabi' ? 'ਖਾਦ (₹)' : lang === 'Marathi' ? 'खत (₹)' : lang === 'Telugu' ? 'ఎరువులు (₹)' : lang === 'Bengali' ? 'সার (₹)' : 'Fertilizer (₹)'}
                  </span>
                  <input
                    type="number"
                    value={fertilizerCost}
                    onChange={(e) => setFertilizerCost(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-900 border-0 rounded-xl py-1.5 px-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Labor */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-semibold block text-left">
                    {lang === 'Hindi' ? 'मजदूरी (₹)' : lang === 'Punjabi' ? 'ਮਜ਼ਦੂਰੀ (₹)' : lang === 'Marathi' ? 'मजुरी (₹)' : lang === 'Telugu' ? 'కూలి (₹)' : lang === 'Bengali' ? 'মজুরি (₹)' : 'Labor (₹)'}
                  </span>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-900 border-0 rounded-xl py-1.5 px-2 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Sheet Result */}
            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-2xl p-4 space-y-3 animate-fade-in mt-4 text-left">
              <div className="flex justify-between items-center text-xs font-extrabold text-emerald-800">
                <span>{lang === 'Hindi' ? 'अनुमानित आय-व्यय' : lang === 'Punjabi' ? 'ਅਨੁਮਾਨਿਤ ਆਮਦਨ-ਖਰਚ' : lang === 'Marathi' ? 'अंदाजे नफा-तोटा' : lang === 'Telugu' ? 'అంచనా వేసిన బ్యాలెన్స్' : lang === 'Bengali' ? 'আনুমানিক আয়-ব্যয় হিসাব' : 'PREDICTED ACCOUNT BALANCE'}</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider">
                  {profitMarginPercent}% {lang === 'Hindi' ? 'मार्जिन' : lang === 'Punjabi' ? 'ਮਾਰਜਿਨ' : lang === 'Marathi' ? 'मार्जिन' : lang === 'Telugu' ? 'మార్జిన్' : lang === 'Bengali' ? 'মার্জিন' : 'Margin'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-emerald-100/30 pt-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold">{lang === 'Hindi' ? 'कुल अनाज पैदावार' : lang === 'Punjabi' ? 'ਕੁੱਲ ਝਾੜ' : lang === 'Marathi' ? 'एकूण उत्पादन' : lang === 'Telugu' ? 'మొత్తం దిగుబడి' : lang === 'Bengali' ? 'মোট ফলন' : 'Total Grain Yield'}</span>
                  <span className="font-display font-extrabold text-sm text-slate-900 block">
                    {totalProductionWeight} {lang === 'Hindi' ? 'क्विंटल' : lang === 'Punjabi' ? 'ਕੁਇੰਟਲ' : lang === 'Marathi' ? 'क्विंटल' : lang === 'Telugu' ? 'క్వింటాళ్ళు' : lang === 'Bengali' ? 'কুইন্টাল' : 'Quintals'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold">{lang === 'Hindi' ? 'उत्पादन लागत' : lang === 'Punjabi' ? 'ਖੇਤੀ ਲਾਗਤ' : lang === 'Marathi' ? 'उत्पादन खर्च' : lang === 'Telugu' ? 'పెట్టుబడి వ్యయం' : lang === 'Bengali' ? 'চাষের খরচ' : 'Production Cost'}</span>
                  <span className="font-display font-extrabold text-sm text-rose-700 block">
                    ₹{totalCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold">{t('estimatedRevenue', lang)}</span>
                  <span className="font-display font-extrabold text-sm text-slate-900 block">
                    ₹{grossRevenue.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-semibold">{t('netProfit', lang)} (₹)</span>
                  <span className="font-display font-extrabold text-base text-emerald-800 block">
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
