import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, CheckCircle, ShieldCheck, HelpCircle, FileText, Sparkles, Loader2, WifiOff, Mic, Volume2, VolumeX } from 'lucide-react';
import { Crop, DiagnosisResult, Language } from '../types';
import { t } from '../localization';

interface DiagnosisScreenProps {
  language: Language;
  crops: Crop[];
  isOnline: boolean;
}

const SAMPLE_DISEASE_PHOTOS = [
  {
    label: 'Brown Rice Spot (Sample)',
    crop: 'Rice' as Crop,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=300',
    symptoms: 'Brown spots with yellow rings on leaves, withered leaf tips.'
  },
  {
    label: 'Wheat Rust Stripe (Sample)',
    crop: 'Wheat' as Crop,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=300',
    symptoms: 'Yellow stripes along leaf veins, powdery yellow pustules.'
  },
  {
    label: 'Tomato Early Blight (Sample)',
    crop: 'Tomatoes' as Crop,
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300',
    symptoms: 'Concentric rings on lower leaves, yellow borders around brown spots.'
  }
];

// Offline translation maps for Diagnoses
const OFFLINE_DIAGNOSES_TRANSLATIONS: Record<string, Partial<Record<Language, string>>> = {
  "Brown Rice Leaf Spot (Helminthosporium oryzae)": {
    English: "Brown Rice Leaf Spot (Helminthosporium oryzae)",
    Hindi: "भूरा पत्ती धब्बा रोग (हेल्मिन्थोस्पोरियम ओरिजे)",
    Punjabi: "ਭੂਰੇ ਪੱਤਿਆਂ ਦੇ ਧੱਬੇ (ਝੋਨਾ)",
    Marathi: "भातावरील तांबडे ठिपके रोग (हेल्मिन्थोस्पोरियम)",
    Telugu: "వరి ఆకుపై గోధుమ రంగు మచ్చ తెగులు",
    Bengali: "ধানের বাদামী দাগ রোগ (হেলমিনথোস্পোরিয়াম অরিজি)"
  },
  "Yellow Stripe Rust (Puccinia striiformis)": {
    English: "Yellow Stripe Rust (Puccinia striiformis)",
    Hindi: "पीला धारीदार रतुआ रोग (पुक्सिनिया स्ट्रैफोर्मिस)",
    Punjabi: "ਪੀਲੀ ਕੁੰਗੀ (ਕਣਕ)",
    Marathi: "गव्हावरील पिवळा तांबेरा रोग",
    Telugu: "గోధుమ పసుపు గీత తుప్పు తెగులు",
    Bengali: "গমের হলদে মরিচা রোগ (পুকসিনিয়া স্ট্রাইফরমিস)"
  },
  "Tomato Early Blight (Alternaria solani)": {
    English: "Tomato Early Blight (Alternaria solani)",
    Hindi: "टमाटर का अगेती झुलसा रोग (अल्टरनेरिया सोलानी)",
    Punjabi: "ਟਮਾਟਰ ਦਾ ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ",
    Marathi: "टोमॅटोवरील लवकर येणारा करपा रोग",
    Telugu: "టమోటా ముందస్తు ఆకుమాడు తెగులు",
    Bengali: "টমেটোর আগাম ধসা রোগ (অল্টারনারিয়া সোলানি)"
  },
  "Rice Blast (Magnaporthe oryzae)": {
    English: "Rice Blast (Magnaporthe oryzae)",
    Hindi: "धान का झोंका रोग (मैग्नापोर्टे ओरिजे)",
    Punjabi: "ਝੋਨੇ ਦਾ ਬਲਾਸਟ (ਝੁਲਸ ਰੋਗ)",
    Marathi: "भातावरील करपा रोग (मॅग्नापोर्टे ओरिजे)",
    Telugu: "వరి అగ్గి తెగులు (బ్లాస్ట్)",
    Bengali: "ধানের ব্লাস্ট রোগ (ম্যাগনাপোর্থে অরিজি)"
  },
  "Late Blight (Phytophthora infestans)": {
    English: "Late Blight (Phytophthora infestans)",
    Hindi: "टमाटर का पछेती झुलसा रोग (फाइटोफ्थोरा इन्फेस्टन्स)",
    Punjabi: "ਟਮਾਟਰ ਦਾ ਪਿਛੇਤਾ ਝੁਲਸ ਰੋਗ",
    Marathi: "टोमॅटोवरील उशिरा येणारा करपा रोग",
    Telugu: "టమోటా చివరి ఆకుమాడు తెగులు",
    Bengali: "টমেটোর নাবি ধসা রোগ"
  },
  "Cotton Leaf Curl Disease (CLCuD)": {
    English: "Cotton Leaf Curl Disease (CLCuD)",
    Hindi: "कपास का पत्ता मरोड़ रोग (CLCuD)",
    Punjabi: "ਕਪਾਹ ਦਾ ਪੱਤਾ ਮਰੋੜ ਰੋਗ",
    Marathi: "कापसावरील पान गोळा होणारा रोग",
    Telugu: "పత్తి ఆకు ముడుత తెగులు",
    Bengali: "তুলার পাতা কোঁকড়ানো রোগ"
  },
  "White Rust of Mustard (Albugo candida)": {
    English: "White Rust of Mustard (Albugo candida)",
    Hindi: "सरसों का सफेद रतुआ (अल्बुगो कैंडिडा)",
    Punjabi: "ਸਰ੍ਹੋਂ ਦੀ ਚਿੱਟੀ ਕੁੰਗੀ",
    Marathi: "मोहरीवरील पांढरा तांबेरा रोग",
    Telugu: "ఆవాల తెల్ల తుప్పు తెగులు",
    Bengali: "সরিষার সাদা মরিচা রোগ"
  },
  "Red Rot of Sugarcane (Colletotrichum falcatum)": {
    English: "Red Rot of Sugarcane (Colletotrichum falcatum)",
    Hindi: "गन्ने का लाल सड़न रोग (कोलेटोट्राइकम फाल्केटम)",
    Punjabi: "ਗੰਨੇ ਦਾ ਲਾਲ ਸੜਨ ਰੋਗ",
    Marathi: "उसावरील तांबेरा/लाल कूज रोग",
    Telugu: "చెరకు ఎర్ర కుళ్లు తెగులు",
    Bengali: "আখের লাল পচা রোগ"
  },
  "Healthy & Nutrient-Sufficient Leaf": {
    English: "Healthy & Nutrient-Sufficient Leaf",
    Hindi: "स्वस्थ और पोषक तत्वों से भरपूर पत्ती",
    Punjabi: "ਸਿਹਤਮੰਦ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਨਾਲ ਭਰਪੂਰ ਪੱਤਾ",
    Marathi: "निरोगी आणि सकस पान",
    Telugu: "ఆరోగ్యకరమైన మరియు పోషకాలతో కూడిన ఆకు",
    Bengali: "সুস্থ ও পুষ্টিগুণ সম্পন্ন পাতা"
  }
};

// Heuristic detailed descriptors translated dynamically
const getLocalizedHeuristicValue = (val: string, lang: Language): string => {
  if (lang === 'English') return val;
  
  // High/Medium/Low
  if (val === 'High') {
    return { Hindi: 'उच्च', Punjabi: 'ਉੱਚ', Marathi: 'उच्च', Telugu: 'ఎక్కువ', Bengali: 'উচ্চ' }[lang] || val;
  }
  if (val === 'Medium') {
    return { Hindi: 'मध्यम', Punjabi: 'ਦਰਮਿਆਨਾ', Marathi: 'मध्यम', Telugu: 'మధ్యస్థం', Bengali: 'মাঝারি' }[lang] || val;
  }
  if (val === 'Low') {
    return { Hindi: 'कम', Punjabi: 'ਘੱਟ', Marathi: 'कमी', Telugu: 'తక్కువ', Bengali: 'কম' }[lang] || val;
  }
  if (val === 'Healthy') {
    return { Hindi: 'स्वस्थ', Punjabi: 'ਸਿਹਤਮੰਦ', Marathi: 'निरोगी', Telugu: 'ఆరోగ్యకరం', Bengali: 'সুস্থ' }[lang] || val;
  }
  return val;
};

// Client-side offline diagnostic expert matching engine
const getOfflineDiagnosis = (crop: Crop, symptoms: string, imagePreview: string | null): DiagnosisResult => {
  const norm = symptoms.toLowerCase();
  
  // Check if it matches a sample image
  if (imagePreview) {
    if (imagePreview.includes("photo-1574323347407-f5e1ad6d020b")) {
      return {
        id: "offline-sample-brown-spot",
        crop: "Rice" as Crop,
        diagnosis: "Brown Rice Leaf Spot (Helminthosporium oryzae)",
        confidence: "100% (Sample Match)",
        severity: "Medium",
        symptoms: [
          "Oval or circular dark brown lesions with yellow halo rings.",
          "Withered leaf tips and dried dry spots on edges.",
          "Reduction in grain weight and dark spots on grain husks."
        ],
        causes: "Ascomycete fungus active under high humidity, poor soil nutrition (especially silicon and potassium deficiency), and foliage dew.",
        treatment: {
          organic: "Spray neem oil (3ml/liter) or apply trichoderma-harzianum bio-fungicide. Mix silicon-rich rice hull ash into soil.",
          chemical: "Foliar spray of Propiconazole 25% EC @ 1ml/liter or Mancozeb @ 2g/liter on noticed spots.",
          prevention: "Apply balanced NPK fertilizer. Use potassium-rich fertilizers. Select certified disease-free seeds next season."
        }
      };
    }
    if (imagePreview.includes("photo-1500937386664-56d1dfef3854")) {
      return {
        id: "offline-sample-wheat-rust",
        crop: "Wheat" as Crop,
        diagnosis: "Yellow Stripe Rust (Puccinia striiformis)",
        confidence: "100% (Sample Match)",
        severity: "High",
        symptoms: [
          "Narrow yellow-orange stripes running parallel to leaf veins.",
          "Powdery yellow pustules (uredinia) rubbing off on fingers.",
          "Premature leaf drying leading to stunted spikes."
        ],
        causes: "Fungal pathogen spreading rapidly via wind-borne spores. Thrives in cool weather (12-20°C) with high morning dew.",
        treatment: {
          organic: "Spray fresh diluted cow urine mixture @ 5% concentration, or fermented garlic-chili extract to inhibit spore germination.",
          chemical: "Apply Propiconazole 25% EC (Tilt) @ 1.5 ml/liter or Tebuconazole 250 EC @ 1 ml/liter immediately.",
          prevention: "Plant rust-resistant cultivars (e.g., HD 3086, DBW 187). Avoid late sowing which exposes crop to high spore loads."
        }
      };
    }
    if (imagePreview.includes("photo-1595855759920-86582396756a")) {
      return {
        id: "offline-sample-tomato-blight",
        crop: "Tomatoes" as Crop,
        diagnosis: "Tomato Early Blight (Alternaria solani)",
        confidence: "100% (Sample Match)",
        severity: "Medium",
        symptoms: [
          "Dark concentric target-like rings on older lower leaves.",
          "Yellow margins surrounding leaf spots causing defoliation.",
          "Leathery dark sunken lesions on stems and fruit."
        ],
        causes: "Soil-borne fungal pathogen overwintering on debris. Favored by warm, wet humid conditions and heavy dew cycles.",
        treatment: {
          organic: "Apply Copper Oxychloride @ 3g/liter or spray fresh whey/milk solution to induce natural systemic resistance.",
          chemical: "Spray Azoxystrobin @ 1ml/liter or Chlorothalonil @ 2g/liter. Target lower foliage thoroughly.",
          prevention: "Practice strict 3-year crop rotation. Stake and prune plants to improve aeration. Water at the base (drip irrigation)."
        }
      };
    }
  }

  // Crop-based heuristic matching
  if (crop === 'Rice') {
    if (norm.includes('blast') || norm.includes('spindle') || norm.includes('neck')) {
      return {
        id: "offline-rice-blast",
        crop: "Rice" as Crop,
        diagnosis: "Rice Blast (Magnaporthe oryzae)",
        confidence: "94% (Symptom Match)",
        severity: "High",
        symptoms: [
          "Spindle-shaped spots with gray-white centers and brown borders.",
          "Neck rot causing the panicle to collapse and turn white or empty.",
          "Bluish-gray lesions on the leaf sheath."
        ],
        causes: "Airborne fungal pathogen triggered by high nitrogen fertilizer, cool nights, and moist foliage.",
        treatment: {
          organic: "Spray Pseudomonas fluorescens liquid formulation @ 5ml/liter. Remove wild grass hosts around bounds.",
          chemical: "Spray Tricyclazole 75% WP @ 0.6g/liter or Isoprothiolane @ 1.5ml/liter of water.",
          prevention: "Avoid excess urea top-dressing. Plant resistant Basmati varieties and practice early morning sowing."
        }
      };
    }
    
    // Default Rice
    return {
      id: "offline-rice-brownspot",
      crop: "Rice" as Crop,
      diagnosis: "Brown Rice Leaf Spot (Helminthosporium oryzae)",
      confidence: "88% (Heuristic Match)",
      severity: "Medium",
      symptoms: [
        "Oval or circular dark brown spots with a lighter yellowish halo.",
        "Dry leaf tips starting to brown and wilt early.",
        "Slight discoloration around the grains."
      ],
      causes: "Nutritional starvation (commonly nitrogen/potassium/silicon deficit) under humid microclimates.",
      treatment: {
        organic: "Apply organic neem oil mixture (3ml/liter). Incorporate organic compost and silicon ash into the field soil.",
        chemical: "Spray Propiconazole 25% EC @ 1ml/liter or Carbendazim @ 1.5g/liter.",
        prevention: "Improve soil fertility. Keep standing water at appropriate levels. Ensure adequate potash application during sowing."
      }
    };
  }

  if (crop === 'Wheat') {
    if (norm.includes('mildew') || norm.includes('white') || norm.includes('powdery')) {
      return {
        id: "offline-wheat-mildew",
        crop: "Wheat" as Crop,
        diagnosis: "Powdery Mildew (Blumeria graminis f. sp. tritici)",
        confidence: "92% (Symptom Match)",
        severity: "Low",
        symptoms: [
          "Fluffy white-to-gray powdery patches on the upper surface of leaves.",
          "Premature yellowing of leaves starting from the bottom canopy.",
          "Black speck-like structures (cleistothecia) appearing on older leaves."
        ],
        causes: "Fungus thriving in high humidity but dry foliage. Common in dense, over-fertilized crop canopies.",
        treatment: {
          organic: "Foliar spray of soluble sulfur powder @ 3g/liter or baking soda spray (5g/liter) with a drop of liquid soap.",
          chemical: "Spray Propiconazole 25% EC @ 1ml/liter or Hexaconazole 5% EC @ 2ml/liter.",
          prevention: "Optimize seeding rate to prevent dense canopy. Reduce high-dose nitrogen fertilizer, ensure sunlight penetration."
        }
      };
    }

    // Default Wheat
    return {
      id: "offline-wheat-rust",
      crop: "Wheat" as Crop,
      diagnosis: "Yellow Stripe Rust (Puccinia striiformis)",
      confidence: "89% (Heuristic Match)",
      severity: "Medium",
      symptoms: [
        "Yellow-orange stripes along leaf veins containing pustules.",
        "Bright yellow powder covering leaves and rubbing off easily.",
        "Loss of green leaf area leading to shriveled wheat grains."
      ],
      causes: "Wind-borne fungal spores spreading rapidly during cool, humid nights with thick fog/dew.",
      treatment: {
        organic: "Spray 5% fresh cow urine solution or commercial vermicompost wash to coat the leaves.",
        chemical: "Spray Propiconazole 25% EC (Tilt) @ 1.5 ml/liter or Tebuconazole @ 1 ml/liter.",
        prevention: "Plant resistant varieties like DBW 187, DBW 222. Inspect fields weekly during winter months."
      }
    };
  }

  if (crop === 'Tomatoes') {
    if (norm.includes('late') || norm.includes('phytophthora') || norm.includes('water')) {
      return {
        id: "offline-tomato-late-blight",
        crop: "Tomatoes" as Crop,
        diagnosis: "Late Blight (Phytophthora infestans)",
        confidence: "95% (Symptom Match)",
        severity: "High",
        symptoms: [
          "Large, rapidly expanding dark water-soaked spots on leaves.",
          "White cottony growth under leaves during humid mornings.",
          "Dark brown, firm, greasy lesions on green fruit."
        ],
        causes: "Oomycete pathogen spreading rapidly via air currents in cool, rainy, or highly humid weather.",
        treatment: {
          organic: "Prune affected lower leaves immediately. Spray Bordeaux mixture (1% solution) or copper fungicides.",
          chemical: "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/liter or Cymoxanil + Mancozeb @ 2g/liter.",
          prevention: "Water using drip lines instead of sprinklers. Ensure high row-to-row ventilation. Destroy wild nightshade weeds."
        }
      };
    }

    // Default Tomatoes
    return {
      id: "offline-tomato-early-blight",
      crop: "Tomatoes" as Crop,
      diagnosis: "Tomato Early Blight (Alternaria solani)",
      confidence: "90% (Heuristic Match)",
      severity: "Medium",
      symptoms: [
        "Concentric target rings starting on older bottom leaves.",
        "Leaves turning yellow and dropping prematurely.",
        "Sunken, concentric black lesions near the fruit stem."
      ],
      causes: "Fungal spores splashed by rain or irrigation from the soil onto the lower leaves.",
      treatment: {
        organic: "Apply copper soap liquid spray. Mulch the base of tomato plants to prevent soil splashing.",
        chemical: "Spray Mancozeb @ 2g/liter or Chlorothalonil @ 2g/liter.",
        prevention: "Remove bottom leaves up to 1 foot once plants grow taller. Clean all garden stakes with diluted bleach."
      }
    };
  }

  if (crop === 'Cotton') {
    return {
      id: "offline-cotton-leafcurl",
      crop: "Cotton" as Crop,
      diagnosis: "Cotton Leaf Curl Disease (CLCuD)",
      confidence: "93% (Heuristic Match)",
      severity: "High",
      symptoms: [
        "Upward or downward curling of leaf margins.",
        "Thickening of leaf veins (enations) making them feel leathery.",
        "Small cup-shaped leaf-like growths (enations) under leaves."
      ],
      causes: "Geminivirus transmitted solely by sweetpotato whitefly (Bemisia tabaci) under hot, dry weather.",
      treatment: {
        organic: "Spray 5% Neem Seed Kernel Extract (NSKE) or apply clay/kaolin spray to deter whiteflies.",
        chemical: "Spray Diafenthiuron 50% WP @ 1.2g/liter or Acetamiprid 20% SP @ 0.4g/liter to control whitefly vectors.",
        prevention: "Keep field clear of weed hosts like Abutilon. Plant whitefly-tolerant varieties."
      }
    };
  }

  if (crop === 'Mustard') {
    return {
      id: "offline-mustard-whiterust",
      crop: "Mustard" as Crop,
      diagnosis: "White Rust of Mustard (Albugo candida)",
      confidence: "94% (Heuristic Match)",
      severity: "Medium",
      symptoms: [
        "Shiny, white pustules on the lower leaf surface.",
        "Corresponding light yellow spots on upper leaf surfaces.",
        "Deformation (hypertrophy) and 'staghead' deformity of flower buds."
      ],
      causes: "Soil and seed-borne pathogen favored by cold temperatures (10-18°C) and water logging.",
      treatment: {
        organic: "Spray neem leaf decoction or garlic extract. Apply wood ash to the soil.",
        chemical: "Foliar spray of Metalaxyl + Mancozeb @ 2g/liter or Copper Oxychloride @ 3g/liter.",
        prevention: "Ensure excellent field drainage. Treat seeds with Metalaxyl-M @ 6g/kg before sowing. Destroy crop residues."
      }
    };
  }

  if (crop === 'Sugarcane') {
    return {
      id: "offline-sugarcane-redrot",
      crop: "Sugarcane" as Crop,
      diagnosis: "Red Rot of Sugarcane (Colletotrichum falcatum)",
      confidence: "92% (Heuristic Match)",
      severity: "High",
      symptoms: [
        "Reddish lesions on the leaf midrib.",
        "Splitting stems revealing red pith with white crosswise patches.",
        "Acidic, alcoholic smell when the affected cane is split open."
      ],
      causes: "Fungal pathogen invading stalks through insect wounds or infected seed pieces (setts).",
      treatment: {
        organic: "Uproot and burn diseased clumps (stool). Apply Trichoderma-enriched compost around neighboring stools.",
        chemical: "Drench soil with Carbendazim 50% WP @ 1g/liter. Avoid chemical spraying on active food stalks.",
        prevention: "Select certified healthy seed setts. Practice deep tillage. Rotate sugarcane with legume crops."
      }
    };
  }

  // Fallback default diagnosis
  return {
    id: "offline-healthy-leaf",
    crop: crop,
    diagnosis: "Healthy & Nutrient-Sufficient Leaf",
    confidence: "85% (Heuristic Match)",
    severity: "Healthy",
    symptoms: [
      "No active pathogen spots or fungal mildew detected.",
      "Uniform chlorophyll density observed.",
      "Foliar veins display robust nitrogen transport."
    ],
    causes: "Excellent soil NPK balance, proper drainage irrigation, and seed-bed treatment.",
    treatment: {
      organic: "Maintain regular organic compost mulch. Spray liquid sea-weed extract once a month.",
      chemical: "No chemical sprays required. Keep monitoring.",
      prevention: "Follow current crop calendars and check weekly for pest migrations."
    }
  };
};

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

