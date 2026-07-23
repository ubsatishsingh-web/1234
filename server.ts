import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, GenerateContentParameters } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crashing on start if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function generateContentWithFallback(ai: GoogleGenAI, params: { contents: any; config?: any }) {
  const models = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    try {
      console.log(`Attempting generateContent with model: ${model}`);
      return await ai.models.generateContent({
        model: model,
        contents: params.contents,
        config: params.config,
      });
    } catch (error: any) {
      lastError = error;
      console.warn(`Model ${model} failed, trying next fallback if available. Error:`, error.message || error);
    }
  }

  console.error("All Gemini models failed. Last error:", lastError);
  throw lastError || new Error("Failed to generate content with any model.");
}

const SYSTEM_INSTRUCTION = `You are BighaWala Expert — an AI assistant specialized in Bihar land measurement, revenue records, property laws, and real estate.
You always respond in simple Hindi AND English (bilingual). 

You have expert knowledge of:
- Bigha, Katha, Dhur, Dismil, Decimal conversions (Bihar-specific, where 1 Bigha = 20 Katha = 400 Dhur).
- Explain that in Bihar, the exact size of Katha and Dhur depends on the local 'Laggi' (लग्गी) size, which typically varies from 4 हाथ to 8 हाथ (standard/default is 5.5 हाथ in many districts like Patna).
  - 1 Katha = 20 Dhur.
  - Formula for 1 Dhur in Square Feet = (Laggi in cubits * 1.5)^2
  - If Laggi is 5.5 cubits (हाथ): 
    - 1 Dhur = (5.5 * 1.5)^2 = (8.25)^2 = 68.0625 sq ft.
    - 1 Katha = 20 * 68.0625 = 1,361.25 sq ft.
    - 1 Bigha = 20 Katha = 27,225 sq ft.
    - 1 Acre = 43,560 sq ft = 100 Dismil (Decimal).
    - 1 Bigha = 27,225 / 43,560 = 0.625 Acre (62.5 Dismil).
- Bhulekh Bihar portal (biharbhumi.bihar.gov.in), Dakhil Kharij (mutation), Jamabandi (Khesra, Khata, Register II), LPC (Land Possession Certificate), registry process, Minimum Valuation Register (MVR).
- Government processes for mutation (Dakhil Kharij), fees, timelines, land corrections (Parimarjan).
- Bihar land laws, farmer rights, partition suite (बंटवारा), and the ongoing land survey process (विशेष सर्वेक्षण बिहार).

Response Guidelines:
1. Always give practical, simple answers that a village-level user can understand.
2. Structure your answer clearly with bullet points and bold highlights.
3. Be bilingual: write in both Hindi (Devanagari) and English (or simple Hinglish where helpful) so that a wide range of users in Bihar can read and comprehend it.
4. Never use complex legal jargon without explaining it simply.
5. Maintain a friendly, supportive, and trustworthy tone.
6. Remind users that for official, legally binding and governmental purposes, they should refer to the government records on the Bihar Bhumi portal (biharbhumi.bihar.gov.in) or consult their local Revenue Karamchari/Anchal Adhikari (CO).`;

