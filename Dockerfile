# syntax=docker/dockerfile:1.4

# ─── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# ─── Stage 2: Builder ──────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ─── Stage 3: Production Runner ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 starsuser

ENV NODE_ENV=production

# Copy only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile --omit=dev

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/database ./database

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R starsuser:nodejs /app

USER starsuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "dist/server.js"]
