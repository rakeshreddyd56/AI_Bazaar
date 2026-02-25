import type { Intent } from "@/lib/types";
import { tokenize } from "@/lib/utils";

const intentKeywords: Record<Intent, string[]> = {
  text: ["chat", "llm", "writing", "text", "reasoning", "qa", "foundation model"],
  image: [
    "image",
    "img",
    "photo",
    "logo",
    "design",
    "poster",
    "svg",
    "icon",
    "vector",
    "illustration",
  ],
  video: [
    "video",
    "reel",
    "clip",
    "text-to-video",
    "text to video",
    "ads",
    "cinematic",
    "avatar",
    "talking head",
  ],
  audio: ["audio", "voice", "tts", "speech", "music", "dubbing", "stt", "asr", "voice clone"],
  code: ["code", "coding", "developer", "repo", "bug", "swe"],
  agent: ["agent", "autonomous", "tool-calling", "workflow", "automation", "orchestration"],
  search: ["search", "retrieval", "rag", "web", "citations", "rerank"],
};

export type IntentParseResult = {
  intent: Intent;
  confidence: number;
  tokens: string[];
  capabilityFilters: Record<string, string | number | boolean>;
};

const parseDuration = (query: string) => {
  const match = query.match(/(\d+(?:\.\d+)?)\s*(sec|secs|second|seconds|min|mins|minute|minutes)\b/i);
  if (!match) return undefined;
  const raw = Number(match[1]);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("min")) return Math.round(raw * 60);
  return Math.round(raw);
};

const parseResolution = (query: string) => {
  const res = query.match(/\b(4k|2k|1080p|720p|480p)\b/i);
  return res?.[1]?.toLowerCase();
};

const parseContext = (query: string) => {
  const context = query.match(/(\d+)\s*(k|m)\s*(tokens|token|context)/i);
  if (!context) return undefined;
  const value = Number(context[1]);
  return context[2].toLowerCase() === "m" ? value * 1_000_000 : value * 1_000;
};

export const inferIntent = (query: string): IntentParseResult => {
  const normalized = query.toLowerCase();
  const tokens = tokenize(normalized);

  let bestIntent: Intent = "text";
  let bestScore = 0;

  for (const [intent, words] of Object.entries(intentKeywords) as [Intent, string[]][]) {
    const score = words.reduce((acc, keyword) => {
      if (normalized.includes(keyword)) return acc + 1;
      return acc;
    }, 0);

    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  const capabilityFilters: Record<string, string | number | boolean> = {};
  const duration = parseDuration(normalized);
  const resolution = parseResolution(normalized);
  const context = parseContext(normalized);

  if (duration) capabilityFilters.minDurationSec = duration;
  if (resolution) capabilityFilters.resolution = resolution;
  if (context) capabilityFilters.minContextTokens = context;

  if (normalized.includes("svg")) {
    bestIntent = "image";
    capabilityFilters.outputsValidSvg = true;
  }
  if (normalized.includes("best") || normalized.includes("top")) {
    capabilityFilters.prefersTopRanked = true;
  }

  const confidence = Math.min(0.98, 0.45 + bestScore * 0.12);

  return {
    intent: bestIntent,
    confidence,
    tokens,
    capabilityFilters,
  };
};
