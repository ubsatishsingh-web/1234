/**
 * BighaWala AI Expert — Standalone Embedded Chatbot Widget
 * Website: https://www.bighawala.com
 * Domain: Bihar Land Information, Bigha Calculator, Dakhil Kharij, Bhulekh, Land Rates 2026
 * Supports: Hindi (हिंदी), Bhojpuri (भोजपुरी), Maithili (मैथिली), English
 */

(function () {
  // Prevent duplicate initialization
  if (window.BighaWalaChatbotInitialized) return;
  window.BighaWalaChatbotInitialized = true;

  // --- KNOWLEDGE BASE & ENGINE ---
  const BighaWalaEngine = {
    // Current active language preference ('auto', 'hi', 'bho', 'mai', 'en')
    currentLang: 'auto',

    // Detect language of query
    detectLanguage: function (text) {
      if (this.currentLang !== 'auto') return this.currentLang;

      const lower = text.toLowerCase();

      // Bhojpuri keywords
      const bhojpuriKeywords = ['भोजपुरी', 'बताईं', 'कइसे', 'खातिर', 'रोउआ', 'रउरा', 'कइल जाला', 'होखेला', 'बाटे', 'हटे', 'हवे', 'बनिही', 'होला', 'कतना', 'कत्था', 'बाते', 'रउआ'];
      // Maithili keywords
      const maithiliKeywords = ['मैथिली', 'कति', 'अछि', 'हमरा', 'आहाँ', 'अहां', 'कतेक', 'अछी', 'भेल', 'कराइब', 'भै गेल', 'छै', 'छैक', 'कट्ठा अछि'];
      // English keywords / scripts
      const englishRegex = /^[a-zA-Z0-9\s\?\.\,\!\-\_\/\:\₹\$]+$/;

      for (let word of bhojpuriKeywords) {
        if (text.includes(word)) return 'bho';
      }
      for (let word of maithiliKeywords) {
        if (text.includes(word)) return 'mai';
      }
      if (englishRegex.test(text.trim()) && /[a-zA-Z]/.test(text)) {
        return 'en';
      }
      return 'hi';
    },

    // Dynamic Unit Calculator Regex Processor
    processCalculator: function (query, lang) {
      const q = query.toLowerCase().replace(/,/g, '');

      // Patterns for units
      // 1. Bigha to Katha / Dhur / Sq Ft / Decimal
      const bighaMatch = q.match(/(\d+(?:\.\d+)?)\s*(bigha|बीघा|बीहा)/i);
      if (bighaMatch) {
        const val = parseFloat(bighaMatch[1]);
        const katha = val * 20;
        const dhur = val * 400;
        const decimal = val * 20; // Standard Bihar Decimal conversion (1 Bigha = 20 Decimal = 27220 sq ft)
        const sqftStandard = Math.round(val * 27220); // Standard 27,220 sq ft
        const sqftPatna = Math.round(val * 27225); // 5.5 हाथ लगी = 1361.25 * 20 = 27,225 sq ft
        const sqftNorth = Math.round(val * 32400); // 6 हाथ लगी = 1620 * 20 = 32,400 sq ft

        if (lang === 'bho') {
          return `<strong>📐 ${val} बीघा के मापी (बिहार मान के हिसाब से):</strong><br><br>` +
            `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
            `• <strong>स्क्वायर फिट (पटना/दक्षिण बिहार - 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>स्क्वायर फिट (उत्तर बिहार - 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br><br>` +
            `<em>सलाह: बिहार में अलग-अलग ज़िला में लगी के नाप (5.5 हाथ से 6.5 हाथ) अलग होला।</em>`;
        } else if (lang === 'mai') {
          return `<strong>📐 ${val} बीघा के मापी (बिहार मानक):</strong><br><br>` +
            `• <strong>कट्ठा:</strong> ${katha} कट्ठा होइछ<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
            `• <strong>वर्ग फिट (5.5 हाथ लगि):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>वर्ग फिट (6 हाथ लगि - दरभंगा/मधुबनी/समस्तीपुर):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br><br>` +
            `<em>सूचना: मिथिलांचल मे 6 हाथ या 6.5 हाथक लगि सं मापी कैल जाइछ।</em>`;
        } else if (lang === 'en') {
          return `<strong>📐 Land Measurement for ${val} Bigha (Bihar Standard):</strong><br><br>` +
            `• <strong>Katha:</strong> ${katha} Katha<br>` +
            `• <strong>Dhur:</strong> ${dhur} Dhur<br>` +
            `• <strong>Decimal:</strong> ${decimal} Decimal<br>` +
            `• <strong>Area in Sq Ft (South Bihar / Patna - 5.5 Laggi):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>Area in Sq Ft (North Bihar / Darbhanga - 6 Laggi):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>Acre Equivalent:</strong> ${(val / 1.6).toFixed(2)} Acres<br><br>` +
            `<em>Note: 1 Bigha officially equals 20 Katha across all 38 Bihar districts.</em>`;
        } else {
          // Default Hindi
          return `<strong>📐 ${val} बीघा की मापी (बिहार मानक अनुसार):</strong><br><br>` +
            `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>डेसिमल (डिसमिल):</strong> ${decimal} डिसमिल<br>` +
            `• <strong>स्क्वायर फीट (दक्षिण बिहार / पटना - 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft (${(sqftPatna/9).toFixed(1)} वर्ग गज)<br>` +
            `• <strong>स्क्वायर फीट (उत्तर बिहार - 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>एकड़:</strong> ${(val / 1.6).toFixed(2)} एकड़<br><br>` +
            `💡 <strong>सुझाव:</strong> बिहार में 1 बीघा = 20 कट्ठा तय है, लेकिन लगी (5.5 हाथ या 6 हाथ) के अनुसार स्क्वायर फीट बदलता है।`;
        }
      }

      // 2. Katha to Bigha / Dhur / Sq Ft
      const kathaMatch = q.match(/(\d+(?:\.\d+)?)\s*(katha|kattha|कट्ठा|कत्था|कठ्ठा)/i);
      if (kathaMatch) {
        const val = parseFloat(kathaMatch[1]);
        const bigha = (val / 20).toFixed(2);
        const dhur = val * 20;
        const decimal = (val * 1.0).toFixed(2); // 1 Katha = 1 Decimal standard approx
        const sqftPatna = Math.round(val * 1361.25);
        const sqftNorth = Math.round(val * 1620);

        if (lang === 'bho') {
          return `<strong>📐 ${val} कट्ठा के मापी:</strong><br><br>` +
            `• <strong>बीघा:</strong> ${bigha} बीघा<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>स्क्वायर फिट (5.5 हाथ लगी - पटना/शाहाबाद):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>स्क्वायर फिट (6 हाथ लगी - छपरा/सिवान/मुजफ्फरपुर):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`;
        } else if (lang === 'mai') {
          return `<strong>📐 ${val} कट्ठा के क्षेत्रफल:</strong><br><br>` +
            `• <strong>बीघा:</strong> ${bigha} बीघा<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>वर्ग फिट (6 हाथ लगि):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>वर्ग फिट (5.5 हाथ लगि):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft`;
        } else if (lang === 'en') {
          return `<strong>📐 ${val} Katha Conversion in Bihar:</strong><br><br>` +
            `• <strong>Bigha:</strong> ${bigha} Bigha<br>` +
            `• <strong>Dhur:</strong> ${dhur} Dhur<br>` +
            `• <strong>Area (Patna / 5.5 Laggi):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>Area (North Bihar / 6 Laggi):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`;
        } else {
          return `<strong>📐 ${val} कट्ठा (Katha) की मापी:</strong><br><br>` +
            `• <strong>बीघा:</strong> ${bigha} बीघा<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
            `• <strong>क्षेत्रफल (पटना / 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>क्षेत्रफल (उत्तर बिहार / 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`;
        }
      }

      // 3. Decimal to Sq Ft / Katha
      const decimalMatch = q.match(/(\d+(?:\.\d+)?)\s*(decimal|dismil|डिसमिल|डेसिमल|डिसीमल)/i);
      if (decimalMatch) {
        const val = parseFloat(decimalMatch[1]);
        const sqft = Math.round(val * 435.6);
        const kathaPatna = (sqft / 1361.25).toFixed(2);
        const kathaNorth = (sqft / 1620).toFixed(2);

        return `<strong>📐 ${val} डिसमिल (Decimal) की मापी:</strong><br><br>` +
          `• <strong>कुल वर्ग फीट:</strong> ${sqft.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>कट्ठा (5.5 हाथ लगी):</strong> ${kathaPatna} कट्ठा<br>` +
          `• <strong>कट्ठा (6 हाथ लगी):</strong> ${kathaNorth} कट्ठा<br>` +
          `• <strong>एकड़:</strong> ${(val / 100).toFixed(2)} एकड़`;
      }

      // 4. Acre to Bigha / Sq Ft
      const acreMatch = q.match(/(\d+(?:\.\d+)?)\s*(acre|एकर|एकड़)/i);
      if (acreMatch) {
        const val = parseFloat(acreMatch[1]);
        const bigha = (val * 1.6).toFixed(2);
        const katha = Math.round(val * 32);
        const sqft = Math.round(val * 43560);

        return `<strong>📐 ${val} एकड़ (Acre) जमीन की मापी:</strong><br><br>` +
          `• <strong>बीघा:</strong> ${bigha} बीघा<br>` +
          `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
          `• <strong>कुल वर्ग फीट:</strong> ${sqft.toLocaleString('en-IN')} sq ft<br>` +
          `• <strong>हेक्टेयर:</strong> ${(val / 2.471).toFixed(2)} Hectares`;
      }

      // 5. Sq Ft to Katha / Decimal
      const sqftMatch = q.match(/(\d+(?:\.\d+)?)\s*(sq\s*ft|square\s*feet|स्क्वायर\s*फिट|वर्ग\s*फिट)/i);
      if (sqftMatch) {
        const val = parseFloat(sqftMatch[1]);
        const kathaPatna = (val / 1361.25).toFixed(2);
        const kathaNorth = (val / 1620).toFixed(2);
        const decimal = (val / 435.6).toFixed(2);

        return `<strong>📐 ${val.toLocaleString('en-IN')} Sq Ft जमीन की मापी:</strong><br><br>` +
          `• <strong>कट्ठा (5.5 हाथ लगी - पटना):</strong> ${kathaPatna} कट्ठा<br>` +
          `• <strong>कट्ठा (6 हाथ लगी - उत्तर बिहार):</strong> ${kathaNorth} cuttha<br>` +
          `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
          `• <strong>वर्ग गज (Gaj):</strong> ${(val / 9).toFixed(1)} sq yards`;
      }

      return null;
    },

    // Knowledge Base Lookup Engine
    getKnowledgeResponse: function (query) {
      const lang = this.detectLanguage(query);
      const q = query.toLowerCase();

      // Check calculator first
      const calcResult = this.processCalculator(query, lang);
      if (calcResult) {
        return { text: calcResult, lang: lang };
      }

      // Domain check — redirect if query is completely outside Bihar land domain
      const isOutDomain = /cricket|bollywood|movie|weather|modi|rahul|recipe|pizza|song|gaana|mobile|iphone|game|pubg/i.test(q);
      if (isOutDomain) {
        if (lang === 'bho') {
          return {
            text: `माफ़ करीं, हम सिर्फ़ बिहार के ज़मीन, बीघा मापी, दाखिल-खारिज, जमाबंदी आ सरकारी रेट से जुड़ल सवाल के जवाब दे सकिलां। 🌾<br><br>कृपया ज़मीन से जुड़ल सवाल पूछीं।`,
            lang: 'bho'
          };
        } else if (lang === 'mai') {
          return {
            text: `क्षम्य करू, हम केवल बिहारक जमीन, बीघा मापी, दाखिल खारिज आ जमाबंदी सं संबंधित प्रश्नक उत्तर दऽ सकै छी। 🌾<br><br>कृपया जमीन सं जुड़ल प्रश्न पुछू।`,
            lang: 'mai'
          };
        } else if (lang === 'en') {
          return {
            text: `I apologize, but I am specialized exclusively in Bihar Land & Property queries (Bigha calculations, Dakhil Kharij mutation, Jamabandi, Land Rates, Registry).<br><br>Please ask a query related to land or property! 🌾`,
            lang: 'en'
          };
        } else {
          return {
            text: `माफ़ कीजिए, मैं सिर्फ़ बिहार की ज़मीन, बीघा मापी, दाखिल-खारिज, जमाबंदी, सरकारी रेट (MVR) और रजिस्ट्री से जुड़े सवालों में मदद कर सकता हूँ। 🌾<br><br>कृपया ज़मीन से संबंधित सवाल पूछें।`,
            lang: 'hi'
          };
        }
      }

      // Match Categories
      // Category 1: Dakhil Kharij / Mutation
      if (/dakhil|kharij|mutation|दाखिल|खारिज|नामान्तरण|दाखिला|mutation fee/i.test(q)) {
        if (lang === 'bho') {
          return {
            text: `<strong>📝 बिहार में दाखिल-खारिज (Mutation) कइसे करल जाला:</strong><br><br>` +
              `1. <strong>ऑनलाइन पोर्टल:</strong> बिहार भूमि पोर्टल (<a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a>) पर जाईं।<br>` +
              `2. <strong>रजिस्ट्रेशन:</strong> अपना मोबाइल नंबर से लॉगिन/साइन-अप करीं।<br>` +
              `3. <strong>आवेदन:</strong> 'ऑनलाइन दाखिल खारिज आवेदन करें' पर क्लिक करीं।<br>` +
              `4. <strong>डॉक्यूमेंट अपलोड:</strong> केवाला (Deed PDF), शपथ पत्र आ आधार कार्ड अपलोड करीं।<br>` +
              `5. <strong>केस नंबर:</strong> सबमिट कइला पर वादों संख्या (Case No.) मिली।<br>` +
              `6. <strong>समय सीमा:</strong> 35 से 90 दिन के भीतर हलका कर्मचारी आ अंचलाधिकारी (CO) द्वारा शुद्धि पत्र जारी कइ दिहल जाला।<br><br>` +
              `💰 <strong>फीस:</strong> सरकारी पोर्टल पर आवेदन एकदम <strong>मुफ्त (₹0)</strong> बा।`,
            lang: 'bho'
          };
        } else if (lang === 'mai') {
          return {
            text: `<strong>📝 बिहार मे दाखिल खारिज (Mutation) के चरणबद्ध प्रक्रिया:</strong><br><br>` +
              `1. सरकारी वेब पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर जाऊ।<br>` +
              `2. 'ऑनलाइन दाखिल खारिज' विकल्प चुनू आ अपन रजिस्ट्रेशन करू।<br>` +
              `3. अपन केवाला (रजिस्ट्री डीड), शपथ पत्र आ आधार संख्या अपलोड करू।<br>` +
              `4. ऑनलाइन रसीद आ केस नंबर डाउनलोड कऽ कऽ राखू।<br>` +
              `5. हल्का कर्मचारी जांच कऽ कऽ CO ऑफिस सं शुद्धि पत्र निर्गत करताह।<br><br>` +
              `📑 <strong>आवश्यक कागजात:</strong> केवाला प्रति, आधार, स्व-घोषणा पत्र, चौहद्दी विवरण।`,
            lang: 'mai'
          };
        } else if (lang === 'en') {
          return {
            text: `<strong>📝 Dakhil Kharij (Land Mutation) Process in Bihar (2026):</strong><br><br>` +
              `1. <strong>Official Portal:</strong> Visit <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a>.<br>` +
              `2. <strong>Account Creation:</strong> Register with mobile number and Aadhaar.<br>` +
              `3. <strong>Fill Application:</strong> Click on "Apply Online Dakhil Kharij". Fill District, Circle, Buyer/Seller details and Plot Khasra/Khata.<br>` +
              `4. <strong>Upload PDF:</strong> Combined PDF of Registered Sale Deed (Kewala) and Affidavit.<br>` +
              `5. <strong>Tracking:</strong> Case Number is generated immediately.<br>` +
              `6. <strong>Timeline:</strong> 35 working days (Uncontested) or 90 days (if objections filed).<br><br>` +
              `💰 <strong>Government Fee:</strong> ₹0 (Free online application). Beware of middlemen asking for bribes.`,
            lang: 'en'
          };
        } else {
          return {
            text: `<strong>📝 बिहार में दाखिल-खारिज (Land Mutation) की पूरी प्रक्रिया:</strong><br><br>` +
              `1. <strong>पोर्टल पर जाएँ:</strong> बिहार सरकार के आधिकारिक पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर जाएँ।<br>` +
              `2. <strong>लॉगिन करें:</strong> अपने मोबाइल नंबर से सिटिजन लॉगिन (Citizen Login) करें।<br>` +
              `3. <strong>ऑनलाइन आवेदन:</strong> 'ऑनलाइन दाखिल ख़ारिज आवेदन करें' का चयन करें।<br>` +
              `4. <strong>विवरण भरें:</strong> अंचल, हल्का, मौजा, खरीदार/विक्रेता का नाम और जमीन की चौहद्दी दर्ज करें।<br>` +
              `5. <strong>दस्तावेज़ अपलोड करें:</strong> रजिस्ट्री केवाला (Sale Deed PDF) और शपथ पत्र अपलोड करें।<br>` +
              `6. <strong>केस संख्या प्राप्त करें:</strong> आवेदन सबमिट करने पर आपको तत्काल Case Number मिलेगा।<br>` +
              `7. <strong>स्वीकृति व शुद्धि पत्र:</strong> हलका कर्मचारी की रिपोर्ट के बाद CO (अंचलाधिकारी) द्वारा 35 दिनों के भीतर शुद्धि पत्र (Correction Slip) जारी कर दिया जाता है।<br><br>` +
              `💰 <strong>सरकारी शुल्क:</strong> पोर्टल पर आवेदन पूर्णतः <strong>निःशुल्क (₹0)</strong> है।`,
            lang: 'hi'
          };
        }
      }

      // Category 2: Bhulekh / Jamabandi / Khata / Khasra / Khatiyan
      if (/bhulekh|jamabandi|khata|khasra|khatian|भूलेख|जमाबंदी|खाता|खेसरा|खतियान|रसीद|ऑनलाइन रसीद|apna khata/i.test(q)) {
        if (lang === 'en') {
          return {
            text: `<strong>🔍 How to Check Jamabandi & Bhulekh Bihar Online:</strong><br><br>` +
              `1. Open <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a>.<br>` +
              `2. Click on <strong>'जमाबंदी पंजी देखें' (View Jamabandi Panji)</strong>.<br>` +
              `3. Select your <strong>District (ज़िला)</strong> and <strong>Circle (अंचल)</strong>.<br>` +
              `4. Select your <strong>Halka & Mauza</strong>.<br>` +
              `5. Search by <strong>Khata No (खाता संख्या)</strong>, <strong>Plot/Khasra No (खेसरा संख्या)</strong>, or <strong>Raiyat Name (रैयत का नाम)</strong>.<br>` +
              `6. Click 'Search' to view digital Jamabandi details, land area, tax payment history, and download official copy.<br><br>` +
              `💡 <strong>Tip:</strong> You can also pay online land rent (Lagan / लगान) directly through the portal!`,
            lang: 'en'
          };
        } else if (lang === 'bho') {
          return {
            text: `<strong>🔍 बिहार भूलेख आ जमाबंदी पंजी देखे के आसान तरीका:</strong><br><br>` +
              `1. <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a> वेबसाइट पर जाईं।<br>` +
              `2. <strong>'जमाबंदी पंजी देखें'</strong> ऑप्शन चुनीं।<br>` +
              `3. अपना ज़िला, अंचल आ मौजा सेलेक्ट करीं।<br>` +
              `4. खाता नंबर, खेसरा नंबर चाहे रैयत के नाम से खोज करीं।<br>` +
              `5. सामने स्क्रीन पर जमीन के पूरा रकबा, खाता आ जमाबंदी डिटेल्स दिख जाई।`,
            lang: 'bho'
          };
        } else if (lang === 'mai') {
          return {
            text: `<strong>🔍 बिहार भूलेख आ जमाबंदी (खतियान) देखबाक विधि:</strong><br><br>` +
              `1. बिहार भू-अभिलेख पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a> खोलो।<br>` +
              `2. <strong>'अपना खाता देखें' / 'जमाबंदी पंजी देखें'</strong> पर क्लिक करू।<br>` +
              `3. अपन जिला, अंचल आ मौजा चुनू।<br>` +
              `4. खाता सं० या खेसरा सं० दर्ज कऽ कऽ देखू। digital कॉपी डाउनलोड कऽ सकै छी।`,
            lang: 'mai'
          };
        } else {
          return {
            text: `<strong>🔍 बिहार भूलेख एवं जमाबंदी (Jamabandi Panji-2) देखने का तरीका:</strong><br><br>` +
              `1. बिहार भूमि के आधिकारिक पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर जाएँ।<br>` +
              `2. मुख्य पृष्ठ पर <strong>'जमाबंदी पंजी देखें'</strong> विकल्प पर क्लिक करें।<br>` +
              `3. अपना <strong>ज़िला</strong>, <strong>अंचल</strong>, <strong>हल्का</strong> और <strong>मौजा</strong> चुनें।<br>` +
              `4. आप <strong>खाता नंबर</strong>, <strong>खेसरा (प्लॉट) नंबर</strong>, या <strong>रैयत के नाम</strong> से खोज सकते हैं।<br>` +
              `5. कैप्चा भरें और 'सर्च' करें। आपके सामने जमीन के कुल रकबे और लगान रसीद की डिजिटल कॉपी आ जाएगी।<br><br>` +
              `📄 <strong>ऑनलाइन लगान भुगतान:</strong> आप इसी पोर्टल से अपनी जमीन का पुराना बकाया लगान ऑनलाइन जमा करके रसीद डाउनलोड कर सकते हैं।`,
            lang: 'hi'
          };
        }
      }

      // Category 3: Land Rates / MVR / Circle Rates / Patna / District Rates
      if (/rate|price|mvr|circle rate|patna|muzaffarpur|gaya|bhagalpur|दर|सरकारी रेट|सर्किल रेट|कीमत|मूल्य/i.test(q)) {
        return {
          text: `<strong>💰 बिहार ज़मीन सरकारी सर्किल रेट (MVR Rates 2024–2026):</strong><br><br>` +
            `• <strong>पटना (Patna):</strong><br>` +
            `  - कमर्शियल मुख्य मार्ग (Boreing Road, Bailey Road): ₹80 लाख से ₹2.5 करोड़ / कट्ठा<br>` +
            `  - आवासीय (Kankarbagh, Danapur, Saguna More): ₹25 लाख से ₹75 लाख / कट्ठा<br>` +
            `• <strong>मुजफ्फरपुर (Muzaffarpur):</strong> ₹12 लाख से ₹35 लाख / कट्ठा<br>` +
            `• <strong>गया (Gaya):</strong> ₹10 लाख से ₹28 लाख / कट्ठा<br>` +
            `• <strong>भागलपुर (Bhagalpur):</strong> ₹10 लाख से ₹32 लाख / कट्ठा<br>` +
            `• <strong>दरभंगा (Darbhanga):</strong> ₹8 लाख से ₹25 लाख / कट्ठा<br>` +
            `• <strong>अन्य ग्रामीण/कृषि ज़मीन:</strong> ₹2 लाख से ₹8 लाख / बीघा<br><br>` +
            `🔗 <strong>सटीक MVR रेट ऑनलाइन जांचें:</strong> <a href="https://bhumijankari.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">bhumijankari.bihar.gov.in</a> (Minimum Valuation Rate पर क्लिक करें)।`,
          lang: lang
        };
      }

      // Category 4: Stamp Duty & Registration Fees
      if (/stamp|duty|registry|fee|charge|निबंधन|रजिस्ट्री|स्टाम्प|शुल्क|केवाला खर्च|महिला छूट/i.test(q)) {
        return {
          text: `<strong>📜 बिहार में जमीन रजिस्ट्री (Stamp Duty & Fees 2026):</strong><br><br>` +
            `• <strong>पुरुष क्रेता (Male Buyer):</strong><br>` +
            `  - स्टाम्प ड्यूटी: <strong>6%</strong><br>` +
            `  - पंजीकरण शुल्क (Registration Fee): <strong>2%</strong><br>` +
            `  - कुल खर्च: <strong>8%</strong> (MVR सरकारी मूल्य का)<br><br>` +
            `• <strong>महिला क्रेता (Female Buyer - 1% छूट):</strong><br>` +
            `  - स्टाम्प ड्यूटी: <strong>5%</strong><br>` +
            `  - पंजीकरण शुल्क: <strong>2%</strong><br>` +
            `  - कुल खर्च: <strong>7%</strong><br><br>` +
            `• <strong>संयुक्त (Male + Female):</strong> <strong>7.5%</strong><br>` +
            `• <strong>नगर निगम क्षेत्र:</strong> 1% अतिरिक्त विकास प्रभार (Surcharge)।<br><br>` +
            `💡 <strong>उदाहरण:</strong> अगर ₹10 लाख की रजिस्ट्री है, तो पुरुष के लिए ₹80,000 और महिला के लिए ₹70,000 सरकारी शुल्क लगेगा।`,
          lang: lang
        };
      }

      // Category 5: Measurement / Laggi / Ameen / Boundary Dispute
      if (/measurement|laggi|ameen|boundary|dispute|नापी|लगी|अमीन|सीमा विवाद|अमीन नापी|पैमाइश/i.test(q)) {
        return {
          text: `<strong>📐 बिहार में अमीन द्वारा जमीन नापी एवं लगी नियम:</strong><br><br>` +
            `1. <strong>लगी का आकार (Laggi Size):</strong><br>` +
            `   - दक्षिण बिहार / पटना: <strong>5.5 हाथ लगी</strong> (1 कट्ठा = 1361.25 sq ft)<br>` +
            `   - उत्तर बिहार / मिथिलांचल: <strong>6 हाथ लगी</strong> (1 कट्ठा = 1620 sq ft)<br>` +
            `   - पूर्वी बिहार (पूर्णिया/कटिहार): <strong>6.5 हाथ लगी</strong> (1 कट्ठा = 1901 sq ft)<br><br>` +
            `2. <strong>सरकारी अमीन के लिए आवेदन:</strong><br>` +
            `   - अपने अंचल अधिकारी (CO) या DCLR ऑफिस में सरकारी फीस जमा करके ई-नापी (E-Napi) का ऑनलाइन/ऑफलाइन आवेदन करें।<br>` +
            `   - CO द्वारा अमीन को जरीब (Chain) लेकर सीमांकन के लिए भेजा जाता है।<br><br>` +
            `3. <strong>सीमा विवाद समाधान:</strong> बिहार भूमि विवाद समाधान अधिनियम (BLDR Act 2009) के तहत DCLR कोर्ट में शिकायत दर्ज करें।`,
          lang: lang
        };
      }

      // Category 6: Scams & Fraud Prevention
      if (/scam|fraud|precaution|scams|धोखाधड़ी|फर्जी|सावधानी|2 बार/i.test(q)) {
        return {
          text: `<strong>🛡️ बिहार में जमीन खरीदते समय 5 जरूरी सावधानियां (Scam Avoidance):</strong><br><br>` +
            `1. <strong>ऑनलाइन जमाबंदी जांचें:</strong> विक्रेता के नाम पर biharbhumi portal पर हालिया जमाबंदी और एलपीसी (LPC) सक्रिय है या नहीं, अवश्य देखें।<br>` +
            `2. <strong>गैर-मजरुआ / सीलिंग जमीन:</strong> सुनिश्चित करें कि जमीन गैर-मजरुआ आम/खास, या भू-हदबंदी (Ceiling) की नहीं है।<br>` +
            `3. <strong>वंशावली (Vansh Vriksh):</strong> पैतृक संपत्ति होने पर सभी कानूनी वारिसों के हस्ताक्षर और एनओसी (NOC) लें।<br>` +
            `4. <strong>ई-निबंधन सत्यापन:</strong> केवाला का डिजिटल टोकन सत्यापन bhumijankari.bihar.gov.in पर करें।<br>` +
            `5. <strong>भुगतान:</strong> हमेशा बैंक चेक या एनईएफटी (NEFT/RTGS) से भुगतान करें, नकद (Cash) न दें।`,
          lang: lang
        };
      }

      // Category 7: NOC / LPC / Land Ceiling / Conversion
      if (/noc|lpc|ceiling|conversion|एलपीसी|एनओसी|धर्म परिवर्तन|कृषि से गैर/i.test(q)) {
        return {
          text: `<strong>📑 LPC (Land Possession Certificate) एवं एनओसी नियम:</strong><br><br>` +
            `• <strong>LPC (भूमि स्वामित्व प्रमाण पत्र):</strong> जमीन का बैंक लोन, सरकारी योजना या बिक्री के लिए LPC अनिवार्य है। यह biharbhumi.bihar.gov.in से 15 दिनों में ऑनलाइन बनता है।<br>` +
            `• <strong>एनओसी (NOC):</strong> पैतृक भूमि बेचने के लिए सभी सह-अंशधारकों का अनापत्ति प्रमाण पत्र (NOC) आवश्यक है।<br>` +
            `• <strong>कृषि से व्यावसायिक रूप (Section 143):</strong> कृषि भूमि पर मकान या दुकान बनाने के लिए CO कार्यालय से भू-उपयोग परिवर्तन (Land Use Conversion) की अनुमति लें।`,
          lang: lang
        };
      }

      // Category 8: Generic Greetings
      if (/hi|hello|namaste|pranam|नमस्ते|प्रणाम|जय मिथिला|राम राम|ram ram|jay mithila/i.test(q)) {
        if (lang === 'bho') {
          return {
            text: `प्रणाम! हम BighaWala AI Expert हईं। 🌾<br><br>रउआ हमसे बिहार के ज़मीन नापी (बीघा, कट्ठा, धुर), दाखिल-खारिज, जमाबंदी, जमीन के सरकारी रेट आ रजिस्ट्री से जुड़ल कौनो सवाल पूछ सकिलां।`,
            lang: 'bho'
          };
        } else if (lang === 'mai') {
          return {
            text: `जय मिथिला! प्रणाम। हम BighaWala AI Expert छी। 🌾<br><br>अहाँ बिहारक जमीन मापी (बीघा, कट्ठा), जमाबंदी पंजी, दाखिल खारिज आ रजिस्ट्री खर्च सं संबंधित प्रश्न पुछि सकै छी।`,
            lang: 'mai'
          };
        } else if (lang === 'en') {
          return {
            text: `Hello! I am your <strong>BighaWala AI Expert</strong> 🌾<br><br>I can instantly assist you with Bihar land measurements (Bigha, Katha, Sq Ft), Dakhil Kharij mutation, Jamabandi records, district land rates (MVR 2026), and registration fees.`,
            lang: 'en'
          };
        } else {
          return {
            text: `नमस्ते! मैं **BighaWala AI Expert** हूँ। 🌾<br><br>बिहार की ज़मीन मापी (बीघा, कट्ठा, धुर, वर्ग फीट), दाखिल-खारिज, जमाबंदी पंजी-2, सरकारी रेट (MVR) या रजिस्ट्री नियम से जुड़ा कोई भी सवाल पूछें — हिंदी, भोजपुरी या मैथिली में।`,
            lang: 'hi'
          };
        }
      }

      // Fallback
      if (lang === 'bho') {
        return {
          text: `इ सवाल के बारे में सटीक जानकारी खातिर कृपया अपना ज़िला के अंचलाधिकारी (CO) कार्यालय या बिहार भूमि पोर्टल (<a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a>) पर संपर्क करीं।<br><br>रउआ बीघा मापी, दाखिल खारिज, जमाबंदी या पटना जमीन रेट के बारे में भी पूछ सकिलां।`,
          lang: 'bho'
        };
      } else if (lang === 'mai') {
        return {
          text: `एहि विषयक सटीक जानकारी लेल अंचल कार्यालय (CO Office) अथवा सरकारी पोर्टल <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर संपर्क करू।<br><br>अहाँ बीघा मापी आ दाखिल खारिज के प्रश्न पुनः पुछि सकै छी।`,
          lang: 'mai'
        };
      } else if (lang === 'en') {
        return {
          text: `For precise legal details on this specific query, please contact your local Circle Officer (CO) or visit the official Bihar land portal: <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a>.<br><br>You can also ask me about Bigha unit conversions, Dakhil Kharij documents, Jamabandi records, or district land rates!`,
          lang: 'en'
        };
      } else {
        return {
          text: `इस बारे में सटीक जानकारी के लिए कृपया अपने ज़िला भूमि कार्यालय (CO/DCLR Office) से संपर्क करें या बिहार भूमि पोर्टल (<a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#2E7D32;font-weight:bold;">biharbhumi.bihar.gov.in</a>) देखें।<br><br>आप मुझसे बीघा मापी, दाखिल-खारिज, जमाबंदी या जमीन रजिस्ट्री खर्च से जुड़ा कोई अन्य सवाल भी पूछ सकते हैं!`,
          lang: 'hi'
        };
      }
    }
  };

  // --- UI CONSTRUCTION ---
  function initChatbotUI() {
    // Inject Stylesheet
    const styleEl = document.createElement('style');
    styleEl.id = 'bighawala-widget-styles';
    styleEl.textContent = `
      #bighawala-widget-container * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      #bighawala-widget-container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      /* Floating Button */
      #bw-chat-button {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
        color: #ffffff;
        border: 2px solid #A5D6A7;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(46, 125, 50, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
      }

      #bw-chat-button:hover {
        transform: scale(1.08) rotate(-4deg);
        box-shadow: 0 12px 28px rgba(46, 125, 50, 0.5);
      }

      #bw-chat-badge {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        background-color: #FF6F00;
        border: 2px solid #ffffff;
        border-radius: 50%;
        animation: bw-pulse 2s infinite;
      }

      @keyframes bw-pulse {
        0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 111, 0, 0.7); }
        70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(255, 111, 0, 0); }
        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 111, 0, 0); }
      }

      /* Chat Window */
      #bw-chat-window {
        display: none;
        width: 380px;
        height: 540px;
        max-height: calc(100vh - 100px);
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(46, 125, 50, 0.15);
        overflow: hidden;
        flex-direction: column;
        margin-bottom: 16px;
        transform: translateY(20px) scale(0.95);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #bw-chat-window.open {
        display: flex;
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      /* Header */
      .bw-header {
        background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
        color: #ffffff;
        padding: 16px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 2px solid #A5D6A7;
      }

      .bw-header-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .bw-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border: 1.5px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .bw-title {
        font-size: 15px;
        font-weight: 700;
        letter-spacing: 0.2px;
        color: #ffffff;
      }

      .bw-subtitle {
        font-size: 11px;
        opacity: 0.9;
        display: flex;
        align-items: center;
        gap: 6px;
        color: #E8F5E9;
      }

      .bw-online-dot {
        width: 7px;
        height: 7px;
        background-color: #69F0AE;
        border-radius: 50%;
        display: inline-block;
      }

      .bw-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .bw-icon-btn {
        background: rgba(255, 255, 255, 0.15);
        border: none;
        color: #ffffff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: background 0.2s;
      }

      .bw-icon-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Language Bar */
      .bw-lang-bar {
        background: #F1F8E9;
        padding: 8px 12px;
        border-bottom: 1px solid #C8E6C9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        color: #1B5E20;
      }

      .bw-lang-pills {
        display: flex;
        gap: 4px;
      }

      .bw-lang-pill {
        padding: 2px 8px;
        border-radius: 12px;
        border: 1px solid #A5D6A7;
        background: #ffffff;
        color: #2E7D32;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
      }

      .bw-lang-pill.active {
        background: #2E7D32;
        color: #ffffff;
        border-color: #2E7D32;
      }

      /* Messages Area */
      .bw-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        background-color: #F9FAF7;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }

      .bw-msg-row {
        display: flex;
        flex-direction: column;
        max-width: 88%;
      }

      .bw-msg-row.user {
        align-self: flex-end;
      }

      .bw-msg-row.bot {
        align-self: flex-start;
      }

      .bw-bubble {
        padding: 12px 16px;
        font-size: 13.5px;
        line-height: 1.55;
        border-radius: 16px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
        word-break: break-word;
      }

      .bw-msg-row.user .bw-bubble {
        background: #E8F5E9;
        color: #1B5E20;
        border: 1px solid #A5D6A7;
        border-bottom-right-radius: 4px;
      }

      .bw-msg-row.bot .bw-bubble {
        background: #ffffff;
        color: #212121;
        border: 1px solid #E0E0E0;
        border-bottom-left-radius: 4px;
      }

      .bw-lang-tag {
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
        color: #2E7D32;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* Quick Suggestion Pills */
      .bw-quick-pills {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        padding: 8px 12px;
        background: #ffffff;
        border-top: 1px solid #EEEEEE;
        scrollbar-width: none;
      }

      .bw-quick-pills::-webkit-scrollbar {
        display: none;
      }

      .bw-quick-pill {
        white-space: nowrap;
        padding: 6px 12px;
        border-radius: 16px;
        background: #F1F8E9;
        border: 1px solid #C8E6C9;
        color: #2E7D32;
        font-size: 11.5px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .bw-quick-pill:hover {
        background: #2E7D32;
        color: #ffffff;
      }

      /* Input Form */
      .bw-input-area {
        padding: 12px;
        border-top: 1px solid #E0E0E0;
        display: flex;
        gap: 8px;
        background: #ffffff;
        align-items: center;
      }

      .bw-input {
        flex: 1;
        padding: 10px 14px;
        border: 1.5px solid #C8E6C9;
        border-radius: 24px;
        font-size: 13.5px;
        outline: none;
        transition: border-color 0.2s;
        background: #FAFAFA;
      }

      .bw-input:focus {
        border-color: #2E7D32;
        background: #ffffff;
      }

      .bw-send-btn {
        background: #2E7D32;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #ffffff;
        transition: background 0.2s, transform 0.1s;
        flex-shrink: 0;
      }

      .bw-send-btn:hover {
        background: #1B5E20;
        transform: scale(1.05);
      }

      /* Typing indicator */
      .bw-typing {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 10px 14px;
        background: #ffffff;
        border: 1px solid #E0E0E0;
        border-radius: 16px;
        width: fit-content;
      }

      .bw-typing-dot {
        width: 6px;
        height: 6px;
        background-color: #2E7D32;
        border-radius: 50%;
        animation: bw-bounce 1.4s infinite ease-in-out both;
      }

      .bw-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .bw-typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes bw-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      /* Mobile full screen overlay */
      @media (max-width: 640px) {
        #bighawala-widget-container {
          bottom: 12px;
          right: 12px;
        }
        #bw-chat-window {
          width: calc(100vw - 24px);
          height: calc(100vh - 80px);
          max-height: 580px;
          border-radius: 16px;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // Create Container
    const container = document.createElement('div');
    container.id = 'bighawala-widget-container';

    container.innerHTML = `
      <div id="bw-chat-window" aria-hidden="true">
        <!-- Header -->
        <div class="bw-header">
          <div class="bw-header-info">
            <div class="bw-avatar">🏡</div>
            <div>
              <div class="bw-title">BighaWala AI Expert</div>
              <div class="bw-subtitle">
                <span class="bw-online-dot"></span> 24/7 बिहार भूमि सहायक
              </div>
            </div>
          </div>
          <div class="bw-header-actions">
            <button id="bw-clear-btn" class="bw-icon-btn" title="Clear Chat">🧹</button>
            <button id="bw-close-btn" class="bw-icon-btn" title="Close Window">✕</button>
          </div>
        </div>

        <!-- Language Selector -->
        <div class="bw-lang-bar">
          <span>भाषा चुनें (Language):</span>
          <div class="bw-lang-pills">
            <button class="bw-lang-pill active" data-lang="auto">Auto</button>
            <button class="bw-lang-pill" data-lang="hi">हिंदी</button>
            <button class="bw-lang-pill" data-lang="bho">भोजपुरी</button>
            <button class="bw-lang-pill" data-lang="mai">मैथिली</button>
            <button class="bw-lang-pill" data-lang="en">EN</button>
          </div>
        </div>

        <!-- Chat Messages Container -->
        <div id="bw-messages" class="bw-messages">
          <!-- Welcome Message -->
          <div class="bw-msg-row bot">
            <div class="bw-lang-tag">🌐 AUTO DETECT MODE</div>
            <div class="bw-bubble">
              नमस्ते! मैं <strong>BighaWala AI Expert</strong> हूँ। 🌾<br><br>
              बिहार की जमीन की मापी (बीघा, कट्ठा, धुर), दाखिल-खारिज, जमाबंदी, सरकारी रेट (MVR) या रजिस्ट्री नियम से जुड़ा कोई भी सवाल पूछें — <strong>हिंदी, भोजपुरी, मैथिली या English</strong> में।
            </div>
          </div>
        </div>

        <!-- Quick Pills -->
        <div class="bw-quick-pills">
          <button class="bw-quick-pill" data-query="1 bigha me kitna katha hota hai?">1 बीघा = कितना कट्ठा?</button>
          <button class="bw-quick-pill" data-query="dakhil kharij kaise karein?">दाखिल खारिज प्रक्रिया</button>
          <button class="bw-quick-pill" data-query="bhulekh kaise check karein?">जमाबंदी / भूलेख देखें</button>
          <button class="bw-quick-pill" data-query="land rate in patna 2026">पटना जमीन रेट 2026</button>
          <button class="bw-quick-pill" data-query="mutation fees in bihar">रजिस्ट्री खर्च & स्टाम्प ड्यूटी</button>
          <button class="bw-quick-pill" data-query="भोजपुरी में बताइए 1 बीघा में कत्था">भोजपुरी मापी</button>
          <button class="bw-quick-pill" data-query="मैथिली मे 1 बीघा मे कति कट्ठा अछि?">मैथिली मापी</button>
        </div>

        <!-- Input Form -->
        <form id="bw-input-form" class="bw-input-area">
          <input type="text" id="bw-input-field" class="bw-input" placeholder="सवाल पूछें (उदा. 1 बीघा में कितना कट्ठा)..." required autocomplete="off" />
          <button type="submit" class="bw-send-btn" title="Send Message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>

      <!-- Floating Trigger Button -->
      <button id="bw-chat-button" title="BighaWala AI Expert — Bihar Land Help">
        <span id="bw-chat-badge"></span>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    `;

    document.body.appendChild(container);

    // DOM Elements
    const chatBtn = document.getElementById('bw-chat-button');
    const chatWin = document.getElementById('bw-chat-window');
    const closeBtn = document.getElementById('bw-close-btn');
    const clearBtn = document.getElementById('bw-clear-btn');
    const form = document.getElementById('bw-input-form');
    const input = document.getElementById('bw-input-field');
    const messagesBox = document.getElementById('bw-messages');
    const langPills = document.querySelectorAll('.bw-lang-pill');
    const quickPills = document.querySelectorAll('.bw-quick-pill');

    // Toggle Window
    chatBtn.addEventListener('click', () => {
      const isOpen = chatWin.classList.contains('open');
      if (isOpen) {
        chatWin.classList.remove('open');
        chatWin.setAttribute('aria-hidden', 'true');
      } else {
        chatWin.classList.add('open');
        chatWin.setAttribute('aria-hidden', 'false');
        input.focus();
      }
    });

    closeBtn.addEventListener('click', () => {
      chatWin.classList.remove('open');
      chatWin.setAttribute('aria-hidden', 'true');
    });

    // Clear Chat
    clearBtn.addEventListener('click', () => {
      messagesBox.innerHTML = `
        <div class="bw-msg-row bot">
          <div class="bw-lang-tag">🌐 RESET CHAT</div>
          <div class="bw-bubble">
            चैट साफ़ कर दिया गया है। नया सवाल पूछें! 🌾
          </div>
        </div>
      `;
    });

    // Language Selector Buttons
    langPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        langPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        BighaWalaEngine.currentLang = pill.getAttribute('data-lang');
      });
    });

    // Quick Action Pills
    quickPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-query');
        if (query) {
          input.value = query;
          handleUserSubmit(query);
        }
      });
    });

    // Append Message Helper
    function appendMessage(text, isUser, langTag) {
      const row = document.createElement('div');
      row.className = `bw-msg-row ${isUser ? 'user' : 'bot'}`;

      let langLabel = '';
      if (!isUser && langTag) {
        const langMap = { hi: 'हिंदी (Hindi)', bho: 'भोजपुरी (Bhojpuri)', mai: 'मैथिली (Maithili)', en: 'English' };
        langLabel = `<div class="bw-lang-tag">🌐 ${langMap[langTag] || 'RESPONSE'}</div>`;
      }

      row.innerHTML = `
        ${langLabel}
        <div class="bw-bubble">${text}</div>
      `;

      messagesBox.appendChild(row);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // Typing Indicator Helper
    function showTypingIndicator() {
      const typingEl = document.createElement('div');
      typingEl.id = 'bw-typing-box';
      typingEl.className = 'bw-msg-row bot';
      typingEl.innerHTML = `
        <div class="bw-typing">
          <div class="bw-typing-dot"></div>
          <div class="bw-typing-dot"></div>
          <div class="bw-typing-dot"></div>
        </div>
      `;
      messagesBox.appendChild(typingEl);
      messagesBox.scrollTop = messagesBox.scrollHeight;
      return typingEl;
    }

    // Process Submit
    function handleUserSubmit(queryText) {
      const query = queryText.trim();
      if (!query) return;

      input.value = '';

      // User Bubble
      appendMessage(query, true);

      // Typing
      const typingIndicator = showTypingIndicator();

      // Simulated Intelligent Engine Delay (300ms - 500ms)
      setTimeout(() => {
        typingIndicator.remove();
        const responseObj = BighaWalaEngine.getKnowledgeResponse(query);
        appendMessage(responseObj.text, false, responseObj.lang);
      }, 400);
    }

    // Form Submit Listener
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUserSubmit(input.value);
    });
  }

  // Auto-run when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
  } else {
    initChatbotUI();
  }
})();
