import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createApiKey, listApiKeys } from "@/lib/console/store";
import { requireConsoleRole, resolveConsoleActor } from "@/lib/inference/auth";

const createSchema = z.object({
  label: z.string().min(2).max(80),
  scopes: z.array(z.string().min(1)).min(1).max(25).optional(),
  rateLimitRpm: z.number().int().positive().max(20_000).optional(),
});

export async function GET(request: NextRequest) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  return NextResponse.json({
    actor: actor.actor,
    keys: listApiKeys(actor.actor.orgId),
  });
}

export async function POST(request: NextRequest) {
  const actor = resolveConsoleActor(request);
  if (!actor.ok) {
    return NextResponse.json({ error: actor.error }, { status: actor.status });
  }

  const access = requireConsoleRole(actor.actor, "admin");
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid key payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const created = createApiKey({
    orgId: actor.actor.orgId,
    label: parsed.data.label,
    scopes: parsed.data.scopes ?? ["models:read", "inference:chat", "inference:completions"],
    createdBy: actor.actor.userId,
    rateLimitRpm: parsed.data.rateLimitRpm,
  });

  return NextResponse.json(
    {
      actor: actor.actor,
      key: created.record,
      plaintextKey: created.plaintextKey,
      note: "This key is shown once. Store it securely.",
    },
    { status: 201 },
  );
}
