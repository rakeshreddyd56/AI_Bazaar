# Product Requirements Document

## Product Overview
**Product Name:** AI Bazaar
**Version:** 0.1.0
**Last Updated:** 2026-02-28
**Status:** Draft

## Problem Statement
India's AI ecosystem lacks a unified marketplace for discovering, comparing, and accessing AI models and tools. Developers and businesses need a single platform that provides transparent risk assessment, pricing in INR, and an OpenAI-compatible inference API — reducing the friction of evaluating and integrating AI capabilities.

## Goals & Success Metrics
| Goal | Metric | Target |
|------|--------|--------|
| AI model discovery | Listings in catalogue | 100+ models |
| Developer adoption | API keys created | 500 in first quarter |
| Inference reliability | API uptime | 99.5% |
| Search relevance | Intent detection accuracy | > 90% |

## User Stories

### US-001: [Story Title]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] AC-1: [Specific, testable criterion]
- [ ] AC-2: [Specific, testable criterion]
- [ ] AC-3: [Specific, testable criterion]

**Priority:** P0 (Must Have) | P1 (Should Have) | P2 (Nice to Have)

### US-002: [Story Title]
[Repeat pattern...]

## Technical Constraints
- Must run on Node.js >= 20
- Response time < 200ms for API calls
- Must support PostgreSQL 15+ with pgvector extension
- Must be deployable via Vercel or Docker
- OpenAI-compatible API surface (chat/completions, completions, models)
- Zod validation on all external inputs
- Support INR and USD currency display

## Out of Scope
- [What we are explicitly NOT building]
- [Features deferred to future versions]

## Open Questions
- [ ] [Question that needs answering before implementation]
