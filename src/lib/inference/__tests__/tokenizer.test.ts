import { describe, expect, it } from "vitest";
import {
  countTokens,
  normalizeMessageText,
  promptTokenEstimateFromCompletionPrompt,
  promptTokenEstimateFromMessages,
} from "@/lib/inference/tokenizer";

describe("tokenizer", () => {
  it("counts plain text tokens", () => {
    expect(countTokens("hello world from AI Bazaar")).toBeGreaterThan(0);
    expect(countTokens("   ")).toBe(0);
  });

  it("normalizes mixed multimodal content", () => {
    const normalized = normalizeMessageText([
      { type: "text", text: "look at this" },
      { type: "image_url", image_url: "https://example.com/image.png" },
      { text: "and summarize" },
    ]);

    expect(normalized.text).toContain("look at this");
    expect(normalized.text).toContain("and summarize");
    expect(normalized.imageCount).toBe(1);
  });

  it("estimates prompt tokens for messages and completion prompt", () => {
    const messageTokens = promptTokenEstimateFromMessages([
      { role: "system", content: "You are useful." },
      {
        role: "user",
        content: [
          { type: "text", text: "Describe this chart" },
          { type: "image_url", image_url: "data:image/png;base64,abc" },
        ],
      },
    ]);

    const completionTokens = promptTokenEstimateFromCompletionPrompt("Summarize the architecture.");

    expect(messageTokens).toBeGreaterThan(completionTokens);
    expect(completionTokens).toBeGreaterThan(0);
  });
});
