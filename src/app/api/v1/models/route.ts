import { NextRequest, NextResponse } from "next/server";
import { authenticateInferenceRequest } from "@/lib/inference/auth";
import { queryOpenAiModels } from "@/lib/inference/engine";
import { openAiErrorResponse } from "@/lib/inference/http";

export async function GET(request: NextRequest) {
  const auth = authenticateInferenceRequest(request, "models:read");
  if (!auth.ok) {
    return openAiErrorResponse(auth.status, auth.code, auth.error);
  }

  const family = request.nextUrl.searchParams.get("family") ?? undefined;
  const capability = request.nextUrl.searchParams.get("capability") ?? undefined;
  const state = request.nextUrl.searchParams.get("state") ?? undefined;
  const limitRaw = request.nextUrl.searchParams.get("limit") ?? undefined;
  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

  const limit = limitRaw ? Number(limitRaw) : undefined;

  const page = queryOpenAiModels({
    family,
    capability,
    state,
    limit: Number.isFinite(limit) ? limit : undefined,
    cursor,
  });

  const created = Math.floor(Date.now() / 1000);

  return NextResponse.json(
    {
      object: "list",
      data: page.data.map((entry) => ({
        id: entry.modelId,
        object: "model",
        created,
        owned_by: entry.provider,
        permission: [],
        x_ai_bazaar: {
          context_length: entry.contextLength,
          max_output_tokens: entry.maxOutputTokens,
          runtime_state: entry.runtimeState,
          supports: entry.supports,
          pricing_usd: entry.pricingUsd,
          family: entry.family,
          model_class: entry.modelClass,
          heavy_class: entry.heavyClass,
        },
      })),
      has_more: page.hasMore,
      next_cursor: page.nextCursor,
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
