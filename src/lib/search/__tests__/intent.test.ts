import { describe, expect, it } from "vitest";
import { inferIntent } from "@/lib/search/intent";

describe("inferIntent", () => {
  it("detects video intent and parses duration/resolution", () => {
    const parsed = inferIntent("best video gen tools for 15 sec 1080p ads");

    expect(parsed.intent).toBe("video");
    expect(parsed.capabilityFilters.minDurationSec).toBe(15);
    expect(parsed.capabilityFilters.resolution).toBe("1080p");
    expect(parsed.confidence).toBeGreaterThan(0.5);
  });

  it("maps svg requests to image intent with svg capability", () => {
    const parsed = inferIntent("best SVG generation tools/models");

    expect(parsed.intent).toBe("image");
    expect(parsed.capabilityFilters.outputsValidSvg).toBe(true);
  });
});
