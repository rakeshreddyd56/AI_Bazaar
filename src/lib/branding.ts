export type BrandTarget = {
  id?: string;
  slug?: string;
  name?: string;
  source?: string;
  sourceUrl?: string;
  tags?: string[];
};

export type BrandInfo = {
  key: string;
  label: string;
  monogram: string;
  domain?: string;
};

type BrandRule = {
  key: string;
  label: string;
  domain: string;
  tokens: string[];
};

const titleCase = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const toMonogram = (value?: string) => {
  const clean = (value ?? "")
    .replace(/[^a-zA-Z0-9 ]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!clean.length) return "AI";
  if (clean.length === 1) return clean[0].slice(0, 2).toUpperCase();
  return `${clean[0][0]}${clean[1][0]}`.toUpperCase();
};

const parseDomain = (value?: string) => {
  if (!value) return undefined;
  try {
    const normalized = value.includes("://") ? value : `https://${value}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
};

const rules: BrandRule[] = [
  {
    key: "openai",
    label: "OpenAI",
    domain: "openai.com",
    tokens: ["openai", "gpt-", "o1", "o3", "o4", "whisper"],
  },
  {
    key: "anthropic",
    label: "Anthropic",
    domain: "anthropic.com",
    tokens: ["anthropic", "claude", "opus", "sonnet", "haiku"],
  },
  {
    key: "google",
    label: "Google",
    domain: "google.com",
    tokens: ["google", "gemini", "vertex", "palm"],
  },
  {
    key: "meta",
    label: "Meta",
    domain: "meta.com",
    tokens: ["meta", "llama ", "llama-", "llama3", "llama 3", "llama 4"],
  },
  {
    key: "mistral",
    label: "Mistral",
    domain: "mistral.ai",
    tokens: ["mistral", "mixtral"],
  },
  {
    key: "deepseek",
    label: "DeepSeek",
    domain: "deepseek.com",
    tokens: ["deepseek"],
  },
  {
    key: "xai",
    label: "xAI",
    domain: "x.ai",
    tokens: ["xai", "grok"],
  },
  {
    key: "cohere",
    label: "Cohere",
    domain: "cohere.com",
    tokens: ["cohere", "command-r", "command r"],
  },
  {
    key: "qwen",
    label: "Qwen",
    domain: "tongyi.aliyun.com",
    tokens: ["qwen", "tongyi", "alibaba"],
  },
  {
    key: "zhipu",
    label: "Zhipu AI",
    domain: "zhipuai.cn",
    tokens: ["zhipu", "glm", "chatglm"],
  },
  {
    key: "minimax",
    label: "MiniMax",
    domain: "minimax.io",
    tokens: ["minimax"],
  },
  {
    key: "nvidia",
    label: "NVIDIA",
    domain: "nvidia.com",
    tokens: ["nvidia"],
  },
  {
    key: "elevenlabs",
    label: "ElevenLabs",
    domain: "elevenlabs.io",
    tokens: ["elevenlabs", "tts", "voice-v2"],
  },
  {
    key: "runway",
    label: "Runway",
    domain: "runwayml.com",
    tokens: ["runway"],
  },
  {
    key: "pika",
    label: "Pika",
    domain: "pika.art",
    tokens: ["pika"],
  },
  {
    key: "luma",
    label: "Luma",
    domain: "lumalabs.ai",
    tokens: ["luma", "dream machine"],
  },
  {
    key: "midjourney",
    label: "Midjourney",
    domain: "midjourney.com",
    tokens: ["midjourney"],
  },
  {
    key: "stability",
    label: "Stability AI",
    domain: "stability.ai",
    tokens: ["stability", "stable diffusion", "sdxl"],
  },
  {
    key: "replicate",
    label: "Replicate",
    domain: "replicate.com",
    tokens: ["replicate"],
  },
  {
    key: "langgraph",
    label: "LangGraph",
    domain: "langchain.com",
    tokens: ["langgraph"],
  },
  {
    key: "langchain",
    label: "LangChain",
    domain: "langchain.com",
    tokens: ["langchain"],
  },
  {
    key: "llamaindex",
    label: "LlamaIndex",
    domain: "llamaindex.ai",
    tokens: ["llamaindex"],
  },
  {
    key: "openrouter",
    label: "OpenRouter",
    domain: "openrouter.ai",
    tokens: ["openrouter"],
  },
  {
    key: "huggingface",
    label: "Hugging Face",
    domain: "huggingface.co",
    tokens: ["huggingface", "hf-", "hf "],
  },
  {
    key: "swebench",
    label: "SWE-bench",
    domain: "swebench.com",
    tokens: ["swe-bench", "swebench"],
  },
  {
    key: "livebench",
    label: "LiveBench",
    domain: "livebench.ai",
    tokens: ["livebench"],
  },
  {
    key: "arena",
    label: "Arena",
    domain: "arena.ai",
    tokens: ["arena.ai", "lm arena", "lmarena"],
  },
  {
    key: "helm",
    label: "HELM",
    domain: "crfm.stanford.edu",
    tokens: ["helm"],
  },
  {
    key: "artificialanalysis",
    label: "Artificial Analysis",
    domain: "artificialanalysis.ai",
    tokens: ["artificial analysis", "artificialanalysis"],
  },
];

const signatureOf = (target: BrandTarget) =>
  [
    target.id,
    target.slug,
    target.name,
    target.source,
    target.sourceUrl,
    ...(target.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const resolveBrand = (target: BrandTarget): BrandInfo => {
  const signature = signatureOf(target);
  const matched = rules.find((rule) =>
    rule.tokens.some((token) => signature.includes(token)),
  );

  if (matched) {
    return {
      key: matched.key,
      label: matched.label,
      domain: matched.domain,
      monogram: toMonogram(matched.label),
    };
  }

  const sourceDomain = parseDomain(target.sourceUrl);
  if (sourceDomain) {
    const root = sourceDomain.split(".")[0]?.replace(/[-_]/g, " ") ?? "AI";
    const label = titleCase(root);
    return {
      key: root.replace(/\s+/g, "-"),
      label,
      domain: sourceDomain,
      monogram: toMonogram(label),
    };
  }

  const fallbackLabel = target.name?.trim() || "AI Model";
  return {
    key: "ai",
    label: fallbackLabel,
    monogram: toMonogram(fallbackLabel),
  };
};

export const brandLogoCandidates = (brand: BrandInfo) => {
  if (!brand.domain) return [];
  return [
    `https://logo.clearbit.com/${brand.domain}`,
    `https://www.google.com/s2/favicons?sz=128&domain=${brand.domain}`,
  ];
};
