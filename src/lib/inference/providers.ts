import type { ModelCatalogEntry } from "@/lib/console/models";
import type { ProviderRoute } from "@/lib/inference/router";
import { clamp } from "@/lib/utils";

export type ProviderChatInput = {
  route: ProviderRoute;
  model: ModelCatalogEntry;
  prompt: string;
  maxTokens: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
};

export type ProviderTextInput = {
  route: ProviderRoute;
  model: ModelCatalogEntry;
  prompt: string;
  maxTokens: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
};

export type ProviderOutput = {
  text: string;
  finishReason: "stop" | "length";
  latencyMs: number;
};

const deterministicLatency = (routeKey: string, modelId: string) => {
  const hash = [...`${routeKey}:${modelId}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 180 + (hash % 420);
};

const summarizePrompt = (prompt: string, maxChars = 180) => {
  if (prompt.length <= maxChars) return prompt;
  return `${prompt.slice(0, maxChars - 3)}...`;
};

const truncateTokens = (input: string, maxTokens: number) => {
  const maxChars = clamp(maxTokens * 4, 24, 3200);
  if (input.length <= maxChars) return input;
  return `${input.slice(0, maxChars - 3)}...`;
};

const composeSyntheticAnswer = (
  provider: string,
  model: ModelCatalogEntry,
  prompt: string,
  maxTokens: number,
) => {
  const lower = prompt.toLowerCase();

  if (lower.includes("json") || lower.includes("schema")) {
    const payload = {
      provider,
      model: model.modelId,
      summary: summarizePrompt(prompt, 96),
      guidance: "Use deterministic prompts and validate outputs against your schema before production rollout.",
    };

    return truncateTokens(JSON.stringify(payload, null, 2), maxTokens);
  }

  const response = [
    `Provider route: ${provider}`,
    `Model: ${model.name} (${model.modelId})`,
    "",
    "Response:",
    "For your request, prioritize clear constraints, expected output format, and a fallback path for reliability.",
    `Prompt summary: ${summarizePrompt(prompt, 140)}`,
  ].join("\n");

  return truncateTokens(response, maxTokens);
};

export const runChatProvider = async (input: ProviderChatInput): Promise<ProviderOutput> => {
  const latencyMs = deterministicLatency(input.route.providerKey, input.model.modelId);
  const text = composeSyntheticAnswer(
    input.route.providerKey,
    input.model,
    input.prompt,
    input.maxTokens,
  );

  return {
    text,
    finishReason: text.endsWith("...") ? "length" : "stop",
    latencyMs,
  };
};

export const runTextProvider = async (input: ProviderTextInput): Promise<ProviderOutput> => {
  const latencyMs = deterministicLatency(input.route.providerKey, input.model.modelId);
  const text = composeSyntheticAnswer(
    input.route.providerKey,
    input.model,
    input.prompt,
    input.maxTokens,
  );

  return {
    text,
    finishReason: text.endsWith("...") ? "length" : "stop",
    latencyMs,
  };
};
