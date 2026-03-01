#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# AGENT TEAMS LAUNCHER
# Uses Claude Code's experimental Agent Teams feature for inter-agent messaging.
# Requires: CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
#
# Usage: ./scripts/spawn-team.sh [team-size] [task-description]
# Example: ./scripts/spawn-team.sh 4 "Build the authentication module"
# =============================================================================

TEAM_SIZE=${1:-3}
TASK=${2:-"Read docs/PRD.md and docs/TASKS.md. Implement all P0 tasks."}

export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

echo "=== SPAWNING AGENT TEAM ==="
echo "Team size: $TEAM_SIZE"
echo "Task: $TASK"
echo ""

claude -p \
    --max-turns 100 \
    "You are the TEAM LEAD coordinating $TEAM_SIZE agents.

FIRST, read these files to understand the project:
- CLAUDE.md (project rules)
- docs/PRD.md (requirements)
- docs/ARCHITECTURE.md (system design)
- docs/TASKS.md (current task status)

YOUR MISSION: $TASK

TEAM COORDINATION PROTOCOL:
1. Create a plan: break the work into $TEAM_SIZE parallel streams
2. Spawn teammates with clear, non-overlapping assignments:
   - Each teammate gets specific files/modules to own
   - Each teammate gets 3-5 concrete tasks
   - Include the CLAUDE.md rules in each teammate's briefing
3. Monitor progress via teammate messages
4. When all teammates report done:
   - Spawn a REVIEWER teammate to check all work
   - Spawn a TESTER teammate to run the full test suite
5. If reviewer finds issues: send fix requests to the relevant teammate
6. When review passes and tests pass:
   - Update docs/TASKS.md with final status
   - Update progress.txt with team summary
   - Commit all work
   - Report completion

CRITICAL:
- Ensure NO two teammates modify the same file
- If shared files need changes, sequence those tasks (use dependencies)
- Prefer 3-5 teammates. More is not always better.
- Each teammate should have 5-6 tasks maximum."
