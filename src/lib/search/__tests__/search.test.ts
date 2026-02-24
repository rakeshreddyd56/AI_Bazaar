import { describe, expect, it } from "vitest";
import { compareListings, comparisonTable, executeSearch } from "@/lib/search/search";

describe("executeSearch", () => {
  it("returns ranked video-capable options for video queries", () => {
    const result = executeSearch({
      q: "best video gen tools",
      persona: "builder",
      locale: "en-IN",
    });

    expect(result.intent).toBe("video");
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.some((item) => item.modality.includes("video"))).toBe(true);
  });

  it("returns svg-capable options for svg queries", () => {
    const result = executeSearch({
      q: "best SVG generation tools/models",
      persona: "builder",
      locale: "en-IN",
    });

    expect(result.intent).toBe("image");
    expect(
      result.results.some((item) => item.capabilities.outputsValidSvg === true),
    ).toBe(true);
  });

  it("builds compare table with benchmark rows when data exists", () => {
    const items = compareListings([
      "openai-agents-sdk",
      "google-agent-development-kit",
      "langgraph-v1-framework",
    ]);
    const table = comparisonTable(items);
    const metrics = table.rows.map((row) => row.metric);

    expect(metrics).toContain("benchmarks.githubStars");
    expect(metrics).toContain("benchmarks.githubForks");
  });
});
