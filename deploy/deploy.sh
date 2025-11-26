#!/usr/bin/env bash
set -euo pipefail
# Simple deploy script for EC2: pulls images and restarts docker compose
# Usage: deploy.sh [--compose-dir DIR] [--tag TAG]

COMPOSE_DIR="$HOME/codeverse"
TAG="latest"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --compose-dir)
      COMPOSE_DIR="$2"; shift 2;;
    --tag)
      TAG="$2"; shift 2;;
    --help|-h)
      echo "Usage: $0 [--compose-dir DIR] [--tag TAG]"; exit 0;;
    *)
      echo "Unknown arg: $1"; exit 1;;
  esac
done

echo "Deploying from $COMPOSE_DIR with tag=$TAG"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker not found on PATH" >&2
  exit 2
fi

if [ ! -d "$COMPOSE_DIR" ]; then
  echo "Compose directory not found: $COMPOSE_DIR" >&2
  exit 3
fi

cd "$COMPOSE_DIR"

echo "Pulling images (ignoring failures if any)..."
# pull latest tags defined in compose file
docker compose pull --ignore-pull-failures

echo "Starting containers..."
docker compose up -d --remove-orphans

echo "Containers status:"
docker compose ps

echo "Deploy finished at $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
