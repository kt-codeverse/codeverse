FROM node:20-alpine AS builder
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_KAKAO_MAP_KEY
# Use `/app` to match existing build context and previous images
WORKDIR /app

# Install deps (ensure devDependencies like TypeScript are available for build)
COPY package*.json ./
# Force install devDependencies in builder to allow transpiling `next.config.ts` during build
RUN npm ci --silent --include=dev

# Copy source and build
COPY . .
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_KAKAO_MAP_KEY=$NEXT_PUBLIC_KAKAO_MAP_KEY
RUN npm run build

FROM node:20-alpine AS runner
# Match builder working dir to avoid path mismatch during COPY
WORKDIR /app
ENV NODE_ENV=production

# Copy production artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
