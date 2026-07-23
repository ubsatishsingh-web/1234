/**
 * BighaWala Voice AI Expert — Production-Ready Voice-First AI Assistant Widget
 * Website: https://www.bighawala.com
 * Domain: Bihar Land Information, Bigha Calculator, Dakhil Kharij, Bhulekh, Land Rates 2026
 * Features: Continuous Voice-First Flow (Listen -> Speak -> Auto-Listen), Animated Visualizer, Voice Assistant UI
 * Languages: Hindi (hi-IN), Bhojpuri (bho-IN), Maithili (mai-IN), English (en-IN)
 */

(function () {
  if (window.BighaWalaVoiceWidgetInitialized) return;
  window.BighaWalaVoiceWidgetInitialized = true;

  // --- HINDI / BHOJPURI PHONETIC NUMBER & TEXT CLEANER FOR NATURAL TTS ---
  function numberToHindiWords(numStr) {
    let s = numStr.toString().trim();
    if (s === '0') return 'शून्य';
    if (s === '1') return 'एक';
    if (s === '2') return 'दो';
    if (s === '3') return 'तीन';
    if (s === '4') return 'चार';
    if (s === '5') return 'पाँच';
    if (s === '5.5') return 'साढ़े पाँच';
    if (s === '6') return 'छह';
    if (s === '7') return 'सात';
    if (s === '8') return 'आठ';
    if (s === '9') return 'नौ';
    if (s === '10') return 'दस';
    if (s === '20') return 'बीस';
    if (s === '35') return 'पैंतीस';
    if (s === '400') return 'चार सौ';
    if (s === '27225') return 'सत्ताइस हज़ार दो सौ पच्चीस';
    if (s === '32400') return 'बत्तीस हज़ार चार सौ';
    if (s === '1361.25') return 'तेरह सौ एकसठ पॉइंट दो पाँच';
    if (s === '1620') return 'सोलह सौ बीस';
    if (s === '435.6') return 'चार सौ पैंतीस पॉइंट छह';
    return s;
  }

  // --- KNOWLEDGE BASE & SPEECH ENGINE ---
  const BighaWalaEngine = {
    currentLang: 'auto',
    isMuted: false,
    speechRate: 0.95, // Natural speaking pace
    speechVolume: 1.0,

    cleanTextForTTS: function (htmlText) {
      const div = document.createElement('div');
      div.innerHTML = htmlText;
      let text = div.textContent || div.innerText || '';
      
      // Replace URLs
      text = text.replace(/https?:\/\/[^\s]+/g, 'बिहार भूमि पोर्टल');
      text = text.replace(/biharbhumi\.bihar\.gov\.in/g, 'बिहार भूमि पोर्टल');
      text = text.replace(/bhumijankari\.bihar\.gov\.in/g, 'भूमि जानकारी पोर्टल');
      
      // Format monetary values & symbols
      text = text.replace(/₹\s*0/g, 'शून्य रुपये');
      text = text.replace(/₹\s*25\s*लाख/g, 'पच्चीस लाख रुपये');
      text = text.replace(/₹\s*75\s*लाख/g, 'पचहत्तर लाख रुपये');
      text = text.replace(/₹\s*80\s*लाख/g, 'अस्सी लाख रुपये');
      text = text.replace(/₹\s*2.5\s*करोड़/g, 'ढाई करोड़ रुपये');
      text = text.replace(/₹\s*10\s*लाख/g, 'दस लाख रुपये');
      text = text.replace(/₹\s*35\s*लाख/g, 'पैंतीस लाख रुपये');
      text = text.replace(/₹\s*2\s*लाख/g, 'दो लाख रुपये');
      text = text.replace(/₹\s*8\s*लाख/g, 'आठ लाख रुपये');
      text = text.replace(/8%/g, 'आठ प्रतिशत');
      text = text.replace(/7%/g, 'सात प्रतिशत');
      text = text.replace(/6%/g, 'छह प्रतिशत');
      text = text.replace(/5%/g, 'पाँच प्रतिशत');
      text = text.replace(/2%/g, 'दो प्रतिशत');
      text = text.replace(/1%/g, 'एक प्रतिशत');
      
      // Clean markup symbols
      text = text.replace(/•/g, '').replace(/sq ft/gi, 'स्क्वायर फीट').replace(/\//g, ' या ');
      text = text.replace(/\*/g, '').replace(/sqft/gi, 'स्क्वायर फीट');
      text = text.replace(/\s+/g, ' ').trim();
      return text;
    },

    detectLanguage: function (text) {
      if (this.currentLang !== 'auto') return this.currentLang;
      const t = text.toLowerCase();
      const bho = ['भोजपुरी', 'बताईं', 'कइसे', 'खातिर', 'रोउआ', 'रउरा', 'कइल जाला', 'होखेला', 'बाटे', 'हटे', 'होला', 'कतना', 'कत्था', 'बाते', 'रउआ', 'हईं'];
      const mai = ['मैथिली', 'कति', 'अछि', 'हमरा', 'आहाँ', 'अहां', 'कतेक', 'अछी', 'भेल', 'छै', 'कट्ठा अछि', 'छी'];
      
      for (let w of bho) { if (t.includes(w)) return 'bho'; }
      for (let w of mai) { if (t.includes(w)) return 'mai'; }
      if (/^[a-zA-Z0-9\s\?\.\,\!\-\_\/\:\₹\$]+$/.test(t.trim()) && /[a-zA-Z]/.test(t)) return 'en';
      return 'hi';
    },

    processCalculator: function (query, lang) {
      const q = query.toLowerCase().replace(/,/g, '');

      // Bigha calculation
      const bighaMatch = q.match(/(\d+(?:\.\d+)?)\s*(bigha|बीघा|बीहा|बिघा)/i);
      if (bighaMatch) {
        const val = parseFloat(bighaMatch[1]);
        const katha = val * 20;
        const dhur = val * 400;
        const decimal = val * 20;
        const sqftPatna = Math.round(val * 27225);
        const sqftNorth = Math.round(val * 32400);

        if (lang === 'bho') {
          return {
            text: `<strong>📐 ${val} बीघा के मापी (बिहार मान अनुसार):</strong><br><br>` +
              `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
              `• <strong>धुर:</strong> ${dhur} धुर<br>` +
              `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
              `• <strong>क्षेत्रफल (पटना / 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} स्क्वायर फीट<br>` +
              `• <strong>क्षेत्रफल (उत्तर बिहार / 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} स्क्वायर फीट<br><br>` +
              `<em>ध्यान दीं: बिहार में 1 बीघा में बीस कट्ठा होला।</em>`,
            speech: `${val} बीघा में ${katha} कट्ठा, ${dhur} धुर, और ${decimal} डिसमिल होता है। पटना 5.5 हाथ लगी से यह ${sqftPatna} स्क्वायर फीट और उत्तर बिहार 6 हाथ लगी से ${sqftNorth} स्क्वायर फीट बनता है।`
          };
        } else if (lang === 'mai') {
          return {
            text: `<strong>📐 ${val} बीघा के मापी:</strong><br><br>` +
              `• <strong>कट्ठा:</strong> ${katha} कट्ठा अछि<br>` +
              `• <strong>धुर:</strong> ${dhur} धुर<br>` +
              `• <strong>डिसमिल:</strong> ${decimal} डिसमिल<br>` +
              `• <strong>वर्ग फीट (6 हाथ लगि):</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`,
            speech: `${val} बीघा में ${katha} कट्ठा अछि, ${dhur} धुर, आ ${decimal} डिसमिल भेल। 6 हाथ लगि सं ${sqftNorth} स्क्वायर फीट होइछ।`
          };
        } else if (lang === 'en') {
          return {
            text: `<strong>📐 Measurement for ${val} Bigha in Bihar:</strong><br><br>` +
              `• <strong>Katha:</strong> ${katha} Katha<br>` +
              `• <strong>Dhur:</strong> ${dhur} Dhur<br>` +
              `• <strong>Decimal:</strong> ${decimal} Decimal<br>` +
              `• <strong>Patna / 5.5 Laggi Area:</strong> ${sqftPatna.toLocaleString('en-IN')} sq ft<br>` +
              `• <strong>North Bihar / 6 Laggi Area:</strong> ${sqftNorth.toLocaleString('en-IN')} sq ft`,
            speech: `${val} Bigha is equal to ${katha} Katha, ${dhur} Dhur, and ${decimal} Decimal. In Patna 5.5 Laggi it is ${sqftPatna} square feet, and in North Bihar 6 Laggi it is ${sqftNorth} square feet.`
          };
        } else {
          return {
            text: `<strong>📐 ${val} बीघा की मापी (बिहार मानक):</strong><br><br>` +
              `• <strong>कट्ठा:</strong> ${katha} कट्ठा<br>` +
              `• <strong>धुर:</strong> ${dhur} धुर<br>` +
              `• <strong>डेसिमल (डिसमिल):</strong> ${decimal} डिसमिल<br>` +
              `• <strong>क्षेत्रफल (पटना / 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} स्क्वायर फीट<br>` +
              `• <strong>क्षेत्रफल (उत्तर बिहार / 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} स्क्वायर फीट`,
            speech: `${val} बीघा में ${katha} कट्ठा, ${dhur} धुर और ${decimal} डिसमिल होता है। पटना 5.5 हाथ लगी के अनुसार यह ${sqftPatna} स्क्वायर फीट और उत्तर बिहार 6 हाथ लगी के अनुसार ${sqftNorth} स्क्वायर फीट है।`
          };
        }
      }

      // Katha calculation
      const kathaMatch = q.match(/(\d+(?:\.\d+)?)\s*(katha|kattha|कट्ठा|कत्था|कठ्ठा)/i);
      if (kathaMatch) {
        const val = parseFloat(kathaMatch[1]);
        const bigha = (val / 20).toFixed(2);
        const dhur = val * 20;
        const sqftPatna = Math.round(val * 1361.25);
        const sqftNorth = Math.round(val * 1620);

        return {
          text: `<strong>📐 ${val} कट्ठा की मापी (बिहार):</strong><br><br>` +
            `• <strong>बीघा:</strong> ${bigha} बीघा<br>` +
            `• <strong>धुर:</strong> ${dhur} धुर<br>` +
            `• <strong>क्षेत्रफल (पटना 5.5 हाथ लगी):</strong> ${sqftPatna.toLocaleString('en-IN')} स्क्वायर फीट<br>` +
            `• <strong>क्षेत्रफल (उत्तर बिहार 6 हाथ लगी):</strong> ${sqftNorth.toLocaleString('en-IN')} स्क्वायर फीट`,
          speech: `${val} कट्ठा में ${dhur} धुर होता है। पटना 5.5 हाथ लगी से यह ${sqftPatna} स्क्वायर फीट और उत्तर बिहार में ${sqftNorth} स्क्वायर फीट होता है।`
        };
      }

      // Decimal calculation
      const decimalMatch = q.match(/(\d+(?:\.\d+)?)\s*(decimal|dismil|डिसमिल|डेसिमल)/i);
      if (decimalMatch) {
        const val = parseFloat(decimalMatch[1]);
        const sqft = Math.round(val * 435.6);
        const kathaPatna = (sqft / 1361.25).toFixed(2);
        return {
          text: `<strong>📐 ${val} डिसमिल (Decimal) की मापी:</strong><br><br>` +
            `• <strong>कुल वर्ग फीट:</strong> ${sqft.toLocaleString('en-IN')} sq ft<br>` +
            `• <strong>कट्ठा (पटना 5.5 हाथ लगी):</strong> ${kathaPatna} कट्ठा<br>` +
            `• <strong>कट्ठा (उत्तर बिहार 6 हाथ लगी):</strong> ${(sqft / 1620).toFixed(2)} कट्ठा`,
          speech: `${val} डिसमिल में ${sqft} स्क्वायर फीट होता है, जो पटना 5.5 हाथ लगी के हिसाब से ${kathaPatna} कट्ठा बनता है।`
        };
      }

      return null;
    },

    getResponse: function (query) {
      const lang = this.detectLanguage(query);
      const q = query.toLowerCase();

      const calcRes = this.processCalculator(query, lang);
      if (calcRes) return { text: calcRes.text, speech: calcRes.speech, lang };

      // Off-domain filter
      if (/cricket|bollywood|movie|weather|modi|rahul|pizza|game|song|music/i.test(q)) {
        return {
          text: `माफ़ कीजिए, मैं सिर्फ़ बिहार की ज़मीन, बीघा मापी, दाखिल-खारिज, जमाबंदी, MVR सर्किल रेट और रजिस्ट्री संबंधी प्रश्नों में सहायता कर सकता हूँ। 🌾<br><br>कृपया ज़मीन से जुड़ा कोई सवाल बोलकर पूछें।`,
          speech: `माफ़ कीजिए, मैं सिर्फ़ बिहार की ज़मीन, बीघा मापी, दाखिल ख़ारिज और जमाबंदी के सवालों के जवाब दे सकता हूँ। कृपया ज़मीन से जुड़ा सवाल पूछें।`,
          lang
        };
      }

      // Dakhil Kharij / Mutation
      if (/dakhil|kharij|mutation|दाखिल|खारिज|दस्तावेज़|document/i.test(q)) {
        if (lang === 'bho') {
          return {
            text: `<strong>📝 बिहार में दाखिल-खारिज (Mutation) प्रक्रिया:</strong><br><br>` +
              `1. <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#69F0AE;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर जाईं।<br>` +
              `2. केवाला (Sale Deed Copy) आ आधार कार्ड अपलोड करीं।<br>` +
              `3. 35 दिन में अंचलाधिकारी (CO) द्वारा शुद्धि पत्र जारी हो जाई।<br><br>` +
              `💰 <strong>सरकारी फीस:</strong> एकदम <strong>मुफ्त (₹0)</strong> बा।`,
            speech: `बिहार में ऑनलाइन दाखिल ख़ारिज के लिए बिहार भूमि पोर्टल पर केवाला और आधार कार्ड अपलोड करें। अंचल कार्यालय द्वारा 35 दिनों में शुद्धि पत्र जारी कर दिया जाता है। इसका सरकारी शुल्क बिल्कुल मुफ्त है।`,
            lang: 'bho'
          };
        } else if (lang === 'en') {
          return {
            text: `<strong>📝 Dakhil Kharij (Land Mutation) in Bihar:</strong><br><br>` +
              `1. Visit <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#69F0AE;font-weight:bold;">biharbhumi.bihar.gov.in</a>.<br>` +
              `2. Upload Sale Deed (Kewala PDF), Aadhaar card & Affidavit.<br>` +
              `3. Correction slip (शुद्धि पत्र) is generated within 35 working days.<br><br>` +
              `💰 <strong>Government Fee:</strong> ₹0 (Free of cost).`,
            speech: `To apply for Dakhil Kharij mutation in Bihar, visit the BiharBhumi portal and upload your sale deed and Aadhaar. It takes 35 days and the online fee is completely free.`,
            lang: 'en'
          };
        } else {
          return {
            text: `<strong>📝 दाखिल-खारिज (Land Mutation) की ऑनलाइन प्रक्रिया:</strong><br><br>` +
              `• <strong>दस्तावेज़:</strong> केवाला (Sale Deed Copy), आधार कार्ड, शपथ पत्र (Affidavit) एवं विक्रेता का हालिया लगान रसीद।<br>` +
              `• <strong>प्रक्रिया:</strong> <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#69F0AE;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर जाएँ और 'ऑनलाइन दाखिल ख़ारिज आवेदन' करें।<br>` +
              `• <strong>समय सीमा:</strong> 35 कार्य दिवस | शुल्क: <strong>₹0 (निःशुल्क)</strong>`,
            speech: `बिहार में ऑनलाइन दाखिल ख़ारिज के लिए बिहार भूमि पोर्टल पर जाकर केवाला और आधार कार्ड अपलोड करें। 35 कार्य दिवसों में अंचल कार्यालय से शुद्धि पत्र मिल जाता है। इसका ऑनलाइन आवेदन शुल्क बिल्कुल मुफ्त है।`,
            lang: 'hi'
          };
        }
      }

      // Bhulekh / Jamabandi
      if (/bhulekh|jamabandi|khata|khasra|भूलेख|जमाबंदी|खाता|खेसरा/i.test(q)) {
        return {
          text: `<strong>🔍 बिहार भूलेख एवं जमाबंदी ऑनलाइन कैसे देखें:</strong><br><br>` +
            `1. <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#69F0AE;font-weight:bold;">biharbhumi.bihar.gov.in</a> पर जाएँ।<br>` +
            `2. <strong>'जमाबंदी पंजी देखें'</strong> पर क्लिक करें।<br>` +
            `3. अपना ज़िला, अंचल और मौजा चुनें।<br>` +
            `4. खाता नंबर, खेसरा (प्लॉट) या रैयत के नाम से खोजें।`,
          speech: `अपनी ज़मीन की जमाबंदी और खाता खेसरा ऑनलाइन देखने के लिए बिहार भूमि वेब पोर्टल पर जाएँ। वहाँ ज़िला और अंचल चुनकर आप नाम या खाता नंबर से जमाबंदी कॉपी देख सकते हैं।`,
          lang
        };
      }

      // Circle Rates / MVR
      if (/rate|mvr|patna|circle|रेट|मूल्य|सर्किल|पटना/i.test(q)) {
        return {
          text: `<strong>💰 बिहार सरकारी सर्किल रेट (MVR Rates 2026):</strong><br><br>` +
            `• <strong>पटना (Patna):</strong> कमर्शियल ₹80 लाख - ₹2.5 करोड़/कट्ठा | आवासीय ₹25 लाख - ₹75 लाख/कट्ठा<br>` +
            `• <strong>मुजफ्फरपुर / गया / भागलपुर:</strong> ₹10 लाख - ₹35 लाख/कट्ठा<br>` +
            `• <strong>कृषि भूमि:</strong> ₹2 लाख - ₹8 लाख/बीघा<br><br>` +
            `पोर्टल: <a href="https://bhumijankari.bihar.gov.in" target="_blank" rel="noopener" style="color:#69F0AE;font-weight:bold;">bhumijankari.bihar.gov.in</a>`,
          speech: `पटना में आवासीय ज़मीन का सरकारी सर्किल रेट 25 लाख से 75 लाख रुपये प्रति कट्ठा और कमर्शियल रेट 80 लाख से ढाई करोड़ रुपये प्रति कट्ठा है। अन्य ज़िलों में यह 10 से 35 लाख रुपये प्रति कट्ठा है।`,
          lang
        };
      }

      // Stamp Duty / Registry Fees
      if (/stamp|duty|registry|fee|charge|निबंधन|रजिस्ट्री|स्टाम्प|शुल्क/i.test(q)) {
        return {
          text: `<strong>📜 बिहार जमीन रजिस्ट्री खर्च (Stamp Duty & Fees 2026):</strong><br><br>` +
            `• <strong>पुरुष क्रेता:</strong> 6% स्टाम्प ड्यूटी + 2% निबंधन शुल्क = <strong>8%</strong><br>` +
            `• <strong>महिला क्रेता (1% छूट):</strong> 5% स्टाम्प ड्यूटी + 2% निबंधन शुल्क = <strong>7%</strong><br>` +
            `• <strong>नगर निगम क्षेत्र:</strong> 1% अतिरिक्त विकास शुल्क।`,
          speech: `बिहार में पुरुष के नाम पर रजिस्ट्री कराने पर कुल 8 प्रतिशत और महिला के नाम पर 1 प्रतिशत की छूट के साथ 7 प्रतिशत सरकारी शुल्क लगता है।`,
          lang
        };
      }

      // Fraud / Scams
      if (/scam|fraud|precaution|धोखाधड़ी|फर्जी|सावधानी/i.test(q)) {
        return {
          text: `<strong>🛡️ बिहार में जमीन धोखाधड़ी से बचने के मुख्य नियम:</strong><br><br>` +
            `1. बिहार भूमि पोर्टल पर विक्रेता की ऑनलाइन जमाबंदी और LPC की जाँच अवश्य करें।<br>` +
            `2. सुनिश्चित करें कि जमीन गैर-मजरुआ आम/खास या सीलिंग की नहीं है।<br>` +
            `3. भुगतान केवल बैंक चेक या RTGS से करें, नकद भुगतान न करें।`,
          speech: `बिहार में जमीन खरीदते समय बिहार भूमि पोर्टल पर ऑनलाइन जमाबंदी और एलपीसी की जांच जरूर करें। भुगतान केवल चेक या बैंक ट्रांसफर से ही करें।`,
          lang
        };
      }

      // Greetings
      if (/hi|hello|namaste|pranam|नमस्ते|प्रणाम|जय मिथिला/i.test(q)) {
        if (lang === 'bho') {
          return {
            text: `प्रणाम! हम BighaWala AI Expert हईं। 🌾 बिहार के ज़मीन, बीघा मापी आ दाखिल-खारिज के सवाल बोल के पूछीं।`,
            speech: `प्रणाम! हम बीघावाला एआई एक्सपर्ट हईं। बिहार के ज़मीन, बीघा मापी और दाखिल ख़ारिज के सवाल बोल के पूछीं।`,
            lang: 'bho'
          };
        } else if (lang === 'mai') {
          return {
            text: `जय मिथिला! प्रणाम। हम BighaWala AI Expert छी। 🌾 अहाँ बाज कऽ जमीन मापी आ जमाबंदी के प्रश्न पुछि सकै छी।`,
            speech: `जय मिथिला! प्रणाम। हम बीघावाला एआई एक्सपर्ट छी। अहाँ बाज कऽ ज़मीन मापी आ जमाबंदी के प्रश्न पुछि सकै छी।`,
            lang: 'mai'
          };
        } else if (lang === 'en') {
          return {
            text: `Hello! I am your <strong>BighaWala Voice AI Expert</strong>. Ask any question about Bihar land by speaking!`,
            speech: `Hello! I am your BighaWala Voice AI Expert. Please ask any question about Bihar land measurement, mutation or circle rates by speaking!`,
            lang: 'en'
          };
        } else {
          return {
            text: `नमस्ते! मैं <strong>BighaWala Voice AI Expert</strong> हूँ। 🌾 आप बिहार की ज़मीन मापी (बीघा, कट्ठा), दाखिल-खारिज या जमाबंदी से जुड़ा सवाल बोलकर पूछ सकते हैं।`,
            speech: `नमस्ते! मैं बीघावाला वॉइस एआई एक्सपर्ट हूँ। आप बिहार की ज़मीन मापी, बीघा कट्ठा गणना, या दाखिल ख़ारिज का कोई भी सवाल बोलकर पूछ सकते हैं।`,
            lang: 'hi'
          };
        }
      }

      // Fallback
      return {
        text: `इस बारे में सटीक कानूनी जानकारी के लिए कृपया अपने अंचल अधिकारी (CO Office) से संपर्क करें या <a href="https://biharbhumi.bihar.gov.in" target="_blank" rel="noopener" style="color:#69F0AE;font-weight:bold;">biharbhumi.bihar.gov.in</a> पोर्टल देखें।`,
        speech: `इस बारे में सटीक जानकारी के लिए कृपया अपने अंचल अधिकारी कार्यालय से संपर्क करें या बिहार भूमि पोर्टल देखें।`,
        lang
      };
    }
  };

  // --- STATE CONTROLLER & SPEECH ENGINE ---
  let recognition = null;
  let isListening = false;
  let isSpeaking = false;
  let autoListenMode = true; // Auto listen after TTS finishes
  let isAudioUnlocked = false;

  function unlockAudioContext() {
    if (isAudioUnlocked) return;
    isAudioUnlocked = true;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  function initSpeechRecognition(onResult, onStatusChange) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = function () {
      isListening = true;
      if (onStatusChange) onStatusChange('listening');
    };

    rec.onresult = function (event) {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (final && onResult) {
        onResult(final, true);
      } else if (interim && onResult) {
        onResult(interim, false);
      }
    };

    rec.onerror = function (event) {
      console.warn('Voice Recognition Error:', event.error);
      isListening = false;
      if (onStatusChange) onStatusChange('error', event.error);
    };

    rec.onend = function () {
      isListening = false;
      if (onStatusChange) onStatusChange('idle');
    };

    return rec;
  }

  function speakText(textToSpeak, lang, onStartCallback, onEndCallback) {
    if (!('speechSynthesis' in window) || BighaWalaEngine.isMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Cancel any current utterance before starting new one
    window.speechSynthesis.cancel();

    const plainText = BighaWalaEngine.cleanTextForTTS(textToSpeak);
    if (!plainText) {
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = BighaWalaEngine.speechRate;
    utterance.volume = BighaWalaEngine.speechVolume;

    let langCode = 'hi-IN';
    if (lang === 'en') langCode = 'en-IN';
    else langCode = 'hi-IN'; // Fallback to Indian accent Devanagari for Hindi/Bhojpuri/Maithili

    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const bestVoice = voices.find(v => (v.lang.includes('hi') || v.lang.includes('IN')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female') || true));
      if (bestVoice) utterance.voice = bestVoice;
    }

    utterance.onstart = function () {
      isSpeaking = true;
      if (onStartCallback) onStartCallback();
    };

    utterance.onend = function () {
      isSpeaking = false;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = function (err) {
      console.warn('TTS Speech Error:', err);
      isSpeaking = false;
      if (onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
    }
  }

  // --- UI CONSTRUCTION (VOICE-FIRST ASSISTANT OVERLAY) ---
  function createVoiceAssistantUI() {
    const style = document.createElement('style');
    style.id = 'bighawala-voice-assistant-style';
    style.textContent = `
      #bw-voice-app-root * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Poppins', 'Noto Sans Devanagari', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      /* Floating Mic Widget Launcher */
      #bw-voice-floating-btn {
        position: fixed;
        bottom: 28px;
        right: 28px;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0D3B1E 0%, #1B5E20 50%, #2E7D32 100%);
        color: #ffffff;
        border: 2.5px solid #A5D6A7;
        cursor: pointer;
        box-shadow: 0 12px 36px rgba(13, 59, 30, 0.5), 0 0 0 6px rgba(46, 125, 50, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      #bw-voice-floating-btn:hover {
        transform: scale(1.08) rotate(-5deg);
        box-shadow: 0 16px 42px rgba(13, 59, 30, 0.65), 0 0 0 10px rgba(46, 125, 50, 0.25);
      }

      .bw-pulse-ring-glow {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(46, 125, 50, 0.4);
        z-index: -1;
        animation: bw-pulse-ring-anim 2.2s infinite;
      }

      @keyframes bw-pulse-ring-anim {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.7); opacity: 0; }
      }

      /* Full Screen Voice Assistant Modal Sheet */
      #bw-voice-assistant-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000000;
        background: rgba(5, 20, 10, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: none;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.35s ease;
      }

      #bw-voice-assistant-overlay.active {
        display: flex;
        opacity: 1;
      }

      .bw-voice-card-container {
        width: 480px;
        max-width: calc(100vw - 32px);
        height: 680px;
        max-height: calc(100vh - 40px);
        background: linear-gradient(180deg, #0B2915 0%, #11381E 40%, #081B0E 100%);
        border-radius: 28px;
        border: 1px solid rgba(165, 214, 167, 0.3);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(46, 125, 50, 0.25);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        color: #ffffff;
      }

      /* Header Bar */
      .bw-va-header {
        padding: 18px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(0, 0, 0, 0.25);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .bw-va-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .bw-va-badge-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(105, 240, 174, 0.15);
        border: 1px solid #69F0AE;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }

      .bw-va-title-text {
        font-size: 16px;
        font-weight: 700;
        color: #ffffff;
        letter-spacing: 0.2px;
      }

      .bw-va-subtitle {
        font-size: 11px;
        color: #A5D6A7;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .bw-va-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .bw-va-icon-btn {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s;
      }

      .bw-va-icon-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.05);
      }

      .bw-va-lang-select {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(165, 214, 167, 0.4);
        color: #E8F5E9;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 12px;
        outline: none;
        cursor: pointer;
        font-weight: 600;
      }

      /* Voice Stage Area (Central Hero) */
      .bw-va-voice-stage {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px;
        text-align: center;
        position: relative;
      }

      /* Central Animated Mic Orb */
      .bw-va-mic-orb-wrapper {
        position: relative;
        width: 130px;
        height: 130px;
        margin-bottom: 20px;
        cursor: pointer;
      }

      .bw-va-mic-orb {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
        border: 3px solid #69F0AE;
        box-shadow: 0 0 35px rgba(105, 240, 174, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 48px;
        color: #ffffff;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        z-index: 2;
      }

      .bw-va-mic-orb-wrapper.listening .bw-va-mic-orb {
        background: linear-gradient(135deg, #C62828 0%, #E53935 100%);
        border-color: #FF8A80;
        box-shadow: 0 0 45px rgba(255, 138, 128, 0.7);
        animation: bw-orb-pulse 1.2s infinite alternate;
      }

      @keyframes bw-orb-pulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.08); }
      }

      .bw-va-mic-orb-wrapper.speaking .bw-va-mic-orb {
        background: linear-gradient(135deg, #00695C 0%, #00897B 100%);
        border-color: #80CBC4;
        box-shadow: 0 0 45px rgba(128, 203, 196, 0.7);
      }

      /* Outer Sound Waves Animation */
      .bw-va-wave-ring {
        position: absolute;
        inset: -20px;
        border-radius: 50%;
        border: 2px solid rgba(105, 240, 174, 0.4);
        opacity: 0;
        pointer-events: none;
      }

      .bw-va-mic-orb-wrapper.listening .bw-va-wave-ring-1 {
        animation: bw-ring-expand 2s infinite ease-out;
      }
      .bw-va-mic-orb-wrapper.listening .bw-va-wave-ring-2 {
        animation: bw-ring-expand 2s infinite ease-out 0.6s;
      }
      .bw-va-mic-orb-wrapper.listening .bw-va-wave-ring-3 {
        animation: bw-ring-expand 2s infinite ease-out 1.2s;
      }

      @keyframes bw-ring-expand {
        0% { transform: scale(0.8); opacity: 1; border-color: #FF8A80; }
        100% { transform: scale(1.8); opacity: 0; border-color: rgba(255, 138, 128, 0); }
      }

      /* Animated Equalizer Bars when Bot is Speaking */
      .bw-va-equalizer {
        display: none;
        align-items: center;
        justify-content: center;
        gap: 6px;
        height: 36px;
        margin-bottom: 12px;
      }

      .bw-va-mic-orb-wrapper.speaking + .bw-va-equalizer {
        display: flex;
      }

      .bw-va-eq-bar {
        width: 5px;
        height: 100%;
        background: #69F0AE;
        border-radius: 4px;
        animation: bw-eq-bounce 0.8s infinite ease-in-out;
      }

      .bw-va-eq-bar:nth-child(1) { animation-delay: 0.1s; }
      .bw-va-eq-bar:nth-child(2) { animation-delay: 0.3s; }
      .bw-va-eq-bar:nth-child(3) { animation-delay: 0.2s; }
      .bw-va-eq-bar:nth-child(4) { animation-delay: 0.4s; }
      .bw-va-eq-bar:nth-child(5) { animation-delay: 0.25s; }

      @keyframes bw-eq-bounce {
        0%, 100% { height: 8px; }
        50% { height: 32px; }
      }

      /* Voice Status Indicator Text */
      .bw-va-status-text {
        font-size: 18px;
        font-weight: 700;
        color: #69F0AE;
        margin-bottom: 8px;
        letter-spacing: 0.3px;
      }

      /* Live User Speech Transcription Pill */
      .bw-va-transcript-pill {
        min-height: 28px;
        font-size: 14px;
        color: #E8F5E9;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 6px 16px;
        border-radius: 20px;
        display: inline-block;
        max-width: 90%;
        font-style: italic;
      }

      /* Bot Response Card Container (Voice-first readable answer display) */
      .bw-va-response-card-wrap {
        width: 100%;
        padding: 0 20px 20px 20px;
        flex-shrink: 0;
      }

      .bw-va-response-card {
        background: rgba(255, 255, 255, 0.07);
        border: 1px solid rgba(165, 214, 167, 0.25);
        border-radius: 20px;
        padding: 18px 20px;
        max-height: 220px;
        overflow-y: auto;
        text-align: left;
        font-size: 14px;
        line-height: 1.6;
        color: #F1F8E9;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
        scroll-behavior: smooth;
      }

      .bw-va-response-card strong {
        color: #69F0AE;
      }

      .bw-va-response-card a {
        color: #A5D6A7;
        text-decoration: underline;
      }

      .bw-va-speak-again-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-top: 10px;
        padding: 6px 12px;
        border-radius: 12px;
        background: rgba(105, 240, 174, 0.18);
        border: 1px solid #69F0AE;
        color: #69F0AE;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }

      .bw-va-speak-again-btn:hover {
        background: #69F0AE;
        color: #0B2915;
      }

      /* Text Input Keyboard Bar (Optional Backup) */
      .bw-va-text-input-bar {
        display: none;
        padding: 12px 20px;
        background: rgba(0, 0, 0, 0.3);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        gap: 8px;
        align-items: center;
      }

      .bw-va-text-input-bar.active {
        display: flex;
      }

      .bw-va-text-field {
        flex: 1;
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(165, 214, 167, 0.3);
        border-radius: 20px;
        padding: 10px 16px;
        color: #ffffff;
        font-size: 14px;
        outline: none;
      }

      .bw-va-text-field::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      .bw-va-send-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #2E7D32;
        border: none;
        color: #ffffff;
        font-size: 16px;
        cursor: pointer;
      }

      /* Bottom Voice Navigation Dock */
      .bw-va-dock {
        padding: 16px 24px;
        background: rgba(0, 0, 0, 0.4);
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-around;
      }

      .bw-va-main-mic-btn {
        width: 68px;
        height: 68px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
        border: 2px solid #69F0AE;
        color: #ffffff;
        font-size: 28px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(46, 125, 50, 0.5);
        transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .bw-va-main-mic-btn:hover {
        transform: scale(1.08);
      }

      .bw-va-main-mic-btn.recording {
        background: linear-gradient(135deg, #C62828 0%, #E53935 100%);
        border-color: #FF8A80;
        box-shadow: 0 6px 24px rgba(229, 57, 53, 0.6);
      }

      .bw-va-dock-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #A5D6A7;
        padding: 8px 14px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
      }

      .bw-va-dock-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }

      @media (max-width: 600px) {
        .bw-voice-card-container {
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
        }
      }
    `;

    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'bw-voice-app-root';
    root.innerHTML = `
      <!-- Floating Launcher Button -->
      <button id="bw-voice-floating-btn" title="BighaWala Voice AI Assistant">
        <div class="bw-pulse-ring-glow"></div>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>

      <!-- Voice Assistant Modal Sheet -->
      <div id="bw-voice-assistant-overlay">
        <div class="bw-voice-card-container">
          <!-- Header -->
          <div class="bw-va-header">
            <div class="bw-va-brand">
              <div class="bw-va-badge-icon">🎙️</div>
              <div>
                <div class="bw-va-title-text">BighaWala Voice AI</div>
                <div class="bw-va-subtitle">
                  <span style="width:6px;height:6px;background:#69F0AE;border-radius:50%;display:inline-block;"></span>
                  बिहार ज़मीन बोलकर पूछें
                </div>
              </div>
            </div>
            <div class="bw-va-header-actions">
              <select id="bw-va-lang-select" class="bw-va-lang-select">
                <option value="auto">🌐 ऑटो भाषा (Auto)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="bho">भोजपुरी (Bhojpuri)</option>
                <option value="mai">मैथिली (Maithili)</option>
                <option value="en">English</option>
              </select>
              <button id="bw-va-btn-mute" class="bw-va-icon-btn" title="Mute/Unmute">🔊</button>
              <button id="bw-va-btn-close" class="bw-va-icon-btn" title="Close Assistant">✕</button>
            </div>
          </div>

          <!-- Central Voice Stage -->
          <div class="bw-va-voice-stage">
            <div id="bw-va-orb-wrapper" class="bw-va-mic-orb-wrapper">
              <div class="bw-va-wave-ring bw-va-wave-ring-1"></div>
              <div class="bw-va-wave-ring bw-va-wave-ring-2"></div>
              <div class="bw-va-wave-ring bw-va-wave-ring-3"></div>
              <div class="bw-va-mic-orb" id="bw-va-center-orb">🎙️</div>
            </div>

            <!-- Animated Equalizer when speaking -->
            <div class="bw-va-equalizer">
              <div class="bw-va-eq-bar"></div>
              <div class="bw-va-eq-bar"></div>
              <div class="bw-va-eq-bar"></div>
              <div class="bw-va-eq-bar"></div>
              <div class="bw-va-eq-bar"></div>
            </div>

            <div id="bw-va-status-label" class="bw-va-status-text">टैप करें या बोलिए...</div>
            <div id="bw-va-transcript-text" class="bw-va-transcript-pill">"एक बीघा में कितना कट्ठा होता है?"</div>
          </div>

          <!-- Bot Response Answer Display Card -->
          <div class="bw-va-response-card-wrap">
            <div id="bw-va-response-card" class="bw-va-response-card">
              नमस्ते! मैं <strong>BighaWala Voice AI Expert</strong> हूँ। 🌾<br><br>
              बिहार में बीघा, कट्ठा, डिसमिल मापी, दाखिल-खारिज या जमाबंदी का कोई भी सवाल बोलकर पूछें!
            </div>
            <button id="bw-va-speak-response-btn" class="bw-va-speak-again-btn">🔊 फिर से सुनें (Replay Answer)</button>
          </div>

          <!-- Keyboard Input Bar Backup -->
          <form id="bw-va-text-form" class="bw-va-text-input-bar">
            <input type="text" id="bw-va-text-input" class="bw-va-text-field" placeholder="या यहाँ लिखकर सवाल पूछें..." autocomplete="off" />
            <button type="submit" class="bw-va-send-btn">➤</button>
          </form>

          <!-- Dock Controls -->
          <div class="bw-va-dock">
            <button id="bw-va-kbd-toggle" class="bw-va-dock-btn" type="button">⌨️ टाइप करें</button>
            <button id="bw-va-dock-mic" class="bw-va-main-mic-btn" title="Speak Now">🎤</button>
            <button id="bw-va-reset-btn" class="bw-va-dock-btn" type="button">🔄 रीसेट</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // BIND ELEMENTS
    const launcher = document.getElementById('bw-voice-floating-btn');
    const overlay = document.getElementById('bw-voice-assistant-overlay');
    const closeBtn = document.getElementById('bw-va-btn-close');
    const muteBtn = document.getElementById('bw-va-btn-mute');
    const langSelect = document.getElementById('bw-va-lang-select');
    const orbWrapper = document.getElementById('bw-va-orb-wrapper');
    const statusLabel = document.getElementById('bw-va-status-label');
    const transcriptPill = document.getElementById('bw-va-transcript-text');
    const responseCard = document.getElementById('bw-va-response-card');
    const speakResponseBtn = document.getElementById('bw-va-speak-response-btn');
    const textForm = document.getElementById('bw-va-text-form');
    const textInput = document.getElementById('bw-va-text-input');
    const kbdToggle = document.getElementById('bw-va-kbd-toggle');
    const dockMicBtn = document.getElementById('bw-va-dock-mic');
    const resetBtn = document.getElementById('bw-va-reset-btn');

    let currentBotSpeech = "नमस्ते! मैं बीघावाला वॉइस एआई एक्सपर्ट हूँ। आप बिहार की ज़मीन मापी या दाखिल ख़ारिज का कोई भी सवाल बोलकर पूछ सकते हैं।";
    let currentBotLang = "hi";

    // Update Visual State
    function setAssistantState(state, text) {
      orbWrapper.classList.remove('listening', 'speaking');
      dockMicBtn.classList.remove('recording');

      if (state === 'listening') {
        orbWrapper.classList.add('listening');
        dockMicBtn.classList.add('recording');
        statusLabel.textContent = '🔴 बोलिए... (Listening)';
        statusLabel.style.color = '#FF8A80';
      } else if (state === 'speaking') {
        orbWrapper.classList.add('speaking');
        statusLabel.textContent = '🔊 AI बोल रहा है...';
        statusLabel.style.color = '#80CBC4';
      } else if (state === 'thinking') {
        statusLabel.textContent = '🤔 उत्तर ढूँढ रहा हूँ...';
        statusLabel.style.color = '#FFE082';
      } else { // idle
        statusLabel.textContent = text || '🎤 माइक पर टैप करें या बोलें';
        statusLabel.style.color = '#69F0AE';
      }
    }

    // Initialize Recognition
    recognition = initSpeechRecognition(
      function onResult(text, isFinal) {
        transcriptPill.textContent = `"${text}"`;
        if (isFinal) {
          handleUserQuery(text);
        }
      },
      function onStatus(status, err) {
        if (status === 'listening') {
          setAssistantState('listening');
        } else if (status === 'idle' && !isSpeaking) {
          setAssistantState('idle');
        }
      }
    );

    function startListening() {
      if (!recognition) {
        alert('आपके ब्राउज़र में आवाज़ पहचान (Speech Recognition) समर्थित नहीं है। कृपया Chrome/Edge उपयोग करें या लिखकर सवाल पूछें।');
        return;
      }
      stopSpeaking();
      try {
        recognition.lang = langSelect.value === 'en' ? 'en-IN' : 'hi-IN';
        recognition.start();
        setAssistantState('listening');
      } catch (e) {
        // Recognition already active
      }
    }

    function stopListening() {
      if (recognition && isListening) {
        try { recognition.stop(); } catch (e) { }
      }
    }

    function handleUserQuery(queryText) {
      if (!queryText || !queryText.trim()) return;
      stopListening();
      setAssistantState('thinking');

      setTimeout(() => {
        const answer = BighaWalaEngine.getResponse(queryText);
        responseCard.innerHTML = answer.text;
        currentBotSpeech = answer.speech || answer.text;
        currentBotLang = answer.lang;

        // Auto-play Voice Answer and then re-activate microphone automatically
        speakText(
          currentBotSpeech,
          currentBotLang,
          function onStart() {
            setAssistantState('speaking');
          },
          function onEnd() {
            setAssistantState('idle');
            // Chain: Automatically auto-listen again after bot finishes speaking!
            if (autoListenMode && overlay.classList.contains('active')) {
              setTimeout(() => {
                startListening();
              }, 400);
            }
          }
        );
      }, 350);
    }

    // WELCOME AUTO-FLOW
    function triggerWelcomeFlow() {
      unlockAudioContext();
      overlay.classList.add('active');

      const welcomeHTML = `नमस्ते! मैं <strong>BighaWala Voice AI Expert</strong> हूँ। 🌾<br><br>` +
        `बिहार में बीघा, कट्ठा, डिसमिल मापी, दाखिल-खारिज या जमाबंदी का कोई भी सवाल बोलकर पूछें!`;
      const welcomeSpeech = `नमस्ते! मैं बीघावाला वॉइस एआई एक्सपर्ट हूँ। बिहार की ज़मीन मापी, बीघा कट्ठा मापन या दाखिल ख़ारिज का सवाल बोलकर पूछें।`;

      responseCard.innerHTML = welcomeHTML;
      currentBotSpeech = welcomeSpeech;
      currentBotLang = 'hi';

      // Auto play welcome voice -> then start listening automatically!
      speakText(
        welcomeSpeech,
        'hi',
        function onStart() {
          setAssistantState('speaking');
        },
        function onEnd() {
          setAssistantState('idle');
          if (autoListenMode) {
            setTimeout(() => {
              startListening();
            }, 500);
          }
        }
      );
    }

    // EVENT LISTENERS
    launcher.addEventListener('click', () => {
      if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        stopSpeaking();
        stopListening();
      } else {
        triggerWelcomeFlow();
      }
    });

    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      stopSpeaking();
      stopListening();
    });

    orbWrapper.addEventListener('click', () => {
      if (isSpeaking) {
        stopSpeaking();
        startListening();
      } else if (isListening) {
        stopListening();
        setAssistantState('idle');
      } else {
        startListening();
      }
    });

    dockMicBtn.addEventListener('click', () => {
      if (isListening) {
        stopListening();
        setAssistantState('idle');
      } else {
        startListening();
      }
    });

    muteBtn.addEventListener('click', () => {
      BighaWalaEngine.isMuted = !BighaWalaEngine.isMuted;
      muteBtn.textContent = BighaWalaEngine.isMuted ? '🔇' : '🔊';
      if (BighaWalaEngine.isMuted) stopSpeaking();
    });

    speakResponseBtn.addEventListener('click', () => {
      speakText(currentBotSpeech, currentBotLang, () => setAssistantState('speaking'), () => setAssistantState('idle'));
    });

    kbdToggle.addEventListener('click', () => {
      textForm.classList.toggle('active');
      if (textForm.classList.contains('active')) textInput.focus();
    });

    textForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (textInput.value.trim()) {
        const val = textInput.value.trim();
        textInput.value = '';
        transcriptPill.textContent = `"${val}"`;
        handleUserQuery(val);
      }
    });

    resetBtn.addEventListener('click', () => {
      stopSpeaking();
      stopListening();
      triggerWelcomeFlow();
    });

    langSelect.addEventListener('change', (e) => {
      BighaWalaEngine.currentLang = e.target.value;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createVoiceAssistantUI);
  } else {
    createVoiceAssistantUI();
  }
})();
