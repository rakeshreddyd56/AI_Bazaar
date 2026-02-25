import type { CategorySlug } from "@/lib/categories";
import { providerByKey } from "@/lib/branding";
import type { Intent, Listing } from "@/lib/types";
import { normalize } from "@/lib/utils";

type SeedTuple = {
  name: string;
  providerKey: string;
  sourceUrl: string;
  riskTags?: string[];
  tier?: "A" | "B";
};

type CategorySeed = {
  slug: Exclude<CategorySlug, "all">;
  modality: Intent[];
  source: string;
  tags: string[];
  entries: SeedTuple[];
  capabilityDefaults: Record<string, string | number | boolean>;
};

const now = new Date();
const isoDaysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

const catalog: CategorySeed[] = [
  {
    slug: "ai-avatars-talking-heads",
    modality: ["video", "audio", "text"],
    source: "manual-catalog",
    tags: ["avatar", "talking-head"],
    capabilityDefaults: {
      talkingHead: true,
      maxVideoDurationSec: 120,
      voiceSync: true,
      multilingualVoices: true,
    },
    entries: [
      { name: "HeyGen Avatar Studio", providerKey: "heygen", sourceUrl: "https://www.heygen.com" , riskTags:["impersonation"], tier:"A"},
      { name: "Synthesia Studio", providerKey: "synthesia", sourceUrl: "https://www.synthesia.io", tier:"A" },
      { name: "D-ID Creative Reality", providerKey: "d-id", sourceUrl: "https://www.d-id.com", riskTags:["impersonation"], tier:"A" },
      { name: "Colossyan Creator", providerKey: "colossyan", sourceUrl: "https://www.colossyan.com" },
      { name: "Elai.io Video Presenter", providerKey: "elai", sourceUrl: "https://elai.io" },
      { name: "Hour One Presenter", providerKey: "hourone", sourceUrl: "https://hourone.ai" },
      { name: "Tavus Conversational Video", providerKey: "tavus", sourceUrl: "https://www.tavus.io", riskTags:["impersonation"], tier:"A" },
      { name: "DeepBrain AI Studios", providerKey: "google", sourceUrl: "https://www.deepbrain.io" },
      { name: "Vidnoz AI Avatar", providerKey: "canva", sourceUrl: "https://www.vidnoz.com" },
      { name: "AKOOL Talking Avatar", providerKey: "google", sourceUrl: "https://akool.com", riskTags:["deepfake"] },
      { name: "Pipio Avatar", providerKey: "google", sourceUrl: "https://www.pipio.ai" },
      { name: "Rephrase AI", providerKey: "google", sourceUrl: "https://www.rephrase.ai" },
      { name: "Movio AI Spokesperson", providerKey: "google", sourceUrl: "https://www.movio.la" },
      { name: "Captions AI Avatar", providerKey: "google", sourceUrl: "https://www.captions.ai" },
      { name: "Soul Machines Digital Human", providerKey: "google", sourceUrl: "https://www.soulmachines.com" },
    ],
  },
  {
    slug: "video-generation",
    modality: ["video", "image", "text"],
    source: "manual-catalog",
    tags: ["video", "text-to-video"],
    capabilityDefaults: {
      maxVideoDurationSec: 20,
      maxResolution: "1080p",
      fps: 24,
      supportsImageToVideo: true,
      cameraControl: true,
    },
    entries: [
      { name: "Runway Gen-4 Turbo", providerKey: "runway", sourceUrl: "https://runwayml.com", tier:"A" },
      { name: "Pika 2.2", providerKey: "pika", sourceUrl: "https://pika.art", tier:"A" },
      { name: "Luma Dream Machine", providerKey: "luma", sourceUrl: "https://lumalabs.ai/dream-machine", tier:"A" },
      { name: "Kling 2.1", providerKey: "qwen", sourceUrl: "https://klingai.com" },
      { name: "Veo 3 Studio", providerKey: "google", sourceUrl: "https://deepmind.google/technologies/veo", tier:"A" },
      { name: "OpenAI Sora", providerKey: "openai", sourceUrl: "https://openai.com/sora", tier:"A" },
      { name: "Hailuo MiniMax Video", providerKey: "minimax", sourceUrl: "https://www.minimax.io" },
      { name: "PixVerse V4", providerKey: "google", sourceUrl: "https://pixverse.ai" },
      { name: "Haiper Video", providerKey: "google", sourceUrl: "https://haiper.ai" },
      { name: "Stable Video Diffusion", providerKey: "stability", sourceUrl: "https://stability.ai" },
      { name: "Vidu Studio", providerKey: "qwen", sourceUrl: "https://www.vidu.com" },
      { name: "Genmo Mochi", providerKey: "huggingface", sourceUrl: "https://www.genmo.ai" },
      { name: "Krea Video", providerKey: "google", sourceUrl: "https://www.krea.ai" },
      { name: "Descript Scenes", providerKey: "google", sourceUrl: "https://www.descript.com" },
      { name: "invideo AI", providerKey: "google", sourceUrl: "https://invideo.io" },
      { name: "CapCut AI Video", providerKey: "google", sourceUrl: "https://www.capcut.com" },
      { name: "Adobe Firefly Video", providerKey: "adobe", sourceUrl: "https://www.adobe.com/products/firefly.html" },
      { name: "Sora via OpenRouter", providerKey: "openrouter", sourceUrl: "https://openrouter.ai" },
      { name: "Filmora AI Video", providerKey: "google", sourceUrl: "https://filmora.wondershare.com" },
      { name: "Wonder Studio", providerKey: "google", sourceUrl: "https://wonderdynamics.com" },
    ],
  },
  {
    slug: "image-generation-design",
    modality: ["image", "text"],
    source: "manual-catalog",
    tags: ["image", "design"],
    capabilityDefaults: {
      maxResolution: "2048x2048",
      supportsInpainting: true,
      styleControl: true,
      typographyAccuracy: 78,
    },
    entries: [
      { name: "Midjourney V7", providerKey: "midjourney", sourceUrl: "https://www.midjourney.com", tier:"A" },
      { name: "FLUX.1 Pro", providerKey: "huggingface", sourceUrl: "https://huggingface.co/black-forest-labs", tier:"A" },
      { name: "OpenAI GPT Image", providerKey: "openai", sourceUrl: "https://platform.openai.com/docs/guides/images", tier:"A" },
      { name: "Imagen 4", providerKey: "google", sourceUrl: "https://deepmind.google/technologies/imagen", tier:"A" },
      { name: "Stable Diffusion XL", providerKey: "stability", sourceUrl: "https://stability.ai" },
      { name: "Ideogram 3", providerKey: "ideogram", sourceUrl: "https://ideogram.ai", tier:"A" },
      { name: "Recraft v3", providerKey: "canva", sourceUrl: "https://www.recraft.ai" },
      { name: "Leonardo Phoenix", providerKey: "leonardo", sourceUrl: "https://leonardo.ai", tier:"A" },
      { name: "Adobe Firefly Image 3", providerKey: "adobe", sourceUrl: "https://www.adobe.com/products/firefly.html", tier:"A" },
      { name: "Playground v3", providerKey: "huggingface", sourceUrl: "https://playground.com" },
      { name: "Canva Magic Media", providerKey: "canva", sourceUrl: "https://www.canva.com" },
      { name: "Krea Image", providerKey: "google", sourceUrl: "https://www.krea.ai" },
      { name: "Dreamina", providerKey: "qwen", sourceUrl: "https://dreamina.capcut.com" },
      { name: "SeaArt Studio", providerKey: "huggingface", sourceUrl: "https://www.seaart.ai" },
      { name: "Bing Image Creator", providerKey: "openai", sourceUrl: "https://www.bing.com/images/create" },
      { name: "Meta Emu Image", providerKey: "meta", sourceUrl: "https://ai.meta.com" },
      { name: "Qwen Image", providerKey: "qwen", sourceUrl: "https://tongyi.aliyun.com" },
      { name: "Black Forest Labs Schnell", providerKey: "huggingface", sourceUrl: "https://huggingface.co/black-forest-labs" },
      { name: "Clipdrop", providerKey: "stability", sourceUrl: "https://clipdrop.co" },
      { name: "Photoroom Generate", providerKey: "google", sourceUrl: "https://www.photoroom.com" },
      { name: "Shakker AI", providerKey: "huggingface", sourceUrl: "https://www.shakker.ai" },
      { name: "PicLumen", providerKey: "google", sourceUrl: "https://www.piclumen.com" },
    ],
  },
  {
    slug: "svg-vector-brand-design",
    modality: ["image", "text"],
    source: "manual-catalog",
    tags: ["svg", "vector", "logo"],
    capabilityDefaults: {
      outputsValidSvg: true,
      layerNaming: true,
      editableVectors: true,
      brandStyleLock: true,
    },
    entries: [
      { name: "SVGSmith Studio", providerKey: "canva", sourceUrl: "https://www.svgsmith.com" },
      { name: "Recraft Vector", providerKey: "canva", sourceUrl: "https://www.recraft.ai", tier:"A" },
      { name: "Illustroke", providerKey: "illustroke", sourceUrl: "https://illustroke.com" },
      { name: "Vectorizer AI", providerKey: "vectorizer", sourceUrl: "https://vectorizer.ai" },
      { name: "Adobe Illustrator Firefly", providerKey: "adobe", sourceUrl: "https://www.adobe.com/products/illustrator.html", tier:"A" },
      { name: "Canva Logo Maker", providerKey: "canva", sourceUrl: "https://www.canva.com/logo-maker" },
      { name: "Kittl AI Vector", providerKey: "kittl", sourceUrl: "https://www.kittl.com" },
      { name: "Figma AI Vector", providerKey: "figma", sourceUrl: "https://www.figma.com" },
      { name: "Logo Diffusion", providerKey: "stability", sourceUrl: "https://logodiffusion.com" },
      { name: "Vector Art by Ideogram", providerKey: "ideogram", sourceUrl: "https://ideogram.ai" },
    ],
  },
  {
    slug: "voice-tts-voice-cloning",
    modality: ["audio", "text"],
    source: "manual-catalog",
    tags: ["voice", "tts", "voice-cloning"],
    capabilityDefaults: {
      textToSpeech: true,
      voiceCloning: true,
      realtimeStreaming: true,
      supportedLanguages: 22,
    },
    entries: [
      { name: "ElevenLabs v3", providerKey: "elevenlabs", sourceUrl: "https://elevenlabs.io", riskTags:["voice-cloning", "impersonation"], tier:"A" },
      { name: "PlayHT 2.0", providerKey: "playht", sourceUrl: "https://play.ht", riskTags:["voice-cloning"], tier:"A" },
      { name: "Cartesia Sonic", providerKey: "cartesia", sourceUrl: "https://cartesia.ai", tier:"A" },
      { name: "OpenAI TTS", providerKey: "openai", sourceUrl: "https://platform.openai.com/docs/guides/text-to-speech", tier:"A" },
      { name: "Google Chirp 3", providerKey: "google", sourceUrl: "https://cloud.google.com/text-to-speech" },
      { name: "Azure Neural TTS", providerKey: "azure", sourceUrl: "https://azure.microsoft.com/products/ai-services/ai-speech" },
      { name: "Murf AI", providerKey: "murf", sourceUrl: "https://murf.ai" },
      { name: "Resemble AI", providerKey: "resemble", sourceUrl: "https://www.resemble.ai", riskTags:["voice-cloning"] },
      { name: "Speechify Studio", providerKey: "google", sourceUrl: "https://speechify.com" },
      { name: "Rime Voice", providerKey: "google", sourceUrl: "https://www.rime.ai" },
      { name: "WellSaid Labs", providerKey: "google", sourceUrl: "https://www.wellsaidlabs.com" },
      { name: "Lovo Genny", providerKey: "google", sourceUrl: "https://lovo.ai" },
      { name: "Coqui XTTS", providerKey: "huggingface", sourceUrl: "https://coqui.ai", riskTags:["voice-cloning"] },
      { name: "Fish Audio", providerKey: "huggingface", sourceUrl: "https://fish.audio", riskTags:["voice-cloning"] },
      { name: "Bark Large", providerKey: "suno", sourceUrl: "https://github.com/suno-ai/bark" },
      { name: "Meta Voicebox", providerKey: "meta", sourceUrl: "https://ai.meta.com/research" },
      { name: "NVIDIA Riva TTS", providerKey: "nvidia", sourceUrl: "https://developer.nvidia.com/riva" },
      { name: "Qwen Omni Voice", providerKey: "qwen", sourceUrl: "https://tongyi.aliyun.com" },
    ],
  },
  {
    slug: "speech-stt-translation-dubbing",
    modality: ["audio", "text"],
    source: "manual-catalog",
    tags: ["speech-to-text", "translation", "dubbing"],
    capabilityDefaults: {
      speechToText: true,
      realtimeStreaming: true,
      speakerDiarization: true,
      translation: true,
    },
    entries: [
      { name: "OpenAI Whisper Large v3", providerKey: "openai", sourceUrl: "https://openai.com/research/whisper", tier:"A" },
      { name: "Deepgram Nova-3", providerKey: "deepgram", sourceUrl: "https://deepgram.com", tier:"A" },
      { name: "AssemblyAI Universal-2", providerKey: "assemblyai", sourceUrl: "https://www.assemblyai.com", tier:"A" },
      { name: "Speechmatics Real-Time", providerKey: "speechmatics", sourceUrl: "https://www.speechmatics.com", tier:"A" },
      { name: "Rev AI Speech", providerKey: "revai", sourceUrl: "https://www.rev.ai" },
      { name: "Soniox STT", providerKey: "soniox", sourceUrl: "https://soniox.com" },
      { name: "Sarvam Indic Speech", providerKey: "sarvam", sourceUrl: "https://www.sarvam.ai", tier:"A" },
      { name: "Google Speech V2", providerKey: "google", sourceUrl: "https://cloud.google.com/speech-to-text" },
      { name: "Azure Speech to Text", providerKey: "azure", sourceUrl: "https://azure.microsoft.com/products/ai-services/ai-speech" },
      { name: "Gladia Speech API", providerKey: "google", sourceUrl: "https://www.gladia.io" },
      { name: "NVIDIA Riva ASR", providerKey: "nvidia", sourceUrl: "https://developer.nvidia.com/riva" },
      { name: "ElevenLabs Dubbing", providerKey: "elevenlabs", sourceUrl: "https://elevenlabs.io/dubbing", riskTags:["voice-cloning"] },
      { name: "Papercup Dubbing", providerKey: "google", sourceUrl: "https://www.papercup.com" },
      { name: "HeyGen Video Translate", providerKey: "heygen", sourceUrl: "https://www.heygen.com" , riskTags:["impersonation"]},
    ],
  },
  {
    slug: "music-sound-fx",
    modality: ["audio", "text"],
    source: "manual-catalog",
    tags: ["music", "sound-fx"],
    capabilityDefaults: {
      musicGeneration: true,
      stemControl: true,
      promptToMusic: true,
      commercialTrackExport: true,
    },
    entries: [
      { name: "Suno v4", providerKey: "suno", sourceUrl: "https://suno.com", tier:"A" },
      { name: "Udio 2", providerKey: "udio", sourceUrl: "https://udio.com", tier:"A" },
      { name: "Stable Audio 2", providerKey: "stability", sourceUrl: "https://stability.ai/stable-audio" },
      { name: "AIVA Composer", providerKey: "aiva", sourceUrl: "https://www.aiva.ai" },
      { name: "Boomy Studio", providerKey: "boomy", sourceUrl: "https://boomy.com" },
      { name: "Soundraw", providerKey: "soundraw", sourceUrl: "https://soundraw.io" },
      { name: "Mubert", providerKey: "google", sourceUrl: "https://mubert.com" },
      { name: "Riffusion", providerKey: "huggingface", sourceUrl: "https://www.riffusion.com" },
      { name: "Meta AudioCraft", providerKey: "meta", sourceUrl: "https://github.com/facebookresearch/audiocraft" },
      { name: "ElevenLabs SFX", providerKey: "elevenlabs", sourceUrl: "https://elevenlabs.io/sound-effects" },
    ],
  },
  {
    slug: "llm-foundation-models",
    modality: ["text", "code", "image", "audio"],
    source: "openrouter-models-api",
    tags: ["llm", "foundation"],
    capabilityDefaults: {
      contextTokens: 128000,
      toolCalling: true,
      structuredOutput: true,
      supportsImageInput: true,
    },
    entries: [
      { name: "OpenAI GPT-5", providerKey: "openai", sourceUrl: "https://openai.com", tier:"A" },
      { name: "OpenAI GPT-4.1", providerKey: "openai", sourceUrl: "https://openai.com" },
      { name: "Claude Opus 4.1", providerKey: "anthropic", sourceUrl: "https://anthropic.com", tier:"A" },
      { name: "Claude Sonnet 4", providerKey: "anthropic", sourceUrl: "https://anthropic.com", tier:"A" },
      { name: "Gemini 2.5 Pro", providerKey: "google", sourceUrl: "https://deepmind.google", tier:"A" },
      { name: "Gemini 2.5 Flash", providerKey: "google", sourceUrl: "https://deepmind.google" },
      { name: "DeepSeek R1", providerKey: "deepseek", sourceUrl: "https://deepseek.com", tier:"A" },
      { name: "DeepSeek V3.1", providerKey: "deepseek", sourceUrl: "https://deepseek.com", tier:"A" },
      { name: "Qwen3 Max", providerKey: "qwen", sourceUrl: "https://tongyi.aliyun.com", tier:"A" },
      { name: "Qwen3 235B", providerKey: "qwen", sourceUrl: "https://tongyi.aliyun.com" },
      { name: "Llama 4 Maverick", providerKey: "meta", sourceUrl: "https://ai.meta.com", tier:"A" },
      { name: "Llama 4 Scout", providerKey: "meta", sourceUrl: "https://ai.meta.com" },
      { name: "Mistral Large 2", providerKey: "mistral", sourceUrl: "https://mistral.ai" },
      { name: "Mixtral 8x22B", providerKey: "mistral", sourceUrl: "https://mistral.ai" },
      { name: "Grok 4", providerKey: "xai", sourceUrl: "https://x.ai", tier:"A" },
      { name: "Cohere Command R+", providerKey: "cohere", sourceUrl: "https://cohere.com" },
      { name: "Cohere Command A", providerKey: "cohere", sourceUrl: "https://cohere.com" },
      { name: "Jamba 1.6", providerKey: "nvidia", sourceUrl: "https://developer.nvidia.com" },
      { name: "GLM-5", providerKey: "zhipu", sourceUrl: "https://zhipuai.cn" },
      { name: "MiniMax M2.5", providerKey: "minimax", sourceUrl: "https://minimax.io" },
      { name: "Yi Large", providerKey: "qwen", sourceUrl: "https://01.ai" },
      { name: "Kimi K2", providerKey: "qwen", sourceUrl: "https://kimi.moonshot.cn" },
      { name: "Nemotron Ultra", providerKey: "nvidia", sourceUrl: "https://developer.nvidia.com" },
      { name: "Phi-4", providerKey: "microsoft", sourceUrl: "https://www.microsoft.com" },
      { name: "Gemma 3 27B", providerKey: "google", sourceUrl: "https://ai.google.dev" },
      { name: "OLMo 2 32B", providerKey: "huggingface", sourceUrl: "https://huggingface.co/allenai" },
      { name: "OpenRouter Quasar", providerKey: "openrouter", sourceUrl: "https://openrouter.ai" },
      { name: "AWS Nova Pro", providerKey: "bedrock", sourceUrl: "https://aws.amazon.com/ai/generative-ai/nova" },
      { name: "Perplexity Sonar Large", providerKey: "perplexity", sourceUrl: "https://perplexity.ai" },
      { name: "Hugging Face Zephyr 2", providerKey: "huggingface", sourceUrl: "https://huggingface.co" },
      { name: "xAI Grok Mini", providerKey: "xai", sourceUrl: "https://x.ai" },
      { name: "Anthropic Claude 3.7 Sonnet", providerKey: "anthropic", sourceUrl: "https://anthropic.com" },
    ],
  },
  {
    slug: "coding-models",
    modality: ["code", "text"],
    source: "swebench",
    tags: ["code", "coding"],
    capabilityDefaults: {
      codeGeneration: true,
      toolCalling: true,
      repoContextAware: true,
      sweBenchReady: true,
    },
    entries: [
      { name: "GPT-5 Codex", providerKey: "openai", sourceUrl: "https://openai.com", tier:"A" },
      { name: "Claude Code 4", providerKey: "anthropic", sourceUrl: "https://anthropic.com", tier:"A" },
      { name: "DeepSeek Coder V3", providerKey: "deepseek", sourceUrl: "https://deepseek.com", tier:"A" },
      { name: "Qwen3 Coder 480B", providerKey: "qwen", sourceUrl: "https://tongyi.aliyun.com", tier:"A" },
      { name: "Gemini Code Pro", providerKey: "google", sourceUrl: "https://deepmind.google" },
      { name: "Codestral 25.08", providerKey: "mistral", sourceUrl: "https://mistral.ai" },
      { name: "Devstral", providerKey: "mistral", sourceUrl: "https://mistral.ai" },
      { name: "CodeLlama 70B", providerKey: "meta", sourceUrl: "https://ai.meta.com" },
      { name: "StarCoder2 15B", providerKey: "huggingface", sourceUrl: "https://huggingface.co" },
      { name: "Replit Code V1", providerKey: "replit", sourceUrl: "https://replit.com" },
      { name: "Cohere Command R Code", providerKey: "cohere", sourceUrl: "https://cohere.com" },
      { name: "OpenRouter Code Ranker", providerKey: "openrouter", sourceUrl: "https://openrouter.ai" },
      { name: "NVIDIA Nemotron Code", providerKey: "nvidia", sourceUrl: "https://developer.nvidia.com" },
      { name: "GLM Code 4", providerKey: "zhipu", sourceUrl: "https://zhipuai.cn" },
      { name: "Gemma Code 2", providerKey: "google", sourceUrl: "https://ai.google.dev" },
      { name: "CodeQwen 1.5", providerKey: "qwen", sourceUrl: "https://qwenlm.github.io" },
      { name: "Llama 4 Code", providerKey: "meta", sourceUrl: "https://ai.meta.com" },
      { name: "OpenClaw Code Agent", providerKey: "openclaw", sourceUrl: "https://openclaw.ai", riskTags:["impersonation", "policy-bypass"], tier:"A" },
    ],
  },
  {
    slug: "agent-frameworks",
    modality: ["agent", "code", "text", "search"],
    source: "manual-catalog",
    tags: ["agent", "framework"],
    capabilityDefaults: {
      toolCalling: true,
      statefulExecution: true,
      multiAgentCoordination: true,
      humanApprovalSteps: true,
    },
    entries: [
      { name: "LangGraph v1", providerKey: "langgraph", sourceUrl: "https://langchain.com/langgraph", tier:"A" },
      { name: "OpenAI Agents SDK", providerKey: "openai", sourceUrl: "https://platform.openai.com/docs/agents", tier:"A" },
      { name: "Google Agent Development Kit", providerKey: "google", sourceUrl: "https://google.github.io/adk-docs/", tier:"A" },
      { name: "CrewAI", providerKey: "crewai", sourceUrl: "https://www.crewai.com" },
      { name: "Microsoft AutoGen", providerKey: "azure", sourceUrl: "https://microsoft.github.io/autogen/", tier:"A" },
      { name: "Semantic Kernel", providerKey: "azure", sourceUrl: "https://learn.microsoft.com/semantic-kernel" },
      { name: "LlamaIndex Workflows", providerKey: "llamaindex", sourceUrl: "https://www.llamaindex.ai" },
      { name: "PydanticAI", providerKey: "openai", sourceUrl: "https://ai.pydantic.dev" },
      { name: "DSPy", providerKey: "openai", sourceUrl: "https://dspy.ai" },
      { name: "Smolagents", providerKey: "huggingface", sourceUrl: "https://huggingface.co/docs/smolagents" },
      { name: "Haystack Agents", providerKey: "google", sourceUrl: "https://haystack.deepset.ai" },
      { name: "CAMEL-AI", providerKey: "google", sourceUrl: "https://www.camel-ai.org" },
      { name: "MetaGPT", providerKey: "meta", sourceUrl: "https://github.com/geekan/MetaGPT" },
      { name: "OpenClaw Agent Core", providerKey: "openclaw", sourceUrl: "https://openclaw.ai", riskTags:["impersonation", "social-engineering", "policy-bypass"], tier:"A" },
      { name: "LangChain Agents", providerKey: "langchain", sourceUrl: "https://python.langchain.com" },
      { name: "OpenDevin", providerKey: "huggingface", sourceUrl: "https://github.com/OpenDevin/OpenDevin" },
      { name: "Rivet Agent Workbench", providerKey: "google", sourceUrl: "https://rivet.ironcladapp.com" },
      { name: "Dynamiq", providerKey: "google", sourceUrl: "https://dynamiq.ai" },
    ],
  },
  {
    slug: "search-rag-apis",
    modality: ["search", "text", "code"],
    source: "manual-catalog",
    tags: ["search", "rag"],
    capabilityDefaults: {
      retrievalPrecision: 82,
      citationCoverage: 78,
      hybridSearch: true,
      rerankerSupport: true,
    },
    entries: [
      { name: "Tavily Search API", providerKey: "tavily", sourceUrl: "https://tavily.com", tier:"A" },
      { name: "Exa API", providerKey: "exa", sourceUrl: "https://exa.ai", tier:"A" },
      { name: "Perplexity Search API", providerKey: "perplexity", sourceUrl: "https://perplexity.ai" },
      { name: "Jina Reader + Search", providerKey: "jina", sourceUrl: "https://jina.ai" },
      { name: "SerpAPI", providerKey: "google", sourceUrl: "https://serpapi.com" },
      { name: "Brave Search API", providerKey: "google", sourceUrl: "https://search.brave.com" },
      { name: "Cohere Rerank", providerKey: "cohere", sourceUrl: "https://cohere.com/rerank", tier:"A" },
      { name: "Pinecone Inference Search", providerKey: "pinecone", sourceUrl: "https://pinecone.io" },
      { name: "Weaviate Hybrid Search", providerKey: "weaviate", sourceUrl: "https://weaviate.io" },
      { name: "Qdrant Query API", providerKey: "qdrant", sourceUrl: "https://qdrant.tech" },
      { name: "Milvus Vector Search", providerKey: "milvus", sourceUrl: "https://milvus.io" },
      { name: "Elasticsearch Vector", providerKey: "elasticsearch", sourceUrl: "https://elastic.co" },
      { name: "Vespa Ranking API", providerKey: "vespa", sourceUrl: "https://vespa.ai" },
      { name: "Azure AI Search", providerKey: "azure", sourceUrl: "https://azure.microsoft.com/products/ai-services/ai-search" },
    ],
  },
  {
    slug: "website-app-builders",
    modality: ["agent", "code", "text", "image"],
    source: "manual-catalog",
    tags: ["builder", "website", "app"],
    capabilityDefaults: {
      noCodeSupport: true,
      deployFromPrompt: true,
      componentGeneration: true,
      hostingIntegration: true,
    },
    entries: [
      { name: "Vercel v0", providerKey: "vercel", sourceUrl: "https://v0.dev", tier:"A" },
      { name: "Bolt.new", providerKey: "bolt", sourceUrl: "https://bolt.new", tier:"A" },
      { name: "Replit Agent", providerKey: "replit", sourceUrl: "https://replit.com/ai", tier:"A" },
      { name: "Lovable", providerKey: "lovable", sourceUrl: "https://lovable.dev", tier:"A" },
      { name: "Framer AI", providerKey: "framer", sourceUrl: "https://framer.com" },
      { name: "Webflow AI", providerKey: "webflow", sourceUrl: "https://webflow.com" },
      { name: "Bubble AI", providerKey: "bubble", sourceUrl: "https://bubble.io" },
      { name: "Wix AI Site Builder", providerKey: "wix", sourceUrl: "https://wix.com" },
      { name: "Builder.io AI", providerKey: "builderio", sourceUrl: "https://builder.io" },
      { name: "Dora AI", providerKey: "google", sourceUrl: "https://www.dora.run/ai" },
    ],
  },
  {
    slug: "workflow-automation-agents",
    modality: ["agent", "search", "code", "text"],
    source: "manual-catalog",
    tags: ["workflow", "automation", "agent"],
    capabilityDefaults: {
      workflowState: true,
      integrationsCount: 100,
      humanApprovalSteps: true,
      toolCalling: true,
    },
    entries: [
      { name: "Zapier AI Agents", providerKey: "zapier", sourceUrl: "https://zapier.com/ai", tier:"A" },
      { name: "Make AI", providerKey: "make", sourceUrl: "https://make.com" },
      { name: "n8n AI", providerKey: "n8n", sourceUrl: "https://n8n.io" },
      { name: "Pipedream AI", providerKey: "pipedream", sourceUrl: "https://pipedream.com" },
      { name: "Bardeen", providerKey: "bardeen", sourceUrl: "https://bardeen.ai" },
      { name: "IFTTT AI", providerKey: "ifttt", sourceUrl: "https://ifttt.com" },
      { name: "Langflow Deploy", providerKey: "langflow", sourceUrl: "https://langflow.org" },
      { name: "Gumloop", providerKey: "gumloop", sourceUrl: "https://gumloop.com" },
      { name: "Lindy", providerKey: "lindy", sourceUrl: "https://lindy.ai" },
      { name: "OpenClaw CLI", providerKey: "openclaw", sourceUrl: "https://openclaw.ai", riskTags:["social-engineering", "policy-bypass"] },
    ],
  },
  {
    slug: "eval-observability-safety",
    modality: ["text", "code", "agent", "search"],
    source: "manual-catalog",
    tags: ["eval", "observability", "safety"],
    capabilityDefaults: {
      evalHarness: true,
      promptTracing: true,
      policyChecks: true,
      regressionMonitoring: true,
    },
    entries: [
      { name: "LangSmith", providerKey: "langsmith", sourceUrl: "https://www.langchain.com/langsmith", tier:"A" },
      { name: "Helicone", providerKey: "helicone", sourceUrl: "https://www.helicone.ai", tier:"A" },
      { name: "Arize Phoenix", providerKey: "arize", sourceUrl: "https://arize.com/phoenix" },
      { name: "Braintrust Eval", providerKey: "braintrust", sourceUrl: "https://braintrustdata.com" },
      { name: "Promptfoo", providerKey: "promptfoo", sourceUrl: "https://promptfoo.dev" },
      { name: "Guardrails AI", providerKey: "guardrails", sourceUrl: "https://guardrailsai.com" },
      { name: "Truera", providerKey: "arize", sourceUrl: "https://truera.com" },
      { name: "Galileo Eval", providerKey: "google", sourceUrl: "https://www.galileo.ai" },
    ],
  },
  {
    slug: "inference-hosting-platforms",
    modality: ["text", "image", "video", "audio", "code", "agent"],
    source: "manual-catalog",
    tags: ["inference", "hosting", "platform"],
    capabilityDefaults: {
      globalPoPs: true,
      autoscaling: true,
      modelRouting: true,
      latencyP95Ms: 420,
    },
    entries: [
      { name: "OpenRouter", providerKey: "openrouter", sourceUrl: "https://openrouter.ai", tier:"A" },
      { name: "Together AI", providerKey: "together", sourceUrl: "https://together.ai", tier:"A" },
      { name: "Replicate", providerKey: "replicate", sourceUrl: "https://replicate.com", tier:"A" },
      { name: "GroqCloud", providerKey: "groq", sourceUrl: "https://groq.com" },
      { name: "Fireworks AI", providerKey: "fireworks", sourceUrl: "https://fireworks.ai" },
      { name: "AWS Bedrock", providerKey: "bedrock", sourceUrl: "https://aws.amazon.com/bedrock" },
      { name: "Google Vertex AI", providerKey: "vertex", sourceUrl: "https://cloud.google.com/vertex-ai" },
      { name: "Azure AI Foundry", providerKey: "azure", sourceUrl: "https://azure.microsoft.com/products/ai-foundry" },
      { name: "OpenAI API Platform", providerKey: "openai", sourceUrl: "https://platform.openai.com" },
      { name: "Anthropic API Platform", providerKey: "anthropic", sourceUrl: "https://console.anthropic.com" },
      { name: "Hugging Face Inference Endpoints", providerKey: "huggingface", sourceUrl: "https://huggingface.co/inference-endpoints" },
      { name: "Cloudflare Workers AI", providerKey: "cloudflare", sourceUrl: "https://developers.cloudflare.com/workers-ai" },
    ],
  },
  {
    slug: "data-synthetic-data",
    modality: ["text", "image", "video", "audio", "code"],
    source: "manual-catalog",
    tags: ["data", "synthetic-data"],
    capabilityDefaults: {
      syntheticData: true,
      piiRedaction: true,
      dataGovernance: true,
      qualityScoring: true,
    },
    entries: [
      { name: "Scale GenAI Data Engine", providerKey: "scale", sourceUrl: "https://scale.com", tier:"A" },
      { name: "Snorkel Flow", providerKey: "snorkel", sourceUrl: "https://snorkel.ai" },
      { name: "Gretel Navigator", providerKey: "gretel", sourceUrl: "https://gretel.ai" },
      { name: "Mostly AI", providerKey: "mostlyai", sourceUrl: "https://mostly.ai" },
      { name: "Tonic Fabricate", providerKey: "tonic", sourceUrl: "https://tonic.ai" },
      { name: "Datagen", providerKey: "datagen", sourceUrl: "https://datagen.tech" },
      { name: "Hazy", providerKey: "hazy", sourceUrl: "https://hazy.com" },
      { name: "Synthesis AI", providerKey: "synthesis", sourceUrl: "https://synthesis.ai" },
      { name: "Humanloop Data Studio", providerKey: "humanloop", sourceUrl: "https://humanloop.com" },
    ],
  },
];

