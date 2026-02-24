import { describe, expect, it } from "vitest";
import { executeSearch } from "@/lib/search/search";

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
});
