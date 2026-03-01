#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# REVIEW GATE — Run a reviewer + security auditor on the current branch
# Blocks merge if critical issues found.
#
# Usage: ./scripts/review-gate.sh [base-branch]
# Example: ./scripts/review-gate.sh main
# =============================================================================

BASE_BRANCH=${1:-main}
CURRENT_BRANCH=$(git branch --show-current)

echo "=== REVIEW GATE ==="
echo "Reviewing: $CURRENT_BRANCH against $BASE_BRANCH"
echo ""

mkdir -p reviews

# --- CODE REVIEW ---
echo ">>> Running code review..."
claude -p \
    --model opus \
    --max-turns 15 \
    --allowedTools "Read,Grep,Glob,Bash(git:*),Bash(find:*),Write" \
    "You are a principal engineer conducting code review.

Run: git diff ${BASE_BRANCH}..HEAD

Review all changes against:
- docs/ARCHITECTURE.md (design compliance)
- docs/PRD.md (requirement coverage)
- CLAUDE.md (project rules)

Check for: correctness, security, performance, test coverage, code style.

Write your review to: reviews/review-${CURRENT_BRANCH}-$(date +%Y%m%d).md

Use format:
VERDICT: APPROVE | REQUEST_CHANGES | BLOCK
[Details with file:line references]"

echo ""

# --- SECURITY AUDIT ---
echo ">>> Running security audit..."
claude -p \
    --model opus \
    --max-turns 10 \
    --allowedTools "Read,Grep,Glob,Bash(git:*),Bash(npm:*),Bash(find:*),Write" \
    "You are a security engineer. Audit the changes on this branch.

Run: git diff ${BASE_BRANCH}..HEAD

Scan for: injection, auth flaws, data exposure, dependency vulns (npm audit), secrets in code, CORS issues, missing rate limits, input validation gaps.

Write your audit to: reviews/security-${CURRENT_BRANCH}-$(date +%Y%m%d).md

Use format:
RISK LEVEL: CRITICAL | HIGH | MEDIUM | LOW | CLEAN
[Findings table with file:line references]"

echo ""

# --- GATE DECISION ---
echo ">>> Checking results..."
BLOCKED=false

for review_file in reviews/*-"${CURRENT_BRANCH}"*.md; do
    if [ -f "$review_file" ]; then
        if grep -qi "^VERDICT: BLOCK\|^RISK LEVEL: CRITICAL" "$review_file"; then
            echo "BLOCKED by: $review_file"
            BLOCKED=true
        fi
    fi
done

if [ "$BLOCKED" = true ]; then
    echo ""
    echo "=== GATE FAILED — MERGE BLOCKED ==="
    echo "Review the files in reviews/ for details."
    exit 1
else
    echo ""
    echo "=== GATE PASSED — OK TO MERGE ==="
    exit 0
fi
