import { NextRequest, NextResponse } from "next/server";
import { revokeApiKey } from "@/lib/console/store";
import { requireConsoleRole, resolveConsoleActor } from "@/lib/inference/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  const access = requireConsoleRole(actor.actor, "admin");
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { id } = await context.params;
  const revoked = revokeApiKey(actor.actor.orgId, id);
  if (!revoked) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({
    actor: actor.actor,
    key: {
      id: revoked.id,
      status: revoked.status,
      revokedAt: revoked.revokedAt,
    },
  });
}
