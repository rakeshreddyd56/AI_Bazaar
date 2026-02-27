export const endpointDocs = [
  {
    method: "GET",
    path: "/api/v1/models",
    description: "List available models with runtime metadata and capability flags.",
  },
  {
    method: "POST",
    path: "/api/v1/chat/completions",
    description: "OpenAI-compatible chat completion endpoint with tools, vision, and streaming.",
  },
  {
    method: "POST",
    path: "/api/v1/completions",
    description: "OpenAI legacy completion endpoint for prompt-based generation.",
  },
  {
    method: "POST",
    path: "/api/v1/tokenize",
    description: "Token estimator endpoint for prompt sizing and quota planning.",
  },
];

export const curlExamples = {
  listModels: `curl -s https://theaibazaar.com/api/v1/models \\
  -H "Authorization: Bearer <YOUR_API_KEY>"`,
  chat: `curl -s https://theaibazaar.com/api/v1/chat/completions \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5-3-codex",
    "messages": [
      {"role": "system", "content": "You are a helpful coding assistant."},
      {"role": "user", "content": "Write a TypeScript debounce helper."}
    ],
    "stream": false,
    "temperature": 0.2
  }'`,
  completion: `curl -s https://theaibazaar.com/api/v1/completions \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-5-3-codex",
    "prompt": "Summarize this PR in bullet points:",
    "max_tokens": 160
  }'`,
  tokenize: `curl -s https://theaibazaar.com/api/v1/tokenize \\
  -H "Authorization: Bearer <YOUR_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "gpt-5-3-codex", "input": "Explain pgvector indexing options."}'`,
};

export const sdkExamples = {
  javascript: `import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_BAZAAR_API_KEY,
  baseURL: "https://theaibazaar.com/api/v1",
});

const result = await client.chat.completions.create({
  model: "gpt-5-3-codex",
  messages: [{ role: "user", content: "Build a search API design" }],
});

console.log(result.choices[0]?.message);`,
  python: `from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("AI_BAZAAR_API_KEY"),
    base_url="https://theaibazaar.com/api/v1",
)

res = client.chat.completions.create(
    model="gpt-5-3-codex",
    messages=[{"role": "user", "content": "Outline Redis queue strategy"}],
)

print(res.choices[0].message)`,
};

export const integrationGuides = [
  {
    name: "Cursor",
    steps: [
      "Open Settings > Models and add custom OpenAI-compatible provider.",
      "Set Base URL to https://theaibazaar.com/api/v1.",
      "Paste your AI Bazaar API key.",
      "Select an AI Bazaar model id (for example, gpt-5-3-codex).",
    ],
  },
  {
    name: "Cline",
    steps: [
      "Choose OpenAI-compatible endpoint mode in provider settings.",
      "Set endpoint to https://theaibazaar.com/api/v1/chat/completions.",
      "Attach your API key and preferred model id.",
    ],
  },
  {
    name: "Roo Code",
    steps: [
      "Configure custom OpenAI API base URL.",
      "Set API key and default model.",
      "Enable streaming for best interaction latency.",
    ],
  },
  {
    name: "Aider",
    steps: [
      "Export OPENAI_API_BASE=https://theaibazaar.com/api/v1.",
      "Export OPENAI_API_KEY=<YOUR_AI_BAZAAR_KEY>.",
      "Run aider with --model <model-id>.",
    ],
  },
  {
    name: "OpenWebUI",
    steps: [
      "Add a new OpenAI endpoint connection.",
      "Set API URL to https://theaibazaar.com/api/v1.",
      "Save key and choose model mapping.",
    ],
  },
  {
    name: "LangChain",
    steps: [
      "Use ChatOpenAI with base_url set to AI Bazaar endpoint.",
      "Pass api_key from environment.",
      "Select model id and optional tools schema.",
    ],
  },
  {
    name: "LlamaIndex",
    steps: [
      "Use OpenAI-compatible LLM class with base URL override.",
      "Set model and API key.",
      "Route retrieval answers via chat completions.",
    ],
  },
];
