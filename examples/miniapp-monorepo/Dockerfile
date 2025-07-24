# Multi-stage Dockerfile for monorepo deployment

# Stage 1: Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json ./
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

# Install all workspace dependencies
RUN bun install

# Copy source code and root tsconfig  
COPY packages/ ./packages/
COPY tsconfig.json ./

# Build the client (static files)
RUN bun run build:client

# Stage 2: Production stage
FROM oven/bun:1 AS production

WORKDIR /app

# Copy package files  
COPY package.json ./
COPY packages/server/package.json ./packages/server/
COPY packages/shared/package.json ./packages/shared/

# Install only production dependencies
RUN bun install --production

# Copy server and shared source code
COPY packages/server/ ./packages/server/
COPY packages/shared/ ./packages/shared/

# Copy built client files from builder stage
COPY --from=builder /app/packages/client/dist ./packages/client/dist

# Expose the port
EXPOSE 3000

# Start the server
CMD ["bun", "--cwd", "packages/server", "src/index.ts"]