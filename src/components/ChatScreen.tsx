import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Sprout, Languages, Square, Loader2 } from 'lucide-react';
import { ChatMessage, Language, Crop } from '../types';
import { t } from '../localization';

interface ChatScreenProps {
  language: Language;
  crops: Crop[];
  isOnline: boolean;
}

const DEFAULT_QUESTIONS: Record<Language, { text: string }[]> = {
  English: [
    { text: 'Why are my rice leaves yellow?' },
    { text: 'What fertilizer is best for wheat?' },
    { text: 'Can I spray pesticide in windy weather?' }
  ],
  Hindi: [
    { text: 'मेरे धान के पत्ते पीले क्यों पड़ रहे हैं?' },
    { text: 'गेहूं के लिए कौन सी खाद सबसे अच्छी है?' },
    { text: 'क्या हवा चलने पर कीटनाशक स्प्रे कर सकते हैं?' }
  ],
  Punjabi: [
    { text: 'ਮੇਰੇ ਝੋਨੇ ਦੇ ਪੱਤੇ ਪੀਲੇ ਕਿਉਂ ਹੋ ਰਹੇ ਹਨ?' },
    { text: 'ਕਣਕ ਲਈ ਕਿਹੜੀ ਖਾਦ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ?' },
    { text: 'ਕੀ ਹਵਾ ਚੱਲਣ ਤੇ ਸਪ੍ਰੇਅ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ?' }
  ],
  Marathi: [
    { text: 'माझ्या भाताची पाने पिवळी का पडत आहेत?' },
    { text: 'गव्हासाठी कोणते खत सर्वात चांगले आहे?' },
    { text: 'वारा वाहत असताना कीटकनाशक फवारणी करू शकतो का?' }
  ],
  Telugu: [
    { text: 'నా వరి ఆకులు ఎందుకు పసుపు రంగులోకి మారుతున్నాయి?' },
    { text: 'గోధుమ పంటకు ఏ ఎరువు చాలా మంచిది?' },
    { text: 'గాలి ఎక్కువగా ఉన్నప్పుడు పురుగుల మందు పిచಿಕారీ చేయవచ్చా?' }
  ],
  Bengali: [
    { text: 'আমার ধানের পাতা কেন হলুদ হয়ে যাচ্ছে?' },
    { text: 'গমের জন্য কোন সার সবচেয়ে ভালো?' },
    { text: 'ঝড়ো আবহাওয়ায় কি কীটনাশক স্প্রে করা যাবে?' }
  ],
  Tamil: [
    { text: 'என் நெல் இலைகள் ஏன் மஞ்சளாக மாறுகின்றன?' },
    { text: 'கோதுமைக்கு எந்த உரம் சிறந்தது?' },
    { text: 'காற்று வீசும் வானிலையில் பூச்சிக்கொல்லி தெளிக்கலாமா?' }
  ],
  Kannada: [
    { text: 'ನನ್ನ ಭತ್ತದ ಎಲೆಗಳು ಏಕೆ ಹಳದಿಯಾಗುತ್ತಿವೆ?' },
    { text: 'ಗೋಧಿಗೆ ಯಾವ ಗೊಬ್ಬರ ಅತ್ಯುತ್ತಮ?' },
    { text: 'ಗಾಳಿ ಬೀಸುವ ಹವಾಮಾನದಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬಹುದೇ?' }
  ],
  Malayalam: [
    { text: 'എന്റെ നെല്ലിന്റെ ഇലകൾ എന്തുകൊണ്ടാണ് മഞ്ഞനിറമാകുന്നത്?' },
    { text: 'ഗോതമ്പിന് ഏത് വളമാണ് ഏറ്റവും നല്ലത്?' },
    { text: 'കാറ്റുള്ള കാലാവസ്ഥയിൽ കീടനാശിനി തളിക്കാമോ?' }
  ],
  Gujarati: [
    { text: 'મારા ડાંગરના પાન કેમ પીળા પડી રહ્યા છે?' },
    { text: 'ઘઉં માટે કયું ખાતર સૌથી સારું છે?' },
    { text: 'પવન વાળા વાતાવરણમાં જંતુનાશક દવા છાંટી શકાય?' }
  ],
  Odia: [
    { text: 'ମୋର ଧାନ ପତ୍ର କାହିଁକି ହଳଦିଆ ହୋଇଯାଉଛି?' },
    { text: 'ଗହମ ପାଇଁ କେଉଁ ସାର ସବୁଠାରୁ ଭଲ?' },
    { text: 'ପବന ବହିବା ସମୟରେ କଣ କୀଟନାଶକ ସ୍ପ୍ରେ କରିହେବ?' }
  ],
  Assamese: [
    { text: 'মোৰ ধানৰ পাতবোৰ কিয় হালধীয়া হৈ পৰিছে?' },
    { text: 'ঘেঁহুৰ বাবে কোনটো সাৰ আটাইতকৈ ভাল?' },
    { text: 'বতাহ বলা বতৰত কীটনাশক স্প্ৰে’ কৰিব পাৰিনে?' }
  ]
};