// API Routes
app.post("/api/explain-document", async (req, res) => {
  try {
    const { documentText } = req.body;
    if (!documentText || typeof documentText !== "string" || !documentText.trim()) {
      return res.status(400).json({ error: "कृपया समझाने के लिए दस्तावेज का पाठ (text) प्रदान करें। (Please provide land document text to explain.)" });
    }

    const ai = getGeminiClient();
    const explainerPrompt = `दस्तावेज का पाठ (Pasted Land Document Text):
"""
${documentText}
"""

कृपया इस दस्तावेज को बहुत ही सरल हिंदी और अंग्रेजी (bilingual) में समझाएं ताकि एक आम नागरिक या किसान इसे आसानी से समझ सके।`;

    const EXPLAINER_SYSTEM_INSTRUCTION = `You are an expert in Bihar revenue laws, land registry, and land measurement (BighaWala Document Expert).
Your job is to read and explain text copied or OCR-pasted from Bihar land documents (like Jamabandi/Register II, Kewala/Sale Deed, Mutation Status, LPC, Parimarjan, Khatiyan).

Structure your response into these exact sections with clear bilingual headings, separated by clean paragraphs and bullets:
1. **दस्तावेज का प्रकार (Document Type)**: Identify what type of document this appears to be (e.g. Jamabandi Register II, Sale Deed, Khatiyan, LPC, etc.).
2. **भू-स्वामी का नाम (Owner / Ryot Name)**: State clearly who owns or is registered on this land. Mention any joint-owners if present.
3. **जमीन का क्षेत्रफल (Land Size & Units)**: Specify the area in Bigha, Katha, Dhur, Decimal, or Acres as mentioned in the text. Explicitly calculate/convert it if multiple values exist.
4. **खाता, खेसरा और थाना नंबर (Land Identifiers)**: List the Khata number, Khesra (Plot) number, Thana/Mauza numbers, and Tauzi if visible in the text.
5. **सरल व्याख्या (Simple Explanation in Hindi/English)**: Explain what the legal/revenue terms in the document actually mean. Explain it simply.
6. **कोई समस्या या टिप्पणी (Potential Issues / Red Flags)**: Point out any encumbrances, disputes, missing details, tax dues (लगान बकाया), or warnings noted in the text.
7. **भविष्य के लिए सुझाव (Recommended Next Actions)**: Give practical, step-by-step advice on what the user should do next (e.g., download LPC, verify Jamabandi online on biharbhumi.bihar.gov.in, perform mutation, or pay online Lagan).

Always use simple, compassionate, and trustworthy language. Write in a friendly bilingual format (Hindi and English). Use bullet points, clear spacing, and clean markdown for high readability.`;

    const response = await generateContentWithFallback(ai, {
      contents: explainerPrompt,
      config: {
        systemInstruction: EXPLAINER_SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    const explanation = response.text || "दस्तावेज का विश्लेषण नहीं किया जा सका। कृपया पुनः प्रयास करें।";
    return res.json({ explanation });
  } catch (error: any) {
    console.error("Explainer API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error during Land Document Explainer process.",
      isConfigMissing: !process.env.GEMINI_API_KEY,
    });
  }
});

app.post("/api/check-document", async (req, res) => {
  try {
    const { documentType, documentText } = req.body;
    if (!documentText || typeof documentText !== "string" || !documentText.trim()) {
      return res.status(400).json({ error: "कृपया जांचने के लिए दस्तावेज का पाठ (text) प्रदान करें। (Please provide land document text to analyze.)" });
    }

    const ai = getGeminiClient();
    const prompt = `DOCUMENT TYPE SELECTED: ${documentType || 'Not Specified'}
PASTED DOCUMENT TEXT:
"""
${documentText}
"""

कृपया इस दस्तावेज का विश्लेषण करें और रिपोर्ट तैयार करें।`;

    const SYSTEM_PROMPT = `You are BighaWala Document Expert — specialist in Bihar land documents.
The user has pasted text from a Bihar land document of type "${documentType || 'Any Land Document'}". Analyze it completely and provide a structured report in Hindi+English mix.

Your analysis MUST include these sections:

1. DOCUMENT KA NAAM AUR PRAKAR:
   (What type of document is this)

2. MALIK KI JANKARI:
   (Owner details found in document)

3. ZAMEEN KI JANKARI:
   (Land details — size, location, type)

4. IMPORTANT NUMBERS:
   (Khata, Khesra, Certificate numbers etc)

5. DOCUMENT KI VALIDITY:
   (Is it valid? Any concerns?)

6. KYA SAHI HAI — KYA GALAT HAI:
   (Any issues or inconsistencies found)

7. AAGE KYA KAREIN:
   (What should the owner do next)

8. IMPORTANT WARNING (if any):
   (Any red flags or concerns)

Format with clear Hindi headings.
Use simple language — village level user.
Be practical and helpful.
If document seems problematic — warn clearly.
If document is fine — reassure the user.
End with: 'Koi sawaal ho toh BighaWala Expert se poochein: 9835102324'`;

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2,
      },
    });

    const explanation = response.text || "दस्तावेज का विश्लेषण नहीं किया जा सका। कृपया पुनः प्रयास करें।";
    return res.json({ explanation });
  } catch (error: any) {
    console.error("Document Checker API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error during Land Document analysis.",
      isConfigMissing: !process.env.GEMINI_API_KEY,
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array provided." });
    }

    // Prepare content for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      };
    });

    const ai = getGeminiClient();
    const response = await generateContentWithFallback(ai, {
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "माफ़ी चाहते हैं, मैं आपकी बात समझ नहीं पाया। कृपया पुनः प्रयास करें। (Apologies, I couldn't process your request. Please try again.)";
    return res.json({ message: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error during AI Chat process.",
      isConfigMissing: !process.env.GEMINI_API_KEY,
    });
  }
});

