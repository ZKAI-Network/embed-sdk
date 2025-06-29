# Use Bun as the base image for better performance
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lock ./
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build stage for client
FROM base as build

# Build the client
WORKDIR /app/packages/client
RUN bun run build

# Production stage
FROM oven/bun:1-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy built client assets
COPY --from=build --chown=bun:nodejs /app/packages/client/dist ./packages/client/dist

# Copy server source and dependencies
COPY --from=build --chown=bun:nodejs /app/packages/server ./packages/server
COPY --from=build --chown=bun:nodejs /app/packages/shared ./packages/shared
COPY --from=build --chown=bun:nodejs /app/package.json /app/bun.lock ./

# Install only production dependencies
RUN bun install --frozen-lockfile --production

# Switch to non-root user
USER bun

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --cwd packages/server run health || exit 1

# Start the server
ENTRYPOINT ["dumb-init", "--"]
CMD ["bun", "--cwd", "packages/server", "src/index.ts"] 
