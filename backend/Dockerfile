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

FROM node:20-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built files and node_modules from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 8080
CMD ["node", "dist/main"]