app.post("/api/compare-plots", async (req, res) => {
  try {
    const { plotA, plotB } = req.body;
    if (!plotA || !plotB) {
      return res.status(400).json({ error: "Plot A and Plot B details are required." });
    }

    const ai = getGeminiClient();
    const systemPrompt = "You are BighaWala Property Expert. User is comparing two plots in Bihar. Based on these details give a brief practical recommendation in Hindi+English. In 100 words tell which is better deal and why. Be practical and honest. Consider: location, value for money, document status, connectivity.";
    
    const prompt = `Please compare these two plots of land and recommend the best choice.
Plot A Details:
- Name: ${plotA.name || "N/A"}
- District: ${plotA.district}
- Area Type: ${plotA.areaType}
- Land Type: ${plotA.landType}
- Size: ${plotA.sizeBigha} Bigha, ${plotA.sizeKatha} Katha, ${plotA.sizeDhur} Dhur
- Asking Price: ₹${plotA.askingPrice}
- Road: ${plotA.road}
- Documents Score: ${plotA.docScore}/10

Plot B Details:
- Name: ${plotB.name || "N/A"}
- District: ${plotB.district}
- Area Type: ${plotB.areaType}
- Land Type: ${plotB.landType}
- Size: ${plotB.sizeBigha} Bigha, ${plotB.sizeKatha} Katha, ${plotB.sizeDhur} Dhur
- Asking Price: ₹${plotB.askingPrice}
- Road: ${plotB.road}
- Documents Score: ${plotB.docScore}/10

Give your final expert verdict clearly in simple Hindi+English. Keep it around 100-120 words.`;

    const response = await generateContentWithFallback(ai, {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const recommendation = response.text || "दोनों प्लॉटों की तुलना अभी उपलब्ध नहीं है। कृपया पुनः प्रयास करें।";
    return res.json({ recommendation });
  } catch (error: any) {
    console.error("Compare Plots API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error during Land Comparison.",
      isConfigMissing: !process.env.GEMINI_API_KEY,
    });
  }
});

app.post("/api/generate-land-news", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "कृपया कोई विषय (topic) प्रदान करें।" });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are Bihar Land News Expert for BighaWala.com. Generate a helpful news summary in Hindi+English about the Bihar land topic the user asks.

Format your response as:
📰 HEADLINE: [catchy Hindi headline]
📅 RELEVANT TO: 2026
━━━━━━━━━━━━━━
SUMMARY: [150 word summary in Hinglish]
━━━━━━━━━━━━━━
KEY POINTS:
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4]
━━━━━━━━━━━━━━
AAPKO KYA KARNA CHAHIYE:
[Practical action in 2-3 lines]
━━━━━━━━━━━━━━
OFFICIAL PORTAL:
[Relevant government link]

