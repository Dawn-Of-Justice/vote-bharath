/**
 * The 8 canonical phases of an Indian general election cycle, as administered
 * by the Election Commission of India (ECI). Sourced from the Conduct of
 * Elections Rules, 1961 and ECI's general election handbook.
 *
 * Each phase is bilingual {en, hi} so the timeline UI can render in either
 * language without an extra translation step.
 */

export type Bilingual = { en: string; hi: string };

export interface TimelinePhase {
  id: string;
  index: number;
  icon: string; // lucide-react icon name
  title: Bilingual;
  duration: Bilingual;
  summary: Bilingual;
  details: Bilingual;
  keyActors: Bilingual; // comma-separated
}

export const timeline: TimelinePhase[] = [
  {
    id: 'announcement',
    index: 1,
    icon: 'Megaphone',
    title: {
      en: 'Election announcement',
      hi: 'चुनाव की घोषणा',
    },
    duration: {
      en: 'Day 0',
      hi: 'दिन 0',
    },
    summary: {
      en: 'The Election Commission of India announces the schedule.',
      hi: 'भारत का चुनाव आयोग कार्यक्रम की घोषणा करता है।',
    },
    details: {
      en: 'The Chief Election Commissioner holds a press conference announcing poll dates, number of phases, and the day results will be declared. The Model Code of Conduct (MCC) comes into effect immediately, restricting governments from announcing new schemes that could influence voters.',
      hi: 'मुख्य चुनाव आयुक्त एक प्रेस कॉन्फ्रेंस आयोजित करते हैं जिसमें मतदान की तिथियाँ, चरणों की संख्या और परिणाम घोषित होने का दिन बताया जाता है। आदर्श आचार संहिता (MCC) तुरंत लागू हो जाती है, जो सरकारों को नई योजनाओं की घोषणा से रोकती है।',
    },
    keyActors: {
      en: 'Election Commission of India, Chief Election Commissioner',
      hi: 'भारत का चुनाव आयोग, मुख्य चुनाव आयुक्त',
    },
  },
  {
    id: 'notification',
    index: 2,
    icon: 'FileText',
    title: {
      en: 'Notification of election',
      hi: 'चुनाव की अधिसूचना',
    },
    duration: {
      en: '~2 weeks before nomination deadline',
      hi: 'नामांकन की अंतिम तिथि से ~2 सप्ताह पहले',
    },
    summary: {
      en: 'The President or Governor formally notifies each constituency.',
      hi: 'राष्ट्रपति या राज्यपाल औपचारिक रूप से प्रत्येक निर्वाचन क्षेत्र को अधिसूचित करते हैं।',
    },
    details: {
      en: 'A formal notification is published in the official Gazette, opening the constituency for nominations. Returning Officers (ROs) are appointed for each constituency. The notification triggers the start of the official campaign period.',
      hi: 'आधिकारिक राजपत्र में एक औपचारिक अधिसूचना प्रकाशित की जाती है, जिससे निर्वाचन क्षेत्र नामांकन के लिए खुल जाता है। प्रत्येक निर्वाचन क्षेत्र के लिए रिटर्निंग ऑफिसर (RO) नियुक्त किए जाते हैं।',
    },
    keyActors: {
      en: 'President / Governor, Returning Officers',
      hi: 'राष्ट्रपति / राज्यपाल, रिटर्निंग ऑफिसर',
    },
  },
  {
    id: 'nomination',
    index: 3,
    icon: 'UserPlus',
    title: {
      en: 'Filing of nominations',
      hi: 'नामांकन दाखिल करना',
    },
    duration: {
      en: '7 days from notification',
      hi: 'अधिसूचना से 7 दिन',
    },
    summary: {
      en: 'Candidates submit nomination papers with deposits and affidavits.',
      hi: 'उम्मीदवार जमा राशि और शपथ पत्र के साथ नामांकन पत्र जमा करते हैं।',
    },
    details: {
      en: 'Each candidate files Form 2A (Lok Sabha) or 2B (Vidhan Sabha) with the Returning Officer, along with an affidavit (Form 26) declaring assets, liabilities, criminal cases, and educational qualifications. Security deposit: ₹25,000 for Lok Sabha (₹12,500 for SC/ST), ₹10,000 for state assemblies (₹5,000 for SC/ST).',
      hi: 'प्रत्येक उम्मीदवार रिटर्निंग ऑफिसर के पास फॉर्म 2A (लोकसभा) या 2B (विधानसभा) दाखिल करता है, साथ ही एक शपथ पत्र (फॉर्म 26) जिसमें संपत्ति, देनदारियाँ, आपराधिक मामले और शैक्षिक योग्यताएँ घोषित की जाती हैं।',
    },
    keyActors: {
      en: 'Candidates, Returning Officers, proposers',
      hi: 'उम्मीदवार, रिटर्निंग ऑफिसर, प्रस्तावक',
    },
  },
  {
    id: 'scrutiny',
    index: 4,
    icon: 'CheckCircle2',
    title: {
      en: 'Scrutiny of nominations',
      hi: 'नामांकनों की जाँच',
    },
    duration: {
      en: '1 day after nomination closes',
      hi: 'नामांकन बंद होने के 1 दिन बाद',
    },
    summary: {
      en: 'The RO verifies all submitted nomination papers.',
      hi: 'RO सभी जमा नामांकन पत्रों की पुष्टि करता है।',
    },
    details: {
      en: 'The Returning Officer scrutinizes each nomination paper for compliance with the Representation of the People Act, 1951. Common rejection reasons include incomplete affidavits, disqualified candidates, or inadequate proposers. Rejected candidates can challenge through election petitions, but only post-results.',
      hi: 'रिटर्निंग ऑफिसर जन प्रतिनिधित्व अधिनियम, 1951 के अनुपालन के लिए प्रत्येक नामांकन पत्र की जाँच करता है। अस्वीकृति के सामान्य कारणों में अधूरे शपथ पत्र, अयोग्य उम्मीदवार या अपर्याप्त प्रस्तावक शामिल हैं।',
    },
    keyActors: {
      en: 'Returning Officer, candidates',
      hi: 'रिटर्निंग ऑफिसर, उम्मीदवार',
    },
  },
  {
    id: 'withdrawal',
    index: 5,
    icon: 'UserMinus',
    title: {
      en: 'Withdrawal of candidatures',
      hi: 'उम्मीदवारी वापसी',
    },
    duration: {
      en: '2 days after scrutiny',
      hi: 'जाँच के 2 दिन बाद',
    },
    summary: {
      en: 'Candidates may voluntarily withdraw before the final list is published.',
      hi: 'अंतिम सूची प्रकाशित होने से पहले उम्मीदवार स्वेच्छा से नाम वापस ले सकते हैं।',
    },
    details: {
      en: 'After withdrawal closes, the RO publishes the final list of contesting candidates and assigns symbols. National party candidates get reserved symbols; independents and unrecognized parties choose from the ECI free-symbols list.',
      hi: 'वापसी बंद होने के बाद, RO चुनाव लड़ने वाले उम्मीदवारों की अंतिम सूची प्रकाशित करता है और प्रतीक आवंटित करता है। राष्ट्रीय पार्टियों को आरक्षित प्रतीक मिलते हैं।',
    },
    keyActors: {
      en: 'Candidates, Returning Officer',
      hi: 'उम्मीदवार, रिटर्निंग ऑफिसर',
    },
  },
  {
    id: 'campaign',
    index: 6,
    icon: 'Users',
    title: {
      en: 'Campaign period',
      hi: 'प्रचार अवधि',
    },
    duration: {
      en: '~14 days, ends 48hrs before polling',
      hi: '~14 दिन, मतदान से 48 घंटे पहले समाप्त',
    },
    summary: {
      en: 'Candidates campaign within ECI expenditure limits.',
      hi: 'उम्मीदवार ECI व्यय सीमा के भीतर प्रचार करते हैं।',
    },
    details: {
      en: 'Lok Sabha candidates can spend up to ₹95 lakh per constituency (₹75 lakh in smaller states/UTs). All campaigning must stop 48 hours before polling — this "silence period" is enforced strictly. The Model Code of Conduct governs all party and government activity.',
      hi: 'लोकसभा उम्मीदवार प्रति निर्वाचन क्षेत्र ₹95 लाख तक खर्च कर सकते हैं। मतदान से 48 घंटे पहले सभी प्रचार बंद हो जाना चाहिए — इस "मौन अवधि" का सख्ती से पालन कराया जाता है।',
    },
    keyActors: {
      en: 'Candidates, political parties, ECI observers',
      hi: 'उम्मीदवार, राजनीतिक दल, ECI पर्यवेक्षक',
    },
  },
  {
    id: 'polling',
    index: 7,
    icon: 'Vote',
    title: {
      en: 'Polling day',
      hi: 'मतदान दिवस',
    },
    duration: {
      en: '1 day per phase, 7am–6pm',
      hi: 'प्रति चरण 1 दिन, सुबह 7 से शाम 6 बजे',
    },
    summary: {
      en: 'Voters cast their vote on Electronic Voting Machines with VVPAT.',
      hi: 'मतदाता VVPAT के साथ इलेक्ट्रॉनिक वोटिंग मशीनों पर अपना वोट डालते हैं।',
    },
    details: {
      en: 'Voters present their EPIC card (or one of 11 alternative IDs) at the polling booth. After indelible ink is applied to the index finger, voters cast their vote on the EVM. The VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing the vote, visible for 7 seconds. Booth Level Officers and ECI observers monitor the day.',
      hi: 'मतदाता मतदान केंद्र पर अपना EPIC कार्ड (या 11 वैकल्पिक पहचान पत्रों में से एक) प्रस्तुत करते हैं। तर्जनी पर अमिट स्याही लगाने के बाद, मतदाता EVM पर अपना वोट डालते हैं। VVPAT एक पर्ची प्रिंट करता है जो 7 सेकंड के लिए दिखाई देती है।',
    },
    keyActors: {
      en: 'Voters, Presiding Officer, BLOs, ECI observers',
      hi: 'मतदाता, पीठासीन अधिकारी, BLO, ECI पर्यवेक्षक',
    },
  },
  {
    id: 'counting',
    index: 8,
    icon: 'BarChart3',
    title: {
      en: 'Counting and results',
      hi: 'मतगणना और परिणाम',
    },
    duration: {
      en: '1 day, usually weeks after final phase',
      hi: '1 दिन, आमतौर पर अंतिम चरण के सप्ताहों बाद',
    },
    summary: {
      en: 'Votes are counted in counting centres under heavy security.',
      hi: 'मतगणना केंद्रों में कड़ी सुरक्षा के बीच मतों की गिनती होती है।',
    },
    details: {
      en: 'Counting begins at 8am. Postal ballots are counted first, then EVM votes round by round. A random sample of VVPAT slips (5 per assembly segment) is matched against EVM totals. Results are declared as soon as a winner is mathematically certain. The RO issues the certificate of election to the winner.',
      hi: 'मतगणना सुबह 8 बजे शुरू होती है। पहले डाक मतपत्र गिने जाते हैं, फिर EVM वोट राउंड दर राउंड। प्रति विधानसभा क्षेत्र 5 VVPAT पर्चियों के यादृच्छिक नमूने का मिलान EVM कुल से किया जाता है।',
    },
    keyActors: {
      en: 'Counting Officers, candidates/agents, RO, ECI',
      hi: 'मतगणना अधिकारी, उम्मीदवार/एजेंट, RO, ECI',
    },
  },
];
