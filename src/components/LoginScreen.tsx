import React, { useState } from 'react';
import { Phone, CheckCircle, ArrowLeft, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { Screen, Language } from '../types';
import { t } from '../localization';

interface LoginScreenProps {
  language: Language;
  onLoginSuccess: (phoneNumber: string) => void;
  onNavigate: (screen: Screen) => void;
}

const localT = {
  enterVerificationCode: {
    English: "Enter 4-Digit Verification Code",
    Hindi: "4-अंकीय सत्यापन कोड दर्ज करें",
    Punjabi: "4-ਅੰਕਾਂ ਦਾ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਦਰਜ ਕਰੋ",
    Marathi: "४-अंकी पडताळणी कोड टाका",
    Telugu: "4 అంకెల ధృవీకరణ కోడ్ నమోదు చేయండి",
    Bengali: "৪ অঙ্কের যাচাইকরণ কোড লিখুন",
  },
  verifyingCode: {
    English: "Verifying Code...",
    Hindi: "कोड सत्यापित किया जा रहा है...",
    Punjabi: "ਕੋਡ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    Marathi: "कोडची पडताळणी होत आहे...",
    Telugu: "కోడ్ ధృవీకరించబడుతోంది...",
    Bengali: "কোড যাচাই করা হচ্ছে...",
  },
  sendingOtp: {
    English: "Sending OTP...",
    Hindi: "ओटीपी भेजा जा रहा है...",
    Punjabi: "ਓਟੀਪੀ ਭੇਜਿਆ ਜਾ ਰਹੀ ਹੈ...",
    Marathi: "ओटीपी पाठवला जात आहे...",
    Telugu: "ఓటీపీ పంపబడుతోంది...",
    Bengali: "ওটিপি পাঠানো হচ্ছে...",
  },
  didNotReceiveCode: {
    English: "Didn't receive code?",
    Hindi: "कोड नहीं मिला?",
    Punjabi: "ਕੋਡ ਨਹੀਂ ਮਿਲਿਆ?",
    Marathi: "कोड मिळाला नाही?",
    Telugu: "కోడ్ రాలేదా?",
    Bengali: "কোড পাননি?",
  },
  resendOtp: {
    English: "Resend OTP",
    Hindi: "ओटीपी पुन: भेजें",
    Punjabi: "ਓਟੀਪੀ ਦੁਬਾਰਾ ਭੇਜੋ",
    Marathi: "ओटीपी पुन्हा पाठवा",
    Telugu: "ఓటీపీ మళ్ళీ పంపండి",
    Bengali: "ওটিপি পুনরায় পাঠান",
  },
  orContinueWith: {
    English: "Or continue with",
    Hindi: "या इसके साथ जारी रखें",
    Punjabi: "ਜਾਂ ਇਸ ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    Marathi: "किंवा याद्वारे सुरू ठेवा",
    Telugu: "లేదా దీనితో కొనసాగండి",
    Bengali: "অথবা এটি দিয়ে চালিয়ে যান",
  },
  signInWithGoogle: {
    English: "Sign in with Google",
    Hindi: "गूगल के साथ लॉगिन करें",
    Punjabi: "ਗੂਗਲ ਨਾਲ ਲੌਗਇਨ ਕਰੋ",
    Marathi: "गुगलद्वारे लॉगिन करा",
    Telugu: "గూగుల్ తో సైన్ ఇన్ చేయండి",
    Bengali: "গুগল দিয়ে সাইน ইন করুন",
  },
  secureIdentity: {
    English: "100% Secure agricultural identity verified",
    Hindi: "100% सुरक्षित कृषि पहचान सत्यापित",
    Punjabi: "100% ਸੁਰੱਖਿਅਤ ਖੇਤੀਬਾੜੀ ਪਛਾਣ ਦੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਗਈ",
    Marathi: "१००% सुरक्षित कृषी ओळख पडताळली",
    Telugu: "100% సురక్షితమైన వ్యవసాయ గుర్తింపు ధృవీకరించబడింది",
    Bengali: "১০০% নিরাপদ কৃষি পরিচয় যাচাইকৃত",
  },
  phoneValidation: {
    English: "Please enter a valid 10-digit mobile number",
    Hindi: "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें",
    Punjabi: "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ 10-ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    Marathi: "कृपया वैध १० अंकी मोबाईल नंबर टाका",
    Telugu: "దయచేసి సరైన 10 అంకెల మొబైల్ సంఖ్యను నమోదు చేయండి",
    Bengali: "অনুগ্রহ করে একটি সঠিক ১০ অঙ্কের মোবাইল নম্বর লিখুন",
  },
  otpValidation: {
    English: "Please enter the complete 4-digit verification code",
    Hindi: "कृपया पूरा 4-अंकीय सत्यापन कोड दर्ज करें",
    Punjabi: "ਕਿਰਪਾ ਕਰਕੇ ਪੂਰਾ 4-ਅੰਕਾਂ ਦਾ ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਦਰਜ ਕਰੋ",
    Marathi: "कृपया संपूर्ण ४ अंकी पडताळणी कोड टाका",
    Telugu: "దయచేసి పూర్తి 4 అంకెల ధృవీకరణ కోడ్‌ను నమోదు చేయండి",
    Bengali: "অনুগ্রহ করে সম্পূর্ণ ৪ অঙ্কের যাচাইকরণ কোড লিখুন",
  },
  simulationMsg: {
    English: "Resent verification code: 1234 (Simulation Mode)",
    Hindi: "सत्यापन कोड पुनः भेजा गया: 1234 (सिमुलेशन मोड)",
    Punjabi: "ਪੁਸ਼ਟੀਕਰਨ ਕੋਡ ਦੁਬਾਰਾ ਭੇਜਿਆ ਗਿਆ: 1234 (ਸਿਮੂਲੇਸ਼ਨ ਮੋਡ)",
    Marathi: "पडताळणी कोड पुन्हा पाठवला: १२३४ (सिम्युलेशन मोड)",
    Telugu: "ధృవీకరణ కోడ్ మళ్ళీ పంపబడింది: 1234 (సిమ్యులేషన్ మోడ్)",
    Bengali: "যাচাইকরণ কোড পুনরায় পাঠানো হয়েছে: ১২৩৪ (সিমুলেশন মোড)",
  }
};

export default function LoginScreen({ language, onLoginSuccess, onNavigate }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCodes, setOtpCodes] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getLocal = (key: keyof typeof localT) => {
    return localT[key][language] || localT[key]['English'];
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanPhone = phoneNumber.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError(getLocal('phoneValidation'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newCodes = [...otpCodes];
    newCodes[index] = value.slice(-1);
    setOtpCodes(newCodes);

    // Auto-focus next field
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const completeCode = otpCodes.join('');
    if (completeCode.length < 4) {
      setError(getLocal('otpValidation'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('+91 ' + phoneNumber);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-slate-50 to-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
        
        {/* Visual brand accent top header */}
        <div className="bg-emerald-600 px-6 py-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-2xl opacity-60"></div>
          <button 
            onClick={() => onNavigate('landing')}
            className="absolute top-4 left-4 p-2 bg-emerald-700/50 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="text-center space-y-2 mt-2">
            <div className="mx-auto bg-emerald-500/30 p-2.5 rounded-2xl w-fit flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-emerald-100" />
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
              {t('namaste', language)}!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm">
              {!otpSent ? t('enterPhone', language) : t('verifyOtp', language)}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-2xl flex items-start space-x-2 text-xs font-semibold animate-fade-in text-left">
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3.5 rounded-2xl flex items-start space-x-2 text-xs font-semibold animate-fade-in text-left">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {!otpSent ? (
            /* PHONE INPUT FORM */
            <form onSubmit={handleSendOtp} className="space-y-5 text-left">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t('enterPhone', language)}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm sm:text-base border-r border-slate-200 pr-3">
                    +91
                  </span>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="98765 43210"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 text-slate-900 border-0 focus:bg-white rounded-2xl py-3.5 pl-16 pr-4 text-sm sm:text-base font-semibold focus:ring-2 focus:ring-emerald-500 shadow-inner transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="text-xs text-slate-400 font-medium leading-relaxed">
                {t('agreeTerms', language)}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-emerald-200 hover:shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{getLocal('sendingOtp')}</span>
                  </span>
                ) : (
                  <>
                    <span>{t('sendOtp', language)}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP VERIFICATION FORM */
            <form onSubmit={handleVerifyOtp} className="space-y-6 text-left">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                  {getLocal('enterVerificationCode')}
                </label>
                
                <div className="flex justify-center gap-3">
                  {otpCodes.map((code, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={code}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !code && index > 0) {
                          const prevInput = document.getElementById(`otp-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 text-slate-950 text-center font-display font-extrabold text-xl sm:text-2xl rounded-2xl border-0 focus:bg-white focus:ring-2 focus:ring-emerald-500 shadow-inner transition-all outline-none"
                      required
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-emerald-200 hover:shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{getLocal('verifyingCode')}</span>
                    </span>
                  ) : (
                    <>
                      <span>{t('verifyAndLogin', language)}</span>
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center text-xs text-slate-500 px-1">
                  <span>{getLocal('didNotReceiveCode')}</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setOtpCodes(['', '', '', '']);
                      setError('');
                      setSuccess(getLocal('simulationMsg'));
                      setTimeout(() => setSuccess(''), 5000);
                    }}
                    className="font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    {getLocal('resendOtp')}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Third party sign in alternative */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-medium">{getLocal('orContinueWith')}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  onLoginSuccess('+91 99999 88888');
                }, 1000);
              }}
              className="w-full flex items-center justify-center space-x-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-2xl transition-all active:scale-95 cursor-pointer"
            >
              <svg className="h-4 w-4 sm:h-5 sm:s-5" viewBox="0 0 24 24" width="24" height="24">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.6h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4c0,-0.37 -0.04,-0.74 -0.1,-1H21.35z" fill="#4285F4" />
                  <path d="M12,20.5c2.3,0 4.23,-0.76 5.64,-2.1l-3.3,-2.6c-0.9,0.6 -2.07,0.97 -3.34,0.97c-2.57,0 -4.75,-1.73 -5.53,-4.07H2.07v2.68C3.53,18.06 7.45,20.5 12,20.5z" fill="#34A853" />
                  <path d="M6.47,12.7c-0.2,-0.6 -0.3,-1.24 -0.3,-1.9s0.1,-1.3 0.3,-1.9V6.22H2.07c-0.67,1.34 -1.07,2.85 -1.07,4.48s0.4,3.14 1.07,4.48l4.4,-3.48z" fill="#FBBC05" />
                  <path d="M12,6.13c1.25,0 2.37,0.43 3.25,1.27l2.43,-2.43C16.23,3.57 14.24,3 12,3C7.45,3 3.53,5.44 2.07,8.12l4.4,3.48C7.25,7.86 9.43,6.13 12,6.13z" fill="#EA4335" />
                </g>
              </svg>
              <span className="text-xs sm:text-sm">{getLocal('signInWithGoogle')}</span>
            </button>
          </div>

        </div>

        {/* Secure badge footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-center space-x-2 text-slate-500 text-xs font-semibold">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{getLocal('secureIdentity')}</span>
        </div>

      </div>
    </div>
  );
}
