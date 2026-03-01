# Remote Control & Monitoring Setup

## Overview
Monitor and control AI Bazaar's Claude Code agents from your phone. Five options from simplest to most powerful.

---

## Option 1: Native Remote Control (Recommended Start)

**Requirements:** Claude Code >= 2.1.52, Claude Pro/Max plan

```bash
# Update Claude Code
npm install -g @anthropic-ai/claude-code@latest

# Start a remote session
claude remote-control   # or: claude rc

# OR make an existing session remote (mid-conversation)
# Type: /rc
```

This gives you a **session URL** and **QR code** — open on your phone's browser or scan with the Claude mobile app.

### Persistent with tmux
```bash
tmux new-session -s claude-work
claude remote-control
# Detach: Ctrl+B, D
# Reattach later: tmux attach -t claude-work
```

### Combined with RALPH
```bash
# Terminal 1: RALPH in tmux
tmux new-session -s ralph-session
./scripts/ralph.sh 50 sonnet
# Detach: Ctrl+B, D

# Terminal 2: Remote control for monitoring
cd /Users/rakeshreddy/Downloads/AI-Bazaar
claude rc
# Scan QR with phone
```

---

## Option 2: Telegram Notifications

### 2A: Full Bidirectional (CCBot)
```bash
brew install tmux
pip install ccbot-claude

# Configure (see scripts/hooks/notify-telegram.sh for env vars)
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
export TMUX_SESSION_NAME="claude-agents"

ccbot start
```

### 2B: Simple Push Notifications
Uses the hook script at `scripts/hooks/notify-telegram.sh`. Configure your bot token and chat ID in the script, then register hooks in your user-level Claude Code settings.

### 2C: Oh My ClaudeCode (Multi-platform)
```bash
npm install -g oh-my-claudecode
# Configure: see scripts/hooks/omc-config-template.json
omc
```

---

## Option 3: Slack Bridge
```bash
npm install -g claude-nonstop
claude-nonstop setup
claude-nonstop --remote-access
```

---

## Option 4: VPS (Always-On)
```bash
# On your VPS (Ubuntu 24.04, 4GB RAM, ~$10/mo)
sudo apt update && sudo apt install -y tmux git nodejs npm mosh
npm install -g @anthropic-ai/claude-code
claude /login
git clone <your-repo>
cd ai-bazaar
tmux new-session -s agents
claude rc
# Detach: Ctrl+B, D
```

Access from phone via:
- **Native Remote Control** — bookmark the session URL
- **Termux (Android)** — `mosh user@vps-ip` then `tmux attach -t agents`
- **Blink Shell (iOS)** — `mosh user@vps-ip` then `tmux attach -t agents`

Uses `scripts/hooks/notify-ntfy.sh` for push notifications via ntfy.

---

## Option 5: Monitoring Dashboard

Use `scripts/agent-dashboard.sh` to start a local web dashboard, or use tmux + watch:

```bash
tmux new-window -t agents -n "monitor"
watch -n 5 'tail -20 progress.txt && echo "---" && cat prd.json | jq ".[] | {id, title, passes}" && echo "---" && git log --oneline -10'
```

---

## Quick Reference

| Scenario | Option | Cost |
|----------|--------|------|
| Check from phone sometimes | Native Remote Control | Free (Pro/Max) |
| Push notifications | Telegram hook | Free |
| Full bidirectional Telegram | CCBot | Free |
| Team monitoring | Slack bridge | Free |
| 24/7 always-on | VPS | ~$10/mo |

---

## The Ultimate Combo

```bash
# Use scripts/launch-remote.sh for the full setup:
./scripts/launch-remote.sh
```

This starts tmux with RALPH, a parallel agent, a monitor window, and remote control — all in one command.
