# Architecture Decision Records

## ADR-001: Next.js 15 App Router with Turbopack
- **Date:** 2026-02-28
- **Status:** Accepted
- **Context:** AI Bazaar needs a full-stack framework supporting SSR, API routes, and fast development iteration for both marketplace UI and OpenAI-compatible inference endpoints.
- **Decision:** Use Next.js 15 with App Router and Turbopack for both the frontend and API layer.
- **Consequences:** Unified codebase for UI and API. Turbopack provides fast dev rebuilds. App Router enables React Server Components and streaming. Lock-in to Vercel ecosystem for optimal deployment.
- **Alternatives Considered:** Separate frontend (Vite + React) and backend (Express/Fastify) — rejected due to increased complexity and deployment overhead for a single-team project.

## ADR-002: In-memory Store for Local Development
- **Date:** 2026-02-28
- **Status:** Accepted
- **Context:** Development iteration speed is critical. Setting up PostgreSQL locally adds friction for contributors.
- **Decision:** Use in-memory global stores (`src/lib/data/store.ts`, `src/lib/console/store.ts`) for local development, with PostgreSQL schema (`db/schema.sql`) for production.
- **Consequences:** Zero-setup local development. Data resets on server restart. Production schema must be kept in sync manually. Seeding logic needed for realistic local data.
- **Alternatives Considered:** SQLite for local dev — rejected because pgvector extension is needed for similarity search and SQLite doesn't support it.

## ADR-003: Broker-first Hybrid Routing
- **Date:** 2026-02-28
- **Status:** Accepted
- **Context:** AI Bazaar needs to route inference requests to multiple providers with fallback capability.
- **Decision:** Use broker-first routing — try external provider APIs first, fall back to self-hosted models only when external providers are unavailable.
- **Consequences:** Lower infrastructure costs (no need to host all models). Dependency on external provider availability. Need provider health monitoring.
- **Alternatives Considered:** Self-hosted only — rejected due to GPU infrastructure costs. External only — rejected due to single point of failure.