const benchmarkScore = (index: number, tier: "A" | "B") => {
  const base = tier === "A" ? 78 : 62;
  return Number((base + (index % 17) * 1.1).toFixed(2));
};

const monthlyPrice = (index: number, tier: "A" | "B") => {
  if (tier === "A") return Number((39 + (index % 9) * 12).toFixed(2));
  return Number((19 + (index % 7) * 8).toFixed(2));
};

const perMPrice = (index: number, tier: "A" | "B") => {
  if (tier === "A") {
    return {
      inputPerM: Number((0.3 + (index % 11) * 0.2).toFixed(2)),
      outputPerM: Number((1.2 + (index % 13) * 0.5).toFixed(2)),
    };
  }

  return {
    inputPerM: Number((0.05 + (index % 9) * 0.08).toFixed(2)),
    outputPerM: Number((0.2 + (index % 9) * 0.16).toFixed(2)),
  };
};

const licenseFor = (providerKey: string) => {
  if (["huggingface", "meta", "qwen", "mistral"].includes(providerKey)) return "mixed-open";
  if (["openrouter", "openai", "anthropic", "google", "elevenlabs"].includes(providerKey)) return "api-terms";
  return "proprietary";
};

const commercialUseFor = (providerKey: string): "allowed" | "restricted" | "unknown" => {
  if (["huggingface", "meta", "qwen"].includes(providerKey)) return "unknown";
  if (["openclaw"].includes(providerKey)) return "restricted";
  return "allowed";
};

