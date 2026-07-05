import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Phone, 
  Globe, 
  Sprout, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  LogOut,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { User, Language, Crop, DiagnosisResult } from '../types';

interface ProfileTabProps {
  user: User;
  onUpdateLanguage: (lang: Language) => void;
  onLogOut: () => void;
  isOnline: boolean;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const PROFILE_LANG_TEXTS: Record<Language, any> = {
  English: {
    profileTitle: "Farmer Profile",
    personalDetails: "Personal Details",
    nameLabel: "Name",
    phoneLabel: "Phone Number",
    langLabel: "Selected Language",
    cropsLabel: "Cultivated Crops",
    locationLabel: "Farm Location",
    notDetected: "Not Detected",
    coordsLabel: "Coordinates",
    voiceLabel: "Voice Guidance",
    voiceOn: "Enabled",
    voiceOff: "Disabled",
    historyTitle: "Crop Disease Diagnosis History",
    noHistory: "No diagnosis history found. Scan a leaf in the Diagnosis tab to start!",
    clearHistory: "Clear History",
    severity: "Severity",
    confidence: "Confidence",
    date: "Scanned on",
    viewPrescription: "View Prescription",
    closeDetails: "Close Details",
    symptoms: "Symptoms",
    organic: "Organic Treatment",
    chemical: "Chemical Treatment",
    prevention: "Prevention Tips",
    logout: "Log Out of App"
  },
  Hindi: {
    profileTitle: "किसान प्रोफ़ाइल",
    personalDetails: "व्यक्तिगत विवरण",
    nameLabel: "नाम",
    phoneLabel: "फ़ोन नंबर",
    langLabel: "चुनी हुई भाषा",
    cropsLabel: "उगाई जाने वाली फसलें",
    locationLabel: "खेत का स्थान",
    notDetected: "पता नहीं चला",
    coordsLabel: "निर्देशांक",
    voiceLabel: "आवाज मार्गदर्शन",
    voiceOn: "सक्रिय",
    voiceOff: "निष्क्रिय",
    historyTitle: "फसल रोग निदान इतिहास",
    noHistory: "कोई निदान इतिहास नहीं मिला। शुरू करने के लिए डायग्नोसिस टैब में पत्ती स्कैन करें!",
    clearHistory: "इतिहास मिटाएं",
    severity: "तीव्रता",
    confidence: "विश्वास",
    date: "स्कैन तिथि",
    viewPrescription: "पर्चा देखें",
    closeDetails: "विवरण बंद करें",
    symptoms: "लक्षण",
    organic: "जैविक उपचार",
    chemical: "रासायनिक उपचार",
    prevention: "बचाव के तरीके",
    logout: "ऐप से लॉगआउट करें"
  },
  Punjabi: {
    profileTitle: "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ",
    personalDetails: "ਨਿੱਜੀ ਵੇਰਵੇ",
    nameLabel: "ਨਾਮ",
    phoneLabel: "ਫ਼ੋਨ ਨੰਬਰ",
    langLabel: "ਚੁਣੀ ਹੋਈ ਭਾਸ਼ਾ",
    cropsLabel: "ਬੀਜੀਆਂ ਫ਼ਸਲਾਂ",
    locationLabel: "ਖੇਤ ਦਾ ਸਥਾਨ",
    notDetected: "ਪਤਾ ਨਹੀਂ ਲੱਗਿਆ",
    coordsLabel: "ਨਿਰਦੇਸ਼ਾਂਕ",
    voiceLabel: "ਆਵਾਜ਼ ਮਾਰਗਦਰਸ਼ਨ",
    voiceOn: "ਚਾਲੂ",
    voiceOff: "ਬੰਦ",
    historyTitle: "ਫ਼ਸਲ ਰੋਗ ਨਿਦਾਨ ਇਤਿਹਾਸ",
    noHistory: "ਕੋਈ ਨਿਦਾਨ ਇਤਿਹਾਸ ਨਹੀਂ ਮਿਲਿਆ। ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਡਾਇਗਨੋਸਿਸ ਟੈਬ ਵਿੱਚ ਪੱਤਾ ਸਕੈਨ ਕਰੋ!",
    clearHistory: "ਇਤਿਹਾਸ ਸਾਫ਼ ਕਰੋ",
    severity: "ਤੀਬਰਤਾ",
    confidence: "ਭਰੋਸਾ",
    date: "ਸਕੈਨ ਕੀਤਾ ਗਿਆ",
    viewPrescription: "ਪਰਚਾ ਦੇਖੋ",
    closeDetails: "ਵੇਰਵੇ ਬੰਦ ਕਰੋ",
    symptoms: "ਲੱਛਣ",
    organic: "ਜੈਵਿਕ ਇਲਾਜ",
    chemical: "ਰਸਾਇਣਕ ਇਲਾਜ",
    prevention: "ਬਚਾਅ ਦੇ ਸੁਝਾਅ",
    logout: "ਐਪ ਤੋਂ ਲੌਗਆਉਟ ਕਰੋ"
  },
  Marathi: {
    profileTitle: "शेतकरी प्रोफाइल",
    personalDetails: "वैयक्तिक तपशील",
    nameLabel: "नाव",
    phoneLabel: "फोन नंबर",
    langLabel: "निवडलेली भाषा",
    cropsLabel: "लागवड केलेली पिके",
    locationLabel: "खेत स्थान",
    notDetected: "आढळले नाही",
    coordsLabel: "अक्षांश-रेखांश",
    voiceLabel: "आवाज मार्गदर्शन",
    voiceOn: "सुरू",
    voiceOff: "बंद",
    historyTitle: "पीक रोग निदान इतिहास",
    noHistory: "कोणताही निदान इतिहास आढळला नाही. सुरू करण्यासाठी निदान टॅबमध्ये पान स्कॅन करा!",
    clearHistory: "इतिहास पुसा",
    severity: "तीव्रता",
    confidence: "आत्मविश्वास",
    date: "स्कॅन तारीख",
    viewPrescription: "औषधोपचार पहा",
    closeDetails: "तपशील बंद करा",
    symptoms: "लक्षणे",
    organic: "सेंद्रिय उपचार",
    chemical: "रासायनिक उपचार",
    prevention: "प्रतिबंधात्मक उपाय",
    logout: "अॅपमधून बाहेर पडा"
  },
  Telugu: {
    profileTitle: "రైతు ప్రొఫైల్",
    personalDetails: "వ్యక్తిగత వివరాలు",
    nameLabel: "పేరు",
    phoneLabel: "ఫోన్ నంబర్",
    langLabel: "ఎంచుకున్న భాష",
    cropsLabel: "సాగు చేసే పంటలు",
    locationLabel: "పొలం స్థానం",
    notDetected: "గుర్తించబడలేదు",
    coordsLabel: "కోఆర్డినేట్లు",
    voiceLabel: "వాయిస్ గైడెన్స్",
    voiceOn: "ప్రారంభించబడింది",
    voiceOff: "నిలిపివేయబడింది",
    historyTitle: "పంట తెగుళ్ల నిర్ధారణ చరిత్ర",
    noHistory: "ఎలాంటి చరిత్ర లభించలేదు. ప్రారంభించడానికి డయాగ్నోసిస్ ట్యాబ్‌లో ఆకును స్కాన్ చేయండి!",
    clearHistory: "చరిత్రను తొలగించు",
    severity: "తీవ్రత",
    confidence: "విశ్వసనీయత",
    date: "スకాన్ చేసిన తేదీ",
    viewPrescription: "நிவారణோபாயాలు చూడు",
    closeDetails: "వివరాలు మూసివేయి",
    symptoms: "లక్షణాలు",
    organic: "సేంద్రీయ నివారణ",
    chemical: "రసాయన నివారణ",
    prevention: "ముందస్తు జాగ్రత్తలు",
    logout: "యాప్ నుండి లాగ్ అవుట్"
  },
  Bengali: {
    profileTitle: "কৃষক প্রোফাইল",
    personalDetails: "ব্যক্তিগত বিবরণ",
    nameLabel: "নাম",
    phoneLabel: "ফোন নম্বর",
    langLabel: "নির্বাচিত ভাষা",
    cropsLabel: "চাষ করা ফসল",
    locationLabel: "খামারের অবস্থান",
    notDetected: "শনাক্ত করা যায়নি",
    coordsLabel: "স্থানাঙ্ক",
    voiceLabel: "ভয়েস গাইডেন্স",
    voiceOn: "সক্ষম",
    voiceOff: "অক্ষম",
    historyTitle: "ফসলের রোগ নির্ণয়ের ইতিহাস",
    noHistory: "কোনো রোগ নির্ণয়ের ইতিহাস পাওয়া যায়নি। শুরু করতে ডায়াগনোসিস ট্যাবে একটি পাতা স্ক্যান করুন!",
    clearHistory: "ইতিহাস মুছুন",
    severity: "তীব্রতা",
    confidence: "নির্ভরযোগ্যতা",
    date: "স্ক্যান করা হয়েছে",
    viewPrescription: "প্রেসক্রিপশন দেখুন",
    closeDetails: "বন্ধ করুন",
    symptoms: "লক্ষণসমূহ",
    organic: "জৈব প্রতিকার",
    chemical: "রাসায়নিক প্রতিকার",
    prevention: "প্রতিরোধের উপায়",
    logout: "অ্যাপ থেকে লগ আউট"
  },
  Tamil: {
    profileTitle: "விவசாயி சுயவிவரம்",
    personalDetails: "தனிப்பட்ட விவரங்கள்",
    nameLabel: "பெயர்",
    phoneLabel: "தொலைபேசி எண்",
    langLabel: "தேர்ந்தெடுக்கப்பட்ட மொழி",
    cropsLabel: "பயிரிடப்பட்ட பயிர்கள்",
    locationLabel: "பண்ணை இருப்பிடம்",
    notDetected: "கண்டறியப்படவில்லை",
    coordsLabel: "ஆயத்தொலைவுகள்",
    voiceLabel: "குரல் வழிகாட்டுதல்",
    voiceOn: "செயல்படுத்தப்பட்டது",
    voiceOff: "முடக்கப்பட்டது",
    historyTitle: "பயிர் நோய் கண்டறிதல் வரலாறு",
    noHistory: "நோய் கண்டறிதல் வரலாறு எதுவும் இல்லை. தொடங்க நோய் கண்டறிதல் தாவலில் இலையை ஸ்கேன் செய்யவும்!",
    clearHistory: "வரலாற்றை அழி",
    severity: "தீவிரம்",
    confidence: "நம்பிக்கை",
    date: "ஸ்கேன் செய்யப்பட்ட நாள்",
    viewPrescription: "பரிந்துரையைப் பார்",
    closeDetails: "விவரங்களை மூடு",
    symptoms: "அறிகுறிகள்",
    organic: "இயற்கை சிகிச்சை",
    chemical: "இரசாயன சிகிச்சை",
    prevention: "தடுப்பு குறிப்புகள்",
    logout: "பயன்பாட்டிலிருந்து வெளியேறு"
  },
  Kannada: {
    profileTitle: "ರೈತರ ಪ್ರೊಫೈಲ್",
    personalDetails: "ವೈಯಕ್ತಿಕ ವಿವರಗಳು",
    nameLabel: "ಹೆಸರು",
    phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    langLabel: "ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆ",
    cropsLabel: "ಬೆಳೆಯುವ ಬೆಳೆಗಳು",
    locationLabel: "ಫಾರ್ಮ್ ಸ್ಥಳ",
    notDetected: "ಪತ್ತೆಯಾಗಿಲ್ಲ",
    coordsLabel: "ನಿರ್ದೇಶಾಂಕಗಳು",
    voiceLabel: "ಧ್ವನಿ ಮಾರ್ಗದರ್ಶನ",
    voiceOn: "ಸಕ್ರಿಯ",
    voiceOff: "ನಿಷ್ಕ್ರಿಯ",
    historyTitle: "ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಇತಿಹಾಸ",
    noHistory: "ಯಾವುದೇ ಇತಿಹಾಸ ಕಂಡುಬಂದಿಲ್ಲ. ಪ್ರಾರಂಭಿಸಲು ರೋಗ ಪತ್ತೆ ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಎಲೆಯನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ!",
    clearHistory: "ಇತಿಹಾಸ ಅಳಿಸು",
    severity: "ತೀವ್ರತೆ",
    confidence: "ಭರವಸೆ",
    date: "ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ದಿನಾಂಕ",
    viewPrescription: "ಪರಿಹಾರೋಪಾಯ ನೋಡಿ",
    closeDetails: "ವಿವರ ಮುಚ್ಚಿ",
    symptoms: "ಲಕ್ಷಣಗಳು",
    organic: "ಸಾವಯವ ಚಿಕિત્ಸೆ",
    chemical: "ರಾಸಾಯನಿಕ ಚಿಕિત્ಸೆ",
    prevention: "ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು",
    logout: "ಅಪ್ಲಿಕೇಶನ್‌ನಿಂದ ನಿರ್ಗಮಿಸಿ"
  },
  Malayalam: {
    profileTitle: "കർഷക പ്രൊഫൈൽ",
    personalDetails: "വ്യക്തിഗത വിവരങ്ങൾ",
    nameLabel: "പേര്",
    phoneLabel: "മൊബൈൽ നമ്പർ",
    langLabel: "തിരഞ്ഞെടുത്ത ഭാഷ",
    cropsLabel: "കൃഷി ചെയ്യുന്ന വിളകൾ",
    locationLabel: "കൃഷിയിടത്തിന്റെ സ്ഥലം",
    notDetected: "കണ്ടെത്തിയിട്ടില്ല",
    coordsLabel: "കോർഡിനേറ്റുകൾ",
    voiceLabel: "വോയ്‌സ് ഗൈഡൻസ്",
    voiceOn: "പ്രാപ്തമാക്കി",
    voiceOff: "അപ്രാപ്തമാക്കി",
    historyTitle: "വിള രോഗനിർണ്ണയ ചരിത്രം",
    noHistory: "രോഗനിർണ്ണയ ചരിത്രമൊന്നും കണ്ടെത്തിയില്ല. ആരംഭിക്കാൻ രോഗനിർണ്ണയ ടാബിൽ ഒരു ഇല സ്കാൻ ചെയ്യുക!",
    clearHistory: "ചരിത്രം മായ്ക്കുക",
    severity: "തീവ്രത",
    confidence: "ആത്മവിശ്വാസം",
    date: "സ്കാൻ ചെയ്ത തീയതി",
    viewPrescription: "പ്രതിവിധികൾ കാണുക",
    closeDetails: "വിശദാംശങ്ങൾ അടയ്ക്കുക",
    symptoms: "ലക്ഷണങ്ങൾ",
    organic: "ജൈവ ചികിത്സ",
    chemical: "രാസ ചികിത്സ",
    prevention: "പ്രതിരോധ മാർഗ്ഗങ്ങൾ",
    logout: "ആപ്പിൽ നിന്ന് ലോഗ് ഔട്ട് ചെയ്യുക"
  },
  Gujarati: {
    profileTitle: "ખેડૂત પ્રોફાઇલ",
    personalDetails: "વ્યક્તિગત વિગતો",
    nameLabel: "નામ",
    phoneLabel: "મોબાઈલ નંબર",
    langLabel: "પસંદ કરેલી ભાષા",
    cropsLabel: "વાવેતર કરેલ પાક",
    locationLabel: "ખેતરનું સ્થાન",
    notDetected: "મળ્યું નથી",
    coordsLabel: "નકશા કોઓર્ડિનેટ્સ",
    voiceLabel: "વોઇસ માર્ગદર્શન",
    voiceOn: "ચાલુ",
    voiceOff: "બંધ",
    historyTitle: "પાક રોગ નિદાન ઇતિહાસ",
    noHistory: "કોઈ નિદાન ઇતિહાસ મળ્યો નથી. શરૂ કરવા માટે રોગ નિદાન ટેબમાં પાંદડું સ્કેન કરો!",
    clearHistory: "ઇતિહાસ સાફ કરો",
    severity: "તીવ્રતા",
    confidence: "આત્મવિશ્વાસ",
    date: "સ્કેન તારીખ",
    viewPrescription: "પ્રિસ્ક્રિપ્શન જુઓ",
    closeDetails: "વિગતો બંધ કરો",
    symptoms: "લક્ષણો",
    organic: "ઓર્ગેનિક સારવાર",
    chemical: "રાસાયણિક સારવાર",
    prevention: "બચાવના ઉપાયો",
    logout: "એપમાંથી લોગઆઉટ કરો"
  },
  Odia: {
    profileTitle: "କୃଷକ ପ୍ରୋଫାଇଲ୍",
    personalDetails: "ବ୍ୟକ୍ତିଗত ବିବରଣୀ",
    nameLabel: "ନାମ",
    phoneLabel: "ମୋବାଇଲ୍ ନମ୍ବਰ",
    langLabel: "ଚୟନିତ ଭାଷา",
    cropsLabel: "ଚାଷ କରୁଥିବା ଫସଲ",
    locationLabel: "ଫାର୍ମର ଅବସ୍ଥିତି",
    notDetected: "ମିଳିଲା ନାହିଁ",
    coordsLabel: "ସ୍ଥାନାଙ୍କ",
    voiceLabel: "ସ୍ୱର ଗାଇଡ୍",
    voiceOn: "ସକ୍ରିୟ",
    voiceOff: "ନିଷ୍କ୍ରିୟ",
    historyTitle: "ଫସલ ରୋગ ନିରୂପଣ ଇତିହାସ",
    noHistory: "କୌଣସି ନିରୂପଣ ଇତିହାସ ମିଳିଲା ନାହିଁ । ଆରମ୍ଭ କରିବା ପାଇঁ ରୋଗ ନିରୂପଣ ଟ୍ୟାବରେ ପତ୍ର ସ୍କାନ କରନ୍ତୁ !",
    clearHistory: "ଇତିହାସ ସଫା କରନ୍ତু",
    severity: "ତୀବ୍ରତା",
    confidence: "ବିଶ୍ୱସନୀୟତା",
    date: "ସ୍କାନ ତାରିଖ",
    viewPrescription: "ପ୍ରେସକ୍ରିପସନ ଦେଖନ୍ତು",
    closeDetails: "ବନ୍ଦ କରନ୍ତୁ",
    symptoms: "ଲକ୍ଷଣ",
    organic: "ଜୈବିକ ପ୍ରତିକାର",
    chemical: "ରାସାયନିକ ପ୍ରତିକାର",
    prevention: "ପ୍ରତିରୋଧକ ଟିପ୍ସ",
    logout: "ଆପ୍‌ରୁ ଲଗ୍ ଆଉଟ୍"
  },
  Assamese: {
    profileTitle: "কৃষক প্ৰফাইল",
    personalDetails: "ব্যক্তিগত বিৱৰণ",
    nameLabel: "নাম",
    phoneLabel: "মোবাইল নম্বৰ",
    langLabel: "বাছনি কৰা ভাষা",
    cropsLabel: "খেতি কৰা শস্য",
    locationLabel: "ফাৰ্মৰ স্থান",
    notDetected: "পোৱা নগ’ল",
    coordsLabel: "স্থানাংক",
    voiceLabel: "ভইচ গাইডেন্স",
    voiceOn: "সক্ৰিয়",
    voiceOff: "অসক্ৰিয়",
    historyTitle: "শস্যৰ ৰোগ নিৰ্ণয়ৰ ইতিহাস",
    noHistory: "কোনো ৰোগ নিৰ্ণয়ৰ ইতিহাস পোৱা নগ’ল। আৰম্ভ কৰিবলৈ ৰোগ নিৰ্ণয় টেবত এটা পাত স্কেন কৰক!",
    clearHistory: "ইতিহাস মচক",
    severity: "তীব্ৰতা",
    confidence: "विश्वासযোগ্যতা",
    date: "স্কেন কৰা হৈছে",
    viewPrescription: "প্ৰেছক্ৰিপচন চাওক",
    closeDetails: "বন্ধ কৰক",
    symptoms: "লক্ষণসমূহ",
    organic: "জৈৱিক চিকিৎসা",
    chemical: "ৰাসায়নিক চিকিৎসা",
    prevention: "প্ৰতিৰোধমূলক দিহা",
    logout: "এপৰ পৰা লগ আউট"
  }
};

const LANGUAGES_SUPPORTED: { code: Language; name: string; native: string }[] = [
  { code: 'English', name: 'English', native: 'English' },
  { code: 'Hindi', name: 'Hindi', native: 'हिन्दी' },
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

export default function ProfileTab({ user, onUpdateLanguage, onLogOut, isOnline, theme, setTheme }: ProfileTabProps) {
  const lang: Language = user.language;
  const t = (key: string) => PROFILE_LANG_TEXTS[lang]?.[key] || PROFILE_LANG_TEXTS['English']?.[key] || key;

  const [history, setHistory] = useState<any[]>([]);
  const [expandedScanId, setExpandedScanId] = useState<string | null>(null);
  const [localVoiceEnabled, setLocalVoiceEnabled] = useState(user.voiceEnabled);

  useEffect(() => {
    // Load search history
    const existing = localStorage.getItem('fasal_scan_history');
    if (existing) {
      try {
        setHistory(JSON.parse(existing));
      } catch (e) {
        console.error('Failed to parse scan history:', e);
      }
    }
  }, []);

  const handleToggleVoice = () => {
    const newVal = !localVoiceEnabled;
    setLocalVoiceEnabled(newVal);
    user.voiceEnabled = newVal;
    
    // Save to user settings
    try {
      const savedUser = localStorage.getItem('fasal_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        u.voiceEnabled = newVal;
        localStorage.setItem('fasal_user', JSON.stringify(u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(lang === 'Hindi' ? 'क्या आप वाकई अपना सारा निदान इतिहास मिटाना चाहते हैं?' : 'Are you sure you want to clear your entire diagnosis history?')) {
      localStorage.removeItem('fasal_scan_history');
      setHistory([]);
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'healthy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      {/* HEADER SECTION */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
              <UserIcon className="h-5 w-5" />
            </span>
            <span>{t('profileTitle')}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Fasal ID: FD-{user.phone.slice(-4)} • Live Connected</p>
        </div>
        
        <button
          onClick={onLogOut}
          className="px-3 py-1.5 bg-white border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-sm cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t('logout')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: FARMER PROFILE DETAILS CARD */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-50 -z-10" />
            
            <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
              <div className="w-20 h-20 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md relative mb-3 overflow-hidden border-2 border-white">
                <span className="text-3xl font-bold tracking-wider">{user.name.slice(0, 2).toUpperCase()}</span>
                <div className="absolute bottom-0 right-0 bg-emerald-500 w-3 h-3 border-2 border-white rounded-full" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{user.crops[0] || 'Rice'} Cultivator</p>
            </div>

            {/* FARMER INFORMATION DETAILS LIST */}
            <div className="py-4 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('phoneLabel')}</span>
                  <span className="text-sm font-semibold text-slate-800">{user.phone}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('langLabel')}</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{user.language}</span>
                    <select
                      value={user.language}
                      onChange={(e) => onUpdateLanguage(e.target.value as Language)}
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 outline-none font-bold text-emerald-700 hover:bg-slate-100"
                    >
                      {LANGUAGES_SUPPORTED.map((l) => (
                        <option key={l.code} value={l.code}>{l.native}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Sprout className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('cropsLabel')}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {user.crops.map((c) => (
                      <span key={c} className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg px-2 py-0.5 shadow-sm">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('locationLabel')}</span>
                  <span className="text-xs font-semibold text-slate-700 block truncate leading-tight">
                    {user.location?.address || t('notDetected')}
                  </span>
                  {user.location?.lat && (
                    <span className="text-[9px] font-mono font-bold text-slate-400 block mt-0.5">
                      Lat: {user.location.lat.toFixed(4)}, Lng: {user.location.lng?.toFixed(4)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* VOICE ASSISTANT INTERACTIVE SWITCH */}
            <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl transition-colors ${localVoiceEnabled ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {localVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">{t('voiceLabel')}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">{localVoiceEnabled ? t('voiceOn') : t('voiceOff')}</span>
                  </div>
                </div>
                
                {/* Switch Button Toggle */}
                <button
                  onClick={handleToggleVoice}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 outline-none cursor-pointer ${
                    localVoiceEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                  }`}
                >
                  <motion.div 
                    layout 
                    className="bg-white w-5 h-5 rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {/* DARK MODE INTERACTIVE SWITCH */}
            <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'}`}>
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                      {lang === 'Hindi' ? 'डार्क थीम' : lang === 'Punjabi' ? 'ਡਾਰਕ ਥੀਮ' : lang === 'Marathi' ? 'डार्क थीम' : lang === 'Telugu' ? 'డార్క్ థీమ్' : lang === 'Bengali' ? 'ডার্ক থিম' : 'Dark Theme'}
                    </span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                      {theme === 'dark' ? (lang === 'Hindi' ? 'सक्रिय' : 'Enabled') : (lang === 'Hindi' ? 'निष्क्रिय' : 'Disabled')}
                    </span>
                  </div>
                </div>
                
                {/* Switch Button Toggle */}
                <button
                  type="button"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 outline-none cursor-pointer ${
                    theme === 'dark' ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-slate-800 justify-start'
                  }`}
                >
                  <motion.div 
                    layout 
                    className="bg-white w-5 h-5 rounded-full shadow-sm"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: DISEASE SEARCH & DIAGNOSIS HISTORY */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50">
              <h2 className="font-display font-bold text-sm sm:text-base text-slate-800 flex items-center space-x-2">
                <Clock className="h-4.5 w-4.5 text-slate-400" />
                <span>{t('historyTitle')}</span>
                {history.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {history.length}
                  </span>
                )}
              </h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{t('clearHistory')}</span>
                </button>
              )}
            </div>

            {/* EMPTY STATE */}
            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-xs font-semibold text-slate-400 max-w-sm leading-relaxed">
                  {t('noHistory')}
                </p>
              </div>
            ) : (
              // ACTIVE SCANS LIST
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {history.map((item) => {
                  const isExpanded = expandedScanId === item.id;
                  return (
                    <div 
                      key={item.id} 
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isExpanded ? 'border-emerald-300 shadow-md ring-2 ring-emerald-50' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/20'
                      }`}
                    >
                      {/* CARD HEADER */}
                      <div 
                        onClick={() => setExpandedScanId(isExpanded ? null : item.id)}
                        className="p-3 sm:p-4 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Photo preview or generic placeholder */}
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center relative">
                            {item.image ? (
                              <img src={item.image} alt={item.diagnosis} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Sprout className="h-5 w-5 text-emerald-600" />
                            )}
                            <div className="absolute top-0 left-0 bg-emerald-600 text-white text-[8px] px-1 font-bold rounded-br">
                              {item.crop}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                              {item.diagnosis}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border ${getSeverityBadgeColor(item.severity)}`}>
                                {item.severity}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                {t('confidence')}: <span className="text-slate-600 font-extrabold">{item.confidence}</span>
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 hidden xs:inline">•</span>
                              <span className="text-[9px] font-medium text-slate-400 flex items-center">
                                <Clock className="h-2.5 w-2.5 mr-0.5" />
                                {item.timestamp}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-slate-400 pl-2">
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>

                      {/* COLLAPSED DETAILS CARD FOR THE DIAGNOSIS PRESCRIPTION */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-emerald-50/30 border-t border-slate-100 p-4 space-y-4"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  <span>{t('organic')}</span>
                                </h4>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white border border-emerald-100/50 rounded-xl p-2.5 shadow-sm">
                                  {/* Since treatment is nested, sometimes history stored it directly, handle both string / object paths */}
                                  {item.treatment?.organic || "Isolate infected crops immediately. Apply organic Neem leaf decoction or Pseudomonas fluorescens culture bio-fungicide directly onto foliage."}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center">
                                  <FileText className="h-3 w-3 mr-1" />
                                  <span>{t('chemical')}</span>
                                </h4>
                                <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white border border-amber-100/50 rounded-xl p-2.5 shadow-sm">
                                  {item.treatment?.chemical || "If severity exceeds 15%, spray Propiconazole 25% EC (1 ml/L) or Tricyclazole 75% WP (0.6 g/L) safely during clear wind-free hours."}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                                <span>{t('prevention')}</span>
                              </h4>
                              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                                {item.treatment?.prevention || "Utilize certified disease-resistant seed strains, implement periodic crop rotations with legumes, and maintain balanced soil nitrogen hydration levels."}
                              </p>
                            </div>

                            {item.symptoms && item.symptoms.length > 0 && (
                              <div className="space-y-1">
                                <h4 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider">
                                  <span>{t('symptoms')}</span>
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                  {(Array.isArray(item.symptoms) ? item.symptoms : [item.symptoms]).map((sym: string, i: number) => (
                                    <span key={i} className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-2 py-0.5">
                                      {sym}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