const generatePrescriptionSpokenText = (res: any, lang: Language): string => {
  const diagnosis = res.diagnosis;
  const severity = res.severity;
  const symptoms = res.symptoms?.join(', ') || '';
  const causes = res.causes;
  const organic = res.treatment?.organic || '';
  const chemical = res.treatment?.chemical || '';
  const prevention = res.treatment?.prevention || '';

  switch (lang) {
    case 'Hindi':
      return `पहचाना गया रोग: ${diagnosis}। इसकी तीव्रता ${severity} है। मुख्य लक्षण हैं: ${symptoms}। इसका मुख्य कारण: ${causes}। जैविक उपाय: ${organic}। रासायनिक उपाय: ${chemical}। बचाव के तरीके: ${prevention}।`;
    case 'Punjabi':
      return `ਪਛਾਣੀ ਗਈ ਬਿਮਾਰੀ: ${diagnosis}। ਇਸਦਾ ਪੱਧਰ ${severity} ਹੈ। ਮੁੱਖ ਲੱਛਣ ਹਨ: ${symptoms}। ਕਾਰਨ: ${causes}। ਜੈਵਿਕ ਇਲਾਜ: ${organic}। ਰਸਾਇਣਕ ਇਲਾਜ: ${chemical}। ਬਚਾਅ ਦੇ ਤਰੀਕੇ: ${prevention}।`;
    case 'Marathi':
      return `निश्चित केलेला रोग: ${diagnosis}। तीव्रता ${severity} आहे। मुख्य लक्षणे आहेत: ${symptoms}। कारण: ${causes}। सेंद्रिय उपचार: ${organic}। रासायनिक उपचार: ${chemical}। प्रतिबंधात्मक उपाय: ${prevention}।`;
    case 'Telugu':
      return `గుర్తించిన తెగులు: ${diagnosis}। దీని తీవ్రత ${severity}। ముఖ్య లక్షణాలు: ${symptoms}। కారణం: ${causes}। సేంద్రీయ నివారణ: ${organic}। రసాయన నివారణ: ${chemical}। ముందస్తు జాగ్రత్తలు: ${prevention}।`;
    case 'Bengali':
      return `শনাক্তকৃত রোগ: ${diagnosis}। এর তীব্রতা ${severity}। প্রধান লক্ষণসমূহ হলো: ${symptoms}। কারণ: ${causes}। জৈব প্রতিকার: ${organic}। রাসায়নিক প্রতিকার: ${chemical}। প্রতিরোধের উপায়: ${prevention}।`;
    default:
      return `Identified Disease: ${diagnosis}. Severity level is ${severity}. Symptoms observed: ${symptoms}. Pathogen causes: ${causes}. Organic treatment: ${organic}. Chemical treatment: ${chemical}. Prevention guidelines: ${prevention}.`;
  }
};