const summaryFor = (name: string, category: CategorySeed["slug"]) => ({
  "en-IN": `${name} listed under ${category.replace(/-/g, " ")} for AI Bazaar discovery and comparison workflows.`,
  "hi-IN": `${name} को AI Bazaar में ${category.replace(/-/g, " ")} श्रेणी में discover और compare करने के लिए जोड़ा गया है।`,
});

const quickstartFor = (name: string) => [
  {
    "en-IN": `Review ${name} docs and configure keys/workspace before production usage.`,
    "hi-IN": `${name} को production में उपयोग करने से पहले docs देखें और keys/workspace configure करें।`,
  },
  {
    "en-IN": "Run a constrained pilot with clear quality and safety checks.",
    "hi-IN": "स्पष्ट quality और safety checks के साथ constrained pilot चलाएं।",
  },
];

const bestForFor = (category: CategorySeed["slug"]) => [
  {
    "en-IN": `Teams evaluating the latest ${category.replace(/-/g, " ")} options with side-by-side comparison.`,
    "hi-IN": `${category.replace(/-/g, " ")} विकल्पों का side-by-side मूल्यांकन करने वाली टीमें।`,
  },
];

const avoidFor = [
  {
    "en-IN": "Regulated production rollout without internal policy review and testing.",
    "hi-IN": "internal policy review और testing के बिना regulated production rollout।",
  },
];

