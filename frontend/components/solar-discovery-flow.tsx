"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { stateSubsidies } from "@/lib/calculators";
import { useLocale } from "@/components/locale-provider";

type FlowStep = 1 | 2 | 3 | 4 | 5;
type UseCase = "residential" | "commercial" | "industrial" | null;
type BillBand = "below-5000" | "5000-10000" | "10000-25000" | "25000-plus" | null;
type Ownership = "own" | "rented" | null;
type RoofType = "rcc" | "metal" | "open-land" | null;
type StateName = keyof typeof stateSubsidies | "";

const stateOptions = Object.keys(stateSubsidies).filter((state) => state !== "other") as Array<Exclude<StateName, "">>;

type FormState = {
  useCase: UseCase;
  billBand: BillBand;
  ownership: Ownership;
  roofType: RoofType;
  state: StateName;
  city: string;
  pincode: string;
};

export default function SolarDiscoveryFlow() {
  const { locale } = useLocale();
  const isHindi = locale === "hi";
  const [step, setStep] = useState<FlowStep>(1);
  const [useCase, setUseCase] = useState<UseCase>(null);
  const [billBand, setBillBand] = useState<BillBand>(null);
  const [ownership, setOwnership] = useState<Ownership>(null);
  const [roofType, setRoofType] = useState<RoofType>(null);
  const [state, setState] = useState<StateName>("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const formState: FormState = {
    useCase,
    billBand,
    ownership,
    roofType,
    state,
    city,
    pincode,
  };

  const copy = {
    eyebrow: isHindi ? "सोलर मैच खोजें" : "Find Your Match",
    title: isHindi ? "सोलर डिस्कवरी प्रक्रिया" : "Solar Discovery Flow",
    description: isHindi ? "कुछ तेज़ सवालों के जवाब देकर अपनी प्रॉपर्टी के लिए सबसे व्यावहारिक सोलर रास्ता खोजें।" : "Answer a few quick questions to find the most practical solar path for your property.",
    progress: isHindi ? "प्रगति" : "Progress",
    stepOf: isHindi ? (current: number) => `चरण ${current} / 5` : (current: number) => `Step ${current} of 5`,
    useCase: isHindi ? "उपयोग का प्रकार" : "Use case",
    billBand: isHindi ? "बिल बैंड" : "Bill band",
    property: isHindi ? "प्रॉपर्टी" : "Property",
    location: isHindi ? "स्थान" : "Location",
    result: isHindi ? "परिणाम" : "Result",
    step1Title: isHindi ? "आपका उपयोग-क्षेत्र क्या है?" : "What is your use case?",
    step2Title: isHindi ? "आपका बिजली बिल बैंड क्या है?" : "What is your electricity bill band?",
    step3Title: isHindi ? "प्रॉपर्टी के बारे में बताएं" : "Tell us about the property",
    step4Title: isHindi ? "प्रॉपर्टी कहाँ स्थित है?" : "Where is the property located?",
    step5Title: isHindi ? "आपकी सिफारिश" : "Your recommendation",
    step5Note: isHindi ? "आपके चुने गए बिल बैंड और प्रॉपर्टी विवरण के आधार पर।" : "Based on your bill band and the property details you selected.",
    validation: {
      useCase: isHindi ? "आगे बढ़ने के लिए एक उपयोग-क्षेत्र चुनें।" : "Select a use case to continue.",
      billBand: isHindi ? "अपना बिजली बिल बैंड चुनें।" : "Select your electricity bill band.",
      ownership: isHindi ? "स्वामित्व स्थिति चुनें।" : "Select ownership status.",
      roofType: isHindi ? "छत का प्रकार चुनें।" : "Select roof type.",
      state: isHindi ? "एक राज्य चुनें।" : "Choose a state.",
      city: isHindi ? "अपना शहर दर्ज करें।" : "Enter your city.",
      pincode: isHindi ? "मान्य 6-अंकीय पिनकोड दर्ज करें।" : "Enter a valid 6-digit pincode.",
    },
    useCases: isHindi
      ? [
          { id: "residential", label: "आवासीय", desc: "घर, अपार्टमेंट, पारिवारिक संपत्ति", icon: "🏠" },
          { id: "commercial", label: "वाणिज्यिक", desc: "ऑफ़िस, दुकान, खुदरा स्थान", icon: "🏢" },
          { id: "industrial", label: "औद्योगिक", desc: "फैक्ट्री, प्लांट, वेयरहाउस", icon: "🏭" },
        ]
      : [
          { id: "residential", label: "Residential", desc: "Home, apartment, family property", icon: "🏠" },
          { id: "commercial", label: "Commercial", desc: "Office, shop, retail site", icon: "🏢" },
          { id: "industrial", label: "Industrial", desc: "Factory, plant, warehouse", icon: "🏭" },
        ],
    billOptions: isHindi
      ? [
          { id: "below-5000", label: "₹5,000 से कम", hint: "छोटा घर या हल्का लोड", value: 3500 },
          { id: "5000-10000", label: "₹5,000 से ₹10,000", hint: "सामान्य आवासीय या छोटा कार्यालय", value: 7500 },
          { id: "10000-25000", label: "₹10,000 से ₹25,000", hint: "बड़ा घर या बढ़ता व्यवसाय", value: 17500 },
          { id: "25000-plus", label: "₹25,000+", hint: "वाणिज्यिक या औद्योगिक लोड", value: 35000 },
        ]
      : [
          { id: "below-5000", label: "Below Rs. 5,000", hint: "Small home or light load", value: 3500 },
          { id: "5000-10000", label: "Rs. 5,000 to Rs. 10,000", hint: "Typical residential or small office", value: 7500 },
          { id: "10000-25000", label: "Rs. 10,000 to Rs. 25,000", hint: "Large home or growing business", value: 17500 },
          { id: "25000-plus", label: "Rs. 25,000+", hint: "Commercial or industrial load", value: 35000 },
        ],
    ownership: isHindi
      ? [
          { id: "own", label: "स्वयं की प्रॉपर्टी" },
          { id: "rented", label: "किराये की प्रॉपर्टी" },
        ]
      : [
          { id: "own", label: "Own Property" },
          { id: "rented", label: "Rented Property" },
        ],
    roofType: isHindi
      ? [
          { id: "rcc", label: "RCC छत" },
          { id: "metal", label: "मेटल छत" },
          { id: "open-land", label: "खुली ज़मीन" },
        ]
      : [
          { id: "rcc", label: "RCC Roof" },
          { id: "metal", label: "Metal Roof" },
          { id: "open-land", label: "Open Land" },
        ],
    recommendationLabels: {
      systemType: isHindi ? "अनुशंसित सिस्टम प्रकार" : "Recommended System Type",
      estimatedCapacity: isHindi ? "अनुमानित क्षमता" : "Estimated Capacity",
      panelRecommendation: isHindi ? "पैनल सुझाव" : "Panel Recommendation",
      financingSuggestion: isHindi ? "फाइनेंसिंग सुझाव" : "Financing Suggestion",
      resultLabel: isHindi ? "आपकी सिफारिश" : "Your recommendation",
      buttons: {
        getProposal: isHindi ? "प्रस्ताव प्राप्त करें" : "Get Proposal",
        comparePanels: isHindi ? "पैनल तुलना करें" : "Compare Panels",
        talkToExpert: isHindi ? "विशेषज्ञ से बात करें" : "Talk To Expert",
        previous: isHindi ? "पिछला" : "Previous",
        next: isHindi ? "अगला" : "Next",
        viewResults: isHindi ? "परिणाम देखें" : "View Results",
        restart: isHindi ? "फिर शुरू करें" : "Restart",
      },
    },
  } as const;

  const getBillLabel = (band: BillBand) => copy.billOptions.find((option) => option.id === band)?.label || "";
  const getBillValue = (band: BillBand) => copy.billOptions.find((option) => option.id === band)?.value || 0;

  const validateStep = (currentStep: FlowStep, data: FormState) => {
    if (currentStep === 1) {
      return data.useCase ? [] : [copy.validation.useCase];
    }

    if (currentStep === 2) {
      return data.billBand ? [] : [copy.validation.billBand];
    }

    if (currentStep === 3) {
      const errors: string[] = [];

      if (!data.ownership) errors.push(copy.validation.ownership);
      if (!data.roofType) errors.push(copy.validation.roofType);

      return errors;
    }

    if (currentStep === 4) {
      const errors: string[] = [];

      if (!data.state) errors.push(copy.validation.state);
      if (!data.city.trim()) errors.push(copy.validation.city);
      if (!/^\d{6}$/.test(data.pincode.trim())) errors.push(copy.validation.pincode);

      return errors;
    }

    return [];
  };

  const validationErrors = validateStep(step, formState);
  const canContinue = validationErrors.length === 0;

  const resetFlow = () => {
    setStep(1);
    setUseCase(null);
    setBillBand(null);
    setOwnership(null);
    setRoofType(null);
    setState("");
    setCity("");
    setPincode("");
  };

  const goBack = () => {
    setStep((current) => (Math.max(1, current - 1) as FlowStep));
  };

  const goNext = () => {
    if (!canContinue) return;
    setStep((current) => (Math.min(5, current + 1) as FlowStep));
  };

  const recommendation = (() => {
    if (!useCase || !billBand || !ownership || !roofType || !state || !city.trim() || !/^\d{6}$/.test(pincode.trim())) {
      return null;
    }

    const billValue = getBillValue(billBand);
    const useCaseFactor = useCase === "commercial" ? 1.18 : useCase === "industrial" ? 1.45 : 1;
    const roofFactor = roofType === "open-land" ? 1.35 : roofType === "metal" ? 1.08 : 1;
    const estimatedCapacity = Math.max(1.5, (billValue / 2500) * useCaseFactor * roofFactor);

    const systemType =
      roofType === "open-land"
        ? isHindi ? "ग्राउंड-माउंटेड सोलर" : "Ground Mounted Solar"
        : useCase === "industrial"
          ? isHindi ? "औद्योगिक हाइब्रिड सोलर" : "Industrial Hybrid Solar"
          : ownership === "rented"
            ? isHindi ? "लचीला रूफटॉप सोलर" : "Flexible Rooftop Solar"
            : isHindi ? "ऑन-ग्रिड रूफटॉप सोलर" : "On-Grid Rooftop Solar";

    const panelRecommendation =
      useCase === "industrial"
        ? isHindi ? "उच्च-वॉट बाइफेशियल मॉड्यूल" : "High-wattage bifacial modules"
        : useCase === "commercial"
          ? isHindi ? "उच्च-दक्षता वाले मोनो PERC पैनल" : "High-efficiency mono PERC panels"
          : isHindi ? "प्रीमियम 540-560W रूफटॉप मॉड्यूल" : "Premium 540-560W rooftop modules";

    const financingSuggestion =
      ownership === "rented"
        ? isHindi ? "लीज़-फ्रेंडली EMI या मकान-मालिक-अनुमोदित फाइनेंसिंग" : "Lease-friendly EMI or landlord-approved financing"
        : billBand === "25000-plus"
          ? isHindi ? "तेज़ पेबैक वाली प्रोजेक्ट EMI" : "Project EMI with faster payback"
          : isHindi ? "सब्सिडी-आधारित फाइनेंसिंग और आसान मासिक EMI" : "Subsidy-led financing with manageable monthly EMIs";

    const subsidyNote =
      useCase === "residential" && ownership === "own"
        ? isHindi ? "आवासीय खरीदार सब्सिडी-आधारित मूल्य मार्गदर्शन के लिए पात्र हो सकते हैं।" : "Residential buyers may qualify for subsidy-led pricing guidance."
        : isHindi ? "प्रोजेक्ट-स्तर की सब्सिडी और ROI अनुमान के लिए कैलकुलेटर का उपयोग करें।" : "Use the calculator for a project-level subsidy and ROI estimate.";

    return {
      systemType,
      estimatedCapacity,
      panelRecommendation,
      financingSuggestion,
      subsidyNote,
      billLabel: getBillLabel(billBand),
    };
  })();

  return (
    <section id="discovery" className="mx-auto mt-20 w-full max-w-7xl px-4 md:px-8">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">{copy.eyebrow}</p>
        <h2 className="mt-3 font-serif text-3xl text-slate-900 md:text-4xl">{copy.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{copy.description}</p>
      </div>

      <div className="mx-auto mb-10 max-w-4xl rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_42px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{copy.progress}</p>
            <p className="mt-1 text-sm text-slate-600">{copy.stepOf(step)}</p>
          </div>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 md:mx-6">
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-5">
          <span className={step >= 1 ? "text-emerald-600" : ""}>{copy.useCase}</span>
          <span className={step >= 2 ? "text-emerald-600" : ""}>{copy.billBand}</span>
          <span className={step >= 3 ? "text-emerald-600" : ""}>{copy.property}</span>
          <span className={step >= 4 ? "text-emerald-600" : ""}>{copy.location}</span>
          <span className={step >= 5 ? "text-emerald-600" : ""}>{copy.result}</span>
        </div>
      </div>

      {step === 1 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">{copy.step1Title}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {copy.useCases.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setUseCase(option.id as UseCase)}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  useCase === option.id ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{option.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{option.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">{copy.step2Title}</h3>
          <div className="mt-6 grid gap-4">
            {copy.billOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setBillBand(option.id as BillBand)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  billBand === option.id ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{option.label}</p>
                    <p className="text-sm text-slate-600">{option.hint}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 ${billBand === option.id ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">{copy.step3Title}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{isHindi ? "स्वामित्व" : "Ownership"}</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {copy.ownership.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setOwnership(option.id as Ownership)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      ownership === option.id ? "border-emerald-500 bg-white text-slate-900 shadow-sm" : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{isHindi ? "छत का प्रकार" : "Roof type"}</p>
              <div className="mt-3 grid gap-3">
                {copy.roofType.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRoofType(option.id as RoofType)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                      roofType === option.id ? "border-emerald-500 bg-white text-slate-900 shadow-sm" : "border-slate-200 bg-white/80 text-slate-600 hover:border-emerald-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-xl font-semibold text-slate-900">{copy.step4Title}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{isHindi ? "राज्य" : "State"}</span>
              <select
                value={state}
                onChange={(event) => setState(event.target.value as StateName)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">{isHindi ? "राज्य चुनें" : "Select state"}</option>
                {stateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{isHindi ? "शहर" : "City"}</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder={isHindi ? "शहर दर्ज करें" : "Enter city"}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">{isHindi ? "पिनकोड" : "Pincode"}</span>
              <input
                value={pincode}
                onChange={(event) => setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={isHindi ? "6-अंकीय पिनकोड" : "6-digit pincode"}
                inputMode="numeric"
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>

          {validationErrors.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {validationErrors[0]}
            </div>
          ) : null}
        </div>
      )}

      {step === 5 && recommendation && (
        <div className="mx-auto max-w-4xl rounded-[30px] border border-emerald-200 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <h3 className="text-2xl font-semibold text-slate-900">{copy.step5Title}</h3>
          <p className="mt-2 text-sm text-slate-600">{copy.step5Note}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{copy.recommendationLabels.systemType}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{recommendation.systemType}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{copy.recommendationLabels.estimatedCapacity}</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-700">{recommendation.estimatedCapacity.toFixed(1)} kW</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{copy.recommendationLabels.panelRecommendation}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{recommendation.panelRecommendation}</p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{copy.recommendationLabels.financingSuggestion}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{recommendation.financingSuggestion}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {recommendation.subsidyNote}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/calculator" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              {copy.recommendationLabels.buttons.getProposal}
              <ChevronRight className="h-5 w-5" />
            </Link>
            <Link href="/compare" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
              {copy.recommendationLabels.buttons.comparePanels}
            </Link>
            <Link href="/more/contact-us" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">
              {copy.recommendationLabels.buttons.talkToExpert}
            </Link>
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {step > 1 && (
          <button type="button" onClick={goBack} className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100">
            {copy.recommendationLabels.buttons.previous}
          </button>
        )}
        {step < 4 && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition ${
              canContinue ? "bg-emerald-500 text-white hover:bg-emerald-600" : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            {copy.recommendationLabels.buttons.next}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {step === 4 && (
          <button
            type="button"
            onClick={() => setStep(5)}
            disabled={!canContinue}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 font-medium transition ${
              canContinue ? "bg-emerald-500 text-white hover:bg-emerald-600" : "cursor-not-allowed bg-slate-200 text-slate-500"
            }`}
          >
            {copy.recommendationLabels.buttons.viewResults}
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {(step === 5 || (step > 1 && !canContinue)) && (
          <button type="button" onClick={resetFlow} className="rounded-lg border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:bg-slate-100">
            {copy.recommendationLabels.buttons.restart}
          </button>
        )}
      </div>
    </section>
  );
}
