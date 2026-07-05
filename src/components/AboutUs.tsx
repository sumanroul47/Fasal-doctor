import React from 'react';
import { ShieldCheck, Heart, Award, Sprout, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { t } from '../localization';

interface AboutUsProps {
  onStart: () => void;
  language: Language;
}

export default function AboutUs({ onStart, language }: AboutUsProps) {
  const lang = language;

  return (
    <div className="space-y-12 pb-24 animate-fade-in font-sans max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {t('ourVisionStory', lang)}
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
          {lang === 'Hindi' ? <>भारतीय कृषि के <br />भविष्य को संवारना।</>
           : lang === 'Punjabi' ? <>ਪੰਜਾਬ ਅਤੇ ਭਾਰਤੀ ਖੇਤੀਬਾੜੀ ਦੇ <br />ਭਵਿੱਖ ਨੂੰ ਸੰਵਾਰਨਾ।</>
           : lang === 'Marathi' ? <>महाराष्ट्राच्या आणि देशाच्या <br />शेतीचे भविष्य उज्ज्वल करणे।</>
           : lang === 'Telugu' ? <>భారతీయ వ్యవసాయ భవిష్యత్తును <br />సరికొత్తగా తీర్చిదిద్దడం।</>
           : lang === 'Bengali' ? <>ভারতীয় কৃষির ভবিষ্যৎ <br />সমৃদ্ধ করা।</>
           : <>Cultivating the Future <br />of India's Farming.</>}
        </h1>
        <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
          {t('visionDesc', lang)}
        </p>
      </div>

      {/* Two Column Story Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 grid md:grid-cols-2 gap-8 items-center shadow-sm">
        <div className="space-y-4 text-left">
          <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-wider block">{t('originStory', lang)}</span>
          <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">{t('fromVisionToVitality', lang)}</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('originDesc1', lang)}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('originDesc2', lang)}
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-video md:aspect-square">
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600" 
            alt="Indian Happy Farmer"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">ESTABLISHED 2026</span>
            <p className="font-bold text-sm text-white">
              {lang === 'Hindi' ? 'कर्नाल क्षेत्रीय ग्रिड की सेवा' : lang === 'Punjabi' ? 'ਕਰਨਾਲ ਖੇਤਰੀ ਗਰਿੱਡ ਦੀ ਸੇਵਾ' : lang === 'Marathi' ? 'कर्नाल प्रादेशिक विभाग' : lang === 'Telugu' ? 'కర్నాల్ ప్రాంతీయ గ్రిడ్ సేవ' : lang === 'Bengali' ? 'করনাল আঞ্চলিক গ্রিড সেবা' : 'Serving Karnal Regional Grid'}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision cards */}
      <div className="grid sm:grid-cols-2 gap-6 text-left">
        
        {/* Mission */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
            <Sprout className="h-6 w-6" />
          </div>
          <h3 className="font-display font-extrabold text-slate-900 text-lg">{t('ourMission', lang)}</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'Hindi' ? 'हमारा उद्देश्य १० मिलियन से अधिक छोटे भारतीय किसानों को वास्तविक समय में स्थानीय वैज्ञानिक सलाह प्रदान करना, रासायनिक दवाओं के दुरुपयोग को कम करना, खर्च बचाना और फसलों का मूल्य बढ़ाना है।'
             : lang === 'Punjabi' ? 'ਸਾਡਾ ਉਦੇਸ਼ ੧੦ ਮਿਲੀਅਨ ਤੋਂ ਵੱਧ ਛੋਟੇ ਕਿਸਾਨਾਂ ਨੂੰ ਅਸਲ-ਸਮੇਂ ਦੀ ਵਿਗਿਆਨਕ ਸਲਾਹ ਪ੍ਰਦਾਨ ਕਰਨਾ, ਖਰਚ ਬਚਾਉਣਾ ਅਤੇ ਫਸਲਾਂ ਦਾ ਮੁੱਲ ਵਧਾਉਣਾ ਹੈ।'
             : lang === 'Marathi' ? 'आमचे ध्येय १ कोटीपेक्षा जास्त लहान शेतकऱ्यांना थेट शेतात वैज्ञानिक सल्ला देणे, खतांचा खर्च वाचवणे आणि पिकांचे बाजार मूल्य वाढवणे हे आहे।'
             : lang === 'Telugu' ? 'మా లక్ష్యం 10 మిలియన్ల కంటే ఎక్కువ మంది భారతీయ రైతులకు నిజ-సమయ శాస్త్రీయ సలహాలను అందించడం, రసాయనాల వినియోగాన్ని తగ్గించడం, ఖర్చులను ఆదా చేయడం.'
             : lang === 'Bengali' ? 'আমাদের মিশন হলো ১০ মিলিয়নেরও বেশি ভারতীয় কৃষকদের রিয়েল-টাইম বৈজ্ঞানিক পরামর্শ প্রদান করা, সারের অপব্যবহার কমানো এবং ফসলের বাজার মূল্য বৃদ্ধি করা।'
             : 'To empower over 10 million smallholder Indian farmers with real-time, localized science advisory, reducing chemical abuse, saving input costs, and raising crop market value.'}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl w-fit">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-display font-extrabold text-slate-900 text-lg">
            {lang === 'Hindi' ? 'हमारा दृष्टिकोण' : lang === 'Punjabi' ? 'ਸਾਡਾ ਦ੍ਰਿਸ਼ਟੀਕੋਣ' : lang === 'Marathi' ? 'आमचा दृष्टिकोन' : lang === 'Telugu' ? 'మా దార్శనికత' : lang === 'Bengali' ? 'আমাদের লক্ষ্য' : 'Our Vision'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {lang === 'Hindi' ? 'एक लचीला, आत्मनिर्भर भारतीय कृषि पारिस्थितिकी तंत्र जहां हर गाँव सटीक फसल जानकारी से निर्देशित होता है, जिससे खाद्य सुरक्षा और निष्पक्ष मूल्य प्रणाली सुनिश्चित होती है।'
             : lang === 'Punjabi' ? 'ਇੱਕ ਮਜ਼ਬੂਤ, ਆਤਮ-ਨਿਰਭਰ ਭਾਰਤੀ ਖੇਤੀਬਾੜੀ ਵਾਤਾਵਰਣ ਜਿੱਥੇ ਹਰ ਪਿੰਡ ਸਹੀ ਫਸਲ ਜਾਣਕਾਰੀ ਦੁਆਰਾ ਨਿਰਦੇਸ਼ਤ ਹੁੰਦਾ ਹੈ, ਖੁਰਾਕ ਸੁਰੱਖਿਆ ਨੂੰ ਯਕੀਨੀ ਬਣਾਉਂਦਾ ਹੈ।'
             : lang === 'Marathi' ? 'एक सक्षम आणि आत्मनिर्भर शेती व्यवस्था जिथे प्रत्येक गावाला अचूक पीक माहिती मिळते, अन्न सुरक्षा आणि वाजवी भाव सुनिश्चित होतो।'
             : lang === 'Telugu' ? 'ఒక బలమైన, స్వయం సమృద్ధి గల వ్యవసాయ వ్యవస్థను నిర్మించడం, ఇక్కడ ప్రతి గ్రామం పంట సమాచారంతో మార్గదర్శకత్వం పొందుతుంది.'
             : lang === 'Bengali' ? 'একটি স্থিতিস্থাপক ও স্বনির্ভর কৃষি ব্যবস্থা গড়ে তোলা যেখানে প্রতিটি গ্রাম ফসল তথ্যের মাধ্যমে সঠিক দিকনির্দেশনা পায়।'
             : 'A resilient, self-sustaining Indian agricultural ecosystem where every village is guided by precision crop intelligence, ensuring food security and fair price systems.'}
          </p>
        </div>

      </div>

      {/* Core Values bento grid */}
      <div className="space-y-6">
        <h3 className="font-display font-extrabold text-slate-900 text-xl text-center">{t('coreValues', lang)}</h3>
        
        <div className="grid sm:grid-cols-3 gap-6">
          
          <div className="p-5 bg-slate-50 border border-slate-100/60 rounded-2xl text-center space-y-3">
            <div className="mx-auto p-2 bg-white text-emerald-600 rounded-xl w-fit shadow-sm">
              <Heart className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t('value2Title', lang)}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('value2Desc', lang)}
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-100/60 rounded-2xl text-center space-y-3">
            <div className="mx-auto p-2 bg-white text-emerald-600 rounded-xl w-fit shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t('value1Title', lang)}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('value1Desc', lang)}
            </p>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-100/60 rounded-2xl text-center space-y-3">
            <div className="mx-auto p-2 bg-white text-emerald-600 rounded-xl w-fit shadow-sm">
              <Sprout className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">{t('value3Title', lang)}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('value3Desc', lang)}
            </p>
          </div>

        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="font-display font-extrabold text-2xl">
            {lang === 'Hindi' ? 'आंदोलन का हिस्सा बनें' : lang === 'Punjabi' ? 'ਇਸ ਮੁਹਿੰਮ ਦਾ ਹਿੱਸਾ ਬਣੋ' : lang === 'Marathi' ? 'या चळवळीचा भाग व्हा' : lang === 'Telugu' ? 'వ్యవసాయ విప్లవంలో భాగస్వామ్యం అవ్వండి' : lang === 'Bengali' ? 'এই আন্দোলনের অংশ হোন' : 'Be Part of the Movement'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'Hindi' ? 'आज ही अपने फसलों की सुरक्षा और लाभ बढ़ाने के लिए हजारों भारतीय किसानों से जुड़ें।' : lang === 'Punjabi' ? 'ਆਪਣੀ ਫਸਲ ਦੀ ਸੁਰੱਖਿਆ ਅਤੇ ਲਾਭ ਵਧਾਉਣ ਲਈ ਹਜ਼ਾਰਾਂ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ।' : lang === 'Marathi' ? 'तुमच्या पिकांच्या सुरक्षेसाठी आणि नफा वाढवण्यासाठी आजच हजारो शेतकऱ्यांशी जोडा।' : lang === 'Telugu' ? 'ఈరోజే మీ పంటల రక్షణ మరియు లాభాలను పెంచుకోవడానికి వేలాది మంది రైతులతో చేరండి.' : lang === 'Bengali' ? 'আপনার ফসলের সুরক্ষা এবং ফলন বাড়ানোর জন্য আজই হাজার হাজার কৃষকদের সাথে যোগ দিন।' : 'Join thousands of Indian farmers protecting their crops and boosting profitability today.'}
          </p>
        </div>

        <button
          onClick={onStart}
          className="inline-flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm py-3 px-8 rounded-xl shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <span>
            {lang === 'Hindi' ? 'अभी शुरुआत करें' : lang === 'Punjabi' ? 'ਹੁਣੇ ਸ਼ੁਰੂ ਕਰੋ' : lang === 'Marathi' ? 'आता सुरुवात करा' : lang === 'Telugu' ? 'ఇప్పుడే ప్రారంభించండి' : lang === 'Bengali' ? 'এখনই শুরু করুন' : 'Get Started Now'}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
