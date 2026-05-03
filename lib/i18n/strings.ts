/**
 * UI string dictionary for Vote Bharath.
 *
 * Keep keys flat and namespaced (e.g. `nav.home`) so adding a new screen
 * doesn't require restructuring the dictionary.
 *
 * The `en` and `hi` shapes are kept identical via the `Strings` type
 * — TypeScript will yell if a key is missing in either locale.
 */

export const en = {
  nav: {
    brand: 'Vote Bharath',
    tagline: 'Your guide to Indian elections',
    home: 'Home',
    timeline: 'Election Timeline',
    journey: 'Voter Journey',
    ask: 'Ask Anything',
  },
  home: {
    heroTitle: 'Understand Indian elections, end to end',
    heroSubtitle:
      'A friendly guide to how voting works in India — from registration to results. Available in English and हिन्दी, with voice support.',
    cta: 'Start exploring',
    feature1Title: 'Interactive timeline',
    feature1Desc: 'Follow the entire election cycle, phase by phase.',
    feature2Title: 'Step-by-step voter journey',
    feature2Desc: 'Know exactly what to do, from registration to polling day.',
    feature3Title: 'Ask anything',
    feature3Desc: 'A bilingual assistant grounded in official ECI sources.',
  },
  timeline: {
    title: 'The Election Cycle',
    subtitle: 'Tap any phase to learn more',
    durationLabel: 'Approx. duration',
    keyActorsLabel: 'Key actors',
  },
  journey: {
    title: 'Your Voter Journey',
    subtitle: 'Five steps from "where do I start" to "I voted"',
    progressLabel: 'Progress',
    nextStep: 'Next step',
    prevStep: 'Previous',
    restart: 'Start over',
    completed: 'Journey complete! You are election-ready.',
  },
  ask: {
    title: 'Ask Anything About Elections',
    subtitle: 'Powered by Gemini and grounded in ECI sources',
    placeholder: 'e.g. How do I register to vote?',
    send: 'Send',
    listening: 'Listening...',
    micLabel: 'Speak your question',
    listenLabel: 'Listen to answer',
    stopLabel: 'Stop',
    sourcesLabel: 'Sources',
    suggestions: [
      'How do I register to vote?',
      'What is NOTA?',
      'Can NRIs vote in India?',
      'What is the Model Code of Conduct?',
    ],
    error: 'Something went wrong. Please try again.',
    thinking: 'Thinking...',
  },
  common: {
    languageToggle: 'Language',
    languageEnglish: 'English',
    languageHindi: 'हिन्दी',
    skipToContent: 'Skip to main content',
    loading: 'Loading...',
  },
} as const;

export type Strings = typeof en;

export const hi: Strings = {
  nav: {
    brand: 'वोट भारत',
    tagline: 'भारतीय चुनावों के लिए आपका साथी',
    home: 'मुख्य पृष्ठ',
    timeline: 'चुनाव समयरेखा',
    journey: 'मतदाता यात्रा',
    ask: 'कुछ भी पूछें',
  },
  home: {
    heroTitle: 'भारतीय चुनावों को पूरी तरह समझें',
    heroSubtitle:
      'भारत में मतदान कैसे काम करता है — पंजीकरण से लेकर परिणाम तक एक सरल मार्गदर्शिका। English और हिन्दी में, आवाज़ समर्थन के साथ।',
    cta: 'शुरू करें',
    feature1Title: 'इंटरैक्टिव समयरेखा',
    feature1Desc: 'पूरे चुनाव चक्र को चरण-दर-चरण समझें।',
    feature2Title: 'चरण-दर-चरण मतदाता यात्रा',
    feature2Desc: 'पंजीकरण से मतदान दिवस तक — हर कदम जानें।',
    feature3Title: 'कुछ भी पूछें',
    feature3Desc: 'आधिकारिक ECI स्रोतों पर आधारित द्विभाषी सहायक।',
  },
  timeline: {
    title: 'चुनाव चक्र',
    subtitle: 'अधिक जानने के लिए किसी भी चरण पर टैप करें',
    durationLabel: 'अनुमानित अवधि',
    keyActorsLabel: 'मुख्य भूमिकाएँ',
  },
  journey: {
    title: 'आपकी मतदाता यात्रा',
    subtitle: '"कहाँ से शुरू करूँ" से "मैंने मतदान किया" तक पाँच चरण',
    progressLabel: 'प्रगति',
    nextStep: 'अगला चरण',
    prevStep: 'पिछला',
    restart: 'फिर से शुरू करें',
    completed: 'यात्रा पूर्ण! आप मतदान के लिए तैयार हैं।',
  },
  ask: {
    title: 'चुनावों के बारे में कुछ भी पूछें',
    subtitle: 'Gemini द्वारा संचालित, ECI स्रोतों पर आधारित',
    placeholder: 'जैसे: मैं मतदाता के रूप में कैसे पंजीकरण करूँ?',
    send: 'भेजें',
    listening: 'सुन रहे हैं...',
    micLabel: 'अपना प्रश्न बोलें',
    listenLabel: 'उत्तर सुनें',
    stopLabel: 'रोकें',
    sourcesLabel: 'स्रोत',
    suggestions: [
      'मैं मतदाता के रूप में कैसे पंजीकरण करूँ?',
      'NOTA क्या है?',
      'क्या NRI भारत में मतदान कर सकते हैं?',
      'आदर्श आचार संहिता क्या है?',
    ],
    error: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    thinking: 'सोच रहा हूँ...',
  },
  common: {
    languageToggle: 'भाषा',
    languageEnglish: 'English',
    languageHindi: 'हिन्दी',
    skipToContent: 'मुख्य सामग्री पर जाएँ',
    loading: 'लोड हो रहा है...',
  },
};

export const dictionaries = { en, hi } as const;
export type Locale = keyof typeof dictionaries;
export const LOCALES: Locale[] = ['en', 'hi'];
