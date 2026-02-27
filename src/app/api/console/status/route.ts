import { NextRequest, NextResponse } from "next/server";
import { statusForOrg } from "@/lib/console/status";
import { resolveConsoleActor } from "@/lib/inference/auth";

export async function GET(request: NextRequest) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  const status = statusForOrg(actor.actor.orgId);
  return NextResponse.json({
    actor: actor.actor,
    ...status,
  });
}
