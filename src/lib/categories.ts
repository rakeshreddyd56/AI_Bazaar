export const categoryDefinitions = [
  {
    slug: "all",
    label: { "en-IN": "All", "hi-IN": "सभी" },
  },
  {
    slug: "ai-avatars-talking-heads",
    label: { "en-IN": "AI Avatars & Talking Heads", "hi-IN": "एआई अवतार और टॉकिंग हेड्स" },
  },
  {
    slug: "video-generation",
    label: { "en-IN": "Video Generation", "hi-IN": "वीडियो जनरेशन" },
  },
  {
    slug: "image-generation-design",
    label: { "en-IN": "Image Generation & Design", "hi-IN": "इमेज जनरेशन और डिज़ाइन" },
  },
  {
    slug: "svg-vector-brand-design",
    label: { "en-IN": "SVG / Vector / Brand Design", "hi-IN": "एसवीजी / वेक्टर / ब्रांड डिज़ाइन" },
  },
  {
    slug: "voice-tts-voice-cloning",
    label: { "en-IN": "Voice: TTS & Voice Cloning", "hi-IN": "वॉइस: टीटीएस और वॉइस क्लोनिंग" },
  },
  {
    slug: "speech-stt-translation-dubbing",
    label: { "en-IN": "Speech: STT / Translation / Dubbing", "hi-IN": "स्पीच: एसटीटी / ट्रांसलेशन / डबिंग" },
  },
  {
    slug: "music-sound-fx",
    label: { "en-IN": "Music & Sound FX", "hi-IN": "म्यूजिक और साउंड एफएक्स" },
  },
  {
    slug: "llm-foundation-models",
    label: { "en-IN": "LLM Foundation Models", "hi-IN": "एलएलएम फाउंडेशन मॉडल्स" },
  },
  {
    slug: "coding-models",
    label: { "en-IN": "Coding Models", "hi-IN": "कोडिंग मॉडल्स" },
  },
  {
    slug: "agent-frameworks",
    label: { "en-IN": "Agent Frameworks", "hi-IN": "एजेंट फ्रेमवर्क्स" },
  },
  {
    slug: "search-rag-apis",
    label: { "en-IN": "Search / RAG APIs", "hi-IN": "सर्च / आरएजी एपीआई" },
  },
  {
    slug: "website-app-builders",
    label: { "en-IN": "Website/App Builders", "hi-IN": "वेबसाइट/ऐप बिल्डर्स" },
  },
  {
    slug: "workflow-automation-agents",
    label: { "en-IN": "Workflow Automation Agents", "hi-IN": "वर्कफ़्लो ऑटोमेशन एजेंट्स" },
  },
  {
    slug: "eval-observability-safety",
    label: { "en-IN": "Eval / Observability / Safety", "hi-IN": "इवैल / ऑब्ज़र्वेबिलिटी / सेफ्टी" },
  },
  {
    slug: "inference-hosting-platforms",
    label: { "en-IN": "Inference & Hosting Platforms", "hi-IN": "इन्फरेंस और होस्टिंग प्लेटफ़ॉर्म्स" },
  },
  {
    slug: "data-synthetic-data",
    label: { "en-IN": "Data & Synthetic Data", "hi-IN": "डेटा और सिंथेटिक डेटा" },
  },
] as const;

export type CategorySlug = (typeof categoryDefinitions)[number]["slug"];

const categorySet = new Set<string>(categoryDefinitions.map((entry) => entry.slug));

export const isCategorySlug = (value?: string): value is CategorySlug => {
  if (!value) return false;
  return categorySet.has(value);
};

export const categoryLabel = (slug: CategorySlug, locale: "en-IN" | "hi-IN") => {
  const found = categoryDefinitions.find((entry) => entry.slug === slug);
  if (!found) return slug;
  return found.label[locale];
};
