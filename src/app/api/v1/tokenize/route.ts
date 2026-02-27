import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { modelById } from "@/lib/console/models";
import { authenticateInferenceRequest } from "@/lib/inference/auth";
import {
  countTokens,
  promptTokenEstimateFromCompletionPrompt,
  promptTokenEstimateFromMessages,
} from "@/lib/inference/tokenizer";
import { openAiErrorResponse } from "@/lib/inference/http";

const requestSchema = z.object({
  model: z.string().min(1),
  input: z.union([
    z.string(),
    z.array(
      z.object({
        role: z.enum(["system", "user", "assistant", "tool"]),
        content: z.union([z.string(), z.array(z.any())]),
      }),
    ),
  ]),
});

export async function POST(request: NextRequest) {
  const auth = authenticateInferenceRequest(request, "models:read");
  if (!auth.ok) {
    return openAiErrorResponse(auth.status, auth.code, auth.error);
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return openAiErrorResponse(400, "invalid_request_body", "Invalid tokenize payload.", "body");
  }

  const model = modelById(parsed.data.model);
  if (!model) {
    return openAiErrorResponse(404, "model_not_found", `Model '${parsed.data.model}' not found.`);
  }

  const tokenCount = typeof parsed.data.input === "string"
    ? countTokens(parsed.data.input)
    : promptTokenEstimateFromMessages(parsed.data.input);

  const plainPromptCount = typeof parsed.data.input === "string"
    ? promptTokenEstimateFromCompletionPrompt(parsed.data.input)
    : undefined;

  return NextResponse.json(
    {
      object: "tokenization",
      model: model.modelId,
      tokenizer: "aibazaar-approx-v1",
      token_count: tokenCount,
      prompt_token_estimate: plainPromptCount,
      context_length: model.contextLength,
      max_output_tokens: model.maxOutputTokens,
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
