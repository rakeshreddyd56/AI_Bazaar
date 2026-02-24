# AI Bazaar

AI Bazaar is an India-first AI discovery marketplace for the latest models and tools.

V1 focuses on:
- Natural-language discovery (`best video gen tools`, `best SVG generation tools/models`)
- Granular side-by-side comparisons (capability, pricing, benchmarks, limits)
- Health meter for setup/safety/compliance risk
- Open submissions + editorial moderation queue
- Bilingual interface (`en-IN`, `hi-IN`)

## Stack

- Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- API layer: Next.js Route Handlers
- Data (v1 local runtime): in-memory store seeded with curated listings
- Schema target (production): Neon Postgres + `pgvector` in [db/schema.sql](/Users/rakeshreddy/Downloads/AI-Bazaar/db/schema.sql)
- Queue/cache target (production): Upstash Redis + QStash
- Observability hooks: structured logs (`src/lib/observability/events.ts`)

## Quickstart

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run test
npm run build
```

## Environment Variables

Create `.env.local` as needed:

```bash
# Optional: enables Artificial Analysis ingest endpoint
ARTIFICIAL_ANALYSIS_API_KEY=

# Optional: protects internal moderation API in production
ADMIN_REVIEW_TOKEN=
```

## Core URLs

- Home: `/`
- Results: `/results?q=best+video+gen+tools`
- Listing detail: `/listings/[slug]`
- Submission + moderation UI: `/moderation`

## API Endpoints (V1)

- `GET /api/search?q=...&persona=builder|business|research&locale=en-IN|hi-IN&intent=...`
- `GET /api/compare?ids=id1,id2,...`
- `GET /api/listings/:slug?locale=en-IN|hi-IN`
- `POST /api/submissions`
- `POST /api/reviews` (requires `x-user-id` header)
- `POST /api/internal/ingest/:source?apply=true&verify=true`
- `POST /api/internal/recompute-scores`
- `GET/PATCH /api/internal/moderation/submissions`

## Data Source Mapping

Connectors implemented in `src/lib/ingest/*`:
- OpenRouter models API
- Hugging Face trending API
- SWE-bench leaderboard extraction
- LiveBench datasets-server ingestion
- Artificial Analysis ingestion (API key gated)
- Arena/HELM secondary placeholders (manual/low frequency)

## Ranking + Health Logic

Search ranking blends:
- Capability fit
- Benchmark quality
- Recency
- Cost efficiency
- Reliability
- Popularity
- Health penalty

Health meter dimensions:
- Setup complexity
- Safety/misuse risk
- License/compliance risk

All health scoring is deterministic for a fixed listing payload.

## Moderation Flow

- New submissions are always created as `pending`
- Public search only includes `published + verified` listings
- Editorial queue in `/moderation` can approve/reject submissions
- Internal ingest imports are unverified by default unless explicitly marked `verify=true`

## Notes

- Current v1 runtime store is intentionally in-memory for rapid iteration.
- `db/schema.sql` is the production persistence blueprint for Neon/Postgres.