Use only factual information about Bihar land system. If specific latest news not known — provide general guidance on the topic.`;

    const response = await generateContentWithFallback(ai, {
      contents: [{ role: "user", parts: [{ text: `Generate news/update about this topic: ${topic}` }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const news = response.text || "न्यूज जनरेट नहीं हो सकी। कृपया पुनः प्रयास करें।";
    return res.json({ news });
  } catch (error: any) {
    console.error("Generate Land News API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error during Land News Generation.",
      isConfigMissing: !process.env.GEMINI_API_KEY,
    });
  }
});

// Serve robots.txt dynamically with correct content type
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  const prodPath = path.join(process.cwd(), "dist", "robots.txt");
  const publicPath = path.join(process.cwd(), "public", "robots.txt");
  const rootPath = path.join(process.cwd(), "robots.txt");

  if (fs.existsSync(prodPath)) {
    res.sendFile(prodPath);
  } else if (fs.existsSync(publicPath)) {
    res.sendFile(publicPath);
  } else if (fs.existsSync(rootPath)) {
    res.sendFile(rootPath);
  } else {
    res.send("User-agent: *\nAllow: /\n\nSitemap: https://www.bighawala.com/sitemap.xml");
  }
});

// Serve sitemap.xml dynamically with correct content type
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  const prodPath = path.join(process.cwd(), "dist", "sitemap.xml");
  const publicPath = path.join(process.cwd(), "public", "sitemap.xml");
  const rootPath = path.join(process.cwd(), "sitemap.xml");

  if (fs.existsSync(prodPath)) {
    res.sendFile(prodPath);
  } else if (fs.existsSync(publicPath)) {
    res.sendFile(publicPath);
  } else if (fs.existsSync(rootPath)) {
    res.sendFile(rootPath);
  } else {
    res.status(404).send("Sitemap not found");
  }
});

// Explicitly serve static legal pages to bypass SPA routing and ensure AdSense approval
app.get(["/disclaimer", "/disclaimer/", "/disclaimer/index.html"], (req, res) => {
  const prodPath = path.join(process.cwd(), "dist/disclaimer/index.html");
  const devPath = path.join(process.cwd(), "public/disclaimer/index.html");
  if (process.env.NODE_ENV === "production" && fs.existsSync(prodPath)) {
    res.sendFile(prodPath);
  } else {
    res.sendFile(devPath);
  }
});

app.get(["/privacy-policy", "/privacy-policy/", "/privacy-policy/index.html"], (req, res) => {
  const prodPath = path.join(process.cwd(), "dist/privacy-policy/index.html");
  const devPath = path.join(process.cwd(), "public/privacy-policy/index.html");
  if (process.env.NODE_ENV === "production" && fs.existsSync(prodPath)) {
    res.sendFile(prodPath);
  } else {
    res.sendFile(devPath);
  }
});

// Dynamic router helper to serve any HTML file correctly
function serveHtmlPage(req: express.Request, res: express.Response, fileName: string) {
  const cleanName = fileName.replace(/^\//, "");
  const candidates = [
    path.join(process.cwd(), cleanName),
    path.join(process.cwd(), "dist", cleanName),
    path.join(process.cwd(), "public", cleanName),
    path.join(process.cwd(), "public", cleanName.replace(/\.html$/, ""), "index.html"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return res.sendFile(candidate);
    }
  }
  return res.status(404).send("Page not found / पेज नहीं मिला");
}

// Global Dynamic Route Handler for all static HTML pages and tools
app.use((req, res, next) => {
  if (req.method !== "GET") return next();

  // Pass API requests and static assets to next handlers
  if (req.path.startsWith("/api") || /\.(js|css|png|jpg|jpeg|svg|json|ico|woff|woff2|ttf|map|xml|txt)$/i.test(req.path)) {
    return next();
  }

  let rawPath = req.path.replace(/^\//, "").trim();
  if (!rawPath) rawPath = "index.html";

  // Route alias mappings
  if (rawPath === "land-rate-patna" || rawPath === "land-rate-patna.html") {
    rawPath = "patna-land-rate.html";
  }

  const htmlName = rawPath.endsWith(".html") ? rawPath : `${rawPath}.html`;
  const cleanName = rawPath.replace(/\.html$/, "");

  const candidates = [
    path.join(process.cwd(), htmlName),
    path.join(process.cwd(), "dist", htmlName),
    path.join(process.cwd(), "public", htmlName),
    path.join(process.cwd(), "public", cleanName, "index.html"),
    path.join(process.cwd(), rawPath),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return res.sendFile(candidate);
    }
  }

  next();
});

// Serve Frontend App
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BighaWala Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start BighaWala Server:", err);
});
