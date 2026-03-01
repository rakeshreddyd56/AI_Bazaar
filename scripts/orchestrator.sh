#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# MULTI-AGENT ORCHESTRATOR
# Spawns parallel Claude Code agents in separate tmux panes, each in its own
# git worktree, with clear task boundaries. Agents coordinate via filesystem.
#
# Usage: ./scripts/orchestrator.sh
# Prerequisites: tmux, claude code >= 2.1.50
# =============================================================================

PROJECT_ROOT=$(git rev-parse --show-toplevel)
SESSION_NAME="claude-agents"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# --- CONFIGURATION ---
# Define your agents and their tasks here.
# Format: "AGENT_NAME|BRANCH_NAME|TASK_DESCRIPTION|AGENT_FILE"
AGENTS=(
    "architect|agent/architect-${TIMESTAMP}|Read docs/PRD.md and create/update docs/ARCHITECTURE.md with complete system design, data models, and API contracts. Then update docs/TASKS.md to break the PRD into implementable tasks.|architect"
    "coder-1|agent/coder1-${TIMESTAMP}|Read docs/TASKS.md. Pick the first P0 task in backlog that has NO dependencies. Implement it fully with tests. Mark it as review when done.|coder"
    "coder-2|agent/coder2-${TIMESTAMP}|Read docs/TASKS.md. Pick the SECOND P0 task in backlog that has NO dependencies (different from coder-1). Implement it fully with tests. Mark it as review when done.|coder"
    "tester|agent/tester-${TIMESTAMP}|Read docs/TASKS.md. Find all tasks with status review. Write additional edge-case tests and run the full test suite. Update status to tested or failed.|tester"
)

echo "=== MULTI-AGENT ORCHESTRATOR ==="
echo "Session: $SESSION_NAME"
echo "Agents: ${#AGENTS[@]}"
echo ""

# Kill existing session if present
tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true

# Create tmux session with first agent
FIRST_AGENT="${AGENTS[0]}"
IFS='|' read -r NAME BRANCH TASK AGENT_FILE <<< "$FIRST_AGENT"
echo "Setting up: $NAME on branch $BRANCH"

# Create worktree and start first agent
git worktree add -b "$BRANCH" ".worktrees/$NAME" HEAD 2>/dev/null || true
tmux new-session -d -s "$SESSION_NAME" -n "$NAME" -c "$PROJECT_ROOT/.worktrees/$NAME"
tmux send-keys -t "$SESSION_NAME:$NAME" \
    "claude --agent-file .claude/agents/${AGENT_FILE}.md -p \"$TASK\"" Enter

# Create remaining agents in split panes
for ((i=1; i<${#AGENTS[@]}; i++)); do
    IFS='|' read -r NAME BRANCH TASK AGENT_FILE <<< "${AGENTS[$i]}"
    echo "Setting up: $NAME on branch $BRANCH"

    git worktree add -b "$BRANCH" ".worktrees/$NAME" HEAD 2>/dev/null || true
    tmux new-window -t "$SESSION_NAME" -n "$NAME" -c "$PROJECT_ROOT/.worktrees/$NAME"
    tmux send-keys -t "$SESSION_NAME:$NAME" \
        "claude --agent-file .claude/agents/${AGENT_FILE}.md -p \"$TASK\"" Enter
done

echo ""
echo "=== ALL AGENTS LAUNCHED ==="
echo "Monitor: tmux attach -t $SESSION_NAME"
echo "Switch panes: Ctrl+B then window number (0-${#AGENTS[@]})"
echo ""
echo "When agents finish:"
echo "  1. Review each branch: git log agent/..."
echo "  2. Merge: git merge --no-ff agent/..."
echo "  3. Clean up: git worktree remove .worktrees/NAME"
echo ""
echo "Attaching to tmux session..."
tmux attach -t "$SESSION_NAME"
