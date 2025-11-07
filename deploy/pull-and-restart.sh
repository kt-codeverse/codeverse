#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.." || exit 1

DEPLOY_DIR=~/deploy
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

echo "Pulling latest changes / files..."
# if using docker hub images: docker compose pull
docker compose pull || true

echo "Rebuilding and restarting containers"
docker compose up -d --build --remove-orphans

echo "Done."
