#!/bin/bash
set -euo pipefail

REPO_ROOT="/home/quik/Projects/Portfolio"
SERVE_SCRIPT="$REPO_ROOT/scripts/serve.py"
CLOUDFLARED_CONFIG="$REPO_ROOT/cloudflared.yml"
LOG_DIR="$REPO_ROOT/logs"

mkdir -p "$LOG_DIR"

# Start Python dev server on port 8000
if ! ss -ltn | grep -q ':8000 '; then
    nohup python3 "$SERVE_SCRIPT" > "$LOG_DIR/serve.log" 2> "$LOG_DIR/serve.err.log" &
    disown
    echo "Started Python server"
    sleep 2
else
    echo "Python server already running on port 8000"
fi

# Start Cloudflare Tunnel
if ! pgrep -f "cloudflared tunnel --config $CLOUDFLARED_CONFIG" > /dev/null; then
    if [[ -f "$CLOUDFLARED_CONFIG" ]]; then
        nohup cloudflared tunnel --config "$CLOUDFLARED_CONFIG" --edge-ip-version 4 run > "$LOG_DIR/cloudflared.log" 2> "$LOG_DIR/cloudflared.err.log" &
        disown
        echo "Started Cloudflare Tunnel"
    else
        echo "Cloudflare config not found: $CLOUDFLARED_CONFIG"
        exit 1
    fi
else
    echo "Cloudflare Tunnel already running"
fi

echo "Portfolio is now served at www.mdetamore.com"