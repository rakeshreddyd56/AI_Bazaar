# System Architecture

## Overview
AI Bazaar is a dual-mode platform: a **Marketplace** for discovering and comparing AI models/tools, and a **Console** for managing models, API keys, and inference. It exposes an OpenAI-compatible API surface with broker-first hybrid routing (external providers first, self-hosted fallback).

## Tech Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | Node.js 20 | LTS, wide ecosystem |
| Language | TypeScript 5 (strict) | Type safety, developer experience |
| Framework | Next.js 15 (App Router, Turbopack) | SSR, API routes, file-based routing |
| Database | PostgreSQL + pgvector | Relational data + vector similarity search |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Validation | Zod 4 | Runtime type validation for API inputs |
| Testing | Vitest 1.6 + @vitest/coverage-v8 | Fast, ESM-native test runner |
| Linting | ESLint 9 | Code quality |
| UI | React 19.1 | Component model |

## System Diagram
```mermaid
graph TD
    A[Client Browser] --> B[Next.js App Router]
    B --> C[Marketplace UI]
    B --> D[Console UI]
    B --> E[API Routes]
    E --> F[/api/search - Intent + Ranking]
    E --> G[/api/v1/* - OpenAI-compatible]
    E --> H[/api/console/* - Key/Usage mgmt]
    G --> I[Inference Engine]
    I --> J[Router - Broker-first]
    J --> K[External Providers]
    J --> L[Self-hosted Fallback]
    I --> M[Quota & Rate Limiting]
    I --> N[Auth - API Key validation]
    F --> O[In-memory Store / PostgreSQL]
    H --> O
```

## Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   │   ├── v1/           # OpenAI-compatible inference APIs
│   │   ├── console/      # Console management APIs
│   │   ├── internal/     # Admin APIs
│   │   ├── search/       # Marketplace search
│   │   ├── compare/      # Model comparison
│   │   ├── listings/     # Listing details
│   │   ├── submissions/  # New tool submissions
│   │   └── reviews/      # User reviews
│   ├── console/          # Console UI pages
│   ├── listings/         # Listing detail pages
│   ├── moderation/       # Moderation dashboard
│   ├── results/          # Search results
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Marketplace home
│   └── globals.css       # Tailwind global styles
│
├── components/            # React components
│   ├── console/          # Console-specific (ApiKeysConsole, PlaygroundConsole)
│   ├── AppModeSwitch.tsx # Marketplace <-> Console toggle
│   ├── CategorySidebar.tsx
│   ├── CompareMatrix.tsx
│   ├── ResultCard.tsx
│   ├── SearchCommand.tsx
│   └── ...
│
└── lib/                   # Business logic & utilities
    ├── types.ts          # Core TypeScript types
    ├── utils.ts          # Shared helpers
    ├── branding.ts       # Provider branding resolution
    ├── categories.ts     # Category definitions
    ├── currency.ts       # INR/USD conversion
    ├── i18n.ts           # Localization (en-IN, hi-IN)
    ├── data/             # Data layer (store, seed, catalogue)
    ├── console/          # Console logic (models, status, docs, keys)
    ├── inference/        # Inference engine (router, auth, quota, tokenizer)
    ├── ingest/           # External data ingestion (OpenRouter, HuggingFace, etc.)
    ├── search/           # Search & ranking (intent detection, scoring)
    ├── health/           # Health scoring
    ├── risk/             # Risk flag assessment
    └── observability/    # Event logging
```

## Key Design Decisions
See `docs/DECISIONS.md` for Architecture Decision Records (ADRs).

### Data Layer
- **Local dev**: In-memory global store (`src/lib/data/store.ts`, `src/lib/console/store.ts`)
- **Production**: PostgreSQL with schema in `db/schema.sql`
- **Ingestion**: 8 external sources (OpenRouter, Artificial Analysis, Arena, HELM, HuggingFace, LiveBench, SWE-bench)

### Inference Engine
- **Broker-first routing**: External provider APIs preferred, self-hosted as fallback
- **Auth**: API key validation via `src/lib/inference/auth.ts`
- **Quotas**: Per-key rate limiting via `src/lib/inference/quota.ts`
- **Tokenization**: Token counting via `src/lib/inference/tokenizer.ts`

### API Contracts
- **OpenAI-compatible**: `POST /api/v1/chat/completions`, `POST /api/v1/completions`, `GET /api/v1/models`, `POST /api/v1/tokenize`
- **Console**: `GET/POST/DELETE /api/console/{models,keys,usage,status}`
- **Marketplace**: `GET /api/search`, `GET /api/compare`, `GET /api/listings/:slug`

## Data Models
See `db/schema.sql` for the full PostgreSQL schema including:
- `listings`, `reviews`, `submissions` (marketplace)
- `organizations`, `api_keys`, `model_registry`, `quota_tracking` (console/inference)
