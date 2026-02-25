import type { Listing, ProviderInfo } from "@/lib/types";

export type BrandTarget = {
  id?: string;
  slug?: string;
  name?: string;
  source?: string;
  sourceUrl?: string;
  tags?: string[];
  providerKey?: string;
};

export type BrandInfo = ProviderInfo & {
  monogram: string;
  domain?: string;
};

type BrandRule = {
  key: string;
  tokens: string[];
};

const titleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const toMonogram = (value?: string) => {
  const clean = (value ?? "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!clean.length) return "AI";
  if (clean.length === 1) return clean[0].slice(0, 2).toUpperCase();
  return `${clean[0][0]}${clean[1][0]}`.toUpperCase();
};

const parseDomain = (value?: string) => {
  if (!value) return undefined;
  try {
    const normalized = value.includes("://") ? value : `https://${value}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

const customProviderNames: Record<string, string> = {
  "d-id": "D-ID",
  aiva: "AIVA",
  n8n: "n8n",
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  meta: "Meta",
  xai: "xAI",
  qwen: "Qwen",
  zhipu: "Zhipu AI",
  elevenlabs: "ElevenLabs",
  openrouter: "OpenRouter",
  huggingface: "Hugging Face",
  bedrock: "AWS Bedrock",
  azure: "Azure",
  vertex: "Google Vertex",
  builderio: "Builder.io",
  deepseek: "DeepSeek",
  revai: "Rev AI",
  langgraph: "LangGraph",
  langchain: "LangChain",
  llamaindex: "LlamaIndex",
  swebench: "SWE-bench",
  livebench: "LiveBench",
  promptfoo: "Promptfoo",
};

const rules: BrandRule[] = [
  { key: "openai", tokens: ["openai", "gpt", "o1", "o3", "o4", "whisper", "codex"] },
  { key: "anthropic", tokens: ["anthropic", "claude", "opus", "sonnet", "haiku"] },
  { key: "google", tokens: ["google", "gemini", "vertex", "veo", "imagen", "chirp"] },
  { key: "meta", tokens: ["meta", "llama", "audiocraft"] },
  { key: "mistral", tokens: ["mistral", "mixtral", "codestral", "devstral"] },
  { key: "deepseek", tokens: ["deepseek"] },
  { key: "xai", tokens: ["xai", "grok"] },
  { key: "cohere", tokens: ["cohere", "command-r", "command r"] },
  { key: "qwen", tokens: ["qwen", "tongyi", "alibaba"] },
  { key: "zhipu", tokens: ["zhipu", "glm", "chatglm"] },
  { key: "minimax", tokens: ["minimax", "hailuo"] },
  { key: "nvidia", tokens: ["nvidia", "nemotron", "riva"] },
  { key: "elevenlabs", tokens: ["elevenlabs"] },
  { key: "runway", tokens: ["runway"] },
  { key: "pika", tokens: ["pika"] },
  { key: "luma", tokens: ["luma", "dream machine"] },
  { key: "midjourney", tokens: ["midjourney"] },
  { key: "stability", tokens: ["stability", "stable diffusion", "sdxl"] },
  { key: "replicate", tokens: ["replicate"] },
  { key: "langgraph", tokens: ["langgraph"] },
  { key: "langchain", tokens: ["langchain", "langsmith"] },
  { key: "llamaindex", tokens: ["llamaindex"] },
  { key: "openrouter", tokens: ["openrouter"] },
  { key: "huggingface", tokens: ["huggingface", "hf-"] },
  { key: "swebench", tokens: ["swe-bench", "swebench"] },
  { key: "livebench", tokens: ["livebench"] },
  { key: "arena", tokens: ["arena.ai", "lm arena", "lmarena"] },
  { key: "helm", tokens: ["helm"] },
  { key: "artificialanalysis", tokens: ["artificial analysis", "artificialanalysis"] },
  { key: "openclaw", tokens: ["openclaw"] },
];

const signatureOf = (target: BrandTarget) =>
  [
    target.providerKey,
    target.id,
    target.slug,
    target.name,
    target.source,
    target.sourceUrl,
    ...(target.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const keyFromDomain = (domain?: string) => {
  if (!domain) return undefined;
  const stripped = domain.replace(/^www\./, "").toLowerCase();
  const matched = rules.find((rule) => rule.tokens.some((token) => stripped.includes(token)));
  if (matched) return matched.key;
  const root = stripped.split(".")[0]?.replace(/[^a-z0-9-]/g, "");
  return root || undefined;
};

const normalizeProviderKey = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-");
  return normalized.replace(/-+/g, "-");
};

export const providerByKey = (key?: string): ProviderInfo => {
  const normalized = normalizeProviderKey(key);
  if (!normalized) {
    return {
      key: "unknown",
      name: "Unknown Provider",
      logoPath: "/brand/unknown-provider.png",
    };
  }

  const label =
    customProviderNames[normalized] ?? titleCase(normalized.replace(/-/g, " "));

  return {
    key: normalized,
    name: label,
    logoPath: `/logos/providers/${normalized}.png`,
  };
};

export const resolveBrand = (target: BrandTarget): BrandInfo => {
  if (target.providerKey) {
    const provider = providerByKey(target.providerKey);
    return {
      ...provider,
      monogram: toMonogram(provider.name),
    };
  }

  const signature = signatureOf(target);
  const matched = rules.find((rule) =>
    rule.tokens.some((token) => signature.includes(token)),
  );

  if (matched) {
    const provider = providerByKey(matched.key);
    return {
      ...provider,
      monogram: toMonogram(provider.name),
    };
  }

  const sourceDomain = parseDomain(target.sourceUrl);
  if (sourceDomain) {
    const inferredKey = keyFromDomain(sourceDomain);
    const provider = providerByKey(inferredKey);
    return {
      ...provider,
      monogram: toMonogram(provider.name),
      domain: sourceDomain,
    };
  }

  const fallbackLabel = target.name?.trim() || "AI Model";
  return {
    key: "unknown",
    name: fallbackLabel,
    logoPath: "/brand/unknown-provider.png",
    monogram: toMonogram(fallbackLabel),
  };
};

export const providerFromListing = (
  listing: Pick<Listing, "id" | "slug" | "name" | "tags" | "provenance" | "provider">,
): ProviderInfo => {
  if (listing.provider?.key) {
    return providerByKey(listing.provider.key);
  }

  const resolved = resolveBrand({
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    source: listing.provenance.source,
    sourceUrl: listing.provenance.sourceUrl,
    tags: listing.tags,
  });

  return {
    key: resolved.key,
    name: resolved.name,
    logoPath: resolved.logoPath,
  };
};
