import { describe, expect, it } from "vitest";
import { brandLogoCandidates, resolveBrand } from "@/lib/branding";

describe("resolveBrand", () => {
  it("detects OpenAI models routed via OpenRouter", () => {
    const brand = resolveBrand({
      id: "openai-gpt-4o-latest",
      name: "GPT-4o Latest",
      source: "openrouter-models-api",
    });

    expect(brand.key).toBe("openai");
    expect(brand.label).toBe("OpenAI");
    expect(brand.domain).toBe("openai.com");
  });

  it("detects Hugging Face listings via source/tags", () => {
    const brand = resolveBrand({
      id: "hf-community-vision-pro",
      name: "Community Vision Pro",
      source: "huggingface-trending",
      tags: ["huggingface", "vision"],
    });

    expect(brand.key).toBe("huggingface");
    expect(brand.label).toBe("Hugging Face");
    expect(brand.domain).toBe("huggingface.co");
  });

  it("detects LangGraph for agent frameworks", () => {
    const brand = resolveBrand({
      id: "langgraph-v1-framework",
      name: "LangGraph v1",
      source: "manual-catalog",
    });

    expect(brand.key).toBe("langgraph");
    expect(brand.domain).toBe("langchain.com");
  });

  it("falls back to source domain if no rule matches", () => {
    const brand = resolveBrand({
      name: "Custom Stack",
      sourceUrl: "https://example.ai/docs/models",
    });

    expect(brand.domain).toBe("example.ai");
    expect(brand.label).toBe("Example");
  });
});

describe("brandLogoCandidates", () => {
  it("returns candidate URLs when a domain exists", () => {
    const candidates = brandLogoCandidates({
      key: "openai",
      label: "OpenAI",
      monogram: "OA",
      domain: "openai.com",
    });

    expect(candidates).toHaveLength(2);
    expect(candidates[0]).toContain("logo.clearbit.com/openai.com");
    expect(candidates[1]).toContain("google.com/s2/favicons");
  });
});
