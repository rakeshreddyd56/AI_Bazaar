---
name: project-conventions
description: Project-specific coding conventions, patterns, and standards
globs: ["src/**/*.ts", "src/**/*.tsx"]
---

## Naming Conventions
- Files: kebab-case (`user-service.ts`)
- Classes: PascalCase (`UserService`)
- Functions: camelCase (`getUserById`)
- Constants: SCREAMING_SNAKE (`MAX_RETRY_COUNT`)
- Types/Interfaces: PascalCase with `I` prefix for interfaces (`IUserRepository`)
- Test files: `{name}.test.ts` in `__tests__/` subdirectory
- React components: PascalCase file names (`ResultCard.tsx`)

## Import Conventions
- Always use the `@/*` path alias (maps to `src/*`)
- Group imports: external packages, then internal modules, then relative imports

## Error Handling Pattern
Always use typed errors:
```typescript
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
// Usage: throw new AppError("User not found", "USER_NOT_FOUND", 404);
```

## API Route Pattern (Next.js App Router)
```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";

const querySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().positive().default(20),
});

export async function GET(req: NextRequest) {
  const params = querySchema.safeParse(
    Object.fromEntries(req.nextUrl.searchParams)
  );
  if (!params.success) {
    return NextResponse.json({ error: params.error.message }, { status: 400 });
  }
  // ... implementation
  return NextResponse.json({ data: result });
}
```

## Test Pattern (Vitest)
```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("UserService", () => {
  let service: UserService;
  let mockRepo: { findById: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRepo = { findById: vi.fn(), create: vi.fn() };
    service = new UserService(mockRepo);
  });

  describe("getById", () => {
    it("should return user when found", async () => {
      mockRepo.findById.mockResolvedValue(mockUser);
      const result = await service.getById("123");
      expect(result).toEqual(mockUser);
    });

    it("should throw AppError when user not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getById("123")).rejects.toThrow(AppError);
    });
  });
});
```

## Component Pattern
```typescript
interface ResultCardProps {
  title: string;
  provider: string;
  riskLevel?: "watchlist" | "high";
}

export function ResultCard({ title, provider, riskLevel }: ResultCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{provider}</p>
      {riskLevel && <span className="text-red-500">{riskLevel}</span>}
    </div>
  );
}
```
