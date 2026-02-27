import { NextRequest, NextResponse } from "next/server";
import { usageSummaryForOrg } from "@/lib/console/store";
import { resolveConsoleActor } from "@/lib/inference/auth";
import { defaultQuotaLimits } from "@/lib/inference/quota";

export async function GET(request: NextRequest) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  const summary = usageSummaryForOrg(actor.actor.orgId, defaultQuotaLimits);

  return NextResponse.json({
    actor: actor.actor,
    ...summary,
  });
}
