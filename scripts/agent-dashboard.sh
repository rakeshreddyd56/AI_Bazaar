#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# AGENT MONITORING DASHBOARD
# Generates and serves a live-updating web dashboard for monitoring
# multi-agent progress from your phone or browser.
#
# Usage: ./scripts/agent-dashboard.sh [port]
# Example: ./scripts/agent-dashboard.sh 8080
# Then open: http://localhost:8080 (or your-ip:8080 from phone)
# =============================================================================

PORT=${1:-8080}
PROJECT_ROOT=$(git rev-parse --show-toplevel)
DASHBOARD_DIR="${PROJECT_ROOT}/.dashboard"

mkdir -p "$DASHBOARD_DIR"

# Generate the dashboard HTML
cat > "$DASHBOARD_DIR/index.html" << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AI Bazaar — Agent Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
            background: #0f0f1a;
            color: #e0e0e0;
            padding: 16px;
            max-width: 900px;
            margin: 0 auto;
        }
        header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #2a2a4a;
        }
        header h1 {
            font-size: 1.3rem;
            color: #f3bf3e;
        }
        header .badge {
            background: #1a3a2a;
            color: #3dd9c7;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
        }
        .card {
            background: #16213e;
            border-radius: 8px;
            padding: 16px;
            margin: 12px 0;
            border: 1px solid #1a2a4e;
        }
        .card h3 {
            color: #89b4fa;
            font-size: 0.9rem;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        pre {
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 0.8rem;
            line-height: 1.5;
            color: #c0c0d0;
        }
        .pass { color: #00ff88; }
        .fail { color: #ff4444; }
        .pending { color: #f3bf3e; }
        .timestamp {
            color: #666;
            font-size: 0.7rem;
            text-align: right;
            margin-top: 8px;
        }
        .task-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
            border-bottom: 1px solid #1a2a3e;
        }
        .task-id { color: #89b4fa; }
        .refresh-note {
            text-align: center;
            color: #555;
            font-size: 0.7rem;
            margin-top: 16px;
        }
    </style>
    <meta http-equiv="refresh" content="10">
</head>
<body>
    <header>
        <h1>AI Bazaar — Agent Dashboard</h1>
        <span class="badge">LIVE</span>
    </header>

    <div class="card">
        <h3>Task Status</h3>
        <div id="tasks">
            <pre>Loading tasks from prd.json...</pre>
        </div>
    </div>

    <div class="card">
        <h3>Recent Progress</h3>
        <pre id="progress">Loading progress.txt...</pre>
    </div>

    <div class="card">
        <h3>Git Log (Last 10)</h3>
        <pre id="gitlog">Loading git log...</pre>
    </div>

    <div class="card">
        <h3>Active Agents</h3>
        <pre id="agents">Loading coordination/active-agents.json...</pre>
    </div>

    <p class="timestamp" id="updated"></p>
    <p class="refresh-note">Auto-refreshes every 10 seconds</p>

    <script>
        document.getElementById('updated').textContent = 'Last updated: ' + new Date().toLocaleTimeString();
    </script>
</body>
</html>
HTMLEOF

# Generate a data update script that runs periodically
cat > "$DASHBOARD_DIR/update.sh" << 'UPDATEEOF'
#!/usr/bin/env bash
PROJECT_ROOT=$(git rev-parse --show-toplevel)
DASH="${PROJECT_ROOT}/.dashboard"

# Update task data
if [ -f "$PROJECT_ROOT/prd.json" ]; then
    jq -r '.[] | "\(.id) | \(.title) | \(if .passes then "PASS" else "PENDING" end)"' \
        "$PROJECT_ROOT/prd.json" 2>/dev/null > "$DASH/tasks.txt" || echo "Error reading prd.json" > "$DASH/tasks.txt"
fi

# Update progress
if [ -f "$PROJECT_ROOT/progress.txt" ]; then
    tail -20 "$PROJECT_ROOT/progress.txt" > "$DASH/progress.txt"
fi

# Update git log
git -C "$PROJECT_ROOT" log --oneline -10 > "$DASH/gitlog.txt" 2>/dev/null

# Update active agents
if [ -f "$PROJECT_ROOT/coordination/active-agents.json" ]; then
    cat "$PROJECT_ROOT/coordination/active-agents.json" > "$DASH/agents.txt"
fi
UPDATEEOF
chmod +x "$DASHBOARD_DIR/update.sh"

echo "=== AI Bazaar Agent Dashboard ==="
echo "Starting on port $PORT"
echo "Open: http://localhost:$PORT"
echo "From phone (same network): http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}'):$PORT"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Serve the dashboard
cd "$DASHBOARD_DIR"
python3 -m http.server "$PORT"