const WELCOME_MESSAGES: Partial<Record<Language, (crop: string) => string>> = {
  English: (crop) => `**Namaste!** I am your Fasal Doctor AI assistant. 🌾 \n\nHow can I help you today with your **${crop}** crop, weather alerts, or Mandi price updates? Ask me any questions or tap one of the suggestions below.`,
  Hindi: (crop) => `**राम-राम किसान भाई!** मैं आपका फसल डॉक्टर AI सहायक हूँ। 🌾 \n\nआज मैं आपकी **${crop}** की फसल, मौसम या मंडी भाव में क्या सहायता कर सकता हूँ? आप नीचे लिखे सवालों पर क्लिक कर सकते हैं या बोलकर पूछ सकते हैं।`,
  Punjabi: (crop) => `**ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ!** ਮੈਂ ਤੁਹਾਡਾ ਫਸਲ ਡਾਕਟਰ ਏਆਈ ਸਹਾਇਕ ਹਾਂ। 🌾 \n\nਅੱਜ ਮੈਂ ਤੁਹਾਡੀ **${crop}** ਦੀ ਫਸਲ, ਮੌਸਮ ਜਾਂ ਮੰਡੀ ਦੇ ਭਾਵ ਬਾਰੇ ਕੀ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ? ਤੁਸੀਂ ਹੇਠਾਂ ਦਿੱਤੇ ਸਵਾਲਾਂ 'ਤੇ ਕਲਿੱਕ ਕਰ ਸਕਦੇ ਹੋ।`,
  Marathi: (crop) => `**नमस्कार शेतकरी बंधूंनो!** मी तुमचा फसल डॉक्टर एआय सहाय्यक आहे। 🌾 \n\nआज मी तुम्हाला **${crop}** पीक, हवामान किंवा मंडी दरांबद्दल काय मदत करू शकतो? आपण खालील प्रश्नांवर क्लिक करू शकता।`,
  Telugu: (crop) => `**నమస్కారం రైతు సోదరులారా!** నేను మీ ఫసల్ డాక్టర్ AI సహాయకుడిని. 🌾 \n\nఈ రోజు మీ **${crop}** పంట, వాతావరణం లేదా మండి ధరల గురించి మీకు ఏవిధంగా సహాయపడగలను? కింద ఉన్న ప్రశ్నలను ఎంచుకోవచ్చు.`,
  Bengali: (crop) => `**নমস্কার চাষী ভাইরা!** আমি আপনার ফসল ডাক্তার এআই সহকারী। 🌾 \n\nআজ আমি আপনার **${crop}** ফসল, আবহাওয়া বা মান্ডি দর নিয়ে কীভাবে সাহায্য করতে পারি? আপনি নিচের যেকোনো প্রশ্নে ক্লিক করতে পারেন।`
};

