import type { Listing, Review } from "@/lib/types";

const now = new Date();

const isoDaysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const seedListings: Listing[] = [
  {
    id: "seedance-pro",
    slug: "seedance-pro",
    name: "Seedance Pro",
    summary: {
      "en-IN":
        "High-fidelity text-to-video model tuned for ad creatives and social cuts.",
      "hi-IN":
        "विज्ञापन क्रिएटिव और सोशल क्लिप्स के लिए उच्च-गुणवत्ता टेक्स्ट-टू-वीडियो मॉडल।",
    },
    modality: ["video", "image"],
    tags: ["video", "text-to-video", "ads", "social"],
    capabilities: {
      maxVideoDurationSec: 20,
      maxResolution: "1080p",
      fps: 30,
      cameraControl: true,
      batchGeneration: true,
      supportsImageToVideo: true,
    },
    limitations: [
      "Prompt adherence drops for multi-scene narratives.",
      "Can show temporal flicker in fast motion sequences.",
    ],
    benchmarks: {
      qualityElo: 87.2,
      promptFaithfulness: 82.8,
      temporalConsistency: 78.5,
    },
    pricingUsd: {
      inputPerM: 0.0,
      outputPerM: 0.0,
      monthly: 79,
    },
    quickstart: [
      {
        "en-IN": "Create API key and set webhook callback.",
        "hi-IN": "API key बनाएं और webhook callback सेट करें।",
      },
      {
        "en-IN": "Start with 6-10 second prompt for stable results.",
        "hi-IN": "स्थिर परिणाम के लिए 6-10 सेकंड का prompt उपयोग करें।",
      },
      {
        "en-IN": "Use reference image for consistent brand style.",
        "hi-IN": "ब्रांड शैली के लिए reference image जोड़ें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Short marketing videos with controlled camera movement.",
        "hi-IN": "कंट्रोल्ड कैमरा मूवमेंट वाले छोटे मार्केटिंग वीडियो।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "You need long-form narrative videos over 20 seconds.",
        "hi-IN": "जब 20 सेकंड से बड़े नैरेटिव वीडियो चाहिए।",
      },
    ],
    samples: [
      {
        type: "video",
        title: "Product launch reel",
        value: "10s / cinematic / neon product reveal",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.42,
      misuseTags: ["deepfake", "misinformation"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual+benchmark",
      sourceUrl: "https://www.swebench.com",
      fetchedAt: isoDaysAgo(1),
      lastVerifiedAt: isoDaysAgo(1),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(21),
    updatedAt: isoDaysAgo(1),
  },
  {
    id: "runway-gen-4",
    slug: "runway-gen-4",
    name: "Runway Gen-4",
    summary: {
      "en-IN":
        "Production-focused video generation suite with strong style transfer controls.",
      "hi-IN":
        "स्टाइल ट्रांसफर कंट्रोल के साथ प्रोडक्शन-केंद्रित वीडियो जनरेशन सूट।",
    },
    modality: ["video", "image"],
    tags: ["video", "cinematic", "editing"],
    capabilities: {
      maxVideoDurationSec: 16,
      maxResolution: "4K",
      fps: 24,
      cameraControl: true,
      supportsImageToVideo: true,
      timelineEditing: true,
    },
    limitations: [
      "Premium pricing for high resolution renders.",
      "Occasional style drift across retries.",
    ],
    benchmarks: {
      qualityElo: 86.1,
      promptFaithfulness: 80.3,
      temporalConsistency: 80.2,
    },
    pricingUsd: {
      monthly: 95,
    },
    quickstart: [
      {
        "en-IN": "Create project preset with aspect ratio before generation.",
        "hi-IN": "जनरेशन से पहले aspect ratio के साथ project preset बनाएं।",
      },
      {
        "en-IN": "Use style locks for frame-to-frame consistency.",
        "hi-IN": "frame consistency के लिए style lock उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Brand campaigns and polished cinematic clips.",
        "hi-IN": "ब्रांड कैंपेन और polished cinematic clips।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "You need low-cost high-volume generation.",
        "hi-IN": "जब कम लागत में बहुत अधिक generation चाहिए।",
      },
    ],
    samples: [
      { type: "video", title: "Travel montage", value: "16s / 4K / warm grain" },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.45,
      misuseTags: ["copyright", "deepfake"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual+catalog",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(2),
      lastVerifiedAt: isoDaysAgo(2),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(30),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: "veo-3",
    slug: "veo-3",
    name: "Veo 3",
    summary: {
      "en-IN": "Video generation model with robust realism and motion planning.",
      "hi-IN": "मजबूत यथार्थवाद और motion planning वाला वीडियो जनरेशन मॉडल।",
    },
    modality: ["video"],
    tags: ["video", "realism", "storyboard"],
    capabilities: {
      maxVideoDurationSec: 12,
      maxResolution: "1080p",
      fps: 24,
      cameraControl: true,
      supportsImageToVideo: false,
    },
    limitations: [
      "Limited clip duration for complex stories.",
      "Fine-grained style controls are less exposed.",
    ],
    benchmarks: {
      qualityElo: 84.9,
      promptFaithfulness: 84.4,
      temporalConsistency: 81.0,
    },
    pricingUsd: {
      monthly: 99,
    },
    quickstart: [
      {
        "en-IN": "Write prompts with subject-action-camera structure.",
        "hi-IN": "subject-action-camera संरचना में prompt लिखें।",
      },
      {
        "en-IN": "Split long scenes into stitched clips.",
        "hi-IN": "लंबे scenes को छोटे clips में split करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Realistic, short narrative shots.",
        "hi-IN": "यथार्थवादी छोटे narrative shots।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "You need heavy post-editing controls inside one tool.",
        "hi-IN": "जब एक ही टूल में भारी post-editing controls चाहिए।",
      },
    ],
    samples: [
      { type: "video", title: "Street scene", value: "12s / dusk / handheld camera" },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.4,
      misuseTags: ["misinformation"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "allowed",
    },
    provenance: {
      source: "catalog",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(2),
      lastVerifiedAt: isoDaysAgo(2),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(24),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: "flux-1-dev",
    slug: "flux-1-dev",
    name: "FLUX.1 Dev",
    summary: {
      "en-IN": "Open image generation model with strong typography and layout quality.",
      "hi-IN": "मजबूत typography और layout गुणवत्ता वाला open image generation मॉडल।",
    },
    modality: ["image", "text"],
    tags: ["image", "open-weight", "design", "poster"],
    capabilities: {
      maxResolution: "1536x1536",
      styleControl: true,
      typographyAccuracy: 84,
      supportsInpainting: true,
    },
    limitations: [
      "Can fail on dense text paragraphs.",
      "Requires careful negative prompts for hand details.",
    ],
    benchmarks: {
      imageElo: 83.4,
      textInImage: 81.2,
      styleConsistency: 79.5,
    },
    pricingUsd: {
      inputPerM: 0.0,
      outputPerM: 0.0,
    },
    quickstart: [
      {
        "en-IN": "Start from 1024 square and upscale after selecting best seed.",
        "hi-IN": "पहले 1024 square में generate करें, फिर best seed upscale करें।",
      },
      {
        "en-IN": "Use explicit font/style tokens for poster-like output.",
        "hi-IN": "poster output के लिए explicit font/style tokens दें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Marketing images, social thumbnails, and poster drafts.",
        "hi-IN": "मार्केटिंग images, social thumbnails और poster drafts।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Strict brand-safe logos with legal constraints.",
        "hi-IN": "कठोर legal constraints वाले brand-safe लोगो।",
      },
    ],
    samples: [
      { type: "image", title: "Poster concept", value: "retro tech expo / bold heading" },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "high",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.36,
      misuseTags: ["copyright"],
    },
    compliance: {
      license: "apache-2.0",
      commercialUse: "allowed",
    },
    provenance: {
      source: "huggingface",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(1),
      lastVerifiedAt: isoDaysAgo(1),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(26),
    updatedAt: isoDaysAgo(1),
  },
  {
    id: "midjourney-v7",
    slug: "midjourney-v7",
    name: "Midjourney v7",
    summary: {
      "en-IN": "Style-heavy image model popular for concept art and visual ideation.",
      "hi-IN": "concept art और visual ideation के लिए लोकप्रिय style-heavy image मॉडल।",
    },
    modality: ["image"],
    tags: ["image", "concept-art", "discord"],
    capabilities: {
      maxResolution: "2048x2048",
      styleControl: true,
      typographyAccuracy: 58,
      supportsInpainting: false,
    },
    limitations: [
      "Typography remains inconsistent.",
      "API automation workflow is less direct.",
    ],
    benchmarks: {
      imageElo: 81.3,
      textInImage: 56.4,
      styleConsistency: 84.1,
    },
    pricingUsd: {
      monthly: 60,
    },
    quickstart: [
      {
        "en-IN": "Create style board from 5-7 reference outputs.",
        "hi-IN": "5-7 reference outputs से style board बनाएं।",
      },
      {
        "en-IN": "Lock ratio and stylize setting for predictable batches.",
        "hi-IN": "predictable batches के लिए ratio और stylize lock करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Moodboards and concept visuals.",
        "hi-IN": "moodboards और concept visuals।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Pixel-perfect brand copy and text-heavy assets.",
        "hi-IN": "pixel-perfect brand copy और text-heavy assets।",
      },
    ],
    samples: [
      {
        type: "image",
        title: "Concept splash",
        value: "futuristic bazaar night market",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "low",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.39,
      misuseTags: ["copyright"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "restricted",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://arena.ai/leaderboard",
      fetchedAt: isoDaysAgo(3),
      lastVerifiedAt: isoDaysAgo(3),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(40),
    updatedAt: isoDaysAgo(3),
  },
  {
    id: "gpt-5-3-codex",
    slug: "gpt-5-3-codex",
    name: "OpenAI GPT-5.3 Codex",
    summary: {
      "en-IN": "High-end coding and reasoning model with large context and tool support.",
      "hi-IN": "बड़े context और tool support वाला high-end coding/reasoning मॉडल।",
    },
    modality: ["code", "text", "agent"],
    tags: ["code", "reasoning", "agent", "api"],
    capabilities: {
      contextTokens: 400000,
      toolCalling: true,
      structuredOutput: true,
      functionCalling: true,
    },
    limitations: [
      "Higher output-token cost than budget models.",
      "Needs guardrails for autonomous agent loops.",
    ],
    benchmarks: {
      sweBenchVerified: 76.8,
      codeReasoning: 90.1,
      multilingualCode: 84.4,
    },
    pricingUsd: {
      inputPerM: 1.75,
      outputPerM: 14,
    },
    quickstart: [
      {
        "en-IN": "Enable JSON schema output for stable integrations.",
        "hi-IN": "स्थिर integrations के लिए JSON schema output सक्षम करें।",
      },
      {
        "en-IN": "Add retrieval layer before long-context prompts.",
        "hi-IN": "long-context prompt से पहले retrieval layer जोड़ें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Complex coding assistants and multi-step reasoning.",
        "hi-IN": "complex coding assistants और multi-step reasoning।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "You only need low-cost basic chat responses.",
        "hi-IN": "जब सिर्फ कम लागत वाली basic chat responses चाहिए।",
      },
    ],
    samples: [
      {
        type: "code",
        title: "Refactor patch",
        value: "Generate migration-safe repository refactor plan.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.33,
      misuseTags: ["autonomy", "prompt-injection"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(8),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "claude-opus-4-6",
    slug: "claude-opus-4-6",
    name: "Claude Opus 4.6",
    summary: {
      "en-IN": "Strong long-form reasoning and coding model with robust instruction quality.",
      "hi-IN": "मजबूत long-form reasoning और coding गुणवत्ता वाला मॉडल।",
    },
    modality: ["text", "code", "agent"],
    tags: ["reasoning", "code", "enterprise"],
    capabilities: {
      contextTokens: 200000,
      toolCalling: true,
      structuredOutput: true,
      functionCalling: true,
    },
    limitations: [
      "May be slower on large contexts compared to speed-optimized models.",
      "Premium tier pricing for highest throughput.",
    ],
    benchmarks: {
      sweBenchVerified: 76.8,
      reasoningComposite: 91.2,
      safetyEval: 88.7,
    },
    pricingUsd: {
      inputPerM: 3,
      outputPerM: 15,
    },
    quickstart: [
      {
        "en-IN": "Use concise system instructions and explicit output schema.",
        "hi-IN": "संक्षिप्त system instructions और स्पष्ट output schema दें।",
      },
      {
        "en-IN": "Route low-priority tasks to cheaper fallback model.",
        "hi-IN": "कम-प्राथमिकता कार्यों के लिए cheaper fallback मॉडल रखें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "High-stakes reasoning and enterprise copilots.",
        "hi-IN": "high-stakes reasoning और enterprise copilots।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Ultra-low-latency, low-cost bulk generation workloads.",
        "hi-IN": "ultra-low-latency, low-cost bulk generation workload।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Compliance memo",
        value: "Generate bilingual rollout memo with risk controls.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.29,
      misuseTags: ["prompt-injection"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-rankings",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(10),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "qwen-3-5-397b-a17b",
    slug: "qwen-3-5-397b-a17b",
    name: "Qwen 3.5 397B A17B",
    summary: {
      "en-IN": "Large open model with strong multimodal and coding capabilities.",
      "hi-IN": "मजबूत multimodal और coding क्षमता वाला बड़ा open मॉडल।",
    },
    modality: ["text", "code", "image"],
    tags: ["open-weight", "multimodal", "coding"],
    capabilities: {
      contextTokens: 131072,
      toolCalling: true,
      multilingual: true,
      supportsVision: true,
    },
    limitations: [
      "Deployment footprint is heavy for self-hosting.",
      "Quality varies across providers.",
    ],
    benchmarks: {
      sweBenchVerified: 71.5,
      multilingualScore: 87.9,
      codingScore: 84.2,
    },
    pricingUsd: {
      inputPerM: 2.4,
      outputPerM: 3.6,
    },
    quickstart: [
      {
        "en-IN": "Pick provider based on throughput and uptime, not only price.",
        "hi-IN": "केवल कीमत नहीं, throughput और uptime के आधार पर provider चुनें।",
      },
      {
        "en-IN": "Use prompt templates for consistent bilingual output.",
        "hi-IN": "consistent bilingual output के लिए prompt templates उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Teams needing strong multilingual open-model performance.",
        "hi-IN": "मजबूत multilingual open-model प्रदर्शन चाहने वाली टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Small teams without infra budget for heavy inference.",
        "hi-IN": "भारी inference के लिए infra budget न होने पर।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Bilingual FAQ generator",
        value: "Create Hindi + English support answers with tone constraints.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.37,
      misuseTags: ["copyright", "prompt-injection"],
    },
    compliance: {
      license: "apache-2.0",
      commercialUse: "allowed",
    },
    provenance: {
      source: "huggingface+openrouter",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(6),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "svgsmith-studio",
    slug: "svgsmith-studio",
    name: "SVGSmith Studio",
    summary: {
      "en-IN": "Prompt-to-SVG workflow optimized for editable vector assets.",
      "hi-IN": "editable vector assets के लिए optimized prompt-to-SVG workflow।",
    },
    modality: ["image", "code", "text"],
    tags: ["svg", "design-system", "vector", "logo"],
    capabilities: {
      outputsValidSvg: true,
      maxArtboard: "4096x4096",
      supportsLayeredGroups: true,
      supportsAnimationTags: true,
    },
    limitations: [
      "Complex typography may require manual cleanup.",
      "Color-token mapping needs post-processing for strict design systems.",
    ],
    benchmarks: {
      svgValidity: 91.4,
      editabilityScore: 88.2,
      semanticLayering: 79.8,
    },
    pricingUsd: {
      monthly: 39,
    },
    quickstart: [
      {
        "en-IN": "Start with icon prompts using simple geometry constraints.",
        "hi-IN": "icon prompts में simple geometry constraints से शुरुआत करें।",
      },
      {
        "en-IN": "Run SVG linter before shipping to production.",
        "hi-IN": "production से पहले SVG linter चलाएं।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Icon packs, lightweight illustrations, and animated landing graphics.",
        "hi-IN": "icon packs, lightweight illustrations और animated landing graphics।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Photorealistic compositions where vector output is not needed.",
        "hi-IN": "जहां vector output की जरूरत न हो और photorealistic composition चाहिए।",
      },
    ],
    samples: [
      { type: "code", title: "Sample SVG", value: "<svg viewBox='0 0 120 120'>...</svg>" },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.22,
      misuseTags: ["brand-imitation"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "restricted",
    },
    provenance: {
      source: "internal-catalog",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(12),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "tavily-search-api",
    slug: "tavily-search-api",
    name: "Tavily Search API",
    summary: {
      "en-IN": "Search API for grounding AI agents with fresh web evidence.",
      "hi-IN": "AI agents को ताज़ा वेब evidence देने वाला search API।",
    },
    modality: ["search", "agent", "text"],
    tags: ["search", "rag", "agents"],
    capabilities: {
      webSearch: true,
      citationSupport: true,
      freshnessWindowHours: 24,
      extractionDepth: "high",
    },
    limitations: [
      "Query cost spikes with broad crawls.",
      "Requires prompt design to avoid noisy citations.",
    ],
    benchmarks: {
      retrievalPrecision: 83.7,
      citationCoverage: 86.2,
      latencyP95Ms: 1240,
    },
    pricingUsd: {
      monthly: 49,
    },
    quickstart: [
      {
        "en-IN": "Use focused query templates with domain constraints.",
        "hi-IN": "domain constraints के साथ focused query templates उपयोग करें।",
      },
      {
        "en-IN": "Cache frequent query classes for lower p95 latency.",
        "hi-IN": "कम p95 latency के लिए frequent queries cache करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Agent workflows needing verifiable web citations.",
        "hi-IN": "verifiable web citations वाले agent workflows।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Offline-only deployments with no external calls.",
        "hi-IN": "offline-only deployments जहां external calls न हों।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Search answer",
        value: "Top tools for short-form video with source citations.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.31,
      misuseTags: ["source-poisoning"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(4),
      lastVerifiedAt: isoDaysAgo(4),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(22),
    updatedAt: isoDaysAgo(4),
  },
  {
    id: "elevenlabs-v3",
    slug: "elevenlabs-v3",
    name: "ElevenLabs v3",
    summary: {
      "en-IN": "Speech synthesis stack with multilingual voices and low-latency streaming.",
      "hi-IN": "multilingual voices और low-latency streaming वाला speech synthesis stack।",
    },
    modality: ["audio", "text"],
    tags: ["tts", "voice", "audio"],
    capabilities: {
      voiceCloning: true,
      streaming: true,
      supportedLanguages: 32,
      emotionControl: true,
    },
    limitations: [
      "Voice cloning requires strict consent handling.",
      "Expressive styles can vary by language.",
    ],
    benchmarks: {
      naturalness: 88.3,
      latencyP95Ms: 410,
      languageCoverage: 81.0,
    },
    pricingUsd: {
      monthly: 22,
    },
    quickstart: [
      {
        "en-IN": "Set voice safety policy before enabling cloning.",
        "hi-IN": "cloning चालू करने से पहले voice safety policy सेट करें।",
      },
      {
        "en-IN": "Use streaming mode for conversational UI.",
        "hi-IN": "conversational UI के लिए streaming mode उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Voice assistants, narration, and dubbing prototypes.",
        "hi-IN": "voice assistants, narration और dubbing prototypes।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Products without user consent and identity verification flow.",
        "hi-IN": "जहां user consent और identity verification flow न हो।",
      },
    ],
    samples: [
      { type: "audio", title: "Hindi narration", value: "30s fintech product explainer" },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.48,
      misuseTags: ["voice-cloning", "impersonation"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://arena.ai/leaderboard",
      fetchedAt: isoDaysAgo(5),
      lastVerifiedAt: isoDaysAgo(5),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(18),
    updatedAt: isoDaysAgo(5),
  },
  {
    id: "openai-realtime-voice",
    slug: "openai-realtime-voice",
    name: "OpenAI Realtime Voice",
    summary: {
      "en-IN": "Low-latency bidirectional speech interface for voice agents and assistants.",
      "hi-IN": "voice agents और assistants के लिए low-latency bidirectional speech interface।",
    },
    modality: ["audio", "agent", "text"],
    tags: ["voice", "realtime", "agent", "speech-to-speech"],
    capabilities: {
      voiceCloning: false,
      realtimeStreaming: true,
      interruptionHandling: true,
      multilingual: true,
      avgTurnLatencyMs: 320,
    },
    limitations: [
      "Requires careful turn-taking UX to avoid overlap artifacts.",
      "Long calls need strict token/session budget controls.",
    ],
    benchmarks: {
      latencyP95Ms: 520,
      turnStability: 84.1,
      multilingualQuality: 86.4,
    },
    pricingUsd: {
      inputPerM: 4.5,
      outputPerM: 13.5,
    },
    quickstart: [
      {
        "en-IN": "Start with push-to-talk mode before enabling full duplex.",
        "hi-IN": "full duplex सक्षम करने से पहले push-to-talk mode से शुरू करें।",
      },
      {
        "en-IN": "Add profanity/safety filters and call recording policy early.",
        "hi-IN": "शुरुआत में profanity/safety filters और call recording policy जोड़ें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Customer support copilots and voice-first product assistants.",
        "hi-IN": "customer support copilots और voice-first product assistants।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Strict offline deployments with no cloud audio path.",
        "hi-IN": "सख्त offline deployments जहां cloud audio path न हो।",
      },
    ],
    samples: [{ type: "audio", title: "Support call flow", value: "Hindi-English mixed call assistant" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.46,
      misuseTags: ["impersonation", "social-engineering"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual+openrouter",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(1),
      lastVerifiedAt: isoDaysAgo(1),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(10),
    updatedAt: isoDaysAgo(1),
  },
  {
    id: "playht-3",
    slug: "playht-3",
    name: "PlayHT 3.0",
    summary: {
      "en-IN": "Commercial TTS/voice-cloning stack optimized for narration and creator workflows.",
      "hi-IN": "narration और creator workflows के लिए optimized commercial TTS/voice-cloning stack।",
    },
    modality: ["audio", "text"],
    tags: ["voice", "tts", "voice-cloning", "narration"],
    capabilities: {
      voiceCloning: true,
      streaming: true,
      supportedLanguages: 30,
      emotionControl: true,
      styleTransfer: true,
    },
    limitations: [
      "Consent management and voice ownership checks are mandatory.",
      "Fine voice style control varies by locale.",
    ],
    benchmarks: {
      naturalness: 86.2,
      cloningSimilarity: 83.8,
      latencyP95Ms: 480,
    },
    pricingUsd: {
      monthly: 39,
    },
    quickstart: [
      {
        "en-IN": "Create consent workflow before enabling cloning in production.",
        "hi-IN": "production में cloning से पहले consent workflow बनाएं।",
      },
      {
        "en-IN": "Use smaller chunk sizes for low-latency interactive playback.",
        "hi-IN": "low-latency playback के लिए छोटे chunk sizes उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Narration pipelines and creator tools with voice personalization.",
        "hi-IN": "voice personalization वाले narration pipelines और creator tools।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Workflows without identity verification controls.",
        "hi-IN": "ऐसे workflows जिनमें identity verification controls न हों।",
      },
    ],
    samples: [{ type: "audio", title: "Podcast voice", value: "45s startup news summary" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.5,
      misuseTags: ["voice-cloning", "impersonation"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://arena.ai/leaderboard",
      fetchedAt: isoDaysAgo(3),
      lastVerifiedAt: isoDaysAgo(3),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(14),
    updatedAt: isoDaysAgo(3),
  },
  {
    id: "cartesia-sonic",
    slug: "cartesia-sonic",
    name: "Cartesia Sonic",
    summary: {
      "en-IN": "Ultra-low latency TTS model designed for realtime conversational experiences.",
      "hi-IN": "realtime conversational अनुभवों के लिए ultra-low latency TTS मॉडल।",
    },
    modality: ["audio", "agent"],
    tags: ["voice", "tts", "realtime", "latency"],
    capabilities: {
      realtimeStreaming: true,
      avgTurnLatencyMs: 180,
      voiceCloning: false,
      multilingual: true,
    },
    limitations: [
      "Expressive long-form narration is weaker than studio-grade TTS stacks.",
      "Best quality requires stable audio playback pipeline.",
    ],
    benchmarks: {
      latencyP95Ms: 260,
      conversationalNaturalness: 80.7,
      bargeInRecovery: 85.2,
    },
    pricingUsd: {
      inputPerM: 1.9,
      outputPerM: 7.8,
    },
    quickstart: [
      {
        "en-IN": "Tune chunked streaming and jitter buffering for your target network.",
        "hi-IN": "target network के अनुसार chunked streaming और jitter buffering ट्यून करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Realtime call assistants and interactive voice bots.",
        "hi-IN": "realtime call assistants और interactive voice bots।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "High-fidelity audiobook narration with broad style control.",
        "hi-IN": "broad style control वाली high-fidelity audiobook narration।",
      },
    ],
    samples: [{ type: "audio", title: "Call assistant", value: "Instant response travel booking bot" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.34,
      misuseTags: ["social-engineering"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(2),
      lastVerifiedAt: isoDaysAgo(2),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(9),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: "langgraph-platform",
    slug: "langgraph-platform",
    name: "LangGraph Platform",
    summary: {
      "en-IN": "Stateful agent orchestration platform for multi-step workflows and human-in-loop control.",
      "hi-IN": "multi-step workflows और human-in-loop control के लिए stateful agent orchestration platform।",
    },
    modality: ["agent", "code", "search"],
    tags: ["agents", "orchestration", "workflow", "langchain"],
    capabilities: {
      statefulExecution: true,
      humanApprovalSteps: true,
      toolCalling: true,
      retryPolicies: true,
      longRunningJobs: true,
    },
    limitations: [
      "Requires workflow design discipline; naive graphs become hard to debug.",
      "Ops overhead grows with many concurrent agent sessions.",
    ],
    benchmarks: {
      agentTaskCompletion: 82.4,
      reliabilityUnderRetries: 86.8,
      medianLatencySec: 6.2,
    },
    pricingUsd: {
      monthly: 99,
    },
    quickstart: [
      {
        "en-IN": "Define explicit tool schemas and state transitions before production rollout.",
        "hi-IN": "production rollout से पहले explicit tool schemas और state transitions परिभाषित करें।",
      },
      {
        "en-IN": "Add human approval nodes for sensitive actions.",
        "hi-IN": "sensitive actions के लिए human approval nodes जोड़ें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Complex agent apps with branching state and audit trails.",
        "hi-IN": "branching state और audit trails वाले complex agent apps।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Simple single-shot assistants with no workflow complexity.",
        "hi-IN": "बिना workflow complexity वाले simple single-shot assistants।",
      },
    ],
    samples: [{ type: "code", title: "Agent graph", value: "research -> verify -> draft -> approval -> publish" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.33,
      misuseTags: ["automation-abuse", "tool-misfire"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://livebench.ai/",
      fetchedAt: isoDaysAgo(2),
      lastVerifiedAt: isoDaysAgo(2),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(16),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: "crewai-enterprise",
    slug: "crewai-enterprise",
    name: "CrewAI Enterprise",
    summary: {
      "en-IN": "Role-based multi-agent runtime for business workflows and ops automations.",
      "hi-IN": "business workflows और ops automations के लिए role-based multi-agent runtime।",
    },
    modality: ["agent", "code", "search"],
    tags: ["multi-agent", "enterprise", "automation", "workflow"],
    capabilities: {
      multiAgentCoordination: true,
      rolePolicies: true,
      toolCalling: true,
      scheduler: true,
      observability: true,
    },
    limitations: [
      "Role prompting can drift without strict templates.",
      "Needs robust sandboxing when agents execute external tools.",
    ],
    benchmarks: {
      multiStepSuccess: 79.6,
      toolUseAccuracy: 82.1,
      operationalReliability: 84.0,
    },
    pricingUsd: {
      monthly: 129,
    },
    quickstart: [
      {
        "en-IN": "Start with two-agent flows before scaling to large crews.",
        "hi-IN": "बड़े crews तक जाने से पहले two-agent flows से शुरू करें।",
      },
      {
        "en-IN": "Set hard tool allowlists and budget/time limits.",
        "hi-IN": "hard tool allowlists और budget/time limits सेट करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Ops teams automating repetitive multi-step business tasks.",
        "hi-IN": "दोहराए जाने वाले multi-step business tasks को automate करने वाली ops टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Highly regulated environments without mature approval controls.",
        "hi-IN": "mature approval controls के बिना highly regulated environments।",
      },
    ],
    samples: [{ type: "text", title: "Crew pipeline", value: "intake -> classify -> draft response -> QA" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.45,
      misuseTags: ["privilege-escalation", "automation-abuse"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://arena.ai/leaderboard",
      fetchedAt: isoDaysAgo(3),
      lastVerifiedAt: isoDaysAgo(3),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(20),
    updatedAt: isoDaysAgo(3),
  },
  {
    id: "autogen-studio",
    slug: "autogen-studio",
    name: "AutoGen Studio",
    summary: {
      "en-IN": "Developer-focused multi-agent experimentation and evaluation environment.",
      "hi-IN": "developer-focused multi-agent experimentation और evaluation environment।",
    },
    modality: ["agent", "code", "text"],
    tags: ["autogen", "multi-agent", "experimentation", "evals"],
    capabilities: {
      multiAgentCoordination: true,
      simulationRuns: true,
      toolCalling: true,
      transcriptTracing: true,
    },
    limitations: [
      "Primarily suited for engineering teams; steeper learning curve for non-technical users.",
      "Production hardening requires extra infra and controls.",
    ],
    benchmarks: {
      agentIterationSpeed: 88.0,
      reproducibility: 79.2,
      toolUseAccuracy: 77.4,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Run controlled test scenarios before connecting external systems.",
        "hi-IN": "external systems जोड़ने से पहले controlled test scenarios चलाएं।",
      },
    ],
    bestFor: [
      {
        "en-IN": "R&D teams evaluating new agent architectures.",
        "hi-IN": "नई agent architectures का मूल्यांकन करने वाली R&D टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Teams seeking fully managed no-code agent deployments.",
        "hi-IN": "fully managed no-code agent deployments चाहने वाली टीमें।",
      },
    ],
    samples: [{ type: "code", title: "Agent testbed", value: "planner + coder + reviewer iterative loop" }],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.29,
      misuseTags: ["unsafe-tooling"],
    },
    compliance: {
      license: "mit",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://github.com/LiveBench/LiveBench",
      fetchedAt: isoDaysAgo(6),
      lastVerifiedAt: isoDaysAgo(6),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(32),
    updatedAt: isoDaysAgo(6),
  },
  {
    id: "pika-2-2",
    slug: "pika-2-2",
    name: "Pika 2.2",
    summary: {
      "en-IN": "Consumer-friendly text/image-to-video generator focused on short social clips.",
      "hi-IN": "short social clips के लिए consumer-friendly text/image-to-video generator।",
    },
    modality: ["video", "image"],
    tags: ["video", "social", "short-form"],
    capabilities: {
      maxVideoDurationSec: 10,
      maxResolution: "1080p",
      supportsImageToVideo: true,
      styleTemplates: true,
    },
    limitations: [
      "Lower control for complex camera choreography.",
      "Consistency may vary across multiple reruns.",
    ],
    benchmarks: {
      qualityElo: 79.4,
      promptFaithfulness: 77.8,
      temporalConsistency: 74.9,
    },
    pricingUsd: {
      monthly: 24,
    },
    quickstart: [
      {
        "en-IN": "Use one-shot prompts and reference frames for stronger consistency.",
        "hi-IN": "बेहतर consistency के लिए one-shot prompts और reference frames उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Social marketing teams creating quick campaign variants.",
        "hi-IN": "तेजी से campaign variants बनाने वाली social marketing टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Long-form cinematic sequences with strict scene continuity.",
        "hi-IN": "strict scene continuity वाली long-form cinematic sequences।",
      },
    ],
    samples: [{ type: "video", title: "Social clip", value: "8s product teaser with dynamic motion" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.42,
      misuseTags: ["deepfake"],
    },
    compliance: {
      license: "proprietary",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual+rankings",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(4),
      lastVerifiedAt: isoDaysAgo(4),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(25),
    updatedAt: isoDaysAgo(4),
  },
  {
    id: "ideogram-3",
    slug: "ideogram-3",
    name: "Ideogram 3",
    summary: {
      "en-IN": "Image model with strong text rendering and poster/logo style generation.",
      "hi-IN": "मजबूत text rendering और poster/logo generation वाला image मॉडल।",
    },
    modality: ["image", "text"],
    tags: ["image", "design", "text-in-image", "logo"],
    capabilities: {
      maxResolution: "2048x2048",
      typographyAccuracy: 90,
      supportsInpainting: true,
      brandStylePreset: true,
    },
    limitations: [
      "Brand-safe trademark handling still requires legal review.",
      "Fine geometric vector control is limited compared to SVG-native tools.",
    ],
    benchmarks: {
      imageElo: 85.9,
      textInImage: 90.3,
      styleConsistency: 83.5,
    },
    pricingUsd: {
      monthly: 30,
    },
    quickstart: [
      {
        "en-IN": "Include explicit font, hierarchy, and spacing instructions in prompt.",
        "hi-IN": "prompt में font, hierarchy और spacing निर्देश स्पष्ट दें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Poster drafts, social graphics, and text-heavy visuals.",
        "hi-IN": "poster drafts, social graphics और text-heavy visuals।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Production-ready vector icon systems with strict editability.",
        "hi-IN": "strict editability वाले production-ready vector icon systems।",
      },
    ],
    samples: [{ type: "image", title: "Poster draft", value: "AI meetup poster with dual-language headline" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.37,
      misuseTags: ["copyright", "brand-imitation"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(3),
      lastVerifiedAt: isoDaysAgo(3),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(19),
    updatedAt: isoDaysAgo(3),
  },
  {
    id: "exa-search-api",
    slug: "exa-search-api",
    name: "Exa Search API",
    summary: {
      "en-IN": "Web-scale retrieval API designed for AI-first search and research workflows.",
      "hi-IN": "AI-first search और research workflows के लिए web-scale retrieval API।",
    },
    modality: ["search", "agent", "text"],
    tags: ["search", "retrieval", "rag", "research"],
    capabilities: {
      webSearch: true,
      semanticRetrieval: true,
      freshnessWindowHours: 12,
      citationSupport: true,
    },
    limitations: [
      "Broad discovery queries can become expensive without caching.",
      "Requires good ranking prompts to reduce citation noise.",
    ],
    benchmarks: {
      retrievalPrecision: 85.1,
      citationCoverage: 84.9,
      latencyP95Ms: 980,
    },
    pricingUsd: {
      monthly: 59,
    },
    quickstart: [
      {
        "en-IN": "Use domain constraints and query templates for stable precision.",
        "hi-IN": "स्थिर precision के लिए domain constraints और query templates उपयोग करें।",
      },
      {
        "en-IN": "Cache high-frequency prompts and citations.",
        "hi-IN": "high-frequency prompts और citations को cache करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Research copilots and citation-grounded assistant responses.",
        "hi-IN": "research copilots और citation-grounded assistant responses।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Strictly closed-network workloads.",
        "hi-IN": "strictly closed-network workloads।",
      },
    ],
    samples: [{ type: "text", title: "RAG citation pack", value: "Top 8 benchmark sources for coding agents" }],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.28,
      misuseTags: ["source-poisoning"],
    },
    compliance: {
      license: "commercial",
      commercialUse: "allowed",
    },
    provenance: {
      source: "manual",
      sourceUrl: "https://livebench.ai/",
      fetchedAt: isoDaysAgo(1),
      lastVerifiedAt: isoDaysAgo(1),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(11),
    updatedAt: isoDaysAgo(1),
  },
];

export const seedReviews: Review[] = [
  {
    id: "rev_1",
    listingId: "seedance-pro",
    userId: "user_demo_1",
    rating: 5,
    title: "Fast for ad creatives",
    body: "Strong motion quality for short ads. Prompt structure matters a lot.",
    locale: "en-IN",
    createdAt: isoDaysAgo(1),
    flagged: false,
  },
  {
    id: "rev_2",
    listingId: "gpt-5-3-codex",
    userId: "user_demo_2",
    rating: 4,
    title: "Great reasoning, pricey outputs",
    body: "Reliable for complex fixes, but we route simple tasks to cheaper models.",
    locale: "en-IN",
    createdAt: isoDaysAgo(2),
    flagged: false,
  },
  {
    id: "rev_3",
    listingId: "svgsmith-studio",
    userId: "user_demo_3",
    rating: 4,
    title: "Useful SVG base",
    body: "Good layered output; we still run optimization before production deploy.",
    locale: "en-IN",
    createdAt: isoDaysAgo(2),
    flagged: false,
  },
  {
    id: "rev_4",
    listingId: "langgraph-platform",
    userId: "user_demo_4",
    rating: 5,
    title: "Strong orchestration control",
    body: "State + approval nodes made our agent workflows much safer to ship.",
    locale: "en-IN",
    createdAt: isoDaysAgo(1),
    flagged: false,
  },
  {
    id: "rev_5",
    listingId: "openai-realtime-voice",
    userId: "user_demo_5",
    rating: 4,
    title: "Low latency voice turns",
    body: "Very responsive in support calls. We had to tune interruptions carefully.",
    locale: "en-IN",
    createdAt: isoDaysAgo(1),
    flagged: false,
  },
  {
    id: "rev_6",
    listingId: "cartesia-sonic",
    userId: "user_demo_6",
    rating: 4,
    title: "Fast realtime audio",
    body: "Excellent for interactive voice bot flows, not ideal for long narration quality.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_7",
    listingId: "exa-search-api",
    userId: "user_demo_7",
    rating: 4,
    title: "Good retrieval quality",
    body: "Citation quality is solid when templates are constrained by intent and domain.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
];
