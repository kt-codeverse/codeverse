### Backend (Nest) multi-stage Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# copy package manifests first for better cache
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --progress=false

# copy source and build
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma client (needed for @prisma/client types/enums)
RUN npx prisma generate

RUN npm run build

### Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# install production deps only
COPY package.json package-lock.json* ./
RUN npm ci --production --prefer-offline --no-audit --progress=false

# copy built artifacts
COPY --from=builder /app/dist ./dist
 
# copy generated Prisma client from builder (contains enums and runtime)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "dist/main"]
