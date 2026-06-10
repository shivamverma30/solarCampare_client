export type BlogPostCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageClassName: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HowItWorksStep = {
  key: string;
  title: string;
  description: string;
};

const moreContentByLocale = {
  en: {
    aboutOverview: {
      companyOverview:
        "Solar Compare is an India-focused solar marketplace platform that helps homeowners and businesses evaluate solar feasibility, compare quality equipment options, and connect with verified vendors through transparent workflows.",
      mission: "To simplify the solar buying journey with trustworthy data, practical guidance, and accountable execution support.",
      vision: "To become the most trusted digital decision platform for distributed solar adoption across Indian cities and growth regions.",
    },
    whyChooseSolarCompare: [
      "Verified vendor ecosystem with quality screening and service-area mapping.",
      "Calculator-led discovery so users understand savings, subsidy, and payback before taking action.",
      "Structured lead and notification workflows that improve response quality and turnaround.",
      "Transparent, practical guidance built for real Indian tariff and policy conditions.",
    ],
    homeownerBenefits: [
      "Understand likely monthly savings before speaking to vendors.",
      "Compare panel options and financing paths without sales pressure.",
      "Get proposal support with clear subsidy and investment visibility.",
      "Track follow-ups and consultation progress from a single account view.",
    ],
    businessBenefits: [
      "Evaluate energy cost reduction opportunities for offices, factories, and commercial rooftops.",
      "Assess capex versus financing models using practical EMI and ROI outputs.",
      "Share structured requirements to reduce back-and-forth during procurement.",
      "Route qualified enquiries to vendors aligned with project geography and scale.",
    ],
    platformStats: [
      { label: "Vendor Service Areas Mapped", value: "250+" },
      { label: "Buyer Workflows Completed", value: "10,000+" },
      { label: "Solar Leads & Quote Intents", value: "4,000+" },
      { label: "States with Active User Interest", value: "20+" },
    ],
    blogPosts: [
      { slug: "solar-subsidy-guide", title: "Solar Subsidy Guide for Indian Homeowners", excerpt: "Understand central subsidy basics, eligibility patterns, and how subsidy changes impact your net investment planning.", category: "Policy", readTime: "6 min read", imageClassName: "from-emerald-500/80 via-emerald-600/80 to-teal-700/80" },
      { slug: "solar-panel-buying-guide", title: "Solar Panel Buying Guide: What Actually Matters", excerpt: "Learn how to compare panel efficiency, degradation, warranty terms, and brand reliability before finalizing procurement.", category: "Buying Guide", readTime: "8 min read", imageClassName: "from-sky-500/80 via-blue-600/80 to-indigo-700/80" },
      { slug: "net-metering-explained", title: "Net Metering Explained in Simple Terms", excerpt: "A clear walkthrough of export-import units, billing behavior, and why DISCOM rules matter in ROI planning.", category: "Explainer", readTime: "5 min read", imageClassName: "from-cyan-500/80 via-cyan-600/80 to-blue-700/80" },
      { slug: "residential-solar-roi", title: "Residential Solar ROI: How to Evaluate Payback", excerpt: "Use tariff, generation assumptions, subsidy and financing context to estimate realistic payback for home rooftops.", category: "ROI", readTime: "7 min read", imageClassName: "from-amber-500/80 via-orange-600/80 to-rose-700/80" },
      { slug: "commercial-solar-benefits", title: "Commercial Solar Benefits Beyond Electricity Savings", excerpt: "See how commercial installations improve operating margins, energy visibility, and long-term sustainability positioning.", category: "Commercial", readTime: "7 min read", imageClassName: "from-violet-500/80 via-fuchsia-600/80 to-pink-700/80" },
      { slug: "pm-surya-ghar-updates", title: "PM Surya Ghar Updates: What Buyers Should Track", excerpt: "Key updates to watch in subsidy communication, application sequencing, and documentation readiness for faster approval.", category: "Updates", readTime: "4 min read", imageClassName: "from-lime-500/80 via-green-600/80 to-emerald-700/80" },
    ],
    faqItems: [
      { question: "How much does a rooftop solar system cost in India?", answer: "Typical residential pricing varies by system size, panel type, inverter quality, and installation complexity. A common planning range is around INR 50,000-60,000 per kW before subsidy and financing adjustments." },
      { question: "Is subsidy available for all solar projects?", answer: "Subsidy is usually applicable to eligible residential categories and depends on the current policy framework. Commercial and industrial projects generally follow different economics focused on tariff savings and tax treatment." },
      { question: "What is net metering and why is it important?", answer: "Net metering allows exported solar electricity to be adjusted against imported units from the grid. It directly influences monthly bill reduction and should be factored into your payback estimate." },
      { question: "How long does solar installation take after approval?", answer: "For standard residential rooftops, installation typically takes a few days after site readiness and procurement. End-to-end timelines vary by vendor scheduling, local approvals, and utility processes." },
      { question: "How much maintenance does a solar plant require?", answer: "Routine cleaning, periodic electrical checks, and occasional preventive maintenance are usually sufficient. Most systems are low-maintenance but should be monitored for generation consistency." },
      { question: "What warranty coverage should I expect?", answer: "Panel products commonly include long performance warranties, while inverters and installation workmanship have separate warranty terms. Always review product and service warranties together." },
      { question: "Can I install solar on EMI financing?", answer: "Yes, financing options are available in many cases. EMI suitability depends on loan amount, interest rate, tenure, and your expected monthly savings from solar generation." },
      { question: "What is a normal payback period for rooftop solar?", answer: "Payback can vary by tariff, generation, subsidy eligibility, and financing structure. Many projects target a payback window in the mid single digits to low double digits depending on usage profile." },
    ],
    howItWorksSteps: [
      { key: "calculate", title: "Calculate Savings", description: "Enter your usage profile and location context to estimate system sizing, savings, subsidy, and payback potential." },
      { key: "compare", title: "Compare Quotes", description: "Review vendor quotes side-by-side so your shortlist is based on transparent price and technical comparisons." },
      { key: "financing", title: "Financing & Subsidy", description: "Explore financing options and government subsidy support tailored to your eligibility to understand net project cost." },
      { key: "vendor", title: "Choose Verified Vendor", description: "Select from pre-verified vendors who meet our quality and documentation standards for reliable execution." },
      { key: "install", title: "Install & Save", description: "Finalize execution, monitor generation, and begin realizing monthly savings and long-term return from your rooftop asset." },
    ],
  },
  hi: {
    aboutOverview: {
      companyOverview:
        "Solar Compare भारत-केंद्रित सोलर मार्केटप्लेस प्लेटफ़ॉर्म है, जो घरों और व्यवसायों को सोलर व्यवहार्यता आँकने, गुणवत्ता विकल्पों की तुलना करने और पारदर्शी वर्कफ़्लो के माध्यम से सत्यापित विक्रेताओं से जुड़ने में मदद करता है।",
      mission: "विश्वसनीय डेटा, व्यावहारिक मार्गदर्शन और जवाबदेह निष्पादन सहायता के साथ सोलर खरीद यात्रा को सरल बनाना।",
      vision: "भारतीय शहरों और विकासशील क्षेत्रों में वितरित सोलर अपनाने के लिए सबसे भरोसेमंद डिजिटल निर्णय प्लेटफ़ॉर्म बनना।",
    },
    whyChooseSolarCompare: [
      "गुणवत्ता जांच और सेवा-क्षेत्र मैपिंग के साथ सत्यापित विक्रेता नेटवर्क।",
      "कैलकुलेटर-आधारित खोज ताकि उपयोगकर्ता कार्रवाई से पहले बचत, सब्सिडी और पेबैक समझें।",
      "संरचित लीड और सूचना वर्कफ़्लो जो प्रतिक्रिया गुणवत्ता और गति बढ़ाते हैं।",
      "वास्तविक भारतीय टैरिफ और नीति परिस्थितियों पर आधारित पारदर्शी, व्यावहारिक मार्गदर्शन।",
    ],
    homeownerBenefits: [
      "विक्रेताओं से बात करने से पहले संभावित मासिक बचत समझें।",
      "बिना सेल्स प्रेशर के पैनल विकल्प और फाइनेंसिंग मार्गों की तुलना करें।",
      "स्पष्ट सब्सिडी और निवेश दृश्यता के साथ प्रस्ताव सहायता पाएँ।",
      "एक ही अकाउंट व्यू से फॉलो-अप और परामर्श प्रगति ट्रैक करें।",
    ],
    businessBenefits: [
      "ऑफ़िस, फैक्ट्री और कमर्शियल रूफटॉप के लिए ऊर्जा लागत घटाने के अवसर आँकें।",
      "व्यावहारिक EMI और ROI आउटपुट के साथ कैपेक्स बनाम फाइनेंसिंग मॉडल का मूल्यांकन करें।",
      "खरीद प्रक्रिया के दौरान बार-बार की बातचीत कम करने के लिए संरचित आवश्यकताएँ साझा करें।",
      "प्रोजेक्ट की भौगोलिक स्थिति और आकार के अनुसार योग्य पूछताछ विक्रेताओं तक पहुँचाएँ।",
    ],
    platformStats: [
      { label: "मैप किए गए विक्रेता सेवा क्षेत्र", value: "250+" },
      { label: "पूरा किए गए खरीदार वर्कफ़्लो", value: "10,000+" },
      { label: "सोलर लीड और कोटेशन इंटेंट", value: "4,000+" },
      { label: "सक्रिय रुचि वाले राज्य", value: "20+" },
    ],
    blogPosts: [
      { slug: "solar-subsidy-guide", title: "भारतीय गृहस्वामियों के लिए सोलर सब्सिडी गाइड", excerpt: "केंद्रीय सब्सिडी की मूल बातें, पात्रता पैटर्न और सब्सिडी बदलावों का आपके नेट निवेश पर प्रभाव समझें।", category: "नीति", readTime: "6 मिनट पढ़ें", imageClassName: "from-emerald-500/80 via-emerald-600/80 to-teal-700/80" },
      { slug: "solar-panel-buying-guide", title: "सोलर पैनल खरीद गाइड: वास्तव में क्या मायने रखता है", excerpt: "प्रोक्योरमेंट फाइनल करने से पहले पैनल दक्षता, गिरावट, वारंटी शर्तें और ब्रांड विश्वसनीयता की तुलना करना सीखें।", category: "खरीद गाइड", readTime: "8 मिनट पढ़ें", imageClassName: "from-sky-500/80 via-blue-600/80 to-indigo-700/80" },
      { slug: "net-metering-explained", title: "नेट मीटरिंग को सरल शब्दों में समझें", excerpt: "निर्यात-आयात इकाइयों, बिलिंग व्यवहार और ROI योजना में DISCOM नियमों के महत्व पर स्पष्ट मार्गदर्शन।", category: "व्याख्या", readTime: "5 मिनट पढ़ें", imageClassName: "from-cyan-500/80 via-cyan-600/80 to-blue-700/80" },
      { slug: "residential-solar-roi", title: "आवासीय सोलर ROI: पेबैक कैसे जाँचें", excerpt: "टैरिफ, उत्पादन मान्यताओं, सब्सिडी और फाइनेंसिंग संदर्भ के साथ घर की छत के लिए यथार्थवादी पेबैक का अनुमान लगाएँ।", category: "ROI", readTime: "7 मिनट पढ़ें", imageClassName: "from-amber-500/80 via-orange-600/80 to-rose-700/80" },
      { slug: "commercial-solar-benefits", title: "बिजली बचत से आगे कमर्शियल सोलर के लाभ", excerpt: "देखें कैसे कमर्शियल इंस्टॉलेशन ऑपरेटिंग मार्जिन, ऊर्जा दृश्यता और दीर्घकालिक स्थिरता को बेहतर बनाते हैं।", category: "कमर्शियल", readTime: "7 मिनट पढ़ें", imageClassName: "from-violet-500/80 via-fuchsia-600/80 to-pink-700/80" },
      { slug: "pm-surya-ghar-updates", title: "PM Surya Ghar अपडेट: खरीदारों को क्या ट्रैक करना चाहिए", excerpt: "सब्सिडी संचार, आवेदन क्रम और दस्तावेज़ तैयारी में तेज़ मंजूरी के लिए जरूरी अपडेट।", category: "अपडेट", readTime: "4 मिनट पढ़ें", imageClassName: "from-lime-500/80 via-green-600/80 to-emerald-700/80" },
    ],
    faqItems: [
      { question: "भारत में रूफटॉप सोलर सिस्टम की लागत कितनी होती है?", answer: "आवासीय मूल्य सिस्टम आकार, पैनल प्रकार, इन्वर्टर गुणवत्ता और इंस्टॉलेशन जटिलता पर निर्भर करते हैं। सब्सिडी और फाइनेंसिंग से पहले सामान्य योजना दायरा लगभग ₹50,000–₹60,000 प्रति kW होता है।" },
      { question: "क्या सभी सोलर परियोजनाओं के लिए सब्सिडी उपलब्ध है?", answer: "सब्सिडी आमतौर पर पात्र आवासीय श्रेणियों पर लागू होती है और वर्तमान नीति ढांचे पर निर्भर करती है। कमर्शियल और औद्योगिक परियोजनाएँ टैरिफ बचत और कर-प्रणाली पर आधारित अलग अर्थशास्त्र का पालन करती हैं।" },
      { question: "नेट मीटरिंग क्या है और यह क्यों महत्वपूर्ण है?", answer: "नेट मीटरिंग से ग्रिड से ली गई इकाइयों के विरुद्ध सौर निर्यात इकाइयाँ समायोजित की जा सकती हैं। यह मासिक बिल कमी को सीधे प्रभावित करती है और पेबैक अनुमान में शामिल होनी चाहिए।" },
      { question: "मंज़ूरी के बाद सोलर इंस्टॉलेशन में कितना समय लगता है?", answer: "मानक आवासीय छतों के लिए साइट तैयार होने और खरीद पूरी होने के बाद इंस्टॉलेशन आमतौर पर कुछ दिनों में हो जाता है। पूरी समय-सीमा विक्रेता शेड्यूल, स्थानीय मंज़ूरियों और यूटिलिटी प्रक्रियाओं पर निर्भर करती है।" },
      { question: "सोलर प्लांट को कितनी मेंटेनेंस चाहिए?", answer: "नियमित सफाई, समय-समय पर इलेक्ट्रिकल जाँच और कभी-कभार निवारक मेंटेनेंस आम तौर पर पर्याप्त होती है। अधिकांश सिस्टम कम-मेंटेनेंस होते हैं, लेकिन उत्पादन स्थिरता की निगरानी करनी चाहिए।" },
      { question: "मुझे कैसी वारंटी कवरेज उम्मीद करनी चाहिए?", answer: "पैनल उत्पादों में आमतौर पर लंबी परफ़ॉर्मेंस वारंटी होती है, जबकि इन्वर्टर और इंस्टॉलेशन वर्कमैनशिप की अलग शर्तें होती हैं। प्रोडक्ट और सेवा वारंटी को साथ में देखें।" },
      { question: "क्या मैं EMI फाइनेंसिंग पर सोलर लगा सकता हूँ?", answer: "हाँ, कई मामलों में फाइनेंसिंग उपलब्ध होती है। EMI उपयुक्तता ऋण राशि, ब्याज दर, अवधि और आपके अनुमानित मासिक सौर बचत पर निर्भर करती है।" },
      { question: "रूफटॉप सोलर का सामान्य पेबैक पीरियड क्या है?", answer: "पेबैक टैरिफ, उत्पादन, सब्सिडी पात्रता और फाइनेंसिंग संरचना के अनुसार बदल सकता है। कई परियोजनाएँ उपयोग प्रोफ़ाइल के अनुसार मध्य एकल-अंकीय से निम्न दोहरे-अंकीय वर्ष सीमा का लक्ष्य रखती हैं।" },
    ],
    howItWorksSteps: [
      { key: "calculate", title: "बचत की गणना", description: "अपने उपयोग प्रोफ़ाइल और स्थान की जानकारी दर्ज करें ताकि सिस्टम आकार, बचत, सब्सिडी और पेबैक क्षमता का अनुमान लगाया जा सके।" },
      { key: "compare", title: "कोटेशन की तुलना", description: "विक्रेता कोटेशन को साथ-साथ देखें ताकि आपकी शॉर्टलिस्ट पारदर्शी मूल्य और तकनीकी तुलना पर आधारित हो।" },
      { key: "financing", title: "फाइनेंसिंग और सब्सिडी", description: "अपनी पात्रता के अनुसार फाइनेंसिंग विकल्प और सरकारी सब्सिडी सहायता देखें ताकि नेट प्रोजेक्ट लागत समझी जा सके।" },
      { key: "vendor", title: "सत्यापित विक्रेता चुनें", description: "पूर्व-सत्यापित विक्रेताओं में से चुनें जो विश्वसनीय निष्पादन के लिए गुणवत्ता और दस्तावेज़ मानकों को पूरा करते हैं।" },
      { key: "install", title: "स्थापना और बचत", description: "निष्पादन पूरा करें, उत्पादन मॉनिटर करें और अपनी छत की संपत्ति से मासिक बचत व दीर्घकालिक लाभ शुरू करें।" },
    ],
  },
} as const;

const getLocaleContent = (locale: string) => (locale === "hi" ? moreContentByLocale.hi : moreContentByLocale.en);

export const getMoreContent = (locale: string) => getLocaleContent(locale);

export const aboutOverview = moreContentByLocale.en.aboutOverview;
export const whyChooseSolarCompare = moreContentByLocale.en.whyChooseSolarCompare;
export const homeownerBenefits = moreContentByLocale.en.homeownerBenefits;
export const businessBenefits = moreContentByLocale.en.businessBenefits;
export const platformStats = moreContentByLocale.en.platformStats;
export const blogPosts: readonly BlogPostCard[] = moreContentByLocale.en.blogPosts;
export const faqItems: readonly FaqItem[] = moreContentByLocale.en.faqItems;
export const howItWorksSteps: readonly HowItWorksStep[] = moreContentByLocale.en.howItWorksSteps;
