"use client";

import { useMemo, useState } from "react";
import type { ModelCatalogEntry } from "@/lib/console/models";

type Props = {
  models: Array<
    Pick<
      ModelCatalogEntry,
      | "modelId"
      | "name"
      | "family"
      | "parameterSupport"
      | "supports"
      | "runtimeState"
      | "provider"
    >
  >;
};

const defaultToolSchema = JSON.stringify(
  [
    {
      type: "function",
      function: {
        name: "web_search",
        description: "Searches the web for latest information",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" },
          },
          required: ["query"],
        },
      },
    },
  ],
  null,
  2,
);

export function PlaygroundConsole({ models }: Props) {
  const [mode, setMode] = useState<"chat" | "completion">("chat");
  const [modelId, setModelId] = useState(models[0]?.modelId ?? "");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("Design a robust provider fallback strategy for AI inference.");
  const [systemPrompt, setSystemPrompt] = useState("You are a concise technical assistant.");
  const [visionUrl, setVisionUrl] = useState("");
  const [stream, setStream] = useState(true);
  const [temperature, setTemperature] = useState(0.2);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [minP, setMinP] = useState(0.05);
  const [maxTokens, setMaxTokens] = useState(512);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [stopSequence, setStopSequence] = useState("");
  const [seed, setSeed] = useState(42);
  const [toolSchema, setToolSchema] = useState(defaultToolSchema);
  const [output, setOutput] = useState("");
  const [rawJson, setRawJson] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [error, setError] = useState("");

  const selectedModel = useMemo(() => models.find((entry) => entry.modelId === modelId), [models, modelId]);

  const parsedTools = useMemo(() => {
    try {
      const parsed = JSON.parse(toolSchema);
      if (Array.isArray(parsed)) return parsed;
      return undefined;
    } catch {
      return undefined;
    }
  }, [toolSchema]);

  const run = async () => {
    setStatus("running");
    setError("");
    setOutput("");
    setRawJson("");

    const headers: Record<string, string> = {
      "content-type": "application/json",
    };

    if (apiKey.trim()) {
      headers.authorization = `Bearer ${apiKey.trim()}`;
    } else {
      headers["x-api-key"] = "aibz_demo_local_key";
    }

    try {
      const endpoint = mode === "chat" ? "/api/v1/chat/completions" : "/api/v1/completions";

      const common = {
        model: modelId,
        stream,
        temperature,
        top_p: topP,
        max_tokens: maxTokens,
      };

      const payload =
        mode === "chat"
          ? {
              ...common,
              top_k: topK,
              min_p: minP,
              frequency_penalty: frequencyPenalty,
              presence_penalty: presencePenalty,
              seed,
              stop: stopSequence ? [stopSequence] : undefined,
              response_format: selectedModel?.parameterSupport.response_format_json
                ? { type: "json_object" as const }
                : undefined,
              tools: selectedModel?.supports.tools ? parsedTools : undefined,
              messages: [
                {
                  role: "system",
                  content: systemPrompt,
                },
                {
                  role: "user",
                  content: visionUrl.trim()
                    ? [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: visionUrl.trim() },
                      ]
                    : prompt,
                },
              ],
            }
          : {
              ...common,
              prompt,
              stop: stopSequence ? [stopSequence] : undefined,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: { message: "Request failed" } }));
        throw new Error(err.error?.message ?? "Request failed");
      }

      if (!stream) {
        const json = await response.json();
        setRawJson(JSON.stringify(json, null, 2));

        if (mode === "chat") {
          const message = json.choices?.[0]?.message;
          if (message?.tool_calls?.length) {
            setOutput(JSON.stringify(message.tool_calls, null, 2));
          } else {
            setOutput(message?.content ?? "");
          }
        } else {
          setOutput(json.choices?.[0]?.text ?? "");
        }

        setStatus("idle");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Streaming is not available for this response.");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let streamOutput = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const lines = chunk.split("\n").filter((line) => line.startsWith("data:"));
          for (const line of lines) {
            const payloadText = line.slice(5).trim();
            if (!payloadText || payloadText === "[DONE]") continue;

            const parsed = JSON.parse(payloadText);

            if (mode === "chat") {
              const delta = parsed.choices?.[0]?.delta;
              const content = delta?.content;
              const toolCalls = delta?.tool_calls;

              if (typeof content === "string") {
                streamOutput += content;
              }

              if (toolCalls) {
                streamOutput += `\n${JSON.stringify(toolCalls, null, 2)}`;
              }
            } else {
              const text = parsed.choices?.[0]?.text;
              if (typeof text === "string") {
                streamOutput += text;
              }
            }

            setOutput(streamOutput);
          }
        }
      }

      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown failure");
    }
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Playground</h1>
          <p className="text-sm text-neutral-400">
            Test chat/completion payloads with OpenAI-compatible endpoints before production rollout.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-neutral-300">
          Model state: {selectedModel?.runtimeState ?? "unknown"}
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-xs text-neutral-300">
              Mode
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value as "chat" | "completion")}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
              >
                <option value="chat">Chat Completions</option>
                <option value="completion">Completions</option>
              </select>
            </label>
            <label className="text-xs text-neutral-300">
              Model
              <select
                value={modelId}
                onChange={(event) => setModelId(event.target.value)}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
              >
                {models.map((model) => (
                  <option key={model.modelId} value={model.modelId}>
                    {model.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-xs text-neutral-300">
            API Key
            <input
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="Leave empty to use local demo key"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
            />
          </label>

          {mode === "chat" ? (
            <label className="text-xs text-neutral-300">
              System prompt
              <textarea
                value={systemPrompt}
                onChange={(event) => setSystemPrompt(event.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
              />
            </label>
          ) : null}

          <label className="text-xs text-neutral-300">
            Prompt
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
            />
          </label>

          <label className="text-xs text-neutral-300">
            Vision input URL/base64 (optional)
            <input
              value={visionUrl}
              onChange={(event) => setVisionUrl(event.target.value)}
              disabled={!selectedModel?.supports.vision}
              placeholder={selectedModel?.supports.vision ? "https://... or data:image/png;base64,..." : "Selected model has no vision support"}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-xs text-neutral-300">temperature
              <input type="number" step="0.05" min={0} max={2} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.temperature} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">top_p
              <input type="number" step="0.05" min={0} max={1} value={topP} onChange={(e) => setTopP(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.top_p} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">top_k
              <input type="number" min={1} max={500} value={topK} onChange={(e) => setTopK(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.top_k} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">min_p
              <input type="number" step="0.01" min={0} max={1} value={minP} onChange={(e) => setMinP(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.min_p} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">max_tokens
              <input type="number" min={32} max={8192} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.max_tokens} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">seed
              <input type="number" min={0} value={seed} onChange={(e) => setSeed(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.seed} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">frequency_penalty
              <input type="number" step="0.1" min={-2} max={2} value={frequencyPenalty} onChange={(e) => setFrequencyPenalty(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.frequency_penalty} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
            <label className="text-xs text-neutral-300">presence_penalty
              <input type="number" step="0.1" min={-2} max={2} value={presencePenalty} onChange={(e) => setPresencePenalty(Number(e.target.value))} disabled={!selectedModel?.parameterSupport.presence_penalty} className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50" />
            </label>
          </div>

          <label className="text-xs text-neutral-300">
            Stop sequence (optional)
            <input
              value={stopSequence}
              onChange={(event) => setStopSequence(event.target.value)}
              disabled={!selectedModel?.parameterSupport.stop}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100 disabled:opacity-50"
            />
          </label>

          {mode === "chat" && selectedModel?.supports.tools ? (
            <label className="text-xs text-neutral-300">
              Tool calling schema (JSON array)
              <textarea
                value={toolSchema}
                onChange={(event) => setToolSchema(event.target.value)}
                rows={8}
                className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 font-mono text-xs text-neutral-100"
              />
            </label>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-neutral-200">
            <input type="checkbox" checked={stream} onChange={(event) => setStream(event.target.checked)} />
            Enable streaming response
          </label>

          <button
            type="button"
            onClick={run}
            disabled={status === "running" || !modelId}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "running" ? "Running..." : "Run request"}
          </button>
        </div>

        <div className="space-y-3">
          <section className="rounded-xl border border-white/10 bg-black/25 p-3">
            <h2 className="mb-2 text-sm font-semibold">Streaming output</h2>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-xs text-neutral-100">
              {output || "No output yet."}
            </pre>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/25 p-3">
            <h2 className="mb-2 text-sm font-semibold">Raw JSON response</h2>
            <pre className="max-h-[280px] overflow-auto whitespace-pre-wrap text-xs text-neutral-300">
              {rawJson || "Raw response appears here for non-stream requests."}
            </pre>
          </section>

          {error ? (
            <section className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </section>
          ) : null}
        </div>
      </div>
    </section>
  );
}