export default function ChatScreen({ language, crops, isOnline }: ChatScreenProps) {
  const primaryCrop = crops[0] || 'Rice';
  const lang = language;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGES[lang] ? WELCOME_MESSAGES[lang](primaryCrop) : WELCOME_MESSAGES['English'](primaryCrop),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync welcome message if language changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGES[lang] ? WELCOME_MESSAGES[lang](primaryCrop) : WELCOME_MESSAGES['English'](primaryCrop),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [lang, primaryCrop]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    if (!isOnline) {
      setTimeout(() => {
        let reply = '';
        const lower = cleanText.toLowerCase();
        
        if (lang === 'Hindi') {
          if (lower.includes('पीला') || lower.includes('yellow')) {
            reply = `**फसल विशेषज्ञ (ऑफ़लाइन सलाह):**\n\nधान या अन्य पत्तियों का पीला पड़ना नाइट्रोजन की कमी या सूक्ष्म पोषक तत्वों (जैसे जिंक/लोहा) की कमी को दर्शाता है। \n\n*सलाह:* प्रति एकड़ 5 किलोग्राम जिंक सल्फेट के साथ 2 किलोग्राम यूरिया का घोल बनाकर छिड़काव करें।`;
          } else if (lower.includes('खाद') || lower.includes('fertilizer') || lower.includes('यूरिया')) {
            reply = `**फसल विशेषज्ञ (ऑफ़लाइन सलाह):**\n\nसंतुलित खाद का उपयोग अत्यंत आवश्यक है। नाइट्रोजन, फास्फोरस और पोटाश (NPK) को 4:2:1 के अनुपात में डालें। मिट्टी परीक्षण के अनुसार ही खाद की सही मात्रा निर्धारित करें।`;
          } else if (lower.includes('कीटनाशक') || lower.includes('pest') || lower.includes('स्प्रे')) {
            reply = `**फसल विशेषज्ञ (ऑफ़लाइन सलाह):**\n\nतेज़ हवा (10 किमी/घंटा से अधिक) चलने पर छिड़काव न करें। इससे दवा दूसरे खेतों में उड़ सकती है और नुकसान हो सकता है। छिड़काव हमेशा सुबह या शाम को शांत मौसम में ही करें।`;
          } else {
            reply = `**फसल विशेषज्ञ (ऑफ़लाइन सलाह):**\n\nमैंने आपका सवाल समझ लिया है। अभी आपका फोन इंटरनेट से कनेक्टेड नहीं है, इसलिए मैं ऑफलाइन मोड में काम कर रहा हूँ। \n\nआप अपनी फसल में संतुलित सिंचाई रखें, और खरपतवारों को नियंत्रित करें। इंटरनेट ऑन होने पर मैं आपको विस्तृत वैज्ञानिक समाधान प्रदान करूँगा।`;
          }
        } else if (lang === 'Punjabi') {
          if (lower.includes('ਪੀਲਾ') || lower.includes('yellow')) {
            reply = `**ਫਸਲ ਮਾਹਿਰ (ਔਫਲਾਈਨ ਸਲਾਹ):**\n\nਪੱਤਿਆਂ ਦਾ ਪੀਲਾ ਹੋਣਾ ਨਾਈਟ੍ਰੋਜਨ ਜਾਂ ਜਿੰਕ ਦੀ ਕਮੀ ਦਾ ਸੰਕੇਤ ਹੋ ਸਕਦਾ ਹੈ।\n\n*ਸਲਾਹ:* ੫ ਕਿਲੋ ਜਿੰਕ ਸਲਫੇਟ ਅਤੇ ੨ ਕਿਲੋ ਯੂਰੀਆ ਦਾ ਘੋਲ ਬਣਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਪ੍ਰੇਅ ਕਰੋ।`;
          } else if (lower.includes('ਖਾਦ') || lower.includes('fertilizer') || lower.includes('ਯੂਰੀਆ')) {
            reply = `**ਫਸਲ ਮਾਹਿਰ (ਔਫਲਾਈਨ ਸਲਾਹ):**\n\nਕਣਕ/ਝੋਨੇ ਲਈ NPK ਖਾਦਾਂ ਦਾ ਸੰਤੁਲਿਤ ਅਨੁਪਾਤ (੪:੨:੧) ਵਰਤੋ। ਜ਼ਿਆਦਾ ਯੂਰੀਆ ਨਾ ਪਾਓ।`;
          } else {
            reply = `**ਫਸਲ ਮਾਹਿਰ (ਔਫਲਾਈਨ ਸਲਾਹ):**\n\nਇੰਟਰਨੈਟ ਕਨੈਕਸ਼ਨ ਨਾ ਹੋਣ ਕਾਰਨ ਮੈਂ ਔਫਲਾਈਨ ਮੋਡ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰ ਰਿਹਾ ਹਾਂ। ਕਨੈਕਟ ਹੋਣ ਤੇ ਪੂਰੀ ਰਿਪੋਰਟ ਮਿਲੇਗੀ।`;
          }
        } else if (lang === 'Marathi') {
          if (lower.includes('पिवळी') || lower.includes('yellow')) {
            reply = `**पीक तज्ज्ञ (ऑफलाईन सल्ला):**\n\nपाने पिवळी पडणे हे नायट्रोजन किंवा जस्त (झिंक) च्या कमतरतेमुळे असू शकते।\n\n*सल्ला:* ५ किलो झिंक सल्फेट आणि २ किलो युरिया एकत्र करून प्रति एकर फवारणी करा।`;
          } else {
            reply = `**पीक तज्ज्ञ (ऑफलाईन सल्ला):**\n\nआपला फोन सध्या ऑफलाईन आहे। संतुलित पाणी व्यवस्थापन आणि खत वेळेवर द्या। इंटरनेट चालू झाल्यावर अधिक माहिती मिळेल।`;
          }
        } else if (lang === 'Telugu') {
          if (lower.includes('పసుపు') || lower.includes('yellow')) {
            reply = `**పంట నిపుణుడు (ఆఫ్‌లైన్ సలహా):**\n\nఆకులు పసుపు రంగులోకి మారడం నత్రజని లేదా జింక్ లోపాన్ని సూచిస్తుంది.\n\n*సలహా:* ఎకరాకు 5 కిలోల జింక్ సల్ఫేట్ మరియు 2 కిలోల యూరియా పిచికారీ చేయండి.`;
          } else {
            reply = `**పంట నిపుణుడు (ఆఫ్‌లైన్ సలహా):**\n\nఇంటర్నెట్ అందుబాటులో లేనందున ఆఫ్‌లైన్ లో సమాధానం ఇవ్వబడింది. మీ ఇంటర్నెట్ ఆన్ అయినప్పుడు మరింత సమాచారం లభిస్తుంది.`;
          }
        } else if (lang === 'Bengali') {
          if (lower.includes('হলুদ') || lower.includes('yellow')) {
            reply = `**কৃষি বিশেষজ্ঞ (অফলাইন পরামর্শ):**\n\nপাতা হলুদ হওয়া সাধারণত নাইট্রোজেন বা দস্তার অভাবকে বোঝায়।\n\n*পরামর্শ:* প্রতি একরে ৫ কেজি জিঙ্ক সালফেট ও ২ কেজি ইউরিয়া স্প্রে করুন।`;
          } else {
            reply = `**কৃষি विशेषज्ञ (অফলাইন পরামর্শ):**\n\nআপনার ইন্টারনেট সংযোগ নেই। সুস্থ ফসল উৎপাদনে সঠিক নিষ্কাশন রাখুন। কানেকশন সচল হলে বিস্তারিত জানানো হবে।`;
          }
        } else {
          if (lower.includes('yellow') || lower.includes('leaf')) {
            reply = `**Crop Agronomist (Offline Guidance):**\n\nLeaf yellowing is typically a sign of Nitrogen deficiency or Iron/Zinc trace nutrient starvation.\n\n*Action:* Spray 2% urea solution mixed with zinc sulfate (5g/liter) during dry early hours. Check soil moisture immediately.`;
          } else if (lower.includes('fertilizer') || lower.includes('urea') || lower.includes('npk')) {
            reply = `**Crop Agronomist (Offline Guidance):**\n\nEnsure a balanced application of NPK fertilizers in a standard ratio (4:2:1 for cereal crops like Wheat/Rice). Avoid dumping excessive nitrogen which attracts fungal blasts.`;
          } else if (lower.includes('pest') || lower.includes('spray') || lower.includes('wind')) {
            reply = `**Crop Agronomist (Offline Guidance):**\n\nDo NOT spray when wind speed exceeds 8 km/h. It causes drifting, wastes chemicals, and can harm neighboring beneficial crops. Spray during late afternoons.`;
          } else {
            reply = `**Crop Agronomist (Offline Guidance):**\n\nI have registered your inquiry about "${cleanText}". Since you are currently offline, I am utilizing our embedded agronomist knowledge-base.\n\nKeep standing water levels optimized and monitor leaf undersides for aphid colonies. Once your connection restores, I will fetch full scientific articles for you!`;
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          language: language,
          cropContext: primaryCrop
        })
      });

      if (!response.ok) {
        throw new Error('Chat failed');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Apologies, my system is currently updating. Please repeat the query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: lang === 'Hindi' ? 'क्षमा करें, कनेक्शन बाधित हो गया।' : 'Oops, connection disrupted. Ensure internet is active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Simulate Speak Voice question
  const handleSimulateVoice = () => {
    setIsRecording(true);
    
    // Simulate recording voice input for 2.5 seconds
    setTimeout(() => {
      setIsRecording(false);
      const simulatedText = lang === 'Hindi' 
        ? "धान में यूरिया की कितनी मात्रा डालनी चाहिए?"
        : lang === 'Punjabi'
        ? "ਝੋਨੇ ਵਿੱਚ ਕਿੰਨੀ ਯੂਰੀਆ ਪਾਉਣੀ ਚਾਹੀਦੀ ਹੈ?"
        : lang === 'Marathi'
        ? "भातात युरिया किती टाकावा?"
        : lang === 'Telugu'
        ? "వరి పంటకు ఎంత యూరియా వేయాలి?"
        : lang === 'Bengali'
        ? "ধানে ইউরিয়ার পরিমাণ কত হওয়া উচিত?"
        : "How much Urea dosage should I add in Paddy?";
      
      handleSendMessage(simulatedText);
    }, 2500);
  };

  const suggestions = DEFAULT_QUESTIONS[lang] || DEFAULT_QUESTIONS['English'];

  return (
    <div className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-fade-in font-sans h-[calc(100vh-140px)] max-w-4xl mx-auto text-left">
      
      {/* Voice Assistant Chat Header */}
      <div className="bg-emerald-600 p-4 sm:p-5 text-white flex items-center justify-between shadow">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2.5 bg-emerald-500 rounded-2xl">
            <Sprout className="h-5 w-5 text-emerald-100" />
          </div>
          <div className="text-left">
            <h2 className="font-display font-extrabold text-base sm:text-lg leading-tight text-left">
              {t('aiAgronomistExpertChat', lang)}
            </h2>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-100/90 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-200 animate-pulse"></span>
              <span>{isOnline ? t('online', lang) : t('offline', lang)} • {lang} {t('languageSuffix', lang)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-700/50 py-1.5 px-3 rounded-xl border border-emerald-500/10 font-bold shrink-0">
          <Languages className="h-4 w-4 text-emerald-200" />
          <span>{lang}</span>
        </div>
      </div>

      {/* Messages Feed panel */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50 text-left">
        
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div 
              key={m.id}
              className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto items-end animate-slide-in-right' : 'mr-auto items-start animate-slide-in-left'}`}
            >
              <div 
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm text-left ${
                  isUser 
                    ? 'bg-emerald-600 text-white rounded-tr-none font-medium' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none font-normal'
                }`}
              >
                {/* Formatting standard bullet bold headings cleanly */}
                {m.content.split('\n').map((line, idx) => {
                  const isBoldHeading = line.startsWith('**') && line.endsWith('**');
                  if (isBoldHeading) {
                    return <p key={idx} className="font-bold text-sm text-slate-900 mt-2 first:mt-0 text-left">{line.replace(/\*\*/g, '')}</p>;
                  }
                  
                  return (
                    <p key={idx} className={`${line.trim() === "" ? "h-2" : ""} text-left`}>
                      {line.split('**').map((part, pIdx) => {
                        return pIdx % 2 === 1 ? <strong key={pIdx} className={isUser ? "font-bold text-white" : "font-bold text-slate-950"}>{part}</strong> : part;
                      })}
                    </p>
                  );
                })}
              </div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex flex-col items-start max-w-[80%] mr-auto animate-pulse">
            <div className="p-3.5 bg-white border border-slate-100 text-slate-500 rounded-2xl rounded-tl-none text-xs flex items-center space-x-2.5 shadow-sm text-left">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              <span>{t('typing', lang)}</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion list */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto whitespace-nowrap text-left">
          {suggestions.map((q, idx) => {
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q.text)}
                className="text-xs font-bold bg-white text-emerald-800 border border-emerald-100 hover:border-emerald-300 py-2 px-3.5 rounded-full shadow-sm transition-all shrink-0 cursor-pointer"
              >
                {q.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Input panel with Send & Voice Trigger buttons */}
      <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-3 text-left">
        
        {/* Simulate Voice input Microphone */}
        <button
          type="button"
          onClick={handleSimulateVoice}
          className={`p-3.5 rounded-2xl shrink-0 transition-all active:scale-95 cursor-pointer outline-none ${
            isRecording 
              ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-200' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Tap to speak in local language"
        >
          {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {isRecording ? (
          <div className="flex-1 bg-rose-50 text-rose-800 border border-rose-100 rounded-2xl px-4 py-3.5 text-xs font-bold flex items-center space-x-3.5 animate-pulse text-left">
            <div className="h-2 w-2 rounded-full bg-rose-600 animate-ping"></div>
            <span>{lang === 'Hindi' ? 'माइक चालू है... बोलें' : lang === 'Punjabi' ? 'ਮਾਈਕ ਚਾਲੂ ਹੈ... ਬੋਲੋ' : lang === 'Marathi' ? 'माईक सुरू आहे... बोला' : lang === 'Telugu' ? 'మైక్రోఫోన్ ఆన్ చేయబడింది... మాట్లాడండి' : lang === 'Bengali' ? 'মাইক্রোফোন অন আছে... বলুন' : 'Recording voice... Speak now...'}</span>
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex-1 flex gap-2 text-left"
          >
            <input
              type="text"
              placeholder={t('messagePlaceholder', lang)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 text-slate-900 border-0 focus:bg-white rounded-2xl py-3.5 px-4 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 shadow-inner transition-all outline-none"
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
