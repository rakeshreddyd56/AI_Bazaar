import { describe, expect, it } from "vitest";
import { providerByKey, resolveBrand } from "@/lib/branding";

describe("resolveBrand", () => {
  it("detects OpenAI models routed via OpenRouter", () => {
    const brand = resolveBrand({
      id: "openai-gpt-4o-latest",
      name: "GPT-4o Latest",
      source: "openrouter-models-api",
    });

    expect(brand.key).toBe("openai");
    expect(brand.name).toBe("OpenAI");
    expect(brand.logoPath).toBe("/logos/providers/openai.png");
  });

  it("detects Hugging Face listings via source/tags", () => {
    const brand = resolveBrand({
      id: "hf-community-vision-pro",
      name: "Community Vision Pro",
      source: "huggingface-trending",
      tags: ["huggingface", "vision"],
    });

    expect(brand.key).toBe("huggingface");
    expect(brand.name).toBe("Hugging Face");
    expect(brand.logoPath).toBe("/logos/providers/huggingface.png");
  });

  it("detects LangGraph for agent frameworks", () => {
    const brand = resolveBrand({
      id: "langgraph-v1-framework",
      name: "LangGraph v1",
      source: "manual-catalog",
    });

    expect(brand.key).toBe("langgraph");
    expect(brand.name).toBe("LangGraph");
  });

  it("falls back to source domain root if no token rule matches", () => {
    const brand = resolveBrand({
      name: "Custom Stack",
      sourceUrl: "https://example.ai/docs/models",
    });

    expect(brand.domain).toBe("example.ai");
    expect(brand.key).toBe("example");
  });
});

describe("providerByKey", () => {
  it("returns deterministic local logo path", () => {
    const provider = providerByKey("openai");

    expect(provider.key).toBe("openai");
    expect(provider.logoPath).toBe("/logos/providers/openai.png");
  });

  it("returns unknown provider fallback when key is missing", () => {
    const provider = providerByKey(undefined);

    expect(provider.key).toBe("unknown");
    expect(provider.logoPath).toBe("/brand/unknown-provider.png");
  });
});
