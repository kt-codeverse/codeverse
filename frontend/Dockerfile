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

# copy node_modules and build output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
