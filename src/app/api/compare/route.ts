import { NextRequest, NextResponse } from "next/server";
import { compareListings, comparisonTable } from "@/lib/search/search";
import { logEvent } from "@/lib/observability/events";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!ids.length) {
    return NextResponse.json(
      {
        error: "Missing required query parameter: ids (comma separated)",
      },
      { status: 400 },
    );
  }

  const comparison = compareListings(ids);
  const table = comparisonTable(comparison);

  logEvent("api.compare", {
    ids_count: ids.length,
    found_count: comparison.length,
  });

  return NextResponse.json({
    ids,
    comparison,
    table,
  });
}
