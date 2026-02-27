import { categoryDefinitions } from "@/lib/categories";
import { providerFromListing } from "@/lib/branding";
import { publishedListings } from "@/lib/data/store";
import type { CapabilityKey, Listing, ModelRuntimeMeta, RuntimeState } from "@/lib/types";
import { clamp, tokenize } from "@/lib/utils";

export type ModelCatalogEntry = ModelRuntimeMeta & {
  name: string;
  description: string;
  modelClass: "open" | "closed";
  providerKey: string;
  tags: string[];
  modalities: string[];
  source: string;
  sourceUrl: string;
  listingSlug?: string;
  heavyClass: boolean;
  benchmarkHighlights: Array<{ name: string; value: number }>;
  parameterSupport: {
    temperature: boolean;
    top_p: boolean;
    top_k: boolean;
    min_p: boolean;
    max_tokens: boolean;
    frequency_penalty: boolean;
    presence_penalty: boolean;
    stop: boolean;
    seed: boolean;
    tools: boolean;
    vision: boolean;
    stream: boolean;
    response_format_json: boolean;
  };
};

const familyTokens: Array<{ family: string; tokens: string[] }> = [
  { family: "openai", tokens: ["gpt", "openai", "o1", "o3", "o4", "codex", "whisper"] },
  { family: "anthropic", tokens: ["claude", "anthropic"] },
  { family: "qwen", tokens: ["qwen", "tongyi"] },
  { family: "llama", tokens: ["llama", "meta"] },
  { family: "deepseek", tokens: ["deepseek"] },
  { family: "mistral", tokens: ["mistral", "mixtral", "codestral"] },
  { family: "gemma", tokens: ["gemma"] },
  { family: "google", tokens: ["gemini", "google", "veo", "imagen"] },
  { family: "xai", tokens: ["xai", "grok"] },
  { family: "cohere", tokens: ["cohere", "command-r"] },
  { family: "stability", tokens: ["stable", "stability"] },
  { family: "runway", tokens: ["runway"] },
  { family: "elevenlabs", tokens: ["elevenlabs"] },
];

const runtimeFromHash = (value: string): RuntimeState => {
  const hash = [...value].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const score = hash % 100;
  if (score < 72) return "warm";
  if (score < 90) return "loading";
  return "cold";
};

const familyFromListing = (listing: Listing) => {
  const haystack = [listing.name, ...listing.tags, listing.provenance.source].join(" ").toLowerCase();
  for (const entry of familyTokens) {
    if (entry.tokens.some((token) => haystack.includes(token))) {
      return entry.family;
    }
  }
  return "general";
};

const hasSignal = (listing: Listing, keys: string[]) =>
  keys.some((key) => {
    const value = listing.capabilities[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return false;
  });

const supportsFromListing = (
  listing: Listing,
): Record<CapabilityKey, boolean> => {
  const visionSignal =
    listing.modality.includes("image") ||
    listing.modality.includes("video") ||
    hasSignal(listing, ["supportsImageInput", "supportsVideoInput", "supportsVision"]);

  const toolsSignal =
    listing.modality.includes("agent") ||
    hasSignal(listing, ["toolCalling", "functionCalling", "agentHandoffs", "workflowState"]);

  const jsonSignal = hasSignal(listing, ["structuredOutput", "jsonMode", "jsonOutput"]);

  return {
    tools: toolsSignal,
    vision: visionSignal,
    json_mode: jsonSignal,
    streaming: true,
    completion: listing.modality.includes("text") || listing.modality.includes("code"),
  };
};

const maxOutputTokensFromListing = (listing: Listing) => {
  const direct = listing.capabilities.maxOutputTokens;
  if (typeof direct === "number") return clamp(Math.round(direct), 512, 131072);

  const context = listing.capabilities.contextTokens;
  if (typeof context === "number" && context > 0) {
    return clamp(Math.round(context / 8), 2048, 65536);
  }

  return 8192;
};

const contextLengthFromListing = (listing: Listing) => {
  const direct = listing.capabilities.contextTokens;
  if (typeof direct === "number" && direct > 0) return Math.round(direct);

  const minimumContext = listing.capabilities.minContextTokens;
  if (typeof minimumContext === "number" && minimumContext > 0) return Math.round(minimumContext);

  if (listing.modality.includes("code")) return 200000;
  return 128000;
};

const modelClassFromListing = (listing: Listing): "open" | "closed" => {
  const haystack = [listing.name, ...listing.tags, listing.compliance.license].join(" ").toLowerCase();
  const openSignals = ["open", "apache", "mit", "llama", "qwen", "mistral", "deepseek"];
  return openSignals.some((signal) => haystack.includes(signal)) ? "open" : "closed";
};

const isHeavyModel = (entry: Pick<ModelCatalogEntry, "contextLength" | "pricingUsd" | "family">) => {
  if (entry.contextLength >= 200000) return true;
  const outputCost = entry.pricingUsd?.outputPerM ?? 0;
  if (outputCost >= 12) return true;
  return ["openai", "anthropic"].includes(entry.family);
};

const parameterSupportFromEntry = (
  listing: Listing,
  supports: Record<CapabilityKey, boolean>,
) => {
  const advancedSampler = listing.modality.includes("text") || listing.modality.includes("code");

  return {
    temperature: advancedSampler,
    top_p: advancedSampler,
    top_k: supports.completion,
    min_p: supports.completion,
    max_tokens: true,
    frequency_penalty: supports.completion,
    presence_penalty: supports.completion,
    stop: supports.completion,
    seed: supports.completion,
    tools: supports.tools,
    vision: supports.vision,
    stream: supports.streaming,
    response_format_json: supports.json_mode,
  };
};

const benchmarkHighlights = (listing: Listing) =>
  Object.entries(listing.benchmarks)
    .filter(([, value]) => Number.isFinite(value))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, value]) => ({ name, value }));

