import { NextRequest, NextResponse } from "next/server";
import { ingestFromSource, INGEST_SOURCES } from "@/lib/ingest";
import { upsertListings } from "@/lib/data/store";
import { logEvent } from "@/lib/observability/events";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ source: string }> },
) {
  const { source } = await context.params;

  if (!INGEST_SOURCES.includes(source as (typeof INGEST_SOURCES)[number])) {
    return NextResponse.json(
      {
        error: `Unsupported source. Use one of: ${INGEST_SOURCES.join(", ")}`,
      },
      { status: 400 },
    );
  }

  const apply = request.nextUrl.searchParams.get("apply") === "true";
  const verify = request.nextUrl.searchParams.get("verify") === "true";

  const result = await ingestFromSource(source);
  let upserted = 0;

  if (apply && result.preview.length) {
    upserted = upsertListings(result.preview, {
      publish: false,
      verified: verify,
    });
  }

  logEvent("api.internal.ingest", {
    source,
    received: result.received,
    normalized: result.normalized,
    apply,
    upserted,
  });

  return NextResponse.json({
    ...result,
    apply,
    upserted,
    note: apply
      ? "Imported as unverified by default; editorial review required before publish."
      : "Dry run only. Use ?apply=true to persist preview into catalog.",
  });
}
