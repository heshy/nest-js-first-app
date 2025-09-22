# Multi-stage Dockerfile for NestJS (Node 22) with Prisma (PostgreSQL)

FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libc6-compat

# Builder installs deps (incl dev), builds, generates Prisma client, then prunes
FROM base AS builder
ENV NODE_ENV=development
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build
RUN npx prisma generate
RUN npm prune --omit=dev

# Runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# Prepare writable app directory and logs before switching to non-root user
RUN mkdir -p /app/logs && chown -R node:node /app
USER node
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]

# Optional migrator stage to run `prisma migrate deploy`
FROM base AS migrator
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npx prisma generate
CMD ["npx", "prisma", "migrate", "deploy"]

# Make sure the final image is the application runner (not the migrator)
FROM runner AS final
CMD ["node", "dist/main.js"]
