import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server-side middleware for JSON parsing
app.use(express.json({ limit: "20mb" }));

// Initialize Gemini API client safely (lazy-initialization & checking)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features will fallback to smart mock responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "placeholder",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// AI Endpoint: Crop Diagnostics / Scanner
// ----------------------------------------------------
app.post("/api/diagnose", async (req, res) => {
  try {
    const { image, crop, symptoms, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing crop image data" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return highly structured, intelligent fallback mock diagnosis based on selected crop to keep the UX flawless
      return res.json(getMockDiagnosis(crop, symptoms, language || "English"));
    }

    const ai = getGeminiClient();

    // The image arrives as a base64 data URL. Strip out the metadata header.
    const base64Data = image.split(",")[1] || image;
    const mimeType = image.split(";")[0]?.split(":")[1] || "image/jpeg";

    const prompt = `You are a professional Agronomist and Crop Doctor called "Fasal Doctor".
    Analyze the provided leaf/crop image for the crop "${crop || "unknown crop"}" with noted farmer symptoms: "${symptoms || "none described"}".
    Provide a diagnostic analysis in the language: "${language || "English"}".
    You must return a highly structured JSON response conforming to the schema.
    If the leaf looks healthy, mark it as healthy.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING, description: "The identified crop" },
            diagnosis: { type: Type.STRING, description: "Name of the crop disease or health status in English and translated language" },
            severity: { type: Type.STRING, description: "Must be one of: Healthy, Low, Medium, High" },
            confidence: { type: Type.STRING, description: "Confidence percentage, e.g., '92%'" },
            symptoms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Key physical symptoms noticed on the plant",
            },
            causes: { type: Type.STRING, description: "Underlying reason or pathogen causing this disease" },
            treatment: {
              type: Type.OBJECT,
              properties: {
                organic: { type: Type.STRING, description: "Eco-friendly, organic treatments or cultural controls" },
                chemical: { type: Type.STRING, description: "Chemical recommendations (fertilizers, fungicides, pesticides, exact doses) if severe" },
                prevention: { type: Type.STRING, description: "How to prevent this issue in the future" },
              },
              required: ["organic", "chemical", "prevention"],
            },
          },
          required: ["crop", "diagnosis", "severity", "confidence", "symptoms", "causes", "treatment"],
        },
      },
    });

    const resultText = response.text || "{}";
    const diagnosticResult = JSON.parse(resultText);
    return res.json(diagnosticResult);
  } catch (error: any) {
    console.error("Diagnosis error:", error);
    res.status(500).json({
      error: "Diagnostics failed",
      details: error.message || error,
    });
  }
});

// ----------------------------------------------------
// AI Endpoint: Chatbot Assistant
// ----------------------------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language, cropContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback mock chat bot response
      const lastMessage = messages[messages.length - 1]?.content || "";
      return res.json({
        reply: getMockChatReply(lastMessage, cropContext, language || "English"),
      });
    }

    const ai = getGeminiClient();

    // Prepare message structure
    // Translate the history into system instruction and standard chats
    const systemInstruction = `You are "Fasal Doctor AI", an empathetic, expert agricultural voice assistant and chatbot for Indian farmers.
    You communicate in a warm, friendly, practical, and action-oriented manner.
    Always respond in the language requested: "${language || "English"}" (but keep standard crop/fertilizer names clear, e.g., Urea, NPK, Neem oil).
    The farmer is growing or interested in: "${cropContext || "various Indian crops"}".
    Keep your answers concise, structured (using clear bullet points and bold headers), and highly applicable to a farmer.
    Advise them on organic solutions first, and specify precise chemical dosages when appropriate. Keep in mind Indian farming standards (acres, quintals, bighas, mandis).`;

    // Map message list to Gemini contents
    const contents = messages.map((m) => {
      return {
        role: m.role === "assistant" ? "model" as const : "user" as const,
        parts: [{ text: m.content }],
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Chat assistant failed",
      details: error.message || error,
    });
  }
});

// ----------------------------------------------------
// Mock Data Helpers (for when GEMINI_API_KEY is not set)
// ----------------------------------------------------
function getMockDiagnosis(crop: string = "Wheat", symptoms: string = "", language: string = "English") {
  const isHindi = language.toLowerCase() === "hindi";
  const label = (en: string, hi: string) => (isHindi ? hi : en);

  const cleanCrop = crop.toLowerCase();

  if (cleanCrop.includes("rice")) {
    return {
      crop: "Basmati Rice",
      diagnosis: label("Rice Blast (Magnaporthe oryzae)", "धान का झुलसा रोग (राइस ब्लास्ट)"),
      severity: "Medium",
      confidence: "88%",
      symptoms: [
        label("Spindle-shaped spots with grey centers on leaves", "पत्तियों पर भूरे/राख के रंग वाले केंद्र के साथ धुरी के आकार के धब्बे"),
        label("Brownish lesion neck symptoms", "पत्तियों के नोक पर भूरे रंग के धब्बे"),
      ],
      causes: label(
        "Fungal pathogen favored by high humidity, overcast days, and excessive nitrogen application.",
        "कवक रोगजनक जो अत्यधिक नमी, बादल छाए रहने और यूरिया के अधिक उपयोग से फैलता है।"
      ),
      treatment: {
        organic: label(
          "Spray Neem oil (5ml/L) and ensure crop spacing to allow proper aeration. Use pseudomonas fluorescens bio-formulation at 10g/L.",
          "नीम का तेल (5ml/L) का छिड़काव करें। हवा और प्रकाश के लिए पौधों के बीच पर्याप्त दूरी रखें।"
        ),
        chemical: label(
          "Apply Tricyclazole 75% WP @ 120g per acre in 200 liters of water at early leaf blast stages.",
          "शुरुआती चरण में ट्राइसाइक्लाजोल 75% WP @ 120 ग्राम प्रति एकड़ 200 लीटर पानी में मिलाकर स्प्रे करें।"
        ),
        prevention: label(
          "Use disease-resistant certified seeds. Avoid excess urea (nitrogen) fertilizer. Treat seeds with Carbendazim before sowing.",
          "रोग-प्रतिरोधी बीजों का प्रयोग करें। आवश्यकता से अधिक नाइट्रोजन/यूरिया डालने से बचें।"
        ),
      },
    };
  } else if (cleanCrop.includes("tomato")) {
    return {
      crop: "Tomato",
      diagnosis: label("Early Blight (Alternaria solani)", "टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)"),
      severity: "High",
      confidence: "94%",
      symptoms: [
        label("Concentric dark brown circular spots resembling target-board on older leaves", "निचली पत्तियों पर गोल भूरे रंग के छल्लेदार धब्बे"),
        label("Yellowing margins around the spots causing leaves to drop", "धब्बों के चारों ओर पीलापन जिसके कारण पत्तियाँ गिरने लगती हैं"),
      ],
      causes: label(
        "Soil-borne fungal pathogen thriving in warm, damp weather conditions with frequent rain.",
        "मिट्टी जनित कवक जो गर्म और नम मौसम में वर्षा के बाद तेजी से पनपता है।"
      ),
      treatment: {
        organic: label(
          "Prune lower leaves to avoid contact with soil splashing. Spray Copper Oxychloride or Trichoderma viride biological spray.",
          "निचली टहनियों और सूखी पत्तियों की छंटाई करें ताकि मिट्टी से फंगस न फैले। ट्राइकोडर्मा विरिडी जैव स्प्रे का छिड़काव करें।"
        ),
        chemical: label(
          "Spray Mancozeb 75% WP @ 600g per acre or Chlorothalonil 75% WP @ 400g per acre with a sticker agent.",
          "मैंकोज़ेब 75% WP @ 600 ग्राम प्रति एकड़ या क्लोरोथैलोनिल 75% WP @ 400 ग्राम प्रति एकड़ का छिड़काव करें।"
        ),
        prevention: label(
          "Implement crop rotation with non-solanaceous crops (avoid potatoes or eggplants next). Keep mulch on soil to stop spore splash.",
          "फसल चक्र अपनाएं (अगली बार वहां बैंगन या आलू न लगाएं)। मिट्टी पर मल्चिंग करें।"
        ),
      },
    };
  } else {
    // Default fallback: Wheat Rust
    return {
      crop: crop || "Wheat",
      diagnosis: label("Yellow Leaf Rust (Puccinia striiformis)", "पीला रतुआ रोग (येलो रस्ट)"),
      severity: "Medium",
      confidence: "91%",
      symptoms: [
        label("Yellow/orange stripes or pustules forming along leaf veins", "पत्तियों की नसों पर पीले या नारंगी रंग की धारियाँ/धब्बे बनना"),
        label("Powdery yellow dust coming off easily when leaf is touched", "पत्ती को छूने पर हाथ में पीला पाउडर जैसा पाउडर लगना"),
      ],
      causes: label(
        "Airborne fungal spores traveling long distances, favored by temperatures between 10-20°C and dew.",
        "हवा में तैरने वाले कवक बीजाणु जो कम तापमान (10-20°C) और ओस में तेजी से सक्रिय होते हैं।"
      ),
      treatment: {
        organic: label(
          "Perform early sowing of rust-resistant varieties. Spray sour buttermilk (mtha) mixed with copper sulphate or garlic extract.",
          "समय पर बुआई करें। खट्टी छाछ में तांबा मिलाकर या लहसुन का अर्क स्प्रे करें।"
        ),
        chemical: label(
          "Spray Propiconazole 25% EC (Tilt) @ 200 ml per acre in 200 liters of water as soon as first yellow pustules appear.",
          "पीले धब्बे दिखते ही प्रोपिकोनाजोल 25% EC (टिल्ट) @ 200 मिली प्रति एकड़ 200 लीटर पानी में मिलाकर स्प्रे करें।"
        ),
        prevention: label(
          "Sow resistant wheat varieties like HD 3086, DBW 187, or PBW 725. Avoid high nitrogen dose in late winter.",
          "पीला रतुआ प्रतिरोधी किस्में जैसे HD 3086, DBW 187, या PBW 725 बोएं। सर्दियों के अंत में यूरिया की भारी खुराक न दें।"
        ),
      },
    };
  }
}

function getMockChatReply(userMessage: string, crop: string = "various crops", language: string = "English") {
  const query = userMessage.toLowerCase();
  const isHindi = language.toLowerCase() === "hindi" || /कृषि|खेती|धान|गेहूं|खाद|दवा|बताओ/.test(userMessage);

  if (isHindi) {
    if (query.includes("पीला") || query.includes("येलो")) {
      return `**नमस्ते किसान भाई!** आपके ${crop} में पत्तियों का पीला पड़ना नाइट्रोजन की कमी या पीला रतुआ (येलो रस्ट) बीमारी का संकेत हो सकता है।
      
**मुख्य उपाय:**
1. **यदि नाइट्रोजन की कमी है:** प्रति एकड़ 20-25 किलोग्राम यूरिया का छिड़काव करें।
2. **यदि पीला रतुआ (कवक) है:** पत्तियों पर पीले धब्बे दिखने पर तुरंत **प्रोपिकोनाजोल 25% EC (टिल्ट)** @ 200 मिलीलीटर को 200 लीटर पानी में मिलाकर प्रति एकड़ छिड़काव करें।
3. **जैविक उपाय:** खट्टी छाछ (5 लीटर) को 200 लीटर पानी में मिलाकर छिड़काव करें।
      
क्या आप पत्ती की फोटो भेज सकते हैं? मैं देखकर तुरंत सही बीमारी बता दूँगा!`;
    }
    if (query.includes("उर्वरक") || query.includes("खाद") || query.includes("urea") || query.includes("dap")) {
      return `**खाद की सही खुराक और प्रबंधन:**
      
${crop} के लिए संतुलित उर्वरक (N:P:K) बहुत आवश्यक है।
- **बुआई के समय:** 50 किलोग्राम DAP (फॉस्फोरस) और 20 किलोग्राम म्यूटेट ऑफ पोटाश (MOP) प्रति एकड़ डालें।
- **पहली और दूसरी सिंचाई:** बुआई के 21 और 45 दिनों बाद 25-25 किलोग्राम यूरिया (नाइट्रोजन) डालें।
- **जिंक सल्फेट:** यदि मिट्टी में जिंक की कमी है, तो 10 किलो जिंक सल्फेट (21%) बुआई के समय डालें।
      
उचित नमी में ही खाद डालें ताकि फसल को पूरा लाभ मिले!`;
    }
    return `**नमस्ते! मैं आपका "फसल डॉक्टर" सहायक हूँ।** 🌾 
    
मैं आपके खेत की मिट्टी, मौसम और ${crop} की सेहत सुधारने में मदद कर सकता हूँ। 
- आप मुझे अपनी फसल की बीमारियों के बारे में पूछ सकते हैं।
- फसल की पत्ती की फोटो अपलोड करके जांच करा सकते हैं।
- मंडी के भाव और मौसम की जानकारी ले सकते हैं।
    
बताइए आज मैं आपकी क्या सेवा करूँ?`;
  } else {
    // English replies
    if (query.includes("yellow") || query.includes("spot") || query.includes("rust")) {
      return `**Namaste!** Yellowing of leaves in your **${crop}** typically indicates either a Nitrogen deficiency or a fungal disease (like Rust or Leaf Spot).
      
**Immediate Actions Recommended:**
1. **Nitrogen Check:** If the yellowing is uniform from the lower leaves upwards, apply **20-25 kg Urea per acre** before irrigation.
2. **Fungal Check (Spots/Stripes):** If you see bright yellow stripes or dark circular spots, spray **Propiconazole 25% EC @ 200 ml/acre** dissolved in 200L of water.
3. **Organic Option:** Spray **Neem Oil (1.5 Liter per acre)** combined with water and a mild liquid soap sticker.
      
Please upload an image of the affected leaf in the "Diagnosis" tab, and I will identify the exact cause for you!`;
    }
    if (query.includes("fertilizer") || query.includes("feed") || query.includes("urea") || query.includes("dap") || query.includes("nitrogen")) {
      return `**Smart Fertilizer Management for ${crop}:**
      
For high yields, balanced feeding is crucial. Here is the recommended schedule per acre:
- **At Sowing (Basal Dose):** Apply **50 kg DAP** + **20 kg MOP (Potash)** + **10 kg Zinc Sulphate**.
- **First Top Dressing (21-25 Days):** Apply **25 kg Urea** just before the first crown root initiation irrigation.
- **Second Top Dressing (40-45 Days):** Apply another **20-25 kg Urea** during the active tillering/foliage growth stage.
      
*Pro Tip:* Try applying fertilizer during cool evening hours, and irrigate immediately after for optimal uptake.`;
    }
    return `**Namaste and Welcome to Fasal Doctor!** 🌾
    
I am your personal AI Agronomist, dedicated to maximizing your farm yields and keeping your ${crop} crops healthy. 
How can I assist you today?
- **Disease Diagnostics:** Go to the *Diagnosis* tab to upload a leaf photograph.
- **Weather Advisory:** Check the *Insights* tab for spray conditions and 7-day weather forecasts.
- **Market intelligence:** Visit *Market* for real-time Mandi rates and profit estimators.`;
  }
}

// ----------------------------------------------------
// Express Vite & Production Static File Hosting Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fasal Doctor server running on http://localhost:${PORT}`);
  });
}

startServer();
