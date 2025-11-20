#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/add-gh-secrets.sh [owner/repo]
# Requires: gh CLI authenticated locally (gh auth login)

REPO="${1:-}"
KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_ed25519}"

if [ ! -f "$KEY_PATH" ]; then
  echo "Private key not found at $KEY_PATH"
  exit 1
fi

PRIVATE_KEY="$(cat "$KEY_PATH")"

gh_set() {
  name="$1"
  value="$2"
  if [ -n "$REPO" ]; then
    gh secret set "$name" --repo "$REPO" --body "$value"
  else
    gh secret set "$name" --body "$value"
  fi
}

echo "Adding GitHub Actions secrets"

# Replace or override defaults below as needed
gh_set SSH_PRIVATE_KEY "$PRIVATE_KEY"
gh_set SSH_HOST "54.116.28.243"
gh_set SSH_USER "deploy"
gh_set SSH_PORT "22"
gh_set REMOTE_DOCKER_COMPOSE_DIR "/home/deploy/codeverse"

echo "Done. Verify with:"
if [ -n "$REPO" ]; then
  echo "  gh secret list --repo $REPO"
else
  echo "  gh secret list"
fi
