#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# RALPH — Autonomous Claude Code Loop
# Reads prd.json, picks the next task, implements it, tests it, commits it.
# Fresh context every iteration prevents degradation.
#
# Usage: ./scripts/ralph.sh [max_iterations] [model]
# Example: ./scripts/ralph.sh 50 opus
# =============================================================================

MAX_ITERATIONS=${1:-30}
MODEL=${2:-sonnet}
ITERATION=0
PROJECT_ROOT=$(git rev-parse --show-toplevel)
LOG_FILE="${PROJECT_ROOT}/ralph.log"

echo "=== RALPH STARTED: $(date) | Max iterations: $MAX_ITERATIONS | Model: $MODEL ===" | tee -a "$LOG_FILE"

while [ "$ITERATION" -lt "$MAX_ITERATIONS" ]; do
    ITERATION=$((ITERATION + 1))
    echo "" | tee -a "$LOG_FILE"
    echo "--- Iteration $ITERATION/$MAX_ITERATIONS | $(date) ---" | tee -a "$LOG_FILE"

    OUTPUT=$(claude -p \
        --model "$MODEL" \
        --max-turns 25 \
        --allowedTools "Read,Write,Edit,MultiEdit,Bash,Grep,Glob" \
        "You are one engineer in a relay team. Each iteration you get a FRESH context.

READ THESE FILES FIRST (in order):
1. prd.json — the task list with pass/fail status
2. progress.txt — what previous iterations accomplished
3. docs/ARCHITECTURE.md — system design constraints
4. CLAUDE.md — project rules (MUST follow)

YOUR JOB THIS ITERATION:
1. Find the first task in prd.json where \"passes\": false and all dependencies have \"passes\": true
2. If no eligible task exists, write RALPH_COMPLETE to stdout and stop
3. Implement ONLY that one task
4. Run: npm test
5. Run: npm run lint && npx tsc --noEmit
6. If ALL checks pass:
   - Update prd.json: set \"passes\": true for this task
   - Update docs/TASKS.md: set status to \"tested\"
   - Append one line to progress.txt: \"[TASK-ID] [timestamp] [summary]\"
   - Commit: git add -A && git commit -m \"feat(TASK-ID): [description]\"
7. If checks FAIL:
   - Fix the issues and retry (up to 3 attempts)
   - If still failing after 3 attempts, add a note to prd.json and move on
   - Append failure note to progress.txt

CRITICAL RULES:
- ONE task per iteration. Do not touch other tasks.
- Small, atomic commits. One logical change per commit.
- Do not modify tasks that already pass.
- If you are unsure about architecture, read docs/ARCHITECTURE.md again.
- Write RALPH_COMPLETE (exactly) when all tasks pass." 2>&1) || true

    echo "$OUTPUT" | tail -20 | tee -a "$LOG_FILE"

    if echo "$OUTPUT" | grep -q "RALPH_COMPLETE"; then
        echo "" | tee -a "$LOG_FILE"
        echo "=== RALPH COMPLETE: All tasks done! $(date) ===" | tee -a "$LOG_FILE"
        exit 0
    fi

    # Cooldown to avoid rate limits
    sleep 3
done

echo "=== RALPH REACHED MAX ITERATIONS ($MAX_ITERATIONS). Review progress.txt ===" | tee -a "$LOG_FILE"
exit 1
