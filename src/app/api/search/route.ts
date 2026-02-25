import { NextRequest, NextResponse } from "next/server";
import { isCategorySlug } from "@/lib/categories";
import { executeSearch } from "@/lib/search/search";
import { logEvent } from "@/lib/observability/events";
import type { Intent } from "@/lib/types";

const isIntent = (value: string): value is Intent =>
  value === "text" ||
  value === "image" ||
  value === "video" ||
  value === "audio" ||
  value === "code" ||
  value === "agent" ||
  value === "search";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json(
      {
        error: "Missing required query parameter: q",
      },
      { status: 400 },
    );
  }

  // Backward compatibility for older links.
  const _persona = request.nextUrl.searchParams.get("persona") ?? undefined;
  const locale = request.nextUrl.searchParams.get("locale") ?? "en-IN";
  const intentParam = request.nextUrl.searchParams.get("intent");
  const intent = intentParam && isIntent(intentParam) ? intentParam : undefined;

  const categoryParam = request.nextUrl.searchParams.get("category");
  const category =
    categoryParam && isCategorySlug(categoryParam) ? categoryParam : "all";

  const result = executeSearch({
    q,
    category,
    locale: locale === "hi-IN" ? "hi-IN" : "en-IN",
    intent,
  });

  logEvent("api.search", {
    q,
    locale,
    category,
    legacy_persona: _persona,
    intent: result.intent,
    result_count: result.results.length,
    confidence: result.confidence,
  });

  return NextResponse.json(result);
}
