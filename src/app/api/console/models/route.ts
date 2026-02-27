import { NextRequest, NextResponse } from "next/server";
import { queryModels } from "@/lib/console/models";
import { resolveConsoleActor } from "@/lib/inference/auth";

export async function GET(request: NextRequest) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  const family = request.nextUrl.searchParams.get("family") ?? undefined;
  const capabilityParam = request.nextUrl.searchParams.get("capability") ?? undefined;
  const stateParam = request.nextUrl.searchParams.get("state") ?? undefined;
  const limitRaw = request.nextUrl.searchParams.get("limit") ?? undefined;
  const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;

  const capability =
    capabilityParam === "tools" ||
    capabilityParam === "vision" ||
    capabilityParam === "json_mode" ||
    capabilityParam === "streaming" ||
    capabilityParam === "completion"
      ? capabilityParam
      : undefined;

  const runtimeState =
    stateParam === "warm" || stateParam === "loading" || stateParam === "cold"
      ? stateParam
      : undefined;

  const limit = limitRaw ? Number(limitRaw) : undefined;

  const page = queryModels({
    family,
    capability,
    state: runtimeState,
    limit: Number.isFinite(limit) ? limit : undefined,
    cursor,
  });

  return NextResponse.json({
    actor: actor.actor,
    total: page.total,
    data: page.data,
    hasMore: page.hasMore,
    nextCursor: page.nextCursor,
  });
}
