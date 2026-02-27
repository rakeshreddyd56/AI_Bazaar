import { tokenize } from "@/lib/utils";

export type ChatMessageContent =
  | string
  | Array<{
      type?: string;
      text?: string;
      image_url?: string | { url?: string };
    }>;

export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: ChatMessageContent;
};

export const countTokens = (input: string) => {
  if (!input.trim()) return 0;

  const wordTokens = tokenize(input).length;
  const charTokens = Math.ceil(input.length / 4);
  return Math.max(wordTokens, charTokens);
};

export const normalizeMessageText = (content: ChatMessageContent): { text: string; imageCount: number } => {
  if (typeof content === "string") {
    return { text: content, imageCount: 0 };
  }

  const textParts: string[] = [];
  let imageCount = 0;

  for (const part of content) {
    if (!part) continue;

    if (part.type === "image_url") {
      imageCount += 1;
      continue;
    }

    if (typeof part.image_url === "string") {
      imageCount += 1;
      continue;
    }

    if (part.image_url && typeof part.image_url === "object" && part.image_url.url) {
      imageCount += 1;
      continue;
    }

    if (typeof part.text === "string") {
      textParts.push(part.text);
    }
  }

  return {
    text: textParts.join("\n").trim(),
    imageCount,
  };
};

export const promptTokenEstimateFromMessages = (messages: ChatMessage[]) => {
  const flattened = messages.map((message) => {
    const normalized = normalizeMessageText(message.content);
    return `${message.role}: ${normalized.text}`;
  });

  const rawText = flattened.join("\n");
  const imageTokens = messages.reduce((sum, message) => {
    const normalized = normalizeMessageText(message.content);
    return sum + normalized.imageCount * 256;
  }, 0);

  return countTokens(rawText) + imageTokens;
};

export const promptTokenEstimateFromCompletionPrompt = (prompt: string | string[]) => {
  const joined = Array.isArray(prompt) ? prompt.join("\n") : prompt;
  return countTokens(joined);
};
