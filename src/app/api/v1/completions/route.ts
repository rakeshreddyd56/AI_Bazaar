import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateInferenceRequest } from "@/lib/inference/auth";
import { runTextCompletion } from "@/lib/inference/engine";
import { chunkText, openAiErrorResponse, sseResponse } from "@/lib/inference/http";

const requestSchema = z.object({
  model: z.string().min(1),
  prompt: z.union([z.string(), z.array(z.string())]),
  stream: z.boolean().optional(),
  max_tokens: z.number().int().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
});

export async function POST(request: NextRequest) {
  const auth = authenticateInferenceRequest(request, "inference:completions");
  if (!auth.ok) {
    return openAiErrorResponse(auth.status, auth.code, auth.error);
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return openAiErrorResponse(400, "invalid_request_body", "Invalid completion payload.", "body");
  }

  const result = await runTextCompletion(auth.actor, parsed.data);
  if (!result.ok) {
    return openAiErrorResponse(
      result.status,
      result.code,
      result.message,
      undefined,
      result.retryAfterSec
        ? {
            "retry-after": String(result.retryAfterSec),
          }
        : undefined,
    );
  }

  if (!parsed.data.stream) {
    return NextResponse.json(
      {
        id: result.id,
        object: "text_completion",
        created: result.created,
        model: result.model,
        choices: result.choices,
        usage: result.usage,
        x_ai_bazaar: {
          provider_route: result.xAiBazaar.provider_route,
          runtime_state: result.xAiBazaar.runtime_state,
          quota_remaining: result.xAiBazaar.quota_remaining,
          latency_ms: result.latencyMs,
        },
      },
      {
        headers: {
          "cache-control": "no-store",
        },
      },
    );
  }

  const choice = result.choices[0];
  const textChunks = chunkText(choice.text, 60);

  const chunks = textChunks.map((segment, index) => ({
    id: result.id,
    object: "text_completion",
    created: result.created,
    model: result.model,
    choices: [
      {
        index: 0,
        text: segment,
        finish_reason: index === textChunks.length - 1 ? choice.finish_reason : null,
      },
    ],
  }));

  return sseResponse(chunks);
}
