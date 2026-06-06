#!/usr/bin/env bash
# Wrapper so gcloud works from Git Bash on Windows (optional local helper).
#
# Setup:
#   cp scripts/gcloud.example.sh scripts/gcloud.sh
#   chmod +x scripts/gcloud.sh   # Git Bash / macOS / Linux
#
# Usage:
#   bash scripts/gcloud.sh auth login
#   bash scripts/gcloud.sh auth application-default login

set -euo pipefail

if command -v gcloud >/dev/null 2>&1; then
  exec gcloud "$@"
fi

if command -v gcloud.cmd >/dev/null 2>&1; then
  exec gcloud.cmd "$@"
fi

# Common Windows Cloud SDK install path (edit scripts/gcloud.sh if yours differs)
WIN_GCLOUD="${LOCALAPPDATA:-}/Google/Cloud SDK/google-cloud-sdk/bin/gcloud.cmd"
if [ -f "$WIN_GCLOUD" ]; then
  exec "$WIN_GCLOUD" "$@"
fi

echo "gcloud not found in PATH."
echo "Install: winget install Google.CloudSDK"
echo "Or copy this file to scripts/gcloud.sh and set your gcloud.cmd path."
exit 1