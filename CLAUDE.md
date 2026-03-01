# Project Configuration

## Identity
- Project: AI Bazaar
- Stack: TypeScript 5, Next.js 15 (App Router), PostgreSQL + pgvector, Tailwind CSS v4, Vitest
- Node: >= 20 | Package Manager: npm

## Critical Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
- Type Check: `npx tsc --noEmit`

## IMPORTANT: Read Before Every Session
1. Read `docs/TASKS.md` — find your assigned task or pick the highest-priority unblocked task
2. Read `docs/ARCHITECTURE.md` — understand the system before changing it
3. Read `docs/PRD.md` — understand the requirements before implementing
4. Check `progress.txt` — see what other agents have done recently

## IMPORTANT: Do Before Every Commit
1. Run `npm test` — all tests must pass
2. Run `npm run lint` — no lint errors
3. Run `npx tsc --noEmit` — no type errors
4. Update `docs/TASKS.md` — mark your task status
5. Append to `progress.txt` — one-line summary of what you did
6. Commit with conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`

## Architecture Rules — DO NOT VIOLATE
- NEVER modify migration files that have been committed
- NEVER store secrets in code — use environment variables
- NEVER bypass TypeScript strict mode
- NEVER delete another agent's in-progress work
- All new files MUST have corresponding test files
- All API endpoints MUST have Zod input validation
- Database queries MUST use parameterized statements
- Next.js App Router conventions: use `route.ts` for API routes, `page.tsx` for pages
- Use the `@/*` path alias (maps to `src/*`) for all imports

## Multi-Agent Coordination Rules
- Check `coordination/active-agents.json` before starting work
- Register yourself when starting: append your agent name and task
- Deregister when done: remove your entry
- If two agents conflict on the same file, the one registered FIRST has priority
- Use git worktrees for parallel work: `claude --worktree <branch-name>`
- NEVER force-push. Use `--force-with-lease` if rebasing

## File Ownership Boundaries
- `/src/app/api/`, `/src/lib/inference/`, `/src/lib/ingest/` — backend agent territory
- `/src/app/` (non-api routes), `/src/components/` — frontend agent territory
- `/src/lib/` (shared utilities, types, data, search, health, risk) — requires coordination (check active-agents.json)
- `__tests__/` directories — tester agent territory, coders may add but not modify existing
- `/db/` — requires coordination, never modify committed migrations
- `/docs/` — any agent may update their relevant sections

## Style & Conventions
- Use the project's existing patterns. Read 2-3 similar files before creating new ones.
- Prefer composition over inheritance
- Prefer explicit over implicit
- Error messages must be actionable
- Use Zod schemas for all external input validation
- In-memory store for local dev, PostgreSQL for production
