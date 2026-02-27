# AI Bazaar

AI Bazaar is an India-first AI marketplace and inference platform.

## What ships in v1.5

- Marketplace mode (discovery, compare, category browsing, risk flags, moderation)
- Console mode (Models, Playground, API Keys, Usage, Docs, Status)
- OpenAI-compatible API surface:
  - `GET /api/v1/models`
  - `POST /api/v1/chat/completions`
  - `POST /api/v1/completions`
  - `POST /api/v1/tokenize`
- Broker-first hybrid routing abstraction (external providers first, self-hosted fallback path)
- Free-tier quota and queue enforcement with zero-retention request logging defaults
- User/org API key controls (in-memory runtime for local dev)

## Stack

- Frontend/API: Next.js 15 App Router + TypeScript + Tailwind v4
- Runtime store in this repo: in-memory global state for fast iteration
- Production schema blueprint: `db/schema.sql`
- Tests: Vitest

## Quickstart

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run test
npm run build
```

## Env vars

```bash
NEXT_PUBLIC_SITE_URL=https://theaibazaar.com
ARTIFICIAL_ANALYSIS_API_KEY=
ADMIN_REVIEW_TOKEN=
API_KEY_HASH_SALT=
```

## Key URLs

- Marketplace: `/`
- Search results: `/results?q=best+video+gen+tools`
- Listing details: `/listings/[slug]`
- Moderation: `/moderation`
- Console models: `/console/models`
- Console playground: `/console/playground`

## API references

### Marketplace APIs

- `GET /api/search`
- `GET /api/compare`
- `GET /api/listings/:slug`
- `POST /api/submissions`
- `POST /api/reviews`
- `POST /api/internal/ingest/:source`
- `POST /api/internal/recompute-scores`
- `GET/PATCH /api/internal/moderation/submissions`

### Console APIs

- `GET /api/console/models`
- `GET /api/console/models/:id`
- `GET /api/console/usage`
- `GET /api/console/keys`
- `POST /api/console/keys`
- `DELETE /api/console/keys/:id`
- `GET /api/console/status`

### OpenAI-compatible Inference APIs

- `GET /api/v1/models`
- `POST /api/v1/chat/completions`
- `POST /api/v1/completions`
- `POST /api/v1/tokenize`

## Local demo key

For local development only (non-production), a seeded demo key exists:

- `aibz_demo_local_key`

Use as header:

```bash
Authorization: Bearer aibz_demo_local_key
```

## Notes

- This repo intentionally uses an in-memory operational store for rapid iteration.
- `db/schema.sql` includes both marketplace tables and v1.5 console/inference tables for production migration planning.
