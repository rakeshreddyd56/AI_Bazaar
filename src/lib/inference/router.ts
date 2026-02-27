import type { ModelCatalogEntry } from "@/lib/console/models";

export type ProviderRoute = {
  providerKey: string;
  class: "external" | "self-hosted";
  priority: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsTools: boolean;
};

const providerCatalog: Record<string, ProviderRoute> = {
  openrouter: {
    providerKey: "openrouter",
    class: "external",
    priority: 10,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
  },
  together: {
    providerKey: "together",
    class: "external",
    priority: 8,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
  },
  fireworks: {
    providerKey: "fireworks",
    class: "external",
    priority: 7,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
  },
  groq: {
    providerKey: "groq",
    class: "external",
    priority: 9,
    supportsStreaming: true,
    supportsVision: false,
    supportsTools: true,
  },
  openai: {
    providerKey: "openai",
    class: "external",
    priority: 9,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
  },
  anthropic: {
    providerKey: "anthropic",
    class: "external",
    priority: 9,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
  },
  google: {
    providerKey: "google",
    class: "external",
    priority: 9,
    supportsStreaming: true,
    supportsVision: true,
    supportsTools: true,
  },
  "self-hosted-vllm": {
    providerKey: "self-hosted-vllm",
    class: "self-hosted",
    priority: 6,
    supportsStreaming: true,
    supportsVision: false,
    supportsTools: true,
  },
};

const familyRoutes: Record<string, string[]> = {
  openai: ["openai", "openrouter"],
  anthropic: ["anthropic", "openrouter"],
  google: ["google", "openrouter"],
  qwen: ["openrouter", "together", "fireworks", "self-hosted-vllm"],
  llama: ["openrouter", "groq", "together", "self-hosted-vllm"],
  mistral: ["openrouter", "together", "fireworks", "self-hosted-vllm"],
  deepseek: ["openrouter", "together", "fireworks", "self-hosted-vllm"],
  gemma: ["openrouter", "groq", "self-hosted-vllm"],
  cohere: ["openrouter", "together"],
  xai: ["openrouter"],
  general: ["openrouter", "together", "fireworks", "groq", "self-hosted-vllm"],
};

const routeCandidates = (model: ModelCatalogEntry): ProviderRoute[] => {
  const candidates = familyRoutes[model.family] ?? familyRoutes.general;

  return candidates
    .map((entry) => providerCatalog[entry])
    .filter((entry): entry is ProviderRoute => Boolean(entry))
    .filter((entry) => {
      if (!model.supports.vision && entry.supportsVision === false) return true;
      if (model.supports.vision && !entry.supportsVision) return false;
      return true;
    })
    .sort((a, b) => b.priority - a.priority);
};

const scoreRoute = (
  route: ProviderRoute,
  model: ModelCatalogEntry,
  needs: { vision: boolean; tools: boolean; stream: boolean },
) => {
  let score = route.priority * 10;

  // Broker-first strategy prefers external providers first.
  if (route.class === "external") score += 20;

  if (needs.stream && route.supportsStreaming) score += 8;
  if (needs.tools && route.supportsTools) score += 8;
  if (needs.vision && route.supportsVision) score += 10;

  if (model.runtimeState === "warm") score += 6;
  if (model.runtimeState === "cold" && route.class === "self-hosted") score -= 7;

  return score;
};

export const chooseProviderRoute = (
  model: ModelCatalogEntry,
  needs: { vision: boolean; tools: boolean; stream: boolean },
) => {
  const candidates = routeCandidates(model);

  if (!candidates.length) {
    return {
      route: providerCatalog.openrouter,
      alternatives: [providerCatalog.together, providerCatalog.fireworks].filter(Boolean),
    };
  }

  const ranked = candidates
    .map((route) => ({
      route,
      score: scoreRoute(route, model, needs),
    }))
    .sort((a, b) => b.score - a.score);

  return {
    route: ranked[0].route,
    alternatives: ranked.slice(1).map((entry) => entry.route),
  };
};
