#!/bin/sh
set -eux

echo "[prisma-migrate] Starting resolve-and-deploy script"

# This script is now simplified. It assumes the DB is either fresh
# or needs migrations. It deploys migrations and then runs the seed.

echo "[prisma-migrate] Deploying migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

echo "[prisma-migrate] Waiting 5 seconds for database to settle..."
sleep 5

echo "[prisma-migrate] Seeding database with 'ts-node'..."
npx ts-node --compiler-options '{"module": "CommonJS"}' prisma/seed.ts

echo "[prisma-migrate] resolve-and-deploy finished"
