/**
 * The voter journey — five canonical steps every Indian voter should know,
 * from "am I eligible" to "my vote was counted". Each step has bilingual
 * content plus optional action links to official ECI portals.
 */

import type { Bilingual } from './timeline';

export interface JourneyStep {
  id: string;
  index: number;
  icon: string;
  title: Bilingual;
  description: Bilingual;
  actions: {
    label: Bilingual;
    href: string;
  }[];
  tips: Bilingual[];
}

export const journey: JourneyStep[] = [
  {
    id: 'check-eligibility',
    index: 1,
    icon: 'BadgeCheck',
    title: {
      en: 'Check your eligibility',
      hi: 'अपनी पात्रता जाँचें',
    },
    description: {
      en: 'You can vote if you are an Indian citizen, at least 18 years old on the qualifying date (1 January of the year), and ordinarily resident in the constituency. Disqualifications include unsoundness of mind (declared by court), and certain electoral offences.',
      hi: 'यदि आप भारतीय नागरिक हैं, अर्हता तिथि (वर्ष की 1 जनवरी) को कम से कम 18 वर्ष के हैं, और निर्वाचन क्षेत्र में सामान्य रूप से निवास करते हैं, तो आप मतदान कर सकते हैं।',
    },
    actions: [
      {
        label: { en: 'ECI eligibility guide', hi: 'ECI पात्रता मार्गदर्शिका' },
        href: 'https://eci.gov.in/voter/voter/',
      },
    ],
    tips: [
      {
        en: 'You can register starting from 17 — your name is added when you turn 18.',
        hi: '17 वर्ष की आयु से आप पंजीकरण कर सकते हैं — 18 वर्ष पूरे होने पर नाम जुड़ जाता है।',
      },
    ],
  },
  {
    id: 'register',
    index: 2,
    icon: 'IdCard',
    title: {
      en: 'Register and get your EPIC',
      hi: 'पंजीकरण करें और अपना EPIC प्राप्त करें',
    },
    description: {
      en: 'Fill Form 6 on the National Voter Service Portal (NVSP) or Voter Helpline app to enroll. You will need a passport-size photo, proof of age (Aadhaar/birth certificate/10th marksheet), and proof of address. The Booth Level Officer (BLO) verifies your application, and you receive your EPIC (Electors Photo Identity Card) by post in 30–40 days.',
      hi: 'NVSP पोर्टल या मतदाता हेल्पलाइन ऐप पर फॉर्म 6 भरें। आपको पासपोर्ट साइज फोटो, आयु प्रमाण और पते का प्रमाण चाहिए। BLO आपके आवेदन की पुष्टि करता है, और आपको 30–40 दिनों में EPIC डाक से प्राप्त होता है।',
    },
    actions: [
      {
        label: { en: 'Register on NVSP', hi: 'NVSP पर पंजीकरण करें' },
        href: 'https://voters.eci.gov.in/',
      },
      {
        label: { en: 'Voter Helpline app', hi: 'मतदाता हेल्पलाइन ऐप' },
        href: 'https://play.google.com/store/apps/details?id=com.eci.citizen',
      },
    ],
    tips: [
      {
        en: 'No EPIC? You can still vote with 11 alternative photo IDs including Aadhaar, passport, and PAN.',
        hi: 'EPIC नहीं है? आप आधार, पासपोर्ट और PAN सहित 11 वैकल्पिक फोटो पहचान पत्रों के साथ भी मतदान कर सकते हैं।',
      },
    ],
  },
  {
    id: 'find-booth',
    index: 3,
    icon: 'MapPin',
    title: {
      en: 'Find your polling booth',
      hi: 'अपना मतदान केंद्र खोजें',
    },
    description: {
      en: 'A few weeks before the election, search your name on the ECI electoral roll. Note your polling booth address, your part number, and your serial number — these speed up booth officials when you arrive. Voter slips are distributed by BLOs, but they are not mandatory ID anymore (since 2019).',
      hi: 'चुनाव से कुछ सप्ताह पहले, ECI मतदाता सूची में अपना नाम खोजें। अपने मतदान केंद्र का पता, भाग संख्या और क्रम संख्या नोट करें — ये बूथ अधिकारियों के काम को तेज़ करते हैं।',
    },
    actions: [
      {
        label: { en: 'Search electoral roll', hi: 'मतदाता सूची में खोजें' },
        href: 'https://electoralsearch.eci.gov.in/',
      },
    ],
    tips: [
      {
        en: 'Polling booths are usually within 2 km of your registered address.',
        hi: 'मतदान केंद्र आमतौर पर आपके पंजीकृत पते के 2 किमी के भीतर होते हैं।',
      },
    ],
  },
  {
    id: 'vote',
    index: 4,
    icon: 'Vote',
    title: {
      en: 'Cast your vote',
      hi: 'अपना वोट डालें',
    },
    description: {
      en: 'Reach the booth between 7am and 6pm with your EPIC or alternative ID. The Presiding Officer verifies your identity, your finger is marked with indelible ink, and you sign the register. Inside the polling compartment, press the button next to your candidate on the EVM. Watch for the VVPAT slip — it confirms your vote was recorded correctly.',
      hi: 'अपने EPIC या वैकल्पिक पहचान पत्र के साथ सुबह 7 से शाम 6 बजे के बीच बूथ पहुँचें। पीठासीन अधिकारी आपकी पहचान की पुष्टि करते हैं, आपकी उंगली पर अमिट स्याही लगती है। मतदान कक्ष में, EVM पर अपने उम्मीदवार के बगल में बटन दबाएँ। VVPAT पर्ची देखें — यह पुष्टि करती है कि आपका वोट सही दर्ज हुआ।',
    },
    actions: [],
    tips: [
      {
        en: 'If none of the candidates appeals to you, the last button is NOTA — None Of The Above.',
        hi: 'यदि कोई भी उम्मीदवार आपको पसंद नहीं है, तो अंतिम बटन NOTA है — उपरोक्त में से कोई नहीं।',
      },
      {
        en: 'Mobile phones, cameras, and any electronic devices are not allowed inside the booth.',
        hi: 'बूथ के अंदर मोबाइल फोन, कैमरा और किसी भी इलेक्ट्रॉनिक उपकरण की अनुमति नहीं है।',
      },
    ],
  },
  {
    id: 'verify-results',
    index: 5,
    icon: 'TrendingUp',
    title: {
      en: 'Track results',
      hi: 'परिणाम देखें',
    },
    description: {
      en: 'On counting day, results are streamed live on the ECI Results Portal. Counting starts at 8am, with postal ballots counted first. VVPAT slips from 5 random booths per assembly segment are matched against EVM totals to verify accuracy. The Returning Officer formally declares the winner and issues the certificate of election.',
      hi: 'मतगणना दिवस पर, परिणाम ECI रिजल्ट पोर्टल पर लाइव दिखाए जाते हैं। मतगणना सुबह 8 बजे शुरू होती है, पहले डाक मतपत्र। प्रति विधानसभा क्षेत्र 5 यादृच्छिक बूथों की VVPAT पर्चियाँ EVM कुल से मिलाई जाती हैं।',
    },
    actions: [
      {
        label: { en: 'ECI results portal', hi: 'ECI परिणाम पोर्टल' },
        href: 'https://results.eci.gov.in/',
      },
    ],
    tips: [
      {
        en: 'Most Lok Sabha results are clear by evening; close races may take till midnight.',
        hi: 'अधिकांश लोकसभा परिणाम शाम तक स्पष्ट हो जाते हैं; नज़दीकी मुकाबले आधी रात तक जा सकते हैं।',
      },
    ],
  },
];
