import { NextRequest, NextResponse } from "next/server";
import { executeSearch } from "@/lib/search/search";
import { logEvent } from "@/lib/observability/events";
import type { Intent, Persona } from "@/lib/types";

const isPersona = (value: string): value is Persona =>
  value === "builder" || value === "business" || value === "research";
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

  const personaParam = request.nextUrl.searchParams.get("persona") ?? "builder";
  const persona = isPersona(personaParam) ? personaParam : "builder";
  const locale = request.nextUrl.searchParams.get("locale") ?? "en-IN";
  const intentParam = request.nextUrl.searchParams.get("intent");
  const intent = intentParam && isIntent(intentParam) ? intentParam : undefined;

  const result = executeSearch({
    q,
    persona,
    locale: locale === "hi-IN" ? "hi-IN" : "en-IN",
    intent,
  });

  logEvent("api.search", {
    q,
    persona,
    locale,
    intent: result.intent,
    result_count: result.results.length,
    confidence: result.confidence,
  });

  return NextResponse.json(result);
}
