# Use Bun as the base image for better performance
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy only necessary files for the monorepo
COPY package.json bun.lock ./
COPY packages/ ./packages/

# Copy the pre-built embed-typescript package to the workspace root
COPY ../../embed-typescript-built ./embed-typescript

# Install dependencies for the entire workspace
RUN bun install --frozen-lockfile

# Build stage for client
FROM base as build

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the client
WORKDIR /app/packages/client
RUN bun run build

# Production stage
FROM oven/bun:1-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy only necessary files for production
COPY --from=build --chown=bun:nodejs /app/package.json ./
COPY --from=build --chown=bun:nodejs /app/packages/server ./packages/server
COPY --from=build --chown=bun:nodejs /app/packages/shared ./packages/shared
COPY --from=build --chown=bun:nodejs /app/packages/client/dist ./packages/client/dist
COPY --from=build --chown=bun:nodejs /app/embed-typescript ./embed-typescript

# Install only production dependencies
RUN bun install --production

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