const listingToModel = (listing: Listing): ModelCatalogEntry => {
  const provider = listing.provider ?? providerFromListing(listing);
  const family = familyFromListing(listing);
  const supports = supportsFromListing(listing);
  const contextLength = contextLengthFromListing(listing);
  const maxOutputTokens = maxOutputTokensFromListing(listing);

  const entry: ModelCatalogEntry = {
    modelId: listing.id,
    name: listing.name,
    description: listing.summary["en-IN"],
    family,
    provider: provider.name,
    providerKey: provider.key,
    contextLength,
    maxOutputTokens,
    runtimeState: runtimeFromHash(listing.id),
    supports,
    pricingUsd: listing.pricingUsd,
    modelClass: modelClassFromListing(listing),
    tags: [...listing.tags],
    modalities: [...listing.modality],
    source: listing.provenance.source,
    sourceUrl: listing.provenance.sourceUrl,
    listingSlug: listing.slug,
    heavyClass: false,
    benchmarkHighlights: benchmarkHighlights(listing),
    parameterSupport: parameterSupportFromEntry(listing, supports),
  };

  entry.heavyClass = isHeavyModel(entry);
  return entry;
};

const extraSeeds: Array<Omit<ModelCatalogEntry, "heavyClass">> = [
  {
    modelId: "google-gemma-3-27b-it",
    name: "Gemma 3 27B Instruct",
    family: "gemma",
    provider: "Google",
    providerKey: "google",
    contextLength: 131072,
    maxOutputTokens: 16384,
    runtimeState: "warm",
    supports: {
      tools: true,
      vision: false,
      json_mode: true,
      streaming: true,
      completion: true,
    },
    pricingUsd: { inputPerM: 0.16, outputPerM: 0.5 },
    description: "Open-weight instruction model optimized for cost-efficient coding and multilingual tasks.",
    modelClass: "open",
    tags: ["gemma", "open-weight", "instruction"],
    modalities: ["text", "code"],
    source: "manual-registry",
    sourceUrl: "https://ai.google.dev/gemma",
    benchmarkHighlights: [
      { name: "reasoningComposite", value: 82.7 },
      { name: "codingScore", value: 79.3 },
    ],
    parameterSupport: {
      temperature: true,
      top_p: true,
      top_k: true,
      min_p: true,
      max_tokens: true,
      frequency_penalty: true,
      presence_penalty: true,
      stop: true,
      seed: true,
      tools: true,
      vision: false,
      stream: true,
      response_format_json: true,
    },
  },
  {
    modelId: "meta-llama-3-3-70b-instruct",
    name: "Llama 3.3 70B Instruct",
    family: "llama",
    provider: "Meta",
    providerKey: "meta",
    contextLength: 128000,
    maxOutputTokens: 16384,
    runtimeState: "warm",
    supports: {
      tools: true,
      vision: false,
      json_mode: true,
      streaming: true,
      completion: true,
    },
    pricingUsd: { inputPerM: 0.59, outputPerM: 0.79 },
    description: "Strong open foundation model for agentic pipelines and coding assistance.",
    modelClass: "open",
    tags: ["llama", "open-weight", "agent"],
    modalities: ["text", "code", "agent"],
    source: "manual-registry",
    sourceUrl: "https://ai.meta.com/llama/",
    benchmarkHighlights: [
      { name: "reasoningComposite", value: 84.1 },
      { name: "toolUse", value: 81.8 },
    ],
    parameterSupport: {
      temperature: true,
      top_p: true,
      top_k: true,
      min_p: true,
      max_tokens: true,
      frequency_penalty: true,
      presence_penalty: true,
      stop: true,
      seed: true,
      tools: true,
      vision: false,
      stream: true,
      response_format_json: true,
    },
  },
];

