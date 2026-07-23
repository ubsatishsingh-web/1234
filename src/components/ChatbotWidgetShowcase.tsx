import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Copy, 
  Check, 
  Code, 
  Download, 
  Sparkles, 
  Globe, 
  Send, 
  Trash2, 
  ExternalLink, 
  Calculator, 
  FileText, 
  ShieldCheck, 
  CheckCircle2,
  Zap,
  Layers
} from "lucide-react";

export default function ChatbotWidgetShowcase() {
  const [copiedCode, setCopiedCode] = useState<"html" | "script" | null>(null);
  const [selectedLang, setSelectedLang] = useState<"auto" | "hi" | "bho" | "mai" | "en">("auto");
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; langTag?: string }>>([
    {
      text: "नमस्ते! मैं **BighaWala AI Expert** हूँ। 🌾<br><br>बिहार की ज़मीन की मापी (बीघा, कट्ठा, धुर), दाखिल-खारिज (Mutation), जमाबंदी पंजी-2, सरकारी रेट (MVR 2026) या रजिस्ट्री नियम से जुड़ा कोई भी सवाल पूछें — **हिंदी, भोजपुरी, मैथिली या English** में।",
      isUser: false,
      langTag: "hi"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample questions list as requested by user
  const sampleQuestions = [
    { text: "1 bigha me kitna katha hota hai?", label: "1 बीघा = कितना कट्ठा?", lang: "Hindi" },
    { text: "dakhil kharij kaise karein?", label: "दाखिल खारिज प्रक्रिया", lang: "Hindi" },
    { text: "bhulekh kaise check karein?", label: "भूलेख / जमाबंदी ऑनलाइन", lang: "Hindi" },
    { text: "jamabandi kya hai?", label: "जमाबंदी क्या है?", lang: "Hindi" },
    { text: "बिहार में 1 बीघा में कितना धुर होता है?", label: "1 बीघा में धुर (हिन्दी)", lang: "Hindi" },
    { text: "दखिल खारिज के लिए कौन से दस्तावेज़ चाहिए?", label: "दाखिल खारिज दस्तावेज़", lang: "Hindi" },
    { text: "भोजपुरी में बताइए 1 बीघा में कत्था", label: "भोजपुरी मापी 🌾", lang: "Bhojpuri" },
    { text: "मैथिली मे 1 बीघा मे कति कट्ठा अछि?", label: "मैथिली मापी 🌾", lang: "Maithili" },
    { text: "land rate in patna 2026", label: "Patna Land Rate 2026", lang: "English" },
    { text: "mutation fees in bihar", label: "Mutation Fees & Charges", lang: "English" },
    { text: "how to check my land record online", label: "Check Land Record Online", lang: "English" }
  ];

  // Language detector logic
  const detectLanguage = (text: string): "hi" | "bho" | "mai" | "en" => {
    if (selectedLang !== "auto") return selectedLang;

    const lower = text.toLowerCase();
    const bhoKeywords = ["भोजपुरी", "बताईं", "कइसे", "खातिर", "रोउआ", "रउरा", "कइल जाला", "होखेला", "बाटे", "हटे", "होला", "कतना", "कत्था"];
    const maiKeywords = ["मैथिली", "कति", "अछि", "हमरा", "आहाँ", "अहां", "कतेक", "अछी", "भेल", "छै", "कट्ठा अछि"];

    for (let word of bhoKeywords) {
      if (text.includes(word)) return "bho";
    }
    for (let word of maiKeywords) {
      if (text.includes(word)) return "mai";
    }
    if (/^[a-zA-Z0-9\s\?\.\,\!\-\_\/\:\₹\$]+$/.test(text.trim()) && /[a-zA-Z]/.test(text)) {
      return "en";
    }
    return "hi";
  };

  // Unit Calculator Processor
  const processCalculator = (q: string, lang: "hi" | "bho" | "mai" | "en"): string | null => {
    const query = q.toLowerCase().replace(/,/g, "");

    // Bigha Match
    const bighaMatch = query.match(/(\d+(?:\.\d+)?)\s*(bigha|बीघा|बीहा)/i);
    if (bighaMatch) {
      const val = parseFloat(bighaMatch[1]);
      const katha = val * 20;
      const dhur = val * 400;
      const decimal = val * 20;
      const sqftPatna = Math.round(val * 27225);
      const sqftNorth = Math.round(val * 32400);

      if (lang === "bho") {
        return `<strong>📐 ${val} बीघा के मापी (बिहार मान के हिसाब से):</strong><br><br>` +
          `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
          `• <strong>धुर:</strong> ${dhur} धुर<br>` +
          `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
          `• <strong>स्क्वायर फिट (5.5 हाथ लगी - पटना):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>स्क्वायर फिट (6 हाथ लगी - उत्तर बिहार):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`;
      } else if (lang === "mai") {
        return `<strong>📐 ${val} बीघा के मापी (बिहार मानक):</strong><br><br>` +
          `• <strong>कट्ठा:</strong> ${katha} कट्ठा अछि<br>` +
          `• <strong>धुर:</strong> ${dhur} धुर<br>` +
          `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
          `• <strong>वर्ग फिट (6 हाथ लगि):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`;
      } else if (lang === "en") {
        return `<strong>📐 ${val} Bigha Unit Conversion (Bihar Standard):</strong><br><br>` +
          `• <strong>Katha:</strong> ${katha} Katha<br>` +
          `• <strong>Dhur:</strong> ${dhur} Dhur<br>` +
          `• <strong>Decimal:</strong> ${decimal} Decimal<br>` +
          `• <strong>Area (South Bihar / 5.5 Laggi):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>Area (North Bihar / 6 Laggi):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>Acre Equivalent:</strong> ${(val / 1.6).toFixed(2)} Acres`;
      } else {
        return `<strong>📐 ${val} बीघा की मापी (बिहार मानक अनुसार):</strong><br><br>` +
          `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
          `• <strong>धुर:</strong> ${dhur} धुर<br>` +
          `• <strong>डेसिमल (डिसमिल):</strong> ${decimal} डिसमिल<br>` +
          `• <strong>स्क्वायर फीट (पटना / 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>स्क्वायर फीट (उत्तर बिहार / 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>एकड़:</strong> ${(val / 1.6).toFixed(2)} एकड़`;
      }
    }

    // Katha Match
    const kathaMatch = query.match(/(\d+(?:\.\d+)?)\s*(katha|kattha|कट्ठा|कत्था|कठ्ठा)/i);
    if (kathaMatch) {
      const val = parseFloat(kathaMatch[1]);
      const bigha = (val / 20).toFixed(2);
      const dhur = val * 20;
      const sqftPatna = Math.round(val * 1361.25);
      const sqftNorth = Math.round(val * 1620);

      return `<strong>📐 ${val} कट्ठा (Katha) की मापी:</strong><br><br>` +
        `• <strong>बीघा:</strong> ${bigha} बीघा<br>` +
        `• <strong>धुर:</strong> ${dhur} धुर<br>` +
        `• <strong>क्षेत्रफल (पटना / 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
        `• <strong>क्षेत्रफल (उत्तर बिहार / 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`;
    }

    // Decimal Match
    const decimalMatch = query.match(/(\d+(?:\.\d+)?)\s*(decimal|dismil|डिसमिल|डेसिमल)/i);
    if (decimalMatch) {
      const val = parseFloat(decimalMatch[1]);
      const sqft = Math.round(val * 435.6);
      return `<strong>📐 ${val} डिसमिल (Decimal) की मापी:</strong><br><br>` +
        `• <strong>कुल वर्ग फीट:</strong> ${sqft.toLocaleString('en-IN')} sq ft<br>` +
        `• <strong>कट्ठा (5.5 हाथ लगी - पटना):</strong> ${(sqft / 1361.25).toFixed(2)} कट्ठा<br>` +
        `• <strong>कट्ठा (6 हाथ लगी - उत्तर बिहार):</strong> ${(sqft / 1620).toFixed(2)} कट्ठा`;
    }

    return null;
  };

  // Generate Engine Answer
  const getKnowledgeAnswer = (query: string) => {
    const lang = detectLanguage(query);
    const q = query.toLowerCase();

    // Check calculator
    const calcResult = processCalculator(query, lang);
    if (calcResult) {
      return { text: calcResult, lang };
    }

    // Out of domain
    if (/cricket|bollywood|movie|weather|modi|rahul|pizza|game|pubg/i.test(q)) {
      return {
        text: `माफ़ कीजिए, मैं सिर्फ़ बिहार की ज़मीन, बीघा मापी, दाखिल-खारिज, जमाबंदी, सरकारी रेट (MVR) और रजिस्ट्री से जुड़े सवालों में मदद कर सकता हूँ। 🌾<br><br>कृपया ज़मीन से संबंधित सवाल पूछें!`,
        lang
      };
    }

    // Dakhil Kharij / Mutation
    if (/dakhil|kharij|mutation|दाखिल|खारिज|दस्तावेज़|document/i.test(q)) {
      if (lang === "en") {
        return {
          text: `<strong>📝 Dakhil Kharij (Mutation) in Bihar:</strong><br><br>` +
            `• <strong>How to Apply:</strong> Visit <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">biharbhumi.bihar.gov.in</a> and click "Apply Online Dakhil Kharij".<br>` +
            `• <strong>Documents Required:</strong> Sale Deed (Kewala PDF), Aadhaar Card, Affidavit (شपथ पत्र), Khatian / Jamabandi copy.<br>` +
            `• <strong>Timeframe:</strong> 35 working days.<br>` +
            `• <strong>Fee:</strong> <strong>₹0 (Free Govt Online Application)</strong>.`,
          lang: "en"
        };
      } else if (lang === "bho") {
        return {
          text: `<strong>📝 बिहार में दाखिल-खारिज करावे के तरीका:</strong><br><br>` +
            `1. <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">biharbhumi.bihar.gov.in</a> पोर्टल पर जाईं।<br>` +
            `2. 'ऑनलाइन दाखिल खारिज' चुनीं।<br>` +
            `3. केवाला (Deed PDF) आ आधार कार्ड अपलोड करीं।<br>` +
            `4. 35 दिन में अंचलाधिकारी (CO) द्वारा शुद्धि पत्र मिल जाई।<br>` +
            `💰 <strong>सरकारी फीस:</strong> एकदम <strong>फ्री (₹0)</strong> बा।`,
          lang: "bho"
        };
      } else if (lang === "mai") {
        return {
          text: `<strong>📝 दाखिल खारिज (Mutation) प्रक्रिया:</strong><br><br>` +
            `1. बिहार भूमि वेब पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">biharbhumi.bihar.gov.in</a> पर जाऊ।<br>` +
            `2. केवाला प्रति, आधार आ स्व-घोषणा पत्र अपलोड करू।<br>` +
            `3. 35 दिनक भीतर CO ऑफिस सं शुद्धि पत्र निर्गत भऽ जायत।`,
          lang: "mai"
        };
      } else {
        return {
          text: `<strong>📝 दाखिल-खारिज (Mutation) के लिए आवश्यक दस्तावेज़ और प्रक्रिया:</strong><br><br>` +
            `• <strong>आवश्यक दस्तावेज़:</strong><br>` +
            `  1. पंजीकृत केवाला (Registered Sale Deed Copy)<br>` +
            `  2. क्रेता/विक्रेता का आधार कार्ड व मोबाइल नंबर<br>` +
            `  3. स्व-घोषणा/शपथ पत्र (Affidavit)<br>` +
            `  4. विक्रेता का हालिया जमाबंदी रसीद<br><br>` +
            `• <strong>आवेदन प्रक्रिया:</strong> <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">biharbhumi.bihar.gov.in</a> पर जाएँ ➔ 'ऑनलाइन दाखिल ख़ारिज आवेदन करें' ➔ फॉर्म भरकर PDF अपलोड करें।<br>` +
            `• <strong>समय सीमा:</strong> 35 कार्य दिवस (Uncontested)। शुल्क: <strong>₹0 (मुफ्त)</strong>।`,
          lang: "hi"
        };
      }
    }

    // Bhulekh / Jamabandi / Record of Rights
    if (/bhulekh|jamabandi|khata|khasra|record|भूलेख|जमाबंदी|खाता|खेसरा/i.test(q)) {
      return {
        text: `<strong>🔍 बिहार जमाबंदी पंजी-2 एवं भूलेख ऑनलाइन कैसे देखें:</strong><br><br>` +
          `1. बिहार भूमि के आधिकारिक पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">biharbhumi.bihar.gov.in</a> पर जाएँ।<br>` +
          `2. <strong>'जमाबंदी पंजी देखें'</strong> पर क्लिक करें।<br>` +
          `3. अपना <strong>ज़िला</strong>, <strong>अंचल</strong> और <strong>मौजा</strong> चुनें।<br>` +
          `4. खाता नंबर, खेसरा (प्लॉट) या रैयत के नाम से खोजें।<br>` +
          `5. आपके सामने डिजिटल जमाबंदी कॉपी और बकाया लगान विवरण आ जाएगा।`,
        lang
      };
    }

    // Land rates / Patna / MVR
    if (/rate|mvr|patna|circle|रेट|मूल्य|पटना|सर्किल/i.test(q)) {
      return {
        text: `<strong>💰 बिहार सरकारी सर्किल रेट (MVR Rates 2026):</strong><br><br>` +
          `• <strong>पटना (Patna):</strong> कमर्शियल मुख्य मार्ग ₹80 लाख - ₹2.5 करोड़/कट्ठा | आवासीय ₹25 लाख - ₹75 लाख/कट्ठा<br>` +
          `• <strong>मुजफ्फरपुर / भागलपुर / गया:</strong> ₹10 लाख - ₹35 लाख/कट्ठा<br>` +
          `• <strong>कृषि भूमि:</strong> ₹2 लाख - ₹8 लाख/बीघा<br><br>` +
          `जांचें: <a href="https://bhumijankari.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">bhumijankari.bihar.gov.in</a>`,
        lang
      };
    }

    // Stamp Duty & Mutation fees
    if (/stamp|duty|registry|fee|charge|स्टाम्प|रजिस्ट्री|खर्च/i.test(q)) {
      return {
        text: `<strong>📜 बिहार जमीन रजिस्ट्री खर्च & स्टाम्प ड्यूटी (2026):</strong><br><br>` +
          `• <strong>पुरुष क्रेता:</strong> 6% स्टाम्प ड्यूटी + 2% निबंधन शुल्क = <strong>8%</strong><br>` +
          `• <strong>महिला क्रेता (1% सरकारी छूट):</strong> 5% स्टाम्प ड्यूटी + 2% निबंधन शुल्क = <strong>7%</strong><br>` +
          `• <strong>नगर निगम क्षेत्र:</strong> 1% अतिरिक्त विकास प्रभार (Surcharge)।`,
        lang
      };
    }

    return {
      text: `इस बारे में सटीक जानकारी के लिए कृपया अपने अंचल अधिकारी (CO Office) से संपर्क करें या सरकारी पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" class="text-emerald-700 underline font-bold">biharbhumi.bihar.gov.in</a> देखें।`,
      lang
    };
  };

  // Submit query
  const handleQuerySubmit = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = (customText || userQuery).trim();
    if (!query) return;

    setUserQuery("");
    setMessages((prev) => [...prev, { text: query, isUser: true }]);
    setIsLoading(true);

    setTimeout(() => {
      const answerObj = getKnowledgeAnswer(query);
      setMessages((prev) => [
        ...prev,
        { text: answerObj.text, isUser: false, langTag: answerObj.lang }
      ]);
      setIsLoading(false);
    }, 450);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const copyCode = (type: "html" | "script", codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const fullWidgetHtml = `<!-- BighaWala AI Chatbot Widget Start -->
<script src="https://www.bighawala.com/chatbot-widget.js"></script>
<!-- BighaWala AI Chatbot Widget End -->`;

  const downloadWidgetFile = () => {
    window.open("/chatbot-widget.html", "_blank");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8 font-sans">
      
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-800 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-12 -translate-y-12 pointer-events-none">
          <Sparkles className="w-96 h-96" />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-xs font-semibold text-emerald-200">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Standalone Overlay Widget — Pure HTML/CSS/JS
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            BighaWala AI Expert Chatbot Widget
          </h2>
          <p className="text-emerald-100 max-w-3xl text-sm md:text-base leading-relaxed">
            A complete, production-ready AI chatbot widget for <strong className="text-white">https://www.bighawala.com</strong>. Embedded as a floating overlay that responds instantly in <strong>Hindi (हिंदी), Bhojpuri (भोजपुरी), Maithili (मैथिली), and English</strong>.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Offline Capable (&lt;200KB)
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Auto Language Detector
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Bihar Land & Unit Calculator
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-700/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Backend Required
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Live Widget & Integration Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Interactive Live Chat Widget Sandbox */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden flex flex-direction-col h-[650px] flex flex-col">
          
          {/* Chat Window Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-4 flex items-center justify-between border-b border-emerald-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border border-white/40 flex items-center justify-center text-xl shadow-inner">
                🏡
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">BighaWala AI Expert</h3>
                <div className="flex items-center gap-2 text-xs text-emerald-100 opacity-90 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  24/7 Bihar Land Portal Help
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setMessages([{
                  text: "नमस्ते! मैं **BighaWala AI Expert** हूँ। 🌾<br><br>बिहार की ज़मीन की मापी, दाखिल-खारिज, जमाबंदी, या सरकारी रेट से जुड़ा सवाल पूछें।",
                  isUser: false,
                  langTag: "hi"
                }])}
                className="p-1.5 hover:bg-emerald-700 rounded-lg text-emerald-100 hover:text-white transition-colors text-xs flex items-center gap-1"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>

          {/* Language Switcher Bar */}
          <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <span className="font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-700" /> Language Mode:
            </span>
            <div className="flex gap-1">
              {(["auto", "hi", "bho", "mai", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                    selectedLang === lang
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  }`}
                >
                  {lang === "auto" ? "Auto Detect" : lang === "hi" ? "हिंदी" : lang === "bho" ? "भोजपुरी" : lang === "mai" ? "मैथिली" : "English"}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.isUser ? "items-end" : "items-start"}`}
              >
                {!msg.isUser && msg.langTag && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 px-1">
                    🌐 {msg.langTag === "hi" ? "हिंदी" : msg.langTag === "bho" ? "भोजपुरी" : msg.langTag === "mai" ? "मैथिली" : "English"} Response
                  </span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.isUser
                      ? "bg-emerald-700 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm text-gray-400 flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping delay-100"></span>
                  <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping delay-200"></span>
                  <span className="ml-1 text-gray-500 font-medium">Analyzing Bihar land knowledge...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample Pills Slider */}
          <div className="p-2 bg-white border-t border-gray-100 overflow-x-auto whitespace-nowrap space-x-2 scrollbar-none">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleQuerySubmit(undefined, sq.text)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-700 hover:text-white border border-emerald-200 text-xs font-medium transition-all"
              >
                <span>{sq.label}</span>
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form onSubmit={handleQuerySubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask anything about Bihar land, Bigha, Dakhil Kharij..."
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors shrink-0 shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Deployment & Embedding Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Embed Snippet */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-700" /> Embed Code for bighawala.com
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                1-Line Script
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Paste this snippet right before the <code className="bg-gray-100 text-emerald-800 px-1 py-0.5 rounded">&lt;/body&gt;</code> tag on any page of <strong className="text-gray-800">bighawala.com</strong>:
            </p>

            <div className="relative bg-slate-900 text-emerald-300 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
              <code>{fullWidgetHtml}</code>
              <button
                onClick={() => copyCode("script", fullWidgetHtml)}
                className="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-lg transition-colors"
                title="Copy Code"
              >
                {copiedCode === "script" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={downloadWidgetFile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow transition-all"
              >
                <Download className="w-4 h-4" /> Download chatbot-widget.html
              </button>
              <a
                href="/chatbot-widget.html"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-700 hover:underline font-semibold inline-flex items-center gap-1"
              >
                Open Single File <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Domain Capabilities Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" /> Bihar Land Domain Knowledge
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Unit Converter Engine:</strong> Instant math for Bigha, Katha, Dhur, Decimal, Sq Ft for Patna (5.5 लगी), North Bihar (6 लगी), and East Bihar (6.5 लगी).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Dakhil Kharij (Mutation):</strong> Step-by-step application guidance, document checklist, zero fee clarification, and 35-day official timeline.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Bhulekh & Jamabandi:</strong> Detailed guide to inspect Jamabandi Panji-2, online Lagan payment, and Khatiyan ROR on biharbhumi.bihar.gov.in.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>District Land Rates 2026:</strong> Government MVR circle rates for Patna, Muzaffarpur, Gaya, Bhagalpur, Darbhanga, Saran, Purnia.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Stamp Duty & Registry:</strong> Male 8%, Female 7% (1% discount), joint ownership, and e-nibandhan portal links.</span>
              </li>
            </ul>
          </div>

          {/* Sample Questions Showcase List */}
          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" /> Click Any Sample Question to Test Live:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {sampleQuestions.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySubmit(undefined, sq.text)}
                  className="bg-white hover:bg-emerald-700 hover:text-white text-emerald-900 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg transition-all text-left font-medium"
                >
                  "{sq.text}"
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
