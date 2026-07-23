import React, { useState, useEffect, useRef } from "react";
import { 
  Download, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  Smartphone, 
  Share2, 
  RefreshCw, 
  Eye, 
  Sliders, 
  Code, 
  CheckCircle2,
  ExternalLink,
  Layers,
  FileCheck
} from "lucide-react";

export default function OgImageGenerator() {
  // Customization States
  const [headline, setHeadline] = useState("बिहार का #1 जमीन पोर्टल");
  const [subtitle, setSubtitle] = useState("Bigha Calculator | Dakhil Kharij | Bhulekh | Jamabandi");
  const [domainText, setDomainText] = useState("BighaWala.com");
  const [badgeText, setBadgeText] = useState("100% Free | 5,00,000+ Users");
  const [primaryColor, setPrimaryColor] = useState("#2E7D32");
  const [secondaryColor, setSecondaryColor] = useState("#FF6F00");
  const [accentColor, setAccentColor] = useState("#FFE082");
  const [showMapOverlay, setShowMapOverlay] = useState(true);
  const [iconStyle, setIconStyle] = useState<"parcel" | "tool" | "compass">("parcel");
  
  // UI States
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "canvas" | "social" | "meta">("preview");
  const [fileSizeKb, setFileSizeKb] = useState<number>(145);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string>("/og-image.jpg");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Canvas 1200 x 630
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set resolution exactly 1200x630
    canvas.width = 1200;
    canvas.height = 630;

    // 1. Background Gradient (Deep Green to Lighter Emerald Green)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 630);
    bgGradient.addColorStop(0, primaryColor); // Top deep green
    bgGradient.addColorStop(1, "#1B5E20");  // Bottom darker forest green
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle Radial Glow behind right side
    const radialGlow = ctx.createRadialGradient(900, 315, 50, 900, 315, 450);
    radialGlow.addColorStop(0, "rgba(255, 111, 0, 0.18)");
    radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, 1200, 630);

    // 2. Faint Outline / Map of Bihar State (Geometric Vector Silhouette)
    if (showMapOverlay) {
      ctx.save();
      ctx.translate(350, 80);
      ctx.scale(1.2, 1.2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 4;
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";

      ctx.beginPath();
      // Bihar stylized geographic boundary points
      ctx.moveTo(100, 50);
      ctx.lineTo(250, 40);
      ctx.lineTo(380, 70);
      ctx.lineTo(480, 110);
      ctx.lineTo(520, 200);
      ctx.lineTo(450, 280);
      ctx.lineTo(390, 310);
      ctx.lineTo(300, 340);
      ctx.lineTo(180, 330);
      ctx.lineTo(90, 290);
      ctx.lineTo(40, 210);
      ctx.lineTo(60, 120);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner district grid lines
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 40); ctx.lineTo(300, 340);
      ctx.moveTo(100, 50); ctx.lineTo(450, 280);
      ctx.moveTo(60, 120); ctx.lineTo(480, 110);
      ctx.stroke();
      ctx.restore();
    }

    // Decorative grid pattern overlay
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke();
    }
    for (let y = 0; y < 630; y += 60) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke();
    }
    ctx.restore();

    // 3. Left Side (60% = 0 to 720px): Main Typography
    // Top Bihar Government-style Badge
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.roundRect(80, 80, 280, 42, 21);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("🇮🇳 बिहार का सबसे विश्वसनीय", 100, 107);
    ctx.restore();

    // Large Bold Hindi Text: "बिहार का #1 जमीन पोर्टल"
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "black 58px 'Noto Sans Devanagari', 'Hind', system-ui, sans-serif";
    ctx.fillText(headline, 80, 210);
    ctx.restore();

    // Subtitle Text: "Bigha Calculator | Dakhil Kharij | Bhulekh | Jamabandi"
    ctx.save();
    ctx.fillStyle = accentColor;
    ctx.font = "bold 26px system-ui, sans-serif";
    ctx.fillText(subtitle, 80, 275);
    ctx.restore();

    // Feature highlights list with icons
    const features = [
      "✓ बीघा-कट्ठा-धूर सटीक मापी कैलकुलेटर",
      "✓ ऑनलाइन दाखिल-खारिज व जमाबंदी पंजी २",
      "✓ सरकारी अंचल दर (MVR) एवं रजिस्ट्री शुल्क"
    ];

    ctx.save();
    ctx.font = "bold 20px 'Noto Sans Devanagari', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    features.forEach((feat, i) => {
      ctx.fillText(feat, 85, 350 + i * 40);
    });
    ctx.restore();

    // 4. Right Side (40% = 720px to 1200px): Clean Land Measurement Tool / Parcel Illustration
    ctx.save();
    ctx.translate(920, 280);

    // Background circular glow
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 111, 0, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 111, 0, 0.4)";
    ctx.lineWidth = 3;
    ctx.stroke();

    if (iconStyle === "parcel") {
      // Stylized 3D Land Parcel Grid
      ctx.save();
      ctx.rotate(-0.15);

      // Land parcel 1
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(-110, -50);
      ctx.lineTo(40, -90);
      ctx.lineTo(110, -20);
      ctx.lineTo(-40, 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Land parcel 2 (Adjacent)
      ctx.fillStyle = "#E65100";
      ctx.beginPath();
      ctx.moveTo(-40, 20);
      ctx.lineTo(110, -20);
      ctx.lineTo(80, 70);
      ctx.lineTo(-70, 100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Measurement line & pins
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(-110, -50);
      ctx.lineTo(110, -20);
      ctx.stroke();

      // Compass / Pin marker
      ctx.setLineDash([]);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(0, -35, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(0, -35, 7, 0, Math.PI * 2);
      ctx.fill();

      // Text label inside plot
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 22px system-ui";
      ctx.fillText("1 बीघा", -20, 45);

      ctx.restore();
    } else {
      // Traditional Surveying Rod & Scale Tool
      ctx.fillStyle = secondaryColor;
      ctx.roundRect(-80, -80, 160, 160, 20);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("📐", 0, 20);

      ctx.font = "bold 20px sans-serif";
      ctx.fillText("Laggi Scale", 0, 60);
    }

    ctx.restore();

    // 5. Bottom Left Corner: "BighaWala.com" Logo + Green Checkmark
    ctx.save();
    // Green checkmark icon badge
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.arc(100, 560, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(90, 560);
    ctx.lineTo(97, 567);
    ctx.lineTo(110, 552);
    ctx.stroke();

    // Logo text
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "black 36px 'Poppins', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("BighaWala", 135, 572);

    ctx.fillStyle = accentColor;
    ctx.fillText(".com", 325, 572);
    ctx.restore();

    // 6. Bottom Right Corner: "100% Free | 5,00,000+ Users" Badge
    ctx.save();
    const badgeW = 380;
    const badgeH = 56;
    const badgeX = 1200 - 80 - badgeW;
    const badgeY = 532;

    // Saffron Orange background pill badge
    ctx.fillStyle = secondaryColor;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // White text inside badge
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "black 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + 36);
    ctx.restore();

    // Estimate Blob Size
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    const head = "data:image/jpeg;base64,";
    const sizeInBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
    setFileSizeKb(Math.round(sizeInBytes / 1024));
  };

  useEffect(() => {
    renderCanvas();
  }, [headline, subtitle, domainText, badgeText, primaryColor, secondaryColor, accentColor, showMapOverlay, iconStyle]);

  // Download Handler
  const downloadImage = (format: "png" | "jpeg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `bighawala-og-image-1200x630.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === "jpeg" ? 0.9 : 1.0);
    link.click();
  };

  // Copy Meta Tags Handler
  const copyMetaTags = () => {
    const metaCode = `<!-- Open Graph / Facebook / WhatsApp Preview Meta Tags -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://bighawala.com" />
<meta property="og:title" content="बिहार का #1 जमीन पोर्टल — BighaWala.com" />
<meta property="og:description" content="बीघा मापी कैलकुलेटर, दाखिल-खारिज, ऑनलाइन भूलेख, जमाबंदी और सरकारी सर्किल रेट 2026।" />
<meta property="og:image" content="https://bighawala.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="बिहार का #1 जमीन पोर्टल — BighaWala.com" />
<meta name="twitter:description" content="Bigha Calculator | Dakhil Kharij | Bhulekh | Jamabandi" />
<meta name="twitter:image" content="https://bighawala.com/og-image.jpg" />`;

    navigator.clipboard.writeText(metaCode);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2500);
  };

  return (
    <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl space-y-8 my-10">
      
      {/* Component Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-500/20 text-orange-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-orange-500/30">
              Official Social Asset
            </span>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1200 x 630 px (16:9)
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            BighaWala Open Graph (OG) Social Card Creator
          </h3>
          <p className="text-stone-400 text-sm mt-1">
            WhatsApp, Facebook, Twitter और LinkedIn पर शेयर करने पर दिखने वाली आधिकारिक 1200x630 सामाजिक छवि।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => downloadImage("png")}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG</span>
          </button>

          <button 
            onClick={copyMetaTags}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-sm"
          >
            {copiedMeta ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMeta ? "Copied HTML Meta!" : "Copy OG Meta Code"}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-2xl border border-stone-800 text-xs font-bold w-fit">
        <button 
          onClick={() => setActiveTab("preview")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${activeTab === "preview" ? "bg-stone-800 text-white shadow-xs" : "text-stone-400 hover:text-stone-200"}`}
        >
          <ImageIcon className="w-4 h-4 text-orange-400" />
          <span>Generated AI Asset</span>
        </button>

        <button 
          onClick={() => setActiveTab("canvas")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${activeTab === "canvas" ? "bg-stone-800 text-white shadow-xs" : "text-stone-400 hover:text-stone-200"}`}
        >
          <Sliders className="w-4 h-4 text-green-400" />
          <span>Live Canvas Customizer</span>
        </button>

        <button 
          onClick={() => setActiveTab("social")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${activeTab === "social" ? "bg-stone-800 text-white shadow-xs" : "text-stone-400 hover:text-stone-200"}`}
        >
          <Smartphone className="w-4 h-4 text-blue-400" />
          <span>WhatsApp / Social Simulator</span>
        </button>

        <button 
          onClick={() => setActiveTab("meta")}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${activeTab === "meta" ? "bg-stone-800 text-white shadow-xs" : "text-stone-400 hover:text-stone-200"}`}
        >
          <Code className="w-4 h-4 text-purple-400" />
          <span>SEO Meta Tags</span>
        </button>
      </div>

      {/* TAB 1: Generated AI Asset Preview */}
      {activeTab === "preview" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="relative rounded-2xl overflow-hidden border-2 border-stone-700 shadow-2xl bg-black group">
            <img 
              src="/og-image.jpg" 
              alt="BighaWala.com Open Graph Social Media Preview" 
              className="w-full h-auto object-cover max-h-[500px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono text-green-400 border border-green-500/30">
              1200 x 630 px • JPEG (~150KB)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <p className="text-orange-400 font-bold uppercase tracking-wider">रंग योजना (Color Scheme)</p>
              <p className="text-stone-300 font-semibold">गहरा हरा (#2E7D32) एवं केसरिया भगवा (#FF6F00) — आधिकारिक व विश्वसनीय रूप।</p>
            </div>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <p className="text-green-400 font-bold uppercase tracking-wider">नक्शा ओवरले (Map Background)</p>
              <p className="text-stone-300 font-semibold">पृष्ठभूमि में बिहार राज्य का सूक्ष्म हल्का मानचित्र रेखांकन।</p>
            </div>
            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
              <p className="text-blue-400 font-bold uppercase tracking-wider">थंबनेल पठनीयता (Thumbnail Ready)</p>
              <p className="text-stone-300 font-semibold">छोटे व्हाट्सएप थंबनेल पर भी हिंदी व अंग्रेजी टेक्स्ट स्पष्ट दिखता है।</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Canvas Customizer */}
      {activeTab === "canvas" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          
          {/* Canvas Render Area (8 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-green-600/50 shadow-2xl bg-stone-950 p-2">
              <canvas 
                ref={canvasRef} 
                className="w-full h-auto rounded-xl shadow-md border border-stone-800"
              />
              <div className="absolute bottom-4 left-4 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono text-stone-300 border border-stone-700">
                Live Resolution: 1200 × 630 px | File size: ~{fileSizeKb} KB (Under 300KB limit)
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>*HTML5 Vector Engine pixel-perfect rendering</span>
              <button 
                onClick={renderCanvas}
                className="flex items-center gap-1 hover:text-green-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-render Canvas
              </button>
            </div>
          </div>

          {/* Controls Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
            <h4 className="text-lg font-bold text-white border-b border-stone-800 pb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-400" />
              <span>कस्टम टेक्स्ट और स्टाइल (Customize Text & Colors)</span>
            </h4>

            {/* Headline Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">मुख्य शीर्षक (Headline Text - Hindi):</label>
              <input 
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-sm font-extrabold text-white focus:border-green-500 outline-none"
              />
            </div>

            {/* Subtitle Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">उपशीर्षक (Sub-features Text):</label>
              <input 
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs font-bold text-amber-300 focus:border-green-500 outline-none"
              />
            </div>

            {/* Badge Text Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">बैज टेक्स्ट (Badge Text):</label>
              <input 
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2.5 text-xs font-bold text-orange-400 focus:border-green-500 outline-none"
              />
            </div>

            {/* Toggles & Options */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">बिहार नक्शा (Bihar Map):</label>
                <button 
                  onClick={() => setShowMapOverlay(!showMapOverlay)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all ${showMapOverlay ? "bg-green-950 text-green-300 border-green-700" : "bg-stone-900 text-stone-500 border-stone-800"}`}
                >
                  {showMapOverlay ? "✓ Map Outline ON" : "Map Outline OFF"}
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">दाएं आइकन स्टाइल:</label>
                <select 
                  value={iconStyle}
                  onChange={(e) => setIconStyle(e.target.value as any)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-2 text-xs font-bold text-white outline-none"
                >
                  <option value="parcel">Land Parcel Grid (3D)</option>
                  <option value="tool">Surveying Scale Tool</option>
                </select>
              </div>
            </div>

            {/* Color Controls */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <p className="text-xs font-bold text-stone-400">कलर पैलेट (Color Scheme):</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0" />
                  <span className="text-stone-300 font-mono">Deep Green</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0" />
                  <span className="text-stone-300 font-mono">Saffron</span>
                </div>
              </div>
            </div>

            {/* Download Button in Canvas panel */}
            <div className="pt-3">
              <button 
                onClick={() => downloadImage("png")}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-extrabold py-3 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Customized PNG (1200x630)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: WhatsApp & Social Media Preview Simulator */}
      {activeTab === "social" && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* WhatsApp Card Simulator */}
            <div className="bg-[#0b141a] p-5 rounded-2xl border border-green-900/50 space-y-3">
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold border-b border-green-900/50 pb-2">
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp Message Share Preview</span>
              </div>

              {/* Chat Bubble */}
              <div className="max-w-sm bg-[#202c33] rounded-2xl rounded-tl-xs p-2 shadow-lg space-y-2 border border-stone-800">
                
                {/* OG Image Thumbnail inside WhatsApp */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-[16/9] border border-stone-700">
                  <img 
                    src="/og-image.jpg" 
                    alt="WhatsApp Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* WhatsApp Link Meta Box */}
                <div className="px-2 pb-1 space-y-0.5">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">BIGHAWALA.COM</p>
                  <p className="text-sm font-extrabold text-white leading-snug">
                    बिहार का #1 जमीन पोर्टल — BighaWala
                  </p>
                  <p className="text-xs text-stone-300 line-clamp-2">
                    बीघा मापी कैलकुलेटर, दाखिल-खारिज, ऑनलाइन भूलेख, जमाबंदी और सरकारी सर्किल रेट 2026।
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-stone-400 italic">
                ✓ High contrast text ensures legibility even when scaled down to a small WhatsApp chat thumbnail (120px width).
              </p>
            </div>

            {/* Facebook / LinkedIn Feed Card Simulator */}
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold border-b border-stone-800 pb-2">
                <Share2 className="w-4 h-4" />
                <span>Facebook / LinkedIn Feed Card Preview</span>
              </div>

              <div className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-md">
                <div className="aspect-[16/9] bg-black overflow-hidden">
                  <img 
                    src="/og-image.jpg" 
                    alt="Facebook Card Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3.5 space-y-1 bg-stone-900">
                  <span className="text-[10px] text-stone-400 uppercase font-mono tracking-wider">BIGHAWALA.COM</span>
                  <p className="text-base font-black text-white">
                    बिहार का #1 जमीन पोर्टल — Bigha Calculator & Land Records
                  </p>
                  <p className="text-xs text-stone-400">
                    Bigha Calculator | Dakhil Kharij | Bhulekh | Jamabandi | 100% Free
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 4: SEO Meta Tags Code */}
      {activeTab === "meta" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white">
              Head Meta Tags HTML Implementation (Include in index.html):
            </h4>
            <button 
              onClick={copyMetaTags}
              className="flex items-center gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              {copiedMeta ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMeta ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>

          <pre className="bg-stone-950 p-5 rounded-2xl text-xs font-mono text-purple-300 border border-stone-800 overflow-x-auto leading-relaxed">
{`<!-- Open Graph / Facebook / WhatsApp Preview Meta Tags -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://bighawala.com" />
<meta property="og:title" content="बिहार का #1 जमीन पोर्टल — BighaWala.com" />
<meta property="og:description" content="बीघा मापी कैलकुलेटर, दाखिल-खारिज, ऑनलाइन भूलेख, जमाबंदी और सरकारी सर्किल रेट 2026।" />
<meta property="og:image" content="https://bighawala.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="बिहार का #1 जमीन पोर्टल — BighaWala.com" />
<meta name="twitter:description" content="Bigha Calculator | Dakhil Kharij | Bhulekh | Jamabandi" />
<meta name="twitter:image" content="https://bighawala.com/og-image.jpg" />`}
          </pre>
        </div>
      )}

    </div>
  );
}
