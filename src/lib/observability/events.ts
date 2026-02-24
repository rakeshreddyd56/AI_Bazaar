type EventPayload = Record<string, string | number | boolean | null | undefined>;

export const logEvent = (name: string, payload: EventPayload = {}) => {
  const line = JSON.stringify({
    level: "info",
    event: name,
    payload,
    ts: new Date().toISOString(),
  });

  // Server-friendly structured logs (ready for Datadog/GCP/Axiom parsers).
  console.log(line);
};
