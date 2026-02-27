import { modelById, queryModels, type ModelCatalogEntry } from "@/lib/console/models";
import { recordRequestError, recordUsage } from "@/lib/console/store";
import type { ActorContext } from "@/lib/inference/auth";
import { runChatProvider, runTextProvider } from "@/lib/inference/providers";
import { evaluateQuota } from "@/lib/inference/quota";
import { chooseProviderRoute } from "@/lib/inference/router";
import {
  countTokens,
  normalizeMessageText,
  promptTokenEstimateFromCompletionPrompt,
  promptTokenEstimateFromMessages,
  type ChatMessage,
} from "@/lib/inference/tokenizer";
import { clamp, id } from "@/lib/utils";

type ChatTool = {
  type?: string;
  function?: {
    name?: string;
    description?: string;
    parameters?: unknown;
  };
};

type ChatRequestInput = {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  tools?: ChatTool[];
  tool_choice?: string | { type?: string; function?: { name?: string } };
  response_format?: { type?: "text" | "json_object" };
};

type CompletionRequestInput = {
  model: string;
  prompt: string | string[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string | string[];
};

export type EngineError = {
  ok: false;
  status: number;
  code: string;
  message: string;
  retryAfterSec?: number;
};

export type ChatRunSuccess = {
  ok: true;
  id: string;
  created: number;
  model: string;
  provider: string;
  runtimeState: ModelCatalogEntry["runtimeState"];
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason: "stop" | "length" | "tool_calls";
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  latencyMs: number;
  xAiBazaar: {
    provider_route: string;
    runtime_state: ModelCatalogEntry["runtimeState"];
    quota_remaining: {
      requests: number;
      inputTokens: number;
      outputTokens: number;
    };
  };
};

export type CompletionRunSuccess = {
  ok: true;
  id: string;
  created: number;
  model: string;
  provider: string;
  runtimeState: ModelCatalogEntry["runtimeState"];
  choices: Array<{
    index: number;
    text: string;
    finish_reason: "stop" | "length";
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  latencyMs: number;
  xAiBazaar: {
    provider_route: string;
    runtime_state: ModelCatalogEntry["runtimeState"];
    quota_remaining: {
      requests: number;
      inputTokens: number;
      outputTokens: number;
    };
  };
};

const invalidModelError = (modelId: string): EngineError => ({
  ok: false,
  status: 404,
  code: "model_not_found",
  message: `Model '${modelId}' is not available in AI Bazaar runtime registry.`,
});

const unsupportedError = (message: string): EngineError => ({
  ok: false,
  status: 400,
  code: "unsupported_request",
  message,
});

const shouldTriggerToolCall = (
  prompt: string,
  tools: ChatTool[] | undefined,
  toolChoice: ChatRequestInput["tool_choice"],
) => {
  if (!tools || tools.length === 0) return false;

  if (typeof toolChoice === "string") {
    if (toolChoice === "none") return false;
    if (toolChoice === "required") return true;
  }

  if (toolChoice && typeof toolChoice === "object") {
    if (toolChoice.type === "function" && toolChoice.function?.name) return true;
  }

  const lowered = prompt.toLowerCase();
  return ["tool", "weather", "search", "function", "api"].some((token) => lowered.includes(token));
};

const selectToolName = (
  tools: ChatTool[] | undefined,
  toolChoice: ChatRequestInput["tool_choice"],
) => {
  if (toolChoice && typeof toolChoice === "object" && toolChoice.function?.name) {
    return toolChoice.function.name;
  }

  const first = tools?.find((tool) => tool.function?.name);
  return first?.function?.name ?? "lookup";
};

const normalizeMessages = (messages: ChatMessage[]) =>
  messages.map((message) => {
    const normalized = normalizeMessageText(message.content);
    return {
      role: message.role,
      text: normalized.text,
      imageCount: normalized.imageCount,
    };
  });

const lastUserMessage = (messages: ReturnType<typeof normalizeMessages>) => {
  const reversed = [...messages].reverse();
  return reversed.find((entry) => entry.role === "user")?.text ?? "";
};

const responseFormatJson = (responseFormat: ChatRequestInput["response_format"]) =>
  responseFormat?.type === "json_object";

const maybeJsonWrap = (text: string, asJson: boolean) => {
  if (!asJson) return text;
  return JSON.stringify(
    {
      answer: text,
      safety: "Validate model outputs before production use.",
    },
    null,
    2,
  );
};

const completionBudget = (requested: number | undefined, model: ModelCatalogEntry) =>
  clamp(requested ?? Math.min(512, model.maxOutputTokens), 32, model.maxOutputTokens);

const visionRequested = (messages: ReturnType<typeof normalizeMessages>) =>
  messages.some((entry) => entry.imageCount > 0);

const usageBlock = (promptTokens: number, completionTokens: number) => ({
  prompt_tokens: promptTokens,
  completion_tokens: completionTokens,
  total_tokens: promptTokens + completionTokens,
});

const toQuotaError = (
  actor: ActorContext,
  model: string,
  decision: Extract<ReturnType<typeof evaluateQuota>, { allowed: false }>,
): EngineError => {
  recordRequestError({
    orgId: actor.orgId,
    userId: actor.userId,
    modelId: model,
    statusCode: decision.status,
    errorCode: decision.code,
  });

  return {
    ok: false,
    status: decision.status,
    code: decision.code,
    message: decision.message,
    retryAfterSec: decision.retryAfterSec,
  };
};

export const runChatCompletion = async (
  actor: ActorContext,
  input: ChatRequestInput,
): Promise<ChatRunSuccess | EngineError> => {
  const model = modelById(input.model);
  if (!model) return invalidModelError(input.model);

  if (!model.supports.completion) {
    return unsupportedError("Selected model does not support text completions.");
  }

  const normalizedMessages = normalizeMessages(input.messages ?? []);
  if (!normalizedMessages.length) {
    return unsupportedError("At least one message is required.");
  }

  const wantsVision = visionRequested(normalizedMessages);
  if (wantsVision && !model.supports.vision) {
    return unsupportedError("Model does not support vision inputs.");
  }

  const wantsTools = Boolean(input.tools?.length);
  if (wantsTools && !model.supports.tools) {
    return unsupportedError("Model does not support tool calling.");
  }

  const promptText = normalizedMessages
    .map((entry) => `${entry.role}: ${entry.text}`.trim())
    .join("\n");

  const promptTokens = promptTokenEstimateFromMessages(input.messages ?? []);
  const maxTokens = completionBudget(input.max_tokens, model);

  const quota = evaluateQuota({
    orgId: actor.orgId,
    userId: actor.userId,
    promptTokens,
    expectedOutputTokens: maxTokens,
    heavyModel: model.heavyClass,
  });

  if (!quota.allowed) {
    return toQuotaError(actor, model.modelId, quota);
  }

  const route = chooseProviderRoute(model, {
    stream: Boolean(input.stream),
    tools: wantsTools,
    vision: wantsVision,
  });

  const startedAt = Date.now();

  try {
    const provider = await runChatProvider({
      route: route.route,
      model,
      prompt: promptText,
      maxTokens,
      temperature: input.temperature,
      topP: input.top_p,
      stream: input.stream,
    });

    const triggerTool = shouldTriggerToolCall(lastUserMessage(normalizedMessages), input.tools, input.tool_choice);
    const requestId = `chatcmpl_${id("aibz")}`;
    const created = Math.floor(Date.now() / 1000);

    let completionTokens = 0;
    let finishReason: "stop" | "length" | "tool_calls" = provider.finishReason;
    let content: string | null = maybeJsonWrap(provider.text, responseFormatJson(input.response_format));
    let toolCalls:
      | Array<{
          id: string;
          type: "function";
          function: {
            name: string;
            arguments: string;
          };
        }>
      | undefined;

    if (triggerTool) {
      const toolName = selectToolName(input.tools, input.tool_choice);
      const userPrompt = lastUserMessage(normalizedMessages);
      toolCalls = [
        {
          id: `call_${id("tool")}`,
          type: "function",
          function: {
            name: toolName,
            arguments: JSON.stringify(
              {
                query: userPrompt.slice(0, 240),
                org: actor.orgId,
              },
              null,
              0,
            ),
          },
        },
      ];
      content = null;
      finishReason = "tool_calls";
      completionTokens = countTokens(toolCalls[0].function.arguments) + 10;
    } else {
      completionTokens = countTokens(content ?? "");
    }

    const latencyMs = Date.now() - startedAt + provider.latencyMs;

    recordUsage({
      orgId: actor.orgId,
      userId: actor.userId,
      keyId: actor.keyId,
      modelId: model.modelId,
      provider: route.route.providerKey,
      statusCode: 200,
      latencyMs,
      inputTokens: promptTokens,
      outputTokens: completionTokens,
      heavyModel: model.heavyClass,
      stream: Boolean(input.stream),
      errorCode: undefined,
    });

    return {
      ok: true,
      id: requestId,
      created,
      model: model.modelId,
      provider: route.route.providerKey,
      runtimeState: model.runtimeState,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content,
            tool_calls: toolCalls,
          },
          finish_reason: finishReason,
        },
      ],
      usage: usageBlock(promptTokens, completionTokens),
      latencyMs,
      xAiBazaar: {
        provider_route: route.route.providerKey,
        runtime_state: model.runtimeState,
        quota_remaining: quota.quotaRemaining,
      },
    };
  } catch (error) {
    quota.ticket.release();

    const message = error instanceof Error ? error.message : "Unknown chat completion failure.";

    recordRequestError({
      orgId: actor.orgId,
      userId: actor.userId,
      modelId: model.modelId,
      statusCode: 503,
      errorCode: "provider_route_failed",
    });

    return {
      ok: false,
      status: 503,
      code: "provider_route_failed",
      message,
    };
  } finally {
    quota.ticket.release();
  }
};