let cachedModels: ModelCatalogEntry[] | null = null;

const dedupeModels = (items: ModelCatalogEntry[]) => {
  const map = new Map<string, ModelCatalogEntry>();
  for (const item of items) {
    if (!map.has(item.modelId)) {
      map.set(item.modelId, item);
      continue;
    }

    const existing = map.get(item.modelId)!;
    if (existing.runtimeState === "cold" && item.runtimeState !== "cold") {
      map.set(item.modelId, item);
    }
  }
  return [...map.values()];
};

export const consoleModels = () => {
  if (cachedModels) return cachedModels;

  const fromListings = publishedListings().map((listing) => listingToModel(listing));
  const withSeeds = dedupeModels([...fromListings, ...extraSeeds.map((entry) => ({
    ...entry,
    heavyClass: isHeavyModel(entry),
  }))]);

  cachedModels = withSeeds.sort((a, b) => a.name.localeCompare(b.name));
  return cachedModels;
};

export const modelById = (modelId: string) =>
  consoleModels().find((model) => model.modelId === modelId);

export const listFamilies = () => {
  const families = new Set<string>(consoleModels().map((entry) => entry.family));
  return [...families].sort((a, b) => a.localeCompare(b));
};

export const listCapabilities = (): CapabilityKey[] => [
  "tools",
  "vision",
  "json_mode",
  "streaming",
  "completion",
];

export type ModelQuery = {
  family?: string;
  capability?: CapabilityKey;
  state?: RuntimeState;
  limit?: number;
  cursor?: string;
};

const decodeCursor = (cursor?: string) => {
  if (!cursor) return 0;
  const parsed = Number(cursor);
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.floor(parsed));
};

export const queryModels = (query: ModelQuery) => {
  let entries = consoleModels();

  const family = query.family?.toLowerCase();
  if (family) {
    entries = entries.filter((entry) => entry.family === family);
  }

  if (query.capability) {
    entries = entries.filter((entry) => entry.supports[query.capability ?? "completion"]);
  }

  if (query.state) {
    entries = entries.filter((entry) => entry.runtimeState === query.state);
  }

  const offset = decodeCursor(query.cursor);
  const limit = clamp(query.limit ?? 20, 1, 100);
  const page = entries.slice(offset, offset + limit);
  const nextOffset = offset + page.length;
  const hasMore = nextOffset < entries.length;

  return {
    total: entries.length,
    data: page,
    hasMore,
    nextCursor: hasMore ? String(nextOffset) : null,
  };
};

export const modelCompatibilityMatrix = (entry: ModelCatalogEntry) => ({
  modelId: entry.modelId,
  family: entry.family,
  supports: entry.supports,
  parameters: entry.parameterSupport,
  integrationTargets: [
    "OpenAI SDK",
    "Cursor",
    "Cline",
    "Roo Code",
    "Aider",
    "OpenWebUI",
    "LangChain",
    "LlamaIndex",
  ],
});

export const inferBestCategoriesForModel = (entry: ModelCatalogEntry) => {
  const tokens = tokenize([entry.name, ...entry.tags, ...entry.modalities].join(" "));

  const ranked = categoryDefinitions
    .filter((category) => category.slug !== "all")
    .map((category) => {
      const score = tokenize(category.slug).reduce((sum, token) => {
        if (tokens.includes(token)) return sum + 1;
        return sum;
      }, 0);

      return {
        slug: category.slug,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((entryScore) => entryScore.slug);

  return ranked;
};

export const listHeavyModelIds = () =>
  consoleModels()
    .filter((entry) => entry.heavyClass)
    .map((entry) => entry.modelId);
