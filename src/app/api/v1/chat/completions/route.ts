import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticateInferenceRequest } from "@/lib/inference/auth";
import { runChatCompletion } from "@/lib/inference/engine";
import { chunkText, openAiErrorResponse, sseResponse } from "@/lib/inference/http";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.union([
    z.string(),
    z.array(
      z.object({
        type: z.string().optional(),
        text: z.string().optional(),
        image_url: z
          .union([z.string(), z.object({ url: z.string().optional() })])
          .optional(),
      }),
    ),
  ]),
});

const toolSchema = z.object({
  type: z.string().optional(),
  function: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      parameters: z.unknown().optional(),
    })
    .optional(),
});

const requestSchema = z.object({
  model: z.string().min(1),
  messages: z.array(messageSchema).min(1),
  stream: z.boolean().optional(),
  max_tokens: z.number().int().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  tools: z.array(toolSchema).optional(),
  tool_choice: z.union([
    z.string(),
    z.object({
      type: z.string().optional(),
      function: z.object({ name: z.string().optional() }).optional(),
    }),
  ]).optional(),
  response_format: z
    .object({
      type: z.enum(["text", "json_object"]).optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const auth = authenticateInferenceRequest(request, "inference:chat");
  if (!auth.ok) {
    return openAiErrorResponse(auth.status, auth.code, auth.error);
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return openAiErrorResponse(
      400,
      "invalid_request_body",
      "Invalid chat completion payload.",
      "body",
    );
  }

  const result = await runChatCompletion(auth.actor, parsed.data);
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
        object: "chat.completion",
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

  const firstChoice = result.choices[0];

  if (firstChoice.message.tool_calls?.length) {
    const toolCall = firstChoice.message.tool_calls[0];
    const chunks = [
      {
        id: result.id,
        object: "chat.completion.chunk",
        created: result.created,
        model: result.model,
        choices: [
          {
            index: 0,
            delta: {
              role: "assistant",
              tool_calls: [
                {
                  id: toolCall.id,
                  type: "function",
                  function: {
                    name: toolCall.function.name,
                    arguments: toolCall.function.arguments,
                  },
                },
              ],
            },
            finish_reason: "tool_calls",
          },
        ],
      },
    ];

    return sseResponse(chunks);
  }

  const content = firstChoice.message.content ?? "";
  const textChunks = chunkText(content, 60);

  const chunks = textChunks.map((segment, index) => ({
    id: result.id,
    object: "chat.completion.chunk",
    created: result.created,
    model: result.model,
    choices: [
      {
        index: 0,
        delta: {
          role: index === 0 ? "assistant" : undefined,
          content: segment,
        },
        finish_reason: index === textChunks.length - 1 ? firstChoice.finish_reason : null,
      },
    ],
  }));

  return sseResponse(chunks);
}
