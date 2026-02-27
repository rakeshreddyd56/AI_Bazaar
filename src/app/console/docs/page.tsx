import { curlExamples, endpointDocs, integrationGuides, sdkExamples } from "@/lib/console/docs";

export default function ConsoleDocsPage() {
  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h1 className="text-xl font-semibold">Docs</h1>
        <p className="text-sm text-neutral-400">
          OpenAI-compatible API references and integration guides for common AI developer tools.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Endpoints</h2>
        <div className="space-y-2">
          {endpointDocs.map((endpoint) => (
            <article key={endpoint.path} className="rounded-xl border border-white/10 bg-black/25 p-3">
              <p className="text-sm font-semibold text-neutral-100">
                <span className="mr-2 rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-200">{endpoint.method}</span>
                {endpoint.path}
              </p>
              <p className="mt-1 text-xs text-neutral-300">{endpoint.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-200">cURL examples</h2>
          <pre className="mb-2 overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-neutral-200">{curlExamples.listModels}</pre>
          <pre className="mb-2 overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-neutral-200">{curlExamples.chat}</pre>
          <pre className="mb-2 overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-neutral-200">{curlExamples.completion}</pre>
          <pre className="overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-neutral-200">{curlExamples.tokenize}</pre>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-2 text-sm font-semibold text-neutral-200">SDK quickstarts</h2>
          <p className="mb-1 text-xs font-semibold text-neutral-300">JavaScript</p>
          <pre className="mb-3 overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-neutral-200">{sdkExamples.javascript}</pre>
          <p className="mb-1 text-xs font-semibold text-neutral-300">Python</p>
          <pre className="overflow-auto rounded-lg bg-black/30 p-2 text-[11px] text-neutral-200">{sdkExamples.python}</pre>
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Integrations</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {integrationGuides.map((guide) => (
            <article key={guide.name} className="rounded-xl border border-white/10 bg-black/25 p-3">
              <h3 className="text-sm font-semibold text-neutral-100">{guide.name}</h3>
              <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs text-neutral-300">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
