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
  {
    id: "openai-gpt-5-mini-openrouter",
    slug: "openai-gpt-5-mini-openrouter",
    name: "OpenAI GPT-5 Mini (OpenRouter)",
    summary: {
      "en-IN":
        "High-context multimodal model routed via OpenRouter with cost-efficient pricing for builder workloads.",
      "hi-IN":
        "builder workflows के लिए cost-efficient pricing वाला high-context multimodal मॉडल (OpenRouter)।",
    },
    modality: ["text", "code", "image"],
    tags: ["openrouter", "gpt-5-mini", "multimodal", "reasoning"],
    capabilities: {
      contextTokens: 400000,
      supportsImageInput: true,
      supportsFileInput: true,
      toolCalling: true,
    },
    limitations: [
      "Final commercial and safety requirements depend on provider policy and deployment setup.",
      "High-context prompts require strict prompt budgeting for cost control.",
    ],
    benchmarks: {
      contextWindowTokens: 400000,
      inputCostPerMUsd: 0.25,
      outputCostPerMUsd: 2.0,
      inputModalitiesCount: 3,
    },
    pricingUsd: {
      inputPerM: 0.25,
      outputPerM: 2.0,
    },
    quickstart: [
      {
        "en-IN": "Use OpenRouter chat completion endpoint and set strict max output tokens.",
        "hi-IN": "OpenRouter chat completion endpoint उपयोग करें और strict max output tokens सेट करें।",
      },
      {
        "en-IN": "Route simple tasks to mini tier and reserve larger models for hard reasoning.",
        "hi-IN": "simple tasks को mini tier पर route करें और कठिन reasoning के लिए बड़े models रखें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "General coding assistants, high-context workflows, and multimodal RAG.",
        "hi-IN": "general coding assistants, high-context workflows और multimodal RAG।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Fully offline inference requirements.",
        "hi-IN": "fully offline inference आवश्यकताएँ।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Code review agent",
        value: "Analyze repo diff and propose safe patch plan with rollback notes.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.32,
      misuseTags: ["prompt-injection"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(7),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "anthropic-claude-sonnet-4-openrouter",
    slug: "anthropic-claude-sonnet-4-openrouter",
    name: "Claude Sonnet 4 (OpenRouter)",
    summary: {
      "en-IN":
        "Large-context Anthropic model via OpenRouter for coding, analysis, and multimodal enterprise tasks.",
      "hi-IN":
        "coding, analysis और multimodal enterprise tasks के लिए OpenRouter पर Claude Sonnet 4।",
    },
    modality: ["text", "code", "image"],
    tags: ["openrouter", "anthropic", "claude-sonnet-4", "analysis"],
    capabilities: {
      contextTokens: 1000000,
      supportsImageInput: true,
      supportsFileInput: true,
      toolCalling: true,
    },
    limitations: [
      "Premium output pricing can grow quickly for long responses.",
      "Use guardrails for sensitive workflow automation.",
    ],
    benchmarks: {
      contextWindowTokens: 1000000,
      inputCostPerMUsd: 3.0,
      outputCostPerMUsd: 15.0,
      inputModalitiesCount: 3,
    },
    pricingUsd: {
      inputPerM: 3.0,
      outputPerM: 15.0,
    },
    quickstart: [
      {
        "en-IN": "Start with retrieval-augmented prompts to reduce unnecessary long outputs.",
        "hi-IN": "अनावश्यक long outputs कम करने के लिए retrieval-augmented prompts से शुरू करें।",
      },
      {
        "en-IN": "Enable structured tool schemas for deterministic automation.",
        "hi-IN": "deterministic automation के लिए structured tool schemas सक्षम करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Long-context reasoning and high-quality coding guidance.",
        "hi-IN": "long-context reasoning और high-quality coding guidance।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Ultra low-cost high-volume workloads.",
        "hi-IN": "ultra low-cost high-volume workloads।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Architecture review",
        value: "Evaluate migration risks and propose phased rollout checks.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.34,
      misuseTags: ["prompt-injection", "policy-bypass"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-rankings+models",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(8),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "google-gemini-2-5-flash-openrouter",
    slug: "google-gemini-2-5-flash-openrouter",
    name: "Gemini 2.5 Flash (OpenRouter)",
    summary: {
      "en-IN":
        "Multimodal fast-tier model supporting text/image/audio/video inputs through OpenRouter.",
      "hi-IN":
        "OpenRouter पर text/image/audio/video inputs सपोर्ट करने वाला fast-tier multimodal मॉडल।",
    },
    modality: ["text", "code", "image", "audio", "video"],
    tags: ["openrouter", "gemini-2.5-flash", "multimodal", "fast"],
    capabilities: {
      contextTokens: 1048576,
      supportsImageInput: true,
      supportsAudioInput: true,
      supportsVideoInput: true,
      toolCalling: true,
    },
    limitations: [
      "Output modality is text-first in OpenRouter routing.",
      "High multimodal context can increase latency and spend.",
    ],
    benchmarks: {
      contextWindowTokens: 1048576,
      inputCostPerMUsd: 0.3,
      outputCostPerMUsd: 2.5,
      inputModalitiesCount: 5,
    },
    pricingUsd: {
      inputPerM: 0.3,
      outputPerM: 2.5,
    },
    quickstart: [
      {
        "en-IN": "Use for fast multimodal understanding and route heavy reasoning to premium models.",
        "hi-IN": "fast multimodal understanding के लिए उपयोग करें और heavy reasoning को premium models पर route करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Fast multimodal copilots, form understanding, and media-grounded Q&A.",
        "hi-IN": "fast multimodal copilots, form understanding और media-grounded Q&A।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Tasks requiring guaranteed deterministic outputs without retries.",
        "hi-IN": "बिना retries के guaranteed deterministic outputs वाले tasks।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Media-grounded answer",
        value: "Summarize policy from mixed PDF + screenshot + voice note inputs.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.31,
      misuseTags: ["prompt-injection"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(6),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "qwen-qwen3-coder-openrouter",
    slug: "qwen-qwen3-coder-openrouter",
    name: "Qwen3 Coder 480B (OpenRouter)",
    summary: {
      "en-IN":
        "Large coding model surfaced via OpenRouter with strong cost-performance profile for dev teams.",
      "hi-IN":
        "dev teams के लिए मजबूत cost-performance प्रोफ़ाइल वाला OpenRouter पर उपलब्ध बड़ा coding मॉडल।",
    },
    modality: ["text", "code"],
    tags: ["openrouter", "qwen3-coder", "coding", "developer"],
    capabilities: {
      contextTokens: 262144,
      toolCalling: true,
      codeRefactoring: true,
    },
    limitations: [
      "May need stronger instruction scaffolding for strict enterprise style guides.",
      "Use evaluation harness for critical production refactors.",
    ],
    benchmarks: {
      contextWindowTokens: 262144,
      inputCostPerMUsd: 0.22,
      outputCostPerMUsd: 1.0,
      inputModalitiesCount: 1,
    },
    pricingUsd: {
      inputPerM: 0.22,
      outputPerM: 1.0,
    },
    quickstart: [
      {
        "en-IN": "Start with small patch tasks and add unit-test generation in the same loop.",
        "hi-IN": "small patch tasks से शुरू करें और उसी loop में unit-test generation जोड़ें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Cost-aware coding copilots and large repo maintenance workflows.",
        "hi-IN": "cost-aware coding copilots और बड़े repo maintenance workflows।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "No-review auto-merge pipelines.",
        "hi-IN": "no-review auto-merge pipelines।",
      },
    ],
    samples: [
      {
        type: "code",
        title: "Refactor patch",
        value: "Convert callback-heavy handler into typed async pipeline with tests.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.29,
      misuseTags: ["unsafe-code-suggestions"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(5),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "moonshot-kimi-k2-openrouter",
    slug: "moonshot-kimi-k2-openrouter",
    name: "Kimi K2 (OpenRouter)",
    summary: {
      "en-IN": "Long-context model available in OpenRouter routing for coding, analysis, and agent planning.",
      "hi-IN":
        "coding, analysis और agent planning के लिए OpenRouter routing में उपलब्ध long-context मॉडल।",
    },
    modality: ["text", "code", "agent"],
    tags: ["openrouter", "kimi-k2", "long-context", "agent-planning"],
    capabilities: {
      contextTokens: 131072,
      toolCalling: true,
      planExecution: true,
    },
    limitations: [
      "Long contexts still require careful retrieval and chunking strategy.",
      "Quality varies for domain-specific enterprise policy tasks without examples.",
    ],
    benchmarks: {
      contextWindowTokens: 131072,
      inputCostPerMUsd: 0.5,
      outputCostPerMUsd: 2.4,
      inputModalitiesCount: 1,
    },
    pricingUsd: {
      inputPerM: 0.5,
      outputPerM: 2.4,
    },
    quickstart: [
      {
        "en-IN": "Use instruction templates plus schema constraints for stable task planning.",
        "hi-IN": "stable task planning के लिए instruction templates और schema constraints उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Agent planning and long document-grounded analysis.",
        "hi-IN": "agent planning और long document-grounded analysis।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Hard real-time sub-second responses.",
        "hi-IN": "hard real-time sub-second responses।",
      },
    ],
    samples: [
      {
        type: "text",
        title: "Planning output",
        value: "Generate staged migration plan with risk gates and rollback checks.",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.33,
      misuseTags: ["automation-abuse"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-rankings+models",
      sourceUrl: "https://openrouter.ai/rankings",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(5),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "deepseek-v3-1-openrouter",
    slug: "deepseek-v3-1-openrouter",
    name: "DeepSeek V3.1 (OpenRouter)",
    summary: {
      "en-IN":
        "Cost-efficient text model in OpenRouter for everyday assistant, coding, and automation prompts.",
      "hi-IN":
        "assistant, coding और automation prompts के लिए OpenRouter का cost-efficient text मॉडल।",
    },
    modality: ["text", "code"],
    tags: ["openrouter", "deepseek-v3.1", "cost-efficient", "assistant"],
    capabilities: {
      contextTokens: 32768,
      toolCalling: true,
    },
    limitations: [
      "Shorter context window versus latest high-context frontier models.",
      "Needs prompt constraints for compliance-sensitive outputs.",
    ],
    benchmarks: {
      contextWindowTokens: 32768,
      inputCostPerMUsd: 0.15,
      outputCostPerMUsd: 0.75,
      inputModalitiesCount: 1,
    },
    pricingUsd: {
      inputPerM: 0.15,
      outputPerM: 0.75,
    },
    quickstart: [
      {
        "en-IN": "Use for high-volume assistant traffic and route edge cases to stronger models.",
        "hi-IN": "high-volume assistant traffic के लिए उपयोग करें और edge cases को मजबूत models पर route करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Budget-aware automation and customer support drafting.",
        "hi-IN": "budget-aware automation और customer support drafting।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Very long-context policy analysis tasks.",
        "hi-IN": "बहुत लंबे-context policy analysis tasks।",
      },
    ],
    samples: [
      { type: "text", title: "Support draft", value: "Generate concise refund-policy reply with checklist." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.3,
      misuseTags: ["policy-misclassification"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(4),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "elevenlabs-flash-v2-5",
    slug: "elevenlabs-flash-v2-5",
    name: "ElevenLabs Flash v2.5",
    summary: {
      "en-IN":
        "ElevenLabs low-latency TTS model optimized for real-time conversational applications.",
      "hi-IN":
        "realtime conversational applications के लिए optimized ElevenLabs का low-latency TTS मॉडल।",
    },
    modality: ["audio", "agent", "text"],
    tags: ["elevenlabs", "tts", "realtime", "voice"],
    capabilities: {
      realtimeStreaming: true,
      latencyMsClaim: 75,
      supportedLanguages: 32,
      voiceCloning: true,
    },
    limitations: [
      "Conversation quality still depends on turn management and playback stack.",
      "Voice cloning must include explicit user consent controls.",
    ],
    benchmarks: {
      latencyClaimMs: 75,
      languageCoverage: 32,
      realtimeReadiness: 91.0,
    },
    pricingUsd: {
      monthly: 5,
    },
    quickstart: [
      {
        "en-IN": "Use Flash v2.5 for call assistants where latency is the primary requirement.",
        "hi-IN": "जहां latency मुख्य आवश्यकता है वहां call assistants के लिए Flash v2.5 उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Live support agents and voice bots requiring quick response.",
        "hi-IN": "तेज response की जरूरत वाले live support agents और voice bots।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Studio-grade long-form narration workflows.",
        "hi-IN": "studio-grade long-form narration workflows।",
      },
    ],
    samples: [
      { type: "audio", title: "Realtime IVR voice", value: "Instant bilingual IVR prompt responses." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.45,
      misuseTags: ["voice-cloning", "impersonation"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "elevenlabs-model-docs",
      sourceUrl: "https://elevenlabs.io/docs/models/",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(3),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "elevenlabs-turbo-v2-5",
    slug: "elevenlabs-turbo-v2-5",
    name: "ElevenLabs Turbo v2.5",
    summary: {
      "en-IN": "Balanced-latency TTS model from ElevenLabs for high-volume narration and assistant output.",
      "hi-IN":
        "high-volume narration और assistant output के लिए ElevenLabs का balanced-latency TTS मॉडल।",
    },
    modality: ["audio", "text"],
    tags: ["elevenlabs", "tts", "turbo", "voice"],
    capabilities: {
      realtimeStreaming: true,
      latencyMsClaim: 250,
      supportedLanguages: 32,
      voiceCloning: true,
    },
    limitations: [
      "Not as expressive as premium creative voice models for character-heavy content.",
      "Needs strong content policy checks before automated publishing.",
    ],
    benchmarks: {
      latencyClaimMs: 250,
      languageCoverage: 32,
      throughputReadiness: 88.0,
    },
    pricingUsd: {
      monthly: 22,
    },
    quickstart: [
      {
        "en-IN": "Prefer Turbo v2.5 for bulk generation where speed and cost must stay balanced.",
        "hi-IN": "जहां speed और cost दोनों balanced चाहिए वहां bulk generation के लिए Turbo v2.5 चुनें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Large-scale TTS workloads and responsive assistant narration.",
        "hi-IN": "large-scale TTS workloads और responsive assistant narration।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "High-emotion cinematic dubbing without post-processing.",
        "hi-IN": "post-processing बिना high-emotion cinematic dubbing।",
      },
    ],
    samples: [
      { type: "audio", title: "Batch narration", value: "Generate 200 short policy explainers." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.42,
      misuseTags: ["voice-cloning"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "elevenlabs-model-docs",
      sourceUrl: "https://elevenlabs.io/docs/models/",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(3),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "elevenlabs-scribe-v2",
    slug: "elevenlabs-scribe-v2",
    name: "ElevenLabs Scribe v2",
    summary: {
      "en-IN":
        "Speech-to-text model from ElevenLabs designed for multilingual transcription workflows.",
      "hi-IN":
        "multilingual transcription workflows के लिए ElevenLabs का speech-to-text मॉडल।",
    },
    modality: ["audio", "text", "search"],
    tags: ["elevenlabs", "speech-to-text", "transcription", "multilingual"],
    capabilities: {
      speechToText: true,
      supportedLanguages: 99,
      diarization: true,
      timestampedOutput: true,
    },
    limitations: [
      "Domain-specific jargon requires custom vocabulary adaptation.",
      "Noisy multi-speaker audio may need pre-cleaning for best accuracy.",
    ],
    benchmarks: {
      languageCoverage: 99,
      transcriptCompleteness: 87.4,
      diarizationStability: 83.2,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Use chunked uploads and speaker labeling for meeting-note pipelines.",
        "hi-IN": "meeting-note pipelines के लिए chunked uploads और speaker labeling उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Call-center logs, podcasts, and multilingual transcription pipelines.",
        "hi-IN": "call-center logs, podcasts और multilingual transcription pipelines।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Legal-grade transcripts without human review.",
        "hi-IN": "human review के बिना legal-grade transcripts।",
      },
    ],
    samples: [
      { type: "text", title: "Transcript excerpt", value: "Hindi-English meeting transcript with timestamps." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.24,
      misuseTags: ["pii-leakage"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "elevenlabs-model-docs",
      sourceUrl: "https://elevenlabs.io/docs/models/",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(3),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "openai-agents-sdk",
    slug: "openai-agents-sdk",
    name: "OpenAI Agents SDK",
    summary: {
      "en-IN":
        "Framework for building tool-using, guardrailed agents with tracing and handoff patterns.",
      "hi-IN":
        "tool-using, guardrailed agents बनाने के लिए tracing और handoff patterns वाला framework।",
    },
    modality: ["agent", "code", "search", "text"],
    tags: ["agents", "openai", "orchestration", "tool-calling"],
    capabilities: {
      toolCalling: true,
      handoffs: true,
      tracing: true,
      guardrails: true,
      memoryPatterns: true,
    },
    limitations: [
      "Production governance still requires external policy and approval layers.",
      "Agent complexity can grow quickly without strict scope controls.",
    ],
    benchmarks: {
      githubStars: 19114,
      githubForks: 3174,
      activeMaintainerSignal: 92.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Start with single-agent tool orchestration before adding multi-agent handoffs.",
        "hi-IN": "multi-agent handoffs जोड़ने से पहले single-agent tool orchestration से शुरुआत करें।",
      },
      {
        "en-IN": "Instrument traces from day one for debugging and quality checks.",
        "hi-IN": "debugging और quality checks के लिए शुरुआत से traces instrument करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Developer teams building reliable tool-using agents.",
        "hi-IN": "विश्वसनीय tool-using agents बनाने वाली developer teams।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "No-code teams without engineering support.",
        "hi-IN": "engineering support के बिना no-code टीमें।",
      },
    ],
    samples: [
      {
        type: "code",
        title: "Agent handoff flow",
        value: "router agent -> research agent -> coding agent with policy checks",
      },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.4,
      misuseTags: ["automation-abuse", "tool-misfire"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openai-agents-docs",
      sourceUrl: "https://platform.openai.com/docs/guides/agents-sdk",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(4),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "google-agent-development-kit",
    slug: "google-agent-development-kit",
    name: "Google Agent Development Kit (ADK)",
    summary: {
      "en-IN":
        "Open-source toolkit for building and evaluating Gemini-powered agents and workflows.",
      "hi-IN":
        "Gemini-powered agents और workflows बनाने/मूल्यांकन के लिए open-source toolkit (ADK)।",
    },
    modality: ["agent", "code", "search"],
    tags: ["adk", "google", "agents", "gemini"],
    capabilities: {
      toolCalling: true,
      multiAgentPatterns: true,
      evalSupport: true,
      deploymentAdapters: true,
    },
    limitations: [
      "Requires engineering effort for production-grade observability and governance.",
      "Feature surface evolves quickly; pin versions in production.",
    ],
    benchmarks: {
      githubStars: 17950,
      githubForks: 2968,
      activeMaintainerSignal: 90.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Prototype with local tools first, then add external API integrations incrementally.",
        "hi-IN": "पहले local tools से prototype करें, फिर external API integrations धीरे-धीरे जोड़ें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Teams building Gemini-based multi-step agent workflows.",
        "hi-IN": "Gemini आधारित multi-step agent workflows बनाने वाली टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Organizations needing fully managed zero-code automation.",
        "hi-IN": "fully managed zero-code automation चाहने वाले organizations।",
      },
    ],
    samples: [
      { type: "code", title: "ADK flow", value: "intent router -> retriever -> planner -> executor" },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.36,
      misuseTags: ["unsafe-tooling"],
    },
    compliance: {
      license: "apache-2.0",
      commercialUse: "allowed",
    },
    provenance: {
      source: "google-adk-docs",
      sourceUrl: "https://google.github.io/adk-docs/",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(4),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "langgraph-v1-framework",
    slug: "langgraph-v1-framework",
    name: "LangGraph v1",
    summary: {
      "en-IN": "Graph-based orchestration framework for resilient long-running agents and HITL flows.",
      "hi-IN":
        "resilient long-running agents और HITL flows के लिए graph-based orchestration framework।",
    },
    modality: ["agent", "code", "search", "text"],
    tags: ["langgraph", "agents", "workflow", "hitl"],
    capabilities: {
      statefulExecution: true,
      humanApprovalSteps: true,
      durableWorkflows: true,
      toolCalling: true,
    },
    limitations: [
      "Graph design complexity rises with broad tool sets and branching conditions.",
      "Requires dedicated testing harness to prevent regression in agent paths.",
    ],
    benchmarks: {
      githubStars: 25040,
      githubForks: 4373,
      activeMaintainerSignal: 91.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Model your workflow as explicit states and transitions before writing custom tools.",
        "hi-IN": "custom tools लिखने से पहले workflow को explicit states और transitions में मॉडल करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Production agents needing persistence, retries, and human approvals.",
        "hi-IN": "persistence, retries और human approvals चाहने वाले production agents।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Simple FAQ bots that do not need stateful orchestration.",
        "hi-IN": "stateful orchestration बिना simple FAQ bots।",
      },
    ],
    samples: [
      { type: "code", title: "State graph", value: "ingest -> classify -> research -> draft -> approve" },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "high",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.34,
      misuseTags: ["automation-abuse"],
    },
    compliance: {
      license: "mit",
      commercialUse: "allowed",
    },
    provenance: {
      source: "langgraph-docs",
      sourceUrl: "https://docs.langchain.com/oss/python/langgraph/overview",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(4),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "llamaindex-agent-workflow",
    slug: "llamaindex-agent-workflow",
    name: "LlamaIndex AgentWorkflow",
    summary: {
      "en-IN":
        "LlamaIndex workflow framework for multi-agent systems with explicit handoff and tool routing.",
      "hi-IN":
        "explicit handoff और tool routing के साथ multi-agent systems के लिए LlamaIndex workflow framework।",
    },
    modality: ["agent", "code", "search", "text"],
    tags: ["llamaindex", "agentworkflow", "rag", "multi-agent"],
    capabilities: {
      agentHandoffs: true,
      toolCalling: true,
      retrievalIntegration: true,
      workflowState: true,
    },
    limitations: [
      "Complex retrieval-heavy flows need careful memory and context controls.",
      "Reliability depends on external model/tool stack quality.",
    ],
    benchmarks: {
      githubStars: 47155,
      githubForks: 6862,
      activeMaintainerSignal: 89.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Start with one retriever + one planner agent before scaling to specialist agents.",
        "hi-IN": "specialist agents तक बढ़ाने से पहले one retriever + one planner agent से शुरू करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "RAG-native agents that require structured workflow control.",
        "hi-IN": "structured workflow control वाले RAG-native agents।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Single-turn assistants with no retrieval/tool requirements.",
        "hi-IN": "retrieval/tool requirements बिना single-turn assistants।",
      },
    ],
    samples: [
      { type: "code", title: "Workflow snippet", value: "retrieve -> reason -> call tool -> verify -> respond" },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "medium",
    },
    risk: {
      safetyScore: 0.33,
      misuseTags: ["tool-misfire"],
    },
    compliance: {
      license: "mit",
      commercialUse: "allowed",
    },
    provenance: {
      source: "llamaindex-docs",
      sourceUrl: "https://docs.llamaindex.ai/en/stable/understanding/agent/multi_agent/",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(4),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "hf-qwen3-tts-12hz-1-7b-customvoice",
    slug: "hf-qwen3-tts-12hz-1-7b-customvoice",
    name: "Qwen3 TTS 12Hz 1.7B CustomVoice (HF)",
    summary: {
      "en-IN":
        "Trending open speech model on Hugging Face focused on customizable text-to-speech output.",
      "hi-IN":
        "customizable text-to-speech output वाला Hugging Face पर trending open speech मॉडल।",
    },
    modality: ["audio", "text"],
    tags: ["huggingface", "qwen3-tts", "open-model", "voice"],
    capabilities: {
      textToSpeech: true,
      customVoice: true,
      hfTrending: true,
    },
    limitations: [
      "Production-readiness depends on your own inference, moderation, and quality pipeline.",
      "License and commercial terms must be checked per model card.",
    ],
    benchmarks: {
      hfTrendingLikes: 1172,
      trendFreshnessDays: 26,
      openVoiceModelMomentum: 84.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Read model card and run small-scale eval before production integration.",
        "hi-IN": "production integration से पहले model card पढ़ें और small-scale eval चलाएं।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Teams exploring open-weight voice synthesis stacks.",
        "hi-IN": "open-weight voice synthesis stacks एक्सप्लोर करने वाली टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Immediate enterprise rollout without internal evaluation and guardrails.",
        "hi-IN": "internal evaluation और guardrails बिना immediate enterprise rollout।",
      },
    ],
    samples: [
      { type: "audio", title: "Open model voice demo", value: "Custom-voice short instruction playback." },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.52,
      misuseTags: ["voice-cloning", "impersonation"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "huggingface-trending",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "hf-nvidia-personaplex-7b-v1",
    slug: "hf-nvidia-personaplex-7b-v1",
    name: "NVIDIA PersonaPlex 7B v1 (HF)",
    summary: {
      "en-IN":
        "Trending audio-to-audio model on Hugging Face for conversational persona-style interactions.",
      "hi-IN":
        "conversational persona interactions के लिए Hugging Face का trending audio-to-audio मॉडल।",
    },
    modality: ["audio", "agent", "text"],
    tags: ["huggingface", "nvidia", "audio-to-audio", "persona"],
    capabilities: {
      audioToAudio: true,
      conversationalPersona: true,
      hfTrending: true,
    },
    limitations: [
      "Deployment quality depends on audio stack design and runtime controls.",
      "Model card policy constraints must be reviewed before commercial rollout.",
    ],
    benchmarks: {
      hfTrendingLikes: 2182,
      trendFreshnessDays: 9,
      openAudioModelMomentum: 88.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Benchmark turn latency and interruption handling on your target network.",
        "hi-IN": "target network पर turn latency और interruption handling benchmark करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Experimental voice-agent R&D with open model stacks.",
        "hi-IN": "open model stacks के साथ experimental voice-agent R&D।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Regulated production workloads without rigorous human oversight.",
        "hi-IN": "rigorous human oversight बिना regulated production workloads।",
      },
    ],
    samples: [
      { type: "audio", title: "Persona voice turn", value: "Character-style conversational reply." },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "low",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.55,
      misuseTags: ["voice-cloning", "social-engineering"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "huggingface-trending",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "openai-gpt-5-openrouter",
    slug: "openai-gpt-5-openrouter",
    name: "OpenAI GPT-5 (OpenRouter)",
    summary: {
      "en-IN":
        "Frontier model on OpenRouter with multimodal inputs and strong reasoning depth for complex tasks.",
      "hi-IN":
        "complex tasks के लिए deep reasoning और multimodal inputs वाला OpenRouter frontier मॉडल।",
    },
    modality: ["text", "code", "image"],
    tags: ["openrouter", "gpt-5", "reasoning", "multimodal"],
    capabilities: {
      contextTokens: 400000,
      supportsImageInput: true,
      supportsFileInput: true,
      toolCalling: true,
      structuredOutput: true,
    },
    limitations: [
      "Higher output token cost needs strict budget controls.",
      "For latency-sensitive UX, route simple prompts to smaller model tiers.",
    ],
    benchmarks: {
      contextWindowTokens: 400000,
      inputCostPerMUsd: 1.25,
      outputCostPerMUsd: 10.0,
      inputModalitiesCount: 3,
    },
    pricingUsd: {
      inputPerM: 1.25,
      outputPerM: 10.0,
    },
    quickstart: [
      {
        "en-IN": "Use cached system prompts and short response constraints for cost control.",
        "hi-IN": "cost control के लिए cached system prompts और short response constraints उपयोग करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Complex reasoning, coding design decisions, and high-risk analysis tasks.",
        "hi-IN": "complex reasoning, coding design decisions और high-risk analysis tasks।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Simple low-stakes chat where cheaper models are sufficient.",
        "hi-IN": "simple low-stakes chat जहां सस्ते models पर्याप्त हों।",
      },
    ],
    samples: [
      { type: "text", title: "Architecture diagnosis", value: "Pinpoint bottlenecks and propose migration strategy." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.31,
      misuseTags: ["prompt-injection"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "anthropic-claude-opus-4-1-openrouter",
    slug: "anthropic-claude-opus-4-1-openrouter",
    name: "Claude Opus 4.1 (OpenRouter)",
    summary: {
      "en-IN":
        "Premium Anthropic model in OpenRouter routing for deep analysis and high-stakes reasoning quality.",
      "hi-IN":
        "deep analysis और high-stakes reasoning quality के लिए OpenRouter पर premium Anthropic मॉडल।",
    },
    modality: ["text", "code", "image"],
    tags: ["openrouter", "claude-opus-4.1", "analysis", "premium"],
    capabilities: {
      contextTokens: 200000,
      supportsImageInput: true,
      supportsFileInput: true,
      toolCalling: true,
    },
    limitations: [
      "Premium pricing makes it unsuitable for high-volume low-value requests.",
      "Still requires robust policy checks for sensitive automation paths.",
    ],
    benchmarks: {
      contextWindowTokens: 200000,
      inputCostPerMUsd: 15.0,
      outputCostPerMUsd: 75.0,
      inputModalitiesCount: 3,
    },
    pricingUsd: {
      inputPerM: 15.0,
      outputPerM: 75.0,
    },
    quickstart: [
      {
        "en-IN": "Use selective routing so only hardest tasks reach Opus tier.",
        "hi-IN": "केवल सबसे कठिन tasks को Opus tier तक पहुंचाने के लिए selective routing रखें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Deep legal/policy analysis drafts and complex engineering reasoning.",
        "hi-IN": "deep legal/policy analysis drafts और complex engineering reasoning।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "High-throughput workloads with strict cost ceilings.",
        "hi-IN": "strict cost ceilings वाले high-throughput workloads।",
      },
    ],
    samples: [
      { type: "text", title: "Policy synthesis", value: "Summarize multi-region compliance deltas with risk flags." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.35,
      misuseTags: ["policy-bypass"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "google-gemini-2-5-pro-openrouter",
    slug: "google-gemini-2-5-pro-openrouter",
    name: "Gemini 2.5 Pro (OpenRouter)",
    summary: {
      "en-IN":
        "Large-context multimodal model for advanced analysis and tool-augmented workflows via OpenRouter.",
      "hi-IN":
        "advanced analysis और tool-augmented workflows के लिए OpenRouter का large-context multimodal मॉडल।",
    },
    modality: ["text", "code", "image", "audio", "video"],
    tags: ["openrouter", "gemini-2.5-pro", "multimodal", "analysis"],
    capabilities: {
      contextTokens: 1048576,
      supportsImageInput: true,
      supportsAudioInput: true,
      supportsVideoInput: true,
      toolCalling: true,
    },
    limitations: [
      "Complex multimodal prompts may increase latency at peak load.",
      "For routine tasks, flash-tier routing is generally more cost-effective.",
    ],
    benchmarks: {
      contextWindowTokens: 1048576,
      inputCostPerMUsd: 1.25,
      outputCostPerMUsd: 10.0,
      inputModalitiesCount: 5,
    },
    pricingUsd: {
      inputPerM: 1.25,
      outputPerM: 10.0,
    },
    quickstart: [
      {
        "en-IN": "Apply modality-aware prompting and keep media context concise.",
        "hi-IN": "modality-aware prompting अपनाएं और media context को concise रखें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Complex multimodal analysis and long-context enterprise tasks.",
        "hi-IN": "complex multimodal analysis और long-context enterprise tasks।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Simple Q&A pipelines where high context is unnecessary.",
        "hi-IN": "simple Q&A pipelines जहां high context की जरूरत नहीं है।",
      },
    ],
    samples: [
      { type: "text", title: "Multimodal audit", value: "Analyze video + transcript + policy PDF for violations." },
    ],
    integration: {
      requiresApiKey: true,
      sdkQuality: "high",
      selfHostDifficulty: "easy",
    },
    risk: {
      safetyScore: 0.33,
      misuseTags: ["prompt-injection"],
    },
    compliance: {
      license: "api-terms",
      commercialUse: "allowed",
    },
    provenance: {
      source: "openrouter-models-api",
      sourceUrl: "https://openrouter.ai/api/v1/models",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "hf-zai-glm-5",
    slug: "hf-zai-glm-5",
    name: "GLM-5 (HF Trending)",
    summary: {
      "en-IN": "Trending text-generation model on Hugging Face with strong open-community momentum.",
      "hi-IN": "मजबूत open-community momentum वाला Hugging Face का trending text-generation मॉडल।",
    },
    modality: ["text", "code"],
    tags: ["huggingface", "glm-5", "text-generation", "open-model"],
    capabilities: {
      hfTrending: true,
      supportsTextGeneration: true,
      openWeights: true,
    },
    limitations: [
      "Enterprise readiness depends on your own eval, safety, and hosting stack.",
      "Licensing must be checked directly from the model card before commercial use.",
    ],
    benchmarks: {
      hfTrendingLikes: 1507,
      trendFreshnessDays: 11,
      communityMomentum: 86.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Run task-specific eval suite locally before production adoption.",
        "hi-IN": "production adoption से पहले task-specific eval suite local में चलाएं।",
      },
    ],
    bestFor: [
      {
        "en-IN": "R&D teams exploring strong open models for text workloads.",
        "hi-IN": "text workloads के लिए मजबूत open models खोजने वाली R&D टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Regulated deployments without internal model governance.",
        "hi-IN": "internal model governance बिना regulated deployments।",
      },
    ],
    samples: [
      { type: "text", title: "Open model eval task", value: "Summarize policy and generate implementation checklist." },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.46,
      misuseTags: ["open-model-misuse"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "huggingface-trending",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(1),
    updatedAt: isoDaysAgo(0),
  },
  {
    id: "hf-minimax-m2-5",
    slug: "hf-minimax-m2-5",
    name: "MiniMax M2.5 (HF Trending)",
    summary: {
      "en-IN": "Trending text-generation model on Hugging Face with growing community adoption.",
      "hi-IN": "बढ़ती community adoption वाला Hugging Face का trending text-generation मॉडल।",
    },
    modality: ["text", "code"],
    tags: ["huggingface", "minimax-m2.5", "text-generation", "open-model"],
    capabilities: {
      hfTrending: true,
      supportsTextGeneration: true,
      openWeights: true,
    },
    limitations: [
      "Performance depends heavily on serving setup and prompt framework.",
      "Commercial usage requires explicit model card license checks.",
    ],
    benchmarks: {
      hfTrendingLikes: 903,
      trendFreshnessDays: 8,
      communityMomentum: 81.0,
    },
    pricingUsd: {
      monthly: 0,
    },
    quickstart: [
      {
        "en-IN": "Compare against existing baseline model on your internal eval set before rollout.",
        "hi-IN": "rollout से पहले अपने internal eval set पर baseline model से तुलना करें।",
      },
    ],
    bestFor: [
      {
        "en-IN": "Teams validating alternative open-text stacks for experimentation.",
        "hi-IN": "experimentation के लिए alternative open-text stacks validate करने वाली टीमें।",
      },
    ],
    avoidWhen: [
      {
        "en-IN": "Production-critical paths without fallback model routing.",
        "hi-IN": "fallback model routing बिना production-critical paths।",
      },
    ],
    samples: [
      { type: "text", title: "Prompt eval", value: "Draft technical design note with edge-case checklist." },
    ],
    integration: {
      requiresApiKey: false,
      sdkQuality: "medium",
      selfHostDifficulty: "hard",
    },
    risk: {
      safetyScore: 0.47,
      misuseTags: ["open-model-misuse"],
    },
    compliance: {
      license: "unknown",
      commercialUse: "unknown",
    },
    provenance: {
      source: "huggingface-trending",
      sourceUrl: "https://huggingface.co/api/trending?type=model",
      fetchedAt: isoDaysAgo(0),
      lastVerifiedAt: isoDaysAgo(0),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(1),
    updatedAt: isoDaysAgo(0),
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
  {
    id: "rev_8",
    listingId: "openai-gpt-5-mini-openrouter",
    userId: "user_demo_8",
    rating: 5,
    title: "Great price-performance",
    body: "Strong for coding assistant traffic with clear budget controls.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_9",
    listingId: "google-gemini-2-5-flash-openrouter",
    userId: "user_demo_9",
    rating: 4,
    title: "Fast multimodal intake",
    body: "Useful for mixed media understanding. We still route complex reasoning elsewhere.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_10",
    listingId: "elevenlabs-flash-v2-5",
    userId: "user_demo_10",
    rating: 4,
    title: "Low latency in calls",
    body: "Turn speed is strong for support bots when streaming is tuned correctly.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_11",
    listingId: "elevenlabs-scribe-v2",
    userId: "user_demo_11",
    rating: 4,
    title: "Good multilingual transcript quality",
    body: "Handles mixed Hindi-English calls well after light audio cleanup.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_12",
    listingId: "openai-agents-sdk",
    userId: "user_demo_12",
    rating: 5,
    title: "Reliable developer workflow",
    body: "Tracing plus handoffs made multi-tool orchestration much easier to debug.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_13",
    listingId: "google-agent-development-kit",
    userId: "user_demo_13",
    rating: 4,
    title: "Good agent baseline",
    body: "ADK is solid for Gemini-first agents, but we needed custom observability.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_14",
    listingId: "hf-qwen3-tts-12hz-1-7b-customvoice",
    userId: "user_demo_14",
    rating: 3,
    title: "Promising open voice model",
    body: "Useful for prototyping; production setup needed substantial infra work.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_15",
    listingId: "openai-gpt-5-openrouter",
    userId: "user_demo_15",
    rating: 5,
    title: "Great for hard reasoning",
    body: "We route only complex planning tasks here and it performs reliably.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_16",
    listingId: "anthropic-claude-opus-4-1-openrouter",
    userId: "user_demo_16",
    rating: 4,
    title: "High quality, costly",
    body: "Excellent output quality but we gate usage due premium token pricing.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_17",
    listingId: "google-gemini-2-5-pro-openrouter",
    userId: "user_demo_17",
    rating: 4,
    title: "Strong multimodal reasoning",
    body: "Handles long mixed-input workflows well when prompts are structured.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_18",
    listingId: "hf-zai-glm-5",
    userId: "user_demo_18",
    rating: 4,
    title: "Good open-model momentum",
    body: "Promising results in experiments; still needs strict eval for production.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
  {
    id: "rev_19",
    listingId: "hf-minimax-m2-5",
    userId: "user_demo_19",
    rating: 3,
    title: "Decent alternative stack",
    body: "Useful for comparative testing, but we need more internal reliability data.",
    locale: "en-IN",
    createdAt: isoDaysAgo(0),
    flagged: false,
  },
];
