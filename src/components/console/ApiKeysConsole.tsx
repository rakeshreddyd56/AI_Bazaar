"use client";

import { useMemo, useState } from "react";
import type { ApiKeyRecord } from "@/lib/types";

type Props = {
  initialKeys: ApiKeyRecord[];
};

export function ApiKeysConsole({ initialKeys }: Props) {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(initialKeys);
  const [label, setLabel] = useState("Automation Key");
  const [scopes, setScopes] = useState("models:read,inference:chat,inference:completions");
  const [createdKey, setCreatedKey] = useState("");
  const [status, setStatus] = useState("");

  const parsedScopes = useMemo(
    () =>
      scopes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [scopes],
  );

  const refresh = async () => {
    const response = await fetch("/api/console/keys", { cache: "no-store" });
    const payload = await response.json();
    if (Array.isArray(payload.keys)) {
      setKeys(payload.keys);
    }
  };

  const create = async () => {
    setStatus("Creating key...");
    setCreatedKey("");

    const response = await fetch("/api/console/keys", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        label,
        scopes: parsedScopes,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error ?? "Failed to create key.");
      return;
    }

    setCreatedKey(payload.plaintextKey ?? "");
    setStatus("Key created. Store it securely.");
    await refresh();
  };

  const revoke = async (keyId: string) => {
    setStatus(`Revoking ${keyId}...`);

    const response = await fetch(`/api/console/keys/${keyId}`, {
      method: "DELETE",
    });

    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error ?? "Failed to revoke key.");
      return;
    }

    setStatus(`Revoked ${keyId}`);
    await refresh();
  };

  return (
    <section className="space-y-4">
      <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h1 className="text-xl font-semibold">API Keys</h1>
        <p className="text-sm text-neutral-400">
          Create/revoke personal or org-scoped keys. Plaintext key is shown once at creation.
        </p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Create key</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs text-neutral-300">
            Label
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
            />
          </label>
          <label className="text-xs text-neutral-300">
            Scopes (comma separated)
            <input
              value={scopes}
              onChange={(event) => setScopes(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-sm text-neutral-100"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={create}
          className="mt-3 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
        >
          Create key
        </button>

        {createdKey ? (
          <div className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3">
            <p className="text-xs text-emerald-200">Copy and store now. It will not be shown again.</p>
            <code className="mt-1 block rounded bg-black/30 p-2 text-xs text-emerald-100">{createdKey}</code>
          </div>
        ) : null}

        {status ? <p className="mt-2 text-xs text-neutral-300">{status}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Existing keys</h2>

        <div className="space-y-2">
          {keys.map((key) => (
            <article key={key.id} className="rounded-xl border border-white/10 bg-black/25 p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-neutral-100">{key.label}</p>
                  <p className="text-xs text-neutral-400">
                    {key.prefix}... • {key.status} • created {new Date(key.createdAt).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-xs text-neutral-300">Scopes: {key.scopes.join(", ")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => revoke(key.id)}
                  disabled={key.status !== "active"}
                  className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200 disabled:opacity-50"
                >
                  Revoke
                </button>
              </div>
            </article>
          ))}

          {keys.length === 0 ? (
            <p className="text-sm text-neutral-400">No keys yet.</p>
          ) : null}
        </div>
      </section>
    </section>
  );
}
