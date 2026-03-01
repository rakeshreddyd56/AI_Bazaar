#!/usr/bin/env bash
# =============================================================================
# ntfy Push Notification Hook for Claude Code
#
# ntfy is a free, open-source push notification service.
# Install the ntfy app on your phone and subscribe to your topic.
#
# Setup:
# 1. Choose a topic name (e.g., "ai-bazaar-agents")
# 2. Set NTFY_TOPIC below (or export as env var)
# 3. On your phone: install ntfy app → subscribe to your topic
# 4. Register this hook in ~/.claude/settings.json
#
# For self-hosted ntfy, change NTFY_SERVER below.
# =============================================================================

EVENT="${CLAUDE_HOOK_EVENT:-unknown}"
PROJECT=$(basename "$(pwd)")
NTFY_TOPIC="${NTFY_TOPIC:-ai-bazaar-agents}"
NTFY_SERVER="${NTFY_SERVER:-https://ntfy.sh}"

# Only notify during remote/SSH sessions (optional — remove this check for always-on)
# [ -z "$SSH_CONNECTION" ] && [ -z "$MOSH_CONNECTION" ] && exit 0

case "$EVENT" in
    Stop)
        TITLE="Done: $PROJECT"
        PRIORITY="default"
        TAGS="white_check_mark"
        ;;
    AskUserQuestion)
        TITLE="Need input: $PROJECT"
        PRIORITY="high"
        TAGS="question"
        ;;
    Error)
        TITLE="Error: $PROJECT"
        PRIORITY="urgent"
        TAGS="x"
        ;;
    *)
        exit 0
        ;;
esac

curl -s \
    -d "$TITLE" \
    -H "Title: Claude Code — AI Bazaar" \
    -H "Priority: $PRIORITY" \
    -H "Tags: $TAGS" \
    "${NTFY_SERVER}/${NTFY_TOPIC}" > /dev/null 2>&1