const samplesFor = (name: string, category: CategorySeed["slug"]) => {
  if (category.includes("video") || category.includes("avatar")) {
    return [{ type: "video" as const, title: `${name} demo`, value: "Short campaign-ready render." }];
  }
  if (category.includes("voice") || category.includes("speech") || category.includes("music")) {
    return [{ type: "audio" as const, title: `${name} audio sample`, value: "Low-latency generated audio output." }];
  }
  if (category.includes("coding") || category.includes("agent")) {
    return [{ type: "code" as const, title: `${name} code sample`, value: "Task decomposition and tool-assisted implementation." }];
  }
  if (category.includes("svg")) {
    return [{ type: "svg" as const, title: `${name} vector sample`, value: "Editable SVG with grouped layers." }];
  }

  return [{ type: "text" as const, title: `${name} output sample`, value: "Structured response with actionable next steps." }];
};

const capabilityTweaks = (
  category: CategorySeed["slug"],
): Record<string, string | number | boolean> => {
  if (category === "llm-foundation-models") return { contextTokens: 200000, reasoningScore: 87 };
  if (category === "coding-models") return { swebenchResolved: 52, repoPatchQuality: 81 };
  if (category === "search-rag-apis") return { citationCoverage: 82, retrievalPrecision: 84 };
  if (category === "voice-tts-voice-cloning") return { latencyMsClaim: 220, voiceCloning: true };
  if (category === "video-generation") return { temporalConsistency: 79, maxVideoDurationSec: 18 };
  return {};
};