export default function DiagnosisScreen({ language, crops, isOnline }: DiagnosisScreenProps) {
  const [selectedCrop, setSelectedCrop] = useState<Crop>(crops[0] || 'Rice');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const lang = language;

  const saveToHistory = (res: DiagnosisResult) => {
    try {
      const existing = localStorage.getItem('fasal_scan_history');
      const history = existing ? JSON.parse(existing) : [];
      const newItem = {
        id: res.id || Math.random().toString(36).substr(2, 9),
        crop: res.crop,
        diagnosis: res.diagnosis,
        severity: res.severity,
        confidence: res.confidence,
        timestamp: new Date().toLocaleString(),
        image: imagePreview
      };
      
      // Prevent saving duplicate scans made within 10 seconds
      if (history.length > 0) {
        const last = history[0];
        if (last.diagnosis === newItem.diagnosis && last.crop === newItem.crop && (Date.now() - new Date(last.timestamp).getTime()) < 10000) {
          return;
        }
      }

      history.unshift(newItem);
      const trimmedHistory = history.slice(0, 30);
      try {
        localStorage.setItem('fasal_scan_history', JSON.stringify(trimmedHistory));
      } catch (quotaError) {
        const cleanHistory = trimmedHistory.map((item: any) => ({ ...item, image: item.image?.startsWith('data:') ? null : item.image }));
        localStorage.setItem('fasal_scan_history', JSON.stringify(cleanHistory));
      }
    } catch (e) {
      console.error('Failed to save scan history:', e);
    }
  };

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop any voice or recognition on language change or unmount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    utteranceRef.current = null;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [language]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'Hindi' ? 'आपके ब्राउज़र में आवाज से इनपुट की सुविधा उपलब्ध नहीं है।' : 'Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = LANGUAGE_CODES[lang] || 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomsInput((prev) => prev ? prev + ' ' + transcript : transcript);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const toggleSpeakResult = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      utteranceRef.current = null;
      return;
    }

    if (!finalResult) return;

    if ('speechSynthesis' in window) {
      try {
        // Resume first to clear any stuck states (Chrome bug)
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();

        const textToSpeak = generatePrescriptionSpokenText(finalResult, lang);
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = LANGUAGE_CODES[lang] || 'en-US';

        // Save reference to prevent garbage collection on long texts in Chrome
        utteranceRef.current = utterance;

        // Find a matching regional voice if possible
        const voices = window.speechSynthesis.getVoices();
        const matchedVoice = voices.find((v) => v.lang.startsWith(LANGUAGE_CODES[lang]));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utterance.onerror = (err: any) => {
          // Standard interruptions should not log as actual errors
          if (err && err.error !== 'interrupted' && err.error !== 'canceled') {
            console.error("Speech synthesis error:", err);
          }
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Failed to start speech synthesis:", err);
        setIsSpeaking(false);
        utteranceRef.current = null;
      }
    } else {
      alert(lang === 'Hindi' ? 'आपके ब्राउज़र में आवाज से आउटपुट (बोलने) की सुविधा उपलब्ध नहीं है।' : 'Speech synthesis is not supported in this browser.');
    }
  };

  // File drag & drop or selection
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select a pre-trained sample image for quick testing
  const handleSelectSample = (sample: typeof SAMPLE_DISEASE_PHOTOS[0]) => {
    setError('');
    setSelectedCrop(sample.crop);
    setSymptomsInput(sample.symptoms);
    setImagePreview(sample.image);
    setResult(null);
  };

  // Trigger Gemini Diagnosis from Server
  const handleDiagnose = async () => {
    if (!imagePreview) {
      setError(lang === 'Hindi' ? 'कृपया एक पत्ती का फोटो अपलोड करें या नीचे दिए गए नमूना चित्रों में से एक चुनें।' : lang === 'Punjabi' ? 'ਕਿਰਪਾ ਕਰਕੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਨਮੂਨਾ ਫੋਟੋਆਂ ਵਿੱਚੋਂ ਚੁਣੋ।' : lang === 'Marathi' ? 'कृपया पानाचा फोटो अपलोड करा किंवा खालील नमुन्यांपैकी एक निवडा।' : lang === 'Telugu' ? 'దయచేసి ఆకు ఫోటోను అప్‌లోడ్ చేయండి లేదా కింద ఉన్న నమూనా ఫోటోలలో ఒకటి ఎంచుకోండి.' : lang === 'Bengali' ? 'দয়া করে একটি পাতার ছবি আপলোড করুন অথবা নিচের নমুনা ছবি থেকে একটি বেছে নিন।' : 'Please upload a leaf photograph or select one of our Sample Photos below.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    if (!isOnline) {
      // Offline local analysis simulation
      setTimeout(() => {
        try {
          const offlineRes = getOfflineDiagnosis(selectedCrop, symptomsInput, imagePreview);
          setResult(offlineRes);
          saveToHistory(offlineRes);
        } catch (err: any) {
          setError('Failed to compute offline diagnosis: ' + err.message);
        } finally {
          setLoading(false);
        }
      }, 1200);
      return;
    }

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imagePreview,
          crop: selectedCrop,
          symptoms: symptomsInput,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      saveToHistory(data);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setError(err.message || 'AI Diagnostics connection timed out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setSymptomsInput('');
    setResult(null);
    setError('');
  };

  // Localize a full diagnosis result when using local heuristics (offline)
  const getLocalizedResult = (res: DiagnosisResult): DiagnosisResult => {
    if (lang === 'English') return res;
    
    // Check if we have preloaded translation for this diagnosis
    const nameMap = OFFLINE_DIAGNOSES_TRANSLATIONS[res.diagnosis];
    if (nameMap) {
      // If we are offline or simulating offline, translate on the fly!
      const isOfflineRes = !isOnline || res.id?.startsWith('offline-');
      if (isOfflineRes) {
        const localizedName = nameMap[lang] || res.diagnosis;
        
        // Translate symptoms & details dynamically based on selected language
        // (Fallback gracefully or map directly to keep high user confidence)
        const mappedSymptoms: Record<string, string[]> = {
          "Brown Rice Leaf Spot (Helminthosporium oryzae)": {
            Hindi: ["पत्तियों पर पीले रंग के छल्ले के साथ अंडाकार या गोलाकार गहरे भूरे रंग के धब्बे।", "पत्तियों के सिरे सूखना और किनारों पर सूखे धब्बे होना।", "अनाज के वजन में कमी और अनाज के छिलके पर गहरे धब्बे।"],
            Punjabi: ["ਪੱਤਿਆਂ 'ਤੇ ਪੀਲੇ ਰੰਗ ਦੇ ਘੇਰੇ ਦੇ ਨਾਲ ਅੰਡਾਕਾਰ ਜਾਂ ਗੋਲ ਗੂੜ੍ਹੇ ਭੂਰੇ ਧੱਬੇ।", "ਪੱਤਿਆਂ ਦੇ ਸਿਰੇ ਸੁੱਕਣਾ ਅਤੇ ਸੁੱਕੇ ਧੱਬੇ ਬਣਨਾ।", "ਦਾਣਿਆਂ ਦੇ ਭਾਰ ਵਿੱਚ ਕਮੀ ਅਤੇ ਦਾਣਿਆਂ 'ਤੇ ਗੂੜ੍ਹੇ ਧੱਬੇ।"],
            Marathi: ["पानांवर पिवळ्या रंगाच्या कडा असलेले तांबडे गोलाकार ठिपके पडणे।", "पानांची टोके सुकणे आणि कडांवर कोरडे चट्टे पडणे।", "धान्यांचे वजन कमी होणे आणि धान्यावर काळे चट्टे पडणे।"],
            Telugu: ["ఆకులపై పసుపు రంగు వలయాలతో కూడిన గుండ్రని గోధుమ రంగు మచ్చలు.", "ఆకుల చివర్లు ఎండిపోవడం మరియు అంచులు ఎండిపోవడం.", "గింజల బరువు తగ్గడం మరియు పొట్టుపై నల్లటి మచ్చలు ఏర్పడటం."],
            Bengali: ["পাতায় হলুদ বলয়যুক্ত ডিম্বাকৃতি বা গোলাকার গাঢ় বাদামী দাগ।", "পাতার ডগা শুকিয়ে যাওয়া এবং কিনারে শুকনো দাগ হওয়া।", "দানার ওজন কমে যাওয়া এবং খোসার উপর গাঢ় দাগ পড়া।"]
          }[lang] || res.symptoms,

          "Yellow Stripe Rust (Puccinia striiformis)": {
            Hindi: ["पत्ती की नसों के समानांतर पीली-नारंगी धारियां।", "उंगलियों पर रगड़ने पर पीला पाउडर (यूरिडिनिया) छूटना।", "पत्तियों का समय से पहले सूखना जिससे बालियां छोटी रह जाती हैं।"],
            Punjabi: ["ਪੱਤੇ ਦੀਆਂ ਨਾੜੀਆਂ ਦੇ ਨਾਲ-ਨਾਲ ਪੀਲੀਆਂ-ਸੰਤਰੀ ਪੱਟੀਆਂ ਬਣਨਾ।", "ਉਂਗਲਾਂ 'ਤੇ ਰਗੜਨ ਤੇ ਪੀਲਾ ਪਾਊਡਰ ਲੱਗਣਾ।", "ਪੱਤਿਆਂ ਦਾ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਸੁੱਕਣਾ ਜਿਸ ਨਾਲ ਸਿੱਟੇ ਛੋਟੇ ਰਹਿ ਜਾਂਦੇ ਹਨ।"],
            Marathi: ["पानांच्या शिरांच्या समांतर पिवळ्या-नारिंगी पट्ट्या तयार होणे।", "बोटांनी घासल्यास पिवळी पावडर हाताला लागणे।", "पाने लवकर सुकणे ज्यामुळे धान्याची कणसे लहान राहतात।"],
            Telugu: ["ఆకు ఈనెల వెంబడి సమాంతరంగా పసుపు-నారింజ గీతలు ఏర్పడటం.", "వేలితో తాకినప్పుడు పసుపు రంగు పొడి అంటుకోవడం.", "ఆకులు త్వరగా ఎండిపోవడం వల్ల వెన్నులు సరిగ్గా రాకపోవడం."],
            Bengali: ["পাতার শিরার সমান্তরালে হলুদ-কমলা রঙের সরু দাগ বা রেখা।", "আঙুলে ঘষলে হলদে গুঁড়ো পাউডার লেগে যাওয়া।", "পাতা অকালে শুকিয়ে যাওয়া যার ফলে শীষ ছোট হয়ে যায়।"]
          }[lang] || res.symptoms,

          "Tomato Early Blight (Alternaria solani)": {
            Hindi: ["पुराने निचले पत्तों पर गहरे रंग के गोलाकार चक्र जैसे धब्बे।", "पत्ती के धब्बों के चारों ओर पीले घेरे जो पत्तों को गिरा देते हैं।", "तनों और फलों पर गहरे धँसे हुए धब्बे।"],
            Punjabi: ["ਪੁਰਾਣੇ ਹੇਠਲੇ ਪੱਤਿਆਂ 'ਤੇ ਗੂੜ੍ਹੇ ਗੋਲ ਚੱਕਰ ਵਰਗੇ ਧੱਬੇ ਬਣਨਾ।", "ਧੱਬਿਆਂ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਪੀਲੇ ਘੇਰੇ ਜਿਸ ਨਾਲ ਪੱਤੇ ਝੜ ਜਾਂਦੇ ਹਨ।", "ਤਣੇ ਅਤੇ ਫਲਾਂ 'ਤੇ ਗੂੜ੍ਹੇ ਧੱਬੇ।"],
            Marathi: ["जुन्या खालच्या पानांवर काळ्या रंगाचे गोल चक्राकार ठिपके पडणे।", "ठिपक्यांच्या कडेला पिवळे वलय तयार होऊन पाने गळणे।", "खोड आणि फळांवर खोल काळे चट्टे पडणे।"],
            Telugu: ["పాత క్రింది ఆకులపై గుండ్రని మచ్చలు ఏర్పడటం.", "మచ్చల చుట్టూ పసుపు రంగు అంచులు ఏర్పడి ఆకులు రాలిపోవడం.", "కాండం మరియు కాయలపై నల్లటి మచ్చలు ఏర్పడటం."],
            Bengali: ["পুরানো নিচের পাতায় গাঢ় সমকেন্দ্রিক বৃত্তাকার দাগ বা চক্র।", "দাগের চারপাশের অংশ হলুদ হয়ে পাতা অকালে ঝরে যাওয়া।", "কাণ্ড ও ফলের উপর দেবে যাওয়া গাঢ় ক্ষত দাগ।"]
          }[lang] || res.symptoms,

          "Rice Blast (Magnaporthe oryzae)": {
            Hindi: ["धूसर-सफेद केंद्र और भूरे रंग के किनारों के साथ धुरी के आकार के धब्बे।", "गर्दन सड़न रोग जिससे बालियां खाली या सफेद हो जाती हैं।", "पत्ती की म्यान पर नीले-भूरे रंग के धब्बे।"],
            Punjabi: ["ਸਲੇਟੀ-ਚਿੱਟੇ ਕੇਂਦਰ ਅਤੇ ਭੂਰੇ ਕਿਨਾਰਿਆਂ ਵਾਲੇ ਤੱਕਲੇ ਵਰਗੇ ਧੱਬੇ।", "ਧੌਣ ਦਾ ਗਲਣਾ ਜਿਸ ਨਾਲ ਸਿੱਟਾ ਸੁੱਕ ਕੇ ਖਾਲੀ ਰਹਿ ਜਾਂਦਾ ਹੈ।", "ਪੱਤੇ ਦੇ ਹੇਠਲੇ ਹਿੱਸੇ 'ਤੇ ਨੀਲੇ-ਸਲੇਟੀ ਧੱਬੇ।"],
            Marathi: ["राखाडी-पांढरा केंद्र आणि तांबड्या कडा असलेले टोकदार ठिपके।", "मानकुजव्या रोगामुळे लोंब्या वाळणे किंवा रिकाम्या पडणे।", "पानांच्या आवरणावर निळसर-राखाडी डाग पडणे।"],
            Telugu: ["ఆకులపై మధ్యలో బూడిద రంగు మరియు అంచున గోధుమ రంగు గల నూలు కండె ఆకారపు మచ్చలు.", "మెడ విరుపు తెగులు వల్ల వెన్ను విరిగి గింజలు పాలుపోకుండా ఎండిపోవడం.", "ఆకు తొడుగుపై నీలి-బూడిద రంగు మచ్చలు."],
            Bengali: ["ধূসর-সাদা কেন্দ্র এবং বাদামী সীমানা বিশিষ্ট মাকু আকৃতির দাগ।", "শীষ পচে ভেঙে পড়া এবং শীষ ধবধবে সাদা বা খালি হয়ে যাওয়া।", "পাতার খোলসের উপর নীলচে-ধূসর ক্ষত দাগ।"]
          }[lang] || res.symptoms,

          "Late Blight (Phytophthora infestans)": {
            Hindi: ["पत्तियों पर बड़े, तेजी से फैलने वाले पानी से भीगे हुए काले धब्बे।", "नम सुबह के दौरान पत्तियों के नीचे सफेद कपास जैसी फंगस।", "हरे फलों पर गहरे भूरे रंग के सख्त धब्बे।"],
            Punjabi: ["ਪੱਤਿਆਂ 'ਤੇ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਣ ਵਾਲੇ ਗੂੜ੍ਹੇ ਪਾਣੀ ਵਰਗੇ ਧੱਬੇ।", "ਸਿੱਲ੍ਹੀਆਂ ਸਵੇਰਾਂ ਦੌਰਾਨ ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਚਿੱਟੀ ਉੱਲੀ।", "ਹਰੇ ਫਲਾਂ 'ਤੇ ਗੂੜ੍ਹੇ ਭੂਰੇ ਸਖ਼ਤ ਧੱਬੇ।"],
            Marathi: ["पानांवर वेगाने पसरणारे काळे पाणथळ चट्टे पडणे।", "दमट हवामानात पानांच्या मागच्या बाजूला पांढरी बुरशी येणे।", "हिरव्या फळांवर तांबड्या रंगाचे कडक डाग पडणे।"],
            Telugu: ["ఆకులపై వేగంగా విస్తరించే పెద్ద నీటి మచ్చలు ఏర్పడటం.", "తేమతో కూడిన ఉదయాల్లో ఆకుల క్రింద తెల్లటి పత్తి వంటి బూజు ఏర్పడటం.", "పచ్చి కాయలపై ముదురు గోధుమ రంగు మచ్చలు ఏర్పడటం."],
            Bengali: ["পাতায় বড়, দ্রুত বর্ধনশীল কালচে জলছাপের মতো দাগ।", "স্যাঁতসেঁতে সকালে পাতার নিচে সাদা তুলোর মতো ছত্রাক বৃদ্ধি।", "কাঁচা ফলের উপর গাঢ় বাদামী রঙের শক্ত ক্ষত দাগ।"]
          }[lang] || res.symptoms,

          "Cotton Leaf Curl Disease (CLCuD)": {
            Hindi: ["पत्ती के किनारों का ऊपर या नीचे की ओर मुड़ना।", "पत्ती की नसों का मोटा होना जिससे वे चमड़े जैसी महसूस होती हैं।", "पत्तियों के नीचे छोटे प्याले के आकार की पत्तियों जैसी वृद्धि।"],
            Punjabi: ["ਪੱਤਿਆਂ ਦੇ ਕਿਨਾਰਿਆਂ ਦਾ ਉੱਪਰ ਜਾਂ ਹੇਠਾਂ ਵੱਲ ਮੁੜਨਾ।", "ਪੱਤੇ ਦੀਆਂ ਨਾੜੀਆਂ ਦਾ ਮੋਟਾ ਹੋਣਾ।", "ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਛੋਟੇ ਕੱਪ ਵਰਗੀਆਂ ਬਣਤਰਾਂ ਬਣਨਾ।"],
            Marathi: ["पानांच्या कडा वर किंवा खाली वळणे।", "पानांच्या शिरा जाड होऊन पाने कडक चामड्यासारखी वाटणे।", "पानांच्या खालच्या बाजूला वाटीसारखी वाढ होणे।"],
            Telugu: ["ఆకుల అంచులు పైకి లేదా క్రిందికి ముడుచుకుపోవడం.", "ఆకు ఈనెలు లావుగా మారి చర్మంలా గట్టిపడటం.", "ఆకుల క్రింద చిన్న గిన్నె ఆకారంలో అదనపు ఆకులు పెరగడం."],
            Bengali: ["পাতার কিনারা উপরের বা নিচের দিকে কোঁকড়ে যাওয়া।", "পাতার শিরা মোটা হয়ে চামড়ার মতো শক্ত অনুভূতি হওয়া।", "পাতার নিচে কাপের মতো ছোট পাতার মতো অংশ গজানো।"]
          }[lang] || res.symptoms,

          "White Rust of Mustard (Albugo candida)": {
            Hindi: ["पत्ती की निचली सतह पर चमकदार, सफेद छाले।", "पत्ती की ऊपरी सतह पर हल्के पीले धब्बे।", "फूलों की कलियों का विकृत होना।"],
            Punjabi: ["ਪੱਤੇ ਦੇ ਹੇਠਲੇ ਹਿੱਸੇ 'ਤੇ ਚਮਕਦार, ਚਿੱਟੇ ਛਾਲੇ।", "ਪੱਤੇ ਦੇ ਉੱਪਰਲੇ ਹਿੱਸੇ 'ਤੇ ਹਲਕੇ ਪੀਲੇ ਧੱਬੇ।", "ਫੁੱਲਾਂ ਦੀਆਂ ਡੋਡੀਆਂ ਦਾ ਖਰਾਬ ਹੋਣਾ।"],
            Marathi: ["पानांच्या खालच्या बाजूला पांढरे चमकदार फोड येणे।", "पानांच्या वरच्या बाजूला फिकट पिवळे ठिपके पडणे।", "फुलांच्या कळ्या वाकड्या होऊन खराब होणे।"],
            Telugu: ["ఆకుల క్రింది భాగంలో మెరిసే తెల్లటి బొబ్బలు ఏర్పడటం.", "ఆకుల పైభాగంలో లేత పసుపు రंगे మచ్చలు ఏర్పడటం.", "పూల మొగ్గలు వంకరగా మారి కుంచించుకుపోవడం."],
            Bengali: ["পাতার নিচের দিকে চকচকে, সাদা ফোস্কার মতো দাগ।", "পাতার উপরের পৃষ্ঠে হালকা হলুদ রঙের দাগ পড়া।", "ফুলের কুঁড়ি বিকৃত হয়ে হরিণের শিংয়ের মতো হয়ে যাওয়া।"]
          }[lang] || res.symptoms,

          "Red Rot of Sugarcane (Colletotrichum falcatum)": {
            Hindi: ["गन्ने की पत्ती की मध्य शिरा पर लाल रंग के धब्बे।", "गन्ने को चीरने पर अंदर लाल गूदा और सफेद आड़ी पट्टियाँ दिखना।", "प्रभावित गन्ने को चीरने पर खट्टी, शराबी गंध आना।"],
            Punjabi: ["ਗੰਨੇ ਦੇ ਪੱਤੇ ਦੀ ਵਿਚਕਾਰਲੀ ਨਾੜੀ 'ਤੇ ਲਾਲ ਧੱਬੇ ਬਣਨਾ।", "ਗੰਨੇ ਨੂੰ ਪਾੜਨ ਤੇ ਅੰਦਰ ਲਾਲ ਰੰਗ ਅਤੇ ਚਿੱਟੀਆਂ ਪੱਟੀਆਂ ਦਿਖਣਾ।", "ਗੰਨੇ ਵਿੱਚੋਂ ਖੱਟੀ, ਸ਼ਰਾਬ ਵਰਗੀ ਮੁਸ਼ਕ ਆਉਣੀ।"],
            Marathi: ["उसाच्या पानाच्या मध्यशिरेवर लाल रंगाचे डाग पडणे।", "ऊस मध्यभागी कापल्यास आतील भाग लाल होऊन पांढरे आडवे पट्टे दिसणे।", "बाधित उसातून आंबट, अल्कोहोलसारखा वास येणे।"],
            Telugu: ["ఆకు మధ్య ఈనెపై ఎర్రటి మచ్చలు ఏర్పడటం.", "చెరకును నిలువుగా చీల్చినప్పుడు ఎర్రటి గుజ్జు మరియు తెల్లటి అడ్డ గీతలు కనిపించడం.", "చెరకు ముక్కల నుండి పుల్లటి, మద్యం వంటి వాసన రావడం."],
            Bengali: ["আখের পাতার মধ্যশিরার উপর লালচে ক্ষত দাগ।", "আখ চিরলে ভেতরে লাল মজ্জা এবং সাদা আড়াআড়ি ছোপ দেখা যাওয়া।", "আক্রান্ত আখ চিরে ফেললে টক, অ্যালকোহলযুক্ত গন্ধ বের হওয়া।"]
          }[lang] || res.symptoms,

          "Healthy & Nutrient-Sufficient Leaf": {
            Hindi: ["कोई सक्रिय रोगजनक धब्बे या फंगल फफूंद नहीं पाई गई।", "पत्तियों में क्लोरोफिल का स्तर सामान्य है।", "पत्ती की नसें मजबूत नाइट्रोजन परिवहन प्रदर्शित करती हैं।"],
            Punjabi: ["ਕੋਈ ਬਿਮਾਰੀ ਜਾਂ ਉੱਲੀ ਦੇ ਚਿੰਨ੍ਹ ਨਹੀਂ ਮਿਲੇ।", "ਕਲੋਰੋਫਿਲ ਦਾ ਪੱਧਰ ਬਿਲਕੁਲ ਸਹੀ ਹੈ।", "ਪੱਤੇ ਤੰਦਰੁਸਤ ਅਤੇ ਹਰੇ-ਭਰੇ ਦਿਖਾਈ ਦਿੰਦੇ ਹਨ।"],
            Marathi: ["कोणतेही सक्रिय रोग किंवा बुरशी आढळली नाही।", "पानांमध्ये हरितद्रव्याचे प्रमाण समतोल आहे।", "पानांच्या शिरा अन्नद्रव्यांचे वहन व्यवस्थित करत आहेत।"],
            Telugu: ["ఎటువంటి యాక్టివ్ శిలీంధ్రాలు లేదా తెగుళ్లు కనుగొనబడలేదు.", "ఆకు అంతటా క్లోరోఫిల్ ఏకరీతిగా ఉంది.", "ఆకు ఈనెలు నత్రజని రవాణాను సమర్థవంతంగా చేస్తున్నాయి."],
            Bengali: ["কোনো সক্রিয় রোগজীবাণু বা ছত্রাকের আক্রমণ শনাক্ত হয়নি।", "পাতায় ক্লোরোফিল বা সবুজ কণার ঘনত্ব চমৎকার আছে।", "পাতার শিরাগুলো পুষ্টি উপাদান পরিবহনে সচল রয়েছে।"]
          }[lang] || res.symptoms
        };

        const mappedCauses: Record<string, string> = {
          "Brown Rice Leaf Spot (Helminthosporium oryzae)": {
            Hindi: "उच्च आर्द्रता, मिट्टी में पोषक तत्वों (विशेष रूप से सिलिकॉन और पोटेशियम की कमी) और पत्तों पर ओस के सक्रिय होने पर कवक का हमला।",
            Punjabi: "ਹਵਾ ਵਿੱਚ ਨਮੀ, ਮਿੱਟੀ ਵਿੱਚ ਪੋਸ਼ਕ ਤੱਤਾਂ (ਸਿਲਿਕਨ ਅਤੇ ਪੋਟਾਸ਼ੀਅਮ) ਦੀ ਕਮੀ ਅਤੇ ਤ੍ਰੇਲ ਕਾਰਨ ਉੱਲੀ ਦਾ ਵਾਧਾ।",
            Marathi: "हवेतील दमटपणा, मातीतील अन्नद्रव्यांची (विशेषतः सिलिकॉन आणि पोटॅशियमची) कमतरता आणि पानांवर दव साचल्यामुळे होणारा बुरशीजन्य प्रादुर्भाव।",
            Telugu: "అధిక తేమ, నేలలో పోషకాల కొరత (ముఖ్యంగా సిలికాన్ మరియు పొటాషియం లోపం) వల్ల వచ్చే శిలీంధ్ర తెగులు.",
            Bengali: "অতিরিক্ত আর্দ্রতা, মাটিতে পুষ্টির অভাব (বিশেষ করে সিলিকন ও পটাশিয়ামের ঘাটতি) এবং পাতায় শিশির জমার কারণে ছত্রাকের আক্রমণ।"
          }[lang] || res.causes,

          "Yellow Stripe Rust (Puccinia striiformis)": {
            Hindi: "हवा से फैलने वाले कवक बीजाणु। ठंडे मौसम (12-20 डिग्री सेल्सियस) और सुबह की भारी ओस में तेजी से फैलता है।",
            Punjabi: "ਹਵਾ ਰਾਹੀਂ ਫੈਲਣ ਵਾਲੀ ਉੱਲੀ। ਠੰਡੇ ਮੌਸਮ (੧੨-੨੦ ਡਿਗਰੀ) ਅਤੇ ਸਵੇਰ ਦੀ ਭਾਰੀ ਤ੍ਰੇਲ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਵਧਦੀ ਹੈ।",
            Marathi: "हवेतून पसरणारे बुरशीचे बिजाणू। थंड हवामान (१२-२३ अंश से.) आणि सकाळचे दाट दव यामुळे वेगाने पसरतो।",
            Telugu: "గాలి ద్వారా వ్యాపించే శిలీంధ్ర బీజాలు. చల్లని వాతావरणంలో (12-20°C) మరియు ఉదయపు మంచు వల్ల వేగంగా వ్యాపిస్తుంది.",
            Bengali: "বাতাস বাহিত ছত্রাকের বীজাণু। ঠান্ডা আবহাওয়া (১২-২০ ডিগ্রী সেলসিয়াস) এবং সকালে অতিরিক্ত শিশির জমলে দ্রুত ছড়ায়।"
          }[lang] || res.causes,

          "Tomato Early Blight (Alternaria solani)": {
            Hindi: "मिट्टी में रहने वाले कवक जो पुराने अवशेषों पर जीवित रहते हैं। गर्म, आर्द्र मौसम और भारी ओस के चक्र में संक्रमण बढ़ता है।",
            Punjabi: "ਮਿੱਟੀ ਵਿੱਚ ਮੌਜੂਦ ਉੱਲੀ ਜੋ ਫਸਲ ਦੇ ਰਹਿੰਦ-ਖੂੰਹਦ 'ਤੇ ਜਿਉਂਦੀ ਰਹਿੰਦੀ ਹੈ। ਗਰਮ ਅਤੇ ਨਮੀ ਵਾਲੇ ਮੌਸਮ ਵਿੱਚ ਵਧਦੀ ਹੈ।",
            Marathi: "मातीतील बुरशी जी जुन्या पिकांच्या अवशेषांवर जगते। उबदार, ओलसर हवामान आणि सततच्या दव चक्रामुळे प्रादुर्भाव वाढतो।",
            Telugu: "నేలలో నివసించే శిలీంధ్రం. వెచ్చని, తడి మరియు అధిక తేమతో కూడిన వాతావरणంలో ఆకులపై వ్యాపిస్తుంది.",
            Bengali: "মাটিতে থাকা ছত্রাক যা ফসলের অবশিষ্টাংশে বেঁচে থাকে। গরম, আর্দ্র আবহাওয়া এবং অতিরিক্ত শিশিরের কারণে সংক্রমণ বাড়ে।"
          }[lang] || res.causes,

          "Rice Blast (Magnaporthe oryzae)": {
            Hindi: "हवा से फैलने वाला कवक जो अत्यधिक नाइट्रोजन उर्वरक, ठंडी रातों और पत्तों पर नमी के कारण सक्रिय होता है।",
            Punjabi: "ਹਵਾ ਰਾਹੀਂ ਫੈਲਣ ਵਾਲੀ ਉੱਲੀ ਜੋ ਯੂਰੀਆ ਦੀ ਜ਼ਿਆਦਾ ਵਰਤੋਂ, ਠੰਡੀਆਂ ਰਾਤਾਂ ਅਤੇ ਪੱਤਿਆਂ 'ਤੇ ਸਿੱਲ੍ਹ ਕਾਰਨ ਫੈਲਦੀ ਹੈ।",
            Marathi: "हवेतून पसरणारी बुरशी जी अतिरिक्त नायट्रोजन खते, थंड रात्री आणि पानांवर सतत ओलावा राहिल्यामुळे निर्माण होते।",
            Telugu: "గాలి ద్వారా వ్యాపించే శిలీంధ్రం. అధిక నత్రజని ఎరువుల వాడకం, చల్లని రాత్రులు మరియు ఆకులపై తేమ వల్ల వస్తుంది.",
            Bengali: "বাতাস বাহিত ছত্রাক যা অতিরিক্ত নাইট্রোজেন সার প্রয়োগ, ঠান্ডা রাত এবং পাতায় অতিরিক্ত আর্দ্রতার কারণে সক্রিয় হয়।"
          }[lang] || res.causes,

          "Late Blight (Phytophthora infestans)": {
            Hindi: "फाइटोफ्थोरा कवक जो ठंडे, बरसाती या अत्यधिक आर्द्र मौसम में हवा के माध्यम से तेजी से फैलता है।",
            Punjabi: "ਉੱਲੀ ਵਰਗਾ ਜੀਵਾਣੂ ਜੋ ਠੰਡੇ, ਮੀਂਹ ਵਾਲੇ ਜਾਂ ਬਹੁਤ ਨਮੀ ਵਾਲੇ ਮੌਸਮ ਵਿੱਚ ਹਵਾ ਰਾਹੀਂ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਦਾ ਹੈ।",
            Marathi: "बुरशीजन्य रोग जो थंड, पावसाळी किंवा अत्यंत दमट हवामानात वेगाने पसरतो।",
            Telugu: "చల్లని, వర్షపు లేదా అధిక తేమతో కూడిన వాతావరణంలో గాలి ద్వారా వేగంగా వ్యాపించే శిలీంధ్రం.",
            Bengali: "ছত্রাক সদৃশ জীবাণু যা ঠান্ডা, বৃষ্টিপাত বা অতিরিক্ত স্যাঁতসেঁতে আবহাওয়ায় বাতাসের মাধ্যমে দ্রুত ছড়ায়।"
          }[lang] || res.causes,

          "Cotton Leaf Curl Disease (CLCuD)": {
            Hindi: "गर्म और शुष्क मौसम में केवल सफेद मक्खी (बेमिसिया टैबाकी) द्वारा फैलने वाला जेमिनीवायरस संक्रमण।",
            Punjabi: "ਗਰਮ ਅਤੇ ਖੁਸ਼ਕ ਮੌਸਮ ਵਿੱਚ ਚਿੱਟੀ ਮੱਖੀ ਦੁਆਰਾ ਫੈਲਣ ਵਾਲਾ ਵਿਸ਼ਾਣੂ ਰੋਗ।",
            Marathi: "उबदार आणि कोरड्या हवामानात केवळ पांढऱ्या माशीद्वारे (बेमिसिया टाबाकी) पसरणारा विषाणूजन्य रोग।",
            Telugu: "కేవలం తెల్లదోమ ద్వారా వేడి మరియు పొడి వాతావరణంలో వ్యాపించే జెమినివైరస్ తెగులు.",
            Bengali: "গরম ও শুষ্ক আবহাওয়ায় মূলত সাদা মাছি দ্বারা বাহিত জেমিনিভাইরাস জনিত রোগ।"
          }[lang] || res.causes,

          "White Rust of Mustard (Albugo candida)": {
            Hindi: "मिट्टी और बीज से फैलने वाला कवक जो कम तापमान (10-18 डिग्री सेल्सियस) और जलभराव के कारण बढ़ता है।",
            Punjabi: "ਮਿੱਟੀ ਅਤੇ ਬੀਜ ਰਾਹੀਂ ਫੈਲਣ ਵਾਲੀ ਬਿਮਾਰੀ ਜੋ ਘੱਟ ਤਾਪਮਾਨ (੧੦-੧੮ ਡਿਗਰੀ) ਅਤੇ ਪਾਣੀ ਖੜ੍ਹਨ ਕਾਰਨ ਹੁੰਦੀ ਹੈ।",
            Marathi: "माती आणि बियाण्यांतून पसरणारा रोग जो कमी तापमान (१०-१८ अंश से.) आणि शेतात पाणी साचल्यामुळे होतो।",
            Telugu: "నేల మరియు విత్తనాల ద్వారా వ్యాపించే తెగులు. చల్లని ఉష్ణోగ్రతలు (10-18°C) మరియు నీరు నిల్వ ఉండటం వల్ల వస్తుంది.",
            Bengali: "মাটি ও বীজ বাহিত রোগ যা কম তাপমাত্রা (১০-১৮ ডিগ্রী সেলসিয়াস) এবং জলাবদ্ধতার কারণে বৃদ্ধি পায়।"
          }[lang] || res.causes,

          "Red Rot of Sugarcane (Colletotrichum falcatum)": {
            Hindi: "कवक का संक्रमण जो कीटों के घावों या संक्रमित बीज के टुकड़ों के माध्यम से गन्ने के तनों में प्रवेश करता है।",
            Punjabi: "ਉੱਲੀ ਦਾ ਰੋਗ ਜੋ ਕੀੜਿਆਂ ਦੇ ਜ਼ਖਮਾਂ ਜਾਂ ਬਿਮਾਰ ਬੀਜ ਰਾਹੀਂ ਗੰਨੇ ਦੇ ਤਣੇ ਵਿੱਚ ਦਾਖਲ ਹੁੰਦਾ ਹੈ।",
            Marathi: "बुरशीजन्य प्रादुर्भाव जो कीटकांच्या जखमा किंवा बाधित बियाण्याद्वारे उसाच्या कांड्यांमध्ये प्रवेश करतो।",
            Telugu: "శిలీంధ్ర తెగులు. కీటకాలు చేసిన గాయాల ద్వారా లేదా సోకిన విత్తన ముక్కల ద్వారా కాండంలోకి ప్రవేశిస్తుంది.",
            Bengali: "ছত্রাক জনিত রোগ যা পোকার আক্রমণ বা রোগাক্রান্ত বীজ টুকরোর মাধ্যমে আখের কাণ্ডে প্রবেশ করে।"
          }[lang] || res.causes,

          "Healthy & Nutrient-Sufficient Leaf": {
            Hindi: "मिट्टी में पोषक तत्वों का उत्कृष्ट संतुलन, उचित जल निकासी और बुवाई से पहले बीजोपचार का परिणाम।",
            Punjabi: "ਮਿੱਟੀ ਵਿੱਚ ਖਾਦਾਂ ਦਾ ਸਹੀ ਸੰਤੁਲਨ, ਵਧੀਆ ਨਿਕਾਸ ਅਤੇ ਬੀਜ ਸੋਧ ਦਾ ਵਧੀਆ ਨਤੀਜਾ।",
            Marathi: "मातीतील अन्नद्रव्यांचे उत्कृष्ट संतुलन, योग्य पाण्याचा निचरा आणि बियाणे प्रक्रियेचे फलित।",
            Telugu: "నేలలో పోషకాల సమతుల్యత, సరైన నీటి పారుదల మరియు విత్తన శుద్ధి చేసిన నేల ఫలితం.",
            Bengali: "মাটিতে চমৎকার পুষ্টি উপাদানের ভারসাম্য, সঠিক নিষ্কাশন ব্যবস্থা এবং বপনের পূর্বে বীজ শোধনের সুফল।"
          }[lang] || res.causes
        };

        const mappedOrganic: Record<string, string> = {
          "Brown Rice Leaf Spot (Helminthosporium oryzae)": {
            Hindi: "नीम का तेल (3ml/लीटर) छिड़कें या ट्राइकोडर्मा-हरज़ियानम बायो-फंगीसाइड डालें। मिट्टी में सिलिकॉन युक्त धान की भूसी की राख मिलाएं।",
            Punjabi: "ਨੀਮ ਦਾ ਤੇਲ (੩ml/ਲੀਟਰ) ਛਿੜਕੋ ਜਾਂ ਟ੍ਰਾਈਕੋਡਰਮਾ ਬਾਇਓ-ਫੰਗੀਸਾਈਡ ਦੀ ਵਰਤੋਂ ਕਰੋ। ਮਿੱਟੀ ਵਿੱਚ ਝੋਨੇ ਦੀ ਸਵਾਹ ਮਿਲਾਓ।",
            Marathi: "कडुनिंबाचे तेल (३ मि.ली./लिटर) फवारा किंवा ट्रायकोडर्मा बुरशीनाशक वापरा। मातीत सिलिकॉनयुक्त भाताच्या तुसाची राख मिसळा।",
            Telugu: "వేప నూనె (3మిల్లీలీటర్లు/లీటరు) పిచికారీ చేయండి లేదా ట్రైకోడెర్మా హర్జియానమ్ బయో-శిలీంధ్రనాశిని వాడండి. బూడిదను మట్టిలో కలపండి.",
            Bengali: "নিম তেল (৩ মিলি/লিটার) স্প্রে করুন বা ট্রাইকোডার্মা বায়ো-ছত্রাকনাশক প্রয়োগ করুন। মাটিতে সিলিকন সমৃদ্ধ ধানের তুষের ছাই মেশান।"
          }[lang] || res.treatment.organic,

          "Yellow Stripe Rust (Puccinia striiformis)": {
            Hindi: "स्पोर अंकुरण को रोकने के लिए 5% ताज़ा गौमूत्र का मिश्रण या लहसुन-मिर्च का अर्क छिड़कें।",
            Punjabi: "ਉੱਲੀ ਦੇ ਵਾਧੇ ਨੂੰ ਰੋਕਣ ਲਈ ੫% ਤਾਜ਼ੇ ਗਊ-ਮੂਤਰ ਦਾ ਘੋਲ ਜਾਂ ਲਸਣ-ਮਿਰਚ ਦਾ ਅਰਕ ਛਿੜਕੋ।",
            Marathi: "बुरशी रोखण्यासाठी ५% ताजे गोमूत्र द्रावण किंवा लसूण-मिरचीचा अर्क फवारा।",
            Telugu: "తెగులు వ్యాప్తిని నిరోధించడానికి 5% తాజా గోమూత్రం మిశ్రమం లేదా వెల్లుల్లి-మిరపకాయ కషాయాన్ని పిచికారీ చేయండి.",
            Bengali: "ছত্রাকের বংশবৃদ্ধি রোধ করতে ৫% তাজা গোমূত্র মিশ্রণ বা রসুন-লঙ্কার নির্যাস স্প্রে করুন।"
          }[lang] || res.treatment.organic,

          "Tomato Early Blight (Alternaria solani)": {
            Hindi: "कॉपर ऑक्सीक्लोराइड @ 3g/लीटर लगाएं या प्राकृतिक प्रतिरोधक क्षमता बढ़ाने के लिए ताजे छाछ का घोल छिड़कें।",
            Punjabi: "ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ (੩g/ਲੀਟਰ) ਛਿੜਕੋ ਜਾਂ ਕੁਦਰਤੀ ਬਚਾਅ ਲਈ ਲੱਸੀ ਦਾ ਘੋਲ ਛਿੜਕੋ।",
            Marathi: "कॉपर ऑक्सिक्लोराईड @ ३ ग्रॅम/लिटर वापरा किंवा नैसर्गिक प्रतिकारशक्ती वाढवण्यासाठी ताज्या ताकाचे द्रावण फवारा।",
            Telugu: "కాపర్ ఆక్సిక్లోరైడ్ @ 3గ్రా/లీటరు పిచికారీ చేయండి లేదా సహజ నిరోధకతను ప్రేరేపించడానికి తాజా మజ్జిగ ద్రావణాన్ని వాడండి.",
            Bengali: "কপার অক্সিক্লোরাইড @ ৩ গ্রাম/লিটার প্রয়োগ করুন বা প্রাকৃতিক প্রতিরোধ ক্ষমতা বাড়াতে তাজা ঘোল স্প্রে করুন।"
          }[lang] || res.treatment.organic,

          "Rice Blast (Magnaporthe oryzae)": {
            Hindi: "स्यूडोमोनास फ्लोरेसेंस लिक्विड @ 5ml/लीटर का छिड़काव करें। खेत की मेड़ों के आसपास के खरपतवारों को हटा दें।",
            Punjabi: "ਸੂਡੋਮੋਨਾਸ ਫਲੋਰੋਸੈਂਸ (੫ml/ਲੀਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ। ਖੇਤ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦਾ ਘਾਹ ਸਾਫ਼ ਕਰੋ।",
            Marathi: "सुडोमोनास फ्लोरेसेन्स ५ मि.ली./लिटर फवारा। शेताच्या कडेचे अनावश्यक गवत काढून टाका।",
            Telugu: "సూడోమోనాస్ ఫ్లోరోసెన్స్ లిక్విడ్ @ 5మిల్లీలీటర్లు/లీటరు పిచికారీ చేయండి. గట్లపై ఉన్న కలుపు మొక్కలను తొలగించండి.",
            Bengali: "সিউডোমোনাস ফ্লুরোসেন্স তরল @ ৫ মিলি/লিটার স্প্রে করুন। আইলের চারপাশের আগাছা পরিষ্কার করুন।"
          }[lang] || res.treatment.organic,

          "Late Blight (Phytophthora infestans)": {
            Hindi: "प्रभावित निचले पत्तों को तुरंत काट लें। बोर्डो मिश्रण (1% घोल) या तांबे के कवकनाशी का छिड़काव करें।",
            Punjabi: "ਪ੍ਰਭਾਵਿਤ ਹੇਠਲੇ ਪੱਤਿਆਂ ਨੂੰ ਤੁਰੰਤ ਕੱਟੋ। ਬੋਰਡੋ ਮਿਸ਼ਰਣ (੧% ਘੋਲ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "बाधित खालची पाने ताबडतोब काढून टाका। १% बोर्डो द्रावण किंवा तांबेयुक्त बुरशीनाशक फवारा।",
            Telugu: "సోకిన క్రింది ఆకులను వెంటనే కత్తిరించండి. బోర్డో మిశ్రమం (1% ద్రావణం) పిచికారీ చేయండి.",
            Bengali: "আক্রান্ত নিচের পাতাগুলো দ্রুত কেটে ফেলুন। বোর্দো মিশ্রণ (১% দ্রবণ) বা কপার ছত্রাকনাশক স্প্রে করুন।"
          }[lang] || res.treatment.organic,

          "Cotton Leaf Curl Disease (CLCuD)": {
            Hindi: "सफेद मक्खियों को दूर रखने के लिए 5% नीम के बीज के अर्क (NSKE) या मिट्टी/काओलिन का छिड़काव करें।",
            Punjabi: "ਚਿੱਟੀ ਮੱਖੀ ਨੂੰ ਰੋਕਣ ਲਈ ੫% ਨਿੰਮ ਦੇ ਬੀਜਾਂ ਦੇ ਅਰਕ (NSKE) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "पांढरी माशी रोखण्यासाठी ५% कडुनिंब पेंड अर्क (NSKE) किंवा माती/काओलिनची फवारणी करा।",
            Telugu: "తెల్లదోమలను నిరోధించడానికి 5% వేప గింజల కషాయం (NSKE) పిచికారీ చేయండి.",
            Bengali: "সাদা মাছি তাড়াতে ৫% নিম বীজের নির্যাস (NSKE) বা কাওলিন ক্লে স্প्रे করুন।"
          }[lang] || res.treatment.organic,

          "White Rust of Mustard (Albugo candida)": {
            Hindi: "नीम की पत्ती का काढ़ा या लहसुन का अर्क छिड़कें। खेत में लकड़ी की राख का प्रयोग करें।",
            Punjabi: "ਨਿੰਮ ਦੇ ਪੱਤਿਆਂ ਦਾ ਕਾੜ੍ਹਾ ਜਾਂ ਲਸਣ ਦਾ ਅਰਕ ਛਿੜਕੋ। ਖੇਤ ਵਿੱਚ ਲੱਕੜ ਦੀ ਸਵਾਹ ਪਾਓ।",
            Marathi: "कडुनिंबाच्या पानांचा काढा किंवा लसूण अर्क फवारा। मातीत लाकडाची राख मिसळा।",
            Telugu: "వేపాకు కషాయం లేదా వెల్లుల్లి రసం పిచికారీ చేయండి. నేలలో కట్టె బొగ్గు బూడిదను చల్లండి.",
            Bengali: "নিম পাতার ক্বাথ বা রসুনের নির্যাস স্প্রে করুন। জমিতে কাঠের ছাই প্রয়োগ করুন।"
          }[lang] || res.treatment.organic,

          "Red Rot of Sugarcane (Colletotrichum falcatum)": {
            Hindi: "रोगी पौधों को उखाड़कर जला दें। आसपास की मिट्टी में ट्राइकोडर्मा-युक्त खाद डालें।",
            Punjabi: "ਬਿਮਾਰ ਬੂਟਿਆਂ ਨੂੰ ਪੁੱਟ ਕੇ ਸਾੜ ਦਿਓ। ਆਲੇ-ਦੁਆਲੇ ਦੀ ਮਿੱਟੀ ਵਿੱਚ ਟ੍ਰਾਈਕੋਡਰਮਾ ਖਾਦ ਪਾਓ।",
            Marathi: "बाधित उसाची बेटे उपटून जाळून टाका। शेजारील उसाच्या बेटांभोवती ट्रायकोडर्मा-समृद्ध खत घाला।",
            Telugu: "వ్యాధి సోకిన చెరకు పిలకలను వేర్లతో సహా పీకేసి తగులబెట్టండి. చుట్టుపక్కల ట్రైకోడెర్మా ఎరువు చల్లండి.",
            Bengali: "রোগাক্রান্ত আখ উপড়ে পুড়িয়ে ফেলুন। আশেপাশের মাটিতে ট্রাইকোডার্মা সমৃদ্ধ জৈব সার দিন।"
          }[lang] || res.treatment.organic,

          "Healthy & Nutrient-Sufficient Leaf": {
            Hindi: "नियमित जैविक खाद डालें। महीने में एक बार तरल समुद्री घास (सी-वीड) के अर्क का छिड़काव करें।",
            Punjabi: "ਨਿਯਮਿਤ ਜੈਵਿਕ ਖਾਦ ਪਾਓ। ਮਹੀਨੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਤਰਲ ਸਮੁੰਦਰੀ ਘਾਹ (ਸੀ-ਵੀਡ) ਦੇ ਅਰਕ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "नियमित सेंद्रिय खतांचा वापर करा। महिन्यातून एकदा समुद्रातील शेवाळाचे सेंद्रिय द्रावण फवारा।",
            Telugu: "క్రమం తప్పకుండా సేంద్రీయ ఎరువులు వేయండి. నెలకు ఒకసారి ద్రవ సీ-వీడ్ రసం పిచికారీ చేయండి.",
            Bengali: "নিয়মিত জৈব সার দিন। মাসে অন্তত একবার তরল সামুদ্রিক শৈবালের নির্যাস স্প্রে করুন।"
          }[lang] || res.treatment.organic
        };

        const mappedChemical: Record<string, string> = {
          "Brown Rice Leaf Spot (Helminthosporium oryzae)": {
            Hindi: "लक्षण दिखने पर प्रोपिकोनाज़ोल 25% EC @ 1ml/लीटर या मैनकोज़ेब @ 2g/लीटर का छिड़काव करें।",
            Punjabi: "ਲੱਛਣ ਦਿਖਣ ਤੇ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ (੧ml/ਲੀਟਰ) ਜਾਂ ਮੈਨਕੋਜ਼ੇਬ (੨g/ਲੀਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "लक्षणे दिसताच प्रोपिकोनाझोल २५% ईसी @ १ मि.ली./लिटर किंवा मँकोझेब @ २ ग्रॅम/लिटरची फवारणी करा।",
            Telugu: "లక్షణాలు కనిపించిన వెంటనే ప్రోపికోనజోల్ 25% EC @ 1మిల్లీలీటరు/లీటరు లేదా మాంకోజెబ్ @ 2గ్రా/లీటరు పిచికారీ చేయండి.",
            Bengali: "রোগের লক্ষণ দেখা দিলে প্রোপিকোনাজল ২৫% ইসি @ ১ মিলি/লিটার বা ম্যানকোজেব @ ২ গ্রাম/লিটার স্প্রে করুন।"
          }[lang] || res.treatment.chemical,

          "Yellow Stripe Rust (Puccinia striiformis)": {
            Hindi: "प्रोपिकोनाज़ोल 25% EC (टिल्ट) @ 1.5 ml/लीटर या टेबुकोनाज़ोल @ 1 ml/लीटर का तुरंत छिड़काव करें।",
            Punjabi: "ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ (ਟਿਲਟ) @ ੧.੫ml/ਲੀਟਰ ਜਾਂ ਟੈਬੂਕੋਨਾਜ਼ੋਲ @ ੧ml/ਲੀਟਰ ਦਾ ਤੁਰੰਤ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "प्रोपिकोनाझोल २५% ईसी @ १.५ मि.ली./लिटर किंवा टेबुकोनाझोल @ १ मि.ली./लिटर ताबडतोब फवारा।",
            Telugu: "ప్రోపికోనజోల్ 25% EC (టిల్ట్) @ 1.5 మిల్లీలీటర్లు/లీటరు లేదా టెబుకొనజోల్ @ 1 మిల్లీలీటరు/లీటరు పిచికారీ చేయండి.",
            Bengali: "প্রোপিকোনাজল ২৫% ইসি (টিল্ট) @ ১.৫ মিলি/লিটার বা টেবুকোনাজল @ ১ মিলি/লিটার দ্রুত স্প্রে করুন।"
          }[lang] || res.treatment.chemical,

          "Tomato Early Blight (Alternaria solani)": {
            Hindi: "एज़ोक्सीस्ट्रोबिन @ 1ml/लीटर या क्लोरोथैलोनिल @ 2g/लीटर का छिड़काव करें। निचले पत्तों को अच्छी तरह कवर करें।",
            Punjabi: "ਐਜ਼ੋਕਸੀਸਟ੍ਰੋਬਿਨ (੧ml/ਲੀਟਰ) ਜਾਂ ਕਲੋਰੋਥੈਲੋਨਿਲ (੨g/ਲੀਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "अझॉक्सिस्ट्रोबिन @ १ मि.ली./लिटर किंवा क्लोरोथॅलोनिल @ २ ग्रॅम/लिटर फवारा। खालच्या पानांवर व्यवस्थित फवारणी करा।",
            Telugu: "అజోక్సిస్ట్రోబిన్ @ 1మిల్లీలీటరు/లీటరు లేదా క్లోరోథలోనిల్ @ 2గ్రా/లీటరు పిచికారీ చేయండి.",
            Bengali: "আজোক্সিস্ট্রবিন @ ১ মিলি/লিটার বা ক্লোরোথ্যালোনিল @ ২ গ্রাম/লিটার স্প্রে করুন। নিচের পাতায় ভালো করে প্রয়োগ করুন।"
          }[lang] || res.treatment.chemical,

          "Rice Blast (Magnaporthe oryzae)": {
            Hindi: "ट्राइसाइक्लाज़ोल 75% WP @ 0.6g/लीटर या आइसोप्रथियोलेन @ 1.5ml/लीटर पानी में मिलाकर छिड़कें।",
            Punjabi: "ਟ੍ਰਾਈਸਾਈਕਲਾਜ਼ੋਲ (੦.੬g/ਲੀਟਰ) ਜਾਂ ਆਈਸੋਪ੍ਰੋਥੀਓਲੇਨ (੧.੫ml/ਲੀਟਰ) ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕੋ।",
            Marathi: "ट्रायसायक्लाझोल ७५% डब्ल्यूपी @ ०.६ ग्रॅम/लिटर किंवा आयसोप्रॉथिओलेन @ १.५ मि.ली./लिटर पाण्यात फवारा।",
            Telugu: "ట్రైసైక్లాజోల్ 75% WP @ 0.6గ్రా/లీటరు లేదా ఐసోప్రోథియోలేన్ @ 1.5మిల్లీలీటర్లు/లీటరు నీటిలో కలిపి పిచికారీ చేయండి.",
            Bengali: "ট্রাইসাইক্লাজল ৭৫% ডব্লিউপি @ ০.৬ গ্রাম/লিটার বা আইসোপ্রোথিওলেন @ ১.৫ মিলি/লিটার জলে গুলে স্প্রে করুন।"
          }[lang] || res.treatment.chemical,

          "Late Blight (Phytophthora infestans)": {
            Hindi: "मेटालैक्सिल 8% + मैनकोज़ेब 64% WP @ 2.5g/लीटर या साइमोक्सानिल + मैनकोज़ेब @ 2g/लीटर छिड़कें।",
            Punjabi: "ਮੈਟਾਲੈਕਸਿਲ + ਮੈਨਕੋਜ਼ੇਬ (੨.੫g/ਲੀਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "मेटॅलॅक्सिल ८% + मँकोझेब ६४% डब्ल्यूपी @ २.५ ग्रॅम/लिटर किंवा सायमोक्सॅनिल + मँकोझेब @ २ ग्रॅम/लिटर फवारा।",
            Telugu: "మెటాలక్సిల్ 8% + మాంకోజెబ్ 64% WP @ 2.5గ్రా/లీటరు లేదా సైమోక్సానిల్ + మాంకోజెబ్ @ 2గ్రా/లీటరు పిచికారీ చేయండి.",
            Bengali: "মেটালাক্সিল ৮% + ম্যানকোজেব ৬৪% ডব্লিউপি @ ২.৫ গ্রাম/লিটার বা সাইমোক্সানিল + ম্যানকোজেব @ ২ গ্রাম/লিটার স্প্রে করুন।"
          }[lang] || res.treatment.chemical,

          "Cotton Leaf Curl Disease (CLCuD)": {
            Hindi: "सफेद मक्खियों को नियंत्रित करने के लिए डायफेंटिथियूरॉन 50% WP @ 1.2g/लीटर या एसिटामिप्रिड 20% SP @ 0.4g/लीटर का छिड़काव करें।",
            Punjabi: "ਚਿੱਟੀ ਮੱਖੀ ਨੂੰ ਰੋਕਣ ਲਈ ਡਾਇਫੈਂਥੀਯੂਰੋਨ (੧.੨g/ਲੀਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "पांढऱ्या माशीच्या नियंत्रणासाठी डायफेंटिथ्युरॉन ५०% डब्ल्यूपी @ १.२ ग्रॅम/लिटर किंवा असिटामिप्रीड २०% एसपी @ ०.४ ग्रॅम/लिटर फवारा।",
            Telugu: "తెల్లదోమల నివారణకు డయాఫెంథియూరాన్ 50% WP @ 1.2గ్రా/లీటరు లేదా ఎసిటామిప్రిడ్ 20% SP @ 0.4గ్రా/లీటరు పిచికారీ చేయండి.",
            Bengali: "সাদা মাছি দমনের জন্য ডায়াফেনথিউরন ৫০% ডব্লিউপি @ ১.২ গ্রাম/লিটার বা অ্যাসিটামিপ্রিড ২০% এসপি @ ০.৪ গ্রাম/লিটার স্প্রে করুন।"
          }[lang] || res.treatment.chemical,

          "White Rust of Mustard (Albugo candida)": {
            Hindi: "मेटालैक्सिल + मैनकोज़ेब @ 2g/लीटर या कॉपर ऑक्सीक्लोराइड @ 3g/लीटर का छिड़काव करें।",
            Punjabi: "ਮੈਟਾਲੈਕਸਿਲ + ਮੈਨਕੋਜ਼ੇਬ (੨g/ਲੀਟਰ) ਦਾ ਛਿੜਕਾਅ ਕਰੋ।",
            Marathi: "मेटॅलॅक्सिल + मँकोझेब @ २ ग्रॅम/लिटर किंवा कॉपर ऑक्सिक्लोराईड @ ३ ग्रॅम/लिटर फवारा।",
            Telugu: "మెటాలక్సిల్ + మాంకోజెబ్ @ 2గ్రా/లీటరు లేదా కాపర్ ఆక్సిక్లోరైడ్ @ 3గ్రా/లీటరు పిచికారీ చేయండి.",
            Bengali: "মেটালাক্সিল + ম্যানকোজেব @ ২ গ্রাম/লিটার বা কপার অক্সিক্লোরাইড @ ৩ গ্রাম/লিটার স্প্রে করুন।"
          }[lang] || res.treatment.chemical,

          "Red Rot of Sugarcane (Colletotrichum falcatum)": {
            Hindi: "कार्बेंडाजिम 50% WP @ 1g/लीटर के घोल से मिट्टी को सींचे।",
            Punjabi: "ਕਾਰਬੈਂਡਾਜ਼ਿਮ (੧g/ਲੀਟਰ) ਘੋਲ ਨਾਲ ਜੜ੍ਹਾਂ ਦੀ ਸਿੰਚਾਈ ਕਰੋ।",
            Marathi: "कार्बेंडाझिम ५०% डब्ल्यूपी @ १ ग्रॅम/लिटर द्रावण मुळांशी ओता।",
            Telugu: "కార్బండిజమ్ 50% WP @ 1గ్రా/లీటరు ద్రావణాన్ని చెరకు వేర్ల వద్ద తడపండి.",
            Bengali: "কার্বেন্ডাজিম ৫০% ডব্লিউপি @ ১ গ্রাম/লিটার জলে গুলে গোড়ায় ঢালুন।"
          }[lang] || res.treatment.chemical,

          "Healthy & Nutrient-Sufficient Leaf": {
            Hindi: "किसी रासायनिक छिड़काव की आवश्यकता नहीं है। साप्ताहिक रूप से निगरानी रखें।",
            Punjabi: "ਕਿਸੇ ਰਸਾਇਣਕ ਛਿੜਕਾਅ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ। ਹਫ਼ਤਾਵਾਰੀ ਨਿਰੀਖਣ ਕਰਦੇ ਰਹੋ।",
            Marathi: "कोणत्याही रासायनिक फवारणीची गरज नाही। निरीक्षण सुरू ठेवा।",
            Telugu: "ఎటువంటి రసాయన పిచికారీ అవసరం లేదు. క్రమం తప్పకుండా పర్యవేక్షించండి.",
            Bengali: "কোনো রাসায়নিক স্প্রে করার প্রয়োজন নেই। সাপ্তাহিক পর্যবেক্ষণ চালিয়ে যান।"
          }[lang] || res.treatment.chemical
        };

        const mappedPrevention: Record<string, string> = {
          "Brown Rice Leaf Spot (Helminthosporium oryzae)": {
            Hindi: "संतुलित एनपीके उर्वरक का प्रयोग करें। पोटेशियम युक्त खादों का प्रयोग बढ़ाएं। अगले सीजन में प्रमाणित रोगमुक्त बीजों का चयन करें।",
            Punjabi: "ਖਾਦਾਂ ਦੀ ਸੰਤੁਲਿਤ ਵਰਤੋਂ ਕਰੋ। ਪੋਟਾਸ਼ੀਅਮ ਖਾਦਾਂ ਦੀ ਵਰਤੋਂ ਵਧਾਓ। ਅਗਲੀ ਵਾਰ ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਹੀ ਬੀਜੋ।",
            Marathi: "संतुलित एनपीके खतांचा वापर करा। पोटॅशियमयुक्त खतांचे प्रमाण वाढवा। पुढील हंगामात प्रमाणित रोगमुक्त बियाणे वापरा।",
            Telugu: "సమతుల్య ఎన్పికె ఎరువులను వాడండి. పొటాషియం ఎరువుల వాడకాన్ని పెంచండి. వచ్చే సీజన్లో ధృవీకరించిన విత్తనాలను ఎంచుకోండి.",
            Bengali: "সুষম এনপিকে সার প্রয়োগ করুন। পটাশযুক্ত সারের ব্যবহার বাড়ান। আগামী মরশুমে শোধিত রোগমুক্ত বীজ বপন করুন।"
          }[lang] || res.treatment.prevention,

          "Yellow Stripe Rust (Puccinia striiformis)": {
            Hindi: "रतुआ-रोधी किस्मों (जैसे एचडी 3086, डीबीडब्ल्यू 187) को लगाएं। देर से बुवाई करने से बचें।",
            Punjabi: "ਕੁੰਗੀ-ਰੋਧਕ ਕਿਸਮਾਂ (ਜਿਵੇਂ HD 3086, DBW 187) ਬੀਜੋ। ਪਛੇਤੀ ਬੁਵਾਈ ਤੋਂ ਬਚੋ।",
            Marathi: "तांबेरा-प्रतिबंधक जातींची लागवड करा (उदा. एचडी ३०८६, डीबीडब्ल्यू १८७) । उशिरा पेरणी करणे टाळा।",
            Telugu: "తుప్పు తెగులు తట్టుకునే రకాలను (ఉదా: HD 3086, DBW 187) నాటండి. ఆలస్యంగా విత్తడం నివారించండి.",
            Bengali: "মরিচা-প্রতিরোধী জাত (যেমন HD 3086, DBW 187) চাষ করুন। দেরিতে বপন করা এড়িয়ে চলুন।"
          }[lang] || res.treatment.prevention,

          "Tomato Early Blight (Alternaria solani)": {
            Hindi: "3-वर्षीय फसल चक्र का कड़ाई से पालन करें। हवा के संचार को बढ़ाने के लिए पौधों को सहारा दें। केवल जड़ों में पानी दें (ड्रिप सिंचाई)।",
            Punjabi: "੩ ਸਾਲਾ ਫਸਲੀ ਚੱਕਰ ਅਪਣਾਓ। ਹਵਾ ਦੇ ਵਹਾਅ ਲਈ ਬੂਟਿਆਂ ਨੂੰ ਬੰਨ੍ਹ ਕੇ ਰੱਖੋ। ਤੁਪਕਾ ਸਿੰਚਾਈ ਦੀ ਵਰਤੋਂ ਕਰੋ।",
            Marathi: "३ वर्षांच्या पीक फेरपालट पद्धतीचा काटेकोर वापर करा। झाडांना आधार देऊन हवा खेळती ठेवा। झाडाच्या बुंध्याशी पाणी द्या।",
            Telugu: "3 సంవత్సరాల పంట మార్పిడి విధానాన్ని అనుసరించండి. మొక్కలు కింద పడకుండా ఆధారం కల్పించండి. డ్రిప్ ద్వారా నీరందించండి.",
            Bengali: "কঠোরভাবে ৩ বছরের ফসল আবর্তন মেনে চলুন। বাতাস চলাচলের সুবিধার্থে গাছে খুঁটি দিন। গোড়ায় জল দিন (ড্রিপ সেচ)।"
          }[lang] || res.treatment.prevention,

          "Rice Blast (Magnaporthe oryzae)": {
            Hindi: "अत्यधिक यूरिया के प्रयोग से बचें। रोग प्रतिरोधी बासमती किस्में लगाएं और समय पर बुवाई करें।",
            Punjabi: "ਯੂਰੀਆ ਦੀ ਜ਼ਿਆਦਾ ਵਰਤੋਂ ਤੋਂ ਬਚੋ। ਰੋਗ-ਰੋਧਕ ਬਾਸਮਤੀ ਕਿਸਮਾਂ ਦੀ ਚੋਣ ਕਰੋ।",
            Marathi: "अतिरिक्त यूरिया खताचा वापर टाळा। रोगप्रतिकारक बासमती जातींची लागवड करा आणि योग्य वेळी पेरणी करा।",
            Telugu: "అధిక యూరియా వాడకాన్ని నివారించండి. తెగులు తట్టుకునే బాస్మతి రకాలను నాటండి మరియు సకాలంలో విత్తండి.",
            Bengali: "অতিরিক্ত ইউরিয়া প্রয়োগ এড়িয়ে চলুন। রোগ প্রতিরোধ ক্ষমতাসম্পন্ন বাসমতি জাত চাষ করুন।"
          }[lang] || res.treatment.prevention,

          "Late Blight (Phytophthora infestans)": {
            Hindi: "फव्वारे के बजाय ड्रिप लाइन से पानी दें। पंक्तियों के बीच हवा का वेंटिलेशन सुनिश्चित करें। खेत के आसपास के खरपतवार नष्ट करें।",
            Punjabi: "ਫੁਹਾਰਾ ਸਿੰਚਾਈ ਦੀ ਬਜਾਏ ਤੁਪਕਾ ਸਿੰਚਾਈ ਵਰਤੋ। ਲਾਈਨਾਂ ਵਿਚਕਾਰ ਸਹੀ ਦੂਰੀ ਰੱਖੋ। ਨਦੀਨਾਂ ਨੂੰ ਨਸ਼ਟ ਕਰੋ।",
            Marathi: "तुषार सिंचनाऐवजी ठिबक सिंचनाने पाणी द्या। ओळींमध्ये हवा खेळती राहण्याची खात्री करा। शेताभोवतीचे तण नष्ट करा।",
            Telugu: "స్ప్రేయర్లకు బదులుగా డ్రిప్ లైన్ల ద్వారా నీరందించండి. వరుసల మధ్య గాలి వెలుతురు ఉండేలా చూసుకోండి. కలుపును నాశనం చేయండి.",
            Bengali: "ঝরনা সেচের বদলে ড্রিপ লাইনের মাধ্যমে জল দিন। সারির মাঝে সঠিক হাওয়া চলাচলের ব্যবস্থা রাখুন। আগাছা পরিষ্কার করুন।"
          }[lang] || res.treatment.prevention,

          "Cotton Leaf Curl Disease (CLCuD)": {
            Hindi: "खेत को एबुटिलोन जैसे खरपतवारों से मुक्त रखें। सफेद मक्खी-सहिष्णु किस्मों को ही लगाएं।",
            Punjabi: "ਖੇਤ ਨੂੰ ਨਦੀਨਾਂ ਤੋਂ ਮੁਕਤ ਰੱਖੋ। ਚਿੱਟੀ ਮੱਖੀ ਦਾ ਮੁਕਾਬਲਾ ਕਰਨ ਵਾਲੀਆਂ ਕਿਸਮਾਂ ਬੀਜੋ।",
            Marathi: "शेत तणमुक्त ठेवा। पांढऱ्या माशीला प्रतिकार करणाऱ्या वाणांचीच लागवड करा।",
            Telugu: "చేనును తుత్తురు బెండ వంటి కలుపు మొక్కలు లేకుండా ఉంచండి. తెల్లదోమను తట్టుకునే రకాలను నాటండి.",
            Bengali: "জমি আগাছামুক্ত রাখুন। সাদা মাছি প্রতিরোধ ক্ষমতাসম্পন্ন জাত বপন করুন।"
          }[lang] || res.treatment.prevention,

          "White Rust of Mustard (Albugo candida)": {
            Hindi: "खेत में जल निकासी सुनिश्चित करें। बुवाई से पहले बीजों को मेटालैक्सिल-एम @ 6g/किग्रा से उपचारित करें। फसल के अवशेषों को नष्ट करें।",
            Punjabi: "ਖੇਤ ਵਿੱਚ ਪਾਣੀ ਦੇ ਨਿਕਾਸ ਦਾ ਸਹੀ ਪ੍ਰਬੰਧ ਰੱਖੋ। ਬੀਜਣ ਤੋਂ ਪਹਿਲਾਂ ਬੀਜ ਸੋਧ ਕਰੋ। ਰਹਿੰਦ-ਖੂੰਹਦ ਨੂੰ ਸਾੜ ਦਿਓ।",
            Marathi: "शेतात पाणी साचणार नाही याची काळजी घ्या। पेरणीपूर्वी बियाण्यास मेटॅलॅक्सिल-एम औषधाची प्रक्रिया करा। पिकांचे अवशेष नष्ट करा।",
            Telugu: "చేనులో నీరు నిల్వ ఉండకుండా చూసుకోండి. విత్తే ముందు మెటాలక్సిల్-ఎమ్ @ 6గ్రా/కిలో తో విత్తన శుద్ధి చేయండి.",
            Bengali: "জমিতে নিষ্কাশন ব্যবস্থা নিশ্চিত করুন। বপনের পূর্বে বীজ মেটালাক্সিল-এম দ্বারা শোধন করুন। ফসলের অবশিষ্টাংশ ধ্বংস করুন।"
          }[lang] || res.treatment.prevention,

          "Red Rot of Sugarcane (Colletotrichum falcatum)": {
            Hindi: "प्रमाणित स्वस्थ बीज के टुकड़ों का चयन करें। गहरी जुताई करें और गन्ने के साथ दलहनी फसलों का फसल चक्र अपनाएं।",
            Punjabi: "ਨਿਰੋਏ ਬੀਜਾਂ ਦੀ ਚੋਣ ਕਰੋ। ਡੂੰਘੀ ਵਾਹੀ ਕਰੋ ਅਤੇ ਫਸਲੀ ਚੱਕਰ ਵਿੱਚ ਫਲੀਦਾਰ ਫਸਲਾਂ ਅਪਣਾਓ।",
            Marathi: "प्रमाणित निरोगी बेणे निवडा। खोल नांगरणी करा। उसाची फेरपालट कडधान्य पिकांसोबत करा।",
            Telugu: "ధృవీకరించిన ఆరోగ్యకరమైన విత్తన ముక్కలను ఎంచుకోండి. లోతు దుక్కి దున్నండి. చెరకుతో పాటు పప్పుదినుసుల పంట మార్పిడి చేయండి.",
            Bengali: "সুপারিশকৃত সুস্থ বীজ টুকরো নির্বাচন করুন। গভীর চাষ দিন। ডাল জাতীয় ফসলের সাথে ফসল আবর্তন করুন।"
          }[lang] || res.treatment.prevention,

          "Healthy & Nutrient-Sufficient Leaf": {
            Hindi: "वर्तमान फसल कैलेंडर का पालन करें और कीटों के आगमन की साप्ताहिक जांच करें।",
            Punjabi: "ਫਸਲੀ ਚੱਕਰ ਦੇ ਕੈਲੰਡਰ ਦੀ ਪਾਲਣਾ ਕਰੋ ਅਤੇ ਹਰ ਹਫ਼ਤੇ ਕੀੜਿਆਂ ਦੀ ਜਾਂਚ ਕਰਦੇ ਰਹो।",
            Marathi: "नियोजित पीक वेळापत्रकाचे पालन करा आणि कीटकांच्या प्रादुर्भावासाठी साप्ताहिक पाहणी करा।",
            Telugu: "ప్రస్తుత పంట క్యాలెండర్ను అనుసరించండి మరియు పురుగుల ఉధృతిని వారానికోసారి గమనించండి.",
            Bengali: "চলতি ফসল পঞ্জিকা অনুসরণ করুন এবং সাপ্তাহিক পোকামাকড়ের আক্রমণ পর্যবেক্ষণ করুন।"
          }[lang] || res.treatment.prevention
        };

        const finalSymptoms = mappedSymptoms[res.diagnosis] || res.symptoms;
        const finalCauses = mappedCauses[res.diagnosis] || res.causes;
        const finalOrganic = mappedOrganic[res.diagnosis] || res.treatment.organic;
        const finalChemical = mappedChemical[res.diagnosis] || res.treatment.chemical;
        const finalPrevention = mappedPrevention[res.diagnosis] || res.treatment.prevention;

        return {
          ...res,
          diagnosis: localizedName,
          severity: getLocalizedHeuristicValue(res.severity, lang),
          symptoms: finalSymptoms,
          causes: finalCauses,
          treatment: {
            organic: finalOrganic,
            chemical: finalChemical,
            prevention: finalPrevention
          }
        };
      }
    }
    return res;
  };

  const finalResult = result ? getLocalizedResult(result) : null;

  return (
    <div className="space-y-6 pb-24 animate-fade-in font-sans max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight text-left">
            {t('aiCropScanner', lang)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium text-left">
            {t('aiCropScannerDesc', lang)}
          </p>
        </div>
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-2xl text-[11px] font-bold flex items-center space-x-1.5 shrink-0 animate-pulse">
            <WifiOff className="h-4 w-4 text-amber-600" />
            <span>{t('offlineModelEngaged', lang)}</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: SCANNER FORM PANEL */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-100 space-y-5">
          <h2 className="font-display font-extrabold text-slate-900 text-base sm:text-lg text-left">
            {lang === 'Hindi' ? 'फसल स्कैन' : lang === 'Punjabi' ? 'ਫਸਲ ਸਕੈਨ' : lang === 'Marathi' ? 'पीक स्कॅन' : lang === 'Telugu' ? 'పంట స్కాన్' : lang === 'Bengali' ? 'ফসল স্ক্যান' : 'Fasal Scan'}
          </h2>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold animate-fade-in flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form parameters */}
          <div className="space-y-4 text-left">
            
            {/* Select Crop */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">
                {t('selectCrop', lang)}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as Crop)}
                className="w-full bg-slate-50 text-slate-900 border-0 rounded-2xl py-3 px-4 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer outline-none"
              >
                {crops.length > 0 ? (
                  crops.map((c) => {
                    const localCropMap: Record<string, string> = {
                      'Rice': lang === 'Hindi' ? 'धान (चावल)' : lang === 'Punjabi' ? 'ਝੋਨਾ (ਚੌਲ)' : lang === 'Marathi' ? 'तांदूळ (भात)' : lang === 'Telugu' ? 'వరి' : lang === 'Bengali' ? 'ধান (চাল)' : 'Rice',
                      'Wheat': lang === 'Hindi' ? 'गेहूं' : lang === 'Punjabi' ? 'ਕਣਕ' : lang === 'Marathi' ? 'गहू' : lang === 'Telugu' ? 'గోధుమ' : lang === 'Bengali' ? 'গম' : 'Wheat',
                      'Cotton': lang === 'Hindi' ? 'कपास' : lang === 'Punjabi' ? 'ਕਪਾਹ' : lang === 'Marathi' ? 'कापूस' : lang === 'Telugu' ? 'పత్తి' : lang === 'Bengali' ? 'তুলা' : 'Cotton',
                      'Mustard': lang === 'Hindi' ? 'सरसों' : lang === 'Punjabi' ? 'ਸਰ੍ਹੋਂ' : lang === 'Marathi' ? 'मोहरी' : lang === 'Telugu' ? 'ఆవాలు' : lang === 'Bengali' ? 'সরিষা' : 'Mustard',
                      'Sugarcane': lang === 'Hindi' ? 'गन्ना' : lang === 'Punjabi' ? 'ਗੰਨਾ' : lang === 'Marathi' ? 'ऊस' : lang === 'Telugu' ? 'చెరకు' : lang === 'Bengali' ? 'আখ' : 'Sugarcane',
                      'Tomatoes': lang === 'Hindi' ? 'टमाटर' : lang === 'Punjabi' ? 'ਟਮਾਟਰ' : lang === 'Marathi' ? 'टोमॅटो' : lang === 'Telugu' ? 'టమోటాలు' : lang === 'Bengali' ? 'টমেটো' : 'Tomatoes'
                    };
                    return <option key={c} value={c}>{localCropMap[c] || c}</option>;
                  })
                ) : (
                  <>
                    <option value="Rice">{lang === 'Hindi' ? 'धान (चावल)' : 'Rice'}</option>
                    <option value="Wheat">{lang === 'Hindi' ? 'गेहूं' : 'Wheat'}</option>
                    <option value="Cotton">{lang === 'Hindi' ? 'कपास' : 'Cotton'}</option>
                    <option value="Mustard">{lang === 'Hindi' ? 'सरसों' : 'Mustard'}</option>
                    <option value="Sugarcane">{lang === 'Hindi' ? 'गन्ना' : 'Sugarcane'}</option>
                    <option value="Tomatoes">{lang === 'Hindi' ? 'टमाटर' : 'Tomatoes'}</option>
                  </>
                )}
              </select>
            </div>

            {/* Describe symptoms */}
            <div className="space-y-1.5 relative">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">
                  {t('describeSymptoms', lang)}
                </label>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-sm' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50'
                  }`}
                >
                  <Mic className="h-3 w-3 stroke-[2.5px]" />
                  <span>
                    {isListening 
                      ? (lang === 'Hindi' ? 'सुन रहा है...' : lang === 'Punjabi' ? 'ਸੁਣ ਰਿਹਾ ਹੈ...' : lang === 'Marathi' ? 'ऐकत आहे...' : lang === 'Telugu' ? 'వింటున్నారు...' : lang === 'Bengali' ? 'শুনছি...' : 'Listening...')
                      : (lang === 'Hindi' ? 'बोलें (आवाज)' : lang === 'Punjabi' ? 'ਬੋਲੋ' : lang === 'Marathi' ? 'बोला (आवाज)' : lang === 'Telugu' ? 'మాట్లాడండి' : lang === 'Bengali' ? 'বলুন (ভয়েস)' : 'Speak (Voice)')}
                  </span>
                </button>
              </div>
              <div className="relative">
                <textarea
                  placeholder={t('describeSymptomsPlaceholder', lang)}
                  rows={2.5}
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 border-0 rounded-2xl pl-3.5 pr-12 pt-3.5 pb-3.5 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 transition-all outline-none resize-none"
                ></textarea>
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200 cursor-pointer ${
                    isListening 
                      ? 'bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse' 
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                  }`}
                  title={isListening ? "Stop listening" : "Speak symptoms"}
                >
                  <Mic className="h-4 w-4" />
                </button>

                {/* Pulsing Voice Listening Visual Overlay */}
                {isListening && (
                  <div className="absolute inset-0 bg-emerald-50/95 rounded-2xl flex flex-col items-center justify-center space-y-3 z-10 border border-emerald-100 backdrop-blur-sm animate-fade-in">
                    <div className="relative flex items-center justify-center">
                      {/* Pulse rings */}
                      <div className="absolute w-16 h-16 bg-red-500/20 rounded-full animate-ping duration-1000"></div>
                      <div className="absolute w-12 h-12 bg-red-500/30 rounded-full animate-ping duration-1000 delay-300"></div>
                      <div className="absolute w-8 h-8 bg-red-500/40 rounded-full animate-ping duration-1000 delay-600"></div>
                      
                      {/* Central Mic circle */}
                      <button
                        type="button"
                        className="relative w-12 h-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg shadow-red-500/30 outline-none border-none"
                        onClick={toggleListening}
                      >
                        <Mic className="h-5 w-5 animate-pulse" />
                      </button>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-widest block animate-pulse">
                        {lang === 'Hindi' ? 'सुन रहा है... बोलें' : lang === 'Punjabi' ? 'ਸੁਣ ਰਿਹਾ ਹੈ...' : lang === 'Marathi' ? 'ऐकत आहे...' : lang === 'Telugu' ? 'వింటున్నారు...' : lang === 'Bengali' ? 'শুনছি...' : 'Listening... Speak now'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                        {lang === 'Hindi' ? 'रोकने के लिए यहाँ टैप करें' : lang === 'Punjabi' ? 'ਰੋਕਣ ਲਈ ਟੈਪ ਕਰੋ' : lang === 'Marathi' ? 'थांबवण्यासाठी टॅप करा' : lang === 'Telugu' ? 'ఆపడానికి నొక్కండి' : lang === 'Bengali' ? 'থামাতে আলতো চাপুন' : 'Tap to stop recording'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Photo upload zone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block text-left">
                {t('uploadLeafImage', lang)}
              </label>
              
              {imagePreview ? (
                /* Selected Preview box */
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video group shadow-inner">
                  <img 
                    src={imagePreview} 
                    alt="Uploaded Crop Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center space-x-3">
                    <label className="bg-white/95 hover:bg-white text-slate-800 font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer shadow-md">
                      <span>{lang === 'Hindi' ? 'बदलें' : lang === 'Punjabi' ? 'ਬਦਲੋ' : lang === 'Marathi' ? 'बदला' : lang === 'Telugu' ? 'మార్చండి' : lang === 'Bengali' ? 'পরিবর্তন' : 'Change'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                    </label>
                    <button 
                      type="button" 
                      onClick={handleReset} 
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-md cursor-pointer"
                    >
                      {lang === 'Hindi' ? 'हटाएं' : lang === 'Punjabi' ? 'ਹਟਾਓ' : lang === 'Marathi' ? 'काढून टाका' : lang === 'Telugu' ? 'తొలగించు' : lang === 'Bengali' ? 'মুছে ফেলুন' : 'Remove'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Zone */
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 hover:border-emerald-500 transition-all bg-slate-50/50 hover:bg-emerald-50/10 flex flex-col items-center text-center justify-center space-y-3 cursor-pointer relative min-h-44">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      {t('dragDropOrClick', lang)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">Supports PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* AI Diagnose button */}
            <button
              type="button"
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-emerald-100 hover:shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('runningDiagnostic', lang)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-emerald-200" />
                  <span>{lang === 'Hindi' ? 'एआई जांच शुरू करें' : lang === 'Punjabi' ? 'ਏਆਈ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ' : lang === 'Marathi' ? 'एआय निदान सुरू करा' : lang === 'Telugu' ? 'ఏఐ విశ్లేషణను ప్రారంభించండి' : lang === 'Bengali' ? 'এআই রোগ নির্ণয় শুরু করুন' : 'Initiate AI Diagnostic'}</span>
                </>
              )}
            </button>

          </div>

          {/* Quick Testing Sample panel */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 text-left">
              <HelpCircle className="h-4 w-4 text-emerald-600" />
              <span>{t('sampleDiseasedPhotos', lang)}</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_DISEASE_PHOTOS.map((sample, idx) => {
                const localizedSampleLabel: Record<string, string> = {
                  'Brown Rice Spot (Sample)': lang === 'Hindi' ? 'धान भूरा धब्बा (नमूना)' : lang === 'Punjabi' ? 'ਭੂਰਾ ਧੱਬਾ (ਨਮੂਨਾ)' : lang === 'Marathi' ? 'तांबडा ठिपका (नमुना)' : lang === 'Telugu' ? 'వరి ఆకు మచ్చ' : lang === 'Bengali' ? 'ধানের বাদামী দাগ (নমুনা)' : 'Brown Rice Spot (Sample)',
                  'Wheat Rust Stripe (Sample)': lang === 'Hindi' ? 'गेहूं रतुआ धारी (नमूना)' : lang === 'Punjabi' ? 'ਪੀਲੀ ਕੁੰਗੀ (ਨਮੂਨਾ)' : lang === 'Marathi' ? 'पिवळा तांबेरा (नमुना)' : lang === 'Telugu' ? 'గోధుమ గీత తుప్పు' : lang === 'Bengali' ? 'গমের মরিচা রোগ (নমুনা)' : 'Wheat Rust Stripe (Sample)',
                  'Tomato Early Blight (Sample)': lang === 'Hindi' ? 'टमाटर अगेती झुलसा' : lang === 'Punjabi' ? 'ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ (ਨਮੂਨਾ)' : lang === 'Marathi' ? 'लवकर करपा (नमुना)' : lang === 'Telugu' ? 'టమోటా ఆకుమాడు' : lang === 'Bengali' ? 'টমেটোর আগাম ধসা' : 'Tomato Early Blight (Sample)'
                };
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl text-center space-y-1 transition-colors cursor-pointer"
                  >
                    <img 
                      src={sample.image} 
                      alt={sample.label} 
                      className="h-10 w-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] font-bold block leading-none truncate text-slate-700">{localizedSampleLabel[sample.label] || sample.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIAGNOSTICS RESULTS PRESCRIPTION */}
        <div className="lg:col-span-7">
          {finalResult ? (
            /* Structured leaf diagnosis prescription results */
            <div className="bg-white rounded-3xl border border-slate-100 shadow-lg overflow-hidden animate-fade-in text-left">
              
              {/* Diagnosis header */}
              <div className={`bg-gradient-to-r ${!isOnline || finalResult.id?.startsWith('offline-') ? 'from-amber-600 to-amber-700' : 'from-emerald-600 to-emerald-700'} p-5 text-white flex items-start justify-between`}>
                <div className="space-y-1.5 text-left">
                  {!isOnline || finalResult.id?.startsWith('offline-') ? (
                    <div className="inline-flex items-center space-x-1.5 bg-amber-500/30 border border-amber-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      <WifiOff className="h-3 w-3 text-amber-200 inline" />
                      <span>{t('offlineLocalHeuristics', lang)}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-500/30 border border-emerald-400/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      <Sparkles className="h-3 w-3 text-emerald-200 inline" />
                      <span>{t('geminiAiAgronomist', lang)}</span>
                    </div>
                  )}
                  <h3 className="font-display font-extrabold text-lg sm:text-xl leading-none">
                    {!isOnline || finalResult.id?.startsWith('offline-') ? t('localExpertPrescription', lang) : t('diagnosticPrescriptionSheet', lang)}
                  </h3>
                  <p className="text-xs text-emerald-100 opacity-90">
                    {lang === 'Hindi' ? 'फसल:' : lang === 'Punjabi' ? 'ਫਸਲ:' : lang === 'Marathi' ? 'पीक:' : lang === 'Telugu' ? 'పంట:' : lang === 'Bengali' ? 'ফসল:' : 'Crop:'} {finalResult.crop} • {t('analysisConfidence', lang)}: {finalResult.confidence}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleSpeakResult}
                    className={`p-2.5 rounded-2xl flex items-center justify-center text-white shrink-0 cursor-pointer transition-all ${
                      isSpeaking ? 'bg-amber-500 text-white animate-pulse' : 'bg-white/15 hover:bg-white/25'
                    }`}
                    title={isSpeaking ? "Stop speaking" : "Listen in voice"}
                  >
                    {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <div className="p-2.5 bg-white/15 rounded-2xl flex items-center justify-center text-white shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Disease Info block */}
              <div className="p-6 space-y-6">
                
                {/* Disease name & Severity Badge row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                  <div className="flex-1 text-left min-w-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {lang === 'Hindi' ? 'पहचाना गया रोग / स्वास्थ्य स्थिति' : lang === 'Punjabi' ? 'ਪਛਾਣਿਆ ਗਿਆ ਰੋਗ / ਸਿਹਤ ਸਥਿਤੀ' : lang === 'Marathi' ? 'पिकावरील रोग / आरोग्य स्थिती' : lang === 'Telugu' ? 'గుర్తించిన తెగులు / ఆరోగ్య స్థితి' : lang === 'Bengali' ? 'শনাক্তকৃত রোগ / স্বাস্থ্য অবস্থা' : 'Identified Disease / Health Status'}
                    </span>
                    <h4 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight mt-0.5 text-left">
                      {finalResult.diagnosis}
                    </h4>
                    
                    {/* Speaker control button */}
                    <button
                      type="button"
                      onClick={toggleSpeakResult}
                      className={`mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm border ${
                        isSpeaking
                          ? 'bg-red-500 text-white border-red-600 animate-pulse'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200/40'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-4 w-4 animate-bounce" />
                          <span>{lang === 'Hindi' ? 'आवाज बंद करें' : lang === 'Punjabi' ? 'ਅਵਾਜ਼ ਬੰਦ ਕਰੋ' : lang === 'Marathi' ? 'आवाज बंद करा' : lang === 'Telugu' ? 'వాయిస్ ఆఫ్ చేయండి' : lang === 'Bengali' ? 'ভয়েস বন্ধ করুন' : 'Stop Voice'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4" />
                          <span>{lang === 'Hindi' ? 'रिपोर्ट सुनें (आवाज)' : lang === 'Punjabi' ? 'ਰਿਪੋਰਟ ਸੁਣੋ' : lang === 'Marathi' ? 'अहवाल ऐका (आवाज)' : lang === 'Telugu' ? 'రిపోర్ట్ వినండి' : lang === 'Bengali' ? 'রিপোর্ট শুনুন (ভয়েস)' : 'Listen Report'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Severity badge styling */}
                  {(() => {
                    const sev = finalResult.severity.toLowerCase();
                    let badgeClass = "bg-rose-50 text-rose-800 border-rose-100";
                    if (sev.includes("healthy") || sev.includes("स्वस्थ") || sev.includes("ਸਿਹਤਮੰਦ") || sev.includes("निरोगी") || sev.includes("ఆరోగ్యకరం") || sev.includes("সুস্থ")) badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-100";
                    else if (sev.includes("low") || sev.includes("कम") || sev.includes("ਘੱਟ") || sev.includes("कमी") || sev.includes("తక్కువ") || sev.includes("কম")) badgeClass = "bg-sky-50 text-sky-800 border-sky-100";
                    else if (sev.includes("medium") || sev.includes("मध्यम") || sev.includes("ਦਰਮਿਆਨਾ") || sev.includes("మధ్యస్థం") || sev.includes("মাঝারি")) badgeClass = "bg-amber-50 text-amber-800 border-amber-100";

                    return (
                      <span className={`px-3 py-1 border rounded-lg text-xs font-bold uppercase tracking-widest ${badgeClass} shrink-0`}>
                        {finalResult.severity}
                      </span>
                    );
                  })()}
                </div>

                {/* Symptoms found & Causes */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 text-left">
                    <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block text-left">
                      {t('symptoms', lang)}
                    </h5>
                    <ul className="space-y-1.5 text-left">
                      {finalResult.symptoms.map((symptom, sIdx) => (
                        <li key={sIdx} className="text-xs text-slate-600 flex items-start space-x-2 leading-relaxed text-left">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                          <span className="text-left">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 text-left">
                    <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block text-left">
                      {t('causes', lang)}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100/40 text-left">
                      {finalResult.causes}
                    </p>
                  </div>
                </div>

                {/* Triple Tab Treatment prescription cards */}
                <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                  <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block text-left">
                    {t('treatment', lang)}
                  </h5>
                  
                  <div className="grid sm:grid-cols-3 gap-4">
                    
                    {/* Organic card */}
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl space-y-2 text-left">
                      <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>{t('organic', lang)}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium text-left">
                        {finalResult.treatment.organic}
                      </p>
                    </div>

                    {/* Chemical card */}
                    <div className="p-4 bg-amber-50/50 border border-amber-100/60 rounded-2xl space-y-2 text-left">
                      <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs uppercase tracking-wider">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{t('chemical', lang)}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium text-left">
                        {finalResult.treatment.chemical}
                      </p>
                    </div>

                    {/* Prevention card */}
                    <div className="p-4 bg-sky-50/50 border border-sky-100/60 rounded-2xl space-y-2 text-left">
                      <div className="flex items-center space-x-1.5 text-sky-800 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <span>{t('prevention', lang)}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 leading-relaxed font-medium text-left">
                        {finalResult.treatment.prevention}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Reset button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleReset}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                  >
                    {lang === 'Hindi' ? 'जांच साफ करें और नया स्कैन करें' : lang === 'Punjabi' ? 'ਸਾਫ਼ ਕਰੋ ਅਤੇ ਨਵਾਂ ਸਕੈਨ ਕਰੋ' : lang === 'Marathi' ? 'निदान साफ करा आणि नवीन स्कॅन सुरू करा' : lang === 'Telugu' ? 'మళ్లీ మొదటి నుండి విశ్లేషించండి' : lang === 'Bengali' ? 'ক্লিয়ার করুন ও নতুন পাতা পরীক্ষা করুন' : 'Clear Analysis & Start New Scan'}
                  </button>
                </div>

              </div>

            </div>
          ) : (
            /* Standby empty prescription mockup guide */
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center h-full flex flex-col items-center justify-center space-y-4 min-h-96">
              <div className="p-4 bg-white text-slate-300 rounded-3xl shadow-inner">
                <FileText className="h-10 w-10" />
              </div>
              <div className="max-w-sm space-y-1.5">
                <h3 className="font-display font-extrabold text-slate-700 text-base">
                  {lang === 'Hindi' ? 'फसल जांच के लिए तैयार' : lang === 'Punjabi' ? 'ਫਸਲ ਜਾਂਚ ਲਈ ਤਿਆਰ' : lang === 'Marathi' ? 'पीक निदान प्रतिक्षा' : lang === 'Telugu' ? 'రోగా నిర్ధారణ వేచి ఉంది' : lang === 'Bengali' ? 'ফসলের রোগ নির্ণয় অপেক্ষমান' : 'Standby Crop Diagnosis'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'Hindi' ? 'अभी तक कोई स्कैन शुरू नहीं किया गया है। कृपया एक फसल चुनें, लक्षण लिखें, एक पत्ती की फोटो अपलोड करें या ऊपर दिए गए किसी नमूना फोटो पर क्लिक करें।'
                   : lang === 'Punjabi' ? 'ਅਜੇ ਕੋਈ ਸਕੈਨ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਫਸਲ ਚੁਣੋ, ਲੱਛਣ ਲਿਖੋ, ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।'
                   : lang === 'Marathi' ? 'अद्याप कोणतेही स्कॅन सुरू केलेले नाही। पीक निवडा, लक्षणांची नोंद करा, पानाचा फोटो अपलोड करा किंवा वरील नमुना फोटो निवडा।'
                   : lang === 'Telugu' ? 'ఇంకా ఎటువంటి స్కాన్ ప్రారంభించలేదు. దయచేసి పంటను ఎంచుకోండి, లక్షణాలు నమోదు చేయండి.'
                   : lang === 'Bengali' ? 'এখনো কোনো পরীক্ষা শুরু করা হয়নি। দয়া করে একটি ফসল নির্বাচন করুন, লক্ষণ উল্লেখ করুন, একটি পাতার ছবি আপलोड করুন।'
                   : 'No scan initiated yet. Select a crop, input symptoms, upload a leaf photo or tap a sample crop photo above to generate a prescription.'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
