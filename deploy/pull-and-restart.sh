echo "Pulling latest changes / files..."
echo "Rebuilding and restarting containers"
echo "Done."
#!/usr/bin/env bash
set -euo pipefail

# Resolve repository root (one level up from deploy/)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT" || exit 1

echo "Repository root: $REPO_ROOT"

# Ensure we are on the expected branch and update
echo "Fetching latest from origin/dev..."
git fetch --all --prune

# If there are local changes they will block a merge/pull. Prefer an explicit reset.
echo "Resetting working tree to origin/dev (will discard local changes)..."
git reset --hard origin/dev
git clean -fd

echo "Pulling images (if using remote images)..."
# If you're using Docker Hub images, this will pull newer images; ignore failures
docker compose pull || true

echo "Rebuilding and restarting containers"
# Use the compose file in the repository root if present
## Find a compose file to use (prefer prod, then root compose files)
COMPOSE_FILE=""
for candidate in docker-compose.prod.yml docker-compose.yml docker-compose.yaml compose.yml compose.yaml; do
	if [ -f "$REPO_ROOT/$candidate" ]; then
		COMPOSE_FILE="$candidate"
		break
	fi
done

if [ -z "$COMPOSE_FILE" ]; then
	echo "ERROR: no docker compose file found in $REPO_ROOT"
	echo "Files in $REPO_ROOT:"
	ls -la "$REPO_ROOT" || true
	exit 2
fi

echo "Using compose file: $COMPOSE_FILE"
docker compose -f "$COMPOSE_FILE" up -d --build --remove-orphans

echo "Done."