const secondariesFor = (category: CategorySeed["slug"]): CategorySlug[] => {
  const map: Record<CategorySeed["slug"], CategorySlug[]> = {
    "ai-avatars-talking-heads": ["video-generation", "voice-tts-voice-cloning"],
    "video-generation": ["image-generation-design"],
    "image-generation-design": ["svg-vector-brand-design"],
    "svg-vector-brand-design": ["image-generation-design"],
    "voice-tts-voice-cloning": ["speech-stt-translation-dubbing"],
    "speech-stt-translation-dubbing": ["voice-tts-voice-cloning"],
    "music-sound-fx": ["voice-tts-voice-cloning"],
    "llm-foundation-models": ["coding-models", "agent-frameworks"],
    "coding-models": ["llm-foundation-models", "agent-frameworks"],
    "agent-frameworks": ["workflow-automation-agents", "search-rag-apis"],
    "search-rag-apis": ["inference-hosting-platforms", "agent-frameworks"],
    "website-app-builders": ["workflow-automation-agents"],
    "workflow-automation-agents": ["agent-frameworks"],
    "eval-observability-safety": ["agent-frameworks", "coding-models"],
    "inference-hosting-platforms": ["llm-foundation-models", "search-rag-apis"],
    "data-synthetic-data": ["eval-observability-safety"],
  };

  return map[category];
};

