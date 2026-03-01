#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# LAUNCH REMOTE — The Ultimate Combo
# Starts tmux with RALPH, parallel agents, monitoring, and remote control.
# Run this and walk away — check progress from your phone.
#
# Usage: ./scripts/launch-remote.sh [ralph_iterations] [model]
# Example: ./scripts/launch-remote.sh 50 sonnet
#
# Prerequisites: tmux, claude code >= 2.1.52
# =============================================================================

MAX_ITERATIONS=${1:-30}
MODEL=${2:-sonnet}
PROJECT_ROOT=$(git rev-parse --show-toplevel)
SESSION_NAME="ai-bazaar-agents"

echo "=== AI BAZAAR — LAUNCH REMOTE ==="
echo "RALPH iterations: $MAX_ITERATIONS"
echo "Model: $MODEL"
echo ""

# Kill existing session if present
tmux kill-session -t "$SESSION_NAME" 2>/dev/null || true

# Window 0: RALPH autonomous loop
echo "Starting RALPH in tmux window 0..."
tmux new-session -d -s "$SESSION_NAME" -n "ralph" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:ralph" \
    "./scripts/ralph.sh $MAX_ITERATIONS $MODEL" Enter

# Window 1: Remote control session (for phone access)
echo "Starting remote control in window 1..."
tmux new-window -t "$SESSION_NAME" -n "remote" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:remote" \
    "claude rc" Enter

# Window 2: Monitor
echo "Starting monitor in window 2..."
tmux new-window -t "$SESSION_NAME" -n "monitor" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:monitor" \
    "watch -n 5 'echo \"=== PROGRESS ===\" && tail -20 progress.txt && echo \"\" && echo \"=== TASKS ===\" && cat prd.json | jq \".[] | {id, title, passes}\" 2>/dev/null && echo \"\" && echo \"=== GIT LOG ===\" && git log --oneline -10'" Enter

# Window 3: Dashboard (optional, runs web server)
echo "Starting dashboard in window 3..."
tmux new-window -t "$SESSION_NAME" -n "dashboard" -c "$PROJECT_ROOT"
tmux send-keys -t "$SESSION_NAME:dashboard" \
    "./scripts/agent-dashboard.sh 8080" Enter

echo ""
echo "=== ALL WINDOWS LAUNCHED ==="
echo ""
echo "Windows:"
echo "  0: ralph     — RALPH autonomous loop ($MAX_ITERATIONS iterations)"
echo "  1: remote    — Remote control (scan QR code with phone)"
echo "  2: monitor   — Live progress watcher"
echo "  3: dashboard — Web dashboard at http://localhost:8080"
echo ""
echo "Attach: tmux attach -t $SESSION_NAME"
echo "Detach: Ctrl+B, D (agents keep running)"
echo "Switch: Ctrl+B, 0-3"
echo ""
echo "Attaching to tmux session..."
tmux attach -t "$SESSION_NAME"
