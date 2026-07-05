export type Language = 'English' | 'Hindi' | 'Punjabi' | 'Marathi' | 'Telugu' | 'Bengali' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Gujarati' | 'Odia' | 'Assamese';

export type Crop = 'Rice' | 'Wheat' | 'Cotton' | 'Mustard' | 'Sugarcane' | 'Tomatoes';

export type Screen = 
  | 'landing' 
  | 'login' 
  | 'otp' 
  | 'onboarding-1' 
  | 'onboarding-2' 
  | 'onboarding-3' 
  | 'dashboard' 
  | 'insights' 
  | 'diagnosis' 
  | 'assistant' 
  | 'market' 
  | 'profile'
  | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface DiagnosisResult {
  id?: string;
  crop: string;
  diagnosis: string;
  severity: 'Healthy' | 'Low' | 'Medium' | 'High' | string;
  confidence: string;
  symptoms: string[];
  causes: string;
  treatment: {
    organic: string;
    chemical: string;
    prevention: string;
  };
}

export interface User {
  name: string;
  phone: string;
  language: Language;
  location: {
    lat?: number;
    lng?: number;
    address?: string;
  } | null;
  crops: Crop[];
  voiceEnabled: boolean;
}

export interface MandiPrice {
  mandiName: string;
  commodity: string;
  price: number; // in Rs per quintal
  change: number; // positive or negative percentage
  volume: string;
  distance: string;
}
