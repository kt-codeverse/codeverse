#!/bin/sh
set -eu

echo "[prisma-migrate] Starting resolve-and-deploy script"

try_seed() {
  echo "[prisma-migrate] Attempting seed: prisma db seed"
  if npx prisma db seed --schema=prisma/schema.prisma; then
    echo "[prisma-migrate] Seeded with 'prisma db seed'"
    return 0
  fi

  echo "[prisma-migrate] Attempting seed: npx ts-node prisma/seed.ts"
  if npx ts-node prisma/seed.ts; then
    echo "[prisma-migrate] Seeded with 'npx ts-node prisma/seed.ts'"
    return 0
  fi

  echo "[prisma-migrate] Attempting seed: node -r ts-node/register prisma/seed.ts"
  if node -r ts-node/register prisma/seed.ts; then
    echo "[prisma-migrate] Seeded with 'node -r ts-node/register prisma/seed.ts'"
    return 0
  fi

  echo "[prisma-migrate] All seed methods failed or not present; continuing without seed"
  return 1
}

if [ ! -d prisma/migrations ]; then
  echo "[prisma-migrate] No prisma/migrations directory found, running deploy directly"
  npx prisma migrate deploy --schema=prisma/schema.prisma
  try_seed || true
  echo "[prisma-migrate] Done"
  exit 0
fi

echo "[prisma-migrate] Marking filesystem migrations as applied (if needed)"
for d in prisma/migrations/*; do
  if [ -d "$d" ]; then
    name=$(basename "$d")
    if [ -n "$name" ]; then
      echo "[prisma-migrate] Trying to resolve migration: $name"
      # If resolve fails (for example already applied), ignore and continue
      npx prisma migrate resolve --applied "$name" --schema=prisma/schema.prisma || true
    fi
  fi
done

echo "[prisma-migrate] Deploying migrations"
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "[prisma-migrate] Seeding database (if seed script exists)"
try_seed || true

echo "[prisma-migrate] resolve-and-deploy finished"
