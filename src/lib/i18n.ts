import type { LocaleDictionary } from "@/lib/types";

const dictionaries: Record<"en-IN" | "hi-IN", LocaleDictionary> = {
  "en-IN": {
    appName: "AI Bazaar",
    tagline: "Find the right AI model or tool with clear, practical guidance.",
    searchPlaceholder:
      "Try: best video gen tools for 10s ads, best SVG generators, cheapest coding models",
    compareTitle: "Granular Compare Matrix",
    whatChanged: "What Changed This Week",
    trendingIntents: "Trending intents",
    bestFor: "Best for",
    limitations: "Limitations",
    quickstart: "Quickstart",
    avoidWhen: "Use carefully when",
    reviews: "Community reviews",
    noResults: "No matches yet. Try a broader query.",
    builder: "Builder",
    business: "Business",
    research: "Research",
  },
  "hi-IN": {
    appName: "एआई बाज़ार",
    tagline: "सही AI मॉडल या टूल चुनें, स्पष्ट और व्यावहारिक मार्गदर्शन के साथ।",
    searchPlaceholder:
      "उदाहरण: 10 सेकंड विज्ञापन के लिए वीडियो टूल, SVG जनरेटर, सस्ते कोडिंग मॉडल",
    compareTitle: "विस्तृत तुलना मैट्रिक्स",
    whatChanged: "इस सप्ताह क्या बदला",
    trendingIntents: "ट्रेंडिंग इंटेंट",
    bestFor: "सबसे अच्छा उपयोग",
    limitations: "सीमाएँ",
    quickstart: "त्वरित शुरुआत",
    avoidWhen: "सावधानी कब रखें",
    reviews: "समुदाय समीक्षाएँ",
    noResults: "कोई परिणाम नहीं मिला। थोड़ा व्यापक खोजें।",
    builder: "बिल्डर",
    business: "बिज़नेस",
    research: "रिसर्च",
  },
};

export const resolveLocale = (value?: string): "en-IN" | "hi-IN" => {
  if (value === "hi-IN") return "hi-IN";
  return "en-IN";
};

export const dictionaryFor = (locale?: string) =>
  dictionaries[resolveLocale(locale)];