const createListing = (
  entry: SeedTuple,
  category: CategorySeed,
  index: number,
): Listing => {
  const tier = entry.tier ?? (index % 3 === 0 ? "A" : "B");
  const id = normalize(`${entry.providerKey}-${entry.name}`);
  const provider = providerByKey(entry.providerKey);
  const baseTags = [...category.tags, entry.providerKey, provider.name.toLowerCase().replace(/\s+/g, "-")];

  return {
    id,
    slug: id,
    name: entry.name,
    summary: summaryFor(entry.name, category.slug),
    modality: category.modality,
    tags: baseTags,
    capabilities: {
      ...category.capabilityDefaults,
      ...capabilityTweaks(category.slug),
    },
    limitations: [
      "Benchmark results can vary across prompts, regions, and deployment settings.",
      "Production use should include safety, cost, and regression monitoring checks.",
    ],
    benchmarks: {
      overallQuality: benchmarkScore(index, tier),
      reliabilityIndex: benchmarkScore(index + 7, tier),
      benchmarkDepth: benchmarkScore(index + 3, tier),
    },
    pricingUsd: {
      ...perMPrice(index, tier),
      monthly: monthlyPrice(index, tier),
    },
    quickstart: quickstartFor(entry.name),
    bestFor: bestForFor(category.slug),
    avoidWhen: avoidFor,
    samples: samplesFor(entry.name, category.slug),
    integration: {
      requiresApiKey: true,
      sdkQuality: tier === "A" ? "high" : "medium",
      selfHostDifficulty: tier === "A" ? "medium" : "hard",
    },
    risk: {
      safetyScore: tier === "A" ? 0.38 : 0.48,
      misuseTags: entry.riskTags ?? [],
    },
    compliance: {
      license: licenseFor(entry.providerKey),
      commercialUse: commercialUseFor(entry.providerKey),
    },
    categoryPrimary: category.slug,
    categorySecondary: secondariesFor(category.slug),
    provider,
    provenance: {
      source: category.source,
      sourceUrl: entry.sourceUrl,
      fetchedAt: isoDaysAgo(index % 4),
      lastVerifiedAt: isoDaysAgo(index % 6),
    },
    published: true,
    status: "verified",
    createdAt: isoDaysAgo(12 + (index % 12)),
    updatedAt: isoDaysAgo(index % 5),
  };
};

