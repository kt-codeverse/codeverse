### Frontend (Next.js) multi-stage Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --progress=false

# copy everything and build
COPY . .
RUN npm run build

### Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production deps in the runner to avoid copying devDependencies from the builder
# Copy package manifests and install production dependencies, then copy build output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./
RUN npm ci --production --prefer-offline --no-audit --progress=false

# copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# drop privileges: run as non-root 'node' user provided by the official image
RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["npm", "start"]