export const runTextCompletion = async (
  actor: ActorContext,
  input: CompletionRequestInput,
): Promise<CompletionRunSuccess | EngineError> => {
  const model = modelById(input.model);
  if (!model) return invalidModelError(input.model);

  if (!model.supports.completion) {
    return unsupportedError("Selected model does not support completion mode.");
  }

  const rawPrompt = Array.isArray(input.prompt) ? input.prompt.join("\n") : input.prompt;
  if (!rawPrompt || !rawPrompt.trim()) {
    return unsupportedError("Prompt is required.");
  }

  const promptTokens = promptTokenEstimateFromCompletionPrompt(input.prompt);
  const maxTokens = completionBudget(input.max_tokens, model);

  const quota = evaluateQuota({
    orgId: actor.orgId,
    userId: actor.userId,
    promptTokens,
    expectedOutputTokens: maxTokens,
    heavyModel: model.heavyClass,
  });

  if (!quota.allowed) {
    return toQuotaError(actor, model.modelId, quota);
  }

  const route = chooseProviderRoute(model, {
    stream: Boolean(input.stream),
    tools: false,
    vision: false,
  });

  const startedAt = Date.now();

  try {
    const provider = await runTextProvider({
      route: route.route,
      model,
      prompt: rawPrompt,
      maxTokens,
      temperature: input.temperature,
      topP: input.top_p,
      stream: input.stream,
    });

    const text = provider.text;
    const completionTokens = countTokens(text);
    const requestId = `cmpl_${id("aibz")}`;
    const latencyMs = Date.now() - startedAt + provider.latencyMs;

    recordUsage({
      orgId: actor.orgId,
      userId: actor.userId,
      keyId: actor.keyId,
      modelId: model.modelId,
      provider: route.route.providerKey,
      statusCode: 200,
      latencyMs,
      inputTokens: promptTokens,
      outputTokens: completionTokens,
      heavyModel: model.heavyClass,
      stream: Boolean(input.stream),
      errorCode: undefined,
    });

    return {
      ok: true,
      id: requestId,
      created: Math.floor(Date.now() / 1000),
      model: model.modelId,
      provider: route.route.providerKey,
      runtimeState: model.runtimeState,
      choices: [
        {
          index: 0,
          text,
          finish_reason: provider.finishReason,
        },
      ],
      usage: usageBlock(promptTokens, completionTokens),
      latencyMs,
      xAiBazaar: {
        provider_route: route.route.providerKey,
        runtime_state: model.runtimeState,
        quota_remaining: quota.quotaRemaining,
      },
    };
  } catch (error) {
    quota.ticket.release();

    const message = error instanceof Error ? error.message : "Unknown completion failure.";

    recordRequestError({
      orgId: actor.orgId,
      userId: actor.userId,
      modelId: model.modelId,
      statusCode: 503,
      errorCode: "provider_route_failed",
    });

    return {
      ok: false,
      status: 503,
      code: "provider_route_failed",
      message,
    };
  } finally {
    quota.ticket.release();
  }
};

export const queryOpenAiModels = (query: {
  family?: string;
  capability?: string;
  state?: string;
  limit?: number;
  cursor?: string;
}) => {
  const capability =
    query.capability === "tools" ||
    query.capability === "vision" ||
    query.capability === "json_mode" ||
    query.capability === "streaming" ||
    query.capability === "completion"
      ? query.capability
      : undefined;

  const state =
    query.state === "warm" || query.state === "loading" || query.state === "cold"
      ? query.state
      : undefined;

  return queryModels({
    family: query.family,
    capability,
    state,
    limit: query.limit,
    cursor: query.cursor,
  });
};