export const generatedCatalogueListings = (existing: Listing[]) => {
  const existingIds = new Set(existing.map((listing) => listing.id));
  const existingNames = new Set(existing.map((listing) => normalize(listing.name)));
  const output: Listing[] = [];

  for (const category of catalog) {
    category.entries.forEach((entry, index) => {
      const generated = createListing(entry, category, index);
      const nameKey = normalize(generated.name);
      if (existingIds.has(generated.id)) return;
      if (existingNames.has(nameKey)) return;
      existingIds.add(generated.id);
      existingNames.add(nameKey);
      output.push(generated);
    });
  }

  return output;
};

const categoryKeywordRules: Array<{
  slug: Exclude<CategorySlug, "all">;
  tokens: string[];
}> = [
  { slug: "ai-avatars-talking-heads", tokens: ["avatar", "talking-head", "digital-human"] },
  { slug: "video-generation", tokens: ["video", "text-to-video", "image-to-video", "veo", "sora"] },
  { slug: "image-generation-design", tokens: ["image", "poster", "design", "firefly", "midjourney", "flux"] },
  { slug: "svg-vector-brand-design", tokens: ["svg", "vector", "logo", "brand-design"] },
  { slug: "voice-tts-voice-cloning", tokens: ["tts", "voice", "voice-cloning", "voice-clone"] },
  { slug: "speech-stt-translation-dubbing", tokens: ["stt", "speech", "asr", "transcription", "dubbing", "translation"] },
  { slug: "music-sound-fx", tokens: ["music", "sound", "sfx", "udio", "suno"] },
  { slug: "llm-foundation-models", tokens: ["llm", "foundation", "chat", "reasoning", "gpt", "claude", "gemini"] },
  { slug: "coding-models", tokens: ["code", "coder", "coding", "swebench", "devstral", "codestral"] },
  { slug: "agent-frameworks", tokens: ["agent", "framework", "autogen", "langgraph", "adk", "orchestration"] },
  { slug: "search-rag-apis", tokens: ["rag", "search", "retrieval", "rerank", "vector-db"] },
  { slug: "website-app-builders", tokens: ["builder", "website", "app", "v0", "bolt", "replit", "lovable"] },
  { slug: "workflow-automation-agents", tokens: ["workflow", "automation", "zapier", "n8n", "make"] },
  { slug: "eval-observability-safety", tokens: ["eval", "observability", "safety", "tracing", "monitoring"] },
  { slug: "inference-hosting-platforms", tokens: ["inference", "hosting", "platform", "serverless", "deploy"] },
  { slug: "data-synthetic-data", tokens: ["synthetic", "data", "labeling", "dataset", "annotation"] },
];

