FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
# Ensure Prisma schema is included so `prisma generate` can run
# (some .dockerignore setups may exclude the prisma folder; add explicit copy)
COPY prisma ./prisma
## generate Prisma client (ensure schema.prisma exists under prisma/)
RUN npx prisma generate || true
RUN npm run build
# Compile prisma/seed.ts to a CommonJS JS file so it can be executed reliably at runtime
# This produces prisma/seed.js next to the TS file. If tsc is not available this step is
# allowed to fail without breaking the build (hence the || true), but for correct seeding
# ensure devDependencies (tsc) are installed in the builder stage.
RUN npx tsc prisma/seed.ts --module commonjs --outDir prisma || true

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built files and node_modules from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
# Copy prisma schema into runtime image so migrations/CLI can access it
COPY --from=builder /usr/src/app/prisma ./prisma

EXPOSE 8080
CMD ["node", "dist/main"]
