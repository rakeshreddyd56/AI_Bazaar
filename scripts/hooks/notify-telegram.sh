#!/usr/bin/env bash
# =============================================================================
# Telegram Notification Hook for Claude Code
#
# Setup:
# 1. Create a Telegram bot: message @BotFather → /newbot → save token
# 2. Get your chat ID: forward a message to @userinfobot
# 3. Set BOT_TOKEN and CHAT_ID below (or export as env vars)
# 4. Register this hook in ~/.claude/settings.json (see below)
#
# Hook registration (add to ~/.claude/settings.json):
# {
#   "hooks": {
#     "Stop": [{ "hooks": [{ "type": "command", "command": "scripts/hooks/notify-telegram.sh" }] }],
#     "AskUserQuestion": [{ "hooks": [{ "type": "command", "command": "scripts/hooks/notify-telegram.sh" }] }]
#   }
# }
# =============================================================================

EVENT="${CLAUDE_HOOK_EVENT:-unknown}"
BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-YOUR_BOT_TOKEN_HERE}"
CHAT_ID="${TELEGRAM_CHAT_ID:-YOUR_CHAT_ID_HERE}"
PROJECT=$(basename "$(pwd)")

# Skip if not configured
if [ "$BOT_TOKEN" = "YOUR_BOT_TOKEN_HERE" ]; then
    exit 0
fi

case "$EVENT" in
    Stop)
        MSG="*AI Bazaar* | Claude finished on \`$PROJECT\`"
        ;;
    AskUserQuestion)
        MSG="*AI Bazaar* | Claude needs input on \`$PROJECT\`"
        ;;
    Error)
        MSG="*AI Bazaar* | Claude errored on \`$PROJECT\`"
        ;;
    *)
        exit 0
        ;;
esac

curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${CHAT_ID}" \
    -d "text=${MSG}" \
    -d "parse_mode=Markdown" > /dev/null 2>&1