export const inferCategoryForListing = (listing: Listing): Exclude<CategorySlug, "all"> => {
  const signature = [listing.name, ...listing.tags, listing.provenance.source, listing.summary["en-IN"]]
    .join(" ")
    .toLowerCase();

  for (const rule of categoryKeywordRules) {
    if (rule.tokens.some((token) => signature.includes(token))) {
      return rule.slug;
    }
  }

  if (listing.modality.includes("video")) return "video-generation";
  if (listing.modality.includes("audio")) return "voice-tts-voice-cloning";
  if (listing.modality.includes("code")) return "coding-models";
  if (listing.modality.includes("agent")) return "agent-frameworks";
  if (listing.modality.includes("search")) return "search-rag-apis";
  if (listing.modality.includes("image")) return "image-generation-design";

  return "llm-foundation-models";
};

export const inferSecondaryCategories = (
  primary: Exclude<CategorySlug, "all">,
  listing: Listing,
): CategorySlug[] => {
  const extra = new Set<CategorySlug>();
  if (listing.modality.includes("agent")) extra.add("agent-frameworks");
  if (listing.modality.includes("video")) extra.add("video-generation");
  if (listing.modality.includes("audio")) extra.add("voice-tts-voice-cloning");
  if (listing.modality.includes("search")) extra.add("search-rag-apis");
  if (listing.modality.includes("image")) extra.add("image-generation-design");
  if (listing.modality.includes("code")) extra.add("coding-models");

  extra.delete(primary);
  return [...extra].slice(0, 3);
};
